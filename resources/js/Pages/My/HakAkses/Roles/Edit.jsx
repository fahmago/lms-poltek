import { Inertia } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import MyLayout from '../../../../Layouts/MyLayout';
import ButtonSave from '../../../../Shared/ButtonSave';
import ToastNotification from '../../../../Shared/ToastNotification';

const Edit = () => {
    const { errors, role, permissions } = usePage().props;
    
    // State untuk name, permissions, dan loading status
    const [name, setName] = useState(role.name || ''); // Inisialisasi dengan nilai dari role
    const [permissionsData, setPermissionsData] = useState(role.permissions.map(p => p.name) || []); // Inisialisasi dengan permissions yang sudah ada
    const [isLoading, setIsLoading] = useState(false); // State untuk menandai loading status

    // Filter untuk permissions sidebar
    const sidebarPermissions = permissions.filter(permission => permission.name.includes('sidebar'));

    // Filter untuk permissions dengan role "dsn"
    const dosenPermissions = permissions
    .filter(
        permission =>
            (
                permission.name.includes('dsn') || 
                permission.name === 'sidebar.dosen' ||
                permission.name === 'sidebar.dosen.harian'
            ) && 
            permission.name !== 'users.dsn.excel' 
    )
    .sort((a, b) => {
        // Pastikan "sidebar." selalu di urutan awal
        if (a.name.startsWith('sidebar.') && !b.name.startsWith('sidebar.')) return -1;
        if (!a.name.startsWith('sidebar.') && b.name.startsWith('sidebar.')) return 1;
        return 0; // Urutan tetap jika keduanya sama
    });

    // Filter untuk permissions dengan role "mhs"
    const mahasiswaPermissions = permissions
    .filter(
        permission =>
            (
                permission.name.includes('mhs') || 
                permission.name === 'sidebar.mahasiswa' ||
                permission.name === 'sidebar.mh.harian' ||
                permission.name === 'sidebar.mh.profile' 
            ) && 
            permission.name !== 'dsn.mhs.view' &&
            permission.name !== 'users.mhs.excel'
    )
    .sort((a, b) => {
        // Pastikan "sidebar." selalu di urutan awal
        if (a.name.startsWith('sidebar.') && !b.name.startsWith('sidebar.')) return -1;
        if (!a.name.startsWith('sidebar.') && b.name.startsWith('sidebar.')) return 1;
        return 0; // Urutan tetap jika keduanya sama
    });

    // Filter untuk permissions lainnya (bukan sidebar & bukan dsn)
    const otherPermissions = permissions
    .filter(
        permission => 
            (
                !permission.name.includes('sidebar') && 
                !permission.name.includes('mhs') && 
                !permission.name.includes('dsn')
            ) || 
            permission.name === 'users.dsn.excel' ||
            permission.name === 'users.mhs.excel' ||
            permission.name === 'sidebar.admin' ||
            permission.name === 'sidebar.harian' ||
            permission.name === 'sidebar.akses'
    )
    .sort((a, b) => {
        const priority = ["sidebar.admin", "sidebar.harian", "sidebar.akses"];
        if (priority.includes(a.name) && !priority.includes(b.name)) return -1;
        if (!priority.includes(a.name) && priority.includes(b.name)) return 1;
        return 0; // Urutan tetap jika keduanya sama
    });

    // Fungsi untuk mengubah nilai checkbox
    const handleCheckboxChange = (e) => {
        let data = [...permissionsData];
        if (e.target.checked) {
            data.push(e.target.value);
        } else {
            data = data.filter(permission => permission !== e.target.value);
        }
        setPermissionsData(data);
    };

    // Fungsi untuk meng-update role
    const updateRole = (e) => {
        e.preventDefault();
        
        // Set loading status menjadi true sebelum mengirim permintaan
        setIsLoading(true);

        Inertia.put(`/my/roles/${role.id}`, {
            name: name,
            permissions: permissionsData
        }, {
            onSuccess: () => {
                // Set loading status menjadi false setelah permintaan selesai
                setIsLoading(false);
                
                ToastNotification({
                    icon: 'success',
                    title: 'Berhasil update role!',
                    timer: 2000,
                });
            },
            onError: () => {
                // Jika terjadi error, pastikan loading status kembali ke false
                setIsLoading(false);
            }
        });
    };

    // Fungsi untuk mereset form (kembali ke nilai awal)
    const resetForm = () => {
        setName(role.name || '');
        setPermissionsData(role.permissions.map(p => p.name) || []);
    };

    return (
        <>
            <Head title='Edit Role - Digitalin' />
            <MyLayout>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md mt-4">
                    <div className="bg-blue-600 p-4 rounded-t-md">
                        <span className="font-bold text-white tracking-widest">
                            <i className="fa fa-shield-alt mr-2"></i> Edit Role
                        </span>
                    </div>
                    <div className="p-6">
                        <form onSubmit={updateRole}>
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

                            {/* Bagian untuk permissions sidebar */}
                            <div className="mb-4">
                                <label className="block text-base font-medium text-gray-700">Permissions Sidebar</label>
                                <div className="flex flex-wrap mt-2">
                                    {sidebarPermissions.map((permission, index) => (
                                        <div className="flex items-center space-x-2 w-1/2 md:w-1/3 lg:w-1/5 my-1" key={index}>
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
                            </div>

                            <hr className="my-4" />

                            {/* Bagian Permissions Dosen */}
                            <div className="mb-4">
                                <label className="block text-base font-medium text-gray-700">Permissions Dosen</label>
                                <div className="flex flex-wrap mt-2">
                                    {dosenPermissions.map((permission, index) => (
                                        <div className="flex items-center space-x-2 w-1/2 md:w-1/3 lg:w-1/4 my-1" key={index}>
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

                            {/* Bagian Permissions Mahasiswa */}
                            <div className="mb-4">
                                <label className="block text-base font-medium text-gray-700">Permissions Mahasiswa</label>
                                <div className="flex flex-wrap mt-2">
                                    {mahasiswaPermissions.map((permission, index) => (
                                        <div className="flex items-center space-x-2 w-1/2 md:w-1/3 lg:w-1/5 my-1" key={index}>
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
                                <label className="block text-base font-medium text-gray-700">Permissions Admin</label>
                                <div className="flex flex-wrap mt-2">
                                    {otherPermissions.map((permission, index) => (
                                        <div className="flex items-center space-x-2 w-1/2 md:w-1/3 lg:w-1/5 my-1" key={index}>
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
                                            <i className="fa fa-spinner fa-spin mr-2"></i> Updating...
                                        </>
                                    : 
                                        <>
                                            <i className="fa fa-save mr-2"></i> Update
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

export default Edit;
