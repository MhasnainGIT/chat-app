import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await AsyncStorage.getItem("chat-user");
                if (user) setAuthUser(JSON.parse(user));
            } catch (error) {
                console.error("Error checking auth:", error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = (user) => {
        setAuthUser(user);
        AsyncStorage.setItem("chat-user", JSON.stringify(user));
    };

    const logout = () => {
        setAuthUser(null);
        AsyncStorage.removeItem("chat-user");
    };

    return (
        <AuthContext.Provider value={{ authUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
