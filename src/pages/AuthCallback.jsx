import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // Store token
            localStorage.setItem('token', token);

            // Decode JWT to get user info (simple decode, already verified by backend)
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const userData = {
                    id: payload.userId,
                    email: payload.email,
                    role: payload.role,
                    userCode: payload.userCode
                };

                localStorage.setItem('user', JSON.stringify(userData));

                // Redirect based on role
                const redirectTo = userData.role === 'company' ? '/contracts' : '/workers';
                navigate(redirectTo);
            } catch (error) {
                console.error('Error parsing token:', error);
                navigate('/login?error=invalid_token');
            }
        } else {
            navigate('/login?error=no_token');
        }
    }, [searchParams, navigate, setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Completing authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback;
