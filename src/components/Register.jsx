import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { axiosApi } from '../api/axios';
import { Link } from 'react-router-dom'
import { loadingAtom, loginAtom } from '../store/atoms/auth';
import { useRecoilState, useRecoilValue } from 'recoil';


function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isLoggedIn = useRecoilValue(loginAtom);
    const [isLoading, setLoading] = useRecoilState(loadingAtom);
    const [error, setError] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const emailErr = localStorage.getItem('status')

    function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        const type = event.target.type.value
        axiosApi.post('api/user-register/',
            {

                'full_name': fullName,
                'email': email,
                'password': password,
                'type': type

            }
        )
            .then((res) => {
                setEmail('');
                setFullName('');
                setPassword('');
                setLoading(false);

                if (res.status == 201) {
                    localStorage.setItem('emailSent','success')
                    window.location.href = `${import.meta.env.VITE_ROOT_URL}/user/login/`
                }
            })
            .catch((err) => {
                setEmail('');
                setFullName('');
                setPassword('');
                setLoading(false);
                setError(true);
                const res = err.response.data.email[0];
                console.log(res);
                if (res) {
                    setErrMsg(res);
                }
            })
    }

    if (isLoggedIn) {
        window.location.href = import.meta.env.VITE_ROOT_URL
    }

    if (isLoading) {

        return (
            <>
                <div className="min-h-[55rem] flex flex-col bg-white border shadow-sm  dark:bg-black dark:border-gray-700 dark:shadow-slate-700/[.7]  ">
                    <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
                        <div className="flex justify-center">
                            <div className="animate-spin inline-block w-16 h-16 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500" role="status" aria-label="loading">
                                <span className="sr-only  ">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )

    }



    return (
        <>
            {error ? <div>
                <div className="bg-red-200 text-center py-4 lg:px-4">
                    <span className="font-semibold mr-2 text-left flex-auto">{errMsg ? errMsg : "Inputs are not correct"}</span>
                </div>
            </div> : ""}

            {emailErr == "error" ? <div>
                <div className="bg-red-200 text-center py-4 lg:px-4">
                    <span className="font-semibold mr-2 text-left flex-auto">Account is not Activated.</span>
                </div>
            </div> : ""}

            <section className="bg-gray-50  dark:bg-gray-900">
                <div className="flex  flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className=" w-40 mr-2 " src={logo} alt="logo" />
                        
                    </a>
                    <div className="w-full  bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create and account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" onChange={(e) => setEmail(e.target.value)} value={email} />
                                </div>
                                <div>
                                    <label htmlFor="Full Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
                                    <input type="text" name="full_name" id="full_name" placeholder="Jhon Doe" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e) => setFullName(e.target.value)} value={fullName} />
                                </div>
                                <div>
                                    <label htmlFor="Password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e) => setPassword(e.target.value)} value={password} />
                                </div>


                                <div>
                                    <label htmlFor="types" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select type</label>
                                    <select id="type" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option value='CREATOR'>
                                            CREATOR
                                        </option>

                                        <option value='EDITOR'>
                                            EDITOR
                                        </option>

                                    </select>
                                </div>


                                <button type="submit" className="w-full bg-indigo-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-indigo-700 dark:focus:ring-primary-800">Create an account</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Already have an account? <Link to='/user/login' className="font-medium text-indigo-600 hover:underline dark:text-primary-500">Login here</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}


export default Register


