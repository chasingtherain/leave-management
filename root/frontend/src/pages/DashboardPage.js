import React, { useState } from 'react'
import Table from '../components/layout/Table'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useMainContext } from '../hooks/useMainContext'
import TeamCalendar from '../components/TeamCalendar'

function DashboardPage() {
  const {currentLeaveEntitlement, userList} = useMainContext()
  const [leaveCount, setLeaveCount] = useState()

  console.log("userList: ", userList)
  const handleReminderClick = () => {
    
    if(window.confirm(`Send reminder to staff with at least ${leaveCount} day(s) of annual leave left?`)){
      const url = `${process.env.REACT_APP_BACKENDURL}/admin/send-reminder`
      const targetEmailList = userList
                              .filter(staff => (currentLeaveEntitlement.find(leave => leave.name === "Annual Leave 年假").entitlement - staff.leave[0].used) >= leaveCount 
                                && staff.isAdmin === "user")
                              .map(staff => staff.email)

      if(leaveCount){
        console.log("targetEmailList: ", targetEmailList)
        axios
          .post(url,{leaveCount: leaveCount, targetEmailList: targetEmailList})
          .then((response)=> {
            console.log(response)
            toast.success("reminder email sent")
          })
          .catch(err => {
            console.log("err: ", err)
            toast.warning("failed to send reminder")
        })
      }
      else return toast.error("Input was invalid or empty!")
    }
  }

  return (

    <div>
      <h1 className='text-xl my-6 text-center'>Staff's Remaining Annual Leave</h1>
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
              placeholder="5"
              style={{width:'75px'}}/>
              days of annual leave left
          </p>
        </div>
        <button 
          className='btn'
          onClick={handleReminderClick}
          >Send Reminder</button>
      </div>
    </div>
  )
}

export default DashboardPage