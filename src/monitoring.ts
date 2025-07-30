import {
  aws_cloudwatch_actions as cw_actions,
  aws_sns as sns,
  aws_sns_subscriptions as sns_subs,
  aws_rds as rds,
  Duration,
  Token,
  NestedStack,
} from 'aws-cdk-lib';
import { ComparisonOperator } from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

// Custom alert thresholds interface
export interface AlertThresholds {
  readonly cpu?: number;
  readonly memory?: number; // in bytes
  readonly readIops?: number;
  readonly writeIops?: number;
  readonly dbConnections?: number; // percentage
  readonly diskQueueDepth?: number;
  readonly freeStorage?: number; // in bytes
  readonly networkThroughput?: number; // in bytes per second
  readonly replicationLag?: number; // in milliseconds
}

export interface ReadReplicaConfig {
  readonly replicas: number;
  readonly instanceType: ec2.InstanceType;
  readonly alertThresholds?: AlertThresholds;
}

export interface MonitoringConfig {
  readonly clusterName: string;
  readonly instanceType: ec2.InstanceType;
  readonly backupRetention?: number;
  readonly multiAz?: boolean;
  readonly readReplicas?: ReadReplicaConfig;
  readonly primaryAlertThresholds?: AlertThresholds;
  readonly replicaAlertThresholds?: AlertThresholds;
  readonly alertSubcriptionWebhooks?: string[]; // Array of webhook URLs for different integrations
  readonly metricTopicName?: string;
  readonly enableAlerts?: boolean; // Flag to enable/disable all alerts (default: true)
}

export class RDSMonitoring extends Construct {
  public metricSnsTopic?: sns.ITopic;
  private config: MonitoringConfig;
  private nestedStack: NestedStack;

  constructor(scope: Construct, id: string, config: MonitoringConfig) {
    super(scope, id);
    this.config = config;

    // Create a nested stack for monitoring resources
    this.nestedStack = new NestedStack(this, 'MonitoringNestedStack');

    // Create SNS topic for alerts if webhooks are provided and alerts are enabled (default: true)
    if (config.enableAlerts !== false && config.alertSubcriptionWebhooks && config.alertSubcriptionWebhooks.length > 0) {
      this.metricSnsTopic = new sns.Topic(this.nestedStack, `${config.clusterName}`, {
        displayName: `cluster rds ${config.clusterName} Alarm Topic`,
        topicName: config.metricTopicName ?? `${config.clusterName}`,
      });

      // Add subscriptions for all webhooks
      config.alertSubcriptionWebhooks.forEach((webhookUrl: string) => {
        this.metricSnsTopic!.addSubscription(new sns_subs.UrlSubscription(Token.asString(webhookUrl), {
          protocol: sns.SubscriptionProtocol.HTTPS,
        }));
      });
    }
  }

  /**
   * Create all monitoring for primary instance
   */
  public createPrimaryMonitoring(primaryInstance: rds.DatabaseInstance) {
    // Skip alert creation if alerts are explicitly disabled
    if (this.config.enableAlerts === false) {
      return;
    }

    const thresholds = this.getInstanceTypeThresholds(this.config.instanceType, this.config.primaryAlertThresholds);

    this.createCPUAlert(primaryInstance, thresholds, false);
    this.createFreeStorageAlert(primaryInstance, thresholds, false);
    this.createFreeMemoryAlert(primaryInstance, thresholds, false);
    this.createReadIOPSAlert(primaryInstance, thresholds, false);
    this.createWriteIOPSAlert(primaryInstance, thresholds, false);
    this.createDiskQueueDepthAlert(primaryInstance, thresholds, false);
    this.createDatabaseConnectionsAlert(primaryInstance, thresholds, false);
    this.createNetworkThroughputAlert(primaryInstance, thresholds, false);

    // Conditional alerts
    if (this.config.multiAz) {
      this.createReplicationLagAlert(primaryInstance, thresholds, false);
    }

    if (this.config.backupRetention && this.config.backupRetention > 0) {
      this.createBackupStorageAlert(primaryInstance, thresholds, false);
    }
  }

  /**
   * Create all monitoring for read replicas
   */
  public createReplicaMonitoring(replicaInstance: rds.DatabaseInstanceReadReplica, replicaIndex: number) {
    // Skip alert creation if alerts are explicitly disabled
    if (this.config.enableAlerts === false) {
      return;
    }

    const replicaThresholds = this.getInstanceTypeThresholds(
      this.config.readReplicas!.instanceType,
      this.config.readReplicas!.alertThresholds || this.config.replicaAlertThresholds,
    );

    this.createCPUAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createFreeStorageAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createFreeMemoryAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createReadIOPSAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createWriteIOPSAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createDiskQueueDepthAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createDatabaseConnectionsAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createNetworkThroughputAlert(replicaInstance, replicaThresholds, true, replicaIndex);
    this.createReplicationLagAlert(replicaInstance, replicaThresholds, true, replicaIndex);
  }

  /**
   * Calculate alert thresholds based on instance type and custom overrides
   */
  private getInstanceTypeThresholds(instanceType: ec2.InstanceType, customThresholds?: AlertThresholds) {
    const instanceClass = instanceType.toString().split('.')[1]; // Extract class from string like "t3.micro"

    // Base thresholds for different instance classes
    const thresholds = {
      // CPU thresholds - smaller instances can handle higher CPU usage
      cpu: {
        t3: 85, // Burstable instances
        t2: 85, // Burstable instances
        m5: 80, // General purpose
        m6: 80, // General purpose
        r5: 75, // Memory optimized
        r6: 75, // Memory optimized
        c5: 70, // Compute optimized
        c6: 70, // Compute optimized
        x1: 70, // Memory optimized
        x2: 70, // Memory optimized
      },

      // Memory thresholds - based on available memory
      memory: {
        t3: 1073741824, // 1GB for small burstable
        t2: 1073741824, // 1GB for small burstable
        m5: 2147483648, // 2GB for general purpose
        m6: 2147483648, // 2GB for general purpose
        r5: 4294967296, // 4GB for memory optimized
        r6: 4294967296, // 4GB for memory optimized
        c5: 2147483648, // 2GB for compute optimized
        c6: 2147483648, // 2GB for compute optimized
        x1: 8589934592, // 8GB for large memory
        x2: 8589934592, // 8GB for large memory
      },

      // IOPS thresholds - based on instance performance
      readIops: {
        t3: 500, // Lower for burstable
        t2: 500, // Lower for burstable
        m5: 1000, // Medium for general purpose
        m6: 1000, // Medium for general purpose
        r5: 1500, // Higher for memory optimized
        r6: 1500, // Higher for memory optimized
        c5: 2000, // High for compute optimized
        c6: 2000, // High for compute optimized
        x1: 3000, // Very high for large instances
        x2: 3000, // Very high for large instances
      },

      writeIops: {
        t3: 1000, // Lower for burstable
        t2: 1000, // Lower for burstable
        m5: 2000, // Medium for general purpose
        m6: 2000, // Medium for general purpose
        r5: 3000, // Higher for memory optimized
        r6: 3000, // Higher for memory optimized
        c5: 4000, // High for compute optimized
        c6: 4000, // High for compute optimized
        x1: 6000, // Very high for large instances
        x2: 6000, // Very high for large instances
      },

      // Database connections - based on instance size
      dbConnections: {
        t3: 60, // Lower for burstable
        t2: 60, // Lower for burstable
        m5: 80, // Medium for general purpose
        m6: 80, // Medium for general purpose
        r5: 85, // Higher for memory optimized
        r6: 85, // Higher for memory optimized
        c5: 90, // High for compute optimized
        c6: 90, // High for compute optimized
        x1: 95, // Very high for large instances
        x2: 95, // Very high for large instances
      },

      // Disk queue depth - based on instance performance
      diskQueueDepth: {
        t3: 3, // Lower for burstable
        t2: 3, // Lower for burstable
        m5: 5, // Medium for general purpose
        m6: 5, // Medium for general purpose
        r5: 7, // Higher for memory optimized
        r6: 7, // Higher for memory optimized
        c5: 10, // High for compute optimized
        c6: 10, // High for compute optimized
        x1: 15, // Very high for large instances
        x2: 15, // Very high for large instances
      },
    };

    // Get default values if instance class not found
    const getThreshold = (metric: keyof typeof thresholds, defaultValue: number) => {
      const metricThresholds = thresholds[metric] as Record<string, number>;
      return metricThresholds[instanceClass] || defaultValue;
    };

    const defaultThresholds = {
      cpu: getThreshold('cpu', 80),
      memory: getThreshold('memory', 2147483648), // 2GB default
      readIops: getThreshold('readIops', 1000),
      writeIops: getThreshold('writeIops', 2000),
      dbConnections: getThreshold('dbConnections', 80),
      diskQueueDepth: getThreshold('diskQueueDepth', 5),
      freeStorage: 10737418240, // 10GB default
      networkThroughput: 1048576, // 1MB/s default
      replicationLag: 30000, // 30 seconds default
    };

    // Merge custom thresholds with defaults
    return {
      ...defaultThresholds,
      ...customThresholds,
    };
  }

  private createCPUAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const description = isReplica ?
      `Cluster ReadReplica CPU utilization exceeds ${thresholds.cpu}% (${this.config.instanceType})` :
      `Cluster CPU utilization exceeds ${thresholds.cpu}% (${this.config.instanceType})`;

    const metric = instance.metricCPUUtilization({
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-cpu-${thresholds.cpu}-alert`, {
      evaluationPeriods: 2,
      alarmName: `${this.config.clusterName}${suffix}-cpu-${thresholds.cpu}`,
      alarmDescription: description,
      threshold: thresholds.cpu,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createFreeStorageAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const freeStorageGB = Math.round(thresholds.freeStorage / 1073741824);
    const description = isReplica ?
      `Cluster ReadReplica Storage Free Less than ${freeStorageGB}GB (${this.config.instanceType})` :
      `Cluster Storage Free Less than ${freeStorageGB}GB (${this.config.instanceType})`;

    const metric = instance.metricFreeStorageSpace({
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-freespace-${freeStorageGB}gb-alert`, {
      evaluationPeriods: 2,
      alarmName: `${this.config.clusterName}${suffix}-freespace-${freeStorageGB}gb`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      threshold: thresholds.freeStorage,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createFreeMemoryAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const memoryThresholdGB = Math.round(thresholds.memory / 1073741824);
    const description = isReplica ?
      `Cluster ReadReplica Memory Free Less than ${memoryThresholdGB}GB (${this.config.instanceType})` :
      `Cluster Memory Free Less than ${memoryThresholdGB}GB (${this.config.instanceType})`;

    const metric = instance.metricFreeableMemory({
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-memory-${memoryThresholdGB}gb-alert`, {
      evaluationPeriods: 2,
      alarmName: `${this.config.clusterName}${suffix}-memory-${memoryThresholdGB}gb`,
      comparisonOperator: ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      alarmDescription: description,
      threshold: thresholds.memory,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createReadIOPSAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const description = isReplica ?
      `Cluster ReadReplica ReadIOPS exceeds ${thresholds.readIops} (${this.config.instanceType})` :
      `Db Instance Read IOPS exceeds ${thresholds.readIops} (${this.config.instanceType})`;

    const metric = instance.metric('ReadIOPS', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-read-iops-${thresholds.readIops}-alert`, {
      evaluationPeriods: isReplica ? 5 : 2,
      alarmName: `${this.config.clusterName}${suffix}-read-iops-${thresholds.readIops}`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: thresholds.readIops,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createWriteIOPSAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const description = isReplica ?
      `Cluster ReadReplica WriteIOPS exceeds ${thresholds.writeIops} (${this.config.instanceType})` :
      `Db Instance Write IOPS exceeds ${thresholds.writeIops} (${this.config.instanceType})`;

    const metric = instance.metric('WriteIOPS', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-write-iops-${thresholds.writeIops}-alert`, {
      evaluationPeriods: isReplica ? 5 : 2,
      alarmName: `${this.config.clusterName}${suffix}-write-iops-${thresholds.writeIops}`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: thresholds.writeIops,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createDiskQueueDepthAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const description = isReplica ?
      `Cluster ReadReplica Disk Queue Depth exceeds ${thresholds.diskQueueDepth} (${this.config.instanceType})` :
      `Cluster Disk Queue Depth exceeds ${thresholds.diskQueueDepth} (${this.config.instanceType})`;

    const metric = instance.metric('DiskQueueDepth', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-disk-queue-depth-${thresholds.diskQueueDepth}-alert`, {
      evaluationPeriods: 5,
      alarmName: `${this.config.clusterName}${suffix}-disk-queue-depth-${thresholds.diskQueueDepth}`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: thresholds.diskQueueDepth,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createDatabaseConnectionsAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const description = isReplica ?
      `Cluster ReadReplica Database connections exceed ${thresholds.dbConnections}% (${this.config.instanceType})` :
      `Database connections exceed ${thresholds.dbConnections}% of max connections (${this.config.instanceType})`;

    const metric = instance.metric('DatabaseConnections', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-db-connections-${thresholds.dbConnections}-alert`, {
      evaluationPeriods: 2,
      alarmName: `${this.config.clusterName}${suffix}-db-connections-${thresholds.dbConnections}`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: thresholds.dbConnections,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createNetworkThroughputAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const networkThroughputMB = Math.round(thresholds.networkThroughput / 1048576);
    const description = isReplica ?
      `Cluster ReadReplica Network throughput exceeds ${networkThroughputMB}MB/s (${this.config.instanceType})` :
      `Network throughput exceeds ${networkThroughputMB}MB/s (${this.config.instanceType})`;

    const metric = instance.metric('NetworkThroughput', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-network-throughput-${networkThroughputMB}mb-alert`, {
      evaluationPeriods: 3,
      alarmName: `${this.config.clusterName}${suffix}-network-throughput-${networkThroughputMB}mb`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: thresholds.networkThroughput,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createReplicationLagAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';
    const replicationLagSeconds = Math.round(thresholds.replicationLag / 1000);
    const description = isReplica ?
      `Cluster ReadReplica Replication lag exceeds ${replicationLagSeconds} seconds (${this.config.instanceType})` :
      `Replication lag exceeds ${replicationLagSeconds} seconds (${this.config.instanceType})`;

    const metric = instance.metric('ReplicaLag', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-replication-lag-${replicationLagSeconds}sec-alert`, {
      evaluationPeriods: 2,
      alarmName: `${this.config.clusterName}${suffix}-replication-lag-${replicationLagSeconds}sec`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: thresholds.replicationLag,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }

  private createBackupStorageAlert(
    instance: rds.DatabaseInstance | rds.DatabaseInstanceReadReplica,
    _thresholds: any,
    isReplica: boolean,
    replicaIndex?: number,
  ) {
    const suffix = isReplica ? `-rreplicas-${replicaIndex}` : '';

    // Calculate threshold based on backup retention period
    let backupThreshold = 70; // Default for 7 days
    if (this.config.backupRetention && this.config.backupRetention > 7) {
      backupThreshold = Math.min(85, 70 + (this.config.backupRetention - 7) * 2); // Increase by 2% per additional day, max 85%
    }

    const description = isReplica ?
      `Cluster ReadReplica Backup storage usage exceeds ${backupThreshold}% (${this.config.backupRetention} days retention)` :
      `Backup storage usage exceeds ${backupThreshold}% (${this.config.backupRetention} days retention)`;

    const metric = instance.metric('BackupRetentionPeriodStorageUsage', {
      statistic: 'Average',
      period: Duration.minutes(5),
    });

    const alarm = metric.createAlarm(this.nestedStack, `${this.config.clusterName}${suffix}-backup-storage-${backupThreshold}-alert`, {
      evaluationPeriods: 2,
      alarmName: `${this.config.clusterName}${suffix}-backup-storage-${backupThreshold}`,
      alarmDescription: description,
      comparisonOperator: ComparisonOperator.GREATER_THAN_THRESHOLD,
      threshold: backupThreshold,
    });

    if (this.metricSnsTopic) {
      alarm.addAlarmAction(new cw_actions.SnsAction(this.metricSnsTopic));
    }
  }
}