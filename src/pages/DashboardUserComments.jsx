import { useState, useEffect } from 'react';
import { useAuth } from '../provider/authProvider';
import axios from 'axios';
import DashboardUserComment from '../components/DashboardUserComment';
import { GridLoader } from 'react-spinners';
import ConfirmationModal from '../components/ConfirmationModal';
import ReactPaginate from 'react-paginate';
import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from 'react-icons/bs';
import { useSearchParams } from 'react-router-dom';

export default function DashboardUserComments() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [displayedComments, setDisplayedComments] = useState([]);

  const [editCommentMode, setEditCommentMode] = useState(false);
  const [editCommentText, setEditCommentText] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [selectedPost, setSelectedPost] = useState('All Posts');

  const [searchParams, setSearchParams] = useSearchParams();
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems =
    displayedComments && displayedComments.slice(itemOffset, endOffset);
  const pageCount =
    displayedComments && Math.ceil(displayedComments.length / itemsPerPage);

  const handlePageClick = (event) => {
    setSearchParams({ page: event.selected });
  };

  useEffect(() => {
    const newOffset =
      (Number(searchParams.get('page')) * itemsPerPage) %
      displayedComments.length;
    setItemOffset(newOffset);
  }, [searchParams, comments, displayedComments]);

  const uniqueAuthorNames =
    comments.length > 0
      ? [...new Set(comments.map((comment) => comment.author.name))]
      : [];

  const uniquePostTitles =
    comments.length > 0
      ? [...new Set(comments.map((comment) => comment.post.title))]
      : [];

  useEffect(() => {
    async function getComments() {
      try {
        setLoading(true);
        setError(null);
        const res = user.isAdmin
          ? await axios.get('/comment')
          : await axios.get(`/comment/author/${user.id}`);
        setComments(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    getComments();
  }, []);

  useEffect(() => {
    if (selectedAuthor === 'All Authors' && selectedPost === 'All Posts') {
      setDisplayedComments(comments);
    } else if (
      selectedAuthor === 'All Authors' &&
      selectedPost !== 'All Posts'
    ) {
      const filterComments = comments.filter(
        (comment) => comment.post.title === selectedPost,
      );
      filterComments.length === 0
        ? setSelectedPost('All Posts')
        : setDisplayedComments(filterComments);
    } else if (
      selectedAuthor !== 'All Authors' &&
      selectedPost === 'All Posts'
    ) {
      const filterComments = comments.filter(
        (comment) => comment.author.name === selectedAuthor,
      );
      filterComments.length === 0
        ? setSelectedAuthor('All Authors')
        : setDisplayedComments(filterComments);
    } else {
      const filterComments = comments.filter(
        (comment) =>
          comment.author.name === selectedAuthor &&
          comment.post.title === selectedPost,
      );
      if (filterComments.length === 0) {
        setSelectedAuthor('All Authors');
        setSelectedPost('All Posts');
      } else {
        setDisplayedComments(filterComments);
      }
    }
    // reset page when select data changes
    setSearchParams({ page: 0 });
  }, [selectedAuthor, selectedPost, comments]);

  function validateForm() {
    if (editCommentText.length < 1 || editCommentText.length > 1000) {
      return { message: 'Comment text must be between 1 and 1000 characters.' };
    }
  }

  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [commentData, setCommentData] = useState(null);

  const handleDeleteCommentClick = (commentId) => {
    setCommentData(commentId);
    setCommentModalOpen(true);
  };

  const handleConfirmDeleteComment = async (commentId) => {
    await deleteComment(commentId);
    setCommentModalOpen(false);
    setCommentData(null);
  };

  const handleCommentModalClose = () => {
    setCommentModalOpen(false);
    setCommentData(null);
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`/comment/${commentId}`);
      // if it's the only comment on a non-first page - reduce page by 1; user will go back to the previous page to avoid errors
      if (currentItems.length === 1 && Number(searchParams.get('page')) > 0) {
        setSearchParams((prevState) => ({ page: prevState.get('page') - 1 }));
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
    } catch (err) {
      setError(err);
    }
  };

  const updateComment = async (commentId) => {
    const currentText = comments.find(
      (comment) => comment.id === commentId,
    )?.text;

    if (currentText === editCommentText) {
      toggleEditCommentMode(false, '');
      return;
    }

    const formValidation = validateForm();
    if (formValidation) {
      toggleEditCommentMode(false, '');
      setError(formValidation);
      return;
    }

    try {
      setError(null);
      const res = await axios.put(`/comment/${commentId}`, {
        text: editCommentText,
      });
      setComments((prevState) => {
        return prevState.map((comment) => {
          return comment.id === commentId
            ? { ...comment, text: res.data.text, updatedAt: res.data.updatedAt }
            : comment;
        });
      });
      toggleEditCommentMode(false, '');
    } catch (err) {
      setError(err);
    }
  };

  const toggleEditCommentMode = (commentId, commentText) => {
    setEditCommentMode(commentId);
    setEditCommentText(commentText);
  };

  const renderComments = currentItems.map((comment) => {
    return (
      <DashboardUserComment
        key={comment.id}
        postTitle={comment.post.title}
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
        username={user.name}
        deleteComment={handleDeleteCommentClick}
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
      {/*if admin - two dropdowns with users & posts
      if normal user - just one dropdown with posts where this user has left comments */}
      <div className='flex justify-between gap-2'>
        {uniqueAuthorNames.length > 1 ? (
          <div className='mt-4 flex-1'>
            <select
              className='w-full rounded-md border border-gray-300 p-1 text-gray-700 focus:outline-none'
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <option>All Authors</option>
              {uniqueAuthorNames.map((name) => {
                return <option key={name}>{name}</option>;
              })}
            </select>
          </div>
        ) : null}
        {uniquePostTitles.length > 1 ? (
          <div className='mt-4 flex-1'>
            <select
              className='w-full truncate rounded-md border border-gray-300 p-1 text-gray-700 focus:outline-none'
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
            >
              <option className='truncate'>All Posts</option>
              {uniquePostTitles.map((name) => {
                return <option key={name}>{name}</option>;
              })}
            </select>
          </div>
        ) : null}
      </div>

      <div className='mt-4 flex flex-col gap-2'>{renderComments}</div>
      <ConfirmationModal
        text={'comment'}
        isOpen={commentModalOpen}
        onClose={handleCommentModalClose}
        onConfirm={() => handleConfirmDeleteComment(commentData)}
      />
      {displayedComments.length > itemsPerPage ? (
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
    </div>
  );
}
