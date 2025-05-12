import React, { useState } from "react";
import { Box, Tabs, Tab, AppBar, Typography, Container, createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import StockPage from "./pages/StockPage";
import HeatmapPage from "./pages/HeatmapPage";
import AuthSetup from "./components/AuthSetup";
import "./App.css";

function App() {
  const [tabValue, setTabValue] = useState(0);

  // Create a dark theme with green accents
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00ff84',
      },
      secondary: {
        main: '#00cc69',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
      text: {
        primary: '#e0e0e0',
        secondary: '#b0b0b0',
      },
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="static" sx={{ 
          background: 'linear-gradient(to right, #121212, #1a1a1a)',
          boxShadow: '0 4px 6px rgba(0, 255, 132, 0.1)'
        }}>
          <Typography variant="h4" sx={{ 
            py: 2, 
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#00ff84',
            textShadow: '0 0 10px rgba(0, 255, 132, 0.3)'
          }}>
            Stock Price Aggregator
          </Typography>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            textColor="inherit"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#00ff84',
                height: 3,
              }
            }}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                fontSize: '1rem',
                transition: 'all 0.3s',
                '&:hover': {
                  color: '#00ff84',
                  opacity: 1,
                },
              },
              '& .Mui-selected': {
                color: '#00ff84 !important',
              }
            }}
          >
            <Tab label="Stock Chart" />
            <Tab label="Correlation Heatmap" />
          </Tabs>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
          <Box sx={{ display: 'none' }}>
            <AuthSetup />
          </Box>
          
          {tabValue === 0 && <StockPage />}
          {tabValue === 1 && <HeatmapPage />}
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
