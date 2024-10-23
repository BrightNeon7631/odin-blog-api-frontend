import { useAuth } from '../provider/authProvider';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute(props) {
  const { user, token } = useAuth();

  return user ? (
    props.children
  ) : token ? (
    <Navigate replace to='/posts' />
  ) : (
    <Navigate replace to='/login' state={{ message: 'You must log in first. ' }} />
  );
}
