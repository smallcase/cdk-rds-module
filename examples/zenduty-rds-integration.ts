import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PostgresRDSCluster } from '../src/rds';
import { SlackChatbotIntegration } from '../src/slackchatbot';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

export class ZendutyRDSIntegrationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Example VPC (replace with your actual VPC ID)
    const vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', {
      vpcId: 'vpc-12345678',
    });

    // Example subnets (replace with your actual subnet IDs)
    const subnets = ['subnet-12345678', 'subnet-87654321'];

    // Zenduty webhook URL from Zenduty dashboard
    // Get this from: Teams > Your Team > Services > Your Service > Integrations > AWS CloudWatch > Configure
    const zendutyWebhookUrl = 'https://www.zenduty.com/api/v1/integrations/aws-cloudwatch/your-webhook-url/';

    // Create RDS cluster with Zenduty integration
    const rdsCluster = new PostgresRDSCluster(this, 'ProductionRDS', {
      clusterName: 'production-postgres',
      network: {
        vpcId: vpc.vpcId,
        subnetsId: subnets,
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
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
      // Zenduty integration
      alertSubcriptionWebhooks: [zendutyWebhookUrl],
      // Optional: Read replicas
      readReplicas: {
        replicas: 2,
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
      },
      tags: {
        Environment: 'production',
        Service: 'database',
        Team: 'platform',
      },
    });

    // Optional: Also integrate with Slack chatbot for additional notifications
    const slackIntegration = new SlackChatbotIntegration(this, 'SlackChatbot', {
      environmentName: 'production',
      slackWorkspaceId: 'T1234567890', // Your Slack workspace ID
      slackChannelId: 'C1234567890',   // Your Slack channel ID
      notificationTopics: rdsCluster.metricSnsTopic ? [rdsCluster.metricSnsTopic] : [],
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

// Usage instructions:
/*
1. Set up Zenduty Integration:
   - Go to Zenduty dashboard
   - Navigate to Teams > Your Team > Services > Your Service
   - Go to Integrations > Add New Integration
   - Select "AWS CloudWatch" from the dropdown
   - Copy the webhook URL from the Configure section

2. Deploy this stack:
   ```bash
   cdk deploy ZendutyRDSIntegrationStack
   ```

3. Verify Integration:
   - Check that the SNS topic is created
   - Verify the HTTPS subscription to Zenduty webhook
   - Test by triggering one of the RDS alarms

4. Zenduty will automatically:
   - Create incidents for ALARM/INSUFFICIENT states
   - Auto-resolve incidents for OK state
   - Route alerts to the right team based on on-call schedules
   - Send notifications via email, SMS, phone calls, Slack, etc.

5. Available RDS Alerts:
   - CPU utilization > 90%
   - Free storage space < 10GB
   - Free memory < 2GB
   - Read/Write IOPS thresholds
   - Disk queue depth > 5
   - Database connections > 80%
   - Network throughput > 1MB/s
   - Replication lag > 30 seconds (if multi-AZ)
   - Backup storage usage: Dynamic threshold based on retention period
     - 7 days retention: > 70%
     - Longer retention: increases by 2% per additional day (max 85%)
   - All read replica metrics (if configured)
*/ 