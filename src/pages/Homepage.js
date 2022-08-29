import React from 'react'
import { Link } from 'react-router-dom'
import Tab from '../components/layout/Tab'
import Table from '../components/layout/Table'
import { useMainContext } from '../hooks/useMainContext'

function Homepage() {
    const {active} = useMainContext()
    return (
    <div>
        <div className='flex justify-between'> 
            <Tab/>
            <Link to="/apply-leave">
                <button className='btn bg-black rounded-md mt-6 mr-6 px-12 text-lg'>Apply for Leave</button>
            </Link>
        </div>
        {/* based on user action, display active tab in homepage */}
        {active === "Home" ? 
            (
            <>
                <h1 className='text-xl my-6 text-center'>Leave Requests and Upcoming Leaves 休假请求</h1>
                <Table headerType="request"/>
                <h1 className='text-xl mt-20 mb-6 text-center'>Leave History 历史</h1>
                <Table headerType="history"/>
            </>
            )
        : 
            (
            <>
                <h1 className='text-xl my-6'>Leave Entitlement</h1>
                <Table headerType="entitlement"/>
            </>
            )
        }

    </div>
    )
}

export default Homepage