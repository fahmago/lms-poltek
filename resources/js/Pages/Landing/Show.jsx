import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React, { useState } from 'react';

export default function Show() {
  const { prodi, matkulsBySemester, auth } = usePage().props;
  const [selectedSemester, setSelectedSemester] = useState(1); // Default semester 1

  return (
    <div className="font-poppins min-h-screen bg-keren flex flex-col pb-28">
      <Head title={`Detail Prodi: ${prodi.nama_prodi}`} />

      {/* Navbar */}
      <div className="w-full p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href={route('landing.index')}
            className="text-blue-600 hover:underline mr-4"
          >
            {/* <h1 className="text-xl font-bold tracking-[3px] lg:tracking-[5px]">eLearning</h1> */}
            <img
              src={`/images/new-logo.svg`}
              alt="eLearning"
              className="w-40 h-auto -mt-2"
            />
          </Link>
          <div className="flex items-center space-x-3">
            {auth?.user ? (
              <>
                <Link
                  href={route('my.dashboard.index')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                >
                  <i className="fas fa-home"></i>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  href={route('logout')}
                  method="post"
                  as="button"
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="hidden sm:inline">Keluar</span>
                </Link>
              </>
            ) : (
              <Link
                href={route('login')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="w-full mt-14">
        <h1 className="text-xl font-bold uppercase text-center">{prodi.nama_prodi}</h1>
      </div>

      {/* Content */}
      <div className="flex-grow container mx-auto mt-8 px-4">

        {/* Semester Dropdown */}
        <div className="mb-4">
          <select
            className="p-2 border rounded"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            {Array.from({ length: 8 }, (_, i) => i + 1).map((semester) => (
              <option key={semester} value={semester}>
                Semester {semester}
              </option>
            ))}
          </select>
        </div>

        {/* Tabel Matakuliah per Semester */}
        <div className="flex flex-col mt-5">
          <div className="w-full flex flex-col md:flex-row gap-2 items-center justify-center">
            <div className="w-full">
              {/* Tabel */}
              <div className="bg-white border border-gray-200 rounded-md shadow-sm">
                <div className="bg-blue-700 p-4 rounded-t-md">
                  <span className="font-bold text-white tracking-widest">
                    <i className="fa fa-book mr-2"></i> Matakuliah
                  </span>
                </div>
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border whitespace-nowrap text-center w-[10%]">No.</th>
                          <th className="border whitespace-nowrap px-4 py-2 text-center w-[10%]">Kode Matkul</th>
                          <th className="border whitespace-nowrap px-4 py-2 text-center w-[10%]">Semester</th>
                          <th className="border whitespace-nowrap px-4 py-2 text-center w-[50%]">Nama Matkul</th>
                          <th className="border whitespace-nowrap px-4 py-2 text-center w-[10%]">SKS</th>
                          <th className="border whitespace-nowrap px-4 py-2 text-center w-[10%]">RPS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matkulsBySemester[selectedSemester] && matkulsBySemester[selectedSemester].length > 0 ? (
                          matkulsBySemester[selectedSemester].map((matkul, index) => (
                            <tr key={matkul.uuid} className="hover:bg-gray-50">
                              <td className="border text-center px-4 py-2 whitespace-nowrap">{index + 1}</td>
                              <td className="border text-center px-4 py-2 whitespace-nowrap">{matkul.kode_matkul}</td>
                              <td className="border text-center px-4 py-2 whitespace-nowrap">{matkul.semester}</td>
                              <td className="border px-4 py-2 whitespace-nowrap">{matkul.nama_matkul}</td>
                              <td className="border px-4 py-2 whitespace-nowrap text-center">{matkul.sks}</td>
                              <td className="border px-4 py-2 whitespace-nowrap text-center">
                                <a href={matkul.rps} target="_blank" rel="noopener noreferrer" className='text-blue-600'>
                                  <i className="fa fa-link"></i>
                                </a>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="text-center px-4 py-4 text-red-500">
                              Belum ada matakuliah untuk semester ini.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
