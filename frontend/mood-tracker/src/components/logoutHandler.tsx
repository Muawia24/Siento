import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../hooks/useAuth';

const LogoutHandler = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        logout(); 
        navigate('/login');
    }, [logout, navigate]);

    return null; 
};

export default LogoutHandler;
