import React from 'react'
import { RiShutDownLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

export const ProfileHeader = () => {
  return (
    <div className="header-container flex items-center justify-between bg-white p-2 shadow-none border-b border-gray-200 px-8">

        <div className="logo">

          <Link to={"/"}>
            <img src="/public/influSage-logo.png" alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="logout-btn">
            <button className="flex justify-center items-center gap-2 cursor-pointer px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-100 text-sm">
                Logout
                <span> <RiShutDownLine /></span>
            </button>
        </div>
      
    </div>
  )
}
