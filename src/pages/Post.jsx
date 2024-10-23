import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { MdOutlineInsertComment } from 'react-icons/md';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { GridLoader } from 'react-spinners';
import { useAuth } from '../provider/authProvider';
import ConfirmationModal from '../components/ConfirmationModal';
import Comment from '../components/Comment';
import axios from 'axios';

export default function Post() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const state = useLocation()?.state; // state.page - query from the AllPosts -> PostComponent
  const [post, setPost] = useState([]); // also contains comment objects in an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  const [editCommentMode, setEditCommentMode] = useState(false);
  const [editCommentText, setEditCommentText] = useState('');

  const [showAllComments, setShowAllComments] = useState(false);
  const [commentError, setCommentError] = useState(null);

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentData, setCommentData] = useState({
    postId: null,
    commentId: null,
  });

  useEffect(() => {
    async function getPost() {
      try {
        setLoading(true);
        setError(null);
        // if the user is not an admit - they get the post from a regular endpoint
        if (!user?.isAdmin) {
          const res = await axios.get(`/post/${id}`);
          setPost(res.data);
          // if the user is an admin - they use this endpoint, because it also gets unpublished posts
        } else {
          const res = await axios.get(`/post/${id}/admin`);
          setPost(res.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    getPost();
  }, []);

  function validateForm(value) {
    if (value.length < 1 || value.length > 1000) {
      return { message: 'Comment text must be between 1 and 1000 characters.' };
    }
  }

  const addNewComment = async (e) => {
    e.preventDefault();
    const formValidation = validateForm(newCommentText);
    if (formValidation) {
      setCommentError(formValidation);
      return;
    }

    try {
      setCommentError(null);
      // id comes from params (the url :id)
      const res = await axios.post(`/post/${id}/comment`, {
        text: newCommentText,
      });
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: [
            {
              // author name comes from the user state
              author: { id: res.data.authorId, name: user.name },
              createdAt: res.data.createdAt,
              updatedAt: res.data.updatedAt,
              id: res.data.id,
              text: res.data.text,
            },
            ...prevPost.comments,
          ],
        };
      });
      setNewCommentText('');
    } catch (err) {
      setCommentError(err);
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      setCommentError(null);
      await axios.delete(`/post/${postId}/comment/${commentId}`);
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: prevPost.comments.filter(
            (comment) => comment.id !== commentId,
          ),
        };
      });
    } catch (err) {
      setCommentError(err);
    }
  };

  const updateComment = async (postId, commentId) => {
    const currentText = post.comments.find(
      (comment) => comment.id === commentId,
    )?.text;

    if (currentText === editCommentText) {
      toggleEditCommentMode(false, '');
      return;
    }

    const formValidation = validateForm(editCommentText);
    if (formValidation) {
      toggleEditCommentMode(false, '');
      setCommentError(formValidation);
      return;
    }

    try {
      setCommentError(null);
      const res = await axios.put(`/post/${postId}/comment/${commentId}`, {
        text: editCommentText,
      });
      setPost((prevPost) => {
        return {
          ...prevPost,
          comments: prevPost.comments.map((comment) => {
            return comment.id === commentId
              ? {
                  ...comment,
                  text: res.data.text,
                  updatedAt: res.data.updatedAt,
                }
              : comment;
          }),
        };
      });
      toggleEditCommentMode(false, '');
    } catch (err) {
      setCommentError(err);
    }
  };

  const toggleEditCommentMode = (commentId, commentText) => {
    setEditCommentMode(commentId);
    setEditCommentText(commentText);
  };

  const updatePublishedPost = async (postId) => {
    try {
      setError(null);
      const res = await axios.put(`/post/${postId}`, {
        isPublished: !post.isPublished,
        title: post.title,
        text: post.text,
        imageUrl: post.imageUrl,
      });
      setPost((prevPost) => {
        return {
          ...prevPost,
          isPublished: res.data.isPublished,
          updatedAt: res.data.updatedAt,
        };
      });
    } catch (err) {
      setError(err);
    }
  };

  // Delete post with a confirmation modal
  const handleDeletePostClick = () => {
    setPostModalOpen(true);
  };

  const handleConfirmDeletePost = async (postId) => {
    await deletePost(postId);
    setPostModalOpen(false);
  };

  const handlePostModalClose = () => {
    setPostModalOpen(false);
  };

  const deletePost = async (postId) => {
    try {
      setError(null);
      await axios.delete(`/post/${postId}`);
      navigate('/posts', { replace: true });
    } catch (err) {
      setError(err);
    }
  };

  // delete comment with a confirmation modal
  const handleDeleteCommentClick = (postId, commentId) => {
    setCommentData({ postId: postId, commentId: commentId });
    setCommentModalOpen(true);
  };

  const handleConfirmDeleteComment = async (postId, commentId) => {
    await deleteComment(postId, commentId);
    setCommentModalOpen(false);
    setCommentData({ postId: null, commentId: null });
  };

  const handleCommentModalClose = () => {
    setCommentModalOpen(false);
    setCommentData({ postId: null, commentId: null });
  };

  const renderComments = post.comments
    ? post.comments.map((comment) => {
        return (
          <Comment
            key={comment.id}
            authorId={comment.author.id}
            authorName={comment.author.name}
            text={comment.text}
            createdAt={comment.createdAt}
            updatedAt={comment.updatedAt}
            commentId={comment.id}
            editCommentMode={editCommentMode}
            updateComment={updateComment}
            editCommentText={editCommentText}
            setEditCommentText={setEditCommentText}
            toggleEditCommentMode={toggleEditCommentMode}
            user={user}
            postId={id}
            deleteComment={handleDeleteCommentClick}
          />
        );
      })
    : [];

  if (loading) {
    return (
      <div className='mt-48 flex flex-col items-center justify-center'>
        <GridLoader color='#000000' />
      </div>
    );
  }
  
  // post error
  if (error) {
    return (
      <div className='mx-4 my-8 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
        {error?.response?.data?.error || error?.message || 'Unexpected error'}
      </div>
    );
  }

  return (
    <div className='mx-auto my-0 max-w-6xl px-4 pb-8'>
      <Link
        to={state ? `/posts?page=${state.page}` : '/posts'}
        className='flex items-center gap-2 pb-2 pt-4 text-xl'
      >
        <FaArrowLeftLong />
        <div>Return to the blog</div>
      </Link>
      <h1 className='mb-4 text-3xl md:text-4xl'>{post.title}</h1>
      <div className='flex flex-col gap-4'>
        {post.imageUrl ? (
          <img className='rounded-lg' src={post.imageUrl} />
        ) : null}
        <div className='flex flex-col items-center justify-between text-lg font-semibold md:flex-row'>
          {/* for some reason sometimes there's a name is undefined error without post?.createdAt even thoguh the data is fetched */}
          <div>
            Published on{' '}
            {post?.createdAt &&
              new Date(post.createdAt).toLocaleDateString('en-US')}{' '}
            by {post?.author?.name}
          </div>
          {post.createdAt !== post.updatedAt ? (
            <div className='text-sm'>
              Edited on {new Date(post.updatedAt).toLocaleDateString('en-US')}
            </div>
          ) : null}
        </div>
        <div className='text-lg'>{post.text}</div>
        {user?.isAdmin ? (
          <div className='flex items-center gap-1 md:gap-2'>
            <Link
              state={{
                id: post.id,
                title: post.title,
                text: post.text,
                imageUrl: post.imageUrl,
                isPublished: post.isPublished,
              }}
              to='edit'
            >
              <button className='flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'>
                <FaEdit />
                <span>Edit</span>
              </button>
            </Link>
            <button
              className='flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
              onClick={() => updatePublishedPost(id)}
            >
              {!post.isPublished ? (
                <>
                  <FaEye />
                  <span>Publish</span>
                </>
              ) : (
                <>
                  <FaEyeSlash />
                  <span>Unpublish</span>
                </>
              )}
            </button>
            <button
              className='flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
              onClick={handleDeletePostClick}
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        ) : null}
      </div>
      <div>
        <hr className='my-8'></hr>
        <h2 className='mb-2 text-xl font-semibold'>
          Comments ({post.comments && post.comments.length})
        </h2>
        <div className='mb-4'>
          {!user ? (
            <div>You must log in to leave a comment</div>
          ) : (
            <form className='flex flex-col gap-2' onSubmit={addNewComment}>
              <textarea
                className='h-20 rounded-md border border-slate-500 px-2 py-1'
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder='Write a comment...'
                required
                maxLength={1000}
              />
              <button className='flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'>
                <MdOutlineInsertComment />
                <span>Post Comment</span>
              </button>
            </form>
          )}
        </div>
        {commentError ? (
        <div className='my-4 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
          {commentError?.response?.data?.error || commentError?.message || 'Unexpected error'}
        </div>
      ) : null}
        <div className='flex flex-col gap-2'>
          {!showAllComments ? renderComments.slice(0, 15) : renderComments}
        </div>
        {renderComments.length >= 15 && !showAllComments ? (
          <button
            className='mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'
            onClick={() => setShowAllComments((prevState) => !prevState)}
          >
            <MdOutlineInsertComment />
            <span>Show All Comments</span>
          </button>
        ) : null}
      </div>

      <ConfirmationModal
        text={'post'}
        isOpen={postModalOpen}
        onClose={handlePostModalClose}
        onConfirm={() => handleConfirmDeletePost(id)}
      />

      <ConfirmationModal
        text={'comment'}
        isOpen={commentModalOpen}
        onClose={handleCommentModalClose}
        onConfirm={() =>
          handleConfirmDeleteComment(commentData.postId, commentData.commentId)
        }
      />
    </div>
  );
}
