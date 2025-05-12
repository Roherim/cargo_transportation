import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { api } from '../../services/api';

const DeliveryList = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    status: '',
    cargoType: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    statuses: [],
    cargoTypes: []
  });

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [statuses, cargoTypes] = await Promise.all([
          api.getDeliveryStatuses(),
          api.getCargoTypes()
        ]);

        setFilterOptions({
          statuses,
          cargoTypes
        });
      } catch (error) {
        console.error('Error fetching filter options:', error);
        setError(error.message);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const queryParams = {};
        
        if (filters.startDate) {
          queryParams.start_date = filters.startDate.toISOString().split('T')[0];
        }
        if (filters.endDate) {
          queryParams.end_date = filters.endDate.toISOString().split('T')[0];
        }
        if (filters.status) {
          queryParams.status = filters.status;
        }
        if (filters.cargoType) {
          queryParams.cargo_type = filters.cargoType;
        }
        if (search) {
          queryParams.search = search;
        }

        const data = await api.getDeliveries(queryParams);
        setDeliveries(data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [filters, search]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/deliveries/${id}/edit`);
  };

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
    <Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Search"
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => handleFilterChange('endDate', date)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions.statuses.map((status) => (
              <MenuItem key={status.id} value={status.id}>
                {status.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Cargo Type"
            value={filters.cargoType}
            onChange={(e) => handleFilterChange('cargoType', e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {filterOptions.cargoTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Number</TableCell>
              <TableCell>Transport</TableCell>
              <TableCell>Pickup Address</TableCell>
              <TableCell>Delivery Address</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deliveries
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.number}</TableCell>
                  <TableCell>
                    {delivery.transport_model.name} ({delivery.transport_number})
                  </TableCell>
                  <TableCell>{delivery.pickup_address}</TableCell>
                  <TableCell>{delivery.delivery_address}</TableCell>
                  <TableCell>{delivery.status.name}</TableCell>
                  <TableCell>
                    {new Date(delivery.delivery_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(delivery.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={deliveries.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
};

export default DeliveryList; 