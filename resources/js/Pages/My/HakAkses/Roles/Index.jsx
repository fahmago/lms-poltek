import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import Search from '../../../../Shared/Search';
import MyLayout from '../../../../Layouts/MyLayout';
import Pagination from '../../../../Shared/Pagination';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Delete from '../../../../Shared/Delete';

const Index = () => {

    const { roles } = usePage().props;

    return (
        <>
            <Head>
                <title>eLearning - Roles</title>
            </Head>
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['roles.create']) ? 'justify-between' : 'justify-center'}`}>
                        {hasAnyPermission(['roles.create']) && (
                            <Link 
                                href={route('my.roles.create')}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-base px-10 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                type="button"
                            >
                                <i className="fa fa-plus-circle mr-2"></i> Tambah Role
                            </Link>  
                        )}                     
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/roles'} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-4 mb-4">
                    <div className="w-full">
                        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="bg-blue-700 p-4 rounded-t-md">
                                <span className="font-bold text-white tracking-widest">
                                    <i className="fa fa-shield-alt mr-2"></i> Roles
                                </span>
                            </div>
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border whitespace-nowrap text-center w-[5%]">No.</th>
                                                <th className="border whitespace-nowrap px-4 py-2 text-left w-[15%]">Role Name</th>
                                                <th className="border whitespace-nowrap px-4 py-2 text-left w-[70%]">Permissions</th>
                                                <th className="border whitespace-nowrap px-4 py-2 text-center w-[10%]">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {roles.data.map((role, index) => (
                                                <tr key={index} className='hover:bg-gray-50'>
                                                    <td className="border text-center px-4 py-2 whitespace-nowrap">{++index + (roles.current_page - 1) * roles.per_page}</td>
                                                    <td className='border px-4 py-2 whitespace-nowrap'>{role.name}</td>
                                                    <td className='border px-4 py-2 whitespace-nowrap max-w-xs'>
                                                        <div className="flex flex-wrap">
                                                            {role.permissions.map((permission, index) => (
                                                                <span className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded mr-2 my-1" key={index}>
                                                                    {permission.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="border px-4 py-2 whitespace-nowrap text-center">
                                                        {hasAnyPermission(['roles.edit']) && (
                                                            <Link 
                                                                href={`/my/roles/${role.id}/edit`} 
                                                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                                            >
                                                                <i className="fa fa-pencil-alt"></i>
                                                            </Link>
                                                        )}
                                                        {hasAnyPermission(['roles.delete']) && (
                                                            <Delete URL={'/my/roles'} id={role.id} />
                                                        )}
                                                        {!hasAnyPermission(['roles.edit', 'roles.delete']) && (
                                                            // <span className="text-sm text-gray-500">Minta Akses</span>
                                                            <span className="text-red-500 font-semibold">Minta Akses</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={roles.links} align={'end'} />
                            </div>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
}

export default Index;
