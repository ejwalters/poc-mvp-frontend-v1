import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Avatar, TextField, Button, Box, Typography } from '@mui/material';  // Added Typography import
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

const PaginationContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
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

    // Handle page change (next and previous)
    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

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
                {currentThreads.length > 0 ? (
                    currentThreads.map((thread) => (
                        <StyledListItem
                            key={thread.id}
                            selected={thread.id === selectedThreadId}
                            onClick={() => onSelectThread(thread)}
                        >
                            <StyledAvatar alt={thread.subject} />
                            <ListItemText
                                primary={thread.subject}
                                secondary={new Date(thread.last_message_date).toLocaleDateString()}
                            />
                        </StyledListItem>
                    ))
                ) : (
                    <Typography>No threads match your search</Typography>
                )}
            </List>

            {/* Pagination Controls */}
            <PaginationContainer>
                <Button
                    disabled={currentPage === 1}
                    onClick={handlePreviousPage}
                >
                    Previous
                </Button>
                <Typography>Page {currentPage}</Typography>
                <Button
                    disabled={indexOfLastThread >= filteredThreads.length}
                    onClick={handleNextPage}
                >
                    Next
                </Button>
            </PaginationContainer>
        </>
    );
};

export default MessageList;
