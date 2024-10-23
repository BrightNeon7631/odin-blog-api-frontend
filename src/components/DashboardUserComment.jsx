import { MdCancel, MdCheckCircle } from 'react-icons/md';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

export default function DashboardUserComment(props) {
  const formattedCreatedDate = format(props.createdAt, 'MM/dd/yyyy hh:mm a');
  const formattedUpdatedDate = format(props.updatedAt, 'MM/dd/yyyy hh:mm a');

  return (
    <div className='rounded-md border border-slate-500 px-4 py-4'>
      <div>
        <div className='flex gap-2 truncate text-sm text-gray-700 md:text-base'>
          <span>{props.authorName}</span>
          <span>•</span>
          {props.createdAt !== props.updatedAt ? (
            <span>{formattedUpdatedDate} (edited)</span>
          ) : (
            <span>{formattedCreatedDate}</span>
          )}
          <span>•</span>
          <span>{props.postTitle}</span>
        </div>
        {props.editCommentMode !== props.commentId ? (
          <div className='mt-2'>{props.text}</div>
        ) : (
          <textarea
            className='mt-2 h-20 w-full rounded-md border border-slate-500 px-2 py-1'
            value={props.editCommentText}
            onChange={(e) => props.setEditCommentText(e.target.value)}
          />
        )}
      </div>
      <div className='mt-2 flex gap-2'>
        {props.editCommentMode === false ? (
          <button
            className='flex items-center gap-2 rounded-lg bg-black px-2 py-1.5 text-sm text-white hover:bg-gray-800'
            onClick={() => props.deleteComment(props.commentId)}
          >
            <FaTrash />
            <span>Delete</span>
          </button>
        ) : null}
        {props.editCommentMode !== props.commentId &&
        props.editCommentMode === false ? (
          <button
            className='flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-800'
            onClick={() =>
              props.toggleEditCommentMode(props.commentId, props.text)
            }
          >
            <FaEdit />
            <span>Edit</span>
          </button>
        ) : props.editCommentMode === props.commentId ? (
          <>
            <button
              className='flex items-center gap-2 rounded-lg bg-black px-2 py-1.5 text-sm text-white hover:bg-gray-800'
              onClick={() => props.updateComment(props.commentId)}
            >
              <MdCheckCircle />
              <span>Update</span>
            </button>
            <button
              className='flex items-center gap-2 rounded-lg border border-neutral-500 bg-white px-2 py-1.5 text-sm hover:bg-neutral-500'
              onClick={() => props.toggleEditCommentMode(false, '')}
            >
              <MdCancel />
              <span>Cancel</span>
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
