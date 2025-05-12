import React, { useState, useEffect } from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  CircularProgress,
  Stack,
  Paper,
  InputAdornment
} from '@mui/material';
import { getStocks } from '../api';

/**
 * Component for searching and selecting stocks
 */
const StockSearch = ({ onStockSelect, onTimeFrameChange, selectedStock, timeFrame }) => {
  const [stocks, setStocks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch stocks on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const stocksData = await getStocks();
        setStocks(stocksData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch stocks. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchStocks();
  }, []);
  
  // Time frame input change
  const handleTimeChange = (event) => {
    const value = parseInt(event.target.value, 10);
    // Only update if it's a valid number between 5 and 60
    if (!isNaN(value) && value >= 5 && value <= 60) {
      onTimeFrameChange(value);
    }
  };
  
  // Stock selection
  const handleStockChange = (event) => {
    onStockSelect(event.target.value);
  };
  
  if (loading) {
    return <Box display="flex" justifyContent="center" my={3}><CircularProgress sx={{ color: '#00ff84' }} /></Box>;
  }
  
  if (error) {
    return <Typography color="#ff5555" align="center" my={3}>{error}</Typography>;
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '10px', border: '1px solid rgba(0, 255, 132, 0.2)' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#00ff84', mb: 2 }}>
        Stock Selection
      </Typography>
      <Stack spacing={3}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="stock-select-label" sx={{ color: '#b0b0b0' }}>Select Stock</InputLabel>
          <Select
            labelId="stock-select-label"
            id="stock-select"
            value={selectedStock || ''}
            onChange={handleStockChange}
            label="Select Stock"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 255, 132, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 255, 132, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#00ff84',
              }
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: '#1e1e1e',
                  border: '1px solid rgba(0, 255, 132, 0.2)',
                  '& .MuiMenuItem-root:hover': {
                    bgcolor: 'rgba(0, 255, 132, 0.1)',
                  },
                  '& .MuiMenuItem-root.Mui-selected': {
                    bgcolor: 'rgba(0, 255, 132, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 132, 0.3)',
                    }
                  }
                }
              }
            }}
          >
            {Object.entries(stocks).map(([name, ticker]) => (
              <MenuItem key={ticker} value={ticker}>
                {name} ({ticker})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box>
          <Typography gutterBottom sx={{ color: '#e0e0e0', mb: 1 }}>
            Time Frame
          </Typography>
          <TextField
            fullWidth
            id="time-frame-input"
            label="Minutes"
            type="number"
            value={timeFrame}
            onChange={handleTimeChange}
            InputProps={{
              inputProps: { 
                min: 5, 
                max: 60,
                step: 5
              },
              endAdornment: <InputAdornment position="end" sx={{ color: '#b0b0b0' }}>minutes</InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 255, 132, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 255, 132, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00ff84',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#b0b0b0',
                '&.Mui-focused': {
                  color: '#00ff84',
                },
              },
              '& input': {
                color: '#00ff84',
                fontWeight: 'bold',
              }
            }}
            helperText="Enter a value between 5 and 60 minutes"
            FormHelperTextProps={{
              sx: { color: 'rgba(0, 255, 132, 0.7)' }
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default StockSearch;
