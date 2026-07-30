import React, { useEffect, useRef, useState } from 'react';
import MyNavbar from '../Components/MyLayout/MyNavbar';
import { Head, usePage } from '@inertiajs/inertia-react';
import MySidebar from '../Components/MyLayout/MySidebar';
import MyFooter from '../Components/MyLayout/MyFooter';

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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sideOpen]);

  // 🧠 Watermark grid generator (versi barisan rapi + tanpa reload)
  useEffect(() => {
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

      const gapX = 250; // jarak horizontal antar teks
      const gapY = 120; // jarak vertikal antar teks
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

    // Render awal
    renderWatermark();

    // Render ulang saat resize (tanpa reload)
    const handleResize = () => {
      clearTimeout(window._watermarkTimeout);
      window._watermarkTimeout = setTimeout(renderWatermark, 300);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [auth]);

  return (
    <>
      <Head>
        <style>{`
          .watermark-text {
            transform: rotate(-30deg);
            white-space: nowrap;
            opacity: 0.06; /* sedikit lebih kelihatan tapi tetap halus */
            user-select: none;
            pointer-events: none;
          }
        `}</style>
      </Head>

      <div className="flex flex-col min-h-screen font-poppins relative">
        {/* Navbar */}
        <MyNavbar toggleSidebar={toggleSidebar} isSidebarOpen={sideOpen} />

        {/* 🪶 Layer watermark */}
        <div
          id="febryan"
          className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden"
        ></div>

        <div className="flex flex-1 pt-16">
          {/* Sidebar */}
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

          {/* Main Content */}
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
