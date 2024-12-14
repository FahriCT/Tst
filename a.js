const axios = require('axios');

const url = 'https://api.fastgpt.in/api/v1/chat/completions';
const apiKey = 'fastgpt-roqzMQYrDmf5v5hqTY6kPFSPSIttVDzAHNAFLpJqrZXmlA3PkCXUobIyYu';

const data = {
  chatId: '111',
  stream: false,
  detail: false,
  messages: [
    {
      content: 'halo',
      role: 'user',
    },
  ],
};

const headers = {
  Authorization: `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
};

axios
  .post(url, data, { headers })
  .then((response) => {
    console.log('Response:', response.data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });
