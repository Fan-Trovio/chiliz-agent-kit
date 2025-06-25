"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const langchain_1 = require("../src/langchain");
const dotenv_1 = require("dotenv");
const openai_1 = require("@langchain/openai");
const agents_1 = require("langchain/agents");
const prompts_1 = require("@langchain/core/prompts");
// Load environment variables (.env file)
(0, dotenv_1.config)();
// A map of tokens your agent will know about
const tokenMap = {
    PSG: { address: '0xb0Fa395a3386800658B9617F90e834E2CeC76Dd3', decimals: 18 },
    TPSG: { address: '0x4a48b0ba2d14cd779f48912542c14bb9bf9bf75c', decimals: 18 },
    JUV: { address: '0x945EeD98f5CBada87346028aD08eE0eA66849A0e', decimals: 18 },
};
async function main() {
    // --- 1. Initialize the Chiliz Agent Kit (The "Hands") ---
    const agentKit = await src_1.ChilizAgent.create({
        rpcUrl: process.env.CHILIZ_RPC_URL,
        privateKey: process.env.PRIVATE_KEY,
    });
    // --- 2. Get the LangChain Tools ---
    const tools = (0, langchain_1.getChilizTools)(agentKit, tokenMap);
    // --- 3. Set up the LangChain Agent (The "Brain") ---
    const llm = new openai_1.ChatOpenAI({ modelName: 'gpt-4o', temperature: 0 });
    const prompt = prompts_1.ChatPromptTemplate.fromMessages([
        ['system', 'You are a helpful blockchain assistant. You have access to a Chiliz wallet.'],
        new prompts_1.MessagesPlaceholder('chat_history'),
        ['human', '{input}'],
        new prompts_1.MessagesPlaceholder('agent_scratchpad'),
    ]);
    const agent = await (0, agents_1.createOpenAIFunctionsAgent)({ llm, tools, prompt });
    const agentExecutor = new agents_1.AgentExecutor({ agent, tools, verbose: true });
    // --- 4. Run the Test ---
    console.log('--- Testing LangChain Agent: Getting CHZ Balance ---');
    const result = await agentExecutor.invoke({
        input: "What is my current CHZ balance?",
    });
    console.log('--- Test Result ---');
    console.log('Agent Response:', result.output);
    console.log('--- Test Complete ---');
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
