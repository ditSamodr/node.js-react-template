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

const InboxPage = () => {

  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      console.error("Error:", error);
      setReply("Something went wrong.");
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
          sx: { fontSize: "1.2rem", 
                alignItems: "flex-start", // top-aligns input box
                "& .MuiInputBase-inputMultiline": {
                  padding: "8px",         // adjust padding
                  lineHeight: "2",      // keeps it readable
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

      {/* Loading bar */}
      {loading && <LinearProgress sx={{ mt: 2 }} />}

      {/* AI reply */}
      {reply && (
        <Paper sx={{ mt: 3, p: 2 }} elevation={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            AI:
          </Typography>
          <Typography variant="body1">{reply}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default InboxPage;
