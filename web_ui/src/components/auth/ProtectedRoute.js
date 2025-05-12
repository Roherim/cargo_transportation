import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, validateToken } = useAuth();

  const [tokenValidating, setTokenValidating] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated) {
        try {
          await validateToken();
        } catch (error) {
          return <Navigate to="/login" replace />;
        }
      }
      setTokenValidating(false);
    };
    checkToken();
  }, []);

  if (isLoading || tokenValidating) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated && !tokenValidating) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;