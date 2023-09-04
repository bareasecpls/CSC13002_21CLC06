import React, { useReducer, createContext, useContext, ReactNode, useEffect } from "react";

type AuthState = {
  user: Record<string, any>;
  isAuthenticated: boolean;
};

type AuthAction = {
  payload: { user: Record<string, any>; isAuthenticated: boolean };
};

type AuthContextType = {
  authContext: AuthState;
  setAuthContext: ({ user, isAuthenticated }: AuthState) => void;
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  return {
    ...state,
    user: action.payload.user,
    isAuthenticated: action.payload.isAuthenticated,
  };
};

const initialState: AuthState = {
  user: {},
  isAuthenticated: false,
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authContext, dispatch] = useReducer(authReducer, initialState);

  const setAuthContext = (data: AuthState) => {
    dispatch({
      payload: data,
    });
    localStorage.setItem("authData", JSON.stringify(data));
  };

  // Check for stored authentication data during component mount
  useEffect(() => {
    const storedAuthData = localStorage.getItem("authData");
    if (storedAuthData) {
      const parsedAuthData = JSON.parse(storedAuthData);
      setAuthContext(parsedAuthData);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authContext,
        setAuthContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
