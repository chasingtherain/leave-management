import React, { useState } from 'react'
import Select from '../components/layout/Select'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RadioSelection from '../components/layout/RadioSelection';
import { useMainContext } from '../hooks/useMainContext';

function ApplyLeavePage() {
    const leaveOptions = [
    "Annual Vacation Leave 年假", 
    "Sick leave 病假",
    "Childcare leave 育儿假",
    "Maternity leave 产假",
    "No pay leave 无薪假",
    "Hospitalisation leave 住院假",
    ]
    const {baseBackEndUrl} = useMainContext()
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)

  return (
    <form className="" onSubmit="">
        <div className='grid place-items-center mt-8 mb-6'>
            <p className='text-slate-600 text-3xl'>Apple <span className="text-sky-500">Leave</span> </p>
            <p className='text-slate-600 text-3xl'>请<span className="text-sky-500">假</span> </p>
        </div>
        <div className="w-full px-5 py-8 ml-[35%]">
            <div className="my-4">
                <label for="remarks" class="text-lg font-weight-900 -ml-1 label">Leave Type</label>
                <Select options={leaveOptions}/>
            </div>
            <div className="my-4">
                <label for="remarks" class="text-lg font-weight-900 -ml-1 label">Leave Dates</label>
                <div className='flex'>
                    <div>
                        <label for="start date" class="text-sm">Start Date</label>
                        <ReactDatePicker className='border-[1px] border-primary w-2/3 h-10 rounded-sm' selected={startDate} onChange={(date) => setStartDate(date)} />
                        <RadioSelection radioType="leaveDateRadio" id="startDateRadio"/>
                    </div>
                    <div className='mx-8'>
                        <label for="remarks" class="text-sm">End Date</label>
                        <ReactDatePicker className='border-[1px] border-primary w-2/3 h-10 rounded-sm' selected={endDate} onChange={(date) => setEndDate(date)} />
                        <RadioSelection radioType="leaveDateRadio" id="endDateRadio"/>
                    </div>
                </div>
                <p className='text-sm mt-3'>You have selected X number of days of leaveType.</p>
                <p className='text-sm'>Balance of: X days for leaveType</p>
            </div>

            <div className="my-4">
                <label for="remarks" class="text-lg font-weight-900 mr-6 label">Remarks</label>
                <textarea id="remarks" className="w-1/3 py-2 px-4 placeholder-gray-400 rounded-lg border-2" placeholder="Reason for leave application (optional) / 请假原因 (选填）" name="comment" rows="2"></textarea>
                {/* <textarea required onChange={(e)=> setFeedbackContent(e.target.value)} value={feedbackContent} minLength="15" className=" w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="comment" placeholder="How can we improve and serve you better?" name="comment" rows="5" cols="40">
                </textarea> */}
            </div>
            <div>
                <label for="RO" class="text-lg font-weight-900 label -ml-1">Supporting documents / 证明</label>
                <p className='text-xs'> MC is compulsory / 病假单必上传</p>
                <button className="btn btn-xs text-white text-center text-sm mt-2">
                    Upload
                </button>
            </div>
            <div className="my-4">
                <label for="RO" class="text-lg font-weight-900 -ml-1 label">Reporting Officer</label>
                <input id="RO" type="text" disabled class="input input-bordered input-primary w-full max-w-xs" value="Shen Yun Xi"/>
            </div>
            <div className="my-4">
                <label for="CO" class="text-lg font-weight-900 -ml-1 label">Covering Officer</label>
                <input id="CO" type="text" disabled class="input input-bordered input-primary w-full max-w-xs" value="He Hua"/>
            </div>
            <div class="flex items-center">
                <label class="cursor-pointer label -ml-1">
                    <input type="checkbox" checked={checkBoxStatus} onClick={() => setCheckBoxStatus(!checkBoxStatus)} class="checkbox checkbox-secondary mr-2" />
                </label>
                <div>   
                    <p class="label-text">I declare that my covering officer has agreed to cover my duties during my leave period. </p>
                    <p class="label-text">代班人员已答应能在我休假的期间代班。</p>
                </div>

            </div>
            <button type="submit" className="btn btn-primary text-white w-1/6 text-center text-base font-semibold shadow-md rounded-lg mt-4">
                Apply / 申请
            </button>
        </div>
    </form>

  )
}

export default ApplyLeavePage