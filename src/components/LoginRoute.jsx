// this page can only be accessed by unauthenticated users
import { useAuth } from '../provider/authProvider';
import { Navigate } from 'react-router-dom';

export default function LoginRoute(props) {
  const { user, token } = useAuth();

  return !user || !token ? props.children : <Navigate replace to='/posts' />;
}
