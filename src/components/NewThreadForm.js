import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
`;

const NewThreadForm = ({ selectedDeal, onNewThreadCreated, onCancel }) => {
    const [newThreadSubject, setNewThreadSubject] = useState('');
    const [newThreadMessage, setNewThreadMessage] = useState('');

    const handleSubmitNewThread = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BASE_URL}/threads`, {
                subject: newThreadSubject,
                initialMessage: newThreadMessage,
                deal_id: selectedDeal.id,  // Associate the new thread with the selected deal
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Clear form and notify parent component of new thread creation
            setNewThreadSubject('');
            setNewThreadMessage('');
            onNewThreadCreated(response.data);  // Pass the new thread data back
        } catch (error) {
            console.error('Error creating new thread:', error);
        }
    };

    return (
        <FormContainer>
            <TextField
                label="Thread Subject"
                variant="outlined"
                value={newThreadSubject}
                onChange={(e) => setNewThreadSubject(e.target.value)}
            />
            <TextField
                label="Initial Message"
                variant="outlined"
                multiline
                rows={4}
                value={newThreadMessage}
                onChange={(e) => setNewThreadMessage(e.target.value)}
            />
            <Box display="flex" gap="10px">
                <Button variant="contained" color="primary" onClick={handleSubmitNewThread}>
                    Create Thread
                </Button>
                <Button variant="outlined" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </FormContainer>
    );
};

export default NewThreadForm;
