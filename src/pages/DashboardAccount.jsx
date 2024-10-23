import { MdEmail, MdKey } from 'react-icons/md';
import { FaUser, FaTrash } from 'react-icons/fa';
import { useAuth } from '../provider/authProvider';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import axios from 'axios';

export default function DashboardAccount() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [usernameData, setUsernameData] = useState(user.name);

  const [emailData, setEmailData] = useState({
    email: user.email,
    confirmEmail: '',
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState(null);
  const [formStatus, setFormStatus] = useState('idle');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  function validateEmailForm() {
    const emailRegEx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (
      emailData.email.length < 1 ||
      emailData.email.length > 100 ||
      emailData.email.includes(' ') ||
      emailRegEx.test(emailData.email) === false
    ) {
      return {
        message: 'Incorrect email value. Email cannot exceed 100 characters.',
      };
    }
  }

  function validatePasswordForm() {
    if (
      passwordData.password.length < 6 ||
      passwordData.password.length > 100 ||
      passwordData.password.includes(' ')
    ) {
      return { message: 'Password must be between 6 and 100 characters.' };
    }
  }

  function validateUsernameForm() {
    if (usernameData.length < 3 || usernameData.length > 30) {
      return { message: 'Username must be between 3 and 30 characters.' };
    }
  }

  const handleEmailInput = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleUsernameForm = async (e) => {
    e.preventDefault();
    const formValidation = validateUsernameForm();
    if (formValidation) {
      setError(formValidation);
      return;
    }

    setError(null);
    if (usernameData === user.name) {
      setUsernameData('');
      return;
    }

    try {
      setFormStatus('submitting');
      await axios.patch(`/user/${user.id}`, {
        name: usernameData,
      });
      // jwt data will remain the same, because the token hasn't changed (so client token data will no longer match with the db)
      // workaround: logout the user after making changes
      logout();
      navigate('/login', {
        replace: true,
        state: { message: 'Username changed. Please log in again. ' },
      });
    } catch (err) {
      setError(err);
    } finally {
      setFormStatus('idle');
    }
  };

  const handleEmailForm = async (e) => {
    e.preventDefault();
    const formValidation = validateEmailForm();
    if (formValidation) {
      setError(formValidation);
      return;
    }

    setError(null);
    if (emailData.email === user.email) {
      setEmailData({ email: '', confirmEmail: '' });
      return;
    }

    try {
      setFormStatus('submitting');
      if (emailData.email === emailData.confirmEmail) {
        await axios.patch(`/user/${user.id}`, {
          email: emailData.email,
        });
        logout();
        navigate('/login', {
          replace: true,
          state: { message: 'Email changed. Please log in again. ' },
        });
      } else {
        setError({ message: `Emails don't match.` });
      }
    } catch (err) {
      setError(err);
    } finally {
      setFormStatus('idle');
    }
  };

  const handlePasswordForm = async (e) => {
    e.preventDefault();
    const formValidation = validatePasswordForm();
    if (formValidation) {
      setError(formValidation);
      return;
    }

    try {
      setError(null);
      setFormStatus('submitting');
      if (passwordData.password === passwordData.confirmPassword) {
        await axios.patch(`/user/${user.id}`, {
          password: passwordData.password,
        });
        // no need to logout since password is not needed in the user state
      } else {
        setError({ message: `Passwords don't match` });
      }
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err) {
      setError(err);
    } finally {
      setFormStatus('idle');
    }
  };

  const deleteUser = async (userId) => {
    try {
      setError(null);
      await axios.delete(`/user/${userId}`);
      logout();
      navigate('/posts', { replace: true });
    } catch (err) {
      setError(err);
    }
  };

  // delete post with a confirmation modal
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (userId) => {
    await deleteUser(userId);
    setDeleteModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  return (
    <div className='py-4'>
      {error ? (
        <div className='mb-4 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
          {error?.response?.data?.error || error?.message || 'Unexpected error'}
        </div>
      ) : null}
      <form
        className='flex flex-col gap-4 rounded-lg bg-gray-100 px-6 py-6'
        onSubmit={handleUsernameForm}
      >
        <div className='flex items-center gap-2'>
          <FaUser className='text-xl' />
          <h2 className='my-2 text-2xl'>Change Username</h2>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='username'>
            Username
          </label>
          <input
            className='rounded-md border border-slate-500 px-2 py-1'
            id='username'
            name='username'
            type='text'
            placeholder='Enter new username'
            required
            minLength={3}
            maxLength={30}
            value={usernameData}
            onChange={(e) => setUsernameData(e.target.value)}
          />
        </div>
        <button
          className='rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
          disabled={formStatus === 'submitting'}
        >
          Update Username
        </button>
      </form>

      <form
        className='mt-4 flex flex-col gap-4 rounded-lg bg-gray-100 px-6 py-6'
        onSubmit={handleEmailForm}
      >
        <div className='flex items-center gap-2'>
          <MdEmail className='text-2xl' />
          <h2 className='my-2 text-2xl'>Change Email</h2>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='email'>
            Email
          </label>
          <input
            className='rounded-md border border-slate-500 px-2 py-1'
            id='email'
            name='email'
            type='email'
            placeholder='Enter new email'
            required
            maxLength={100}
            value={emailData.email}
            onChange={handleEmailInput}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='confirmEmail'>
            Confirm Email
          </label>
          <input
            className='rounded-md border border-slate-500 px-2 py-1'
            id='confirmEmail'
            name='confirmEmail'
            type='email'
            placeholder='Confirm new email'
            required
            maxLength={100}
            value={emailData.confirmEmail}
            onChange={handleEmailInput}
          />
        </div>
        <button
          className='rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
          disabled={formStatus === 'submitting'}
        >
          Update Email
        </button>
      </form>

      <form
        className='mt-4 flex flex-col gap-4 rounded-lg bg-gray-100 px-6 py-6'
        onSubmit={handlePasswordForm}
      >
        <div className='flex items-center gap-2'>
          <MdKey className='text-2xl' />
          <h2 className='my-2 text-2xl'>Change Password</h2>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='password'>
            Password
          </label>
          <input
            className='rounded-md border border-slate-500 px-2 py-1'
            id='password'
            name='password'
            type='password'
            placeholder='Enter new password'
            required
            minLength={6}
            maxLength={100}
            value={passwordData.password}
            onChange={handlePasswordInput}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='confirmPassword'>
            Confirm Password
          </label>
          <input
            className='rounded-md border border-slate-500 px-2 py-1'
            id='confirmPassword'
            name='confirmPassword'
            type='password'
            placeholder='Confirm new password'
            required
            minLength={6}
            maxLength={100}
            value={passwordData.confirmPassword}
            onChange={handlePasswordInput}
          />
        </div>
        <button
          className='rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
          disabled={formStatus === 'submitting'}
        >
          Update Password
        </button>
      </form>

      <div className='mt-4 flex flex-col gap-4 rounded-lg bg-gray-100 px-6 py-6'>
        <div className='flex items-center gap-2'>
          <FaTrash className='text-xl' />
          <h2 className='my-2 text-2xl'>Delete Account</h2>
        </div>
        <button
          className='rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
          onClick={handleDeleteClick}
        >
          Delete Account
        </button>
      </div>

      <ConfirmationModal
        text={'account'}
        isOpen={deleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={() => handleConfirmDelete(user.id)}
      />
    </div>
  );
}
