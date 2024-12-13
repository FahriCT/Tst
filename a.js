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
        chatId: "111", // Chat ID unik
        stream: true, // Aktifkan streaming
        detail: false,
        messages: [
          {
            content: message,
            role: "user",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.FASTGPT_API_KEY}`,
        },
        responseType: "stream", // Tangani respons streaming
      }
    );

    // Proses respons streaming
    return new Promise((resolve, reject) => {
      let reply = "";
      response.data.on("data", (chunk) => {
        const lines = chunk.toString().split("\n").filter((line) => line.trim() !== "");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const json = JSON.parse(line.substring(5));
            const content = json.choices?.[0]?.delta?.content || "";
            reply += content;
            process.stdout.write(content); // Tampilkan balasan secara langsung
          }
        }
      });

      response.data.on("end", () => resolve(reply.trim()));
      response.data.on("error", (error) => reject(error));
    });
  } catch (error) {
    console.error("Error details:", error.response?.data || error.message);
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
    console.log(`\nFastGPT: ${reply}\n`);
    rl.prompt(); // Tampilkan prompt lagi
  }).on("close", () => {
    console.log("Chat ended.");
    process.exit(0);
  });
}

// Mulai percakapan
startChat();
