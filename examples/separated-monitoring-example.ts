import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { PostgresRDSCluster } from '../src/rds';
import { RDSMonitoring, AlertThresholds } from '../src/monitoring';

export class SeparatedMonitoringExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Example VPC (you would typically use an existing VPC)
    const vpc = new ec2.Vpc(this, 'ExampleVPC', {
      maxAzs: 2,
    });

    // Example custom alert thresholds
    const primaryThresholds: AlertThresholds = {
      cpu: 75,           // 75% CPU threshold
      memory: 3221225472, // 3GB memory threshold
      readIops: 1500,    // 1500 read IOPS
      writeIops: 3000,   // 3000 write IOPS
      dbConnections: 85, // 85% of max connections
      diskQueueDepth: 8, // 8 disk queue depth
      freeStorage: 16106127360, // 15GB free storage
      networkThroughput: 2097152, // 2MB/s network throughput
      replicationLag: 45000, // 45 seconds replication lag
    };

    const replicaThresholds: AlertThresholds = {
      cpu: 80,           // 80% CPU threshold for replicas
      memory: 2147483648, // 2GB memory threshold
      readIops: 2000,    // 2000 read IOPS
      writeIops: 1000,   // 1000 write IOPS (replicas have less write activity)
      dbConnections: 70, // 70% of max connections
      diskQueueDepth: 6, // 6 disk queue depth
      freeStorage: 10737418240, // 10GB free storage
      networkThroughput: 1572864, // 1.5MB/s network throughput
      replicationLag: 60000, // 60 seconds replication lag
    };

    // Create RDS cluster with monitoring configuration
    const rdsCluster = new PostgresRDSCluster(this, 'ExampleRDSCluster', {
      clusterName: 'example-cluster',
      network: {
        vpcId: vpc.vpcId,
        subnetsId: vpc.privateSubnets.map(subnet => subnet.subnetId),
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      databaseName: 'exampledb',
      databaseMasterUserName: 'admin',
      postgresVersion: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14_7 }),
      multiAz: true,
      allocatedStorage: 100,
      backupRetention: 7,
      enablePerformanceInsights: true,
      performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT,
      storageEncrypted: true,
      readReplicas: {
        replicas: 2,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.MEDIUM),
        alertThresholds: replicaThresholds,
      },
      primaryAlertThresholds: primaryThresholds,
      replicaAlertThresholds: replicaThresholds,
      // Monitoring configuration
      alertSubcriptionWebhooks: [
        'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
        'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/YOUR_INTEGRATION_KEY/',
        'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
      ],
      metricTopicName: 'example-rds-alerts',
    });

    // Create separate monitoring nested stack
    const monitoring = new RDSMonitoring(this, 'RDSMonitoringStack', {
      clusterName: 'example-cluster',
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      backupRetention: 7,
      multiAz: true,
      readReplicas: {
        replicas: 2,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.MEDIUM),
        alertThresholds: replicaThresholds,
      },
      primaryAlertThresholds: primaryThresholds,
      replicaAlertThresholds: replicaThresholds,
      alertSubcriptionWebhooks: [
        'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
        'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/YOUR_INTEGRATION_KEY/',
        'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
      ],
      metricTopicName: 'example-rds-alerts',
    });

    // Create primary instance monitoring
    // Note: In a real implementation, you would pass the actual RDS instance
    // This is just for demonstration
    // monitoring.createPrimaryMonitoring(primaryInstance);

    // Create replica monitoring
    // Note: In a real implementation, you would pass the actual replica instances
    // This is just for demonstration
    // for (let i = 0; i < 2; i++) {
    //   monitoring.createReplicaMonitoring(replicaInstance, i);
    // }

    // Output the SNS topic ARN
    new cdk.CfnOutput(this, 'MonitoringSNSTopicArn', {
      value: monitoring.metricSnsTopic?.topicArn || 'No SNS topic created',
      description: 'SNS Topic ARN for RDS monitoring alerts',
    });
  }
} 