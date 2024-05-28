document.addEventListener('DOMContentLoaded', function() {
  const sendBtn = document.getElementById('send-btn');
  const chatInput = document.getElementById('chat-input');
  const messages = document.querySelector('.messages');
  const menuToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const navbar = document.querySelector('.navbar');
  const blueLine = document.querySelector('.blue-line');
  const chatElementsContainer = document.getElementById('chat-elements');

  sendBtn.addEventListener('click', function() {
    sendMessage();
  });

  chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  menuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('show');
    navbar.classList.toggle('active');
    blueLine.classList.toggle('active');
  });

  function sendMessage() {
    const msgText = chatInput.value.trim();
    if (msgText !== '') {
      addMessage(msgText, 'user');
      chatInput.value = '';
      sendMessageToBackend(msgText);
    }
  }

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
    const msgContainer = document.createElement('div');
    msgContainer.classList.add('message-container', sender);

    if (sender === 'bot') {
      const profilePic = document.createElement('img');
      profilePic.src = 'img/profilelogo.png';
      profilePic.alt = 'Bot';
      profilePic.classList.add('profile-pic');
      msgContainer.appendChild(profilePic);
    }

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;

    msgContainer.appendChild(msgDiv);
    messages.appendChild(msgContainer);
    messages.scrollTop = messages.scrollHeight;
  }

  function fetchChatElements() {
    fetch('http://localhost:8080/events')
      .then(response => response.json())
      .then(data => {
        data.forEach(event => {
          addChatElement(event);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  function addChatElement(event) {
    const eventContainer = document.createElement('div');
    eventContainer.classList.add('event');

    const eventTitle = document.createElement('h3');
    eventTitle.textContent = event.title;
    eventContainer.appendChild(eventTitle);

    const eventDescription = document.createElement('p');
    eventDescription.textContent = event.description;
    eventContainer.appendChild(eventDescription);

    chatElementsContainer.appendChild(eventContainer);
  }

  // Initial fetch of chat elements
  fetchChatElements();
});
