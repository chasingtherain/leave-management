import React, { useState } from 'react'
import Select from '../components/layout/Select'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function ApplyLeavePage() {
    const leaveOptions = [
    "Annual Vacation Leave 年假", 
    "Sick leave 病假",
    "Childcare leave 育儿假",
    "Maternity leave 产假",
    "No pay leave 无薪假",
    "Hospitalisation leave 住院假",
    ]
    // const verifyFeedback = async (e) => {
    //     e.preventDefault()
    //     // Add a new document with a generated id.
    //     const docRef = await addDoc(collection(db, "feedback"), {
    //         feedback: feedbackContent,
    //         timestamp: new Date()
    //     });
    //     console.log("Document written with ID: ", docRef.id);
    //     setFeedbackContent("")
    //     toast.success("Thank you for your feedback!")
    // }

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
  return (
    <form className="flex max-w mx-auto h-screen" onSubmit="">
        <div className="w-full px-5 py-8 shadow">
            <div className="mb-6 text-3xl text-center text-gray-800">
                Apply Leave
            </div>
            <div className="my-4">
                <label for="remarks" class="text-sm mr-4">Leave Type</label>
                <Select options={leaveOptions}/>
            </div>
            <div className="my-4 flex">
                <label for="remarks" class="text-sm mr-4">Leave Dates</label>
                <div className='flex'>
                    <div>
                        <label for="remarks" class="text-sm mr-4">Start Date</label>
                        <ReactDatePicker className='border-2 border-primary' selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <div>
                        <label for="remarks" class="text-sm mr-4">End Date</label>
                        <ReactDatePicker className='border-2 border-primary' selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-center">

            </div>

            <div className="my-4">
                <label for="remarks" class="text-sm">Remarks</label>
                <textarea id="remarks" required minLength="15" className=" w-1/3 py-2 px-4 placeholder-gray-400 rounded-lg border-2" placeholder="Reason for taking leave (optional) / 请假原因 (选填）" name="comment" rows="3" cols="40"></textarea>
                {/* <textarea required onChange={(e)=> setFeedbackContent(e.target.value)} value={feedbackContent} minLength="15" className=" w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="comment" placeholder="How can we improve and serve you better?" name="comment" rows="5" cols="40">
                </textarea> */}
            </div>

            <button type="submit" className="btn btn-primary text-white w-full text-center text-base font-semibold shadow-md rounded-lg ">
                Submit
            </button>
        </div>
    </form>

  )
}

export default ApplyLeavePage