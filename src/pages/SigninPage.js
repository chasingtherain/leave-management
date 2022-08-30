import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
function SigninPage() {
        const navigate = useNavigate()
        // const {dispatch, googleLoading, loginWithGoogleRedirect} = useAuthContext()
        const [userEmail, setUserEmail] = useState("")
        const [userPassword, setUserPassword] = useState("")
        const [error, setError] = useState("")
        const [loginBtnLoading, setLoginBtnLoading] = useState("")
    
    
        const signInWithEmail = async () => {
            // setLoginBtnLoading("loading")
            // await signInWithEmailAndPassword(auth, userEmail, userPassword).then((userCredential) => {
            //     // Signed in 
            //     const user = userCredential.user;
            //     dispatch({type: "LOGIN", payload: user})
            //     navigate('/')
            //   })
            //   .catch((error) => {
            //     const errorCode = error.code;
            //     setError(errorCode)
            //   });
            //   setLoginBtnLoading("")
        } 
        
        return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-20 mb-12'>
                    <p className='text-slate-600 text-5xl'>LEAVE <span className="text-sky-500">PLANS</span> </p>
                    <p className='text-slate-600 text-4xl'>休 <span className="text-sky-500">划</span> </p>
                </div>
                <div className="grid h-58 card rounded-box place-items-center my-1">
                    <div className="form-control w-full max-w-xs">
                        <input type="text" placeholder="Email 邮箱" className="input input-bordered w-full max-w-xs" onChange={(event) => setUserEmail(event.target.value)}/>
                        <input type="password" placeholder="Password 密码" className="input input-bordered w-full max-w-xs my-4" onChange={(event) => setUserPassword(event.target.value)}/>
                    </div>
                    <button className={`btn btn-wide bg-black my-8 ${loginBtnLoading}`} onClick={signInWithEmail}>LOGIN 登陆</button>
                    {error && 
                        <>
                            <p className='text-red-600'>Invalid email or password.</p>
                            <p className='text-red-600'>Sign up below if you haven done so.</p>
                        </>
                    }
                </div>
            </div>
        </div>
        )
}

export default SigninPage