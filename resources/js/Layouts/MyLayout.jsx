import React, { useEffect, useRef, useState } from 'react';
import MyNavbar from '../Components/MyLayout/MyNavbar';
import { Head, usePage } from '@inertiajs/inertia-react';
import MySidebar from '../Components/MyLayout/MySidebar';
import MyFooter from '../Components/MyLayout/MyFooter';
import hasAnyPermission from '../Utilities/Permissions';

const MyLayout = ({ children }) => {
  const { identityWebsite, auth } = usePage().props;

  const [sideOpen, setSideOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('my');
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setSideOpen(!sideOpen);

  // 🔒 Tutup sidebar saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSideOpen(false);
      }
    };

    if (sideOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sideOpen]);

  // 🧠 Watermark grid generator (aktif hanya jika user tidak punya izin 'tanpa.watermark')
  useEffect(() => {
    let showWatermark = false;
    try {
      showWatermark = !hasAnyPermission(['tanpa.watermark']);
    } catch {
      showWatermark = true; // fallback supaya tidak error
    }

    if (!showWatermark) return;

    const userEmail = auth?.user?.email || 'www.febryann.my.id';
    const watermark = document.getElementById('febryan');
    if (!watermark) return;

    const renderWatermark = () => {
      watermark.innerHTML = '';

      const now = new Date();
      const dateNow = now
        .toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        .replace(/\//g, '-');
      const timeNow = now.toLocaleTimeString('id-ID', { hour12: false });
      const text = `${userEmail} • ${dateNow} ${timeNow}`;

      const gapX = 250;
      const gapY = 120;
      const cols = Math.ceil(window.innerWidth / gapX) + 1;
      const rows = Math.ceil(window.innerHeight / gapY) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const span = document.createElement('div');
          span.textContent = text;
          span.className =
            'absolute text-gray-900 text-[13px] font-semibold watermark-text';
          span.style.left = `${c * gapX}px`;
          span.style.top = `${r * gapY}px`;
          watermark.appendChild(span);
        }
      }
    };

    renderWatermark();

    const handleResize = () => {
      clearTimeout(window._watermarkTimeout);
      window._watermarkTimeout = setTimeout(renderWatermark, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [auth]);

  // ✅ Pindahkan pengecekan ke dalam try-catch agar tidak trigger invalid hook
  let showWatermark = true;
  try {
    showWatermark = !hasAnyPermission(['tanpa.watermark']);
  } catch {
    showWatermark = true;
  }

  return (
    <>
      <Head>
        <style>{`
          .watermark-text {
            transform: rotate(-30deg);
            white-space: nowrap;
            opacity: 0.06;
            user-select: none;
            pointer-events: none;
          }
        `}</style>
      </Head>

      <div className="flex flex-col min-h-screen font-poppins relative">
        <MyNavbar toggleSidebar={toggleSidebar} isSidebarOpen={sideOpen} />

        {/* 🪶 Layer watermark */}
        {showWatermark && (
          <div
            id="febryan"
            className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
          ></div>
        )}

        <div className="flex flex-1 pt-16">
          <div
            ref={sidebarRef}
            className="h-screen overflow-y-auto hide-scrollbar"
          >
            <MySidebar
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              sideOpen={sideOpen}
            />
          </div>

          <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-gray-100 px-6 pt-6 pb-3 hide-scrollbar">
            <div className="flex-1">{children}</div>
            <MyFooter />
          </main>
        </div>
      </div>
    </>
  );
};

export default MyLayout;
