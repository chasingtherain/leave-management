import React, { useState } from 'react'
import Table from '../components/layout/Table'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useMainContext } from '../hooks/useMainContext'
import TeamCalendar from '../components/layout/TeamCalendar'

function DashboardPage() {
  const {userList} = useMainContext()
  const [leaveCount, setLeaveCount] = useState()

  const handleReminderClick = () => {
    const url = `${process.env.REACT_APP_BACKENDURL}/admin/send-reminder`
    const targetEmailList = userList
    .filter(staff => (staff.leave[0].entitlement - staff.leave[0].used) >= leaveCount 
      && staff.isAdmin === "user")
    .map(staff => staff.email)

    if(leaveCount){
      axios
        .post(url,{leaveCount: leaveCount, targetEmailList: targetEmailList})
        .then((response)=> {
          console.log(response)
          toast.success("reminder email sent")
        })
        .catch(err => console.log(err))
    }
    else return toast.error("Input was invalid or empty!")
  }

  return (

    <div>
      <TeamCalendar/>
      {/* <h1 className='text-xl my-6 text-center'>Staff's Remaining Annual Leave</h1>
      <Table headerType="dashboard"/>
      <div class="divider"></div> 
      <div className='flex flex-col justify-start items-center'>
        <div className='flex flex-row items-center'>
          <p className='text-lg my-8 text-center'>
            Send reminder email to staff with at least 
            <input
              type="number"
              onChange={(e) => setLeaveCount(e.target.value)}
              className="input input-bordered input-secondary text-lg mx-2"
              placeholder="10"
              style={{width:'70px'}}/>
              days of annual leave left
          </p>
        </div>
        <button 
          className='btn'
          onClick={handleReminderClick}
          >Send Reminder</button>
      </div> */}
    </div>
  )
}

export default DashboardPage