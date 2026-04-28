import { useNavigate } from 'react-router-dom';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h1" sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Page Not Found.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
