import React, { useState } from 'react';

export const CurrentUserContext = React.createContext();

export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({
        name: '',
        email: '',
    });

    // функция для обновления данных текущего пользователя
    const updateCurrentUser = (newData) => {
        setCurrentUser(prevState => ({ ...prevState, ...newData }));
    };

    return (
        <CurrentUserContext.Provider value={{ currentUser, updateCurrentUser }}>
            {children}
        </CurrentUserContext.Provider>
    );
};