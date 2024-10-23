import React, { useState } from 'react';
import { List, ListItem, ListItemText, Avatar, TextField, Button, Box, Typography, Divider, Pagination } from '@mui/material'; // Added Pagination component
import styled from 'styled-components';

const BASE_URL = 'http://localhost:5001';

// Styled components for message list
const SearchContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 16px;
`;

const StyledAvatar = styled(Avatar)`
  margin-right: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);  /* Add subtle shadow */
`;

const StyledTextField = styled(TextField)`
  flex-grow: 1;
  background-color: white;
  border-radius: 8px;
  padding: 8px;

  .MuiOutlinedInput-root {
    height: 40px;
    padding: 0 12px;
    font-size: 14px;
  }

  .MuiInputBase-input {
    padding: 8px;
    font-size: 14px;
  }
`;

const CreateButton = styled(Button)`
  background-color: #007bff;
  color: white;
  padding: 8px 20px;
  font-size: 14px;
  text-transform: none;
  font-weight: bold;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0056b3;
  }
`;

const StyledListItem = styled(ListItem)`
  display: flex;
  align-items: center;
  padding: 16px;
  transition: background-color 0.3s ease, border-left 0.3s ease;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? '#f0f4ff' : 'transparent')};
  border-left: ${(props) => (props.selected ? '4px solid #007bff' : 'none')};

  &:hover {
    background-color: #f9f9f9;
  }
`;

const DividerStyled = styled(Divider)`
  margin: 8px 0;
`;

/**
 * MessageList Component with Pagination and Sorting by last_message_date
 */
const MessageList = ({ selectedDeal, selectedThreadId, onSelectThread, onCreateNewThread, threads }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const threadsPerPage = 10;  // Number of threads per page

    // Sort threads by the most recent last_message_date
    const sortedThreads = threads.sort((a, b) => new Date(b.last_message_date) - new Date(a.last_message_date));

    // Calculate the index range for the current page
    const indexOfLastThread = currentPage * threadsPerPage;
    const indexOfFirstThread = indexOfLastThread - threadsPerPage;
    const currentThreads = sortedThreads.slice(indexOfFirstThread, indexOfLastThread);

    // Handle Search
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page when search is active
    };

    // Filter threads based on the search term
    const filteredThreads = sortedThreads.filter((thread) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const subjectMatch = thread.subject?.toLowerCase().includes(lowerSearchTerm);

        const messageOrSenderMatch = thread.messages && thread.messages.some((message) => {
            const content = message.content ? message.content.toLowerCase() : '';
            const senderName = message.sender_name ? message.sender_name.toLowerCase() : '';
            return content.includes(lowerSearchTerm) || senderName.includes(lowerSearchTerm);
        });

        return subjectMatch || messageOrSenderMatch;
    });

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box>
            {/* Search bar and new thread button */}
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

            {/* Message List */}
            <List>
                {currentThreads.length > 0 ? (
                    currentThreads.map((thread) => (
                        <React.Fragment key={thread.id}>
                            <StyledListItem
                                selected={thread.id === selectedThreadId}
                                onClick={() => onSelectThread(thread)}
                            >
                                <StyledAvatar alt={thread.subject} />
                                <ListItemText
                                    primary={thread.subject}
                                    secondary={new Date(thread.last_message_date).toLocaleDateString()}
                                />
                            </StyledListItem>
                            <DividerStyled />
                        </React.Fragment>
                    ))
                ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '20px' }}>
                        No threads match your search
                    </Typography>
                )}
            </List>

            {/* Pagination */}
            <Pagination
                count={Math.ceil(filteredThreads.length / threadsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                color="primary"
            />
        </Box>
    );
};

export default MessageList;
