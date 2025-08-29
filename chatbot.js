// script.js
document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const chatbotIcon = document.getElementById("chatbot-icon");

  // Show chatbot when clicking the icon
  chatbotIcon.addEventListener("click", function () {
    chatbotContainer.classList.remove("hidden");
    chatbotIcon.style.display = "none"; // Hide chat icon
  });

  // Close chatbot when clicking the close button
  closeBtn.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
    chatbotIcon.style.display = "flex"; // Show chat icon again
  });

  sendBtn.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function getBotResponse(message) {
    const apiKey = "AIzaSyCW0tn_yibVIvbV1TgyXosN7IFXejMYodY";  
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Gemini API response:", data);

      return data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from Gemini";
    } catch (error) {
      console.error("Error fetching bot response:", error);
      return "⚠️ Error: " + error.message;
    }
  }

  async function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage);
    chatbotInput.value = "";

    const botReply = await getBotResponse(userMessage);
    appendMessage("bot", botReply);
  }
});
