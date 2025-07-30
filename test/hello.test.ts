import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { RDSMonitoring, AlertThresholds } from '../src';

test('RDS Monitoring Stack can be instantiated', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // Test that we can create a monitoring config
  const monitoringConfig = {
    clusterName: 'test-cluster',
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
    enableAlerts: true,
  };

  const monitoring = new RDSMonitoring(stack, 'TestMonitoring', monitoringConfig);

  expect(monitoring).toBeDefined();
  expect(monitoring.metricSnsTopic).toBeUndefined(); // No webhooks provided
});

test('AlertThresholds interface is properly defined', () => {
  const thresholds: AlertThresholds = {
    cpu: 80,
    memory: 2147483648, // 2GB
    readIops: 1000,
    writeIops: 2000,
    dbConnections: 80,
    diskQueueDepth: 5,
    freeStorage: 10737418240, // 10GB
    networkThroughput: 1048576, // 1MB/s
    replicationLag: 30000, // 30 seconds
  };

  expect(thresholds.cpu).toBe(80);
  expect(thresholds.memory).toBe(2147483648);
  expect(thresholds.readIops).toBe(1000);
});