import { RiAddLine } from 'react-icons/ri';
export default function Sidebar({ onSelectChat }) {
  const conversations = [
    {
      name: 'Sean Smith',
      message: 'Hi How Are you ?',
      time: '05:00 PM',
      unread: 2,
      img: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Annette Black',
      message: 'Hi How Are you ?',
      time: '05:00 PM',
      img: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Robert Fox',
      message: 'Have you completed the task ?',
      time: '05:00 PM',
      img: 'https://randomuser.me/api/portraits/men/56.jpg',
    },
    {
      name: 'Dianne Russell',
      message: 'Need to schedule the meeting for it at 6 pm, so be on time dont be late ',
      time: '05:00 PM',
      img: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    // Add more users...
  ];

  return (
    <div className="h-full flex rounded-2xl flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b-2  border-gray-100  font-bold text-xl flex justify-between items-center">
        <span>Conversations</span>
        <button className="w-10 h-10 bg-[#0D132D] text-white rounded-full text-xl flex items-center justify-center">
          <RiAddLine />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-2 ">
          <svg
            className="w-5 h-5 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 12.65z" />
          </svg>
          <input
            placeholder="Search"
            className="w-full outline-none text-sm"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((user, i) => (
          <div
            key={i}
            onClick={() => onSelectChat(user)}
            className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
          >
            <div className="flex items-center space-x-3">
              <img
                src={user.img}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-sm">{user.name}</div>
                <div className="text-xs text-gray-500">{user.message}</div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-1">
              <span className="text-xs text-gray-400">{user.time}</span>
              {user.unread && (
                <span className="text-xs bg-[#0D132D] text-white rounded-full px-2 py-0.5">
                  {user.unread}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
