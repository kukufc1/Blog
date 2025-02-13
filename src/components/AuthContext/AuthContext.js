import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const getInitialState = () => {
  const storedState = localStorage.getItem('authState');
  return storedState ? JSON.parse(storedState) : { user: null };
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          token: action.payload.token,
          username: action.payload.username,
          email: action.payload.email,
          image: action.payload.image,
        },
      };
    case 'LOGOUT':
      return { user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(state));
  }, [state]);

  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
