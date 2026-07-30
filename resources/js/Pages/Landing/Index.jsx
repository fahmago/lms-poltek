import { Head, Link, usePage } from '@inertiajs/inertia-react';
import React from 'react';

export default function Index() {
  const { prodis, auth } = usePage().props;

  return (
    <div className="font-poppins min-h-screen bg-keren flex flex-col">
      <Head title="eLearning" />

      {/* Header */}
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
          {/* <div>
            {auth?.user ? (
              <>
                <Link
                  href={route('my.dashboard.index')}
                  className="text-blue-600 hover:underline mr-4"
                >
                  Dashboard
                </Link>
                <Link
                  href={route('logout')}
                  className="text-blue-600 hover:underline"
                  method="post"
                  as="button"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link
                href={route('login')}
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            )}
          </div> */}
          <div className="flex items-center space-x-3">
            {auth?.user ? (
              <>
                <Link
                  href={route('my.dashboard.index')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                >
                  <i className="fas fa-home"></i>
                  {/* <span>Dashboard</span> */}
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

      {/* Content */}
      <div className="flex-grow container mx-auto mt-8 px-4 flex justify-between items-center">
        <div className="w-full mb-10">
          <h1 className="text-3xl font-bold text-center mb-6">Program Studi</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {prodis.map((prodi) => (
              <Link href={route('landing.show.matkul.prodi', prodi.kode_prodi)} key={prodi.id}>
                <div
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={`/images/prodis/${prodi.kode_prodi}.webp`}
                    alt={prodi.nama_prodi}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 text-center">
                    <h2 className="text-lg font-semibold">{prodi.nama_prodi}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
