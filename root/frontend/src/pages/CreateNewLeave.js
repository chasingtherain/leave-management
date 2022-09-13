import React, { useState } from 'react'
import Select from '../components/layout/Select'
import { useMainContext } from '../hooks/useMainContext'

function CreateNewLeave() {
    const {currentUser} = useMainContext()
    const leaveOptions = ["No", "Yes"]
    const [leaveRollOver, setLeaveRollOver] = useState("No")
    return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-8 mb-6'>
                    <p className='text-slate-600 text-3xl'>Create <span className="text-sky-500">New Leave</span> </p>
                </div>
                <div className="grid h-58 card rounded-box place-items-center my-1">
                    <div className="form-control w-full max-w-xs gap-y-0.5">
                        <label className="label text-sm">Leave Name</label>
                        <input type="text" placeholder='e.g. Childcare Leave' className="input input-bordered w-full max-w-xs"/>
                        <label className="label text-sm">Leave Entitlement</label>
                        <input type="number" placeholder='e.g. 3' className="input input-bordered w-full max-w-xs"/>
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
                            // onChange={(e) => setRemarks(e.target.value)}
                            />
                        <button type="submit" className="btn text-white text-center text-base font-semibold shadow-md rounded-lg mt-4">
                            Create
                        </button>
                    </div>
                </div>
            </div>
        </div>
        )
}

export default CreateNewLeave
