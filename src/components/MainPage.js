import React, { useState, useEffect, useRef } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import styled from 'styled-components';
import MessageList from './MessageList'; // MessageList Component
import MessageThread from './MessageThread'; // MessageThread Component

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
    const [selectedThreadId, setSelectedThreadId] = useState(null); // Track selected thread ID
    const prevSelectedDealRef = useRef(selectedDeal); // Store the previous deal

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setSelectedThreadId(null); // Reset thread when switching tabs
    };

    // Clear the selected thread only if the selectedDeal changes and it's different from the previous one
    useEffect(() => {
        if (prevSelectedDealRef.current && selectedDeal && prevSelectedDealRef.current.id !== selectedDeal.id) {
            setSelectedThreadId(null); // Reset the selected thread only if a new deal is selected
        }
        prevSelectedDealRef.current = selectedDeal; // Update previous deal reference
    }, [selectedDeal]);

    if (!selectedDeal) {
        return <div>Please select a deal to view details</div>;  // Message if no deal is selected
    }

    return (
        <div>
            {/* Tabs for navigation */}
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Messages" />
                <Tab label="Tasks" />
                <Tab label="Stakeholders" />
                <Tab label="Notes" />
                <Tab label="Documents" />
                <Tab label="Activity Feed" />
                <Tab label="Roadmap" />
            </Tabs>

            {/* Tab content for each section */}
            <TabPanel value={tabValue} index={0}>
                <MainContainer>
                    {/* Left side: Message List */}
                    <LeftColumn>
                        <MessageList
                            selectedDeal={selectedDeal}
                            selectedThreadId={selectedThreadId}  // Pass selectedThreadId
                            onSelectThread={(thread) => setSelectedThreadId(thread.id)} // Set thread ID on selection
                        />
                    </LeftColumn>

                    {/* Right side: Message Thread */}
                    <RightColumn>
                        {selectedThreadId ? (
                            <MessageThread
                                selectedThreadId={selectedThreadId}
                                onBack={() => setSelectedThreadId(null)} // Reset the thread when "Back" is clicked
                            />
                        ) : (
                            <Typography variant="h6">Select a message to view its content.</Typography>
                        )}
                    </RightColumn>
                </MainContainer>
            </TabPanel>

            {/* Other tab panels remain the same */}
            <TabPanel value={tabValue} index={1}>
                <TabContent>
                    <Typography variant="h6">Tasks for {selectedDeal.deal_name}</Typography>
                    <p>Here are the tasks for {selectedDeal.deal_name}.</p>
                </TabContent>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                <TabContent>
                    <Typography variant="h6">Stakeholders for {selectedDeal.deal_name}</Typography>
                    <p>Here are the stakeholders for {selectedDeal.deal_name}.</p>
                </TabContent>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
                <TabContent>
                    <Typography variant="h6">Notes for {selectedDeal.deal_name}</Typography>
                    <p>Here are the notes for {selectedDeal.deal_name}.</p>
                </TabContent>
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
                <TabContent>
                    <Typography variant="h6">Documents for {selectedDeal.deal_name}</Typography>
                    <p>Here are the documents for {selectedDeal.deal_name}.</p>
                </TabContent>
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
                <TabContent>
                    <Typography variant="h6">Activity Feed for {selectedDeal.deal_name}</Typography>
                    <p>Here is the activity feed for {selectedDeal.deal_name}.</p>
                </TabContent>
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
                <TabContent>
                    <Typography variant="h6">Roadmap for {selectedDeal.deal_name}</Typography>
                    <p>Here is the roadmap for {selectedDeal.deal_name}.</p>
                </TabContent>
            </TabPanel>
        </div>
    );
};

export default MainPage;
