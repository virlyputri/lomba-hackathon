import { useState, useEffect, Fragment } from 'react';
import { useToast } from '@/components/hooks/useToast';
import { apiService } from '@/services/api';
import type {
  MaintenanceRecord,
  TruckId,
  GetAllResponse
} from '@/services/api.interface';

// MUI
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

// MUI ICONS
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface ExpandedRows {
  [key: number]: boolean;
}

function History() {
  const { showToast } = useToast();

  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRecord[]>(
    []
  );
  const [truckIds, setTruckIds] = useState<TruckId[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedTruck, setSelectedTruck] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc' | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<ExpandedRows>({});

  // Fetch truck IDs for filter
  useEffect(() => {
    const fetchTruckIds = async () => {
      try {
        const data = await apiService.getTruckIds();
        setTruckIds(data);
      } catch (error) {
        showToast('Failed to fetch truck IDs', 'error');
        console.error('Fetch Truck IDs Error:', error);
      }
    };
    fetchTruckIds();
  }, [showToast]);

  // Fetch maintenance data
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      setLoading(true);
      try {
        const response: GetAllResponse = await apiService.getMaintenanceData(
          page + 1,
          rowsPerPage,
          selectedTruck || '',
          sort || 'desc'
        );
        setMaintenanceData(response.data || []);
        setTotalPages(response.meta.totalPages || 0);
      } catch (error) {
        showToast('Failed to fetch maintenance data', 'error');
        console.error('Fetch Maintenance Data Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenanceData();
  }, [page, rowsPerPage, selectedTruck, sort, showToast]);

  const handleExpandClick = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
    setExpandedRows({});
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setExpandedRows({});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (value: string | number) => {
    return `$${parseFloat(value.toString()).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* Filter Section */}
        <Stack direction="row" spacing={2}>
          <FormControl
            variant="filled"
            sx={{
              minWidth: 300,
              backgroundColor: '#1e293b',
              borderRadius: '4px'
            }}
          >
            <InputLabel sx={{ color: '#94a3b8' }}>Filter by Truck</InputLabel>
            <Select
              value={selectedTruck}
              label="Filter by Truck"
              onChange={(e) => {
                setSelectedTruck(e.target.value);
                setPage(0);
                setExpandedRows({});
              }}
              sx={{
                color: '#f8fafc',
                '.MuiSelect-icon': { color: '#94a3b8' }
              }}
            >
              <MenuItem value="">All Trucks</MenuItem>
              {truckIds.map((truck) => (
                <MenuItem key={truck.id} value={truck.truckId}>
                  {truck.truckId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            variant="filled"
            sx={{
              minWidth: 200,
              backgroundColor: '#1e293b',
              borderRadius: '4px'
            }}
          >
            <InputLabel sx={{ color: '#94a3b8' }}>Sort by Date</InputLabel>
            <Select
              value={sort || ''}
              label="Sort by Date"
              onChange={(e) => {
                setSort((e.target.value as 'asc' | 'desc') || null);
                setPage(0);
                setExpandedRows({});
              }}
              sx={{
                color: '#f8fafc',
                '.MuiSelect-icon': { color: '#94a3b8' }
              }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Table Section */}
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: '#0f172a',
            backgroundImage: 'none',
            borderRadius: '8px',
            border: '1px solid #334155',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress sx={{ color: '#3b82f6' }} />
            </Box>
          ) : (
            <>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#1e293b' }}>
                    <TableCell
                      sx={{ borderBottom: '1px solid #334155', width: '50px' }}
                    />
                    <TableCell sx={headerStyle}>Truck ID</TableCell>
                    <TableCell sx={headerStyle}>Date</TableCell>
                    <TableCell sx={headerStyle}>Type</TableCell>
                    <TableCell sx={headerStyle}>Total Cost</TableCell>
                    <TableCell sx={headerStyle}>Facility</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenanceData.map((record) => (
                    <Fragment key={record.id}>
                      <TableRow
                        hover
                        onClick={() => handleExpandClick(record.id)}
                        sx={{
                          cursor: 'pointer',
                          backgroundColor: expandedRows[record.id]
                            ? '#1e293b'
                            : 'transparent',
                          '&:hover': { backgroundColor: '#1e293b !important' },
                          '& td': { borderBottom: '1px solid #334155' }
                        }}
                      >
                        <TableCell>
                          <IconButton size="small" sx={{ color: '#3b82f6' }}>
                            {expandedRows[record.id] ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell sx={cellStyle}>
                          {record.truck?.truckId}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                          {formatDate(record.maintenanceDate)}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                          <Box component="span" sx={typeBadgeStyle}>
                            {record.maintenanceType}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            ...cellStyle,
                            fontWeight: 'bold',
                            color: '#10b981'
                          }}
                        >
                          {formatCurrency(record.totalCost)}
                        </TableCell>
                        <TableCell sx={cellStyle}>
                          {record.facilityLocation?.name}
                        </TableCell>
                      </TableRow>

                      {/* Baris Detail (Collapse) */}
                      <TableRow>
                        <TableCell colSpan={6} sx={{ p: 0, border: 'none' }}>
                          <Collapse
                            in={expandedRows[record.id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box
                              sx={{
                                p: 3,
                                backgroundColor: '#020617',
                                borderBottom: '1px solid #3b82f6'
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns:
                                    'repeat(auto-fit, minmax(200px, 1fr))',
                                  gap: 3
                                }}
                              >
                                <DetailField
                                  label="Odometer Reading"
                                  value={`${record.odometerReading.toLocaleString()} km`}
                                />
                                <DetailField
                                  label="Labor Hours"
                                  value={`${record.laborHours} hrs`}
                                />
                                <DetailField
                                  label="Labor Cost"
                                  value={formatCurrency(record.laborCost)}
                                />
                                <DetailField
                                  label="Part Cost"
                                  value={formatCurrency(record.partCost)}
                                />
                                <DetailField
                                  label="Downtime"
                                  value={`${record.downtimeHours} hrs`}
                                />
                                <DetailField
                                  label="Description"
                                  value={record.serviceDescription}
                                />
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalPages * rowsPerPage}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: '1px solid #334155',
                  color: '#94a3b8',
                  '.MuiTablePagination-selectIcon': { color: '#94a3b8' },
                  '& .MuiTablePagination-displayedRows': {
                    color: '#f8fafc',
                    fontWeight: 'bold'
                  },

                  '& .MuiIconButton-root': {
                    color: '#3b82f6',
                    '&.Mui-disabled': {
                      color: '#334155'
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(59, 130, 246, 0.1)'
                    }
                  }
                }}
              />
            </>
          )}
        </TableContainer>

        {/* Empty State */}
        {!loading && maintenanceData.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              color: '#94a3b8',
              backgroundColor: '#0f172a',
              borderRadius: 1,
              border: '1px solid #334155'
            }}
          >
            <p>No Maintenance Records Found</p>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

// Styles
const headerStyle = {
  color: '#575757',
  fontWeight: 600,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #334155',
  py: 2
};

const cellStyle = {
  color: '#cbd5e1',
  fontSize: '0.875rem',
  py: 2
};

const typeBadgeStyle = {
  backgroundColor: '#334155',
  color: '#e2e8f0',
  px: 1.5,
  py: 0.5,
  borderRadius: '4px',
  fontSize: '0.75rem'
};

function DetailField({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Box>
      <Box
        sx={{
          fontSize: '0.75rem',
          color: '#64748b',
          mb: 0.5,
          textTransform: 'uppercase'
        }}
      >
        {label}
      </Box>
      <Box sx={{ color: '#f8fafc', fontWeight: 500 }}>{value}</Box>
    </Box>
  );
}

export default History;
