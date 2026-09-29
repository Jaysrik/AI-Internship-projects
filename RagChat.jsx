import { useState } from "react";

function RagChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8002/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();
      setAnswer(JSON.stringify(data.answer));
    } catch (error) {
      setAnswer("Backend connection error");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>RAG PDF Chatbot</h1>

      <input
        type="text"
        placeholder="Ask your question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askQuestion}>Ask</button>

      {loading && <p>Loading...</p>}

      <p>{answer}</p>
    </div>
  );
}

export default RagChat;