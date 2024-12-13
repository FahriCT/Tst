const { OpenAI } = require("openai");
const readline = require("readline");
const dotenv = require("dotenv");

// Configure dotenv to load the API key from environment variables
dotenv.config();

// Initialize OpenAI client with the latest API
const openai = new OpenAI({
    apiKey: fastgpt-roqzMQYrDmf5v5hqTY6kPFSPSIttVDzAHNAFLpJqrZXmlA3PkCXUobIyYu, // Use your OpenAI API key
    basePath: "https://api.fastgpt.in/api/v1/chat/completions", // Default API path for OpenAI
});

// Store conversations per session
const conversations = {};

// Setup readline interface for input/output in terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to ask a question and get a response
async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Function to interact with GPT-4 using OpenAI SDK v4.x.x
async function interactWithGPT() {
    const session_id = "session1"; // Use a fixed session ID for simplicity
    if (!conversations[session_id]) {
        conversations[session_id] = [
            { role: "system", content: "You are a helpful assistant." }
        ];
    }

    while (true) {
        const message = await askQuestion("You: ");
        if (message.toLowerCase() === "exit") {
            console.log("Goodbye!");
            rl.close();
            break;
        }

        conversations[session_id].push({ role: "user", content: message });

        try {
            // Call OpenAI API to get the response
            const response = await openai.chat.completions.create({
                model: "gpt-4", // Replace with the desired model
                messages: conversations[session_id], // Pass the current conversation context
            });

            const assistantResponse = response.choices[0].message.content;
            console.log("FastGPT: ", assistantResponse);

            // Store the assistant's response in the conversation
            conversations[session_id].push({ role: "assistant", content: assistantResponse });
        } catch (error) {
            console.error("Error: ", error.message);
        }
    }
}

// Start the interaction with GPT
interactWithGPT();
