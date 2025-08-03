
import { useState } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    setMessages([...messages, userMessage, { role: 'bot', content: data.response, embed: data.embed }]);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4 h-[500px] overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <p className="text-sm">{msg.content}</p>
            {msg.embed && (
              <iframe
                src={msg.embed}
                width="100%"
                height="80"
                allow="encrypted-media"
                className="mt-2"
              ></iframe>
            )}
          </div>
        ))}
        {loading && <p className="text-gray-500">Cargando recomendación...</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          placeholder="Escribí qué música querés..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
