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
    <form className="" onSubmit="">
        <div className="text-3xl text-center mt-8 text-gray-800">
            Apply Leave 请假
        </div>
        <div className="w-full px-5 py-8 ml-[35%]">
            <div className="my-4">
                <label for="remarks" class="text-lg font-weight-900 mr-4 label">Leave Type</label>
                <Select options={leaveOptions}/>
            </div>
            <div className="my-4">
                <label for="remarks" class="text-lg font-weight-900 mr-4 label">Leave Dates</label>
                <div className='flex'>
                    <div>
                        <label for="remarks" class="text-sm mr-4">Start Date</label>
                        <ReactDatePicker className='border-2 border-secondary active:border-primary' selected={startDate} onChange={(date) => setStartDate(date)} />
                    </div>
                    <div>
                        <label for="remarks" class="text-sm mr-4">End Date</label>
                        <ReactDatePicker className='border-2 border-secondary active:border-primary' selected={endDate} onChange={(date) => setEndDate(date)} />
                    </div>
                </div>
            </div>

            <div className="my-4">
                <label for="remarks" class="text-lg font-weight-900 mr-6 label">Remarks</label>
                <textarea id="remarks" className="w-1/3 py-2 px-4 placeholder-gray-400 rounded-lg border-2" placeholder="Reason for leave application (optional) / 请假原因 (选填）" name="comment" rows="2"></textarea>
                {/* <textarea required onChange={(e)=> setFeedbackContent(e.target.value)} value={feedbackContent} minLength="15" className=" w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="comment" placeholder="How can we improve and serve you better?" name="comment" rows="5" cols="40">
                </textarea> */}
            </div>
            <div>
                <label for="RO" class="text-lg font-weight-900 label">Supporting documents / 证明</label>
                <p className='text-xs'> MC is compulsory / 病假单必上传</p>
                <button className="btn btn-xs text-white text-center text-sm mt-2">
                    Upload
                </button>
            </div>
            <div className="my-4">
                <label for="RO" class="text-lg font-weight-900 mr-4 label">Reporting Officer</label>
                <input id="RO" type="text" disabled class="input input-bordered input-primary w-full max-w-xs" value="Shen Yun Xi"/>
            </div>
            <div className="my-4">
                <label for="CO" class="text-lg font-weight-900 mr-4 label">Covering Officer</label>
                <input id="CO" type="text" disabled class="input input-bordered input-primary w-full max-w-xs" value="He Hua"/>
            </div>
            <div class="flex items-center">
                <label class="cursor-pointer label">
                    <input type="checkbox" checked="checked" class="checkbox checkbox-secondary mr-2" />
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