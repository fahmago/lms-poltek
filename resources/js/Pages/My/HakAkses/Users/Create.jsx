import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Create = () => {
    // destruct props "errors" & "roles"
    const { errors, roles } = usePage().props;

    // state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [selectedRole, setSelectedRole] = useState([]); // Change to an array
    const [isLoading, setIsLoading] = useState(false);

    // method to handle role selection
    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        if (selectedRole.includes(value)) {
            setSelectedRole(selectedRole.filter((role) => role !== value)); // remove if already selected
        } else {
            setSelectedRole([...selectedRole, value]); // add if not selected
        }
    };

    // method "storeUser"
    const storeUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        Inertia.post('/my/users', {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            role: selectedRole // send multiple roles as an array
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil tambah user!',
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
        setName("");
        setEmail("");
        setPassword("");
        setPasswordConfirmation("");
        setSelectedRole([]); // Reset role selection
    };

    return (
        <>
            <Head>
                <title>eLearning - Tambah Pengguna</title>
            </Head>
            <MyLayout>
                <div className="mt-4">
                    <div className="bg-white shadow-sm rounded-md">
                        <div className="bg-blue-600 p-4 rounded-t-md">
                            <span className="font-bold text-white tracking-widest">
                                <i className="fa fa-users mr-2"></i> Tambah Pengguna Baru
                            </span>
                        </div>
                        <div className="p-6">
                            <form onSubmit={storeUser}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Full Name"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-base mt-1">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Email Address</label>
                                        <input
                                            type="email"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter Email Address"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-base mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Password</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter Password"
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-base mt-1">{errors.password}</p>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-base font-medium text-gray-700">Password Confirmation</label>
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
                                    <label className="block text-base font-medium text-gray-700">Roles</label>
                                    <div className="flex flex-wrap">
                                        {roles.map((role, index) => (
                                            <div key={index} className="flex items-center mr-4 mb-2">
                                                <input
                                                    id={`role-${role.id}`}
                                                    type="checkbox"
                                                    value={role.name}
                                                    checked={selectedRole.includes(role.name)}
                                                    onChange={handleCheckboxChange}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <label htmlFor={`role-${role.id}`} className="ml-2 block text-base text-gray-900">
                                                    {role.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.role && (
                                        <p className="text-red-500 text-base mt-1 mb-">{errors.role}</p>
                                    )}
                                </div>
                                <div className="flex justify-start">
                                    <ButtonSave type='submit' disabled={isLoading}>                                    
                                        {isLoading ? 
                                            <>
                                                <i className="fa fa-spinner fa-spin mr-2"></i> Saving...
                                            </>
                                        : 
                                            <>
                                                <i className="fa fa-save mr-2"></i> Save
                                            </>
                                        }
                                    </ButtonSave>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
};

export default Create;
