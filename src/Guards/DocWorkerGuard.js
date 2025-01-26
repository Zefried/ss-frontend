import React from 'react'
import { Navigate } from 'react-router-dom';
import { customStateMethods } from '../StateMng/Slice/AuthSlice';

export const DocWorkerGuard = ({children}) => {

      const isAuthenticated = customStateMethods.selectStateKey('appState', 'isAuthenticated');
      const role = customStateMethods.selectStateKey('appState', 'role');
    
      // If not authenticated or not an admin, redirect to login
      if (!isAuthenticated || role !== 'user' && role !== 'admin') {
        return <Navigate to="/user-login" />;
      }
    
      // Otherwise, allow access to the children components (admin panel routes)
      return children;
  
}
