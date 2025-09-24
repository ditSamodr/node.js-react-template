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
  Button
} from "@mui/material";

type Message = {
  session_id: string;
  role: string;
  content: string;
  date: string;
};

const ReportsPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<"session_id" | "date">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/history`);
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [API_URL]);

    const handleSort = (column: "session_id" | "date") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedMessages = [...messages].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (sortColumn === "date") {
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (aDate < bDate) return sortDirection === "asc" ? -1 : 1;
      if (aDate > bDate) return sortDirection === "asc" ? 1 : -1;
      return 0;
    } else { 
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }
  });

  if (loading) {
    return <Typography>Loading history...</Typography>;
  }

  let previousSessionId = "";

  return (
   <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chat History
      </Typography>

        {/* Sort Buttons */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleSort("session_id")}
        >
          Sort by Session ID {sortColumn === "session_id" && (sortDirection === "asc" ? "↑" : "↓")}
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleSort("date")}
        >
          Sort by Date {sortColumn === "date" && (sortDirection === "asc" ? "↑" : "↓")}
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Session ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
                    <TableBody>
            {sortedMessages.map((message, index) => {
              const isNewSession = message.session_id !== previousSessionId;
              previousSessionId = message.session_id;

              return (
                <TableRow
                  key={index}
                  sx={{
                    borderTop: isNewSession
                      ? '4px solid #3f51b5' // You can change this color
                      : 'none',
                  }}
                >
                  <TableCell>{message.session_id}</TableCell>
                  <TableCell>{message.role}</TableCell>
                  <TableCell>{message.content}</TableCell>
                  <TableCell>{new Date(message.date).toLocaleString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReportsPage;
