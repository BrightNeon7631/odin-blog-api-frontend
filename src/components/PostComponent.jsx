import { Link } from 'react-router-dom';
import { CiImageOff } from 'react-icons/ci';

export default function PostComponent(props) {
  return (
    <Link
      className='flex flex-col gap-4 rounded-lg bg-gray-100 px-4 py-4 hover:bg-gray-300'
      to={`/posts/${props.id}`}
      state={{ page: props.page }}
    >
      {props.imageUrl ? (
        <img
          className='h-[50%] w-full rounded-md object-cover'
          src={props.imageUrl}
        />
      ) : (
        <div className='h-[50%] w-full rounded-md bg-slate-500'>
          <CiImageOff className='h-full w-full' />
        </div>
      )}
      <div className='flex gap-2 text-sm'>
        <span>{new Date(props.createdAt).toLocaleDateString('en-US')}</span>
        <span>•</span>
        <span>{props.author}</span>
      </div>
      <h2 className='line-clamp-2 text-xl font-medium'>{props.title}</h2>
      <div className='line-clamp-2 text-base font-light'>{props.text}</div>
    </Link>
  );
}
