import { FaEdit, FaTrash } from 'react-icons/fa';
import { MdCancel, MdCheckCircle } from 'react-icons/md';

export default function User(props) {
  return (
    <div className='rounded-md border border-slate-500 px-4 py-4'>
      {props.editMode === false || props.editMode !== props.id ? (
        <div>
          <div>Username: {props.username}</div>
          <div>Email: {props.email}</div>
          <div>Is Admin: {props.isAdmin ? 'Yes' : 'No'}</div>
          {props.editMode === false ? (
            <div className='flex items-center gap-2'>
              <button
                className='flex items-center gap-2 rounded-lg bg-black px-2 py-1.5 text-sm text-white hover:bg-gray-800'
                onClick={() => props.deleteUser(props.id)}
              >
                <FaTrash />
                <span>Delete</span>
              </button>
              <button
                className='flex items-center gap-2 rounded-lg bg-black px-2 py-1.5 text-sm text-white hover:bg-gray-800'
                onClick={() =>
                  props.toggleEditMode(
                    props.id,
                    props.username,
                    props.email,
                    props.isAdmin,
                  )
                }
              >
                <FaEdit />
                <span>Edit</span>
              </button>
            </div>
          ) : null}
        </div>
      ) : props.editMode === props.id ? (
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-1'>
            <label className='text-slate-700' htmlFor='username'>
              Username:{' '}
            </label>
            <input
              className='rounded-md border border-slate-500 px-2 py-1'
              id='username'
              name='username'
              type='text'
              required
              minLength={3}
              maxLength={30}
              value={props.editData.username}
              onChange={props.handleInputChange}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-slate-700' htmlFor='email'>
              Email:{' '}
            </label>
            <input
              className='rounded-md border border-slate-500 px-2 py-1'
              id='email'
              name='email'
              type='email'
              required
              maxLength={100}
              value={props.editData.email}
              onChange={props.handleInputChange}
            />
          </div>
          <div className='flex gap-2'>
            <input
              name='isAdmin'
              type='checkbox'
              checked={props.editData.isAdmin}
              onChange={props.handleInputChange}
            />
            <label className='text-slate-700' htmlFor='isAdmin'>
              Is Admin?
            </label>
          </div>
          <div className='flex items-center gap-2'>
            <button
              className='flex items-center gap-2 rounded-lg bg-black px-2 py-1.5 text-sm text-white hover:bg-gray-800'
              onClick={() => props.updateUser(props.id)}
            >
              <MdCheckCircle />
              <span>Update</span>
            </button>
            <button
              className='flex items-center gap-2 rounded-lg border border-neutral-500 bg-white px-2 py-1.5 text-sm hover:bg-neutral-500'
              onClick={() => props.toggleEditMode(false, '', '', false)}
            >
              <MdCancel />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
