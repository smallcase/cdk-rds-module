import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PostgresRDSCluster } from '../src/rds';
import { AlertThresholds } from '../src/monitoring';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class CustomThresholdsRDSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Example VPC (replace with your actual VPC ID)
    const vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', {
      vpcId: 'vpc-12345678',
    });

    // Example subnets (replace with your actual subnet IDs)
    const subnets = ['subnet-12345678', 'subnet-87654321'];

    // Webhook URLs for different integrations
    const alertSubcriptionWebhooks = [
      'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/your-zenduty-webhook/',
      'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK',
      'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
      // Add more webhooks as needed
    ];

    // Custom thresholds for primary instance (more conservative for production)
    const primaryThresholds: AlertThresholds = {
      cpu: 75,                    // Alert at 75% instead of default 80%
      memory: 3221225472,         // Alert when free memory < 3GB instead of 2GB
      readIops: 800,              // Alert at 800 IOPS instead of 1000
      writeIops: 1500,            // Alert at 1500 IOPS instead of 2000
      dbConnections: 70,          // Alert at 70% connections instead of 80%
      diskQueueDepth: 3,          // Alert at 3 instead of 5
      freeStorage: 21474836480,   // Alert when free storage < 20GB instead of 10GB
      networkThroughput: 2097152, // Alert at 2MB/s instead of 1MB/s
      replicationLag: 15000,      // Alert at 15 seconds instead of 30 seconds
    };

    // Custom thresholds for read replicas (more lenient since they're read-only)
    const replicaThresholds: AlertThresholds = {
      cpu: 85,                    // Higher CPU tolerance for read replicas
      memory: 1610612736,         // Alert when free memory < 1.5GB
      readIops: 1200,             // Higher read IOPS tolerance
      writeIops: 500,             // Lower write IOPS threshold (minimal writes)
      dbConnections: 60,          // Lower connection threshold
      diskQueueDepth: 4,          // Slightly higher disk queue tolerance
      freeStorage: 10737418240,   // Same as default (10GB)
      networkThroughput: 1048576, // Same as default (1MB/s)
      replicationLag: 60000,      // Higher replication lag tolerance (60 seconds)
    };

    // Create RDS cluster with custom thresholds
    const rdsCluster = new PostgresRDSCluster(this, 'ProductionRDS', {
      clusterName: 'production-postgres',
      network: {
        vpcId: vpc.vpcId,
        subnetsId: subnets,
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
      databaseName: 'production_db',
      databaseMasterUserName: 'admin',
      postgresVersion: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_4,
      }),
      multiAz: true,
      allocatedStorage: 100,
      maxAllocatedStorage: 200,
      storageType: rds.StorageType.GP3,
      backupRetention: 7,
      deletionProtection: true,
      enablePerformanceInsights: true,
      performanceInsightRetention: rds.PerformanceInsightRetention.DEFAULT,
      monitoringInterval: 60,
      storageEncrypted: true,
      // Webhook integrations
      alertSubcriptionWebhooks: alertSubcriptionWebhooks,
      // Custom alert thresholds
      primaryAlertThresholds: primaryThresholds,
      // Read replicas with custom thresholds
      readReplicas: {
        replicas: 2,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.MEDIUM),
        alertThresholds: replicaThresholds, // Override replica-specific thresholds
      },
      tags: {
        Environment: 'production',
        Service: 'database',
        Team: 'platform',
      },
    });

    // Output the SNS topic ARN for reference
    if (rdsCluster.metricSnsTopic) {
      new cdk.CfnOutput(this, 'RDSAlertsTopicArn', {
        value: rdsCluster.metricSnsTopic.topicArn,
        description: 'SNS Topic ARN for RDS alerts (connected to Zenduty)',
      });
    }
  }
}

// Usage examples for different scenarios:

/*
1. Development Environment (More Lenient Thresholds):
```typescript
const devThresholds: AlertThresholds = {
  cpu: 90,                    // Higher CPU tolerance
  memory: 1073741824,         // Alert only when < 1GB free
  readIops: 1500,             // Higher IOPS tolerance
  writeIops: 3000,            // Higher write tolerance
  dbConnections: 90,          // Higher connection tolerance
  diskQueueDepth: 8,          // Higher disk queue tolerance
  freeStorage: 5368709120,    // Alert only when < 5GB free
  networkThroughput: 2097152, // 2MB/s threshold
  replicationLag: 60000,      // 60 seconds tolerance
};
```

2. High-Performance Production (Stricter Thresholds):
```typescript
const strictThresholds: AlertThresholds = {
  cpu: 60,                    // Alert early at 60%
  memory: 4294967296,         // Alert when < 4GB free
  readIops: 500,              // Alert at lower IOPS
  writeIops: 1000,            // Alert at lower write IOPS
  dbConnections: 50,          // Alert at 50% connections
  diskQueueDepth: 2,          // Alert at 2 disk queue depth
  freeStorage: 32212254720,   // Alert when < 30GB free
  networkThroughput: 524288,  // 0.5MB/s threshold
  replicationLag: 10000,      // 10 seconds tolerance
};
```

3. Read-Heavy Workload (Optimized for Reads):
```typescript
const readOptimizedThresholds: AlertThresholds = {
  cpu: 80,                    // Standard CPU threshold
  memory: 2147483648,         // Standard memory threshold
  readIops: 2000,             // Higher read IOPS tolerance
  writeIops: 500,             // Lower write IOPS threshold
  dbConnections: 85,          // Higher connection tolerance
  diskQueueDepth: 6,          // Higher disk queue tolerance
  freeStorage: 10737418240,   // Standard storage threshold
  networkThroughput: 2097152, // Higher network tolerance
  replicationLag: 45000,      // 45 seconds tolerance
};
```

4. Write-Heavy Workload (Optimized for Writes):
```typescript
const writeOptimizedThresholds: AlertThresholds = {
  cpu: 70,                    // Lower CPU threshold
  memory: 3221225472,         // Higher memory threshold
  readIops: 800,              // Lower read IOPS threshold
  writeIops: 1500,            // Higher write IOPS tolerance
  dbConnections: 70,          // Lower connection threshold
  diskQueueDepth: 3,          // Lower disk queue threshold
  freeStorage: 21474836480,   // Higher storage threshold
  networkThroughput: 1048576, // Standard network threshold
  replicationLag: 20000,      // Lower replication lag tolerance
};
```

5. Mixed Workload (Balanced):
```typescript
const balancedThresholds: AlertThresholds = {
  cpu: 75,                    // Balanced CPU threshold
  memory: 2684354560,         // Balanced memory threshold (2.5GB)
  readIops: 1000,             // Balanced read IOPS
  writeIops: 1000,            // Balanced write IOPS
  dbConnections: 75,          // Balanced connection threshold
  diskQueueDepth: 4,          // Balanced disk queue threshold
  freeStorage: 16106127360,   // Balanced storage threshold (15GB)
  networkThroughput: 1572864, // Balanced network threshold (1.5MB/s)
  replicationLag: 25000,      // Balanced replication lag (25 seconds)
};
```

Key Benefits of Custom Thresholds:
- Tailor alerts to your specific workload patterns
- Reduce false positives for your application's normal behavior
- Set stricter thresholds for critical production environments
- Use more lenient thresholds for development/testing
- Optimize thresholds based on instance types and workloads
- Separate thresholds for primary vs replica instances
*/ 