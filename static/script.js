// Get references to the HTML elements
const summariseButton = document.getElementById('summariseButton');
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const copyButton = document.getElementById('copyButton');

// Function to handle the summarisation
async function handleSummarise() {
    const textToSummarise = inputText.value;

    if (!textToSummarise.trim()) {
        alert("Please enter some text to summarise.");
        return;
    }

    // Disable the button and show a loading message
    summariseButton.disabled = true;
    summariseButton.textContent = 'Summarising...';
    outputText.value = ''; // Clear previous summary

    try {
        const response = await fetch('/summarise/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: textToSummarise }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Something went wrong on the server.');
        }

        const data = await response.json();
        outputText.value = data.summary;

    } catch (error) {
        console.error('Fetch Error:', error);
        outputText.value = `Error: ${error.message}`;
    } finally {
        // Re-enable the button and restore its text
        summariseButton.disabled = false;
        summariseButton.textContent = 'Summarise';
    }
}

// Function to handle copying text to clipboard
function handleCopy() {
    if (!outputText.value) return;

    navigator.clipboard.writeText(outputText.value).then(() => {
        // Visual feedback
        const originalText = copyButton.textContent;
        copyButton.textContent = '✅';
        setTimeout(() => {
            copyButton.textContent = originalText;
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}


// Attach the functions to the button click events
summariseButton.addEventListener('click', handleSummarise);
copyButton.addEventListener('click', handleCopy);