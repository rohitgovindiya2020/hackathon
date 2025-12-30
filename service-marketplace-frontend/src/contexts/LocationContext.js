import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState({
        country: '',
        state: '',
        city: '',
        area: ''
    });

    useEffect(() => {
        const storedLocation = localStorage.getItem('user_location');
        if (storedLocation) {
            try {
                setSelectedLocation(JSON.parse(storedLocation));
            } catch (error) {
                console.error('Failed to parse location from local storage', error);
            }
        }
    }, []);

    const updateLocation = (location) => {
        setSelectedLocation(location);
        localStorage.setItem('user_location', JSON.stringify(location));
    };

    return (
        <LocationContext.Provider value={{ selectedLocation, updateLocation }}>
            {children}
        </LocationContext.Provider>
    );
};
