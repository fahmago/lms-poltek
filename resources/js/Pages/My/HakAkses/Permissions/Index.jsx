import { Head, usePage } from '@inertiajs/inertia-react';
import React from 'react';
import MyLayout from '../../../../Layouts/MyLayout';
import Search from '../../../../Shared/Search';
import Pagination from '../../../../Shared/Pagination';

const Index = () => {

    const { permissions } = usePage().props;

    return (
        <>
            <Head>
                <title>eLearning - Permissions</title>
            </Head>
            <MyLayout>
                <div className="flex flex-col mt-5">
                    <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-end">                        
                        <div className="w-full md:w-3/4 lg:w-3/6">
                            <Search URL={'/my/permissions'} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col mt-4 mb-4">
                    <div className="w-full">
                        <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                            <div className="bg-blue-700 p-4 rounded-t-md">
                                <span className="font-bold text-white tracking-widest">
                                    <i className="fa fa-key mr-2"></i> Permissions
                                </span>
                            </div>
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border text-center w-12">No.</th>
                                                <th className="border px-4 py-2 text-left whitespace-nowrap">Permission Name</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {permissions.data.map((permission, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="border px-2 py-2 text-center whitespace-nowrap w-12">
                                                        {index + 1 + (permissions.current_page - 1) * permissions.per_page}
                                                    </td>
                                                    <td className="border px-4 py-2 whitespace-nowrap">{permission.name}</td>                                                  
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={permissions.links} align={'end'} />
                            </div>
                        </div>
                    </div>
                </div>
            </MyLayout>
        </>
    );
}

export default Index;
