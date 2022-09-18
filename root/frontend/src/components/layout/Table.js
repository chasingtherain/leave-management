import axios from 'axios'
import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'
import InfoBubble from './InfoBubble'
import { toast } from 'react-toastify'

function Table({headerType}) {
    const {currentUser, fetchCurrentUserInfo, setCurrentEditUser, userList} = useMainContext()
    const currentDate = new Date()
    const currentDateUnix = currentDate.getTime()
    const currentUserLeave = currentUser.leave

    // table headers
    const requestTableHeader = ["ID", "Leave Type 假性", "Period 时间段", "No. of calendar days 工作日数", "Submitted on 提交日期", "Quota used 使用额", "Status 状态", "Action 更改" ]
    const historyTableHeader = ["ID", "Leave Type 假性", "Period 时间段", "No. of calendar days 工作日数", "Submitted on 提交日期", "Quota used 使用额", "Status 状态" ]
    const approvalTableHeader = ["Staff", "Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const approvalHistoryTableHeader = ["Staff", "Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status" ]
    const entitlementTableHeader = ["Leave Type 假性", "Entitlement 年额", "Pending 待批准", "Quota used 已用", "Available 可用", "Note 备注", "Bring Over to Next Year? 带到明年? "]
    const changeLogHeader = ["Time","Operation Type", "Changes made", "Changed by"]
    const userManagementTableHeader = ["Name","Email","Created on","Last updated on","Type","RO email","CO email","Action"]
    
    const changeLogData = [
        ["04.04.2022", "Update", ["role changed to:", " admin"] , "yunxi@mfa.sg"],
        ["01.04.2022", "Add", ["new account added"] , "yunxi@mfa.sg"],
        ["03.07.2022", "Delete", ["account X deleted"] , "yunxi@mfa.sg"],
    ]
    
    const handleEditClick = (event) => {
        // identify user's id, send user's data to update user info form
        // console.log(event.target.id)
        setCurrentEditUser(event.target.id)
        fetchCurrentEditUserDetails(event.target.id)
    }

    const fetchCurrentEditUserDetails = (userEmail) => {
        const url = `${process.env.REACT_APP_BACKENDURL}/admin/get-user-info-by-email/${userEmail}`
        axios
        .get(url)
        .then(resp => {
            setCurrentEditUser(resp.data)
        })
        .catch(err => console.log(err))
    }

    const handleCancelClick = (e) => {
        e.preventDefault()

        const targetLeaveHistory = currentUser.leaveHistory.filter(leaveRecord => leaveRecord._id === e.target.id)

        if(window.confirm(`
        leave id: ${e.target.id}

        Cancel leave? 
        确认取消以上的休假？ `)){
            const url = `${process.env.REACT_APP_BACKENDURL}/user/cancelLeave`
            
            axios
                .post(url, {userId: currentUser._id, targetLeaveHistory: targetLeaveHistory, reportingEmail: currentUser.reportingEmail})
                .then(resp => {
                    fetchCurrentUserInfo(currentUser)
                    console.log(resp)
                    toast.success("Leave Cancelled")
                })
                .catch(err => console.log(err))
        }
    }

    const handleActionClick = (e) => {
        e.preventDefault()
        const staffEmail= e.target.id
        const dateRange = e.target.name
        const action = e.target.value

        if(window.confirm(`${action} leave? `))
        {
            const url = `${process.env.REACT_APP_BACKENDURL}/admin/${action}-leave`

            const targetStaffLeave = currentUser.staffLeave.filter(entry => (entry.staffEmail === staffEmail && entry.timePeriod === dateRange && entry.status === "pending"))
            console.log("targetStaffLeave: ",targetStaffLeave)
            const leaveData = {
                staffEmail: targetStaffLeave[0].staffEmail,
                coveringEmail: targetStaffLeave[0].coveringEmail,
                reportingEmail: currentUser.email,
                dateRange: targetStaffLeave[0].timePeriod,
                leaveType: targetStaffLeave[0].leaveType,
                leaveStatus: targetStaffLeave[0].status,
                numOfDaysTaken: targetStaffLeave[0].quotaUsed,
                submittedOn: targetStaffLeave[0].submittedOn
            }
            console.log("leaveData: ", leaveData)

            axios
                .post(url, leaveData)
                .then(resp => {
                    console.log(resp)
                    if (action === "Approve") toast.success(`Leave approved`)
                    else toast.success(`Leave rejected`)

                    fetchCurrentUserInfo(currentUser)
                })
                .catch(err => console.log(err))
        }
    }


    const tableHeaderSelection = (headerType) => {
        switch (headerType) {
            case "approval":
                return approvalTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "approvalHistory":
                return approvalHistoryTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "change-log":
                return changeLogHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "entitlement":
                return entitlementTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "request":
                return requestTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "history":
                return historyTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            case "user-management":
                return userManagementTableHeader.map((headerName,index) => <th key={index}>{headerName}</th>)
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    const statusBadgeSelection = (status) => {
        switch (status) {
            case "approved":
                return <span className='badge badge-success py-3 text-slate-50'>{status}</span>
            case "cancelled":
                return <span className='badge badge-warning py-3 text-slate-50'>{status}</span>
            case "pending":
                return <span className='badge badge-info py-3 text-slate-50'>{status}</span>
            case "rejected":
                return <span className='badge badge-error py-3 text-slate-50'>{status}</span>
            default:
                console.log("invalid status header provided!")
                break;
        }
    }

    const tableDataSelection = (headerType) => {
        switch (headerType) {
            case "approval":
                return (currentUser.staffLeave.filter(entry => entry.status === "pending")) ?
                    currentUser.staffLeave
                        .filter(entry => entry.status === "pending")
                        .map((subLeave,index) => 
                        <tr>
                            <td>{subLeave.staffEmail}</td>
                            <td>{subLeave.leaveType}</td>
                            <td>{subLeave.timePeriod}</td>
                            <td>{subLeave.quotaUsed}</td>
                            <td>{subLeave.submittedOn}</td>
                            <td>{subLeave.quotaUsed}</td>
                            <td>{statusBadgeSelection(subLeave.status)}</td>
                            <td>
                                <button 
                                    id={subLeave.staffEmail} 
                                    name={subLeave.timePeriod}
                                    onClick={(e) => handleActionClick(e)} 
                                    className="btn btn-sm px-2 rounded-md text-white mr-4"
                                    value="Approve">Approve
                                </button>
                                <button 
                                    id={subLeave.staffEmail} 
                                    name={subLeave.timePeriod}
                                    onClick={(e) => handleActionClick(e)} 
                                    className="btn btn-sm btn-error px-2 rounded-md text-white"
                                    value="Reject">Reject
                                </button>
                            </td>
                        </tr>
                ) : <p className='text-center w-screen mt-8'>No pending leave applications</p>
            case "approvalHistory":
                return (currentUser.staffLeave.filter(entry => entry.status === "approved" || entry.status === "rejected")) ?
                 currentUser.staffLeave
                    .filter(entry => entry.status === "approved" || entry.status === "rejected")
                    .map((subLeave,index) => 
                    <tr>
                        <td>{subLeave.staffEmail}</td>
                        <td>{subLeave.leaveType}</td>
                        <td>{subLeave.timePeriod}</td>
                        <td>{subLeave.quotaUsed}</td>
                        <td>{subLeave.submittedOn}</td>
                        <td>{subLeave.quotaUsed}</td>
                        <td>{statusBadgeSelection(subLeave.status)}</td>
                    </tr>
                )
                : <p className='text-center w-screen mt-8'>No approval leave history yet</p>
            case "change-log":
                return changeLogData.map((list, index) => <tr key={index}>{list.map(listItem => <td>{listItem}</td>)}</tr>)
            case "entitlement":
                return currentUserLeave.map((leave,index) => 
                    <tr key={index}>
                        <td>{leave.name}</td>
                        <td>{leave.entitlement}</td>
                        <td>{leave.pending}</td>
                        <td>{leave.used}</td>
                        <td>{leave.entitlement - leave.used}</td>
                        <td><InfoBubble info={leave.note}/></td>
                        <td>{(leave.rollover) ? "Yes" : "No"}</td>
                    </tr>)
            case "request":
                return (currentUser.leaveHistory) ?
                currentUser.leaveHistory
                    .filter(entry => entry.startDateUnix > currentDateUnix)
                    .map((leave,index)=>
                            <tr key={index}>
                                <td className='text-sm'>{leave._id}</td>
                                <td>{leave.leaveType}</td>
                                <td>{leave.timePeriod}</td>
                                <td>{leave.quotaUsed}</td>
                                <td>{leave.submittedOn}</td>
                                <td>{leave.quotaUsed}</td>
                                <td>
                                    {statusBadgeSelection(leave.status)}
                                </td>
                                <td>
                                    {(leave.status !== "cancelled" && leave.status !== "rejected") ?
                                    <button 
                                        id={leave._id} 
                                        name={leave.leaveType}
                                        onClick={(e) => handleCancelClick(e)} 
                                        className="btn btn-sm btn-error px-2 rounded-md text-white">cancel 取消
                                    </button>
                                    : <></>
                                    }
                                </td>
                                {/* <td><button className='btn-error px-2 rounded-md text-white'>Cancel 取消</button></td> */}
                            </tr>
                        )
                    : <p className='text-center w-screen mt-8'>No upcoming leave request / 暂时无请求</p>

            case "history":
                return (currentUser.leaveHistory) ?
                    currentUser.leaveHistory
                        .filter(entry => entry.startDateUnix <= currentDateUnix)
                        .map((leave,index)=>
                                <tr key={index}>
                                    <td className='text-sm'>{leave._id}</td>
                                    <td>{leave.leaveType}</td>
                                    <td>{leave.timePeriod}</td>
                                    <td>{leave.quotaUsed}</td>
                                    <td>{leave.submittedOn}</td>
                                    <td>{leave.quotaUsed}</td>
                                    <td>
                                        {statusBadgeSelection(leave.status)}
                                    </td>
                                </tr>
                        )
                : 
                <p className="w-screen text-center text-slate-800 mt-8">No leave history yet / 暂时无历史</p>
            case "user-management":
                return userList.map((list, index) => 
                        (
                                <tr key={index}>
                                    <td>{list.name}</td>
                                    <td>{list.email}</td>
                                    <td>{list.createdOn}</td>
                                    <td>{list.lastUpdatedOn}</td>
                                    <td>{list.isAdmin}</td>
                                    <td>{list.reportingEmail}</td>
                                    <td>{list.coveringEmail}</td>
                                    <td>
                                        <Link to ="/update-user">
                                            <button id={list.email} className='btn btn-xs btn-neutral' onClick={handleEditClick}>
                                                edit
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                        ))
            default:
                console.log("invalid table header provided!")
                break;
        }
    }

    return (
    <div className="overflow-x-auto">
        <table className="table hover w-full">
            {/* <!-- head --> */}
            <thead>
            <tr>
                {tableHeaderSelection(headerType)}
            </tr>
            </thead>
            <tbody>
                {userList.length > 0 && tableDataSelection(headerType)}
            </tbody>
        </table>
    </div>
    )
}

export default Table