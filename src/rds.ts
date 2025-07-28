import {
  aws_iam as iam, aws_ec2 as ec2, aws_sns as sns, aws_cloudwatch_actions as cw_actions,
  aws_sns_subscriptions as sns_subs, Tags, aws_rds as rds, Duration, RemovalPolicy, CfnOutput, Token,
} from 'aws-cdk-lib';
import { ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';
import { ObjToStrMap } from './utils/common';

export enum ResourceType {
  NEW,
  EXISTING,
}

export interface ingressRule {
  peer: ec2.IPeer | ec2.ISecurityGroup;
  connection: ec2.Port;
  description?: string;
  remoteRule?: boolean;
}

export interface internalRole {
  readonly type: ResourceType;
  readonly roleProps?: iam.RoleProps;
  readonly roleArn?: string;
}

interface Network {
  vpcId: string;
  subnetsId: string[];
  existingSecurityGroupId?: string;
  ingressSgRule?: ingressRule[];
}
interface parameters {
  [key: string]: string;
}

interface ReadReplica {
  replicas: number;
  instanceType: ec2.InstanceType;
  parameters?: parameters;
}

export interface PostgresProps {
  publiclyAccessible?: boolean;
  clusterName: string;
  network: Network;
  instanceType: ec2.InstanceType;
  databaseName: string;
  databaseMasterUserName: string;
  postgresVersion: rds.IInstanceEngine;
  multiAz?: boolean;
  allocatedStorage?: number;
  maxAllocatedStorage?: number;
  storageType?: rds.StorageType;
  backupRetention?: number;
  deletionProtection?: boolean;
  readReplicas?: ReadReplica;
  parameters?: parameters;
  enablePerformanceInsights?: boolean;
  performanceInsightRetention?: rds.PerformanceInsightRetention;
  monitoringInterval?: number;
  alertSubcriptionWebhook?: string;
  metricTopicName?: string;
  snsTopicCreate?: boolean;
  storageEncrypted?: boolean;
  tags?: Record<string, string>;
}

export class PostgresRDSCluster extends Construct {
  securityGroup: ec2.ISecurityGroup;
  metricSnsTopic?: sns.ITopic;
  readReplicas: rds.DatabaseInstanceReadReplica[] = [];
  constructor(scope: Construct, id: string, props: PostgresProps) {
    super(scope, id);
    const tags: Map<string, string> = props.tags ? ObjToStrMap(props.tags) : new Map();
    const vpc = ec2.Vpc.fromLookup(this, `Import${props.clusterName}Vpc`, {
      vpcId: props.network.vpcId,
    });
    // SecurityGroup
    this.securityGroup = props.network.existingSecurityGroupId ? ec2.SecurityGroup.fromLookupById(this, `${props.clusterName}-sg`, props.network.existingSecurityGroupId) : new ec2.SecurityGroup(this, `${props.clusterName}-sg`, {
      vpc: vpc,
      securityGroupName: `${props.clusterName}-sg`,
    });
    if (props.network.existingSecurityGroupId == undefined) {
      tags.forEach((v, k) => {
        Tags.of(this.securityGroup).add(k, v);
      });
      this.securityGroup.connections.allowInternally(ec2.Port.allTraffic());
    }
    props.network.ingressSgRule?.forEach((rule) => {
      if (rule.peer instanceof ec2.SecurityGroup) {
        this.securityGroup.connections.allowFrom({
          connections: new ec2.Connections({
            securityGroups: [rule.peer],
          }),
        }, rule.connection, rule.description);
      } else {
        this.securityGroup.addIngressRule(rule.peer, rule.connection, rule.description, rule.remoteRule);
      }
    });

    const subnets = props.network.subnetsId.map(subnetId => ec2.Subnet.fromSubnetId(this, subnetId, subnetId));
    const dbSubnetGroup = new rds.SubnetGroup(this, `${props.clusterName}SubnetGroup`, {
      description: 'description',
      vpc: vpc,
      vpcSubnets: {
        subnets,
      },
    });
    tags.forEach((v, k) => {
      Tags.of(dbSubnetGroup).add(k, v);
    });

    const monitoringRole = new iam.Role(this, `${props.clusterName}MonitoringRole`, {
      assumedBy: new iam.ServicePrincipal('monitoring.rds.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, `${props.clusterName}MonitoringPolicy`, 'arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole'),
      ],
    });
    const parameterGroup = new rds.ParameterGroup(this, `${props.clusterName}ParameterGroup`, {
      engine: props.postgresVersion,
      parameters: props.parameters,
    });
    const rdsInstance = new rds.DatabaseInstance(this, `${props.clusterName}Cluster`,
      {
        vpc,
        subnetGroup: dbSubnetGroup,
        engine: props.postgresVersion,
        instanceIdentifier: props.clusterName,
        instanceType: props.instanceType,
        securityGroups: [this.securityGroup],
        credentials: rds.Credentials.fromGeneratedSecret(props.databaseMasterUserName),
        multiAz: props.multiAz,
        allocatedStorage: props.allocatedStorage,
        maxAllocatedStorage: props.maxAllocatedStorage,
        storageType: props.storageType ? props.storageType : rds.StorageType.GP2,
        enablePerformanceInsights: props.enablePerformanceInsights,
        performanceInsightRetention: props.performanceInsightRetention,
        allowMajorVersionUpgrade: false,
        autoMinorVersionUpgrade: false,
        parameterGroup: parameterGroup,
        backupRetention: props.backupRetention ? Duration.days(props.backupRetention) : Duration.days(0),
        deleteAutomatedBackups: true,
        monitoringRole: monitoringRole,
        monitoringInterval: props.monitoringInterval ? Duration.seconds(props.monitoringInterval) : undefined,
        removalPolicy: RemovalPolicy.SNAPSHOT,
        deletionProtection: props.deletionProtection,
        databaseName: props.databaseName,
        publiclyAccessible: props.publiclyAccessible,
        cloudwatchLogsExports: ['postgresql'],
        storageEncrypted: props.storageEncrypted ?? false,
        copyTagsToSnapshot: true,
      });
    tags.forEach((v, k) => {
      Tags.of(rdsInstance).add(k, v);
    });
    if (props.alertSubcriptionWebhook) {
      this.metricSnsTopic = new sns.Topic(this, `${props.clusterName}`, {
        displayName: `clusrer rds ${props.clusterName} Alarm Topic`,
        topicName: props.metricTopicName ?? `${props.clusterName}`,
      });
      this.metricSnsTopic.addSubscription(new sns_subs.UrlSubscription(Token.asString(props.alertSubcriptionWebhook), {
        protocol: sns.SubscriptionProtocol.HTTPS,
      }));
    }

    if (props.readReplicas) {
      const readReplicaParameterGroup = props.readReplicas.parameters ? new rds.ParameterGroup(this, `${props.clusterName}ParameterGroupReadReplica`, {
        engine: props.postgresVersion,
        parameters: props.parameters,
      }): parameterGroup;
      for (let index = 0; index < props.readReplicas.replicas; index++) {
        let readReplics = new rds.DatabaseInstanceReadReplica(this, `${props.clusterName}-rreplicas-${index}`, {
          sourceDatabaseInstance: rdsInstance,
          instanceIdentifier: `${props.clusterName}-rreplicas-${index}`,
          instanceType: props.readReplicas.instanceType,
          enablePerformanceInsights: props.enablePerformanceInsights,
          performanceInsightRetention: props.performanceInsightRetention,
          monitoringRole: monitoringRole,
          parameterGroup: readReplicaParameterGroup,
          securityGroups: [this.securityGroup],
          monitoringInterval: props.monitoringInterval ? Duration.seconds(props.monitoringInterval) : undefined,
          vpc,
        });
        tags.forEach((v, k) => {
          Tags.of(readReplics).add(k, v);
        });
        //CPU Metrics and Alert and Subscription for replica
        let rdsCPUUtilizationMetricRead = readReplics.metricCPUUtilization({
          period: Duration.minutes(5),
        });
        let rdsCPUUtilizationAlertRead = rdsCPUUtilizationMetricRead.createAlarm(this, `${props.clusterName}-rreplicas-${index}-cpu-90-alert`, {
          evaluationPeriods: 2,
          alarmName: `${props.clusterName}-rreplicas-${index}-cpu-90`,
          alarmDescription: 'Cluster cpu Over 90 Percent',
          threshold: 90,
        });
        if (this.metricSnsTopic != undefined) {
          rdsCPUUtilizationAlertRead.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
        }

        //Free Storage Metrics and Alert and Subscription for replica
        let rdsFreeStorageMetricRead = readReplics.metricFreeStorageSpace({
          period: Duration.minutes(5),
        });
        let rdsInstanceFreeStorageAlertRead = rdsFreeStorageMetricRead.createAlarm(this, `${props.clusterName}-rreplicas-${index}-freespace-10-alert`, {
          evaluationPeriods: 2,
          alarmName: `${props.clusterName}-rreplicas-${index}-freespace-10`,
          alarmDescription: 'Cluster ReadReplica Storage Free Less than 10GB',
          comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
          threshold: 10737418240,
        });
        if (this.metricSnsTopic != undefined) {
          rdsInstanceFreeStorageAlertRead.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
        }

        //Free Memory Metrics and Alert and Subscription for replica
        let rdsFreeMemoryMetricRead = readReplics.metricFreeableMemory({
          period: Duration.minutes(5),
        });
        let rdsFreeMemoryAlertRead = rdsFreeMemoryMetricRead.createAlarm(this, `${props.clusterName}-rreplicas-${index}-memory-10-alert`, {
          evaluationPeriods: 2,
          alarmName: `${props.clusterName}-rreplicas-${index}-memory-10`,
          comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: 'Cluster ReadReplica Memory Free Less than 2GB',
          threshold: 2147483648,
        });
        if (this.metricSnsTopic != undefined) {
          rdsFreeMemoryAlertRead.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
        }

        // ReadIOPS Metrics and Alert for Read Replica
        let rdsReadIOPSMetricRead = readReplics.metric('ReadIOPS', {
          period: Duration.minutes(5),
        });
        let rdsReadIOPSAlertRead = rdsReadIOPSMetricRead.createAlarm(this, `${props.clusterName}-rreplicas-${index}-readiops-1000-alert`, {
          evaluationPeriods: 5,
          alarmName: `${props.clusterName}-rreplicas-${index}-readiops-1000`,
          comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: 'Cluster ReadReplica ReadIOPS Greater than 1000',
          threshold: 1000,
        });
        if (this.metricSnsTopic != undefined) {
          rdsReadIOPSAlertRead.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
        }

        // WriteIOPS Metrics and Alert for Read Replica
        let rdsWriteIOPSMetricRead = readReplics.metric('WriteIOPS', {
          period: Duration.minutes(5),
        });
        let rdsWriteIOPSAlertRead = rdsWriteIOPSMetricRead.createAlarm(this, `${props.clusterName}-rreplicas-${index}-writeiops-2000-alert`, {
          evaluationPeriods: 5,
          alarmName: `${props.clusterName}-rreplicas-${index}-writeiops-2000`,
          comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: 'Cluster ReadReplica WriteIOPS Greater than 2000',
          threshold: 2000,
        });
        if (this.metricSnsTopic != undefined) {
          rdsWriteIOPSAlertRead.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
        }

        // Disk Queue Depth Metrics and Alert for Read Replica
        let rdsDiskQueueDepthMetricRead = readReplics.metric('DiskQueueDepth', {
          period: Duration.minutes(5),
        });
        let rdsDiskQueueDepthAlertRead = rdsDiskQueueDepthMetricRead.createAlarm(this, `${props.clusterName}-rreplicas-${index}-diskqueuedepth-5-alert`, {
          evaluationPeriods: 5,
          alarmName: `${props.clusterName}-rreplicas-${index}-diskqueuedepth-5`,
          comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: 'Cluster ReadReplica Disk Queue Depth Greater than 5',
          threshold: 5,
        });
        if (this.metricSnsTopic != undefined) {
          rdsDiskQueueDepthAlertRead.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
        }

        // Replica Lag Metrics and Alert and Subscription for replica
        let replicaLagMetricRead = readReplics.metric('ReplicaLag', {
          statistic: 'Average',
          period: Duration.minutes(5),
        });
        let replicaLagAlertRead = replicaLagMetricRead.createAlarm(this, `${props.clusterName}-rreplicas-${index}-replicalag-30sec-alert`, {
          evaluationPeriods: 2,
          alarmName: `${props.clusterName}-rreplicas-${index}-replicalag-30sec`,
          comparisonOperator: ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
          alarmDescription: 'Cluster ReplicaLag is greater than 30sec',
          threshold: 30000,
        });
        if (this.metricSnsTopic != undefined) {
          replicaLagAlertRead.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
        }
        this.readReplicas.push(readReplics);
      }
    }

    //CPU Metrics and Alert and Subscription for primary
    const rdsCPUUtilizationMetric = rdsInstance.metricCPUUtilization({
      period: Duration.minutes(5),
    });
    const rdsCPUUtilizationAlert = rdsCPUUtilizationMetric.createAlarm(this, `${props.clusterName}-cpu-90-alert`, {
      evaluationPeriods: 2,
      alarmName: `${props.clusterName}-cpu-90`,
      alarmDescription: 'Cluster cpu Over 90 Percent',
      threshold: 90,
    });
    if (this.metricSnsTopic != undefined) {
      rdsCPUUtilizationAlert.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }

    //Free Storage Metrics and Alert and Subscription for primary
    const rdsFreeStorageMetric = rdsInstance.metricFreeStorageSpace({
      period: Duration.minutes(5),
    });
    const rdsInstanceFreeStorageAlert = rdsFreeStorageMetric.createAlarm(this, `${props.clusterName}-freespace-10-alert`, {
      evaluationPeriods: 2,
      alarmName: `${props.clusterName}-freespace-10`,
      alarmDescription: 'Cluster Storage Free Less than 10GB',
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      threshold: 10737418240,
    });
    if (this.metricSnsTopic != undefined) {
      rdsInstanceFreeStorageAlert.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }

    //Free Memory Metrics and Alert and Subscription for primary
    const rdsFreeMemoryMetric = rdsInstance.metricFreeableMemory({
      period: Duration.minutes(5),
    });
    const rdsFreeMemoryAlert = rdsFreeMemoryMetric.createAlarm(this, `${props.clusterName}-memory-10-alert`, {
      evaluationPeriods: 2,
      alarmName: `${props.clusterName}-memory-10`,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: 'Cluster Memory Free Less than 2GB',
      threshold: 2147483648,
    });
    if (this.metricSnsTopic != undefined) {
      rdsFreeMemoryAlert.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
    // Volume Read IOPS Metrics and Alert for primary
    const ReadIOPSMetric = rdsInstance.metric('ReadIOPS', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });
    const ReadIOPSAlert = ReadIOPSMetric.createAlarm(this, `${props.clusterName}-read-iops-1000-alert`, {
      evaluationPeriods: 2,
      alarmName: `${props.clusterName}-read-iops-1000`,
      alarmDescription: 'Db Instance Read IOPS exceeds 1000',
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 1000,
    });
    if (this.metricSnsTopic != undefined) {
      ReadIOPSAlert.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }

    // Volume Write IOPS Metrics and Alert for primary
    const WriteIOPSMetric = rdsInstance.metric('WriteIOPS', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });
    const WriteIOPSAlert = WriteIOPSMetric.createAlarm(this, `${props.clusterName}-write-iops-2000-alert`, {
      evaluationPeriods: 2,
      alarmName: `${props.clusterName}-write-iops-2000`,
      alarmDescription: 'Db Instance Write IOPS exceeds 2000',
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 2000,
    });
    if (this.metricSnsTopic != undefined) {
      WriteIOPSAlert.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }

    // Disk Queue Depth Metrics and Alert for primary
    const diskQueueDepthMetric = rdsInstance.metric('DiskQueueDepth', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });
    const diskQueueDepthAlert = diskQueueDepthMetric.createAlarm(this, `${props.clusterName}-disk-queue-depth-5-alert`, {
      evaluationPeriods: 5,
      alarmName: `${props.clusterName}-disk-queue-depth-5`,
      alarmDescription: 'Cluster Disk Queue Depth exceeds 5',
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: 5,
    });
    if (this.metricSnsTopic != undefined) {
      diskQueueDepthAlert.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }

    new CfnOutput(this, `${props.clusterName}dbEndpoint`, {
      value: rdsInstance.instanceEndpoint.hostname,
    });

    new CfnOutput(this, `${props.clusterName}SecretName`, {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      value: rdsInstance.secret?.secretName!,
    });
  }
}