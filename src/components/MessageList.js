import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Avatar, TextField } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';  // You'll use axios to make API requests

const BASE_URL = 'http://localhost:5001';  // Base URL for the API

// Styled components for message list
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
`;

const StyledListItem = styled(ListItem)`
  cursor: pointer;
  align-items: flex-start; /* Ensures avatar and text are aligned properly */
  &:hover {
    background-color: #f5f5f5; /* Optional: Hover effect */
  }
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 15px; /* Add space between avatar and text */
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1;

  .MuiOutlinedInput-root {
    height: 36px; /* Set the height of the input to match the button */
    padding: 0 12px; /* Reduce padding to decrease height */
    font-size: 14px; /* Adjust font size for a compact look */
  }

  .MuiInputBase-input {
    padding: 8px; /* Adjust padding inside the input to reduce its height */
    font-size: 14px; /* Adjust font size */
  }
`;

const CreateButton = styled.button`
  margin-left: 10px;
  height: 36px; /* Match the height of the search bar */
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

const MessageList = ({ selectedDeal, onSelectThread }) => {
    const [threads, setThreads] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (selectedDeal) {
            // Fetch threads based on the selected deal's ID
            const fetchThreads = async () => {
                try {
                    const token = localStorage.getItem('token'); // Retrieve the token from local storage
                    const response = await axios.get(`${BASE_URL}/deals/${selectedDeal.id}/threads`, {
                        headers: {
                            Authorization: `Bearer ${token}` // Add Authorization header
                        }
                    });
                    setThreads(response.data); // Assuming the response contains the list of threads
                } catch (error) {
                    console.error('Error fetching threads:', error);
                }
            };

            fetchThreads();
        }
    }, [selectedDeal]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreateNewThread = () => {
        console.log("Creating a new message thread");
    };

    const filteredThreads = threads.filter((thread) => {
        const lowerSearchTerm = searchTerm.toLowerCase();

        const subjectMatch = thread.subject.toLowerCase().includes(lowerSearchTerm);

        // Ensure messages array exists before calling 'some()' on it
        const messageMatch = thread.messages && thread.messages.some((message) =>
            message.content.toLowerCase().includes(lowerSearchTerm)
        );

        const senderMatch = thread.messages && thread.messages.some((message) =>
            message.sender.toLowerCase().includes(lowerSearchTerm)
        );

        return subjectMatch || messageMatch || senderMatch;
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
                <CreateButton onClick={handleCreateNewThread}>New Thread</CreateButton>
            </SearchContainer>

            <List>
                {filteredThreads.length > 0 ? (
                    filteredThreads.map((thread) => (
                        <StyledListItem
                            key={thread.id}
                            button
                            onClick={() => onSelectThread(thread)}
                        >
                            <StyledAvatar alt={thread.subject} src="/static/images/avatar/1.jpg" />
                            <ListItemText
                                primary={thread.subject}
                                secondary={new Date(thread.lastMessageDate).toLocaleDateString()}
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
