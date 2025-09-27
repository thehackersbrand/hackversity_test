class ChatUI {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchBox = document.querySelector('.search-box');
        this.searchContainer = document.querySelector('.search-container');
        this.initializeEventListeners();
        this.createChatContainer();
    }

    createChatContainer() {
        if (!document.querySelector('.chat-container')) {
            const chatContainer = document.createElement('div');
            chatContainer.className = 'chat-container';
            this.searchContainer.appendChild(chatContainer);
        }
    }

    initializeEventListeners() {
        this.searchInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter' && this.searchInput.value.trim() !== '') {
                await this.handleUserInput(this.searchInput.value.trim());
            }
        });

        // Handle button clicks
        document.querySelector('.search-icon').addEventListener('click', () => {
            if (this.searchInput.value.trim() !== '') {
                this.handleUserInput(this.searchInput.value.trim());
            }
        });

        document.querySelector('.fa-microphone').parentElement.addEventListener('click', () => {
            this.startVoiceRecognition();
        });
    }

    async handleUserInput(userInput) {
        if (!userInput.trim()) return;
        
        // Save the current input
        const currentInput = userInput;
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Make request to your Django backend
            const response = await fetch('/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCSRFToken()
                },
                body: JSON.stringify({ message: currentInput })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayResponse(currentInput, data.response);
        } catch (error) {
            console.error('Error:', error);
            this.displayResponse(currentInput, 'Sorry, I encountered an error. Please try again.');
        }

        // Clear input and remove loading state
        this.searchInput.value = '';
        this.setLoadingState(false);
        
        // Focus back on the input
        this.searchInput.focus();
    }

    displayResponse(userMessage, response) {
        if (!document.querySelector('.chat-container')) {
            // Create chat container if it doesn't exist
            const chatContainer = document.createElement('div');
            chatContainer.className = 'chat-container';
            this.searchBox.parentElement.appendChild(chatContainer);
        }

        const chatContainer = document.querySelector('.chat-container');
        
        // Add user message
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-message user-message';
        userDiv.textContent = userMessage;
        chatContainer.appendChild(userDiv);

        // Add AI response
        const aiDiv = document.createElement('div');
        aiDiv.className = 'chat-message ai-message';
        aiDiv.textContent = response;
        chatContainer.appendChild(aiDiv);

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    setLoadingState(isLoading) {
        const aiButton = document.querySelector('.ai-button');
        if (isLoading) {
            aiButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        } else {
            aiButton.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }

    getCSRFToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]').value;
    }

    startVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                this.searchInput.placeholder = 'Listening...';
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.searchInput.value = transcript;
                this.handleUserInput(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.searchInput.placeholder = 'Ask anything or @mention a Space';
            };

            recognition.onend = () => {
                this.searchInput.placeholder = 'Ask anything or @mention a Space';
            };

            recognition.start();
        } else {
            alert('Speech recognition is not supported in your browser.');
        }
    }
}