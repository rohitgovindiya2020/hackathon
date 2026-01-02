import React, { createContext, useState, useEffect, useContext } from 'react';

const LocationContext = createContext();

export const useLocationContext = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
    const [selectedLocation, setSelectedLocation] = useState(() => {
        const storedLocation = localStorage.getItem('user_location');
        try {
            return storedLocation ? JSON.parse(storedLocation) : {
                country: '',
                state: '',
                city: '',
                area: ''
            };
        } catch (error) {
            console.error('Failed to parse location from local storage', error);
            return {
                country: '',
                state: '',
                city: '',
                area: ''
            };
        }
    });

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
