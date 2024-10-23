import { NavLink } from 'react-router-dom';
import { useAuth } from '../provider/authProvider';
import { BsFillAirplaneFill } from 'react-icons/bs';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className='flex items-center justify-between bg-black px-4 py-4'>
      <NavLink
        className='flex items-center gap-2 text-lg font-bold text-white hover:text-sky-300 md:text-2xl'
        to='/posts'
      >
        <BsFillAirplaneFill />
        <span>Travel Blog</span>
      </NavLink>
      <div className='flex items-center justify-between gap-4'>
        {/* Styling Navlink using Tailwind css: https://stackoverflow.com/a/76050915 */}
        <NavLink
          className='text-md text-white hover:text-sky-300 aria-[current=page]:text-blue-400 md:text-lg'
          to='posts'
        >
          Posts
        </NavLink>
        {user ? (
          <NavLink
            className='text-md text-white hover:text-sky-300 aria-[current=page]:text-blue-400 md:text-lg'
            to='dashboard'
          >
            Dashboard
          </NavLink>
        ) : null}
        {!user ? (
          <div className='flex items-center justify-between gap-4'>
            <NavLink
              className='text-md text-white hover:text-sky-300 aria-[current=page]:text-blue-400 md:text-lg'
              to='login'
            >
              Login
            </NavLink>
            {/* false state in Login component changes view to sign up */}
            <NavLink to='login' state={{ login: false }}>
              <button className='rounded-md bg-white px-2 py-1 font-semibold hover:bg-sky-300'>
                Sign Up
              </button>
            </NavLink>
          </div>
        ) : (
          <div
            className='text-md cursor-pointer text-white hover:text-sky-300 md:text-lg'
            onClick={logout}
          >
            Logout
          </div>
        )}
      </div>
    </header>
  );
}
