import  { createContext, useState, useEffect, ReactNode } from "react";
import API from "../utils/api";

interface User {
    // Define the shape of your user object
    token: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async (email: string, password: string) => {
        console.log("Default login function called with:", email, password);
    },
    register: async (name: string, email: string, password: string) => {
        console.log("Default register function called with:", name, email, password);
    },
    logout: () => {
        console.log("Default logout function called");
    },
    loading: true,
});

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [ user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("AuthProvider useEffect triggered");
        const storedUser = localStorage.getItem('userInfo');
        console.log("Stored User:", storedUser);

        if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log("User initialized:", JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        console.log(localStorage.getItem('userInfo'));
        console.log("User in AuthContext:", user);
        const { data } = await API.post('/auth/login', { email, password });
        console.log(JSON.stringify(data));
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        setUser(data);
    }

    const register = async (name: string, email: string, password: string) => {
        const { data } = await API.post('/auth/register', { name, email, password });

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;