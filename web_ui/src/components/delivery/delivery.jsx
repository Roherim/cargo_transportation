import React from 'react';
import { Typography, Grid, Box, TextField } from '@mui/material';

const Delivery = ({ register, errors }) => {
  const sectionStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '32px',
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#ffffff',
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666666',
    },
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Основная информация */}
      <Box sx={sectionStyle}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: '#1a237e',
            fontWeight: 600,
            fontSize: '1.25rem',
            borderBottom: '2px solid #e0e0e0',
            paddingBottom: '12px',
          }}
        >
          Основная информация
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Номер доставки"
              size="large"
              {...register('number', { required: 'Это поле обязательно' })}
              error={!!errors.number}
              helperText={errors.number?.message}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Модель"
              size="large"
              {...register('model', { required: 'Это поле обязательно' })}
              error={!!errors.model}
              helperText={errors.model?.message}
              SelectProps={{ native: true }}
              sx={inputStyle}
            >
              <option value="">Выберите модель</option>
              <option value="V02">V02</option>
              <option value="V03">V03</option>
              <option value="V04">V04</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Статус доставки"
              size="large"
              {...register('status', { required: 'Это поле обязательно' })}
              error={!!errors.status}
              helperText={errors.status?.message}
              SelectProps={{ native: true }}
              sx={inputStyle}
            >
              <option value="">Выберите статус</option>
              <option value="Готово к отгрузке">Готово к отгрузке</option>
              <option value="В пути">В пути</option>
              <option value="Доставлено">Доставлено</option>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Детали доставки */}
      <Box sx={sectionStyle}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: '#1a237e',
            fontWeight: 600,
            fontSize: '1.25rem',
            borderBottom: '2px solid #e0e0e0',
            paddingBottom: '12px',
          }}
        >
          Детали доставки
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Время в пути"
              size="large"
              type="number"
              {...register('time', {
                required: 'Это поле обязательно',
                min: { value: 0, message: 'Значение должно быть положительным' },
              })}
              error={!!errors.time}
              helperText={errors.time?.message}
              InputProps={{
                endAdornment: <Typography variant="body1" sx={{ ml: 1, color: '#666666' }}>часов</Typography>,
              }}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Дистанция"
              size="large"
              type="number"
              {...register('distance', {
                required: 'Это поле обязательно',
                min: { value: 0, message: 'Значение должно быть положительным' },
              })}
              error={!!errors.distance}
              helperText={errors.distance?.message}
              InputProps={{
                endAdornment: <Typography variant="body1" sx={{ ml: 1, color: '#666666' }}>км</Typography>,
              }}
              sx={inputStyle}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Дополнительные услуги */}
      <Box sx={sectionStyle}>
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: '#1a237e',
            fontWeight: 600,
            fontSize: '1.25rem',
            borderBottom: '2px solid #e0e0e0',
            paddingBottom: '12px',
          }}
        >
          Дополнительные услуги
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Услуги"
              size="large"
              {...register('services', { required: 'Это поле обязательно' })}
              error={!!errors.services}
              helperText={errors.services?.message}
              SelectProps={{ native: true }}
              sx={inputStyle}
            >
              <option value="">Выберите услугу</option>
              <option value="Погрузка">Погрузка</option>
              <option value="Разгрузка">Разгрузка</option>
              <option value="Упаковка">Упаковка</option>
              <option value="Страхование">Страхование</option>
              <option value="Экспедирование">Экспедирование</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Упаковка"
              size="large"
              {...register('packaging', { required: 'Это поле обязательно' })}
              error={!!errors.packaging}
              helperText={errors.packaging?.message}
              SelectProps={{ native: true }}
              sx={inputStyle}
            >
              <option value="">Выберите упаковку</option>
              <option value="Картонная коробка">Картонная коробка</option>
              <option value="Деревянный ящик">Деревянный ящик</option>
              <option value="Пластиковый контейнер">Пластиковый контейнер</option>
              <option value="Металлический контейнер">Металлический контейнер</option>
              <option value="Паллета">Паллета</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="file"
              label="Медиафайл"
              size="large"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: { accept: 'image/*,application/pdf' },
              }}
              {...register('mediaFile')}
              sx={inputStyle}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Техническое состояние"
              size="large"
              {...register('technicalCondition', { required: 'Это поле обязательно' })}
              error={!!errors.technicalCondition}
              helperText={errors.technicalCondition?.message}
              SelectProps={{ native: true }}
              sx={inputStyle}
            >
              <option value="">Выберите состояние</option>
              <option value="Исправно">Исправно</option>
              <option value="Неисправно">Неисправно</option>
            </TextField>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Delivery;