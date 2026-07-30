import React, { useEffect, useState, useRef } from "react";

const ConnectionStatus = () => {
    const [status, setStatus] = useState("online"); // online | offline | weak
    const [showBanner, setShowBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("");
    const [bannerColor, setBannerColor] = useState("");
    const statusRef = useRef("online"); // simpan status terakhir

    // Fungsi untuk cek kekuatan koneksi
    const checkConnection = () => {
        if (!navigator.onLine) {
            setStatus("offline");
            statusRef.current = "offline";
            setBannerMessage("⚠️ Anda sedang offline. Beberapa fitur mungkin tidak berfungsi.");
            setBannerColor("bg-red-500/80 backdrop-blur-sm text-white");
            setShowBanner(true);
        } else {
            const start = Date.now();
            fetch("https://www.google.com/favicon.ico", { mode: "no-cors" })
                .then(() => {
                    const latency = Date.now() - start;
                    if (latency > 1200) {
                        setStatus("weak");
                        statusRef.current = "weak";
                        setBannerMessage("⚠️ Koneksi internet Anda lemah. Mohon periksa jaringan Anda.");
                        setBannerColor("bg-yellow-400/80 backdrop-blur-sm text-gray-900");
                        setShowBanner(true);
                    } else {
                        // jika sebelumnya offline/weak dan kini online
                        if (statusRef.current !== "online") {
                            setStatus("online");
                            statusRef.current = "online";
                            setBannerMessage("✅ Koneksi internet Anda telah pulih.");
                            setBannerColor("bg-green-500/80 backdrop-blur-sm text-white");
                            setShowBanner(true);
                            setTimeout(() => setShowBanner(false), 3000);
                        } else {
                            setStatus("online");
                            statusRef.current = "online";
                            setShowBanner(false);
                        }
                    }
                })
                .catch(() => {
                    setStatus("offline");
                    statusRef.current = "offline";
                    setBannerMessage("⚠️ Anda sedang offline. Beberapa fitur mungkin tidak berfungsi.");
                    setBannerColor("bg-red-500/80 backdrop-blur-sm text-white");
                    setShowBanner(true);
                });
        }
    };

    useEffect(() => {
        checkConnection();
        const interval = setInterval(checkConnection, 5000);
        window.addEventListener("online", checkConnection);
        window.addEventListener("offline", checkConnection);

        return () => {
            clearInterval(interval);
            window.removeEventListener("online", checkConnection);
            window.removeEventListener("offline", checkConnection);
        };
    }, []);

    const getIndicator = () => {
        if (status === "online") {
            return (
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            );
        }

        if (status === "weak") {
            return (
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                </span>
            );
        }

        // OFFLINE
        return (
            <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
        );
    };


    const getColor = () => {
        switch (status) {
            case "online":
                return "bg-green-500 animate-ping";
            case "weak":
                return "bg-yellow-400 animate-pulse";
            case "offline":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
    };

    const getText = () => {
        switch (status) {
            case "online":
                return "Online";
            case "weak":
                return "Koneksi Lemah";
            case "offline":
                return "Offline";
            default:
                return "";
        }
    };

    return (
        <>
            {/* Banner koneksi */}
            <div
                className={`fixed top-0 left-0 w-full text-center font-medium py-2 px-4 z-[9999] transition-all duration-500 transform ${showBanner
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-full opacity-0"
                    } ${bannerColor}`}
            >
                {bannerMessage}
            </div>

            {/* Indikator kecil di navbar */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
                {/* <span className={`w-3 h-3 rounded-full ${getColor()}`}></span> */}
                {getIndicator()}
                <span className="hidden md:inline">{getText()}</span>
            </div>
        </>
    );
};

export default ConnectionStatus;
