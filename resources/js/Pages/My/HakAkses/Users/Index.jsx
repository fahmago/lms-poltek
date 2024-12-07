import React from 'react';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import MyLayout from '../../../../Layouts/MyLayout';
import hasAnyPermission from '../../../../Utilities/Permissions';
import Search from '../../../../Shared/Search';
import Pagination from '../../../../Shared/Pagination';
import Delete from '../../../../Shared/Delete';

const Index = () => {
    // destruct props "users"
    const { users } = usePage().props;

    return (
        <>
            <Head title='eLearning - Kelola Pengguna' />
            <MyLayout>
                {/* <h1 className='text-2xl'>Kelola Users</h1> */}
                <div className="flex flex-col mt-5">
                    <div className={`w-full flex flex-col md:flex-row gap-2 items-center ${hasAnyPermission(['users.create', 'users.import.excel']) ? 'justify-between' : 'justify-center'}`}>
                        <div className="mb-3 md:mb-0 lg:mb-0">
                            {hasAnyPermission(['users.create']) && (
                                <Link href={route('my.users.create')}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-normal rounded-lg text-base px-6 py-3 me-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    type="button">
                                    <i className="fa fa-plus-circle mr-2"></i>
                                    Pengguna
                                </Link>
                            )}
                            {hasAnyPermission(['users.mhs.excel']) && (
                                <Link href={route('my.users.mhs.excel')}
                                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-normal rounded-lg text-base px-6 py-3 me-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                                    type="button">
                                    <i className="fa fa-file-excel mr-2"></i>
                                    Mahasiswa
                                </Link>
                            )}
                            {hasAnyPermission(['users.dsn.excel']) && (
                                <Link href={route('my.users.dsn.excel')}
                                    className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-normal rounded-lg text-base px-6 py-3 me-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
                                    type="button">
                                    <i className="fa fa-file-excel mr-2"></i>
                                    Pengajar
                                </Link>
                            )}
                        </div>
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/users'} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-4 mb-4">
                    <div className="w-full">
                        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="bg-blue-700 p-4 rounded-t-md">
                                <span className="font-bold text-white tracking-widest">
                                    <i className="fa fa-users mr-2"></i> Kelola Pengguna
                                </span>
                            </div>
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <table className="table-auto w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border px-4 py-2 whitespace-nowrap text-center">No.</th>
                                                <th className="border px-4 py-2 text-left whitespace-nowrap">Nama Lengkap</th>
                                                <th className="border px-4 py-2 text-left whitespace-nowrap">Alamat Email</th>
                                                <th className="border px-4 py-2 text-left whitespace-nowrap">Role</th>
                                                <th className="border px-4 py-2 text-center whitespace-nowrap">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.map((user, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="border px-4 py-2 text-center whitespace-nowrap">
                                                        {index + 1 + (users.current_page - 1) * users.per_page}
                                                    </td>
                                                    <td className="border px-4 py-2 whitespace-nowrap">{user.name}</td>
                                                    <td className="border px-4 py-2 whitespace-nowrap">{user.email}</td>
                                                    <td className="border px-4 py-2 whitespace-nowrap">
                                                        {user.roles.map((role, index) => (
                                                            <span
                                                                className="inline-block bg-blue-500 text-white text-sm px-2 py-1 rounded mr-2 my-1"
                                                                key={index}>
                                                                {role.name}
                                                            </span>
                                                        ))}
                                                    </td>
                                                    <td className="border px-4 py-2 text-center whitespace-nowrap">
                                                        {hasAnyPermission(['users.edit']) && (
                                                            <Link
                                                                href={`/my/users/${user.id}/edit`}
                                                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                                                <i className="fa fa-pencil-alt"></i>
                                                            </Link>
                                                        )}
                                                        {hasAnyPermission(['users.delete']) && (
                                                            <Delete URL={'/my/users'} id={user.id} />
                                                        )}
                                                        {!hasAnyPermission(['users.edit', 'users.delete']) && (
                                                            // <span className="text-sm text-gray-500">Minta Akses</span>
                                                            <span className="text-red-500 font-semibold">Minta Akses</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={users.links} align={'end'} />
                            </div>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
}

export default Index;
