import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import styled from 'styled-components';
import MessageList from './MessageList';
import MessageThread from './MessageThread';
import NewThreadForm from './NewThreadForm';
import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

// Styled components for the tab content
const TabContent = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const MainContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const LeftColumn = styled.div`
  width: 30%;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  background-color: #f9f9f9;
`;

const RightColumn = styled.div`
  width: 70%;
  padding: 20px;
`;

function TabPanel({ children, value, index }) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

const MainPage = ({ selectedDeal }) => {
    const [tabValue, setTabValue] = useState(0);
    const [threads, setThreads] = useState([]);  // Thread state managed here
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [isCreatingNewThread, setIsCreatingNewThread] = useState(false);
    const prevSelectedDealRef = useRef(selectedDeal);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setSelectedThreadId(null);
    };

    // Fetch threads when selectedDeal changes and update thread list
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
                    setThreads(response.data);  // Set fetched threads
                } catch (error) {
                    console.error('Error fetching threads:', error);
                }
            };
            fetchThreads();
        }
    }, [selectedDeal]);

    useEffect(() => {
        if (prevSelectedDealRef.current && selectedDeal && prevSelectedDealRef.current.id !== selectedDeal.id) {
            setSelectedThreadId(null);
            setIsCreatingNewThread(false);
        }
        prevSelectedDealRef.current = selectedDeal;
    }, [selectedDeal]);

    const handleNewThreadCreated = (newThread) => {
        setThreads((prevThreads) => [newThread, ...prevThreads]);
        setIsCreatingNewThread(false);
        setSelectedThreadId(newThread.id);
    };

    if (!selectedDeal) {
        return <div>Please select a deal to view details</div>;
    }

    return (
        <div>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Messages" />
                <Tab label="Tasks" />
                <Tab label="Stakeholders" />
                <Tab label="Notes" />
                <Tab label="Documents" />
                <Tab label="Activity Feed" />
                <Tab label="Roadmap" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
                <MainContainer>
                    <LeftColumn>
                        <MessageList
                            selectedDeal={selectedDeal}
                            selectedThreadId={selectedThreadId}
                            onSelectThread={(thread) => setSelectedThreadId(thread.id)}
                            onCreateNewThread={() => setIsCreatingNewThread(true)}
                            threads={threads}  // Pass threads to MessageList
                        />
                    </LeftColumn>

                    <RightColumn>
                        {isCreatingNewThread ? (
                            <NewThreadForm
                                selectedDeal={selectedDeal}
                                onNewThreadCreated={handleNewThreadCreated}
                                onCancel={() => setIsCreatingNewThread(false)}
                            />
                        ) : (
                            selectedThreadId ? (
                                <MessageThread
                                    selectedThreadId={selectedThreadId}
                                    onBack={() => setSelectedThreadId(null)}
                                />
                            ) : (
                                <Typography variant="h6">Select a message to view its content.</Typography>
                            )
                        )}
                    </RightColumn>
                </MainContainer>
            </TabPanel>

            {/* Other tab panels */}
        </div>
    );
};

export default MainPage;
