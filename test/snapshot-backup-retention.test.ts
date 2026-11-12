import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { PostgresRDSCluster } from '../src';

function synthFromSnapshot(backupRetention?: number): Template {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack', {
    env: { account: '123456789012', region: 'ap-south-1' },
  });
  new PostgresRDSCluster(stack, 'Db', {
    clusterName: 'test-rds',
    network: { vpcId: 'vpc-12345', subnetsId: ['subnet-a', 'subnet-b'] },
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MEDIUM),
    databaseName: 'test',
    databaseMasterUserName: 'sc_master',
    postgresVersion: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_15_12 }),
    snapshotIdentifier: 'test-snapshot',
    backupRetention,
  });
  return Template.fromStack(stack);
}

test('snapshot-restored instance gets backupRetention when set', () => {
  synthFromSnapshot(7).hasResourceProperties('AWS::RDS::DBInstance', {
    DBSnapshotIdentifier: 'test-snapshot',
    BackupRetentionPeriod: 7,
  });
});

test('snapshot-restored instance leaves BackupRetentionPeriod unset when not given', () => {
  const instances = synthFromSnapshot().findResources('AWS::RDS::DBInstance');
  for (const instance of Object.values(instances)) {
    expect(instance.Properties.BackupRetentionPeriod).toBeUndefined();
  }
});
