import { useLocation, useNavigate } from 'react-router-dom';
import { MdEmail, MdKey } from 'react-icons/md';
import { useState } from 'react';
import { useAuth } from '../provider/authProvider';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

export default function Login() {
  const location = useLocation().state;
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [isLogin, setIsLogin] = useState(
    location && location.login === false ? false : true,
  );
  const [formStatus, setFormStatus] = useState('idle');
  const [error, setError] = useState(
    location?.message ? { message: location.message } : null,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  function validateForm() {
    const emailRegEx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (
      formData.email.length < 1 ||
      formData.email.length > 100 ||
      formData.email.includes(' ') ||
      emailRegEx.test(formData.email) === false
    ) {
      return {
        message: 'Incorrect email value. Email cannot exceed 100 characters.',
      };
    } else if (
      formData.password.length < 6 ||
      formData.password.length > 100 ||
      formData.password.includes(' ')
    ) {
      return { message: 'Password must be between 6 and 100 characters.' };
    } else if (
      !isLogin &&
      (formData.username.length < 3 || formData.username.length > 30)
    ) {
      return { message: 'Username must be between 3 and 30 characters.' };
    }
  }

  // Login or Sign Up User
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formValidation = validateForm();
    if (formValidation) {
      setError(formValidation);
      return;
    }

    try {
      setError(null);
      setFormStatus('submitting');
      if (isLogin) {
        const res = await axios.post('/user/login', {
          email: formData.email,
          password: formData.password,
        });
        setToken(res.data.token);
        navigate('/posts', { replace: true });
      } else if (!isLogin && formData.password === formData.confirmPassword) {
        const res = await axios.post('/user/signup', {
          name: formData.username,
          email: formData.email,
          password: formData.password,
        });
        setToken(res.data.token);
        navigate('/posts', { replace: true });
      } else {
        setError({ message: `Passwords don't match.` });
      }
    } catch (err) {
      setError(err);
    } finally {
      setFormStatus('idle');
    }
  };

  return (
    <div className='mx-auto my-0 max-w-6xl px-4 py-8'>
      <h1 className='mb-4 text-4xl'>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form
        className='mt-4 flex flex-col gap-4 rounded-lg bg-gray-100 px-6 py-6'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='email'>
            Email:{' '}
          </label>
          <div className='relative h-10'>
            <input
              className='h-full w-full rounded-md border border-slate-500 py-1 pl-8'
              id='email'
              name='email'
              type='email'
              placeholder='Enter your email address'
              required
              maxLength={100}
              value={formData.email}
              onChange={handleInputChange}
            />
            <MdEmail className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform text-xl' />
          </div>
        </div>
        {!isLogin ? (
          <div className='flex flex-col gap-1'>
            <label className='text-slate-700' htmlFor='username'>
              Username:{' '}
            </label>
            <div className='relative h-10'>
              <input
                className='h-full w-full rounded-md border border-slate-500 py-1 pl-8'
                id='username'
                name='username'
                type='text'
                placeholder='Enter your username'
                required
                minLength={3}
                maxLength={30}
                value={formData.username}
                onChange={handleInputChange}
              />
              <FaUser className='text-md pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform' />
            </div>
          </div>
        ) : null}
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='password'>
            Password:{' '}
          </label>
          <div className='relative h-10'>
            <input
              className='h-full w-full rounded-md border border-slate-500 py-1 pl-8'
              id='password'
              name='password'
              type='password'
              placeholder='Enter your password'
              required
              minLength={6}
              maxLength={100}
              value={formData.password}
              onChange={handleInputChange}
            />
            <MdKey className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform text-xl' />
          </div>
        </div>
        {!isLogin ? (
          <div className='flex flex-col gap-1'>
            <label className='text-slate-700' htmlFor='confirmPassword'>
              Confirm Password:{' '}
            </label>
            <div className='relative h-10'>
              <input
                className='h-full w-full rounded-md border border-slate-500 py-1 pl-8'
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm your password'
                required
                minLength={6}
                maxLength={100}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <MdKey className='pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 transform text-xl' />
            </div>
          </div>
        ) : null}
        <button
          className='rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
          disabled={formStatus === 'submitting'}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
      <div onClick={() => setIsLogin((prevState) => !prevState)}>
        {isLogin ? (
          <div className='mt-5 text-center text-xl'>
            Don't have an account?{' '}
            <span className='cursor-pointer font-semibold text-sky-700'>
              Sign up now!
            </span>
          </div>
        ) : (
          <div className='mt-5 text-center text-xl'>
            Already have an account?{' '}
            <span className='cursor-pointer font-semibold text-sky-700'>
              Login now!
            </span>
          </div>
        )}
      </div>
      {error ? (
        <div className='mt-4 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
          {error?.response?.data?.error || error?.message || 'Unexpected error'}
        </div>
      ) : null}
    </div>
  );
}
