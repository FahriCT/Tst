const axios = require('axios');
const readline = require('readline');
require('dotenv').config();

// Konfigurasi readline untuk input/output terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'You: ',
});

// Fungsi untuk mengirim pesan ke API FastGPT
async function sendMessageToFastGPT(message) {
  try {
    const response = await axios.post(
      process.env.FASTGPT_API_URL,
      {
        prompt: message,
        max_tokens: 100, // Sesuaikan jumlah token
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FASTGPT_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0]?.text.trim();
    return reply || 'No response from FastGPT.';
  } catch (error) {
    console.error('Error communicating with FastGPT API:', error.message);
    return 'Error: Unable to communicate with FastGPT.';
  }
}

// Fungsi utama untuk percakapan
async function startChat() {
  console.log('Welcome to FastGPT Chat! Type your message below:');
  rl.prompt();

  rl.on('line', async (line) => {
    const userInput = line.trim();

    if (userInput.toLowerCase() === 'exit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }

    // Kirim pesan ke FastGPT dan tunggu balasan
    const reply = await sendMessageToFastGPT(userInput);
    console.log(`FastGPT: ${reply}`);

    rl.prompt(); // Tampilkan prompt lagi
  }).on('close', () => {
    console.log('Chat ended.');
    process.exit(0);
  });
}

// Mulai percakapan
startChat();
