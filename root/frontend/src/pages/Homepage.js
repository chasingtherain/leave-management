import React from 'react'
import { Link } from 'react-router-dom'
import Tab from '../components/layout/Tab'
import Table from '../components/layout/Table'
import { useMainContext } from '../hooks/useMainContext'

function Homepage() {
    const {activeTab} = useMainContext()
    const childCareYear = new Date().getFullYear() - 2

    return (
    <div>
        <div className='flex justify-between'> 
            <Tab/>
            <Link to="/apply-leave">
                <button className='btn bg-black rounded-md mt-6 mr-6 px-6 text-lg'>Apply Leave 申请休假</button>
            </Link>
        </div>
        {/* based on user action, display active tab in homepage */}
        {activeTab === "Home" ? 
            (
            <>
                <h1 className='text-xl my-6 text-center'>Leave Request 休假请求</h1>
                <Table headerType="request"/>
                <h1 className='text-xl mt-20 mb-6 text-center'>Leave History 休假历史</h1>
                <Table headerType="history"/>
            </>
            )
        : 
            (
            <>
                <h1 className='text-xl my-6'>Leave Entitlement</h1>
                <Table headerType="entitlement"/>
                <p className='mt-2 ml-2'>Note / 温馨提示: </p>
                <p className='mt-2 ml-2'>Staff with child 3 years old or younger are eligible for childcare leave / 带3岁或3岁以下儿童的员工可申请育儿假</p>
                <p className='mt-2 ml-2'>Female staff are entitled to 0.5 days of International Women's Day / 女性员工可申请 0.5 天妇女节假</p>
            </>
            )
        }

    </div>
    )
}

export default Homepage