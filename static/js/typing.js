const typedTextSpan = document.querySelector(".typed-text");
const cursor = document.querySelector(".cursor");

const text = "Unlock Your Digital Fortress";
const typingDelay = 150; // Medium typing speed
const erasingDelay = 100;
const startDelay = 1000; // 1 second delay before starting
const pauseDelay = 2000; // Pause before erasing
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = typedTextSpan.textContent;
    
    if (!isDeleting && charIndex <= text.length) {
        // Typing
        typedTextSpan.textContent = text.substring(0, charIndex);
        charIndex++;
        
        if (charIndex > text.length) {
            // Pause before starting to delete
            isDeleting = true;
            setTimeout(type, pauseDelay);
            return;
        }
    } else if (isDeleting && charIndex >= 0) {
        // Erasing
        typedTextSpan.textContent = text.substring(0, charIndex);
        charIndex--;
        
        if (charIndex === 0) {
            // Reset to start typing again
            isDeleting = false;
            setTimeout(type, pauseDelay);
            return;
        }
    }
    
    // Set the next timeout
    const delay = isDeleting ? erasingDelay : typingDelay;
    setTimeout(type, delay);
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(() => {
        type();
    }, startDelay);
});