import React from 'react'
import { Navigate } from 'react-router-dom';
import { customStateMethods } from '../StateMng/Slice/AuthSlice';

export const DocWorkerGuard = ({children}) => {

      const isAuthenticated = customStateMethods.selectStateKey('appState', 'isAuthenticated');
      const role = customStateMethods.selectStateKey('appState', 'role');
    
      // admin | doc | worker | lab | hospital | user can access these routes 
      if (!isAuthenticated || role !== 'user' && role !== 'admin' && role !== 'lab' && role !== 'hospital') {
        switch(role) {
          case 'user':
            return <Navigate to="/user-dashboard" />;
          case 'lab':
            return <Navigate to="/lab-login" />;
          case 'hospital':
            return <Navigate to="/hospital-login" />;
          default:
            return <Navigate to="/user-login" />;
        }
      }
    
      // Otherwise, allow access to the children components (admin panel routes)
      return children;
  
}
