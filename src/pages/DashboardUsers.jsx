import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GridLoader } from 'react-spinners';
import ConfirmationModal from '../components/ConfirmationModal';
import ReactPaginate from 'react-paginate';
import User from '../components/User';
import axios from 'axios';
import { useAuth } from '../provider/authProvider';

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false); // false or user id
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    isAdmin: false,
  });

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = users && users.slice(itemOffset, endOffset);
  const pageCount = users && Math.ceil(users.length / itemsPerPage);

  const handlePageClick = (event) => {
    setSearchParams({ page: event.selected });
  };

  useEffect(() => {
    const newOffset =
      (Number(searchParams.get('page')) * itemsPerPage) % users.length;
    setItemOffset(newOffset);
  }, [searchParams, users]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prevState) => {
      return {
        ...prevState,
        [name]: type !== 'checkbox' ? value : checked,
      };
    });
  };

  useEffect(() => {
    async function getUsers() {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('/user');
        // skips the currently logged in admin to avoid potential errors
        // current admin should use the account component instead to modify their account's data
        setUsers(res.data.filter((users) => users.id !== user.id));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    getUsers();
  }, []);

  function validateForm() {
    const emailRegEx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (
      editData.email.length < 1 ||
      editData.email.length > 100 ||
      editData.email.includes(' ') ||
      emailRegEx.test(editData.email) === false
    ) {
      return {
        message: 'Incorrect email value. Email cannot exceed 100 characters.',
      };
    } else if (editData.username.length < 3 || editData.username.length > 30) {
      return { message: 'Username must be between 3 and 30 characters.' };
    }
  }

  const updateUser = async (userId) => {
    const formValidation = validateForm();
    if (formValidation) {
      setError(formValidation);
      return;
    }

    const currentUser = users.find((user) => user.id === userId);

    if (
      currentUser.name === editData.username &&
      currentUser.email === editData.email &&
      currentUser.isAdmin === editData.isAdmin
    ) {
      toggleEditMode(false, '', '', false);
      return;
    }

    try {
      setError(null);
      const res = await axios.patch(`/user/${userId}/admin`, {
        email: editData.email,
        name: editData.username,
        isAdmin: editData.isAdmin,
      });
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          return user.id === userId
            ? {
                ...user,
                email: res.data.email,
                name: res.data.name,
                isAdmin: res.data.isAdmin,
              }
            : user;
        });
      });
      toggleEditMode(false, '', '', false);
    } catch (err) {
      setError(err);
    }
  };

  const deleteUser = async (userId) => {
    try {
      setError(null);
      await axios.delete(`/user/${userId}`);
      if (currentItems.length === 1 && Number(searchParams.get('page')) > 0) {
        setSearchParams((prevState) => ({ page: prevState.get('page') - 1 }));
      }
      setUsers((prevUsers) => {
        return prevUsers.filter((user) => user.id !== userId);
      });
    } catch (err) {
      setError(err);
    }
  };

  const toggleEditMode = (userId, username, email, isAdmin) => {
    setEditMode(userId);
    setEditData({ username: username, email: email, isAdmin: isAdmin });
  };

  const handleDeleteUserClick = (userId) => {
    setUserData(userId);
    setUserModalOpen(true);
  };

  const handleConfirmDeleteUser = async (userId) => {
    await deleteUser(userId);
    setUserModalOpen(false);
    setUserData(null);
  };

  const handleUserModalClose = () => {
    setUserModalOpen(false);
    setUserData(null);
  };

  const renderUsers = currentItems.map((user) => {
    return (
      <User
        key={user.id}
        id={user.id}
        username={user.name}
        email={user.email}
        isAdmin={user.isAdmin}
        editData={editData}
        handleInputChange={handleInputChange}
        editMode={editMode}
        toggleEditMode={toggleEditMode}
        updateUser={updateUser}
        deleteUser={handleDeleteUserClick}
      />
    );
  });

  if (loading) {
    return (
      <div className='mt-48 flex flex-col items-center justify-center'>
        <GridLoader color='#000000' />
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className='my-4 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
          {error?.response?.data?.error || error?.message || 'Unexpected error'}
        </div>
      ) : null}
      <div className='mt-4 flex flex-col gap-2'>{renderUsers}</div>
      {users.length > itemsPerPage ? (
        <ReactPaginate
          breakLabel=<span className='mx-4'>...</span>
          nextLabel=<BsArrowRightSquareFill className='h-8 w-8 rounded-md hover:fill-gray-800 md:h-10 md:w-10' />
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel=<BsArrowLeftSquareFill className='h-8 w-8 rounded-md hover:fill-gray-800 md:h-10 md:w-10' />
          containerClassName='flex items-center justify-center mt-8 gap-2 md:gap-4'
          pageClassName='hover:bg-gray-300 w-8 h-8 md:w-10 md:h-10 rounded-md flex items-center justify-center font-semibold'
          activeClassName='bg-black text-white'
          renderOnZeroPageCount={null}
          forcePage={Number(searchParams.get('page'))}
        />
      ) : null}
      <ConfirmationModal
        text={'user'}
        isOpen={userModalOpen}
        onClose={handleUserModalClose}
        onConfirm={() => handleConfirmDeleteUser(userData)}
      />
    </div>
  );
}
