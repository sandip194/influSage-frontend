import React from 'react';
import { RiAddLine } from '@remixicon/react';

const todos = [
  {
    id: 1,
    title: 'Upload story for adidas campaign',
    due: '2 Days',
    completed: true,
  },
  {
    id: 2,
    title: 'Responds to brief for Samsung',
    due: '2 Days',
    completed: false,
  },
  {
    id: 3,
    title: 'Upload story for adidas campaign',
    due: '2 Days',
    completed: true,
  },
  {
    id: 4,
    title: 'Reel approved by Puma',
    due: '2 Days',
    completed: false,
  },
  {
    id: 5,
    title: 'Reel approved by Puma',
    due: '5 Days',
    completed: true,
  },
];

const TodoListCard = () => {
  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold">To-do List</h2>
        <button className="border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-1">
          <RiAddLine className="inline" /> Add
        </button>
      </div>

      {/* Todo Items */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center gap-4 border-b-1 border-gray-200 pb-3">
            <input
              type="checkbox"
              checked={todo.completed}
              readOnly
              className="mt-1 form-checkbox h-5 w-5 text-blue-600"
            />
            <div>
              <p className="text-sm font-medium mb-2">{todo.title}</p>
              <p className="text-xs text-gray-500">Due In: {todo.due}</p>
            </div>
            <i className="ri-more-2-fill ml-auto text-gray-400 hover:text-gray-600 cursor-pointer"></i>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoListCard;
