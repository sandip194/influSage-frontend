export default function ChatMessages({ chat, messages }) {
  if (!chat) return null;

  const currentUser = 'you';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
      {messages.map((msg) => {
        const isMe = msg.sender === currentUser;

        return (
          <div
            key={msg.id}
            className={`flex ${isMe ? 'justify-end' : 'items-start space-x-2'}`}
          >
            {!isMe && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
                {chat?.img ? (
                  <img
                    src={chat.img}
                    alt={chat.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{chat?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            )}
            <div>
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  isMe
                    ? 'bg-[#0D132D] text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
