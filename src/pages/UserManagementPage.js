import React from 'react'
import Table from '../components/layout/Table'

function UserManagementPage() {
  return (
    <div>
        <div className='text-3xl mt-8 mb-12 text-center'>User Management</div>
        <Table headerType="user-management"/>
    </div>
  )
}

export default UserManagementPage