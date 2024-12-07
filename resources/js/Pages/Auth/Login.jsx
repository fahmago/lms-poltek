import { Head, Link, useForm } from '@inertiajs/inertia-react';
import React from 'react';

const Login = () => {

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function handleChange(e) {
        const { id, value } = e.target;
        setData(id, value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('login.store')); 
    };

    return (
        <div className="font-poppins min-h-screen px-3 flex items-center justify-center bg-keren relative">
            <Head title="Login" />

            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md relative">
                <Link href={route('landing.index')} className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-lg text-xs font-medium bg-blue-100 text-blue-800 absolute top-0 rounded-bl-none rounded-tr-none cursor-pointer start-0 z-10">
                    <i className="fas fa-arrow-left"></i> Beranda
                </Link>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                    <p className="text-gray-600">Please login to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="text"
                            value={data.email}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full py-2 px-4 ${processing ? 'bg-gray-400' : 'bg-indigo-600'} text-white font-semibold rounded-lg hover:${processing ? 'bg-gray-400' : 'bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                        {processing ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                
            </div>
        </div>
    );
}

export default Login;
