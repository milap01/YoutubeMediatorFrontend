import React, {useState } from 'react';
import logo from '../assets/logo.png';
import {Link} from 'react-router-dom'
import { authLogin, loadingAtom, loginAtom, registerSuccess } from '../store/atoms/auth';
import { useRecoilState, useRecoilValue } from 'recoil';



function Login() {
    const activationStatus = localStorage.getItem('status');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isLoggedIn = useRecoilValue(loginAtom);
    const [isLoading, setLoading] = useRecoilState(loadingAtom);
    const [error, setError] = useState(false)

    function handleSubmit(event) {
        event.preventDefault();

        setLoading(true)
        const isError = authLogin(email, password);

        isError.then((res) => {
            if (res) {
                setLoading(false);
                setError(true);
                return;
            }

            setLoading(false);

            window.location.href = localStorage.getItem('path') ? localStorage.getItem('path') : import.meta.env.VITE_ROOT_URL;

        })
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

    if (isLoggedIn) {
        window.location.href = import.meta.env.VITE_ROOT_URL
    }



    return (
        <>
            {error ? <div>
                <div className="bg-red-200 text-center  text-black py-4 lg:px-4">
                    <span className="font-semibold mr-2 text-left flex-auto">Email or password is wrong</span>
                </div>
            </div> : ""}

            {activationStatus == "success" ? <div>
                <div className="bg-green-200 text-center  text-black py-4 lg:px-4">
                    <span className="font-semibold mr-2 text-left flex-auto">Account is Activated Successfully.</span>
                </div>
            </div> : ""}

            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                        <img className="w-40  mr-2" src={logo} alt="logo" />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} >
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                    <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" onChange={(e) => setEmail(e.target.value)} value={email} />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" onChange={(e) => setPassword(e.target.value)} value={password} />
                                </div>

                                <button type="submit" className="w-full bg-indigo-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-indigo-700 dark:focus:ring-primary-800">Sign in</button>
                                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                    Don’t have an account yet? <Link to='/user/register' className="font-medium text-indigo-600 hover:underline dark:text-primary-500">Sign up</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}



export default Login
