import { MdCancel, MdCheckCircle } from 'react-icons/md';

export default function ConfirmationModal(props) {
  if (!props.isOpen) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/50'>
      <div className='flex flex-col gap-2 rounded-lg bg-white px-8 py-8'>
        <h2 className='text-md font-semibold'>
          Do you really want to delete this {props.text}?
        </h2>
        <p className='text-gray-600'>This action cannot be undone!</p>
        <div className='flex items-center justify-end gap-2 pt-4'>
          <button
            className='flex items-center gap-2 rounded-md border border-neutral-500 bg-white px-2 py-1.5 text-sm hover:bg-neutral-500'
            onClick={props.onClose}
          >
            <MdCancel />
            <span>Cancel</span>
          </button>
          <button
            className='flex items-center gap-2 rounded-md bg-black px-2 py-1.5 text-sm text-white hover:bg-gray-800'
            onClick={props.onConfirm}
          >
            <MdCheckCircle />
            <span>Yes, delete it</span>
          </button>
        </div>
      </div>
    </div>
  );
}
