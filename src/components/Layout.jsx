import { Outlet } from 'react-router-dom';
import AuthContextProvider from '../provider/authProvider';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className='flex min-h-screen flex-col'>
      <AuthContextProvider>
        <Header />
        <div className='flex-1'>
          <Outlet />
        </div>
      </AuthContextProvider>
      <Footer />
    </div>
  );
}
