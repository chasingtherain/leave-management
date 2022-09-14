import React from 'react'
import Table from '../components/layout/Table'

function ApproveLeavePage() {
  return (
        <div className='flex flex-col justify-between'> 
            <h1 className='text-xl my-6 text-center'>Pending for Approval</h1>
            <Table headerType="approval"/>
            <h1 className='text-xl mt-32 mb-6 text-center'>Approval History</h1>
            <Table headerType="approvalHistory"/>
        </div>
  )
}

export default ApproveLeavePage