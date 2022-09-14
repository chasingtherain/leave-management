import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'
import { useMainContext } from '../../hooks/useMainContext'
import CancelLeaveModal from '../modal/CancelLeaveModal'
import InfoBubble from './InfoBubble'
import { toast } from 'react-toastify'

function Table({headerType}) {
    const {currentUser, fetchCurrentUserInfo, setCurrentEditUser, userList} = useMainContext()
    const currentDate = new Date()
    const currentDateUnix = currentDate.getTime()
    const currentUserLeave = currentUser.leave

    // table headers
    const requestTableHeader = ["ID", "Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const historyTableHeader = ["ID", "Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status" ]
    const approvalTableHeader = ["Staff", "Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const approvalHistoryTableHeader = ["Staff", "Leave Type", "Period", "No. of calendar days", "Submitted on", "Quota used", "Status", "Action" ]
    const entitlementTableHeader = ["Leave Type", "Entitlement", "Pending", "Quota used", "Available", "Note", "Bring Over to Next Year?"]
    const changeLogHeader = ["Time","Operation Type", "Changes made", "Changed by"]
    const userManagementTableHeader = ["Name","Email","Created on","Last updated on","Type","RO email","CO email","Action"]
    
    const changeLogData = [
        ["04.04.2022", "Update", ["role changed to:", " admin"] , "yunxi@mfa.sg"],
        ["01.04.2022", "Add", ["new account added"] , "yunxi@mfa.sg"],
        ["03.07.2022", "Delete", ["account X deleted"] , "yunxi@mfa.sg"],
    ]
    
    const handleEditClick = (event) => {
        // identify user's id, send user's data to update user info form
        setCurrentEditUser(event.target.id)
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
                .post(url, {userId: currentUser._id, targetLeaveHistory: targetLeaveHistory})
                .then(resp => {
                    fetchCurrentUserInfo(currentUser)
                    console.log(resp)
                    toast.success("Leave Cancelled")
                    // window.location.reload();
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
            case "pending":
                return <span className='badge badge-info py-3 text-slate-50'>{status}</span>
            case "approved":
                return <span className='badge badge-success py-3 text-slate-50'>{status}</span>
            case "cancelled":
                return <span className='badge badge-warning py-3 text-slate-50'>{status}</span>
            default:
                console.log("invalid status header provided!")
                break;
        }
    }

    const tableDataSelection = (headerType) => {
        switch (headerType) {
            case "approval":
                return (currentUser.staffLeave.filter(entry => entry.status !== "approved").length) ?
                    currentUser.staffLeave
                        .filter(entry => entry.status !== "approved")
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
                                    // id={leave._id} 
                                    // name={leave.leaveType}
                                    onClick={(e) => handleCancelClick(e)} 
                                    className="btn btn-sm px-2 rounded-md text-white mr-4">Approve
                                </button>
                                <button 
                                    // id={leave._id} 
                                    // name={leave.leaveType}
                                    onClick={(e) => handleCancelClick(e)} 
                                    className="btn btn-sm btn-error px-2 rounded-md text-white">Reject
                                </button>
                            </td>
                        </tr>
                ) : <p className='text-center w-screen mt-8'>No pending leave applications</p>
            case "approvalHistory":
                return (currentUser.staffLeave.filter(entry => entry.status === "approved").length) ?
                 currentUser.staffLeave
                    .filter(entry => entry.status === "approved")
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
                                    {(leave.status !== "cancelled") ?
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
                                    <td><Link to ="/update-user"><button id={list.email} className='btn btn-xs btn-neutral' onClick={handleEditClick}>edit</button></Link></td>
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