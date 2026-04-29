import { useMemo, useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/hooks/useToast';
import { MAINTENANCE_TYPES } from '@/constants/maintenance-type.enum';
import { SERVICE_DESCRIPTION } from '@/constants/service-description.enum';

// MUI
import { inputBaseClasses } from '@mui/material/InputBase';
import { filledInputClasses } from '@mui/material/FilledInput';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

// MUI ICONS
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import BarChartIcon from '@mui/icons-material/BarChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SendIcon from '@mui/icons-material/Send';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import type { TruckId, FacilityLocation } from '@/services/api.interface';

interface FormData {
  truckId: string;
  maintenanceDate: string;
  maintenanceType: string | null;
  facilityLocation: string;
  serviceDescription: string | null;
  usageOdometer: string;
  workingHours: string;
  downtime: string;
  maintenanceCost: string;
  sparePartsCost: string;
}

function Form() {
  const { showToast } = useToast();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [truckOptions, setTruckOptions] = useState<TruckId[]>([]);
  const [facilityOptions, setFacilityOptions] = useState<FacilityLocation[]>(
    []
  );

  const initialFormState: FormData = {
    truckId: '',
    maintenanceDate: '',
    maintenanceType: null,
    facilityLocation: '',
    serviceDescription: null,
    usageOdometer: '',
    workingHours: '',
    downtime: '',
    maintenanceCost: '',
    sparePartsCost: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormState);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trucks, facilities] = await Promise.all([
          apiService.getTruckIds(),
          apiService.getFacilityLocations()
        ]);
        setTruckOptions(trucks);
        setFacilityOptions(facilities);
      } catch (error) {
        showToast('Failed to Fetch Data', 'error');
        console.error('Fetch Data Error:', error);
      }
    };
    fetchData();
  }, [showToast]);

  const today = new Date().toISOString().split('T')[0];

  const formatNumeric = (value: string) => {
    if (!value) return '';

    const parts = value.split('.');
    const mainNumber = parts[0].replace(/\D/g, '');
    const decimalPart = parts[1];

    if (!mainNumber && !decimalPart && !value.includes('.')) return '';

    const formattedMain = new Intl.NumberFormat('en-US').format(
      parseInt(mainNumber || '0', 10)
    );

    return value.includes('.')
      ? `${formattedMain}.${decimalPart !== undefined ? decimalPart.slice(0, 2) : ''}`
      : formattedMain;
  };

  const filteredDescriptions = useMemo(() => {
    if (!formData.maintenanceType) return SERVICE_DESCRIPTION;

    const searchKey = formData.maintenanceType.toLowerCase();
    return SERVICE_DESCRIPTION.filter((desc) =>
      desc.toLowerCase().includes(searchKey)
    );
  }, [formData.maintenanceType]);

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let cleanValue = value.replace(/[^0-9.]/g, '');

    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    const values = Object.values(formData);

    const isAllFilled = values.every((value) => value !== '' && value !== null);

    console.log('Current Form Values:', Object.entries(formData));

    if (!isAllFilled) {
      showToast('Fill All Required Fields', 'error');
      return;
    }

    if (formData.maintenanceDate > today) {
      showToast('Maintenance Date cannot be in the future', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        truckId: formData.truckId,
        maintenanceDate: formData.maintenanceDate,
        maintenanceType: formData.maintenanceType,
        facilityLocation: formData.facilityLocation,
        serviceDescription: formData.serviceDescription,
        odometerReading: parseInt(
          formData.usageOdometer.replace(/,/g, '') || '0',
          10
        ),
        laborHours: parseFloat(formData.workingHours.replace(/,/g, '') || '0'),
        laborCost: parseFloat(
          formData.maintenanceCost.replace(/,/g, '') || '0'
        ),
        partCost: parseFloat(formData.sparePartsCost.replace(/,/g, '') || '0'),
        downtimeHours: parseFloat(formData.downtime.replace(/,/g, '') || '0')
      };

      const response = await apiService.postMaintenanceData(payload);
      const apiMessage = response?.message || 'Form Submitted Successfully!';

      const isAnomaly = response?.data?.is_anomaly || false;
      const toastType = isAnomaly ? 'warning' : 'success';

      showToast(apiMessage, toastType);

      if (!isAnomaly) {
        setFormData(initialFormState);
        setSubmitted(false);
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message || 'Failed to Submit Form';
      showToast(errorMessage, 'error');
      console.error('Submission Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filledInputStyle = {
    borderRadius: '8px 8px 0 0',
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      display: 'none',
      margin: 0
    },
    '& input[type=number]': {
      MozAppearance: 'textfield'
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stack spacing={3}>
          {/* TRUCK INFO SECTION */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: '12px', bgcolor: 'white' }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <DirectionsCarIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Truck ID
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Autocomplete
              options={truckOptions}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.truckId
              }
              value={
                truckOptions.find((opt) => opt.truckId === formData.truckId) ||
                null
              }
              onChange={(_, newValue) => {
                setFormData((prev) => ({
                  ...prev,
                  truckId: newValue ? newValue.truckId : ''
                }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Truck ID"
                  variant="filled"
                  required
                  error={submitted && !formData.truckId}
                  helperText={
                    submitted && !formData.truckId ? 'Truck ID is required' : ''
                  }
                  sx={filledInputStyle}
                />
              )}
            />
          </Paper>

          {/* MAINTENANCE DETAILS SECTION */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: '12px', bgcolor: 'white' }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <BuildIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Maintenance Details
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2.5}>
              <FormControl
                required
                fullWidth
                variant="filled"
                error={submitted && !formData.maintenanceDate}
              >
                <InputLabel shrink>Maintenance Date</InputLabel>
                <FilledInput
                  name="maintenanceDate"
                  required
                  type="date"
                  value={formData.maintenanceDate}
                  onChange={handleInputChange}
                  sx={filledInputStyle}
                  inputProps={{ max: today }}
                />
                {submitted && !formData.maintenanceDate && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}
                  >
                    Maintenance Date is required
                  </Typography>
                )}
                {formData.maintenanceDate > today && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}
                  >
                    Maintenance Date cannot be in the future
                  </Typography>
                )}
              </FormControl>

              <Autocomplete
                options={MAINTENANCE_TYPES}
                value={formData.maintenanceType}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    maintenanceType: newValue,
                    serviceDescription: null
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Maintenance Type"
                    variant="filled"
                    required
                    error={submitted && !formData.maintenanceType}
                    helperText={
                      submitted && !formData.maintenanceType
                        ? 'Choose a Maintenance Type'
                        : ''
                    }
                    sx={filledInputStyle}
                  />
                )}
              />

              <Autocomplete
                options={facilityOptions}
                getOptionLabel={(option) =>
                  typeof option === 'string' ? option : option.name
                }
                value={
                  facilityOptions.find(
                    (opt) => opt.name === formData.facilityLocation
                  ) || null
                }
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    facilityLocation: newValue ? newValue.name : ''
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Facility Location"
                    variant="filled"
                    required
                    error={submitted && !formData.facilityLocation}
                    helperText={
                      submitted && !formData.facilityLocation
                        ? 'Choose a Facility Location'
                        : ''
                    }
                    sx={filledInputStyle}
                  />
                )}
              />

              <Autocomplete
                options={filteredDescriptions}
                value={formData.serviceDescription}
                disabled={!formData.maintenanceType}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({
                    ...prev,
                    serviceDescription: newValue
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Service Description"
                    variant="filled"
                    required
                    error={
                      (submitted && !formData.serviceDescription) ||
                      (submitted && !formData.maintenanceType)
                    }
                    helperText={
                      submitted && !formData.maintenanceType
                        ? 'Choose a Maintenance Type first'
                        : 'Choose a Service Description'
                    }
                    sx={filledInputStyle}
                  />
                )}
              />
            </Stack>
          </Paper>

          {/* USAGE METRICS SECTION */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: '12px', bgcolor: 'white' }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <BarChartIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Usage Metrics
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2.5}>
              <FormControl
                required
                fullWidth
                variant="filled"
                error={submitted && !formData.usageOdometer}
              >
                <InputLabel>Odometer Reading</InputLabel>
                <FilledInput
                  name="usageOdometer"
                  required
                  endAdornment={
                    <InputAdornment position="end">km</InputAdornment>
                  }
                  inputMode="decimal"
                  value={formatNumeric(formData.usageOdometer)}
                  onChange={handleNumericChange}
                  sx={filledInputStyle}
                />
                {submitted && !formData.usageOdometer && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}
                  >
                    Odometer Reading is required
                  </Typography>
                )}
              </FormControl>

              <FormControl
                required
                fullWidth
                variant="filled"
                error={submitted && !formData.workingHours}
              >
                <InputLabel>Working Hours</InputLabel>
                <FilledInput
                  name="workingHours"
                  required
                  endAdornment={
                    <InputAdornment
                      position="end"
                      sx={{
                        alignSelf: 'flex-end',
                        opacity: 0,
                        pointerEvents: 'none',
                        [`.${filledInputClasses.root} &`]: {
                          marginBottom: '7.5px'
                        },
                        [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]:
                          {
                            opacity: 1
                          }
                      }}
                    >
                      hours
                    </InputAdornment>
                  }
                  inputMode="decimal"
                  value={formatNumeric(formData.workingHours)}
                  onChange={handleNumericChange}
                  sx={filledInputStyle}
                />
                {submitted && !formData.workingHours && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}
                  >
                    Working Hours is required
                  </Typography>
                )}
              </FormControl>

              <FormControl
                required
                fullWidth
                variant="filled"
                error={submitted && !formData.downtime}
              >
                <InputLabel>Downtime Hours</InputLabel>
                <FilledInput
                  name="downtime"
                  required
                  endAdornment={
                    <InputAdornment
                      position="end"
                      sx={{
                        alignSelf: 'flex-end',
                        opacity: 0,
                        pointerEvents: 'none',
                        [`.${filledInputClasses.root} &`]: {
                          marginBottom: '7.5px'
                        },
                        [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]:
                          {
                            opacity: 1
                          }
                      }}
                    >
                      hours
                    </InputAdornment>
                  }
                  inputMode="decimal"
                  value={formatNumeric(formData.downtime)}
                  onChange={handleNumericChange}
                  sx={filledInputStyle}
                />
                {submitted && !formData.downtime && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}
                  >
                    Downtime Hours is required
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Paper>

          {/* COST INFO SECTION */}
          <Paper
            elevation={0}
            sx={{ p: 3, borderRadius: '12px', bgcolor: 'white' }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <AttachMoneyIcon />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Cost Information
              </Typography>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2.5}>
              <FormControl
                required
                fullWidth
                variant="filled"
                error={submitted && !formData.maintenanceCost}
              >
                <InputLabel>Maintenance Cost</InputLabel>
                <FilledInput
                  name="maintenanceCost"
                  required
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  placeholder="0.00"
                  inputMode="decimal"
                  value={formatNumeric(formData.maintenanceCost)}
                  onChange={handleNumericChange}
                  sx={filledInputStyle}
                />
                {submitted && !formData.maintenanceCost && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}
                  >
                    Maintenance Cost is required
                  </Typography>
                )}
              </FormControl>

              <FormControl
                required
                fullWidth
                variant="filled"
                error={submitted && !formData.sparePartsCost}
              >
                <InputLabel>Spare Parts Cost</InputLabel>
                <FilledInput
                  name="sparePartsCost"
                  required
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  placeholder="0.00"
                  inputMode="decimal"
                  value={formatNumeric(formData.sparePartsCost)}
                  onChange={handleNumericChange}
                  sx={filledInputStyle}
                />
                {submitted && !formData.sparePartsCost && (
                  <Typography
                    variant="caption"
                    sx={{ color: 'error.main', mt: 0.5, ml: 1.5 }}
                  >
                    Spare Parts Cost is required
                  </Typography>
                )}
              </FormControl>
            </Stack>
          </Paper>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<SendIcon />}
              sx={{
                px: 3.5,
                '&.Mui-disabled': {
                  bgcolor: 'primary.light',
                  color: '#fff'
                },
                '& .MuiButton-loadingIndicator': {
                  color: '#fff'
                }
              }}
              disabled={loading}
              loading={loading}
              loadingPosition="end"
              onClick={handleSubmit}
            >
              {loading ? 'Sending...' : 'Submit'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}

export default Form;
