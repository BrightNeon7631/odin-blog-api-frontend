import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { useState } from 'react';
import axios from 'axios';

export default function PostAdminEdit() {
  const state = useLocation()?.state;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: state.title,
    text: state.text,
    url: state.imageUrl,
    isPublished: state.isPublished,
    imageUrl: state.imageUrl,
  });

  const [formStatus, setFormStatus] = useState('idle');
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: type !== 'checkbox' ? value : checked,
      };
    });
  };

  function validateForm() {
    if (formData.title.length < 1 || formData.title.length > 200) {
      return { message: 'Title must be between 1 and 200 characters.' };
    } else if (formData.text.length < 1 || formData.text.length > 10000) {
      return { message: 'Text must be between 1 and 10000 characters.' };
    } else if (formData.url.length > 200) {
      return { message: 'Url cannot exceed 200 characters.' };
    }
  }

  const updatePost = async (postId) => {
    if (
      state.title === formData.title &&
      state.text === formData.text &&
      state.isPublished === formData.isPublished &&
      state.imageUrl === formData.imageUrl
    ) {
      navigate(`/posts/${postId}`, { replace: true });
    }

    const formValidation = validateForm();
    if (formValidation) {
      setError(formValidation);
      return;
    }

    try {
      setError(null);
      setFormStatus('submitting');
      await axios.put(`/post/${postId}`, {
        title: formData.title,
        text: formData.text,
        imageUrl: formData.url,
        isPublished: formData.isPublished,
      });
      navigate(`/posts/${postId}`, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setFormStatus('idle');
    }
  };

  return (
    <div className='mx-auto my-0 max-w-6xl px-4 py-8'>
      <h1 className='mb-4 text-4xl'>Edit Post</h1>
      <div className='flex flex-col gap-4 rounded-lg bg-gray-100 px-6 py-6'>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='title'>
            Title
          </label>
          <input
            className='rounded-md border border-slate-500 px-2 py-1'
            name='title'
            type='text'
            required
            maxLength={200}
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='text'>
            Text
          </label>
          <textarea
            className='h-60 rounded-md border border-slate-500 px-2 py-1'
            name='text'
            type='text'
            required
            maxLength={10000}
            value={formData.text}
            onChange={handleInputChange}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-slate-700' htmlFor='url'>
            Image URL
          </label>
          <input
            className='rounded-md border border-slate-500 px-2 py-1'
            name='url'
            type='text'
            maxLength={200}
            value={formData.url}
            onChange={handleInputChange}
          />
        </div>
        <div className='flex gap-2'>
          <label className='text-slate-700' htmlFor='isPublished'>
            Is Published?
          </label>
          <input
            name='isPublished'
            type='checkbox'
            checked={formData.isPublished}
            onChange={handleInputChange}
          />
        </div>
        <div className='flex gap-4'>
          <Link to={`/posts/${state.id}`} className='flex-1'>
            <button
              className='flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-500 bg-white px-5 py-2.5 hover:bg-neutral-500'
              disabled={formStatus === 'submitting'}
            >
              <MdCancel />
              <span>Cancel</span>
            </button>
          </Link>
          <button
            onClick={() => updatePost(state.id)}
            disabled={formStatus === 'submitting'}
            className='flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
          >
            <MdCheckCircle />
            <span>Update Post</span>
          </button>
        </div>
      </div>
      {error ? (
        <div className='mt-4 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
          {error?.response?.data?.error || error?.message || 'Unexpected error'}
        </div>
      ) : null}
    </div>
  );
}
