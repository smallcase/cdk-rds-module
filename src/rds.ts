import {
  aws_iam as iam, aws_ec2 as ec2, aws_sns as sns,
  Tags, aws_rds as rds, Duration, RemovalPolicy, CfnOutput,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AlertThresholds, RDSMonitoring } from './monitoring';
import { ObjToStrMap } from './utils/common';
import { StorageType } from 'aws-cdk-lib/aws-rds';
import { DeletionProtectionCheck } from 'aws-cdk-lib/aws-appconfig';

export enum ResourceType {
  NEW,
  EXISTING,
}

export interface IngressRule {
  readonly peer: ec2.IPeer | ec2.ISecurityGroup;
  readonly connection: ec2.Port;
  readonly description?: string;
  readonly remoteRule?: boolean;
}

export interface InternalRole {
  readonly type: ResourceType;
  readonly roleProps?: iam.RoleProps;
  readonly roleArn?: string;
}

export interface Network {
  readonly vpcId: string;
  readonly subnetsId: string[];
  readonly existingSecurityGroupId?: string;
  readonly ingressSgRule?: IngressRule[];
}

export interface ReadReplica {
  readonly replicas: number;
  readonly instanceType: ec2.InstanceType;
  readonly parameters?: Record<string, string>;
  readonly alertThresholds?: AlertThresholds;
}

export interface PostgresProps {
  readonly publiclyAccessible?: boolean;
  readonly clusterName: string;
  readonly network: Network;
  readonly instanceType: ec2.InstanceType;
  readonly databaseName: string;
  readonly databaseMasterUserName: string;
  readonly postgresVersion: rds.IInstanceEngine;
  readonly multiAz?: boolean;
  readonly allocatedStorage?: number;
  readonly maxAllocatedStorage?: number;
  readonly replicaAllocatedStorage?: number
  readonly replicaMaxAllocatedStorage?: number
  readonly storageType?: rds.StorageType;
  readonly backupRetention?: number;
  readonly deletionProtection?: boolean;
  readonly readReplicas?: ReadReplica;
  readonly parameters?: Record<string, string>;
  readonly enablePerformanceInsights?: boolean;
  readonly performanceInsightRetention?: rds.PerformanceInsightRetention;
  readonly monitoringInterval?: number;
  readonly alertSubcriptionWebhooks?: string[]; // Array of webhook URLs for different integrations
  readonly metricTopicName?: string;
  readonly snsTopicCreate?: boolean;
  readonly storageEncrypted?: boolean;
  readonly allowMajorVersionUpgrade?: boolean;
  readonly autoMinorVersionUpgrade?: boolean;
  readonly dbIOPS?: number;
  readonly tags?: Record<string, string>;
  readonly enableAlerts?: boolean; // Flag to enable/disable all alerts (default: true)
  // Custom alert thresholds
  readonly primaryAlertThresholds?: AlertThresholds;
  readonly replicaAlertThresholds?: AlertThresholds;
  readonly snapshotIdentifier?: string;
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
    const commonInstanceProps = {
      instanceIdentifier: props.clusterName,
      instanceType: props.instanceType,
      vpc,
      subnetGroup: dbSubnetGroup,
      securityGroups: [this.securityGroup],
      parameterGroup: parameterGroup,
      publiclyAccessible: props.publiclyAccessible,
      multiAz: props.multiAz,
      monitoringRole: monitoringRole,
      monitoringInterval: props.monitoringInterval ? Duration.seconds(props.monitoringInterval) : undefined,
      enablePerformanceInsights: props.enablePerformanceInsights,
      performanceInsightRetention: props.performanceInsightRetention,
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.SNAPSHOT,
      deletionProtection: props.deletionProtection ?? true,
      cloudwatchLogsExports: ['postgresql'],
      copyTagsToSnapshot: true,
      allocatedStorage: props.allocatedStorage,
      maxAllocatedStorage: props.maxAllocatedStorage,
      StorageType: props.storageType,
      allowMajorVersionUpgrade: props.allowMajorVersionUpgrade ?? false,
      autoMinorVersionUpgrade: props.autoMinorVersionUpgrade ?? false,
      iops: props.dbIOPS,
    };
    const rdsInstance = props.snapshotIdentifier ? new rds.DatabaseInstanceFromSnapshot(this, `${props.clusterName}Cluster`, {
      ...commonInstanceProps,
      engine: props.postgresVersion,
      credentials: rds.SnapshotCredentials.fromGeneratedSecret(props.databaseMasterUserName),
      snapshotIdentifier: props.snapshotIdentifier,
    }): new rds.DatabaseInstance(this, `${props.clusterName}Cluster`, {
      ...commonInstanceProps,
      engine: props.postgresVersion,
      credentials: rds.Credentials.fromGeneratedSecret(props.databaseMasterUserName),
      backupRetention: props.backupRetention ? Duration.days(props.backupRetention) : Duration.days(0),
      storageEncrypted: props.storageEncrypted ?? false,
      databaseName: props.databaseName,
    });
    tags.forEach((v, k) => {
      Tags.of(rdsInstance).add(k, v);
    });

    // Create monitoring nested stack
    const monitoring = new RDSMonitoring(this, 'RDSMonitoringStack', {
      clusterName: props.clusterName,
      instanceType: props.instanceType,
      backupRetention: props.backupRetention,
      multiAz: props.multiAz,
      readReplicas: props.readReplicas ? {
        replicas: props.readReplicas.replicas,
        instanceType: props.readReplicas.instanceType,
        alertThresholds: props.readReplicas.alertThresholds,
      } : undefined,
      primaryAlertThresholds: props.primaryAlertThresholds,
      replicaAlertThresholds: props.replicaAlertThresholds,
      alertSubcriptionWebhooks: props.alertSubcriptionWebhooks,
      metricTopicName: props.metricTopicName,
      enableAlerts: props.enableAlerts,
    });

    // Store the SNS topic reference
    this.metricSnsTopic = monitoring.metricSnsTopic;

    // Create primary instance monitoring
    monitoring.createPrimaryMonitoring(rdsInstance);

    if (props.readReplicas) {
      const readReplicaParameterGroup = props.readReplicas.parameters ? new rds.ParameterGroup(this, `${props.clusterName}ParameterGroupReadReplica`, {
        engine: props.postgresVersion,
        parameters: props.readReplicas.parameters,
      }): parameterGroup;
      for (let index = 0; index < props.readReplicas.replicas; index++) {
        let readReplics = new rds.DatabaseInstanceReadReplica(this, `${props.clusterName}-rreplicas-${index}`, {
          sourceDatabaseInstance: rdsInstance,
          subnetGroup: dbSubnetGroup,
          deletionProtection: props.deletionProtection,
          storageEncrypted: props.storageEncrypted,
          storageType: props.storageType,
          autoMinorVersionUpgrade: props.allowMajorVersionUpgrade ?? false,
          allocatedStorage: props.replicaAllocatedStorage ?? props.allocatedStorage,
          maxAllocatedStorage: props.replicaMaxAllocatedStorage ?? props.maxAllocatedStorage,
          instanceIdentifier: `${props.clusterName}-rreplicas-${index}`,
          instanceType: props.readReplicas.instanceType,
          enablePerformanceInsights: props.enablePerformanceInsights,
          performanceInsightRetention: props.performanceInsightRetention,
          monitoringRole: monitoringRole,
          securityGroups: [this.securityGroup],
          monitoringInterval: props.monitoringInterval ? Duration.seconds(props.monitoringInterval) : undefined,
          vpc,
          parameterGroup: readReplicaParameterGroup,
        });

        // Apply tags to read replica instances
        tags.forEach((v, k) => {
          Tags.of(readReplics).add(k, v);
        });

        // Create replica monitoring
        monitoring.createReplicaMonitoring(readReplics, index);
        this.readReplicas.push(readReplics);
      }
    }

    new CfnOutput(this, `${props.clusterName}Endpoint`, {
      value: rdsInstance.instanceEndpoint.hostname,
      description: 'RDS Instance Endpoint',
    });

    new CfnOutput(this, `${props.clusterName}Port`, {
      value: rdsInstance.instanceEndpoint.port.toString(),
      description: 'RDS Instance Port',
    });

    new CfnOutput(this, `${props.clusterName}SecurityGroupId`, {
      value: this.securityGroup.securityGroupId,
      description: 'RDS Security Group ID',
    });
  }
}