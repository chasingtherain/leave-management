import React from 'react'

function UpdateUserInfoPage() {
  return (
    <form className="" onSubmit="">
        <p className='text-slate-600 text-3xl ml-[45%] mt-4'>Update <span className="text-sky-500">User Info</span> </p>
        <div className="w-full px-5 ml-[40%]">
            <div className="">
                <label htmlFor="name" className="text-sm font-weight-900 -ml-1 label">Name</label>
                <input id="name" type="text" disabled className="input input-bordered input-primary w-full max-w-xs" value="Yan Fang"/>
            </div>
            <div className="">
                <label htmlFor="email" className="text-sm font-weight-900 -ml-1 label">Email</label>
                <input id="email" type="email" disabled className="input input-bordered input-primary w-full max-w-xs" value="yanfang@163.com"/>
            </div>
            <div className="">
                <label htmlFor="RO" className="text-sm font-weight-900 -ml-1 label">RO</label>
                <input id="RO" type="text" className="input input-bordered input-primary w-full max-w-xs" value="Shen Yun Xi"/>
            </div>
            <div className="">
                <label htmlFor="RO-email" className="text-sm font-weight-900 -ml-1 label">RO email</label>
                <input id="RO-email" type="text" className="input input-bordered input-primary w-full max-w-xs" value="yunxi@mfa.sg"/>
            </div>
            <div className="">
                <label htmlFor="CO" className="text-sm font-weight-900 -ml-1 label">CO</label>
                <input id="CO" type="text" className="input input-bordered input-primary w-full max-w-xs" value="Huangxi"/>
            </div>
            <div className="">
                <label htmlFor="CO-email" className="text-sm font-weight-900 -ml-1 label">CO email</label>
                <input id="CO-email" type="text" className="input input-bordered input-primary w-full max-w-xs" value="huangxi@163.com"/>
            </div>
            <button type="submit" className="btn btn-primary text-white w-1/6 text-center text-base font-semibold shadow-md rounded-lg mt-6 ml-10">
                Update
            </button>
        </div>
    </form>
  )
}

export default UpdateUserInfoPage