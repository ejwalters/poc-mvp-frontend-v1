import React, { useEffect, useState } from 'react';
import { Typography, Box, Avatar, List, ListItemText, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';  // For making API requests

const BASE_URL = 'http://localhost:5001';  // Base URL for the API

// Styled components for message thread display
const MessageBox = styled(Box)`
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
`;

const MessageBubble = styled.div`
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 10px;
  max-width: 600px;
  margin-left: 10px;
`;

const DateTime = styled(Typography)`
  font-size: 12px;
  color: gray;
  margin-top: 5px;
  text-align: left;
`;

const SendContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

/**
 * MessageThread Component
 * 
 * This component is responsible for displaying the list of messages within a selected message thread.
 * It fetches messages from the API and displays them, along with the sender's name, message content, and timestamp.
 * 
 * State:
 * - messages (Array): The list of messages fetched from the server for the selected thread.
 * - loading (Boolean): Indicates if the messages are currently being fetched.
 * 
 * Props:
 * - selectedThreadId (Number): The ID of the currently selected thread. The component will fetch and display the messages for this thread.
 * 
 * Key Features:
 * - Fetches and displays messages for the selected thread.
 * - Displays a loading state while messages are being fetched.
 * - Shows a form for typing new messages (the actual sending functionality can be implemented later).
 * - Handles cases when no thread is selected, no messages are found, or an error occurs.
 */

const MessageThread = ({ selectedThreadId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch messages when the selectedThreadId changes
    useEffect(() => {
        if (selectedThreadId) {
            const fetchMessages = async () => {
                try {
                    setLoading(true);  // Set loading state
                    const token = localStorage.getItem('token');  // Fetch token
                    const response = await axios.get(`${BASE_URL}/threads/${selectedThreadId}/messages`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setMessages(response.data || []);  // Set the fetched messages
                } catch (error) {
                    console.error('Error fetching messages:', error);
                } finally {
                    setLoading(false);  // Clear loading state
                }
            };
            fetchMessages();
        }
    }, [selectedThreadId]);

    // Display a message if no thread is selected
    if (!selectedThreadId) {
        return <Typography variant="h6">Select a thread to view its messages.</Typography>;
    }

    // Display a loading state while messages are being fetched
    if (loading) {
        return <Typography variant="h6">Loading messages...</Typography>;
    }

    // Display a message if no messages are found
    if (!messages.length) {
        return <Typography variant="h6">No messages found for this thread.</Typography>;
    }

    return (
        <div>
            {/* List of messages */}
            <List>
                {messages.map((message, index) => (
                    <MessageBox key={index}>
                        <Avatar>{message.sender_name?.[0] || 'U'}</Avatar>
                        <MessageBubble>
                            <ListItemText
                                primary={message.sender_name || 'Unknown Sender'}
                                secondary={message.content || 'No content available'}
                            />
                            <DateTime>{new Date(message.created_at).toLocaleString()}</DateTime>
                        </MessageBubble>
                    </MessageBox>
                ))}
            </List>

            {/* Form to send a new message (functionality can be implemented later) */}
            <SendContainer>
                <Avatar />
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    sx={{ marginLeft: '10px', marginRight: '10px' }}
                />
                <Button variant="contained" color="primary">
                    Send
                </Button>
            </SendContainer>
        </div>
    );
};

export default MessageThread;
