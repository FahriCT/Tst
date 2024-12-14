const axios = require('axios');
const readline = require('readline');

const url = 'https://api.fastgpt.in/api/v1/chat/completions';
const apiKey = 'fastgpt-api';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const headers = {
  Authorization: 'Bearer ' + apiKey,
  'Content-Type': 'application/json',
};

const chatId = '111';

function sendMessage(message) {
  const data = {
    chatId: chatId,
    stream: false,
    detail: false,
    messages: [
      {
        content: message,
        role: 'user',
      },
    ],
  };

  axios
    .post(url, data, { headers })
    .then((response) => {
      const messageContent = response.data.choices[0]?.message?.content || 'No content available';
      console.log('AI:', messageContent);
      promptUser();
    })
    .catch((error) => {
      console.error('Error:', error.message);
      promptUser();
    });
}

function promptUser() {
  rl.question('Anda: ', (input) => {
    sendMessage(input);
  });
}


console.log('Selamat datang! Mulai obrolan dengan AI. Ketik "exit" untuk keluar.');
promptUser();


rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Terima kasih! Sampai jumpa.');
    rl.close();
  }
});
