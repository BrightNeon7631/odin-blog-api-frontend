import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export default function AuthContextProvider(props) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // if the token exists, set the authorization header in axios and local storage
      axios.defaults.headers.common['Authorization'] = token;
      localStorage.setItem('token', token);

      // decode jwt and set user state
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = new Date();
        const expTime = new Date(decodedToken.exp * 1000);
        if (expTime < currentTime) {
          throw new Error('Token has expired');
        } else {
          setUser(decodedToken);
        }
      } catch (err) {
        console.log(err);
        logout();
      }
    } else {
      // if the token is null or undefined, remove the authorization header from axios and local storage
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/posts', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

// custom hook that can be used in components to access the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
