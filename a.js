const { Configuration, OpenAIApi } = require("openai");
const readline = require("readline");
const dotenv = require("dotenv");

// Konfigurasi dotenv untuk mengambil API key
dotenv.config();

// Konfigurasi OpenAI dengan Base URL khusus
const configuration = new Configuration({
    apiKey: process.env.SECRET_KEY,
    basePath: "https://api.fastgpt.in/api/v1/chat/completions" // Ganti dengan Base URL FastGPT atau URL lain
});

const openai = new OpenAIApi(configuration);

// Penyimpanan percakapan per sesi
const conversations = {};

// Setup readline untuk input/output di terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk bertanya dan mendapatkan respon
async function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Fungsi untuk berinteraksi dengan FastGPT API
async function interactWithGPT() {
    const session_id = "session1"; // Misalnya session ID yang tetap
    if (!conversations[session_id]) {
        conversations[session_id] = [
            { role: "system", content: "You are a helpful assistant. Use Markdown for formatting." }
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
            const response = await openai.createChatCompletion({
                model: "gpt-4o-mini", // Sesuaikan model dengan FastGPT
                messages: conversations[session_id],
                stream: false // Non-streaming (untuk komunikasi biasa)
            });

            const assistantResponse = response.data.choices[0].message.content;
            console.log("FastGPT: ", assistantResponse);

            // Menyimpan respon percakapan
            conversations[session_id].push({ role: "assistant", content: assistantResponse });
        } catch (error) {
            console.error("Error: ", error.response ? error.response.data : error.message);
        }
    }
}

// Menjalankan interaksi GPT
interactWithGPT();
