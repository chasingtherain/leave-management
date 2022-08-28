import React from 'react'
import Tab from '../components/layout/Tab'
import Table from '../components/layout/Table'

function Homepage() {
  return (
    <div>
        <Tab/>
        <h1 className='text-xl my-6'>Leave Requests and Upcoming Leaves</h1>
        <Table headerType="request"/>
        <h1 className='text-xl mt-20 mb-6'>Leave History</h1>
        <Table headerType="history"/>
    </div>
  )
}

export default Homepage