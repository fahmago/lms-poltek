import React from 'react';
import { Link, usePage } from '@inertiajs/inertia-react';
import '../../../css/custom.css';
import HakAkses from './Menu/HakAkses';
import hasAnyPermission from '../../Utilities/Permissions';
import SidebarLink from './Menu/Link/SidebarLink';
import Mahasiswa from './Menu/Mahasiswa';
import Dosen from './Menu/Dosen';
import Admin from './Menu/Admin';
import DataHarian from './Menu/DataHarian';
import { Inertia } from '@inertiajs/inertia';
import DosenHarian from './Menu/DosenHarian';
import MahasiswaHarian from './Menu/MahasiswaHarian';
import MahasiswaProfile from './Menu/MahasiswaProfile';
import DataPekanan from './Menu/DataPekanan';
import DataSklMahasiswa from './Menu/DataSklMahasiswa';
import MahasiswaPunyaSKL from './Menu/MahasiswaPunyaSKL';
import DosenMonitoringSklMahasiswa from './Menu/DosenMonitoringSklMahasiswa';
import ToastNotification from '../../Shared/ToastNotification';
import AdminKelolaIbadah from './Menu/AdminKelolaIbadah';

const MySidebar = ({ activeMenu, setActiveMenu, sideOpen }) => {

  const { url } = usePage();

  const handleLogout = (e) => {
    e.preventDefault();
    // Inertia.post(route('logout')); 
    Inertia.post(route('logout'), {}, {
      onSuccess: () => {
        ToastNotification({
          icon: 'success',
          title: 'Berhasil logout!',
        });
      },
      onError: (error) => {
        ToastNotification({
          icon: 'error',
          title: 'Gagal logout!',
        });
      }
    });
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-10 w-64 bg-white shadow-lg h-full transition-transform transform ${sideOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static overflow-y-auto hide-scrollbar`}
    >
      <div className="flex flex-col h-full">
        <nav className="flex-grow p-4">
          <ul className="space-y-3">

            {/* Section */}
            <li>
              <div className="px-3 lg:mt-[-54px] pt-10 font-bold mt-[8px]"></div>
            </li>

            {hasAnyPermission(['sidebar.dashboard']) && (
              <SidebarLink
                href={route('my.dashboard.index')}
                onClick={() => setActiveMenu('my/dashboard')}
                icon="fas fa-home"
                label="Dashboard"
                active={url.includes('my/dashboard')}
              />
            )}

            {hasAnyPermission(['sidebar.grafik']) && (
              <SidebarLink
                href={route('my.grafik.index')}
                onClick={() => setActiveMenu('my/grafik')}
                icon="fas fa-chart-simple"
                label="Grafik Kehadiran"
                active={url.includes('my/grafik')}
              />
            )}

            {hasAnyPermission(['sidebar.grafik.kelas_harian']) && (
              <SidebarLink
                href={route('my.grafik.kelas_harian.index')}
                onClick={() => setActiveMenu('my/statistik/kelas-harian')}
                icon="fas fa-chart-simple"
                label="Grafik Kelas Harian"
                active={url.includes('my/statistik/kelas-harian')}
              />
            )}

            {hasAnyPermission(['sidebar.grafik.skl']) && (
              <SidebarLink
                href={route('my.grafik.skl.index')}
                onClick={() => setActiveMenu('my/chart/skl')}
                icon="fa fa-chart-simple"
                label="Grafik SKL"
                active={url.includes('my/chart/skl')}
              />
            )}

            {hasAnyPermission(['sidebar.grafik.ibadah']) && (
              <SidebarLink
                href={route('my.grafik.laporan_ibadah.index')}
                onClick={() => setActiveMenu('my/statistik/laporan-ibadah')}
                icon="fa fa-chart-simple"
                label="Grafik Ibadah"
                active={url.includes('my/statistik/laporan-ibadah')}
              />
            )}

            {/* SIDEBAR ADMIN KELOLA IBADAH MAHASISWA */}
            {hasAnyPermission(['sidebar.admin.kelolah.ibadah']) && (
              <AdminKelolaIbadah activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* Data Harian Section */}
            {hasAnyPermission(['sidebar.harian']) && (
              <DataHarian activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}
            
            {/* SIDEBAR ADMIN DATA SKL MAHASISWA */}
            {hasAnyPermission(['sidebar.skl']) && (
              <DataSklMahasiswa activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}
                        
            {/* Admin Section */}
            {hasAnyPermission(['sidebar.admin']) && (
              <Admin activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}
            
            {/* Data Pekanan */}
            {hasAnyPermission(['sidebar.pekanan']) && (
              <DataPekanan activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* Dosen Section */}
            {hasAnyPermission(['sidebar.dosen']) && (
              <Dosen activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* Dosen Data Harian Section */}
            {hasAnyPermission(['sidebar.dosen.harian']) && (
              <DosenHarian activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* DOSEN ATUR SKL MAHASISWA */}
            {hasAnyPermission(['sidebar.dosen.skl']) && (
              <DosenMonitoringSklMahasiswa activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* Mahasiswa Section */}
            {hasAnyPermission(['sidebar.mahasiswa']) && (
              <Mahasiswa activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {hasAnyPermission(['sidebar.mh.harian']) && (
              <MahasiswaHarian activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* SIDEBAR MAHASISWA PUNYA SKL */}
            {hasAnyPermission(['sidebar.mh.skl']) && (
              <MahasiswaPunyaSKL activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {hasAnyPermission(['sidebar.mh.profile']) && (
              <MahasiswaProfile activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            {/* Hak Akses Section */}
            {hasAnyPermission(['sidebar.akses']) && (
              <HakAkses activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
            )}

            <li>
              <div className="px-3 pt-2 text-xs font-bold text-blue-600 uppercase">Pengaturan</div>
            </li>

            <SidebarLink
              href={route('my.pw.index')}
              onClick={() => setActiveMenu('my/ganti/password')}
              icon="fas fa-lock"
              label="Ganti Password"
              active={url.includes('my/ganti/password')}
            />
            <li>
              <div
                onClick={handleLogout}
                className={`flex items-center p-2 rounded transition-colors duration-200 text-red-600 hover:bg-red-100 hover:text-red-600 cursor-pointer`}
              >
                <i className="fas fa-sign-out-alt mr-2"></i> Keluar
              </div>
            </li>

          </ul>
        </nav>
        {/* <div className="p-4 text-center">
          <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded">Logout</button>
        </div> */}
      </div>
    </aside>
  );
}

export default MySidebar;
