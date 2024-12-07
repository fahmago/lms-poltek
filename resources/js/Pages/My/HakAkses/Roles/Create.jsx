import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Create = () => {
    const { errors, permissions } = usePage().props;
    const [name, setName] = useState('');
    const [permissionsData, setPermissionsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filter untuk permissions sidebar
    const sidebarPermissions = permissions.filter(permission => permission.name.includes('sidebar'));
    
    // Filter untuk permissions lainnya
    const otherPermissions = permissions.filter(permission => !permission.name.includes('sidebar'));

    const handleCheckboxChange = (e) => {
        let data = [...permissionsData];
        if (e.target.checked) {
            data.push(e.target.value);
        } else {
            data = data.filter(permission => permission !== e.target.value);
        }
        setPermissionsData(data);
    };

    const storeRole = (e) => {
        e.preventDefault();
        setIsLoading(true);
        Inertia.post('/my/roles', {
            name: name,
            permissions: permissionsData
        }, {
            onSuccess: () => {
                setIsLoading(false);
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil tambah role!',
                    timer: 2000
                });
            },
            onError: () => {
                setIsLoading(false);
            }
        });
    };

    const resetForm = () => {
        setName('');
        setPermissionsData([]);
    };

    return (
        <>
            <Head>
                <title>Create Roles - Digitalin</title>
            </Head>
            <MyLayout>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md mt-4">
                    <div className="bg-blue-600 p-4 rounded-t-md">
                        <span className="font-bold text-white tracking-widest">
                            <i className="fa fa-shield-alt mr-2"></i> Tambah Role Baru
                        </span>
                    </div>
                    <div className="p-6">
                        <form onSubmit={storeRole}>
                            <div className="mb-4">
                                <label className="block text-base font-medium text-gray-700">Role Name</label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter Role Name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-base mt-2">{errors.name}</p>
                                )}
                            </div>

                            <hr className="my-4" />

                            {/* Bagian Permissions Sidebar */}
                            <div className="mb-4">
                                <label className="block text-base font-medium text-gray-700">Permissions Sidebar</label>
                                <div className="flex flex-col mt-2">
                                    {sidebarPermissions.map((permission, index) => (
                                        <div className="flex items-center space-x-2 w-1/2 md:w-1/3 lg:w-1/6 my-1" key={index}>
                                            <input
                                                type="checkbox"
                                                value={permission.name}
                                                onChange={handleCheckboxChange}
                                                id={`check-sidebar-${permission.id}`}
                                                className="form-checkbox h-4 text-blue-600 focus:ring-blue-500"
                                                checked={permissionsData.includes(permission.name)}
                                            />
                                            <label htmlFor={`check-sidebar-${permission.id}`} className="text-gray-700">{permission.name}</label>
                                        </div>
                                    ))}                                    
                                </div>
                                {errors.permissions && (
                                    <p className="text-red-500 text-base mt-2">{errors.permissions}</p>
                                )}
                            </div>

                            <hr className="my-4" />

                            {/* Bagian Permissions lainnya */}
                            <div className="mb-4">
                                <label className="block text-base font-medium text-gray-700">Permissions</label>
                                <div className="flex flex-wrap mt-2">
                                    {otherPermissions.map((permission, index) => (
                                        <div className="flex items-center space-x-2 w-1/2 md:w-1/3 lg:w-1/6 my-1" key={index}>
                                            <input
                                                type="checkbox"
                                                value={permission.name}
                                                onChange={handleCheckboxChange}
                                                id={`check-${permission.id}`}
                                                className="form-checkbox h-4 text-blue-600 focus:ring-blue-500"
                                                checked={permissionsData.includes(permission.name)}
                                            />
                                            <label htmlFor={`check-${permission.id}`} className="text-gray-700">{permission.name}</label>
                                        </div>
                                    ))}                                    
                                </div>
                                {errors.permissions && (
                                    <p className="text-red-500 text-base mt-2">{errors.permissions}</p>
                                )}
                            </div>

                            <div className="flex space-x-2">
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
                                {/* <ButtonReset type='button' onClick={resetForm}>
                                    <i className="fa fa-redo mr-2"></i> Reset
                                </ButtonReset> */}
                            </div>
                        </form>
                    </div>
                </div>
            </MyLayout>
        </>
    );
}

export default Create;
