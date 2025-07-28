const { AwsCdkConstructLibrary } = require('projen/lib/awscdk');
const { NpmAccess } = require('projen/lib/javascript');
const CDK_VERSION = '2.169.0';
const project = new AwsCdkConstructLibrary({
  author: 'Bharat Parmar',
  authorAddress: 'bharat.parmar@smallcase.com',
  cdkVersion: `${CDK_VERSION}`,
  cdkVersionPinning: false,
  constructsVersion: '10.0.5',
  constructsVersionPinning: false,
  releaseWorkflow: true,
  defaultReleaseBranch: 'master',
  release: true,
  packageName: '@smallcase/cdk-rds-module',
  name: '@smallcase/cdk-rds-module',
  jsiiVersion: '~5.8.0',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/smallcase/cdk-rds-module',
  devDeps: [
    `aws-cdk-lib@${CDK_VERSION}`,
  ],
  peerDeps: [
    `aws-cdk-lib@${CDK_VERSION}`,
  ],
  npmAccess: NpmAccess.PUBLIC,
  releaseToNpm: true,
  depsUpgradeOptions: {
    workflow: false,
  },
  githubOptions: {
    pullRequestLintOptions: {
      runsOn: 'arc-runner-set',
    },
  },
  // publishToPypi: {
  //   distName: 'cdk-rds-module',
  //   module: 'cdk_rds_module',
  // },
  // publishToGo: {
  //   gitUserName: 'sc-infra-bot',
  //   gitUserEmail: 'infra@smallcase.com',
  //   moduleName: 'github.com/smallcase/cdk-rds-module-go',
  // },
  releaseEveryCommit: true,
  licensed: true, /* Indicates if a license should be added. */
  dependabot: false, /* Include dependabot configuration. */
  mergify: false, /* Adds mergify configuration. */
  pullRequestTemplate: true, /* Include a GitHub pull request template. */
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();