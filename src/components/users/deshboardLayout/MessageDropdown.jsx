import React from 'react';

const MessageDropdown = () => {
  const messages = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      message: "Hi How Are you ?",
      time: "05:00 PM",
    },
    {
      id: 2,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      message: "Have you completed the task ?",
      time: "05:00 PM",
    },
    {
      id: 3,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/13.jpg",
      message: "Need to schedule the meeting for it",
      time: "05:00 PM",
    },
    {
      id: 4,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/14.jpg",
      message: "I am fine. Please join the link",
      time: "05:00 PM",
    },
  ];

  return (
    <div
      className="w-60 sm:w-80 bg-white shadow-lg rounded-3xl p-4 mt-5"
      style={{
        left: "-71px",
        position: "absolute",
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg text-[#0b0d28]">Messages</h2>
        <button className="text-sm text-[#0b0d28] font-medium hover:underline cursor-pointer">
          View All
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3 py-3">
            <img src={msg.avatar} className="w-10 h-10 rounded-full" alt="" />
            <div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-bold text-[#0b0d28]">{msg.name}</span>
                <span className="text-gray-400">{msg.time}</span>
              </div>
              <p className="text-sm text-[#0b0d28] mt-1">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageDropdown;
