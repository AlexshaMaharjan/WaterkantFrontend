document.addEventListener('DOMContentLoaded', function() {
  const sendBtn = document.getElementById('send-btn');
  const chatInput = document.getElementById('chat-input');
  const messages = document.querySelector('.messages');

  sendBtn.addEventListener('click', function() {
    const msgText = chatInput.value.trim();
    if (msgText !== '') {
      addMessage(msgText, 'user');
      chatInput.value = '';
      sendMessageToBackend(msgText);
    }
  });

  function sendMessageToBackend(message) {
    fetch('http://localhost:8080/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: message })
    })
      .then(response => response.json())
      .then(data => {
        addMessage(data.response, 'bot');
      })
      .catch(error => console.error('Error:', error));
  }

  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }
});
