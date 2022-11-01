import React from 'react'
import Table from '../components/layout/Table'
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link } from 'react-router-dom';

function UserManagementPage() {
    return (
    <div>
        <div className='text-2xl mt-8 mb-12 text-center'>User Management</div>
        <div className='grid place-items-end mb-2 mr-2'>
            <div className='flex gap-4 mr-2'>
                <Link to="/create-user">
                    <button className='btn px-8'>
                        <span><AiOutlineUserAdd className='text-3xl mr-4 px-0 hover:cursor'/></span>
                        <span className='text-[16px]'>Add New User</span>
                    </button>   
                </Link>
                {/* <Link to="/change-log">
                    <button className='btn bg-black rounded-md px-6 text-lg'>Change Log</button>
                </Link> */}
            </div>
        </div>
        <Table headerType="user-management"/>
    </div>
    )
}

export default UserManagementPage