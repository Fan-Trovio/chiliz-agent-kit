import { ChilizAgent } from '..';
import { getChilizTools, TokenMap } from '../langchain/tools';
import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import {
  HumanMessage,
  AIMessage,
  BaseMessage,
} from '@langchain/core/messages';
import {
  StateGraph,
  END,
  Annotation,
  messagesStateReducer,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { DynamicTool } from 'langchain/tools';

// Load environment variables (.env file)
config();

// A map of tokens your agent will know about
const tokenMap: TokenMap = {
  PSG: { address: '0xb0Fa395a3386800658B9617F90e834E2CeC76Dd3', decimals: 18 },
  TPSG: { address: '0x4a48b0ba2d14cd779f48912542c14bb9bf9bf75c', decimals: 18 },
  JUV: { address: '0x945EeD98f5CBada87346028aD08eE0eA66849A0e', decimals: 18 },
};

// Define the state schema for the graph
const graphState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
});

async function main() {
  try {
    // Validate required environment variables
    if (!process.env.CHILIZ_RPC_URL) {
      throw new Error('CHILIZ_RPC_URL environment variable is required');
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is required');
    }
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    console.log('--- Initializing Chiliz Agent Kit ---');
    
    // --- 1. Initialize the Chiliz Agent Kit (The "Hands") ---
    const agentKit = await ChilizAgent.create({
      rpcUrl: process.env.CHILIZ_RPC_URL,
      privateKey: process.env.PRIVATE_KEY,
    });

    console.log('Agent Kit initialized successfully');
    console.log('Wallet Address:', agentKit.address);

    // --- 2. Get the LangChain Tools ---
    const tools = getChilizTools(agentKit, tokenMap);
    console.log(`Loaded ${tools.length} tools:`, tools.map((tool: DynamicTool) => tool.name));

    // --- 3. Set up the LangChain Agent (The "Brain") ---
    const llm = new ChatOpenAI({
      modelName: 'gpt-4o',
      temperature: 0,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const modelWithTools = llm.bindTools(tools);

    // --- 4. Define the LangGraph Agent ---
    
    // Agent node: calls the model
    const agentNode = async (state: { messages: BaseMessage[] }) => {
      const response = await modelWithTools.invoke(state.messages);
      return { messages: [response] };
    };

    // Tool node: executes tools
    const toolNode = new ToolNode(tools);

    // Edge logic: determines whether to continue or end
    const shouldContinue = (state: { messages: BaseMessage[] }) => {
      const { messages } = state;
      const lastMessage = messages[messages.length - 1];
      if (
        lastMessage instanceof AIMessage &&
        lastMessage.tool_calls &&
        lastMessage.tool_calls.length > 0
      ) {
        return 'tools';
      }
      return END;
    };

    // --- 5. Construct the Graph ---
    const workflow = new StateGraph(graphState)
      .addNode('agent', agentNode)
      .addNode('tools', toolNode)
      .setEntryPoint('agent')
      .addConditionalEdges('agent', shouldContinue)
      .addEdge('tools', 'agent');
      
    const app = workflow.compile();

    // --- 6. Run the Test ---
    console.log('--- Testing LangGraph Agent ---');
    
    const inputs = [
        new HumanMessage('What is my wallet address?'),
        new HumanMessage('What is my CHZ balance?'),
        new HumanMessage('Do I have any TPSG tokens?'),
    ];

    for (const input of inputs) {
        console.log(`\n--- Running for input: "${input.content}" ---`);
        const result = await app.invoke({ messages: [input] });
        const lastMessage = result.messages[result.messages.length - 1];
        console.log('Final Agent Response:', lastMessage.content);
    }
    
    console.log('--- Test Complete ---');
    
    return { success: true };

  } catch (error) {
    console.error('--- Test Failed ---');
    console.error('Error:', error);
    
    if (error instanceof Error) {
      console.error('Error Message:', error.message);
      console.error('Stack Trace:', error.stack);
    }
    
    throw error;
  }
}

// Export the main function for testing
export { main };

// Run if this file is executed directly
if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal Error:', err);
    process.exit(1);
  });
} 