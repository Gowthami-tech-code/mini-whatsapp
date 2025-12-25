// import { io } from "socket.io-client";
// import { useEffect, useState } from "react";

// function App() {
//   const [socket, setSocket] = useState(null);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const newSocket = io("http://localhost:5000");

//     newSocket.on("connect", () => {
//       console.log("Connected to server:", newSocket.id);
//     });

//     newSocket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const sendMessage = () => {
//     if (socket) {
//       socket.emit("send_message", { text: message });
//       setMessage("");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Socket.IO Chat</h2>

//       <input
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type message"
//       />

//       <button onClick={sendMessage}>Send</button>

//       <div>
//         {messages.map((msg, index) => (
//           <p key={index}>{msg.text}</p>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("https://mini-whatsapp-backend-6dbr.onrender.com");

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    newSocket.on("users_list", (users) => {
      setUsers(users);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const joinChat = () => {
    if (username && socket) {
      socket.emit("join", username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message && socket) {
      socket.emit("send_message", { text: message });
      setMessage("");
    }
  };

  if (!joined) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Mini WhatsApp</h2>
        <input
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={joinChat}>Join</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* USERS */}
      <div style={{ width: "25%", borderRight: "1px solid gray", padding: 10 }}>
        <h4>Online Users</h4>
        {users.map((u, i) => (
          <p key={i}>{u}</p>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ width: "75%", padding: 10 }}>
        <div style={{ height: "80%", overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                textAlign: msg.user === username ? "right" : "left",
                margin: "8px"
              }}
            >
              <b>{msg.user}</b>
              <p
                style={{
                  display: "inline-block",
                  padding: "8px",
                  borderRadius: "8px",
                  background:
                    msg.user === username ? "#dcf8c6" : "#eee"
                }}
              >
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;

