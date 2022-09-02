import React, { useState } from 'react'
import RadioSelection from '../components/layout/RadioSelection'
import Select from '../components/layout/Select'
import { useMainContext } from '../hooks/useMainContext'
import axios from 'axios';

function CreateUserPage() {
    const {baseBackEndUrl, isAdmin} = useMainContext()
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [ro, setRo] = useState()
    const [reportingEmail, setReportingEmail] = useState()
    const [co, setCo] = useState()
    const [coveringEmail, setCoveringEmail] = useState()

    const sendFormData = async (e) => {
        e.preventDefault()
        console.log("form data sending in progress")
        const url = `${baseBackEndUrl}/admin/create-user`
        let adminChecker = (isAdmin === "admin") ? true : false
        const formData = 
        {
            name: name,
            isAdmin: adminChecker,
            email: email,
            createdOn: new Date(),
            lastUpdatedOn: new Date(),
            ro: ro,
            reportingEmail: reportingEmail,
            co: co,
            coveringEmail: coveringEmail,
            isActive: true
        }
        console.log(formData)
        const resp = await axios.post(url, formData)
        console.log(formData, resp)
        // axios
        //     .post(url, formData)
        //     .then(res => console.log(res))
        //     .catch(err => console.log(err))
    }

    return (
        <div>
            <div className='grid place-items-center mt-2 text-slate-600 text-3xl'>Create User</div>

            <div className="grid place-items-center">
                <form className="form-control w-full max-w-xs" onSubmit={sendFormData}>
                    <label class="label text-sm">Name</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="name" onChange={(e) => setName(e.target.value)}/>
                    <label class="label text-sm">Email 邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="email" onChange={(e) => setEmail(e.target.value)}/>
                    <label class="label text-sm">Account Type</label>
                    <RadioSelection radioType="accountTypeRadio" id="accountType"/>
                    <label class="label text-sm">Reporting Officer 主管</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setRo(e.target.value)}/>
                    <label class="label text-sm">Reporting Officer Email 主管邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setReportingEmail(e.target.value)}/>
                    <label class="label text-sm">Covering Officer 代办</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setCo(e.target.value)}/>
                    <label class="label text-sm">Covering Officer Email 代办邮箱</label>
                    <input type="text" className="input input-bordered w-full max-w-xs" name="" onChange={(e) => setCoveringEmail(e.target.value)}/>
                    <button type="submit" className='btn mt-4'>Create User</button>
                </form>
            </div>
        </div>
        )
}

export default CreateUserPage