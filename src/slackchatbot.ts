import {
  aws_chatbot as chatbot,
  aws_iam as iam,
  aws_sns as sns,
  CfnOutput,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface SlackChatbotProps {
  readonly environmentName: string;
  readonly slackWorkspaceId: string;
  readonly slackChannelId: string;
  readonly notificationTopics: sns.ITopic[];
}

export class SlackChatbotIntegration extends Construct {
  public readonly slackChannel: chatbot.SlackChannelConfiguration;
  public readonly chatbotRole: iam.Role;

  constructor(scope: Construct, id: string, props: SlackChatbotProps) {
    super(scope, id);

    if (!props.slackWorkspaceId.startsWith('T')) {
      throw new Error('Slack Workspace ID must start with "T". Refer to Slack to obtain it.');
    }

    this.chatbotRole = new iam.Role(this, `${this.node.id}-ChatbotRole`, {
      assumedBy: new iam.ServicePrincipal('chatbot.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchReadOnlyAccess'),
      ],
      inlinePolicies: {
        'chatbot-cloudwatch-policy': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              actions: [
                'cloudwatch:DescribeAlarms',
                'cloudwatch:GetMetricData',
                'cloudwatch:GetMetricStatistics',
                'cloudwatch:ListMetrics',
              ],
              resources: ['*'], // You can restrict this further based on your naming
              effect: iam.Effect.ALLOW,
            }),
          ],
        }),
      },
    });

    this.slackChannel = new chatbot.SlackChannelConfiguration(this, `${this.node.id}-SlackChannelConfig`, {
      slackWorkspaceId: props.slackWorkspaceId,
      slackChannelId: props.slackChannelId,
      slackChannelConfigurationName: `${props.environmentName}-tracking-rds-alerts`,
      role: this.chatbotRole,
      notificationTopics: props.notificationTopics,
    });

    new CfnOutput(this, `${this.node.id}-SlackChatbotOutput`, {
      value: JSON.stringify({
        workspaceId: props.slackWorkspaceId,
        channelId: props.slackChannelId,
        configName: this.slackChannel.slackChannelConfigurationName,
      }, null, 2),
    });
  }
}
