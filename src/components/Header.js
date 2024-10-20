import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Menu, MenuItem, Avatar, IconButton, InputBase } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';

// Styled Components
const StyledAppBar = styled.header`
  background-color: #fff;
  border-bottom: 1px solid #e7edf3;
  box-shadow: none;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
  height: 64px;
  align-items: center;
  font-family: 'Inter', 'Noto Sans', sans-serif;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Title = styled.h6`
  font-size: 1rem;
  font-weight: bold;
  color: #0e141b;
  margin-left: 8px;
  font-family: 'Inter', 'Noto Sans', sans-serif;
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 40px;
  margin-left: auto;
  margin-right: 40px;
`;

const StyledLink = styled(Link)`
  color: #0e141b;
  font-weight: bold;
  text-decoration: none;
  font-family: 'Inter', 'Noto Sans', sans-serif;

  &:hover {
    text-decoration: underline;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const DealButton = styled.button`
  background-color: #e7edf3;
  padding: 8px 16px;
  color: #0e141b;
  border-radius: 10px;
  text-transform: none;
  font-weight: bold;
  font-family: 'Inter', 'Noto Sans', sans-serif;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #d7e1eb; /* Slight hover effect */
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #e7edf3;
  border-radius: 10px;
  padding: 4px 8px;
  transition: width 0.3s ease-in-out;
  width: ${(props) => (props.isExpanded ? '200px' : '30px')};
  overflow: hidden;
`;

const StyledInputBase = styled(InputBase)`
  color: #0e141b;
  font-family: 'Inter', 'Noto Sans', sans-serif;
  margin-left: 8px;
  flex: 1;
`;

const BASE_URL = 'http://localhost:5001';  // Base URL for the API

const Header = ({ selectedDeal, setSelectedDeal }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [deals, setDeals] = useState([]);  // Array to hold deals fetched from the API
    const [user, setUser] = useState(null);  // State to hold user data
    const [dealAnchorEl, setDealAnchorEl] = useState(null); // Anchor for deal dropdown
    const [userAnchorEl, setUserAnchorEl] = useState(null); // Anchor for user menu
    const [isSearchExpanded, setIsSearchExpanded] = useState(false); // Search field expansion state
    const isDealMenuOpen = Boolean(dealAnchorEl);
    const isUserMenuOpen = Boolean(userAnchorEl);

    // Fetch deals and user data when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                // Fetch deals based on the authenticated user
                const dealsResponse = await axios.get(`${BASE_URL}/deals`, config);
                const fetchedDeals = dealsResponse.data;

                if (fetchedDeals.length > 0) {
                    setDeals(fetchedDeals);
                    if (!selectedDeal) {
                        setSelectedDeal(fetchedDeals[0]);  // Set the first deal as the default if no deal is selected
                    }
                }

                // Fetch user info
                const userResponse = await axios.get(`${BASE_URL}/user`, config);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token, selectedDeal, setSelectedDeal]);

    const handleDealClick = (event) => {
        setDealAnchorEl(event.currentTarget);
    };

    const handleDealClose = () => {
        setDealAnchorEl(null);
    };

    const handleDealSelect = (deal) => {
        setSelectedDeal(deal);  // Update the selected deal in the global state
        handleDealClose();  // Close the dropdown
    };

    const handleUserMenuClick = (event) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        window.location.reload();
    };

    const handleSearchClick = () => {
        setIsSearchExpanded((prev) => !prev);
    };

    if (!user || !selectedDeal) {
        return <div>Loading...</div>; // Loading state while data is being fetched
    }

    return (
        <StyledAppBar>
            <LogoContainer>
                <Link to="/">
                    <img src="/path-to-your-logo/logo.png" alt="Logo" width="36" height="36" />
                    <Title>Sales Management App</Title>
                </Link>
            </LogoContainer>

            <NavLinks>
                <StyledLink to="/">Home</StyledLink>
                <StyledLink to="/pipeline">Pipeline</StyledLink>
                <StyledLink to="/library">Library</StyledLink>
                <StyledLink to="/insights">Insights</StyledLink>
                <StyledLink to="/reports">Reports</StyledLink>
            </NavLinks>

            <RightSection>
                {/* Deal Dropdown Button */}
                <DealButton onClick={handleDealClick}>
                    {selectedDeal ? selectedDeal.deal_name : "Select a Deal"} {/* Display the selected deal */}
                </DealButton>

                {/* Deal Dropdown Menu */}
                <Menu
                    anchorEl={dealAnchorEl}
                    open={isDealMenuOpen}
                    onClose={handleDealClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            borderRadius: '10px',
                            minWidth: 200,
                            padding: '5px',
                        },
                    }}
                >
                    {deals.map((deal) => (
                        <MenuItem key={deal.id} onClick={() => handleDealSelect(deal)}>
                            {deal.deal_name}
                        </MenuItem>
                    ))}
                </Menu>

                {/* Search Icon and Input */}
                <SearchContainer isExpanded={isSearchExpanded}>
                    <IconButton onClick={handleSearchClick} sx={{ padding: '4px' }}>
                        <SearchIcon sx={{ color: '#0e141b' }} />
                    </IconButton>
                    {isSearchExpanded && <StyledInputBase placeholder="Search..." />}
                </SearchContainer>

                {/* Notification Icon */}
                <IconButton sx={{ backgroundColor: '#e7edf3', borderRadius: 2 }}>
                    <NotificationsIcon sx={{ color: '#0e141b' }} />
                </IconButton>

                {/* User Menu */}
                <IconButton onClick={handleUserMenuClick}>
                    <Avatar
                        src={user.avatarUrl || 'https://cdn.usegalileo.ai/stability/07c83bff-b55a-44ca-a01f-a1e09a0d4ac6.png'}
                        alt="Profile"
                        sx={{ width: 40, height: 40 }}
                    />
                </IconButton>

                {/* User Info */}
                <Menu
                    anchorEl={userAnchorEl}
                    open={isUserMenuOpen}
                    onClose={handleUserMenuClose}
                    PaperProps={{
                        elevation: 3,
                        sx: {
                            borderRadius: '10px',
                            minWidth: 200,
                            padding: '10px',
                        },
                    }}
                >
                    <MenuItem disabled>
                        <strong>{user.first_name} {user.last_name}</strong>
                    </MenuItem>
                    <MenuItem disabled>
                        Access: {user.access}
                    </MenuItem>
                    <MenuItem disabled>
                        Role: {user.role}
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: 'red', fontWeight: 'bold' }}>
                        Sign Out
                    </MenuItem>
                </Menu>
            </RightSection>
        </StyledAppBar>
    );
};

export default Header;
