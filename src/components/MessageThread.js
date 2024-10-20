import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, Avatar, List, ListItemText, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';  // For making API requests

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

const MessageThread = ({ selectedThread, searchTerm }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const firstMatchRef = useRef(null);

    useEffect(() => {
        if (selectedThread) {
            const fetchMessages = async () => {
                try {
                    setLoading(true);
                    console.log(`Fetching messages for thread: ${selectedThread.id}`);
                    const response = await axios.get(`http://localhost:5001/threads/${selectedThread.id}/messages`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    console.log('Messages fetched:', response.data);
                    setMessages(response.data || []); // Set messages, fallback to an empty array if no data
                } catch (error) {
                    console.error('Error fetching messages:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchMessages();
        }
    }, [selectedThread]);

    useEffect(() => {
        if (firstMatchRef.current) {
            firstMatchRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [messages]);

    // Handle cases where selectedThread or messages are undefined or empty
    if (!selectedThread) {
        return <div>Select a thread to view messages</div>;
    }

    if (loading) {
        return <div>Loading messages...</div>;
    }

    if (!messages.length) {
        return <div>No messages found for this thread.</div>;
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>
                {selectedThread.subject || 'No subject'}
            </Typography>
            <List>
                {messages.map((message, index) => {
                    const hasMatch = searchTerm && message.content?.toLowerCase().includes(searchTerm.toLowerCase());

                    // Combine first name and last name for the sender
                    const senderFullName = `${message.first_name} ${message.last_name}`;

                    return (
                        <MessageBox key={index} ref={hasMatch && !firstMatchRef.current ? firstMatchRef : null}>
                            <Avatar>{message.first_name?.[0] || 'U'}</Avatar> {/* Show first letter of first_name */}
                            <MessageBubble>
                                <ListItemText
                                    primary={senderFullName || 'Unknown Sender'} // Show full name or fallback to "Unknown Sender"
                                    secondary={message.content || 'No content available'}
                                />
                                <DateTime>{new Date(message.created_at).toLocaleString()}</DateTime>
                            </MessageBubble>
                        </MessageBox>
                    );
                })}
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
