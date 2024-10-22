import { jwtDecode } from 'jwt-decode';  // Use named import (no default export)
import React, { useEffect, useState, useRef } from 'react';
import { Typography, Box, Avatar, List, ListItemText, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';  // For making API requests

const BASE_URL = 'http://localhost:5001';  // Base URL for the API

// Styled components for message thread display
const MessageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 200px);  // Adjust height to match the MessageList height
  overflow-y: auto;  // Enable scrolling for overflow content
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

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
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messageEndRef = useRef(null);  // Reference to scroll to the bottom

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
                    scrollToBottom();  // Scroll to bottom when new thread is selected and messages are loaded
                } catch (error) {
                    console.error('Error fetching messages:', error);
                } finally {
                    setLoading(false);  // Clear loading state
                }
            };
            fetchMessages();
        }
    }, [selectedThreadId]);

    // Scroll to the bottom of the message container
    const scrollToBottom = () => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Send a new message
    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken?.id;
            const senderName = `${decodedToken?.first_name} ${decodedToken?.last_name}`;  // Get user's name from the token

            const response = await axios.post(`${BASE_URL}/threads/${selectedThreadId}/messages`, {
                content: newMessage,
                sender_id: userId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Append new message to the list, using sender's name from the token
            const newMessageWithSender = {
                ...response.data,
                sender_name: senderName,  // Set sender_name from the token
            };
            setMessages((prevMessages) => [...prevMessages, newMessageWithSender]);
            setNewMessage('');  // Clear input field
            scrollToBottom();  // Scroll to the new message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // Scroll to the bottom every time messages are updated
    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Display a message if no thread is selected
    if (!selectedThreadId) {
        return <Typography variant="h6">Select a thread to view its messages.</Typography>;
    }

    // Display a loading state while messages are being fetched
    if (loading) {
        return <Typography variant="h6">Loading messages...</Typography>;
    }

    return (
        <div>
            {/* Message display area */}
            <MessageContainer>
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
                    <div ref={messageEndRef} />  {/* Anchor to scroll to */}
                </List>
            </MessageContainer>

            {/* Send new message */}
            <SendContainer>
                <Avatar />
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ marginLeft: '10px', marginRight: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                    Send
                </Button>
            </SendContainer>
        </div>
    );
};

export default MessageThread;
