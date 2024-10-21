import React, { useEffect, useState } from 'react';
import { Typography, Box, Avatar, List, ListItemText, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';  // For making API requests

const BASE_URL = 'http://localhost:5001';  // Base URL for the API

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

const MessageThread = ({ selectedThreadId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedThreadId) {
            const fetchMessages = async () => {
                try {
                    setLoading(true);
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
                    setLoading(false);
                }
            };
            fetchMessages();
        }
    }, [selectedThreadId]);

    if (!selectedThreadId) {
        return <Typography variant="h6">Select a thread to view its messages.</Typography>;
    }

    if (loading) {
        return <Typography variant="h6">Loading messages...</Typography>;
    }

    if (!messages.length) {
        return <Typography variant="h6">No messages found for this thread.</Typography>;
    }

    return (
        <div>
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
