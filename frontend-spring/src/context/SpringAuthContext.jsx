import { createContext, useContext, useEffect, useState } from "react";
import springApi, {
    loginToSpring,
    logoutFromSpring
} from "../api/springApi";

const SpringAuthContext = createContext(null);

export function SpringAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const [sessionError, setSessionError] = useState("");

    useEffect(() => {
        let active = true;

        async function restoreSession(){
            try {
                const response = await springApi.get("/me");

                if (active) {
                    setUser(response.data);
                }
            } catch (error) {
                if (active) {
                        setUser(null);

                        if (error.response?.status !== 401) {
                            setSessionError("Could not check your login session");
                        }
                    }
                } finally {
                    if (active) {
                        setCheckingSession(false);
                    }
                }
            }

            restoreSession();

            return () => {
                active = false;
            };
        }, []);

        async function login(email, password) {
            setSessionError("")
            setUser(null);

            const currentUser = await loginToSpring(email, password);
            setUser(currentUser);
        }

        async function logout() {
            await logoutFromSpring();
            setUser(null);
            setSessionError("");
        }

        return (
            <SpringAuthContext.Provider
                value={{
                    user,
                    checkingSession,
                    sessionError,
                    login,
                    logout
                }}
            >
                {children}
            </SpringAuthContext.Provider>
        );
    }

    export function useSpringAuth(){
        const context = useContext(SpringAuthContext);

        if (!context) {
            throw new Error("useSpringAuth requires SpringAuthProvider");
        }

        return context;

    }