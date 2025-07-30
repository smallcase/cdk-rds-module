# AWS CDK RDS Module

A comprehensive AWS CDK construct for provisioning PostgreSQL RDS instances with advanced monitoring, alerting, and Zenduty integration.

## 🚀 Features

- **PostgreSQL RDS Clusters**: Primary instances with optional read replicas
- **Advanced Monitoring**: Comprehensive CloudWatch alarms for performance metrics
- **Dynamic Thresholds**: Alert thresholds that automatically adjust based on instance type
- **Custom Thresholds**: Override default thresholds for primary and replica instances
- **Zenduty Integration**: Direct webhook integration for incident management
- **Cost Control**: Optional alert disabling for non-production environments
- **Flexible Configuration**: Support for multiple webhook endpoints
- **Tagging Support**: Automatic tag propagation to all resources

## 📦 Installation

```bash
npm install @your-org/cdk-rds-module
# or
yarn add @your-org/cdk-rds-module
```

## 🏗️ Basic Usage

```typescript
import * as cdk from 'aws-cdk-lib';
import { PostgresRDSCluster } from '@your-org/cdk-rds-module';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyRDSStack');

new PostgresRDSCluster(stack, 'MyDatabase', {
  clusterName: 'my-app-db',
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  vpc: myVpc,
  postgresVersion: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14_7 }),
  databaseName: 'myapp',
  masterUsername: 'admin',
  masterUserPassword: cdk.SecretValue.unsafePlainText('password123'),
  backupRetention: 7,
  multiAz: false,
  enablePerformanceInsights: true,
  performanceInsightRetention: 7,
  monitoringInterval: 60,
  deletionProtection: false,
  storageEncrypted: true,
  enableAlerts: true,
  alertSubcriptionWebhooks: ['https://your-zenduty-webhook-url'],
  metricTopicName: 'my-app-alerts',
});
```

## 🔧 Configuration Options

### Core RDS Configuration

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `clusterName` | `string` | ✅ | - | Unique name for the RDS cluster |
| `instanceType` | `ec2.InstanceType` | ✅ | - | EC2 instance type for the database |
| `vpc` | `ec2.IVpc` | ✅ | - | VPC where the RDS instance will be deployed |
| `postgresVersion` | `rds.IInstanceEngine` | ✅ | - | PostgreSQL engine version |
| `databaseName` | `string` | ✅ | - | Name of the database to create |
| `masterUsername` | `string` | ✅ | - | Master username for the database |
| `masterUserPassword` | `cdk.SecretValue` | ✅ | - | Master password for the database |

### Read Replicas

```typescript
readReplicas: {
  replicas: 2,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
  parameters: {
    'shared_preload_libraries': 'pg_stat_statements',
    'max_connections': '200'
  },
  alertThresholds: {
    cpu: 70,
    memory: 1073741824, // 1GB in bytes
    freeStorage: 2147483648, // 2GB in bytes
    readIops: 1000,
    writeIops: 500,
    diskQueueDepth: 10,
    dbConnections: 80,
    networkThroughput: 10485760, // 10MB/s in bytes
    replicationLag: 5000 // 5 seconds in milliseconds
  }
}
```

### Monitoring & Alerting

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableAlerts` | `boolean` | `true` | Enable/disable all CloudWatch alarms |
| `alertSubcriptionWebhooks` | `string[]` | `[]` | Array of webhook URLs for notifications |
| `metricTopicName` | `string` | `clusterName` | SNS topic name for alerts |
| `primaryAlertThresholds` | `AlertThresholds` | Dynamic | Custom thresholds for primary instance |
| `replicaAlertThresholds` | `AlertThresholds` | Dynamic | Custom thresholds for read replicas |

### Alert Thresholds Interface

```typescript
interface AlertThresholds {
  readonly cpu: number;                    // CPU utilization percentage
  readonly memory: number;                 // Free memory in bytes
  readonly freeStorage: number;            // Free storage in bytes
  readonly readIops: number;               // Read IOPS threshold
  readonly writeIops: number;              // Write IOPS threshold
  readonly diskQueueDepth: number;         // Disk queue depth
  readonly dbConnections: number;          // Database connections percentage
  readonly networkThroughput: number;      // Network throughput in bytes
  readonly replicationLag: number;         // Replication lag in milliseconds
}
```

## 📊 Dynamic Thresholds

The module automatically calculates appropriate alert thresholds based on the RDS instance type:

### Instance Type Thresholds

| Instance Class | CPU (%) | Memory (GB) | Storage (GB) | Read IOPS | Write IOPS |
|----------------|---------|-------------|--------------|-----------|------------|
| `t3.micro` | 80 | 0.5 | 5 | 1000 | 500 |
| `t3.small` | 80 | 1 | 10 | 2000 | 1000 |
| `t3.medium` | 80 | 2 | 20 | 3000 | 1500 |
| `m6.large` | 80 | 4 | 50 | 5000 | 2500 |
| `m6.xlarge` | 80 | 8 | 100 | 10000 | 5000 |
| `r6.large` | 80 | 16 | 100 | 8000 | 4000 |
| `r6.xlarge` | 80 | 32 | 200 | 15000 | 7500 |

## 🔔 Available Alerts

### Primary Instance Alerts
- **CPU Utilization**: Monitors CPU usage percentage
- **Free Storage Space**: Alerts when storage is running low
- **Free Memory**: Monitors available memory
- **Read IOPS**: Tracks read operations per second
- **Write IOPS**: Tracks write operations per second
- **Disk Queue Depth**: Monitors I/O queue length
- **Database Connections**: Tracks active connections
- **Network Throughput**: Monitors network bandwidth
- **Backup Storage**: Tracks backup storage usage

### Read Replica Alerts
- All primary alerts plus:
- **Replication Lag**: Monitors replication delay

## 🔗 Zenduty Integration

### Setup Zenduty Webhook

1. Create a new integration in Zenduty
2. Select "AWS CloudWatch" as the integration type
3. Copy the webhook URL
4. Add it to your CDK configuration:

```typescript
alertSubcriptionWebhooks: [
  'https://your-zenduty-webhook-url'
]
```

### Multiple Webhooks

Support multiple notification endpoints:

```typescript
alertSubcriptionWebhooks: [
  'https://zenduty-webhook-url',
  'https://slack-webhook-url',
  'https://pagerduty-webhook-url'
]
```

## 🏷️ Tagging

All resources are automatically tagged with:
- `Name`: Resource name
- `Environment`: Stack environment
- `Project`: Project identifier
- Custom tags passed via the `tags` property

## 💰 Cost Optimization

### Disable Alerts for Non-Production

```typescript
new PostgresRDSCluster(stack, 'DevDatabase', {
  // ... other config
  enableAlerts: false, // Disable all alerts for cost savings
});
```

### Conditional Alert Configuration

```typescript
const isProduction = process.env.ENVIRONMENT === 'production';

new PostgresRDSCluster(stack, 'MyDatabase', {
  // ... other config
  enableAlerts: isProduction,
  alertSubcriptionWebhooks: isProduction ? ['https://prod-zenduty-webhook'] : [],
});
```

## 📋 Examples

### Basic RDS Instance

```typescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { PostgresRDSCluster } from '@your-org/cdk-rds-module';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'BasicRDSStack');

const vpc = new ec2.Vpc(stack, 'MyVPC');

new PostgresRDSCluster(stack, 'BasicDatabase', {
  clusterName: 'basic-app-db',
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
  vpc: vpc,
  postgresVersion: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14_7 }),
  databaseName: 'myapp',
  masterUsername: 'admin',
  masterUserPassword: cdk.SecretValue.unsafePlainText('password123'),
  backupRetention: 7,
  multiAz: false,
  enablePerformanceInsights: true,
  performanceInsightRetention: 7,
  monitoringInterval: 60,
  deletionProtection: false,
  storageEncrypted: true,
});
```

### Production RDS with Read Replicas

```typescript
import { AlertThresholds } from '@your-org/cdk-rds-module';

const customThresholds: AlertThresholds = {
  cpu: 75,
  memory: 2147483648, // 2GB
  freeStorage: 5368709120, // 5GB
  readIops: 2000,
  writeIops: 1000,
  diskQueueDepth: 5,
  dbConnections: 70,
  networkThroughput: 20971520, // 20MB/s
  replicationLag: 3000, // 3 seconds
};

new PostgresRDSCluster(stack, 'ProductionDatabase', {
  clusterName: 'prod-app-db',
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M6, ec2.InstanceSize.LARGE),
  vpc: vpc,
  postgresVersion: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14_7 }),
  databaseName: 'myapp',
  masterUsername: 'admin',
  masterUserPassword: cdk.SecretValue.unsafePlainText('secure-password'),
  backupRetention: 30,
  multiAz: true,
  enablePerformanceInsights: true,
  performanceInsightRetention: 30,
  monitoringInterval: 60,
  deletionProtection: true,
  storageEncrypted: true,
  readReplicas: {
    replicas: 2,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M6, ec2.InstanceSize.LARGE),
    alertThresholds: customThresholds,
  },
  primaryAlertThresholds: customThresholds,
  alertSubcriptionWebhooks: ['https://prod-zenduty-webhook'],
  metricTopicName: 'prod-app-alerts',
});
```

## 🧪 Testing

```bash
# Run tests
npm test

# Build the project
npm run build

# Check for linting issues
npm run lint
```

## 📚 API Reference

### PostgresRDSCluster

Main construct for creating PostgreSQL RDS clusters.

#### Properties

- `cluster`: `rds.DatabaseInstance` - The primary RDS instance
- `readReplicas`: `rds.DatabaseInstanceReadReplica[]` - Array of read replica instances
- `securityGroup`: `ec2.SecurityGroup` - Security group for the RDS instances
- `metricSnsTopic`: `sns.ITopic` - SNS topic for CloudWatch alarms

### RDSMonitoring

Internal construct for managing monitoring and alerting.

#### Methods

- `createPrimaryMonitoring(instance)`: Creates alerts for primary instance
- `createReplicaMonitoring(instance, index)`: Creates alerts for read replica

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [documentation](docs/)
- Review the [examples](examples/) directory