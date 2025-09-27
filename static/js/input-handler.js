document.addEventListener('DOMContentLoaded', function() {
    const userInput = document.getElementById('user-input');
    const submitBtn = document.getElementById('submit-btn');
    const responseArea = document.getElementById('response-area');

    async function getGeminiResponse(message) {
        try {
            const response = await fetch('/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('Error:', error);
            return 'Sorry, I encountered an error. Please try again.';
        }
    }

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            userInput.disabled = true;
        } else {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit';
            submitBtn.disabled = false;
            userInput.disabled = false;
        }
    }

    function displayMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = message;
        responseArea.appendChild(messageDiv);
        responseArea.scrollTop = responseArea.scrollHeight;
    }

    async function handleSubmit() {
        const message = userInput.value.trim();
        if (!message) return;

        // Display user message
        displayMessage(message, true);
        setLoading(true);

        // Get and display AI response
        const response = await getGeminiResponse(message);
        displayMessage(response, false);

        // Reset input
        userInput.value = '';
        setLoading(false);
        userInput.focus();
    }

    // Event listeners
    submitBtn.addEventListener('click', handleSubmit);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    });
});