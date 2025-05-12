import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { api } from '../../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await api.getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Total Deliveries Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Deliveries
            </Typography>
            <Typography variant="h4">
              {statistics?.total_deliveries || 0}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Deliveries by Status */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title="Deliveries by Status" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics?.deliveries_by_status}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status__name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Deliveries by Cargo Type */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Deliveries by Cargo Type" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statistics?.deliveries_by_cargo_type}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cargo_type__name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Deliveries Over Time */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Deliveries Over Time" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics?.deliveries_by_date}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="delivery_date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 