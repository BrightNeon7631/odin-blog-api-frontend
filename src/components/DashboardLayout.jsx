import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className='mx-auto my-0 max-w-6xl px-4 py-4'>
      <div className='flex items-center justify-between pb-4'>
        <NavLink
          className='text-lg hover:text-sky-500 aria-[current=page]:text-blue-600'
          to=''
          end
        >
          Account
        </NavLink>
        <NavLink
          className='text-lg hover:text-sky-500 aria-[current=page]:text-blue-600'
          to='comments'
        >
          User Comments
        </NavLink>
        {user?.isAdmin ? (
          <>
            <NavLink
              className='text-lg hover:text-sky-500 aria-[current=page]:text-blue-600'
              to='users'
            >
              Users
            </NavLink>
          </>
        ) : null}
      </div>
      <hr></hr>
      <Outlet />
    </div>
  );
}
