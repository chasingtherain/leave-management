import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useMainContext } from '../hooks/useMainContext';

function LoginPage() {    
        const {setCurrentUser, validateEmail} = useMainContext()
        const navigate = useNavigate()
        const [userEmail, setUserEmail] = useState("")
        const [userPassword, setUserPassword] = useState("")
        const [error, setError] = useState("")
        const [loginBtnLoading, setLoginBtnLoading] = useState("")

        const url = `${process.env.REACT_APP_BACKENDURL}/login`
        
        const validateFormAndSignIn = (e) => {
            e.preventDefault()
            if(
                userEmail === undefined || userEmail.length === 0 ||
                userPassword === undefined || userPassword.length === 0
            )
                return toast.error("Fill in all blanks!")

            if(!validateEmail(userEmail)){
                return toast.error("Invalid email!")
            }
            const signInData = 
            {
                email: userEmail,
                password: userPassword
            }
            axios
                .post(url, signInData)
                .then(resp => {
                    if(resp.status === 200) toast.success("Login Successful!")
                    setCurrentUser(resp.data)
                    navigate('/')
                    console.log(resp)
                })
                .catch(err => {
                    console.log(err)
                    if(err.response.status === 400) toast.error("email is not registered!")
                    if(err.response.status === 401) toast.error("Incorrect email or password")
                    console.log(err.message, ": ", err.response.data)
                })
        }
        

        return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-20 mb-12'>
                    <p className='text-slate-600 text-5xl'>LEAVE <span className="text-sky-500">PLANS</span> </p>
                    <p className='text-slate-600 text-4xl'>休 <span className="text-sky-500">划</span> </p>
                </div>
                <form className="grid h-58 card rounded-box place-items-center my-1" onSubmit={validateFormAndSignIn}>
                    <div className="form-control w-full max-w-xs">
                        <input type="text" placeholder="Email 邮箱" className="input input-bordered w-full max-w-xs" onChange={(event) => setUserEmail(event.target.value)}/>
                        <input type="password" placeholder="Password 密码" className="input input-bordered w-full max-w-xs my-4" onChange={(event) => setUserPassword(event.target.value)}/>
                    </div>
                    <button type='submit' className={`btn btn-wide bg-black my-8 ${loginBtnLoading}`}>LOGIN 登陆</button>
                    {error && 
                        <>
                            <p className='text-red-600'>Invalid email or password.</p>
                        </>
                    }
                    <Link to="/change-password">
                        <span className='underline text-slate-400'>Forgot password / 忘了密码</span>
                    </Link>
                </form>
            </div>
        </div>
        )
}

export default LoginPage