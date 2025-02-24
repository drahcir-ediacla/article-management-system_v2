'use client'
import { useActionState } from 'react'
import { login } from "./actions/auth";
import { IoInformationCircleSharp } from "react-icons/io5";
import Input from "./_components/Input";
import Button from "./_components/Button";

const LoginForm = () => {
    const [state, action, pending] = useActionState(login, undefined);
    const errors = (state?.errors || {}) as { userName?: string[]; password?: string[]; general?: string[] };

    return (
        <main className='flex flex-col gap-[33px] h-auto bg-white rounded-[20px] shadow-md max-w-[445px] py-[38px] px-[20px] m-auto'>
            <form className='flex flex-col gap-[33px] h-auto' action={action}>
                <div className='text-center'>
                    <h1 className='text-[32px] font-bold'>Admin Login</h1>
                    <p>Use a valid username and password to gain access.</p>
                </div>

                <div className='flex flex-col gap-[5px]'>
                    <label htmlFor="userName"><b>Username</b></label>
                    <Input id="userName" name="userName" />
                    {errors.userName?.[0] && (
                        <div className="flex gap-[2px] text-red-600">
                            <IoInformationCircleSharp className="text-xl" /> <p>{errors.userName[0]}</p>
                        </div>
                    )}
                </div>

                <div className='flex flex-col gap-[5px]'>
                    <label htmlFor="password"><b>Password</b></label>
                    <Input id="password" name="password" type="password" />
                    {errors.password && (
                        <div className="flex flex-col gap-[2px] text-red-600">
                            <div className='flex gap-[2px]'><IoInformationCircleSharp className="text-xl" /><span>Password must:</span></div>
                            <ul>
                                {errors.password.map((error, index) => (
                                    <li key={index}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* {errors.general?.[0] && (
                    <div className="flex flex-row gap-[2px] text-red-600">
                        <IoInformationCircleSharp className="text-xl" /> {errors.general[0]}
                    </div>
                )} */}

                {!pending ? (
                    <Button label="Login" type='submit' />
                ) : (
                    <button type="button" className="flex justify-center items-center text-very-light-green font-medium p-[10px] bg-navy-blue border-none rounded-md" disabled>
                        <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating…
                    </button>
                )}
            </form>
        </main>
    );
}

export default LoginForm;
