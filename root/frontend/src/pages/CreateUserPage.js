import React, { useState } from 'react'
import RadioSelection from '../components/layout/RadioSelection'
import { useMainContext } from '../hooks/useMainContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function CreateUserPage() {
    const {baseBackEndUrl,fetchUserList, isAdmin, setIsAdmin} = useMainContext()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [ro, setRo] = useState()
    const [reportingEmail, setReportingEmail] = useState()
    const [co, setCo] = useState()
    const [coveringEmail, setCoveringEmail] = useState()

    const navigate = useNavigate()

    const validateAndSubmitData = async (url, formData) => {
        if(
            name === undefined || name.length === 0 ||
            email === undefined || email.length === 0 ||
            password === undefined || password.length === 0 ||
            confirmPassword === undefined || confirmPassword.length === 0 ||
            ro === undefined || ro.length === 0 ||
            reportingEmail === undefined || reportingEmail.length === 0 ||
            co === undefined || co.length === 0 ||
            coveringEmail === undefined || coveringEmail.length === 0 ||
            isAdmin === undefined
        )
        return toast.error("Fill in all blanks!")
        
        // const emailExistInDb = db.collection('')

        const resp = await axios.post(url, formData)
        if(resp.status === 200) {
            fetchUserList()
            toast.success("User Created!")
            navigate('/user-management')
        }
        else {toast.error("User creation was unsuccessful")}
    }

    const sendFormData = (e) => {
        e.preventDefault()
        console.log("form data sending in progress")
        const url = `${baseBackEndUrl}/admin/create-user`
        const formData = 
        {
            name: name,
            isAdmin: isAdmin,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            createdOn: new Date(),
            lastUpdatedOn: new Date(),
            ro: ro,
            reportingEmail: reportingEmail,
            co: co,
            coveringEmail: coveringEmail
        }
        validateAndSubmitData(url, formData)
    }

    return (
        <div>
            <div className='grid place-items-center mt-8 text-slate-600 text-3xl'>Create User</div>

            <div className="grid place-items-center">
                <form className="form-control w-full max-w-xs" onSubmit={sendFormData}>
                    <label class="label text-sm">Name</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="name" onChange={(e) => setName(e.target.value)} value={name}/>
                    <label class="label text-sm">Email 邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="password" onChange={(e) => setPassword(e.target.value)} value={name}/>
                    <label class="label text-sm">Password 密码</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} value={name}/>
                    <label class="label text-sm">Confirm Password 二次确认密码</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                    <label class="label text-sm">Account Type</label>
                    <RadioSelection radioType="accountTypeRadio" id="accountType"/>
                    <label class="label text-sm">Reporting Officer 主管</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setRo(e.target.value)} value={ro}/>
                    <label class="label text-sm">Reporting Officer Email 主管邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setReportingEmail(e.target.value)} value={reportingEmail}/>
                    <label class="label text-sm">Covering Officer 代办</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setCo(e.target.value)} value={co}/>
                    <label class="label text-sm">Covering Officer Email 代办邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setCoveringEmail(e.target.value)} value={coveringEmail}/>
                    <button type="submit" className='btn mt-8 rounded-sm'>Create User</button>
                </form>
            </div>
        </div>
        )
}

export default CreateUserPage