import { Outlet } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';

// MUI
import Box from '@mui/material/Box';

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#0B1220',
        color: 'white'
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: 1
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
