import React from 'react'
import defaultStates from '../Store/DefaultState'
import { useEffect } from 'react';


// Initialize state from localStorage or default
export function initializeState() {
    const savedStates = localStorage.getItem('appState');
    
    if (!savedStates) {
        const defaultState = defaultStates();
        localStorage.setItem('appState', JSON.stringify(defaultState));
    }

    try {
        const postInitializedState = localStorage.getItem('appState');
        return JSON.parse(postInitializedState);
    } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        return {};
    }
}


// Dispatch function to update state
export function dispatch(newState) {
    if (newState) {
        const oldState = initializeState();
        const updatedState = { ...oldState, ...newState };
        localStorage.setItem('appState', JSON.stringify(updatedState));
        return updatedState;
    }

    console.error('No new state provided.');
    return null;
}


// Select specific key from state
export function selectStateKey(stateName, key) {
    try {
        const state = localStorage.getItem(stateName);
        if (!state) {
            console.warn(`State "${stateName}" not found in localStorage.`);
            return 'state does not exist';
        }

        const parsedState = JSON.parse(state);
        return parsedState[key] || 'key not found, please check typo';
    } catch (error) {
        console.error('Error retrieving value from state:', error);
        return null;
    }
}


// Function to reset the store state in localStorage
export function resetState() {
    const defaultState = defaultStates();
    localStorage.setItem('appState', JSON.stringify(defaultState));
    return defaultState; 
}


// Utility components/functions
export function spinnerDiv(state) {
    if (state) {
        return (
            <>
                <div className="spinner-grow text-primary" role="status" />
                <span className="text-primary m-1">Loading...</span>
            </>
        );
    }
    return null;
}


export function getAlertDiv(message) {
    if (message) {
        return (
            <div className="alert alert-warning" role="alert">
                <h5>{`${message} 💬`}</h5>
            </div>
        );
    }
}


export function useClearAlert(setMessages, timeout = 4000) {
    useEffect(() => {
        if (setMessages) {
            const timer = setTimeout(() => {
                setMessages(null);
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [setMessages, timeout]);
}


// Export all state methods together
export const customStateMethods = {
    initializeState,
    dispatch,
    selectStateKey,
    resetState,
    spinnerDiv,
    getAlertDiv,
    useClearAlert,
};
