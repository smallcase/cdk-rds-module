# RDS Monitoring Architecture

This document describes the new separated monitoring architecture for the RDS module, which provides better organization and maintainability of monitoring and alerting code.

## Architecture Overview

The monitoring functionality has been separated into two main components with a nested stack approach:

1. **`src/monitoring.ts`** - Contains alert threshold definitions, interfaces, and the main monitoring logic as a nested stack
2. **`src/rds.ts`** - Contains the RDS cluster creation logic (now cleaner without monitoring code)

## Components

### 1. Monitoring Module (`src/monitoring.ts`)

The monitoring module contains both the interfaces and the main monitoring logic:

#### Alert Thresholds Interface
```typescript
export interface AlertThresholds {
  cpu?: number;
  memory?: number; // in bytes
  readIops?: number;
  writeIops?: number;
  dbConnections?: number; // percentage
  diskQueueDepth?: number;
  freeStorage?: number; // in bytes
  networkThroughput?: number; // in bytes per second
  replicationLag?: number; // in milliseconds
}
```

#### Monitoring Logic

The monitoring module contains:

- **RDSMonitoringStack class** - Main monitoring nested stack
- **SNS Topic creation** - For alert notifications
- **Alert creation methods** - For all RDS metrics
- **Dynamic threshold calculation** - Based on instance types
- **Support for both primary and replica instances**

#### Key Features:

- **Dynamic Thresholds**: Automatically calculates appropriate alert thresholds based on instance type
- **Custom Overrides**: Allows custom threshold values for specific instances
- **Multi-Instance Support**: Handles both primary and read replica instances
- **Zenduty Integration**: Supports Zenduty webhook integration
- **Flexible Configuration**: Supports various monitoring configurations

### 2. RDS Module (`src/rds.ts`)

The RDS module is now cleaner and focused on:

- RDS cluster creation
- Security group configuration
- Parameter group setup
- Instance configuration
- Integration with the monitoring module

## Usage Examples

### Basic Usage

```typescript
import { PostgresRDSCluster } from './src/rds';
import { RDSMonitoring, AlertThresholds } from './src/monitoring';

// Define custom thresholds
const customThresholds: AlertThresholds = {
  cpu: 75,
  memory: 3221225472, // 3GB
  readIops: 1500,
  writeIops: 3000,
  dbConnections: 85,
  diskQueueDepth: 8,
  freeStorage: 16106127360, // 15GB
  networkThroughput: 2097152, // 2MB/s
  replicationLag: 45000, // 45 seconds
};

// Create RDS cluster with monitoring
const rdsCluster = new PostgresRDSCluster(this, 'MyRDSCluster', {
  // ... RDS configuration
  primaryAlertThresholds: customThresholds,
  alertSubcriptionWebhooks: [
    'https://hooks.slack.com/services/YOUR/WEBHOOK',
    'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/YOUR_KEY/',
    'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
  ],
});

// Create separate monitoring nested stack
const monitoring = new RDSMonitoringStack(this, 'RDSMonitoringStack', {
  clusterName: 'my-cluster',
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE),
  primaryAlertThresholds: customThresholds,
  alertSubcriptionWebhooks: [
    'https://hooks.slack.com/services/YOUR/WEBHOOK',
    'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/YOUR_KEY/',
    'https://discord.com/api/webhooks/YOUR/DISCORD/WEBHOOK',
  ],
});
```

### Advanced Usage with Read Replicas

```typescript
const primaryThresholds: AlertThresholds = {
  cpu: 75,
  memory: 3221225472, // 3GB
  // ... other thresholds
};

const replicaThresholds: AlertThresholds = {
  cpu: 80,
  memory: 2147483648, // 2GB
  // ... other thresholds
};

const rdsCluster = new PostgresRDSCluster(this, 'MyRDSCluster', {
  // ... RDS configuration
  readReplicas: {
    replicas: 2,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.MEDIUM),
    alertThresholds: replicaThresholds,
  },
  primaryAlertThresholds: primaryThresholds,
  replicaAlertThresholds: replicaThresholds,
});
```

## Available Alerts

The monitoring module creates the following alerts:

### Primary Instance Alerts
- **CPU Utilization** - Monitors CPU usage with dynamic thresholds
- **Free Memory** - Monitors available memory
- **Free Storage** - Monitors available storage space
- **Read IOPS** - Monitors read operations per second
- **Write IOPS** - Monitors write operations per second
- **Disk Queue Depth** - Monitors disk I/O queue depth
- **Database Connections** - Monitors active database connections
- **Network Throughput** - Monitors network I/O
- **Replication Lag** - Monitors replication delay (Multi-AZ only)
- **Backup Storage** - Monitors backup storage usage (if backups enabled)

### Read Replica Alerts
- All the same alerts as primary instances
- Separate thresholds for replica-specific requirements
- Individual monitoring for each replica instance

## Dynamic Threshold Calculation

The monitoring module automatically calculates appropriate thresholds based on instance type:

### Instance Class Thresholds

| Instance Class | CPU (%) | Memory (GB) | Read IOPS | Write IOPS | DB Connections (%) |
|----------------|---------|-------------|-----------|------------|-------------------|
| t3/t2 (Burstable) | 85 | 1 | 500 | 1000 | 60 |
| m5/m6 (General) | 80 | 2 | 1000 | 2000 | 80 |
| r5/r6 (Memory) | 75 | 4 | 1500 | 3000 | 85 |
| c5/c6 (Compute) | 70 | 2 | 2000 | 4000 | 90 |
| x1/x2 (Large) | 70 | 8 | 3000 | 6000 | 95 |

### Custom Overrides

You can override any threshold with custom values:

```typescript
const customThresholds: AlertThresholds = {
  cpu: 70, // Override CPU threshold to 70%
  memory: 4294967296, // Override memory threshold to 4GB
  // Other thresholds will use instance-type defaults
};
```

## Integration with Zenduty

The monitoring module supports Zenduty integration for incident management:

```typescript
const monitoring = new RDSMonitoring(this, 'RDSMonitoring', {
  // ... other configuration
  zendutyWebhookUrl: 'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/YOUR_INTEGRATION_KEY/',
});
```

## Benefits of Separated Architecture

1. **Better Organization**: Monitoring logic is separated from RDS creation logic
2. **Reusability**: Monitoring module can be used independently
3. **Maintainability**: Easier to update and maintain monitoring code
4. **Flexibility**: Can create monitoring for existing RDS instances
5. **Testing**: Easier to test monitoring logic in isolation
6. **Customization**: More flexible configuration options

## Migration from Old Architecture

If you're migrating from the old architecture:

1. **Remove old alert code** from your RDS module
2. **Import the new modules**:
   ```typescript
   import { AlertThresholds, RDSMonitoring } from './src/monitoring';
   ```
3. **Update your configuration** to use the new interfaces
4. **Create separate monitoring instances** as needed

## Best Practices

1. **Use Dynamic Thresholds**: Let the module calculate appropriate thresholds based on instance type
2. **Customize When Needed**: Override thresholds only when you have specific requirements
3. **Monitor Both Primary and Replicas**: Set up monitoring for all instances
4. **Use Zenduty Integration**: For better incident management
5. **Test Your Alerts**: Verify that alerts are triggered appropriately
6. **Document Your Thresholds**: Keep track of why you chose specific threshold values 