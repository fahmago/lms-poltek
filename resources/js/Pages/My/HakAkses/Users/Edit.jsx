import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Swal from 'sweetalert2';
import { Head, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Edit = () => {
    // destruct props "errors", "roles", and "user"
    const { errors, roles, user } = usePage().props;

    // state
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [selectedRoles, setSelectedRoles] = useState(user.roles.map(role => role.name) || []);
    const [isLoading, setIsLoading] = useState(false);

    // define method "handleRoleChange" for multi-select
    const handleRoleChange = (e) => {
        const value = e.target.value;
        if (selectedRoles.includes(value)) {
            setSelectedRoles(selectedRoles.filter(role => role !== value));
        } else {
            setSelectedRoles([...selectedRoles, value]);
        }
    };

    // method "updateUser"
    const updateUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // sending data
        Inertia.put(`/my/users/${user.id}`, {
            // data
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            roles: selectedRoles  // send selected roles as an array
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil update user!',
                    timer: 2000,
                });
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    // method "resetForm"
    const resetForm = () => {
        setName(user.name || "");
        setEmail(user.email || "");
        setPassword("");
        setPasswordConfirmation("");
        setSelectedRoles(user.roles.map(role => role.name) || []);
    };

    return (
        <>
            <Head>
                <title>Edit User - Digitalin</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-700 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-users mr-2"></i> Edit Pengguna
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={updateUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Full Name"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter Email Address"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter Password"
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Password Confirmation</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={passwordConfirmation}
                                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                                            placeholder="Enter Password Confirmation"
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Roles</label>
                                    <div className="flex flex-wrap">
                                        {roles.map((role, index) => (
                                            <div key={index} className="flex items-center mr-4 mb-2">
                                                <input
                                                    id={`role-${role.id}`}
                                                    type="checkbox"
                                                    value={role.name}
                                                    checked={selectedRoles.includes(role.name)}
                                                    onChange={handleRoleChange}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <label htmlFor={`role-${role.id}`} className="ml-2 block text-sm text-gray-900">
                                                    {role.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.roles && (
                                        <p className="text-red-500 text-xs mt-1">{errors.roles}</p>
                                    )}
                                </div>
                                <div className="flex justify-start">
                                    <ButtonSave type='submit' disabled={isLoading}>                                    
                                        {isLoading ? 
                                            <>
                                                <i className="fa fa-spinner fa-spin mr-2"></i> Updating...
                                            </>
                                        : 
                                            <>
                                                <i className="fa fa-save mr-2"></i> Update
                                            </>
                                        }
                                    </ButtonSave>
                                    <button 
                                        type="button" 
                                        onClick={resetForm} 
                                        className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-8 py-2.5 text-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                        <i className="fa fa-redo mr-2"></i> Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Edit;
