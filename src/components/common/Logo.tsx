import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ScienceIcon from '@mui/icons-material/Science';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 600,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
}));

const Logo: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <Tooltip title="Go to Homepage">
      <LogoContainer onClick={handleClick}>
        <IconButton size="large" color="primary">
          <ScienceIcon />
        </IconButton>
        <LogoText variant="h6">
          CQLab
        </LogoText>
      </LogoContainer>
    </Tooltip>
  );
};

export default Logo; 