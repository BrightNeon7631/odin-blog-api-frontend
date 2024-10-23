import { useAuth } from '../provider/authProvider';
import { Navigate } from 'react-router-dom';

export default function AdminRoute(props) {
  const { user } = useAuth();

  return user?.isAdmin ? props.children : <Navigate replace to='/posts' />;
}
