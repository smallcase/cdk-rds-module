# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### PostgresRDSCluster <a name="PostgresRDSCluster" id="@smallcase/cdk-rds-module.PostgresRDSCluster"></a>

#### Initializers <a name="Initializers" id="@smallcase/cdk-rds-module.PostgresRDSCluster.Initializer"></a>

```typescript
import { PostgresRDSCluster } from '@smallcase/cdk-rds-module'

new PostgresRDSCluster(scope: Construct, id: string, props: PostgresProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.Initializer.parameter.props">props</a></code> | <code><a href="#@smallcase/cdk-rds-module.PostgresProps">PostgresProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@smallcase/cdk-rds-module.PostgresRDSCluster.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@smallcase/cdk-rds-module.PostgresRDSCluster.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@smallcase/cdk-rds-module.PostgresRDSCluster.Initializer.parameter.props"></a>

- *Type:* <a href="#@smallcase/cdk-rds-module.PostgresProps">PostgresProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@smallcase/cdk-rds-module.PostgresRDSCluster.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@smallcase/cdk-rds-module.PostgresRDSCluster.isConstruct"></a>

```typescript
import { PostgresRDSCluster } from '@smallcase/cdk-rds-module'

PostgresRDSCluster.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@smallcase/cdk-rds-module.PostgresRDSCluster.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.property.readReplicas">readReplicas</a></code> | <code>aws-cdk-lib.aws_rds.DatabaseInstanceReadReplica[]</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.property.securityGroup">securityGroup</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresRDSCluster.property.metricSnsTopic">metricSnsTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@smallcase/cdk-rds-module.PostgresRDSCluster.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `readReplicas`<sup>Required</sup> <a name="readReplicas" id="@smallcase/cdk-rds-module.PostgresRDSCluster.property.readReplicas"></a>

```typescript
public readonly readReplicas: DatabaseInstanceReadReplica[];
```

- *Type:* aws-cdk-lib.aws_rds.DatabaseInstanceReadReplica[]

---

##### `securityGroup`<sup>Required</sup> <a name="securityGroup" id="@smallcase/cdk-rds-module.PostgresRDSCluster.property.securityGroup"></a>

```typescript
public readonly securityGroup: ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup

---

##### `metricSnsTopic`<sup>Optional</sup> <a name="metricSnsTopic" id="@smallcase/cdk-rds-module.PostgresRDSCluster.property.metricSnsTopic"></a>

```typescript
public readonly metricSnsTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

---


### RDSMonitoring <a name="RDSMonitoring" id="@smallcase/cdk-rds-module.RDSMonitoring"></a>

#### Initializers <a name="Initializers" id="@smallcase/cdk-rds-module.RDSMonitoring.Initializer"></a>

```typescript
import { RDSMonitoring } from '@smallcase/cdk-rds-module'

new RDSMonitoring(scope: Construct, id: string, config: MonitoringConfig)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.Initializer.parameter.config">config</a></code> | <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig">MonitoringConfig</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@smallcase/cdk-rds-module.RDSMonitoring.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@smallcase/cdk-rds-module.RDSMonitoring.Initializer.parameter.id"></a>

- *Type:* string

---

##### `config`<sup>Required</sup> <a name="config" id="@smallcase/cdk-rds-module.RDSMonitoring.Initializer.parameter.config"></a>

- *Type:* <a href="#@smallcase/cdk-rds-module.MonitoringConfig">MonitoringConfig</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.createPrimaryMonitoring">createPrimaryMonitoring</a></code> | Create all monitoring for primary instance. |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.createReplicaMonitoring">createReplicaMonitoring</a></code> | Create all monitoring for read replicas. |

---

##### `toString` <a name="toString" id="@smallcase/cdk-rds-module.RDSMonitoring.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `createPrimaryMonitoring` <a name="createPrimaryMonitoring" id="@smallcase/cdk-rds-module.RDSMonitoring.createPrimaryMonitoring"></a>

```typescript
public createPrimaryMonitoring(primaryInstance: DatabaseInstance): void
```

Create all monitoring for primary instance.

###### `primaryInstance`<sup>Required</sup> <a name="primaryInstance" id="@smallcase/cdk-rds-module.RDSMonitoring.createPrimaryMonitoring.parameter.primaryInstance"></a>

- *Type:* aws-cdk-lib.aws_rds.DatabaseInstance

---

##### `createReplicaMonitoring` <a name="createReplicaMonitoring" id="@smallcase/cdk-rds-module.RDSMonitoring.createReplicaMonitoring"></a>

```typescript
public createReplicaMonitoring(replicaInstance: DatabaseInstanceReadReplica, replicaIndex: number): void
```

Create all monitoring for read replicas.

###### `replicaInstance`<sup>Required</sup> <a name="replicaInstance" id="@smallcase/cdk-rds-module.RDSMonitoring.createReplicaMonitoring.parameter.replicaInstance"></a>

- *Type:* aws-cdk-lib.aws_rds.DatabaseInstanceReadReplica

---

###### `replicaIndex`<sup>Required</sup> <a name="replicaIndex" id="@smallcase/cdk-rds-module.RDSMonitoring.createReplicaMonitoring.parameter.replicaIndex"></a>

- *Type:* number

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@smallcase/cdk-rds-module.RDSMonitoring.isConstruct"></a>

```typescript
import { RDSMonitoring } from '@smallcase/cdk-rds-module'

RDSMonitoring.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@smallcase/cdk-rds-module.RDSMonitoring.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@smallcase/cdk-rds-module.RDSMonitoring.property.metricSnsTopic">metricSnsTopic</a></code> | <code>aws-cdk-lib.aws_sns.ITopic</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@smallcase/cdk-rds-module.RDSMonitoring.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `metricSnsTopic`<sup>Optional</sup> <a name="metricSnsTopic" id="@smallcase/cdk-rds-module.RDSMonitoring.property.metricSnsTopic"></a>

```typescript
public readonly metricSnsTopic: ITopic;
```

- *Type:* aws-cdk-lib.aws_sns.ITopic

---


### SlackChatbotIntegration <a name="SlackChatbotIntegration" id="@smallcase/cdk-rds-module.SlackChatbotIntegration"></a>

#### Initializers <a name="Initializers" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.Initializer"></a>

```typescript
import { SlackChatbotIntegration } from '@smallcase/cdk-rds-module'

new SlackChatbotIntegration(scope: Construct, id: string, props: SlackChatbotProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.Initializer.parameter.props">props</a></code> | <code><a href="#@smallcase/cdk-rds-module.SlackChatbotProps">SlackChatbotProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.Initializer.parameter.props"></a>

- *Type:* <a href="#@smallcase/cdk-rds-module.SlackChatbotProps">SlackChatbotProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.isConstruct"></a>

```typescript
import { SlackChatbotIntegration } from '@smallcase/cdk-rds-module'

SlackChatbotIntegration.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.property.chatbotRole">chatbotRole</a></code> | <code>aws-cdk-lib.aws_iam.Role</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotIntegration.property.slackChannel">slackChannel</a></code> | <code>aws-cdk-lib.aws_chatbot.SlackChannelConfiguration</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `chatbotRole`<sup>Required</sup> <a name="chatbotRole" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.property.chatbotRole"></a>

```typescript
public readonly chatbotRole: Role;
```

- *Type:* aws-cdk-lib.aws_iam.Role

---

##### `slackChannel`<sup>Required</sup> <a name="slackChannel" id="@smallcase/cdk-rds-module.SlackChatbotIntegration.property.slackChannel"></a>

```typescript
public readonly slackChannel: SlackChannelConfiguration;
```

- *Type:* aws-cdk-lib.aws_chatbot.SlackChannelConfiguration

---


## Structs <a name="Structs" id="Structs"></a>

### AlertThresholds <a name="AlertThresholds" id="@smallcase/cdk-rds-module.AlertThresholds"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.AlertThresholds.Initializer"></a>

```typescript
import { AlertThresholds } from '@smallcase/cdk-rds-module'

const alertThresholds: AlertThresholds = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.cpu">cpu</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.dbConnections">dbConnections</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.diskQueueDepth">diskQueueDepth</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.freeStorage">freeStorage</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.memory">memory</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.networkThroughput">networkThroughput</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.readIops">readIops</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.replicationLag">replicationLag</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.AlertThresholds.property.writeIops">writeIops</a></code> | <code>number</code> | *No description.* |

---

##### `cpu`<sup>Optional</sup> <a name="cpu" id="@smallcase/cdk-rds-module.AlertThresholds.property.cpu"></a>

```typescript
public readonly cpu: number;
```

- *Type:* number

---

##### `dbConnections`<sup>Optional</sup> <a name="dbConnections" id="@smallcase/cdk-rds-module.AlertThresholds.property.dbConnections"></a>

```typescript
public readonly dbConnections: number;
```

- *Type:* number

---

##### `diskQueueDepth`<sup>Optional</sup> <a name="diskQueueDepth" id="@smallcase/cdk-rds-module.AlertThresholds.property.diskQueueDepth"></a>

```typescript
public readonly diskQueueDepth: number;
```

- *Type:* number

---

##### `freeStorage`<sup>Optional</sup> <a name="freeStorage" id="@smallcase/cdk-rds-module.AlertThresholds.property.freeStorage"></a>

```typescript
public readonly freeStorage: number;
```

- *Type:* number

---

##### `memory`<sup>Optional</sup> <a name="memory" id="@smallcase/cdk-rds-module.AlertThresholds.property.memory"></a>

```typescript
public readonly memory: number;
```

- *Type:* number

---

##### `networkThroughput`<sup>Optional</sup> <a name="networkThroughput" id="@smallcase/cdk-rds-module.AlertThresholds.property.networkThroughput"></a>

```typescript
public readonly networkThroughput: number;
```

- *Type:* number

---

##### `readIops`<sup>Optional</sup> <a name="readIops" id="@smallcase/cdk-rds-module.AlertThresholds.property.readIops"></a>

```typescript
public readonly readIops: number;
```

- *Type:* number

---

##### `replicationLag`<sup>Optional</sup> <a name="replicationLag" id="@smallcase/cdk-rds-module.AlertThresholds.property.replicationLag"></a>

```typescript
public readonly replicationLag: number;
```

- *Type:* number

---

##### `writeIops`<sup>Optional</sup> <a name="writeIops" id="@smallcase/cdk-rds-module.AlertThresholds.property.writeIops"></a>

```typescript
public readonly writeIops: number;
```

- *Type:* number

---

### IngressRule <a name="IngressRule" id="@smallcase/cdk-rds-module.IngressRule"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.IngressRule.Initializer"></a>

```typescript
import { IngressRule } from '@smallcase/cdk-rds-module'

const ingressRule: IngressRule = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.IngressRule.property.connection">connection</a></code> | <code>aws-cdk-lib.aws_ec2.Port</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.IngressRule.property.peer">peer</a></code> | <code>aws-cdk-lib.aws_ec2.IPeer \| aws-cdk-lib.aws_ec2.ISecurityGroup</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.IngressRule.property.description">description</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.IngressRule.property.remoteRule">remoteRule</a></code> | <code>boolean</code> | *No description.* |

---

##### `connection`<sup>Required</sup> <a name="connection" id="@smallcase/cdk-rds-module.IngressRule.property.connection"></a>

```typescript
public readonly connection: Port;
```

- *Type:* aws-cdk-lib.aws_ec2.Port

---

##### `peer`<sup>Required</sup> <a name="peer" id="@smallcase/cdk-rds-module.IngressRule.property.peer"></a>

```typescript
public readonly peer: IPeer | ISecurityGroup;
```

- *Type:* aws-cdk-lib.aws_ec2.IPeer | aws-cdk-lib.aws_ec2.ISecurityGroup

---

##### `description`<sup>Optional</sup> <a name="description" id="@smallcase/cdk-rds-module.IngressRule.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

---

##### `remoteRule`<sup>Optional</sup> <a name="remoteRule" id="@smallcase/cdk-rds-module.IngressRule.property.remoteRule"></a>

```typescript
public readonly remoteRule: boolean;
```

- *Type:* boolean

---

### InternalRole <a name="InternalRole" id="@smallcase/cdk-rds-module.InternalRole"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.InternalRole.Initializer"></a>

```typescript
import { InternalRole } from '@smallcase/cdk-rds-module'

const internalRole: InternalRole = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.InternalRole.property.type">type</a></code> | <code><a href="#@smallcase/cdk-rds-module.ResourceType">ResourceType</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.InternalRole.property.roleArn">roleArn</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.InternalRole.property.roleProps">roleProps</a></code> | <code>aws-cdk-lib.aws_iam.RoleProps</code> | *No description.* |

---

##### `type`<sup>Required</sup> <a name="type" id="@smallcase/cdk-rds-module.InternalRole.property.type"></a>

```typescript
public readonly type: ResourceType;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.ResourceType">ResourceType</a>

---

##### `roleArn`<sup>Optional</sup> <a name="roleArn" id="@smallcase/cdk-rds-module.InternalRole.property.roleArn"></a>

```typescript
public readonly roleArn: string;
```

- *Type:* string

---

##### `roleProps`<sup>Optional</sup> <a name="roleProps" id="@smallcase/cdk-rds-module.InternalRole.property.roleProps"></a>

```typescript
public readonly roleProps: RoleProps;
```

- *Type:* aws-cdk-lib.aws_iam.RoleProps

---

### MonitoringConfig <a name="MonitoringConfig" id="@smallcase/cdk-rds-module.MonitoringConfig"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.MonitoringConfig.Initializer"></a>

```typescript
import { MonitoringConfig } from '@smallcase/cdk-rds-module'

const monitoringConfig: MonitoringConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.clusterName">clusterName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.alertSubcriptionWebhooks">alertSubcriptionWebhooks</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.backupRetention">backupRetention</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.enableAlerts">enableAlerts</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.metricTopicName">metricTopicName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.multiAz">multiAz</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.primaryAlertThresholds">primaryAlertThresholds</a></code> | <code><a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.readReplicas">readReplicas</a></code> | <code><a href="#@smallcase/cdk-rds-module.ReadReplicaConfig">ReadReplicaConfig</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.MonitoringConfig.property.replicaAlertThresholds">replicaAlertThresholds</a></code> | <code><a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a></code> | *No description.* |

---

##### `clusterName`<sup>Required</sup> <a name="clusterName" id="@smallcase/cdk-rds-module.MonitoringConfig.property.clusterName"></a>

```typescript
public readonly clusterName: string;
```

- *Type:* string

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="@smallcase/cdk-rds-module.MonitoringConfig.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

---

##### `alertSubcriptionWebhooks`<sup>Optional</sup> <a name="alertSubcriptionWebhooks" id="@smallcase/cdk-rds-module.MonitoringConfig.property.alertSubcriptionWebhooks"></a>

```typescript
public readonly alertSubcriptionWebhooks: string[];
```

- *Type:* string[]

---

##### `backupRetention`<sup>Optional</sup> <a name="backupRetention" id="@smallcase/cdk-rds-module.MonitoringConfig.property.backupRetention"></a>

```typescript
public readonly backupRetention: number;
```

- *Type:* number

---

##### `enableAlerts`<sup>Optional</sup> <a name="enableAlerts" id="@smallcase/cdk-rds-module.MonitoringConfig.property.enableAlerts"></a>

```typescript
public readonly enableAlerts: boolean;
```

- *Type:* boolean

---

##### `metricTopicName`<sup>Optional</sup> <a name="metricTopicName" id="@smallcase/cdk-rds-module.MonitoringConfig.property.metricTopicName"></a>

```typescript
public readonly metricTopicName: string;
```

- *Type:* string

---

##### `multiAz`<sup>Optional</sup> <a name="multiAz" id="@smallcase/cdk-rds-module.MonitoringConfig.property.multiAz"></a>

```typescript
public readonly multiAz: boolean;
```

- *Type:* boolean

---

##### `primaryAlertThresholds`<sup>Optional</sup> <a name="primaryAlertThresholds" id="@smallcase/cdk-rds-module.MonitoringConfig.property.primaryAlertThresholds"></a>

```typescript
public readonly primaryAlertThresholds: AlertThresholds;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a>

---

##### `readReplicas`<sup>Optional</sup> <a name="readReplicas" id="@smallcase/cdk-rds-module.MonitoringConfig.property.readReplicas"></a>

```typescript
public readonly readReplicas: ReadReplicaConfig;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.ReadReplicaConfig">ReadReplicaConfig</a>

---

##### `replicaAlertThresholds`<sup>Optional</sup> <a name="replicaAlertThresholds" id="@smallcase/cdk-rds-module.MonitoringConfig.property.replicaAlertThresholds"></a>

```typescript
public readonly replicaAlertThresholds: AlertThresholds;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a>

---

### Network <a name="Network" id="@smallcase/cdk-rds-module.Network"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.Network.Initializer"></a>

```typescript
import { Network } from '@smallcase/cdk-rds-module'

const network: Network = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.Network.property.subnetsId">subnetsId</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.Network.property.vpcId">vpcId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.Network.property.existingSecurityGroupId">existingSecurityGroupId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.Network.property.ingressSgRule">ingressSgRule</a></code> | <code><a href="#@smallcase/cdk-rds-module.IngressRule">IngressRule</a>[]</code> | *No description.* |

---

##### `subnetsId`<sup>Required</sup> <a name="subnetsId" id="@smallcase/cdk-rds-module.Network.property.subnetsId"></a>

```typescript
public readonly subnetsId: string[];
```

- *Type:* string[]

---

##### `vpcId`<sup>Required</sup> <a name="vpcId" id="@smallcase/cdk-rds-module.Network.property.vpcId"></a>

```typescript
public readonly vpcId: string;
```

- *Type:* string

---

##### `existingSecurityGroupId`<sup>Optional</sup> <a name="existingSecurityGroupId" id="@smallcase/cdk-rds-module.Network.property.existingSecurityGroupId"></a>

```typescript
public readonly existingSecurityGroupId: string;
```

- *Type:* string

---

##### `ingressSgRule`<sup>Optional</sup> <a name="ingressSgRule" id="@smallcase/cdk-rds-module.Network.property.ingressSgRule"></a>

```typescript
public readonly ingressSgRule: IngressRule[];
```

- *Type:* <a href="#@smallcase/cdk-rds-module.IngressRule">IngressRule</a>[]

---

### PostgresProps <a name="PostgresProps" id="@smallcase/cdk-rds-module.PostgresProps"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.PostgresProps.Initializer"></a>

```typescript
import { PostgresProps } from '@smallcase/cdk-rds-module'

const postgresProps: PostgresProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.clusterName">clusterName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.databaseMasterUserName">databaseMasterUserName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.databaseName">databaseName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.network">network</a></code> | <code><a href="#@smallcase/cdk-rds-module.Network">Network</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.postgresVersion">postgresVersion</a></code> | <code>aws-cdk-lib.aws_rds.IInstanceEngine</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.alertSubcriptionWebhooks">alertSubcriptionWebhooks</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.allocatedStorage">allocatedStorage</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.allowMajorVersionUpgrade">allowMajorVersionUpgrade</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.autoMinorVersionUpgrade">autoMinorVersionUpgrade</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.backupRetention">backupRetention</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.deletionProtection">deletionProtection</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.enableAlerts">enableAlerts</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.enablePerformanceInsights">enablePerformanceInsights</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.maxAllocatedStorage">maxAllocatedStorage</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.metricTopicName">metricTopicName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.monitoringInterval">monitoringInterval</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.multiAz">multiAz</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.parameters">parameters</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.performanceInsightRetention">performanceInsightRetention</a></code> | <code>aws-cdk-lib.aws_rds.PerformanceInsightRetention</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.primaryAlertThresholds">primaryAlertThresholds</a></code> | <code><a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.publiclyAccessible">publiclyAccessible</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.readReplicas">readReplicas</a></code> | <code><a href="#@smallcase/cdk-rds-module.ReadReplica">ReadReplica</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.replicaAlertThresholds">replicaAlertThresholds</a></code> | <code><a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.replicaAllocatedStorage">replicaAllocatedStorage</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.replicaMaxAllocatedStorage">replicaMaxAllocatedStorage</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.snapshotIdentifier">snapshotIdentifier</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.snsTopicCreate">snsTopicCreate</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.storageEncrypted">storageEncrypted</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.storageType">storageType</a></code> | <code>aws-cdk-lib.aws_rds.StorageType</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.PostgresProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `clusterName`<sup>Required</sup> <a name="clusterName" id="@smallcase/cdk-rds-module.PostgresProps.property.clusterName"></a>

```typescript
public readonly clusterName: string;
```

- *Type:* string

---

##### `databaseMasterUserName`<sup>Required</sup> <a name="databaseMasterUserName" id="@smallcase/cdk-rds-module.PostgresProps.property.databaseMasterUserName"></a>

```typescript
public readonly databaseMasterUserName: string;
```

- *Type:* string

---

##### `databaseName`<sup>Required</sup> <a name="databaseName" id="@smallcase/cdk-rds-module.PostgresProps.property.databaseName"></a>

```typescript
public readonly databaseName: string;
```

- *Type:* string

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="@smallcase/cdk-rds-module.PostgresProps.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

---

##### `network`<sup>Required</sup> <a name="network" id="@smallcase/cdk-rds-module.PostgresProps.property.network"></a>

```typescript
public readonly network: Network;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.Network">Network</a>

---

##### `postgresVersion`<sup>Required</sup> <a name="postgresVersion" id="@smallcase/cdk-rds-module.PostgresProps.property.postgresVersion"></a>

```typescript
public readonly postgresVersion: IInstanceEngine;
```

- *Type:* aws-cdk-lib.aws_rds.IInstanceEngine

---

##### `alertSubcriptionWebhooks`<sup>Optional</sup> <a name="alertSubcriptionWebhooks" id="@smallcase/cdk-rds-module.PostgresProps.property.alertSubcriptionWebhooks"></a>

```typescript
public readonly alertSubcriptionWebhooks: string[];
```

- *Type:* string[]

---

##### `allocatedStorage`<sup>Optional</sup> <a name="allocatedStorage" id="@smallcase/cdk-rds-module.PostgresProps.property.allocatedStorage"></a>

```typescript
public readonly allocatedStorage: number;
```

- *Type:* number

---

##### `allowMajorVersionUpgrade`<sup>Optional</sup> <a name="allowMajorVersionUpgrade" id="@smallcase/cdk-rds-module.PostgresProps.property.allowMajorVersionUpgrade"></a>

```typescript
public readonly allowMajorVersionUpgrade: boolean;
```

- *Type:* boolean

---

##### `autoMinorVersionUpgrade`<sup>Optional</sup> <a name="autoMinorVersionUpgrade" id="@smallcase/cdk-rds-module.PostgresProps.property.autoMinorVersionUpgrade"></a>

```typescript
public readonly autoMinorVersionUpgrade: boolean;
```

- *Type:* boolean

---

##### `backupRetention`<sup>Optional</sup> <a name="backupRetention" id="@smallcase/cdk-rds-module.PostgresProps.property.backupRetention"></a>

```typescript
public readonly backupRetention: number;
```

- *Type:* number

---

##### `deletionProtection`<sup>Optional</sup> <a name="deletionProtection" id="@smallcase/cdk-rds-module.PostgresProps.property.deletionProtection"></a>

```typescript
public readonly deletionProtection: boolean;
```

- *Type:* boolean

---

##### `enableAlerts`<sup>Optional</sup> <a name="enableAlerts" id="@smallcase/cdk-rds-module.PostgresProps.property.enableAlerts"></a>

```typescript
public readonly enableAlerts: boolean;
```

- *Type:* boolean

---

##### `enablePerformanceInsights`<sup>Optional</sup> <a name="enablePerformanceInsights" id="@smallcase/cdk-rds-module.PostgresProps.property.enablePerformanceInsights"></a>

```typescript
public readonly enablePerformanceInsights: boolean;
```

- *Type:* boolean

---

##### `maxAllocatedStorage`<sup>Optional</sup> <a name="maxAllocatedStorage" id="@smallcase/cdk-rds-module.PostgresProps.property.maxAllocatedStorage"></a>

```typescript
public readonly maxAllocatedStorage: number;
```

- *Type:* number

---

##### `metricTopicName`<sup>Optional</sup> <a name="metricTopicName" id="@smallcase/cdk-rds-module.PostgresProps.property.metricTopicName"></a>

```typescript
public readonly metricTopicName: string;
```

- *Type:* string

---

##### `monitoringInterval`<sup>Optional</sup> <a name="monitoringInterval" id="@smallcase/cdk-rds-module.PostgresProps.property.monitoringInterval"></a>

```typescript
public readonly monitoringInterval: number;
```

- *Type:* number

---

##### `multiAz`<sup>Optional</sup> <a name="multiAz" id="@smallcase/cdk-rds-module.PostgresProps.property.multiAz"></a>

```typescript
public readonly multiAz: boolean;
```

- *Type:* boolean

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="@smallcase/cdk-rds-module.PostgresProps.property.parameters"></a>

```typescript
public readonly parameters: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

##### `performanceInsightRetention`<sup>Optional</sup> <a name="performanceInsightRetention" id="@smallcase/cdk-rds-module.PostgresProps.property.performanceInsightRetention"></a>

```typescript
public readonly performanceInsightRetention: PerformanceInsightRetention;
```

- *Type:* aws-cdk-lib.aws_rds.PerformanceInsightRetention

---

##### `primaryAlertThresholds`<sup>Optional</sup> <a name="primaryAlertThresholds" id="@smallcase/cdk-rds-module.PostgresProps.property.primaryAlertThresholds"></a>

```typescript
public readonly primaryAlertThresholds: AlertThresholds;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a>

---

##### `publiclyAccessible`<sup>Optional</sup> <a name="publiclyAccessible" id="@smallcase/cdk-rds-module.PostgresProps.property.publiclyAccessible"></a>

```typescript
public readonly publiclyAccessible: boolean;
```

- *Type:* boolean

---

##### `readReplicas`<sup>Optional</sup> <a name="readReplicas" id="@smallcase/cdk-rds-module.PostgresProps.property.readReplicas"></a>

```typescript
public readonly readReplicas: ReadReplica;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.ReadReplica">ReadReplica</a>

---

##### `replicaAlertThresholds`<sup>Optional</sup> <a name="replicaAlertThresholds" id="@smallcase/cdk-rds-module.PostgresProps.property.replicaAlertThresholds"></a>

```typescript
public readonly replicaAlertThresholds: AlertThresholds;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a>

---

##### `replicaAllocatedStorage`<sup>Optional</sup> <a name="replicaAllocatedStorage" id="@smallcase/cdk-rds-module.PostgresProps.property.replicaAllocatedStorage"></a>

```typescript
public readonly replicaAllocatedStorage: number;
```

- *Type:* number

---

##### `replicaMaxAllocatedStorage`<sup>Optional</sup> <a name="replicaMaxAllocatedStorage" id="@smallcase/cdk-rds-module.PostgresProps.property.replicaMaxAllocatedStorage"></a>

```typescript
public readonly replicaMaxAllocatedStorage: number;
```

- *Type:* number

---

##### `snapshotIdentifier`<sup>Optional</sup> <a name="snapshotIdentifier" id="@smallcase/cdk-rds-module.PostgresProps.property.snapshotIdentifier"></a>

```typescript
public readonly snapshotIdentifier: string;
```

- *Type:* string

---

##### `snsTopicCreate`<sup>Optional</sup> <a name="snsTopicCreate" id="@smallcase/cdk-rds-module.PostgresProps.property.snsTopicCreate"></a>

```typescript
public readonly snsTopicCreate: boolean;
```

- *Type:* boolean

---

##### `storageEncrypted`<sup>Optional</sup> <a name="storageEncrypted" id="@smallcase/cdk-rds-module.PostgresProps.property.storageEncrypted"></a>

```typescript
public readonly storageEncrypted: boolean;
```

- *Type:* boolean

---

##### `storageType`<sup>Optional</sup> <a name="storageType" id="@smallcase/cdk-rds-module.PostgresProps.property.storageType"></a>

```typescript
public readonly storageType: StorageType;
```

- *Type:* aws-cdk-lib.aws_rds.StorageType

---

##### `tags`<sup>Optional</sup> <a name="tags" id="@smallcase/cdk-rds-module.PostgresProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### ReadReplica <a name="ReadReplica" id="@smallcase/cdk-rds-module.ReadReplica"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.ReadReplica.Initializer"></a>

```typescript
import { ReadReplica } from '@smallcase/cdk-rds-module'

const readReplica: ReadReplica = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.ReadReplica.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.ReadReplica.property.replicas">replicas</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.ReadReplica.property.alertThresholds">alertThresholds</a></code> | <code><a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.ReadReplica.property.parameters">parameters</a></code> | <code>{[ key: string ]: string}</code> | *No description.* |

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="@smallcase/cdk-rds-module.ReadReplica.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

---

##### `replicas`<sup>Required</sup> <a name="replicas" id="@smallcase/cdk-rds-module.ReadReplica.property.replicas"></a>

```typescript
public readonly replicas: number;
```

- *Type:* number

---

##### `alertThresholds`<sup>Optional</sup> <a name="alertThresholds" id="@smallcase/cdk-rds-module.ReadReplica.property.alertThresholds"></a>

```typescript
public readonly alertThresholds: AlertThresholds;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a>

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="@smallcase/cdk-rds-module.ReadReplica.property.parameters"></a>

```typescript
public readonly parameters: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

---

### ReadReplicaConfig <a name="ReadReplicaConfig" id="@smallcase/cdk-rds-module.ReadReplicaConfig"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.ReadReplicaConfig.Initializer"></a>

```typescript
import { ReadReplicaConfig } from '@smallcase/cdk-rds-module'

const readReplicaConfig: ReadReplicaConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.ReadReplicaConfig.property.instanceType">instanceType</a></code> | <code>aws-cdk-lib.aws_ec2.InstanceType</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.ReadReplicaConfig.property.replicas">replicas</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.ReadReplicaConfig.property.alertThresholds">alertThresholds</a></code> | <code><a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a></code> | *No description.* |

---

##### `instanceType`<sup>Required</sup> <a name="instanceType" id="@smallcase/cdk-rds-module.ReadReplicaConfig.property.instanceType"></a>

```typescript
public readonly instanceType: InstanceType;
```

- *Type:* aws-cdk-lib.aws_ec2.InstanceType

---

##### `replicas`<sup>Required</sup> <a name="replicas" id="@smallcase/cdk-rds-module.ReadReplicaConfig.property.replicas"></a>

```typescript
public readonly replicas: number;
```

- *Type:* number

---

##### `alertThresholds`<sup>Optional</sup> <a name="alertThresholds" id="@smallcase/cdk-rds-module.ReadReplicaConfig.property.alertThresholds"></a>

```typescript
public readonly alertThresholds: AlertThresholds;
```

- *Type:* <a href="#@smallcase/cdk-rds-module.AlertThresholds">AlertThresholds</a>

---

### SlackChatbotProps <a name="SlackChatbotProps" id="@smallcase/cdk-rds-module.SlackChatbotProps"></a>

#### Initializer <a name="Initializer" id="@smallcase/cdk-rds-module.SlackChatbotProps.Initializer"></a>

```typescript
import { SlackChatbotProps } from '@smallcase/cdk-rds-module'

const slackChatbotProps: SlackChatbotProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotProps.property.notificationTopics">notificationTopics</a></code> | <code>aws-cdk-lib.aws_sns.ITopic[]</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotProps.property.slackChannelConfigurationName">slackChannelConfigurationName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotProps.property.slackChannelId">slackChannelId</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.SlackChatbotProps.property.slackWorkspaceId">slackWorkspaceId</a></code> | <code>string</code> | *No description.* |

---

##### `notificationTopics`<sup>Required</sup> <a name="notificationTopics" id="@smallcase/cdk-rds-module.SlackChatbotProps.property.notificationTopics"></a>

```typescript
public readonly notificationTopics: ITopic[];
```

- *Type:* aws-cdk-lib.aws_sns.ITopic[]

---

##### `slackChannelConfigurationName`<sup>Required</sup> <a name="slackChannelConfigurationName" id="@smallcase/cdk-rds-module.SlackChatbotProps.property.slackChannelConfigurationName"></a>

```typescript
public readonly slackChannelConfigurationName: string;
```

- *Type:* string

---

##### `slackChannelId`<sup>Required</sup> <a name="slackChannelId" id="@smallcase/cdk-rds-module.SlackChatbotProps.property.slackChannelId"></a>

```typescript
public readonly slackChannelId: string;
```

- *Type:* string

---

##### `slackWorkspaceId`<sup>Required</sup> <a name="slackWorkspaceId" id="@smallcase/cdk-rds-module.SlackChatbotProps.property.slackWorkspaceId"></a>

```typescript
public readonly slackWorkspaceId: string;
```

- *Type:* string

---



## Enums <a name="Enums" id="Enums"></a>

### ResourceType <a name="ResourceType" id="@smallcase/cdk-rds-module.ResourceType"></a>

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@smallcase/cdk-rds-module.ResourceType.NEW">NEW</a></code> | *No description.* |
| <code><a href="#@smallcase/cdk-rds-module.ResourceType.EXISTING">EXISTING</a></code> | *No description.* |

---

##### `NEW` <a name="NEW" id="@smallcase/cdk-rds-module.ResourceType.NEW"></a>

---


##### `EXISTING` <a name="EXISTING" id="@smallcase/cdk-rds-module.ResourceType.EXISTING"></a>

---

