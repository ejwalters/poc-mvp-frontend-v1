import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Avatar, TextField, Button, Box } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

// Styled components for message list
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 15px;
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1;
  .MuiOutlinedInput-root {
    height: 36px;
    padding: 0 12px;
    font-size: 14px;
  }
  .MuiInputBase-input {
    padding: 8px;
    font-size: 14px;
  }
`;

const CreateButton = styled.button`
  margin-left: 10px;
  height: 36px;
  padding: 0 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #0056b3;
  }
`;

const StyledListItem = styled(ListItem)`
  cursor: pointer;
  align-items: flex-start;
  background-color: ${(props) => (props.selected ? '#e0f7fa' : 'transparent')};
  border-left: ${(props) => (props.selected ? '4px solid #007bff' : 'none')};
  transition: background-color 0.3s ease, border-left 0.3s ease;
  &:hover {
    background-color: #f5f5f5;
  }
`;

/**
 * MessageList Component
 * 
 * This component displays a list of message threads for a selected deal.
 * It allows the user to search for message threads by their subject, sender's name, or message content.
 * 
 * Props:
 * - selectedDeal (Object): The currently selected deal. Threads will be fetched for this deal.
 * - selectedThreadId (Number): The ID of the currently selected message thread.
 * - onSelectThread (Function): Callback function to handle when a message thread is selected.
 * - onCreateNewThread (Function): Callback to trigger showing the new thread form.
 */
const MessageList = ({ selectedDeal, selectedThreadId, onSelectThread, onCreateNewThread }) => {
    const [threads, setThreads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch threads for the selected deal when the selectedDeal changes
    useEffect(() => {
        if (selectedDeal) {
            const fetchThreads = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${BASE_URL}/deals/${selectedDeal.id}/threads`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setThreads(response.data);  // Set the fetched threads
                } catch (error) {
                    console.error('Error fetching threads:', error);
                }
            };
            fetchThreads();
        }
    }, [selectedDeal]);

    // Handle search term changes
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter threads based on the search term (matches subject, message content, or sender's name)
    const filteredThreads = threads.filter((thread) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const subjectMatch = thread.subject.toLowerCase().includes(lowerSearchTerm);

        const messageOrSenderMatch = thread.messages && thread.messages.some((message) =>
            message.content.toLowerCase().includes(lowerSearchTerm) ||
            `${message.sender_name}`.toLowerCase().includes(lowerSearchTerm)
        );

        return subjectMatch || messageOrSenderMatch;
    });

    return (
        <>
            <SearchContainer>
                <StyledTextField
                    variant="outlined"
                    placeholder="Search messages"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    size="small"
                />
                <CreateButton onClick={onCreateNewThread}>New Thread</CreateButton>
            </SearchContainer>

            <List>
                {filteredThreads.length > 0 ? (
                    filteredThreads.map((thread) => (
                        <StyledListItem
                            key={thread.id}
                            selected={thread.id === selectedThreadId}
                            onClick={() => onSelectThread(thread)}
                        >
                            <StyledAvatar alt={thread.subject} src="/static/images/avatar/1.jpg" />
                            <ListItemText
                                primary={thread.subject}
                                secondary={new Date(thread.last_message_date).toLocaleDateString()}
                            />
                        </StyledListItem>
                    ))
                ) : (
                    <p>No threads match your search</p>
                )}
            </List>
        </>
    );
};

export default MessageList;
