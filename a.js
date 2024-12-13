const axios = require("axios");
const readline = require("readline");
require("dotenv").config();

// Konfigurasi readline untuk input/output terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "You: ",
});

// Fungsi untuk mengirim pesan ke API FastGPT
async function sendMessageToFastGPT(message) {
  try {
    const response = await axios.post(
      process.env.FASTGPT_API_URL || "https://api.fastgpt.in/api/v1/chat/completions",
      {
        chatId: "unique-chat-id", // Ganti dengan chatId unik jika diperlukan
        stream: false, // Ubah ke `true` jika ingin streaming
        detail: false, // Ubah ke `true` jika butuh detail tambahan
        messages: [
          {
            content: message,
            role: "user", // Tetap gunakan "user" untuk input dari pengguna
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FASTGPT_API_KEY}`, // Pastikan API Key di .env benar
        },
      }
    );

    const reply = response.data.choices?.[0]?.content.trim() || "No response.";
    return reply;
  } catch (error) {
    console.error("Error communicating with FastGPT API:", error.message);
    return "Error: Unable to communicate with FastGPT.";
  }
}

// Fungsi utama untuk percakapan
async function startChat() {
  console.log("Welcome to FastGPT Chat! Type your message below:");
  rl.prompt();

  rl.on("line", async (line) => {
    const userInput = line.trim();

    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }

    // Kirim pesan ke FastGPT dan tunggu balasan
    const reply = await sendMessageToFastGPT(userInput);
    console.log(`FastGPT: ${reply}`);

    rl.prompt(); // Tampilkan prompt lagi
  }).on("close", () => {
    console.log("Chat ended.");
    process.exit(0);
  });
}

// Mulai percakapan
startChat();
