// Chat functionality for Hackversity

// Global variables
let currentConversationId = null;
let isLoading = false;

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
});

function initializeChat() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesContainer = document.getElementById('messagesContainer');

    if (chatForm) {
        chatForm.addEventListener('submit', handleSubmit);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        });

        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }

    // Scroll to bottom of messages
    if (messagesContainer) {
        scrollToBottom();
    }

    // Get current conversation ID
    const conversationIdInput = document.getElementById('conversationId');
    if (conversationIdInput) {
        currentConversationId = conversationIdInput.value;
    }

    // Initialize conversation list event listeners
    initializeConversationListeners();
}

function initializeConversationListeners() {
    // Add click listeners to conversation items
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking on delete button
            if (e.target.closest('.delete-btn')) return;
            
            const conversationId = this.getAttribute('data-conversation-id');
            if (conversationId) {
                loadConversation(conversationId);
            }
        });
    });

    // Add click listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const conversationId = this.getAttribute('data-conversation-id');
            if (conversationId) {
                deleteConversation(conversationId);
            }
        });
    });
}

function handleSubmit(e) {
    e.preventDefault();
    
    if (isLoading) return;
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Clear input and disable form
    messageInput.value = '';
    messageInput.style.height = 'auto';
    setLoading(true);
    
    // Add user message to chat
    addMessage(message, true);
    
    // Send message to server
    sendMessage(message);
}

function sendMessage(message) {
    const url = currentConversationId ? 
        '/chat/send/' : 
        '/chat/send/';
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
        },
        body: JSON.stringify({
            message: message,
            conversation_id: currentConversationId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update conversation ID if this was a new conversation
            if (data.conversation_id && !currentConversationId) {
                currentConversationId = data.conversation_id;
                const conversationIdInput = document.getElementById('conversationId');
                if (conversationIdInput) {
                    conversationIdInput.value = currentConversationId;
                }
                // Update URL to include conversation parameter
                const newUrl = new URL(window.location);
                newUrl.searchParams.set('conversation', currentConversationId);
                window.history.pushState({}, '', newUrl);
            }
            
            // Add AI response to chat
            if (data.ai_message && data.ai_message.content) {
                addMessage(data.ai_message.content, false);
            }
        } else {
            showError('Failed to send message: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to send message. Please try again.');
    })
    .finally(() => {
        setLoading(false);
    });
}

function addMessage(content, isUser) {
    const messagesContainer = document.getElementById('messagesContainer');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = isUser ? 
        '<i class="fas fa-user-ninja"></i>' : 
        '<i class="fas fa-shield-alt"></i>';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.innerHTML = content.replace(/\n/g, '<br>');
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    contentDiv.appendChild(textDiv);
    contentDiv.appendChild(timeDiv);
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function setLoading(loading) {
    isLoading = loading;
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (sendButton) {
        sendButton.disabled = loading;
    }
    
    if (messageInput) {
        messageInput.disabled = loading;
    }
    
    if (loadingOverlay) {
        loadingOverlay.classList.toggle('show', loading);
    }
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('messagesContainer');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function showError(message) {
    // Notifications disabled per user request
    console.log('Error:', message);
}

function createAlertContainer() {
    // Notifications disabled - return empty div
    const container = document.createElement('div');
    return container;
}

function getCsrfToken() {
    // Try to get CSRF token from meta tag first
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    
    // Fallback to cookie
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];
    
    // Fallback to form token
    return cookieValue || document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
}

// Conversation management functions
function startNewConversation() {
    // Create a new conversation via API call
    const csrfToken = getCsrfToken();
    
    fetch('/chat/new/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/chat/?conversation=' + data.conversation_id;
        } else {
            console.error('Failed to create new conversation:', data.error);
            showError('Failed to create new conversation: ' + (data.error || 'Unknown error'));
            // Fallback to simple redirect
            window.location.href = '/chat/';
        }
    })
    .catch(error => {
        console.error('Error creating new conversation:', error);
        showError('Error creating new conversation. Please try again.');
        // Fallback to simple redirect
        window.location.href = '/chat/';
    });
}

function loadConversation(conversationId) {
    window.location.href = `/chat/?conversation=${conversationId}`;
}

function deleteConversation(conversationId) {
    if (!confirm('Are you sure you want to delete this conversation?')) {
        return;
    }
    
    fetch(`/chat/api/conversations/${conversationId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCsrfToken()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Reload page or redirect to main chat
            if (conversationId == currentConversationId) {
                window.location.href = '/chat/';
            } else {
                window.location.reload();
            }
        } else {
            showError('Failed to delete conversation');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Failed to delete conversation');
    });
}