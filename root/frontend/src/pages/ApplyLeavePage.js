import React, { useEffect, useState } from 'react'
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

    const currentDate = new Date()

    const [leaveOptions, setLeaveOptions] = useState(currentUser.leave.map(leave => leave.name))

    const navigate = useNavigate()

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [startDateRadioSelection, setStartDateRadioSelection] = useState("Full Day")
    const [checkBoxStatus, setCheckBoxStatus] = useState(false)
    const [remarks, setRemarks] = useState("")
    const [numOfDaysApplied, setNumOfDaysApplied] = useState()
    const [currentUserAppliedDates, setCurrentUserAppliedDates] = useState(
        // filters non-cancelled, non-rejected leave dates already applied by user
        currentUser.leaveHistory
            .filter(entry => entry.status === "pending" || entry.status === "approved")
            .map(entry => +(entry.startDateUnix)))
    const [applyBtnLoading, setApplyBtnLoading] = useState("")

    const userSelectedLeave = currentUser.leave.filter((leaveType) => leaveType.name === currentLeaveSelection)

    const numOfSelectedLeave = userSelectedLeave[0].entitlement - userSelectedLeave[0].pending - userSelectedLeave[0].used// refers to how many days a user is entitled for selected leave type
    
    const validateAndSubmitLeaveApplication = (e) => {
        const url = `${process.env.REACT_APP_BACKENDURL}/user/applyLeave`
        e.preventDefault()
        setApplyBtnLoading("loading")
    
        if(!currentLeaveSelection){
            setApplyBtnLoading("")
            return toast.error("leave type not selected")
        }
        if(currentUserAppliedDates.includes(startDate)){
            setApplyBtnLoading("")
            return toast.error("You have already applied leave on this day!")
        }
        if(startDate === undefined || endDate === undefined){
            setApplyBtnLoading("")
            return toast.error("start and end date must be selected!")
        }
        if(!startDateRadioSelection){
            setApplyBtnLoading("")
            return toast.error("Please select AM, PM Leave or Full Day")
        }
        // user must have enough leave 
        if(numOfDaysApplied > numOfSelectedLeave){
            setApplyBtnLoading("")
            return toast.error("Insufficient leave!")
        }
        if(!checkBoxStatus){
            setApplyBtnLoading("")
            return toast.error("Checkbox not checked!")
        }
        const applyLeaveFormData = {
            userId: currentUser._id,
            staffName: currentUser.name,
            startDate: startDate,
            endDate: endDate,
            dateOfApplication: currentDate.getTime(),
            userEmail:currentUser.email,
            coveringEmail: currentUser.coveringEmail,
            reportingEmail: currentUser.reportingEmail,
            remarks: remarks,
            leaveType: currentLeaveSelection,
            leaveClassification: startDateRadioSelection, // am, pm or full day
            numOfDaysTaken: numOfDaysApplied,
            file: uploadedFileData
        }
        console.log("applyLeaveFormData: ", applyLeaveFormData)
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
        if(date.getTime() > endDate) {
            console.log(date.getTime(),endDate)
            setEndDate()
            setNumOfDaysApplied()
        }
        
        setStartDate(date.getTime())
        
        if(startDateRadioSelection !== "Full Day"){
           setTimeout(() => { // timeout is set because sometimes setEndDate method is called before start date is set in react
               setEndDate(date.getTime()) // if user selects AM or PM as radio selection before date, end date will automatically be equal to start date
           }, 500)
           setNumOfDaysApplied(0.5)
        }
        else{
            if (endDate) { // if end date is already selected, call date calculation function
                // console.log("day calculation triggered!")
                calculateNumOfBizDays(date.getTime(), endDate)
            }
        }
    }
    const handleEndDateSelection = (date) => {
        setEndDate(date.getTime())
        if (startDate) { // if start date is already selected, call date calculation function
            // console.log("day calculation triggered!")
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
                    // console.log(res)
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
        if(numOfSelectedLeave === 0){
            return (<>
                <p className='mt-4 text-sm'>You have 0 days of: {currentLeaveSelection}</p>
                <p className='text-sm'>您已用完: {currentLeaveSelection}</p>
            </>)    
        }
        if(numOfSelectedLeave){
            return (<>
                <p className='mt-4 text-sm'>You have {numOfSelectedLeave} days of: {currentLeaveSelection}</p>
                <p className='text-sm'>您有{numOfSelectedLeave}天的: {currentLeaveSelection}</p>
            </>)
        }

    }

    let uploadedFileData = new FormData()
    const onFileChange = (e) => {

        if(e.target.files[0]){
            uploadedFileData.append('file',e.target.files[0])
        }
        console.log(uploadedFileData)
    }

  return (
    <form className="w-full flex flex-col justify-start items-center" onSubmit={validateAndSubmitLeaveApplication}>
        <div className='grid place-items-center mt-8 mb-3'>
            <p className='text-slate-600 text-3xl'>Apply <span className="text-sky-500">Leave</span> </p>
            <p className='text-slate-600 text-3xl'>请<span className="text-sky-500">假</span> </p>
        </div>

        <div className="my-4 ml-8">
            <label htmlFor="remarks" className="text-lg font-weight-900 -ml-1 label">Leave Type</label>
            <Select options={leaveOptions}/>
            {leaveTypeMessage()}
        </div>

        <div className='flex ml-20'>
            <div className=''>
                <label htmlFor="startDate" className="text-sm">Start Date</label>
                <ReactDatePicker
                    dateFormat='dd MMM yyyy'
                    className='border-[1px] border-secondary w-28 h-10 rounded-sm' 
                    selected={startDate} 
                    minDate={moment().year(currentDate.getFullYear() - 1).dayOfYear(1)._d}
                    onChange={(date) => handleStartDateSelection(date)} 
                />
            </div>
            <div className='-ml-8'>
                <label htmlFor="endDate" className="text-sm">End Date</label>
                <ReactDatePicker 
                    dateFormat='dd MMM yyyy' 
                    className='border-[1px] border-secondary w-28 h-10 rounded-sm' 
                    selected={(startDateRadioSelection === "Full Day") ? endDate : startDate} 
                    readOnly= {startDateRadioSelection !== "Full Day"}
                    minDate={startDate}
                    onChange={(date) => handleEndDateSelection(date)} />
            </div>
        </div>
            
        <div className='mt-4 mr-8 flex gap-2' onChange={(e) => handleRadioSelection(e)}>
            <input type="radio" id="fullDay" name="dateRangeRadio" className="radio-sm required" value="Full Day" defaultChecked/> Full Day
            <input type="radio" id="AM" name="dateRangeRadio" className="radio-sm required" value="AM"/> AM
            <input type="radio" id="PM" name="dateRangeRadio" className="radio-sm required" value="PM"/> PM
        </div>
        {numOfDaysApplied &&
        <>
            <p className='text-sm mt-3'>{`You have selected / 已选： ${numOfDaysApplied} day(s) of ${currentLeaveSelection}.`}</p>
            {(numOfDaysApplied <= numOfSelectedLeave) && <p className='text-sm'>Balance of / 剩: {numOfSelectedLeave - numOfDaysApplied} day(s) of {currentLeaveSelection}</p>}
            {(numOfDaysApplied > numOfSelectedLeave) && <p className='text-sm text-red-500'>Insufficient leave!</p>}
        </>
        }


            <div className="my-4 mr-6">
                <label htmlFor="remarks" className="text-lg font-weight-900 label">Remarks</label>
                <textarea 
                    id="remarks" 
                    className="py-2 px-4 placeholder-gray-400 rounded-lg border-2" 
                    placeholder="Reason (optional) / 请假原因(选填)" 
                    name="comment" 
                    rows="2"
                    onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
            </div>
            <div className='ml-12'>
                <label htmlFor="upload" className="text-lg font-weight-900 label -ml-1">Supporting documents / 证明</label>
                <p className='text-xs'> MC is compulsory / 病假单必上传</p>
                <input 
                    id='file'
                    name="file"
                    type="file" 
                    className="text-center text-sm mt-2"
                    onChange={onFileChange}
                />
            </div>
            <div className="my-4">
                <label htmlFor="reportingEmail" className="text-lg font-weight-900 -ml-1 label">RO email 主管邮件</label>
                <input 
                    id="reportingEmail" 
                    type="text" 
                    disabled 
                    className="input input-bordered input-primary w-full max-w-xs" 
                    style={{ width:"250px" }} 
                    value={currentUser.reportingEmail}/>
            </div>
            <div className="my-4">
                <label htmlFor="coveringEmail" className="text-lg font-weight-900 -ml-1 label">CO email 代办邮件</label>
                <input 
                    id="coveringEmail" 
                    type="text" 
                    disabled 
                    className="input input-bordered input-primary w-full max-w-xs"
                    style={{ width:"250px" }} 
                    value={currentUser.coveringEmail}/>
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
            <button type="submit" className={`btn text-white mt-8 px-28 text-center text-base font-semibold shadow-md rounded-lg mt-4 ${applyBtnLoading}`}>
                Apply / 申请
            </button>
    </form>

  )
}

export default ApplyLeavePage