import React from 'react'
import Table from '../components/layout/Table'

function DeleteLeaveType() {
    return (
        <div>
            <div className='text-2xl mt-8 mb-12 text-center'>Manage Leave Added By Admin</div>
            <Table headerType="delete-leave-type"/>
        </div>
        )
}

export default DeleteLeaveType