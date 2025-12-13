import { useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import usePersistedState from "../hooks/usePersistedState";

export default function UserProvider({ children }) {
    const [authData, setAuthData] = usePersistedState('auth', {});
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, []);

    const userLoginHandler = (resultData) => {
        console.log("userLoginHandler received:", resultData);

        const { accessToken, ...user } = resultData;

        // 👉 Тук гарантираме, че authData съдържа и token, и потребителя
        setAuthData({ accessToken, user });
    };

    const userLogoutHandler = () => {
        setAuthData({});
    };

    const contextValue = {
        ...authData,
        userLoginHandler,
        userLogoutHandler
    };

    if (!isReady) {
        return null; // или loader
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}
