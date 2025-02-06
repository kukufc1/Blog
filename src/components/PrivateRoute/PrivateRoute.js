import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../AuthContext/AuthContext';

const PrivateRoute = ({ element }) => {
  const { state } = useAuth();

  return state.user && state.user.token ? element : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
