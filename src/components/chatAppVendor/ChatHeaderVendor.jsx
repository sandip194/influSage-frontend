import { RiArrowLeftLine } from 'react-icons/ri';

export default function ChatHeaderVendor({ chat, onBack }) {
  // Get the first letter of the name if available
  const initial = chat?.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex items-center space-x-3 p-4 bg-white  rounded-t-2xl">
      {/* Mobile back button */}
      <button
        onClick={onBack}
        className="md:hidden text-2xl text-gray-500 mr-2"
      >
        <RiArrowLeftLine />
      </button>

      {/* Profile image or initial */}
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
        {chat?.img ? (
          <img
            src={chat.img}
            alt={chat.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {/* Name and status */}
      <div>
        <div className="font-semibold">{chat?.name || 'Chat'}</div>
        <div className="text-sm text-gray-400">Last seen 45 mins ago</div>
      </div>
    </div>
  );
}
