import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ReactMarkdown from 'react-markdown';

type SessionSummary = {
  session_id: string;
  chat_count: number;
   last_message_content: string; 
  last_message_role: string;
  last_message_date: string;
};

type Message = {
  session_id: string;
  role: string;
  content: string;
  date: string;
};

const ReportsPage = () => {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [selectedSessionMessages, setSelectedSessionMessages] = useState<Message[]>([]);
  const [loadingSession, setLoadingSession] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const res = await fetch(`${API_URL}/sessions-summary`);
        const data = await res.json();
        setSessions(data.sessions);
      } catch (error) {
        console.error("Failed to fetch session summaries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummaries();
  }, [API_URL]);

  const handleViewChat = async (sessionId: string) => {
    setLoadingSession(true);
    setSelectedSessionId(sessionId);
    setOpenDialog(true);
    try {
      const res = await fetch(`${API_URL}/session/${sessionId}`);
      const data = await res.json();
      setSelectedSessionMessages(data.messages);
    } catch (error) {
      console.error("Failed to fetch session chat:", error);
    } finally {
      setLoadingSession(false);
    }
  };

   const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSessionId(null);
    setSelectedSessionMessages([]);
  };

  if (loading) {
    return <Typography>Loading sessions...</Typography>;
  }

  const truncate = (text: string, length: number) => {
  if (text.length > length) {
    return text.substring(0, length) + '...';
  }
  return text;
};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Conversation Logs
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Session ID</TableCell>
              <TableCell>Chat Number</TableCell>
              <TableCell>Last Message</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session.session_id}>
                <TableCell>{session.session_id}</TableCell>
                <TableCell>{session.chat_count}</TableCell>
                <TableCell>
                   {session.last_message_role?.toUpperCase() || 'N/A'}:{" "}
                  <ReactMarkdown>
                    {truncate(session.last_message_content || 'No message content.', 50)}
                  </ReactMarkdown>
                </TableCell>            
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleViewChat(session.session_id)}
                  >
                    Show Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Conversation Log</DialogTitle>
        <DialogTitle> {`Session ID: ${selectedSessionId || ''} `}</DialogTitle>
        <DialogTitle>{`Total Chat Number: ${selectedSessionMessages.length} `}</DialogTitle>
        <DialogTitle>Chat Detail</DialogTitle>
        <DialogContent dividers>
          {loadingSession ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            selectedSessionMessages.length > 0 ? (
              selectedSessionMessages.map((msg, index) => (
                <Paper key={index} elevation={2} sx={{ p: 2, mb: 2, backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f1f8e9' }}>
                  <Typography variant="body2" color="text.secondary">
                    {index + 1}. {new Date(msg.date).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {msg.role.toUpperCase()}: 
                  </Typography>

                  <ReactMarkdown>
                      {msg.content}
                  </ReactMarkdown>
                  
                </Paper>
              ))
            ) : (
              <Typography>No messages found for this session.</Typography>
            )
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsPage;