// DetailedHistoryPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Import all other MUI and Markdown components
// ...
const DetailedHistoryPage = () => {
  const { sessionId } = useParams();
  // Use the sessionId to fetch messages for only that session
  // ...
};
export default DetailedHistoryPage;