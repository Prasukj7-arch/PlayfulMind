document.addEventListener('DOMContentLoaded', async () => {
  const model = await use.load();
  console.log('Model loaded successfully');

  const chatWindow = document.getElementById('chat-window');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  const responses = [
    'Hello! How can I help you today?',
    'I am here to assist you.',
    'Please provide more details.',
  ];

  function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = content;
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  async function getResponse(userMessage) {
    const userEmbeddings = await model.embed([userMessage]);
    const responseEmbeddings = await model.embed(responses);
    let bestResponse = responses[0];
    let bestScore = -Infinity;

    for (let i = 0; i < responses.length; i++) {
      const responseEmbedding = responseEmbeddings.arraySync()[i];
      const userEmbedding = userEmbeddings.arraySync()[0];
      const score = tf.metrics.cosineProximity(userEmbedding, responseEmbedding).dataSync()[0];
      if (score > bestScore) {
        bestScore = score;
        bestResponse = responses[i];
      }
    }

    return bestResponse;
  }

sendBtn.addEventListener('click', async () => {
  console.log('Send button clicked');
  const message = userInput.value;
  if (message.trim() === '') return;

  addMessage(message, 'user');
  userInput.value = '';

  const response = await getResponse(message);
  addMessage(response, 'bot');
});
});