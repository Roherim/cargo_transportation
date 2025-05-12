import React from 'react';
import { Grid } from '@mui/material';
import TransportModel from '../transport_model/transport_model';
import AddressMap from '../address_map/address_map';
import DateTime from '../datetime/datetime';
import PackagingType from '../packaging/packaging';
import CargoType from '../cargo_type/cargo_type';
import Services from '../services/services';

const DeliveryForm = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <TransportModel />
            </Grid>

            <Grid item xs={12}>
                <AddressMap />
            </Grid>

            <Grid item xs={12}>
                <DateTime />
            </Grid>

            <Grid item xs={12}>
                <PackagingType />
            </Grid>

            <Grid item xs={12}>
                <CargoType />
            </Grid>

            <Grid item xs={12}>
                <Services />
            </Grid>
        </Grid>
    );
};

export default DeliveryForm; 