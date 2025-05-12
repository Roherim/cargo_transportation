import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { api } from '../services/api';

const OptionsContext = createContext();

export const OptionsProvider = ({ children }) => {
    const [options, setOptions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);
    const fetchAttempted = useRef(false);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchOptions = useCallback(async () => {
        if (loading || fetchAttempted.current || !isMounted.current) {
            return;
        }

        try {
            console.log('Fetching options...');
            setLoading(true);
            fetchAttempted.current = true;
            const data = await api.getAllOptions();
            console.log('Received options:', data);
            if (isMounted.current) {
                setOptions(data);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching options:', err);
            if (isMounted.current) {
                setError('Ошибка при загрузке опций');
                // Сбрасываем флаг попытки загрузки при ошибке
                fetchAttempted.current = false;
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [loading]);

    useEffect(() => {
        if (!options && !loading && !fetchAttempted.current) {
            console.log('Options not loaded, starting fetch...');
            fetchOptions();
        }
    }, [options, loading, fetchOptions]);

    const value = {
        options,
        loading,
        error,
        refetch: () => {
            console.log('Refetching options...');
            fetchAttempted.current = false;
            fetchOptions();
        }
    };

    return (
        <OptionsContext.Provider value={value}>
            {children}
        </OptionsContext.Provider>
    );
};

export const useOptions = () => {
    const context = useContext(OptionsContext);
    if (!context) {
        throw new Error('useOptions must be used within an OptionsProvider');
    }
    return context;
}; 