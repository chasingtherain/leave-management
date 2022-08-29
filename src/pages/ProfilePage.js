import React from 'react'
import { Link } from 'react-router-dom'

function ProfilePage() {
    return (
        <div>
            <div className="flex flex-col w-full border-opacity-50">
                <div className='grid place-items-center mt-10 mb-8'>
                    <p className='text-slate-600 text-3xl'>Profile <span className="text-sky-500">Page</span> </p>
                    <p className='text-slate-600 text-3xl'>个人 <span className="text-sky-500">信息</span> </p>
                </div>
                <div className="grid h-58 card rounded-box place-items-center my-1">
                    <div className="form-control w-full max-w-xs">
                        <label class="label text-sm">Email address 邮箱地址</label>
                        <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                        <label class="label text-sm">Role 角色</label>
                        <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                        <label class="label text-sm">Reporting Officer 主管</label>
                        <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                        <label class="label text-sm">Reporting Officer Email 主管邮箱地址</label>
                        <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                        <label class="label text-sm">Covering Officer 代办</label>
                        <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                        <label class="label text-sm">Covering Officer Email 代办邮箱地址</label>
                        <input type="text" className="input input-bordered w-full max-w-xs" value=""/>
                    </div>
                </div>
            </div>
        </div>
        )
}

export default ProfilePage