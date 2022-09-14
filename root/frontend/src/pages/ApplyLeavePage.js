import React, { useState } from 'react'
import Select from '../components/layout/Select'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RadioSelection from '../components/layout/RadioSelection';
import { useMainContext } from '../hooks/useMainContext';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ApplyLeavePage() {
    
    const {currentUser, currentLeaveSelection, fetchCurrentUserInfo, setCurrentUser, setCurrentLeaveSelection} = useMainContext()
    const leaveOptions = ["Annual Leave 年假", "Compassionate Leave 慈悲假"]
    // const [leaveOptions, setLeaveOptions] = useState(currentUser.leave.map(leave => leave.name)) //uncomment after developing

    const navigate = useNavigate()

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [startDateRadioSelection, setStartDateRadioSelection] = useState("Full Day")
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [numOfDaysApplied, setNumOfDaysApplied] = useState()

    const userSelectedLeave = currentUser.leave.filter((leaveType) => leaveType.name === currentLeaveSelection)
    const numOfSelectedLeaveEntitlement = userSelectedLeave[0].entitlement // refers to how many days a user is entitled for selected leave type

    const validateAndSubmitLeaveApplication = (e) => {
        const url = `${process.env.REACT_APP_BACKENDURL}/user/applyLeave`
        const currentDate = new Date()
        e.preventDefault()
        
        if(!currentLeaveSelection)
            return toast.error("leave type not selected")
        if(startDate === undefined || endDate === undefined)
            return toast.error("start and end date must be selected!")
        if(!startDateRadioSelection)
            return toast.error("Please select AM, PM Leave or Full Day")

        // user must have enough leave 
        if(numOfDaysApplied > numOfSelectedLeaveEntitlement)
            return toast.error("Insufficient leave!")
        
        if(!checkBoxStatus)
            return toast.error("Checkbox not checked!")
        const applyLeaveFormData = {
            userId: currentUser._id,
            startDate: startDate,
            endDate: endDate,
            dateOfApplication: currentDate.getTime(),
            userEmail:currentUser.email,
            coveringEmail: currentUser.coveringEmail,
            reportingEmail: currentUser.reportingEmail,
            remarks: remarks,
            leaveType: currentLeaveSelection,
            numOfDaysTaken: numOfDaysApplied
            // fileUpload: TBC
            // status: pending, TBC
        }
        axios
            .post(url,applyLeaveFormData)
            .then((res) =>{
                console.log(res)
                if(res.status === 200) {
                    // call user API to get most updated info
                    fetchCurrentUserInfo(currentUser)
                    setCurrentLeaveSelection("Annual Leave 年假")
                    toast.success("Leave application successful!")
                    navigate('/')
                }
            })
            .catch(err => console.log(err))
        
    }

    const handleStartDateSelection = (date) => {
        if(startDateRadioSelection !== "Full Day"){
            setEndDate(date.getTime()) // if user selects AM or PM as radio selection before date, end date will automatically be equal to start date
        }
        if(date.getTime() > endDate) {
            console.log(date.getTime(),endDate)
            setEndDate()
            setNumOfDaysApplied()
        }
        setStartDate(date.getTime())
        if (endDate) { // if end date is already selected, call date calculation function
            console.log("day calculation triggered!")
            calculateNumOfBizDays(date.getTime(), endDate)
        }
    }
    const handleEndDateSelection = (date) => {
        setEndDate(date.getTime())
        if (startDate) { // if start date is already selected, call date calculation function
            console.log("day calculation triggered!")
            calculateNumOfBizDays(startDate, date.getTime())
        }
    }

    const calculateNumOfBizDays = (start, end) => {
        if ((start === end ) && startDateRadioSelection){
            setNumOfDaysApplied(1)
        }
        else {
            const data = {
                startDate: start,
                endDate: end
            }
    
            axios
                .post(`${process.env.REACT_APP_BACKENDURL}/user/numOfDays`, data)
                .then(res => {
                    console.log(res)
                    setNumOfDaysApplied(res.data.numOfDaysApplied)
                })
                .catch(err =>{
                    console.log(err)
                })
        }
    }

    const handleRadioSelection = (e) => {
        setStartDateRadioSelection(e.target.value)
        if(e.target.value !== "Full Day"){
            setNumOfDaysApplied(0.5)
            setEndDate(startDate)
        }
        else {
            // reset start and end date when user selects full day after selecting AM/PM prior
            setStartDate()
            setEndDate()
            // hide helping text by setting days applied to 0
            setNumOfDaysApplied()
        }
    }

    const leaveTypeMessage = () => {
        if(numOfSelectedLeaveEntitlement === 0){
            return (<>
                <p className='mt-4 text-sm'>You have 0 days of: {currentLeaveSelection}</p>
                <p className='text-sm'>您已用完: {currentLeaveSelection}</p>
            </>)    
        }
        if(numOfSelectedLeaveEntitlement){
            return (<>
                <p className='mt-4 text-sm'>You have {numOfSelectedLeaveEntitlement} days of: {currentLeaveSelection}</p>
                <p className='text-sm'>您有{numOfSelectedLeaveEntitlement}天的: {currentLeaveSelection}</p>
            </>)
        }

    }


  return (
    <form className="" onSubmit={validateAndSubmitLeaveApplication}>
        <div className='grid place-items-center mt-8 mb-3'>
            <p className='text-slate-600 text-3xl'>Apply <span className="text-sky-500">Leave</span> </p>
            <p className='text-slate-600 text-3xl'>请<span className="text-sky-500">假</span> </p>
        </div>
        <div className="w-full px-5 ml-[40%]">
            <div className="my-4">
                <label htmlFor="remarks" className="text-lg font-weight-900 -ml-1 label">Leave Type</label>
                <Select options={leaveOptions}/>
                {leaveTypeMessage()}
            </div>
            <div className="my-4">
                <div className='flex'>
                    <div>
                        <label htmlFor="startDate" className="text-sm">Start Date</label>
                        <ReactDatePicker
                            dateFormat='dd MMM yyyy'
                            className='border-[1px] border-secondary w-32 h-10 rounded-sm' 
                            selected={startDate} 
                            minDate={moment().toDate()}
                            onChange={(date) => handleStartDateSelection(date)} 
                        />
                    </div>
                    <div className='mr-28'>
                        <label htmlFor="endDate" className="text-sm">End Date</label>
                        <ReactDatePicker 
                            dateFormat='dd MMM yyyy' 
                            className='border-[1px] border-secondary w-32 h-10 rounded-sm' 
                            selected={(startDateRadioSelection === "Full Day") ? endDate : startDate} 
                            readOnly= {startDateRadioSelection !== "Full Day"}
                            minDate={startDate}
                            onChange={(date) => handleEndDateSelection(date)} />
                    </div>
                </div>
                <div className='mt-4 flex gap-2' onChange={(e) => handleRadioSelection(e)}>
                    <input type="radio" id="fullDay" name="dateRangeRadio" className="radio-sm required" value="Full Day" defaultChecked/> Full Day
                    <input type="radio" id="AM" name="dateRangeRadio" className="radio-sm required" value="AM"/> AM
                    <input type="radio" id="PM" name="dateRangeRadio" className="radio-sm required" value="PM"/> PM
                </div>
                {numOfDaysApplied &&
                <>
                    <p className='text-sm mt-3'>{`You have selected ${numOfDaysApplied} day(s) of ${currentLeaveSelection}.`}</p>
                    {(numOfDaysApplied <= numOfSelectedLeaveEntitlement) && <p className='text-sm'>Balance of: {numOfSelectedLeaveEntitlement - numOfDaysApplied} day(s) for {currentLeaveSelection}</p>}
                    {(numOfDaysApplied > numOfSelectedLeaveEntitlement) && <p className='text-sm text-red-500'>Insufficient leave!</p>}
                </>
                }
            </div>

            <div className="my-4">
                <label htmlFor="remarks" className="text-lg font-weight-900 mr-6 label">Remarks</label>
                <textarea 
                    id="remarks" 
                    className="w-80 py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                    placeholder="Reason (optional) / 请假原因(选填)" 
                    name="comment" 
                    rows="3"
                    onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
            </div>
            <div>
                <label htmlFor="RO" className="text-lg font-weight-900 label -ml-1">Supporting documents / 证明</label>
                <p className='text-xs'> MC is compulsory / 病假单必上传</p>
                <button type="button" className="btn btn-xs text-white text-center text-sm mt-2">
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
                    <input type="checkbox" checked={checkBoxStatus} onClick={() => setCheckBoxStatus(!checkBoxStatus)} className="checkbox checkbox-primary mr-2" />
                </label>
                <div>   
                    <p className="label-text whitespace-pre-line mb-2">{`I declare that my covering officer has agreed\nto cover my duties during my leave period.`}</p>
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