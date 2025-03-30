import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';

const HelpContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto'
}));

const SearchBar = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiInputBase-root': {
    borderRadius: theme.shape.borderRadius * 2,
  }
}));

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | false>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAccordionChange = (section: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedSection(isExpanded ? section : false);
  };

  const faqs = [
    {
      section: 'Getting Started',
      questions: [
        {
          question: 'What is the Flow Editor?',
          answer: 'The Flow Editor is a visual tool for creating and managing clinical decision support flows. It allows you to create complex decision trees, conditions, and actions using a drag-and-drop interface.'
        },
        {
          question: 'How do I create a new flow?',
          answer: 'To create a new flow, click the "New Flow" button in the top toolbar. You can then add nodes by dragging them from the left panel and connecting them to create your flow logic.'
        },
        {
          question: 'What types of nodes are available?',
          answer: 'The Flow Editor supports various node types including Start, End, True/False conditions, Branch nodes, Logic Trees, Custom Forms, and Action nodes. Each type serves a specific purpose in your flow.'
        }
      ]
    },
    {
      section: 'Flow Development',
      questions: [
        {
          question: 'How do I add conditions to my flow?',
          answer: 'Add a True/False node and configure its condition in the properties panel. You can use patient data, answers, and context variables in your conditions.'
        },
        {
          question: 'Can I test my flow before saving?',
          answer: 'Yes, use the Test Workbench panel on the right to input test data and see how your flow executes. This helps validate your flow logic before saving.'
        },
        {
          question: 'How do I save my flow?',
          answer: 'Click the Save button in the top toolbar or use Ctrl+S (Cmd+S on Mac) to save your flow. Make sure to validate your flow first to catch any potential issues.'
        }
      ]
    },
    {
      section: 'Code Integration',
      questions: [
        {
          question: 'How do I add custom code to my flow?',
          answer: 'Use the Code Editor to write TypeScript code that integrates with your flow. You can create custom functions, evaluate conditions, and handle complex logic.'
        },
        {
          question: 'What TypeScript features are supported?',
          answer: 'The Code Editor supports modern TypeScript features including interfaces, types, generics, and async/await. You can also use the built-in examples as reference.'
        },
        {
          question: 'How do I debug my code?',
          answer: 'Use the browser\'s developer tools (F12) to debug your code. The Code Editor also provides error highlighting and code completion.'
        }
      ]
    },
    {
      section: 'Settings and Configuration',
      questions: [
        {
          question: 'How do I customize the editor settings?',
          answer: 'Go to the Settings page to configure editor preferences, theme, language, and other options. Changes are saved automatically.'
        },
        {
          question: 'Can I change the flow editor theme?',
          answer: 'Yes, you can switch between light and dark themes in the Settings page. This affects both the editor and the code view.'
        },
        {
          question: 'How do I manage my saved flows?',
          answer: 'Use the Flows page to view, edit, and manage all your saved flows. You can also organize them into categories and search through them.'
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(section => ({
    ...section,
    questions: section.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <HelpContainer>
      <Typography variant="h4" gutterBottom>
        Help Center
      </Typography>

      <SearchBar
        fullWidth
        variant="outlined"
        placeholder="Search for help..."
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {filteredFaqs.map((section) => (
            <Accordion
              key={section.section}
              expanded={expandedSection === section.section}
              onChange={handleAccordionChange(section.section)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{section.section}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {section.questions.map((faq, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {faq.question}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <List>
                <ListItem button component="a" href="/code">
                  <ListItemIcon>
                    <CodeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Code Editor" />
                </ListItem>
                <ListItem button component="a" href="/settings">
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
                <ListItem button component="a" href="/flows">
                  <ListItemIcon>
                    <PlayArrowIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Flows" />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Common Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<SaveIcon />}
                  label="Save Flow"
                  onClick={() => {}}
                />
                <Chip
                  icon={<PlayArrowIcon />}
                  label="Test Flow"
                  onClick={() => {}}
                />
                <Chip
                  icon={<CodeIcon />}
                  label="View Code"
                  onClick={() => {}}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </HelpContainer>
  );
};

export default Help; 