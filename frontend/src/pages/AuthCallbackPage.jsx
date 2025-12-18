import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { dedupedToast } from '../utils/toast';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        dedupedToast.error(decodeURIComponent(error));
        navigate('/login');
        return;
      }

      if (token) {
        try {
          // Store the token and get user info
          localStorage.setItem('token', token);
          
          // Fetch user profile with the new token
          const response = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            
            // Update auth context with user data and token (no duplicate toast)
            login(userData.user, token);
            
            dedupedToast.success('Successfully signed in with Google!');
            navigate('/dashboard');
          } else {
            throw new Error('Failed to fetch user profile');
          }
        } catch (error) {
          console.error('Auth callback error:', error);
          dedupedToast.error('Authentication failed. Please try again.');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        dedupedToast.error('No authentication token received');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
