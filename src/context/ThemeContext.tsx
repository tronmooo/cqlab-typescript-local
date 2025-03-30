import React, { createContext, useState, useMemo, ReactNode, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
});

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

// Define theme colors
const lightThemeColors = {
  primary: {
    main: '#e53935', // Red
    light: '#ff6f60',
    dark: '#ab000d',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ffab00', // Amber accent
    light: '#ffdd4b',
    dark: '#c67c00',
    contrastText: '#000000',
  },
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
  },
  text: {
    primary: '#1c1c1c',
    secondary: '#585858',
  },
};

const darkThemeColors = {
  primary: {
    main: '#ff6e6e', // Light red in dark mode
    light: '#ff9e9e',
    dark: '#cf4f4f',
    contrastText: '#121212',
  },
  secondary: {
    main: '#ffd54f', // Amber for dark mode
    light: '#ffff81',
    dark: '#c8a415',
    contrastText: '#000000',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
  },
};

export const ThemeContextProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Try to get stored theme preference, default to light
  const [mode, setMode] = useState<ThemeMode>(() => {
    const storedMode = localStorage.getItem('themeMode');
    return (storedMode as ThemeMode) || 'light';
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Color mode toggle function
  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [mode]
  );

  // Create theme based on current mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light' ? lightThemeColors : darkThemeColors),
          error: {
            main: mode === 'light' ? '#cf6679' : '#ff5c8d',
          },
          warning: {
            main: '#ff9800',
          },
          info: {
            main: mode === 'light' ? '#2196f3' : '#64b5f6',
          },
          success: {
            main: mode === 'light' ? '#4caf50' : '#81c784',
          },
        },
        typography: {
          fontFamily: [
            'Inter',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'Arial',
            'sans-serif',
          ].join(','),
          h1: {
            fontWeight: 700,
          },
          h2: {
            fontWeight: 700,
          },
          h3: {
            fontWeight: 600,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 500,
          },
          h6: {
            fontWeight: 500,
          },
          button: {
            fontWeight: 600,
            textTransform: 'none',
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,
                padding: 0,
                backgroundColor: mode === 'light' ? '#f8f9fa' : '#121212',
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: mode === 'light' ? '#f1f1f1' : '#333333',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: mode === 'light' ? '#c1c1c1' : '#666666',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: mode === 'light' ? '#a1a1a1' : '#888888',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '6px',
                boxShadow: 'none',
                textTransform: 'none',
                padding: '8px 16px',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: mode === 'light' 
                    ? '0 4px 12px rgba(0, 0, 0, 0.08)'
                    : '0 4px 12px rgba(0, 0, 0, 0.3)',
                  transform: 'translateY(-1px)',
                },
              },
              containedPrimary: {
                background: mode === 'light'
                  ? 'linear-gradient(45deg, #e53935 30%, #ff6f60 90%)'
                  : 'linear-gradient(45deg, #ff6e6e 30%, #ff9e9e 90%)',
              },
              containedSecondary: {
                background: 'linear-gradient(45deg, #ffab00 30%, #ffd740 90%)',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light'
                  ? '0 2px 16px rgba(0, 0, 0, 0.08)'
                  : '0 2px 16px rgba(0, 0, 0, 0.4)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                '&:hover': {
                  boxShadow: mode === 'light'
                    ? '0 8px 24px rgba(0, 0, 0, 0.12)'
                    : '0 8px 24px rgba(0, 0, 0, 0.5)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light'
                  ? '0 1px 10px rgba(0, 0, 0, 0.1)'
                  : '0 1px 10px rgba(0, 0, 0, 0.4)',
                backgroundColor: mode === 'light' ? '#e53935' : '#1e1e1e',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
                borderRight: 'none',
                boxShadow: mode === 'light'
                  ? '2px 0 10px rgba(0, 0, 0, 0.08)'
                  : '2px 0 10px rgba(0, 0, 0, 0.3)',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              head: {
                fontWeight: 600,
                backgroundColor: mode === 'light'
                  ? 'rgba(229, 57, 53, 0.04)'
                  : 'rgba(255, 110, 110, 0.08)',
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                margin: '4px 8px',
                '&.Mui-selected': {
                  backgroundColor: mode === 'light'
                    ? 'rgba(229, 57, 53, 0.1)'
                    : 'rgba(255, 110, 110, 0.15)',
                  '&:hover': {
                    backgroundColor: mode === 'light'
                      ? 'rgba(229, 57, 53, 0.18)'
                      : 'rgba(255, 110, 110, 0.25)',
                  },
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'light' ? '#e53935' : '#ff6e6e',
                  },
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: '6px',
              },
              filledPrimary: {
                backgroundColor: mode === 'light' ? '#e53935' : '#ff6e6e',
              },
              filledSecondary: {
                backgroundColor: '#ffab00',
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light'
                  ? 'rgba(0, 0, 0, 0.1)'
                  : 'rgba(255, 255, 255, 0.12)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider; 