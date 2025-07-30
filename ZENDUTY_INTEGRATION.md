# Zenduty Integration with AWS RDS CloudWatch Alerts

This module provides comprehensive integration between AWS RDS CloudWatch alarms and Zenduty for advanced incident management and alert routing.

## Overview

Following the [official Zenduty AWS CloudWatch Integration Guide](https://zenduty.com/docs/aws-cloudwatch-integration/), this implementation:

- Routes CloudWatch alarm alerts to the right team based on on-call schedules
- Notifies team members via email, SMS, phone calls, Slack, Microsoft Teams, and mobile push notifications
- Escalates alerts until acknowledged or resolved
- Provides detailed context around CloudWatch alerts with playbooks and incident command framework
- Auto-creates incidents for ALARM/INSUFFICIENT states and auto-resolves for OK state

## Architecture

```
AWS RDS Instance → CloudWatch Alarms → SNS Topic → HTTPS Subscription → Zenduty Webhook → Incident Management
```

## Setup Instructions

### 1. Configure Zenduty Integration

1. **Access Zenduty Dashboard**
   - Go to [Zenduty](https://zenduty.com) and sign in
   - Navigate to **Teams** and select your team

2. **Create/Select Service**
   - Go to **Services** and select or create a service for your RDS monitoring
   - This service will receive all RDS-related alerts

3. **Add AWS CloudWatch Integration**
   - Go to **Integrations** → **Add New Integration**
   - Give it a name (e.g., "RDS Production Alerts")
   - Select **AWS CloudWatch** from the dropdown menu

4. **Get Webhook URL**
   - Go to **Configure** under your integration
   - Copy the generated webhook URL
   - This URL will be used in your CDK stack

### 2. Deploy CDK Stack

Use the provided example or create your own stack:

```typescript
import { PostgresRDSCluster } from './src/rds';

const rdsCluster = new PostgresRDSCluster(this, 'ProductionRDS', {
  // ... other RDS configuration
  zendutyWebhookUrl: 'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/your-webhook-url/',
});
```

### 3. Verify Integration

1. **Check SNS Topic Creation**
   - Verify the SNS topic is created in AWS Console
   - Confirm HTTPS subscription to Zenduty webhook

2. **Test Alerts**
   - Trigger one of the RDS alarms to test the integration
   - Check Zenduty dashboard for incident creation

## Available RDS Alerts

The module automatically creates comprehensive CloudWatch alarms for:

### Primary Instance Alerts
- **CPU Utilization**: Dynamic threshold based on instance type (2 evaluation periods)
  - Burstable (t2, t3): > 85%
  - General purpose (m5, m6): > 80%
  - Memory optimized (r5, r6): > 75%
  - Compute optimized (c5, c6): > 70%
  - Large memory (x1, x2): > 70%
- **Free Storage Space**: < 10GB (2 evaluation periods)
- **Free Memory**: Dynamic threshold based on instance type (2 evaluation periods)
  - Burstable (t2, t3): < 1GB
  - General purpose (m5, m6): < 2GB
  - Memory optimized (r5, r6): < 4GB
  - Compute optimized (c5, c6): < 2GB
  - Large memory (x1, x2): < 8GB
- **Read IOPS**: Dynamic threshold based on instance type (2 evaluation periods)
  - Burstable (t2, t3): > 500
  - General purpose (m5, m6): > 1000
  - Memory optimized (r5, r6): > 1500
  - Compute optimized (c5, c6): > 2000
  - Large memory (x1, x2): > 3000
- **Write IOPS**: Dynamic threshold based on instance type (2 evaluation periods)
  - Burstable (t2, t3): > 1000
  - General purpose (m5, m6): > 2000
  - Memory optimized (r5, r6): > 3000
  - Compute optimized (c5, c6): > 4000
  - Large memory (x1, x2): > 6000
- **Disk Queue Depth**: Dynamic threshold based on instance type (5 evaluation periods)
  - Burstable (t2, t3): > 3
  - General purpose (m5, m6): > 5
  - Memory optimized (r5, r6): > 7
  - Compute optimized (c5, c6): > 10
  - Large memory (x1, x2): > 15
- **Database Connections**: Dynamic threshold based on instance type (2 evaluation periods)
  - Burstable (t2, t3): > 60%
  - General purpose (m5, m6): > 80%
  - Memory optimized (r5, r6): > 85%
  - Compute optimized (c5, c6): > 90%
  - Large memory (x1, x2): > 95%
- **Network Throughput**: > 1MB/s (3 evaluation periods)
- **Replication Lag**: > 30 seconds (2 evaluation periods, multi-AZ only)
- **Backup Storage Usage**: Dynamic threshold based on retention period (2 evaluation periods)
  - 7 days retention: > 70%
  - Longer retention: increases by 2% per additional day (max 85%)

### Read Replica Alerts (if configured)
- All primary instance alerts plus:
- **Replica Lag**: > 30 seconds (2 evaluation periods)

## Zenduty Features

### Automatic Incident Management
- **Incident Creation**: Automatically creates incidents for ALARM/INSUFFICIENT states
- **Auto-Resolution**: Automatically resolves incidents when alarms return to OK state
- **Context Preservation**: Maintains full CloudWatch alarm context in incidents

### Team Routing & Escalation
- **Smart Routing**: Routes alerts to the right team based on on-call schedules
- **Escalation Policies**: Escalates alerts until acknowledged or resolved
- **Multi-Channel Notifications**: Email, SMS, phone calls, Slack, Teams, mobile push

### Incident Response
- **Playbooks**: Pre-defined response procedures for different alert types
- **Incident Command**: Complete framework for incident management
- **Collaboration**: Team collaboration tools within incidents

## Configuration Options

### Basic Integration
```typescript
{
  zendutyWebhookUrl: 'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/your-webhook-url/'
}
```

### Custom Alert Thresholds
```typescript
import { AlertThresholds } from './src/rds';

// Custom thresholds for primary instance
const primaryThresholds: AlertThresholds = {
  cpu: 75,                    // Alert at 75% instead of default 80%
  memory: 3221225472,         // Alert when free memory < 3GB
  readIops: 800,              // Alert at 800 IOPS
  writeIops: 1500,            // Alert at 1500 IOPS
  dbConnections: 70,          // Alert at 70% connections
  diskQueueDepth: 3,          // Alert at 3 disk queue depth
  freeStorage: 21474836480,   // Alert when free storage < 20GB
  networkThroughput: 2097152, // Alert at 2MB/s
  replicationLag: 15000,      // Alert at 15 seconds
};

// Custom thresholds for read replicas
const replicaThresholds: AlertThresholds = {
  cpu: 85,                    // Higher CPU tolerance for read replicas
  memory: 1610612736,         // Alert when free memory < 1.5GB
  readIops: 1200,             // Higher read IOPS tolerance
  writeIops: 500,             // Lower write IOPS threshold
  dbConnections: 60,          // Lower connection threshold
  diskQueueDepth: 4,          // Higher disk queue tolerance
  freeStorage: 10737418240,   // Same as default (10GB)
  networkThroughput: 1048576, // Same as default (1MB/s)
  replicationLag: 60000,      // Higher replication lag tolerance (60 seconds)
};

const rdsCluster = new PostgresRDSCluster(this, 'ProductionRDS', {
  // ... RDS configuration
  primaryAlertThresholds: primaryThresholds,
  readReplicas: {
    replicas: 2,
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.MEDIUM),
    alertThresholds: replicaThresholds, // Override replica-specific thresholds
  },
});
```

### Combined with Slack Chatbot
```typescript
// RDS with both Zenduty and Slack notifications
const rdsCluster = new PostgresRDSCluster(this, 'ProductionRDS', {
  // ... RDS configuration
  zendutyWebhookUrl: 'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/your-webhook-url/',
});

const slackIntegration = new SlackChatbotIntegration(this, 'SlackChatbot', {
  environmentName: 'production',
  slackWorkspaceId: 'T1234567890',
  slackChannelId: 'C1234567890',
  notificationTopics: rdsCluster.metricSnsTopic ? [rdsCluster.metricSnsTopic] : [],
});
```

## Best Practices

### 1. Webhook Security
- Store Zenduty webhook URLs in AWS Secrets Manager for production
- Use environment-specific webhook URLs for different environments

### 2. Alert Thresholds
- Adjust alert thresholds based on your application's normal behavior
- Consider using different thresholds for different environments

### 3. Team Structure
- Create separate Zenduty services for different RDS clusters
- Use team-based routing for different types of alerts

### 4. Monitoring
- Monitor the SNS topic delivery success rate
- Set up alerts for webhook delivery failures

## Troubleshooting

### Common Issues

1. **Incidents Not Created**
   - Verify webhook URL is correct
   - Check SNS subscription status
   - Ensure CloudWatch alarms are in ALARM state

2. **Webhook Delivery Failures**
   - Check Zenduty service status
   - Verify network connectivity
   - Review SNS delivery logs

3. **False Positives**
   - Adjust alert thresholds
   - Increase evaluation periods
   - Use different metrics

### Debugging Steps

1. **Check SNS Topic**
   ```bash
   aws sns list-subscriptions-by-topic --topic-arn <your-topic-arn>
   ```

2. **Test Webhook**
   ```bash
   curl -X POST <zenduty-webhook-url> \
     -H "Content-Type: application/json" \
     -d '{"test": "message"}'
   ```

3. **Monitor CloudWatch Logs**
   - Check RDS instance logs for errors
   - Review CloudWatch alarm history

## Support

For issues with:
- **Zenduty Integration**: Contact Zenduty support
- **AWS CloudWatch**: Check AWS documentation
- **CDK Module**: Review this documentation or create an issue

## References

- [Zenduty AWS CloudWatch Integration Guide](https://zenduty.com/docs/aws-cloudwatch-integration/)
- [AWS CloudWatch Documentation](https://docs.aws.amazon.com/AmazonCloudWatch/)
- [AWS RDS Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/MonitoringOverview.html) 