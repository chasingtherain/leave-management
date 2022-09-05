import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMainContext } from '../hooks/useMainContext';

function SigninPage() {    
        const {baseBackEndUrl} = useMainContext()
        const navigate = useNavigate()
        const [userEmail, setUserEmail] = useState("")
        const [userPassword, setUserPassword] = useState("")
        const [error, setError] = useState("")
        const [loginBtnLoading, setLoginBtnLoading] = useState("")

        const url = `${baseBackEndUrl}/login`
        
        const validateFormAndSignIn = () => {

        }
        
        const sendSignInFormData = async () => {
            const signInData = 
            {
                email: userEmail,
                password: userPassword
            }

            const resp = await axios.post(url, signInData)
            if(resp.status === 200) {
                toast.success("Login Successful!")
                navigate('/')
            }
            else {toast.error("Incorrect email or password")}
        }

        return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-20 mb-12'>
                    <p className='text-slate-600 text-5xl'>LEAVE <span className="text-sky-500">PLANS</span> </p>
                    <p className='text-slate-600 text-4xl'>休 <span className="text-sky-500">划</span> </p>
                </div>
                <form className="grid h-58 card rounded-box place-items-center my-1" method='POST' action={url}>
                    <div className="form-control w-full max-w-xs">
                        <input type="text" placeholder="Email 邮箱" className="input input-bordered w-full max-w-xs" onChange={(event) => setUserEmail(event.target.value)}/>
                        <input type="password" placeholder="Password 密码" className="input input-bordered w-full max-w-xs my-4" onChange={(event) => setUserPassword(event.target.value)}/>
                    </div>
                    <button className={`btn btn-wide bg-black my-8 ${loginBtnLoading}`}>LOGIN 登陆</button>
                    {error && 
                        <>
                            <p className='text-red-600'>Invalid email or password.</p>
                            <p className='text-red-600'>Sign up below if you haven done so.</p>
                        </>
                    }
                </form>
            </div>
        </div>
        )
}

export default SigninPage