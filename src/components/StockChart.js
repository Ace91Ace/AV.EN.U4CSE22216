import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { calculateAverage } from '../api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const StockChart = ({ stockData, stockName }) => {
  const [chartData, setChartData] = useState(null);
  const [avgPrice, setAvgPrice] = useState(0);
  
  useEffect(() => {
    if (!stockData) return;
    
    // Handle array or single stock point response
    let dataArray = [];
    if (Array.isArray(stockData)) {
      dataArray = stockData;
    } else if (stockData.stock) {
      // Response from the API as seen in curl: {"stock":{"price":960.57416,"lastUpdatedAt":"..."}}
      dataArray = [stockData.stock];
    }
    
    if (dataArray.length === 0) return;
    
    // Calculate average price
    const average = calculateAverage(dataArray);
    setAvgPrice(average);
    
    // Format data for the chart
    const formattedData = formatChartData(dataArray, average);
    setChartData(formattedData);
  }, [stockData]);
  
  // Format data for Chart.js
  const formatChartData = (data, average) => {
    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => 
      new Date(a.lastUpdatedAt) - new Date(b.lastUpdatedAt)
    );
    
    const labels = sortedData.map(item => {
      const date = new Date(item.lastUpdatedAt);
      return date.toLocaleTimeString();
    });
    
    const prices = sortedData.map(item => item.price);
    
    // Create average line data
    const averageLine = Array(labels.length).fill(average);
    
    return {
      labels,
      datasets: [
        {
          label: 'Stock Price',
          data: prices,
          borderColor: '#00ff84',
          backgroundColor: 'rgba(0, 255, 132, 0.1)',
          pointBackgroundColor: '#00ff84',
          pointBorderColor: '#121212',
          pointHoverBackgroundColor: '#121212',
          pointHoverBorderColor: '#00ff84',
          tension: 0.1,
          fill: true,
        },
        {
          label: 'Average Price',
          data: averageLine,
          borderColor: '#ffffff',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        }
      ]
    };
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e0e0e0',
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: '#1e1e1e',
        titleColor: '#00ff84',
        bodyColor: '#e0e0e0',
        borderColor: '#00ff84',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#b0b0b0',
        },
        title: {
          display: true,
          text: 'Price ($)',
          color: '#e0e0e0',
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#b0b0b0',
        },
        title: {
          display: true,
          text: 'Time',
          color: '#e0e0e0',
          font: {
            family: "'Roboto', sans-serif",
            size: 12
          }
        }
      }
    }
  };
  
  if (!stockData) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
        <Typography variant="body1">Please select a stock to view price chart</Typography>
      </Paper>
    );
  }
  
  // Display current price for single data point
  if (stockData.stock && !Array.isArray(stockData)) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: '10px' }}>
        <Typography variant="h6" gutterBottom>{stockName || 'Stock'} - Current Price</Typography>
        <Typography variant="h4" sx={{ color: '#00ff84', fontWeight: 'bold' }}>${stockData.stock.price.toFixed(2)}</Typography>
        <Typography variant="body2" color="textSecondary">
          Last Updated: {new Date(stockData.stock.lastUpdatedAt).toLocaleString()}
        </Typography>
      </Paper>
    );
  }
  
  if (Array.isArray(stockData) && stockData.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
        <Typography variant="body1">No data available for the selected time period</Typography>
      </Paper>
    );
  }
  
  if (!chartData) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 2, height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
        <CircularProgress sx={{ color: '#00ff84' }} />
      </Paper>
    );
  }
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: '10px' }}>
      <Typography variant="h6" gutterBottom>{stockName || 'Stock'} Price Chart</Typography>
      <Typography variant="subtitle1" sx={{ mb: 2, color: '#00ff84' }}>
        Average Price: ${avgPrice.toFixed(2)}
      </Typography>
      <Box sx={{ height: '400px' }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Paper>
  );
};

export default StockChart;
