import { useState } from "react";
import {
  Box,
  LinearProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material';
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const InboxPage = () => {

  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true); 

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      //setReply(data.reply);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
      setReply("Something went wrong.");
      setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "❌ Something went wrong!" },
    ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chat with us
      </Typography>

      {/* Input field */}
      <TextField
        label="Type your message..."
        multiline
        rows={0.25}
        fullWidth
        value={input}
        onChange={(e) => setInput(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          sx: { fontSize: "1.0rem",
                alignItems: "flex-start",
                "& .MuiInputBase-inputMultiline": {
                  padding: "8px",
                  lineHeight: "2",
                },
              }, 
          }}
        sx={{ mb: 2 }}
      />

      {/* Send button */}
      <Button
        variant="contained"
        color="primary"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </Button>

      {/* Conversation */}
      {messages.length > 0 && (
        <Paper sx={{ mt: 3, p: 2 }} elevation={3}>
          {messages.map((msg, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color={msg.role === "user" ? "primary" : "secondary"}
              >
                {msg.role === "user" ? "You:" : "AI:"}
              </Typography>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default InboxPage;
