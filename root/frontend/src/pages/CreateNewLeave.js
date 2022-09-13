import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Select from '../components/layout/Select'
import { useMainContext } from '../hooks/useMainContext'

function CreateNewLeave() {
    const {currentUser} = useMainContext()
    const leaveOptions = ["No", "Yes"]
    const [leaveName, setLeaveName] = useState()
    const [leaveEntitlement, setLeaveEntitlement] = useState()
    const [leaveRollOver, setLeaveRollOver] = useState("No")
    const [leaveNote, setLeaveNote] = useState()
    const navigate = useNavigate()

    const handleCreateClick = (e) => {
        e.preventDefault()
        if(leaveName === undefined || leaveEntitlement === undefined || leaveNote === undefined)
            return toast.error("Fill in all blanks!")

        const createLeaveFormData = {
            leaveName: leaveName,
            leaveSlug: leaveName.split(" ")[0].toLowerCase(),
            leaveEntitlement: leaveEntitlement,
            leaveRollOver: leaveRollOver,
            leaveNote: leaveNote
        }
        axios
        .post(`${process.env.FRONTENDURL}/admin/create-new-leave`, createLeaveFormData)
        .then(resp => {
            console.log(resp)
            if(resp.status === 200) toast.success("New Leave Created!")
            navigate('/')
        })
        .catch(err => {
            console.log(err)
            if(err.response.status === 400) toast.error("failed to create new leave")
            console.log(err.message, ": ", err.response.data)
        })
        console.log(createLeaveFormData)
    }
    return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-8 mb-6'>
                    <p className='text-slate-600 text-3xl'>Create <span className="text-sky-500">New Leave</span> </p>
                </div>
                <div className="grid h-58 card rounded-box place-items-center my-1">
                    <form onSubmit={handleCreateClick} className="form-control w-full max-w-xs gap-y-0.5">
                        <label className="label text-sm">Leave Name</label>
                        <input type="text" placeholder='e.g. Childcare Leave 育儿假' className="input input-bordered w-full max-w-xs" onChange={(e)=> setLeaveName(e.target.value)}/>
                        <label className="label text-sm">Leave Entitlement</label>
                        <input type="number" placeholder='e.g. 3' className="input input-bordered w-full max-w-xs" onChange={(e) => setLeaveEntitlement(e.target.value)}/>
                        <label className="label text-sm">Can leave be brought over to the next year?</label>
                        <select className="select select-secondary w-full max-w-xs" onChange={(e)=> setLeaveRollOver(e.target.value)}>
                            {leaveOptions.map(leaveName => <option>{leaveName}</option>)}
                        </select>
                        <label className="label text-sm">Note to staff about leave type</label>
                        <textarea 
                            id="note" 
                            className="w-80 py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                            placeholder="e.g. Can be taken on or after International Women's Day 可在国际妇女节当天或之后休假" 
                            name="comment" 
                            rows="5"
                            onChange={(e) => setLeaveNote(e.target.value)}
                            />
                        <button type="submit" className="btn text-white text-center text-base font-semibold shadow-md rounded-lg mt-4">
                            Create
                        </button>
                    </form>
                    <p className='mt-4 text-red-500'>Note: Input both english and chinese for Leave Name and Note to staff</p>
                </div>
            </div>
        </div>
        )
}

export default CreateNewLeave
