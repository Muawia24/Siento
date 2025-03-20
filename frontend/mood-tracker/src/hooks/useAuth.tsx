import  { createContext, useState, useEffect, ReactNode, useContext } from "react";
import API from "../utils/api";

interface User {
    // Define the shape of your user object
    token: string;
    name: string;
    email: string;
    _id: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, publicKey: string, encryptedPrivetKey: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
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
    error: null,
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [ user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const decryptPriveteKey = (encryptedPriveteKey: string, password: string ) => {
        const bytes = CryptoJS.AES.decrypt(encryptedPriveteKey, password);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    const login = async (email: string, password: string) => {
        setError(null);
        console.log(localStorage.getItem('userInfo'));
        console.log("User in AuthContext:", user);
        const { data } = await API.post('/login', { email, password });
        const privateKey = decryptPriveteKey(data.encryptedPrivateKey, password);
        console.log(JSON.stringify(data));
        localStorage.setItem("privateKey", privateKey);
        localStorage.setItem('userInfo', JSON.stringify(data));
        
        setUser(data);
    }

    const register = async (name: string, email: string, password: string, publicKey: string, encryptedPrivetKey: string) => {
        setError(null);
        const { data } = await API.post('/auth/register', { name, email, password, publicKey, encryptedPrivetKey });

        setUser(data);
        localStorage.setItem('userInfo', JSON.stringify(data));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;