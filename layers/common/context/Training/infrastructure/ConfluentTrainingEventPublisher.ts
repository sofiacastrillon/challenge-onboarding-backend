import { GetParametersCommand, SSMClient } from '@aws-sdk/client-ssm';
import { Kafka, Producer } from 'kafkajs';
import {
  COMPATIBILITY,
  SchemaRegistry,
  SchemaType,
} from '@kafkajs/confluent-schema-registry';
import { TrainingEventPublisher } from '../domain/TrainingEventPublisher';
import { ITrainingKafkaMessage } from '../domain/ITrainingKafkaMessage';
import { Env } from '../../../shared/domain/interfaces/IEnvironment';
import { getEnv } from '../../../utils/Utils';

const SSM_PARAMETERS = {
  apiKey: '/challenge-onboarding-sofia/confluent/api-key',
  apiSecret: '/challenge-onboarding-sofia/confluent/api-secret',
  schemaRegistryApiKey: '/challenge-onboarding-sofia/confluent/sr-api-key',
  schemaRegistryApiSecret:
    '/challenge-onboarding-sofia/confluent/sr-api-secret',
};

const TRAINING_EVENT_AVRO_SCHEMA = {
  type: 'record' as const,
  name: 'TrainingEvent',
  fields: [
    { name: 'text', type: 'string' },
    { name: 'eventType', type: 'string' },
    { name: 'datetime', type: 'string' },
    { name: 'timestamp', type: 'long' },
  ],
};

interface ConfluentSecrets {
  apiKey: string;
  apiSecret: string;
  schemaRegistryApiKey: string;
  schemaRegistryApiSecret: string;
}

export class ConfluentTrainingEventPublisher implements TrainingEventPublisher {
  private secrets?: ConfluentSecrets;
  private producer?: Producer;
  private registry?: SchemaRegistry;
  private schemaId?: number;

  async publish(message: ITrainingKafkaMessage): Promise<void> {
    const registry = await this.getRegistry();
    const schemaId = await this.getSchemaId(registry);
    const encoded = await registry.encode(schemaId, message);
    const producer = await this.getProducer();

    await producer.send({
      topic: this.requiredEnv(Env.KAFKA_TOPIC),
      messages: [{ value: encoded }],
    });
  }

  private async getRegistry(): Promise<SchemaRegistry> {
    if (this.registry) {
      return this.registry;
    }

    const secrets = await this.getSecrets();
    this.registry = new SchemaRegistry({
      host: this.requiredEnv(Env.CONFLUENT_SCHEMA_REGISTRY_URL),
      auth: {
        username: secrets.schemaRegistryApiKey,
        password: secrets.schemaRegistryApiSecret,
      },
    });

    return this.registry;
  }

  private async getSchemaId(registry: SchemaRegistry): Promise<number> {
    if (this.schemaId !== undefined) {
      return this.schemaId;
    }

    const topic = this.requiredEnv(Env.KAFKA_TOPIC);
    const registered = await registry.register(
      {
        type: SchemaType.AVRO,
        schema: JSON.stringify(TRAINING_EVENT_AVRO_SCHEMA),
      },
      {
        subject: `${topic}-value`,
        compatibility: COMPATIBILITY.BACKWARD,
      },
    );
    this.schemaId = registered.id;

    return this.schemaId;
  }

  private async getProducer(): Promise<Producer> {
    if (this.producer) {
      return this.producer;
    }

    const secrets = await this.getSecrets();
    const kafka = new Kafka({
      clientId: 'challenge-onboarding-sofia',
      brokers: [this.requiredEnv(Env.CONFLUENT_BOOTSTRAP_SERVER)],
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: secrets.apiKey,
        password: secrets.apiSecret,
      },
    });

    this.producer = kafka.producer();
    await this.producer.connect();

    return this.producer;
  }

  private async getSecrets(): Promise<ConfluentSecrets> {
    if (this.secrets) {
      return this.secrets;
    }

    const names = Object.values(SSM_PARAMETERS);
    const response = await new SSMClient({}).send(
      new GetParametersCommand({ Names: names, WithDecryption: true }),
    );

    const missing = response.InvalidParameters ?? [];
    if (missing.length > 0) {
      throw new Error(`Missing SSM parameters: ${missing.join(', ')}`);
    }

    const values = new Map(
      (response.Parameters ?? []).map(parameter => [
        parameter.Name,
        parameter.Value,
      ]),
    );

    const read = (name: string): string => {
      const value = values.get(name);
      if (!value) {
        throw new Error(`Missing SSM parameters: ${name}`);
      }
      return value;
    };

    this.secrets = {
      apiKey: read(SSM_PARAMETERS.apiKey),
      apiSecret: read(SSM_PARAMETERS.apiSecret),
      schemaRegistryApiKey: read(SSM_PARAMETERS.schemaRegistryApiKey),
      schemaRegistryApiSecret: read(SSM_PARAMETERS.schemaRegistryApiSecret),
    };

    return this.secrets;
  }

  private requiredEnv(key: Env): string {
    const value = getEnv(key);
    if (!value) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  }
}
