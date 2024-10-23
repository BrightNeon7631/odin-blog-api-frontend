import { BsArrowRightSquareFill, BsArrowLeftSquareFill } from 'react-icons/bs';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../provider/authProvider';
import { GridLoader } from 'react-spinners';
import { MdOutlinePostAdd } from 'react-icons/md';
import ReactPaginate from 'react-paginate';
import PostComponent from '../components/PostComponent';
import axios from 'axios';

export default function AllPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 9;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = posts && posts.slice(itemOffset, endOffset);
  const pageCount = posts && Math.ceil(posts.length / itemsPerPage);

  const handlePageClick = (event) => {
    setSearchParams({ page: event.selected });
  };

  // sets new itemOffset data on query change
  useEffect(() => {
    const newOffset =
      (Number(searchParams.get('page')) * itemsPerPage) % posts.length;
    setItemOffset(newOffset);
  }, [searchParams, posts]);

  // scrolls to the top when 'page' changes
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [currentItems]);

  useEffect(() => {
    async function getPosts() {
      try {
        setLoading(true);
        setError(null);
        const res = user?.isAdmin
          ? await axios.get('/post/all')
          : await axios.get('/post');
        setPosts(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, [user]);

  const renderPosts = currentItems.map((post) => {
    return (
      <PostComponent
        key={post.id}
        id={post.id}
        imageUrl={post.imageUrl}
        title={post.title}
        text={post.text}
        createdAt={post.createdAt}
        author={post.author.name}
        page={Number(searchParams.get('page'))}
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

  if (error) {
    return (
      <div className='mx-4 my-8 rounded-lg bg-blue-100 py-4 text-center font-semibold'>
        {error?.response?.data?.error || error?.message || 'Unexpected error'}
      </div>
    );
  }

  return (
    <div className='mx-auto my-0 max-w-6xl px-4 py-8'>
      <div className='flex content-between justify-between'>
        <h1 className='mb-4 text-4xl'>All Posts</h1>
        {user?.isAdmin ? (
          <Link to='create' state={Number(searchParams.get('page'))}>
            <button className='flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-white hover:bg-gray-800'>
              <MdOutlinePostAdd />
              <span>Add Post</span>
            </button>
          </Link>
        ) : null}
      </div>
      <div className='grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4'>
        {renderPosts}
      </div>
      {posts.length > itemsPerPage ? (
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
