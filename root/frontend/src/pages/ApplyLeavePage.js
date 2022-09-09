import React, { useState } from 'react'
import Select from '../components/layout/Select'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RadioSelection from '../components/layout/RadioSelection';
import { useMainContext } from '../hooks/useMainContext';
import moment from 'moment';
import { toast } from 'react-toastify';

function ApplyLeavePage() {
    const leaveOptions = ["Annual Leave 年假", "Compassionate Leave 慈悲假"]

    const {baseBackEndUrl, currentUser, currentLeaveSelection} = useMainContext()
    // const [leaveOptions, setLeaveOptions] = useState(currentUser.leave.map(leave => leave.name)) //uncomment after developing
    const date = new Date()
    const [startDate, setStartDate] = useState(date.getTime())
    const [startDateRadioSelection, setStartDateRadioSelection] = useState("Full Day")
    const [endDate, setEndDate] = useState(date.getTime())
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)
    const [remarks, setRemarks] = useState("")

    const userSelectedLeave = currentUser.leave.filter((leaveType) => leaveType.name === currentLeaveSelection)
    const numOfSelectedLeave = userSelectedLeave[0].entitlement
    // var diff = moment('2017-05-15', 'YYYY-MM-DD').businessDiff(moment('2017-05-08', 'YYYY-MM-DD'));
    // console.log(diff)

    // console.log(moment().weekdayCalc('1 Jan 2015','31 Dec 2015',[1,2,3,4,5]))
    // const calculateNumOfLeaveTaken = () => {
    //     if(startDate === endDate) {
    //         if (startDateRadioSelection === "Full Day" || endDateRadioSelection === "Full Day")
    //             console.log(1)
    //     }
    //     else {
    //         console.log(((endDate-startDate)/ 1000 / 86399) + 1)
    //     }
    // }
    // calculateNumOfLeaveTaken()
    // console.log(parseInt((startDate.getTime() / 1000).toFixed(0)))
    // console.log(((endDate.getTime() / 1000) - (startDate.getTime() / 1000) + 1)/86400)

    const validateAndSubmitLeaveApplication = (e) => {
        e.preventDefault()
        if(currentLeaveSelection)
            toast.error("leave type not selected")
        if(!checkBoxStatus)
            toast.error("Checkbox not checked!")
        if(!startDateRadioSelection)
            toast.error("Please select AM, PM Leave or Full Day")
        const numOfSelectedLeave = currentUser.leave.filter((leaveType) => leaveType.name === currentLeaveSelection)
        console.log(numOfSelectedLeave)
        // user must have enough leave 

        const formData = {
            userId: currentUser._id,
            userEmail:currentUser.email,
            coveringEmail: currentUser.coveringEmail,
            reportingEmail: currentUser.reportingEmail,
            remarks: remarks,
            leaveType: currentLeaveSelection,
            numOfDaysTaken: 1
        }
    }

    const enable = false

  return (
    <form className="" onSubmit={validateAndSubmitLeaveApplication}>
        <div className='grid place-items-center mt-8 mb-6'>
            <p className='text-slate-600 text-3xl'>Apple <span className="text-sky-500">Leave</span> </p>
            <p className='text-slate-600 text-3xl'>请<span className="text-sky-500">假</span> </p>
        </div>
        <div className="w-full px-5 py-8 ml-[35%]">
            <div className="my-4">
                <label htmlFor="remarks" className="text-lg font-weight-900 -ml-1 label">Leave Type</label>
                <Select options={leaveOptions}/>
                {numOfSelectedLeave && <p className='mt-4'>You have {numOfSelectedLeave} days of: {currentLeaveSelection}</p>}
                {numOfSelectedLeave && <p>您有{numOfSelectedLeave}天的: {currentLeaveSelection}</p>}
            </div>
            <div className="my-4">
                <label htmlFor="remarks" className="text-lg font-weight-900 -ml-1 label">Leave Dates</label>
                <div className='flex w-1/3'>
                    <div>
                        <label htmlFor="startDate" className="text-sm">Start Date</label>
                        <ReactDatePicker 
                            className='border-[1px] border-primary w-48 h-10 rounded-sm' 
                            selected={startDate} 
                            minDate={moment().toDate()}
                            onChange={(date) => setStartDate(date)} 
                        />
                        <div className='mt-2 flex gap-1 justify-start' onChange={(e) => setStartDateRadioSelection(e.target.value)}>
                            <input type="radio" id="fullDay" name="dateRangeRadio" className="radio-sm required" value="Full Day" defaultChecked/> Full Day
                            <input type="radio" id="AM" name="dateRangeRadio" className="radio-sm required" value="AM"/> AM
                            <input type="radio" id="PM" name="dateRangeRadio" className="radio-sm required" value="PM"/> PM
                        </div>
                    </div>
                    <div className='mr-28'>
                        <label htmlFor="endDate" className="text-sm">End Date</label>
                        <ReactDatePicker 
                            className='border-[1px] border-primary w-48 h-10 rounded-sm' 
                            selected={(startDateRadioSelection === "Full Day") ? endDate : startDate} 
                            readOnly= {startDateRadioSelection !== "Full Day"}
                            minDate={moment().toDate()}
                            onChange={(date) => setEndDate(date)} />
                    </div>
                </div>
                <p className='text-sm mt-3'>{`You have selected X days of ${currentLeaveSelection}.`}</p>
                <p className='text-sm'>Balance of: X days for leaveType</p>
            </div>

            <div className="my-4">
                <label htmlFor="remarks" className="text-lg font-weight-900 mr-6 label">Remarks</label>
                <textarea 
                    id="remarks" 
                    className="w-1/3 py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                    placeholder="Reason for leave application (optional) / 请假原因 (选填）" 
                    name="comment" 
                    rows="2"
                    onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                {/* <textarea required onChange={(e)=> setFeedbackContent(e.target.value)} value={feedbackContent} minLength="15" className=" w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="comment" placeholder="How can we improve and serve you better?" name="comment" rows="5" cols="40">
                </textarea> */}
            </div>
            <div>
                <label htmlFor="RO" className="text-lg font-weight-900 label -ml-1">Supporting documents / 证明</label>
                <p className='text-xs'> MC is compulsory / 病假单必上传</p>
                <button className="btn btn-xs text-white text-center text-sm mt-2">
                    Upload
                </button>
            </div>
            <div className="my-4">
                <label htmlFor="reportingEmail" className="text-lg font-weight-900 -ml-1 label">RO email 主管邮件</label>
                <input id="reportingEmail" type="text" disabled className="input input-bordered input-primary w-full max-w-xs" value={currentUser.reportingEmail}/>
            </div>
            <div className="my-4">
                <label htmlFor="coveringEmail" className="text-lg font-weight-900 -ml-1 label">CO email 代办邮件</label>
                <input id="coveringEmail" type="text" disabled className="input input-bordered input-primary w-full max-w-xs" value={currentUser.coveringEmail}/>
            </div>
            <div className="flex items-center">
                <label className="cursor-pointer label -ml-1">
                    <input type="checkbox" checked={checkBoxStatus} onClick={() => setCheckBoxStatus(!checkBoxStatus)} className="checkbox checkbox-secondary mr-2" />
                </label>
                <div>   
                    <p className="label-text">I declare that my covering officer has agreed to cover my duties during my leave period. </p>
                    <p className="label-text">代办已答应在我休假的期间代班。</p>
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