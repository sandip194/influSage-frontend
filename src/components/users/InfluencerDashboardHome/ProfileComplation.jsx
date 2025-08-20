import { RiUserLine } from '@remixicon/react'
import React from 'react'

const ProfileComplation = ({ completion = 80 }) => {

    return (
        <div className="bg-white p-6 rounded-2xl flex-row sm:flex items-center justify-between mb-3">
            <div className='flex items-center gap-4'>
                <div className='bg-[#0D132D] rounded-full p-3'>
                    <RiUserLine className='text-white' />
                </div>
                <div>
                    <p className="text-gray-700 font-semibold">Profile Completion</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-[#0D132D] h-2 rounded-full"
                            style={{ width: `${completion}%` }}
                        ></div>
                    </div>

                     <p className="text-sm text-gray-500 mt-1">Lorem Ipsum is simply dummy text...</p>
                </div>
               
            </div>
            <button className="bg-[#121A3F] text-white cursor-pointer inset-shadow-sm inset-shadow-gray-500 px-8 py-3 rounded-full hover:bg-[#0D132D] mt-3">Complete Profile</button>
        </div>
    )
}

export default ProfileComplation