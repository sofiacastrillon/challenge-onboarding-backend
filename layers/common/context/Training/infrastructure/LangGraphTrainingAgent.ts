import { GetParameterCommand, SSMClient } from '@aws-sdk/client-ssm';
import { ChatOpenAI } from '@langchain/openai';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';
import { z } from 'zod';
import { TrainingAgent, TrainingAgentReply } from '../domain/TrainingAgent';
import { TRAINING_INTENTS, TrainingIntent } from '../domain/TrainingIntent';

export const TRAINING_AGENT_API_KEY_PARAM =
  '/challenge-onboarding-sofia/agent/api-key';

const DEFAULT_MODEL = 'openai/gpt-4.1-mini';
const LITELLM_BASE_URL = 'https://alegra-litellm.alegra.com/v1';

const AgentState = Annotation.Root({
  message: Annotation<string>,
  intent: Annotation<TrainingIntent>,
  reply: Annotation<string>,
});

type AgentGraph = {
  invoke(input: { message: string }): Promise<TrainingAgentReply>;
};

/**
 * Two-node graph: classify the WhatsApp message, then write a short reply.
 * The model key is read from SSM and is never stored in source.
 */
export class LangGraphTrainingAgent implements TrainingAgent {
  private apiKey?: string;

  private graph?: AgentGraph;

  async run(message: string): Promise<TrainingAgentReply> {
    const graph = await this.getGraph();
    const result = await graph.invoke({ message });

    const parsed = z
      .object({
        intent: z.enum(TRAINING_INTENTS),
        reply: z.string().trim().min(1),
      })
      .safeParse(result);

    if (!parsed.success) {
      throw new Error('Training agent returned an invalid intent or reply');
    }

    return parsed.data;
  }

  private async getGraph(): Promise<AgentGraph> {
    if (this.graph) {
      return this.graph;
    }

    const model = new ChatOpenAI({
      model: process.env.TRAINING_AGENT_MODEL || DEFAULT_MODEL,
      apiKey: await this.getApiKey(),
      configuration: { baseURL: LITELLM_BASE_URL },
      temperature: 0,
    });

    const classify = async (state: typeof AgentState.State) => {
      const structured = model.withStructuredOutput(
        z.object({ intent: z.enum(TRAINING_INTENTS) }),
      );
      const result = await structured.invoke([
        {
          role: 'system',
          content:
            'Clasifica el mensaje de un cliente de WhatsApp en una sola intención: ventas, soporte o cancelacion. ventas: quiere comprar, cotizar o conocer un plan. soporte: tiene un problema, un error o una duda de uso. cancelacion: quiere cancelar, darse de baja o dejar el servicio.',
        },
        { role: 'user', content: state.message },
      ]);

      return { intent: result.intent };
    };

    const respond = async (state: typeof AgentState.State) => {
      const result = await model.invoke([
        {
          role: 'system',
          content: `Eres un agente de RevOps que atiende por WhatsApp. La intención del cliente ya es "${state.intent}". Responde en español, en una o dos frases cortas, y no digas que eres un modelo.`,
        },
        { role: 'user', content: state.message },
      ]);
      const reply =
        typeof result.content === 'string'
          ? result.content
          : result.content
              .map(part => ('text' in part ? part.text : ''))
              .join('');

      return { reply: reply.trim() };
    };

    this.graph = new StateGraph(AgentState)
      .addNode('classify', classify)
      .addNode('respond', respond)
      .addEdge(START, 'classify')
      .addEdge('classify', 'respond')
      .addEdge('respond', END)
      .compile();

    return this.graph;
  }

  private async getApiKey(): Promise<string> {
    if (this.apiKey) {
      return this.apiKey;
    }

    const response = await new SSMClient({}).send(
      new GetParameterCommand({
        Name: TRAINING_AGENT_API_KEY_PARAM,
        WithDecryption: true,
      }),
    );
    const value = response.Parameter?.Value;

    if (!value) {
      throw new Error(`Missing SSM parameter: ${TRAINING_AGENT_API_KEY_PARAM}`);
    }

    this.apiKey = value;
    return value;
  }
}
