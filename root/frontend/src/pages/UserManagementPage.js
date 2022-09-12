import React from 'react'
import Table from '../components/layout/Table'
import { AiOutlineUserAdd } from "react-icons/ai";
import { Link } from 'react-router-dom';

function UserManagementPage() {
    return (
    <div>
        <div className='text-3xl mt-8 mb-12 text-center'>User Management</div>
        <div className='grid place-items-end mb-2 mr-2'>
            <div className='flex gap-4 mr-2'>
                <Link to="/create-user">
                    <AiOutlineUserAdd className='text-4xl mt-2 hover:cursor'/>
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