import React, { useMemo } from 'react';

export default function HaditsCard() {
    const motivasiList = [
        // 🌿 Ayat Al-Qur’an
        { type: 'ayat', title: 'Ayat Tentang Kejujuran', text: 'Wahai orang-orang yang beriman! Bertakwalah kepada Allah dan hendaklah kamu bersama orang-orang yang jujur.', source: 'QS. At-Taubah: 119', color: 'green', icon: 'fa-quran' },
        { type: 'ayat', title: 'Ayat Tentang Amanah', text: 'Sesungguhnya Allah menyuruh kamu menyampaikan amanat kepada yang berhak menerimanya.', source: 'QS. An-Nisa: 58', color: 'emerald', icon: 'fa-handshake' },
        { type: 'ayat', title: 'Ayat Tentang Kebenaran', text: 'Dan janganlah kamu campuradukkan yang hak dengan yang batil dan janganlah kamu sembunyikan kebenaran.', source: 'QS. Al-Baqarah: 42', color: 'teal', icon: 'fa-scale-balanced' },
        { type: 'ayat', title: 'Ayat Tentang Tanggung Jawab', text: 'Setiap jiwa bertanggung jawab atas apa yang telah diperbuatnya.', source: 'QS. Al-Muddatsir: 38', color: 'cyan', icon: 'fa-balance-scale' },
        { type: 'ayat', title: 'Ayat Tentang Larangan Dusta', text: 'Laknat Allah atas orang-orang yang berdusta.', source: 'QS. Ali Imran: 61', color: 'lime', icon: 'fa-triangle-exclamation' },
        { type: 'ayat', title: 'Ayat Tentang Keadilan', text: 'Hai orang-orang yang beriman, jadilah kamu penegak keadilan, menjadi saksi karena Allah, walaupun terhadap dirimu sendiri.', source: 'QS. An-Nisa: 135', color: 'blue', icon: 'fa-scale-balanced' },
        { type: 'ayat', title: 'Ayat Tentang Menepati Janji', text: 'Dan penuhilah janji, sesungguhnya janji itu pasti diminta pertanggungjawabannya.', source: 'QS. Al-Isra: 34', color: 'sky', icon: 'fa-handshake' },
        { type: 'ayat', title: 'Ayat Tentang Perbuatan Baik', text: 'Barangsiapa mengerjakan kebajikan seberat zarrah pun, niscaya dia akan melihat balasannya.', source: 'QS. Az-Zalzalah: 7', color: 'emerald', icon: 'fa-leaf' },
        { type: 'ayat', title: 'Ayat Tentang Pengawasan Allah', text: 'Dan sesungguhnya Tuhanmu benar-benar mengawasi.', source: 'QS. Al-Fajr: 14', color: 'indigo', icon: 'fa-eye' },
        { type: 'ayat', title: 'Ayat Tentang Kebenaran Lidah', text: 'Hai orang-orang yang beriman, bertakwalah kepada Allah dan katakanlah perkataan yang benar.', source: 'QS. Al-Ahzab: 70', color: 'violet', icon: 'fa-comment-dots' },

        // 🌙 Hadits Nabi ﷺ
        { type: 'hadits', title: 'Hadits Tentang Kejujuran', text: 'Hendaklah kalian selalu jujur, karena kejujuran membawa kepada kebaikan, dan kebaikan membawa ke surga. Dan jauhilah dusta, karena dusta membawa kepada kejahatan, dan kejahatan membawa ke neraka.', source: 'HR. Bukhari dan Muslim', color: 'emerald', icon: 'fa-book-quran' },
        { type: 'hadits', title: 'Hadits Tentang Amanah', text: 'Tidak beriman seseorang yang tidak amanah, dan tidak beragama seseorang yang tidak menepati janji.', source: 'HR. Ahmad', color: 'teal', icon: 'fa-handshake' },
        { type: 'hadits', title: 'Hadits Tentang Dusta', text: 'Tanda orang munafik ada tiga: jika berbicara ia berdusta, jika berjanji ia mengingkari, dan jika dipercaya ia berkhianat.', source: 'HR. Bukhari dan Muslim', color: 'red', icon: 'fa-triangle-exclamation' },
        { type: 'hadits', title: 'Hadits Tentang Amanah Dalam Kecil', text: 'Sampaikanlah amanah kepada orang yang mempercayakan amanah kepadamu, dan janganlah kamu mengkhianati orang yang mengkhianatimu.', source: 'HR. Abu Dawud dan Tirmidzi', color: 'cyan', icon: 'fa-key' },
        { type: 'hadits', title: 'Hadits Tentang Kebenaran Ucapan', text: 'Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata yang baik atau diam.', source: 'HR. Bukhari dan Muslim', color: 'sky', icon: 'fa-comment' },
        { type: 'hadits', title: 'Hadits Tentang Tanggung Jawab', text: 'Setiap kalian adalah pemimpin, dan setiap kalian akan dimintai pertanggungjawaban atas kepemimpinannya.', source: 'HR. Bukhari dan Muslim', color: 'blue', icon: 'fa-users' },
        { type: 'hadits', title: 'Hadits Tentang Dosa Dusta', text: 'Celakalah bagi orang yang berbicara lalu berdusta untuk membuat orang tertawa. Celakalah dia, celakalah dia.', source: 'HR. Abu Dawud dan Tirmidzi', color: 'rose', icon: 'fa-face-sad-tear' },
        { type: 'hadits', title: 'Hadits Tentang Keberkahan Jujur', text: 'Penjual dan pembeli yang jujur akan diberkahi dalam jual belinya.', source: 'HR. Bukhari', color: 'emerald', icon: 'fa-store' },
        { type: 'hadits', title: 'Hadits Tentang Amanah Sebagai Ciri Mukmin', text: 'Tidak akan masuk surga orang yang tidak amanah.', source: 'HR. Ahmad', color: 'teal', icon: 'fa-lock' },
        { type: 'hadits', title: 'Hadits Tentang Menepati Janji', text: 'Orang mukmin itu jika berjanji, ia menepati.', source: 'HR. Ahmad', color: 'green', icon: 'fa-handshake' },
    ];

    const randomMotivasi = useMemo(() => {
        return motivasiList[Math.floor(Math.random() * motivasiList.length)];
    }, []);

    // ✅ Map warna aman untuk Tailwind
    const colorClasses = {
        green: 'bg-green-50 border-green-300 text-green-900',
        emerald: 'bg-emerald-50 border-emerald-300 text-emerald-900',
        teal: 'bg-teal-50 border-teal-300 text-teal-900',
        cyan: 'bg-cyan-50 border-cyan-300 text-cyan-900',
        lime: 'bg-lime-50 border-lime-300 text-lime-900',
        blue: 'bg-blue-50 border-blue-300 text-blue-900',
        sky: 'bg-sky-50 border-sky-300 text-sky-900',
        indigo: 'bg-indigo-50 border-indigo-300 text-indigo-900',
        violet: 'bg-violet-50 border-violet-300 text-violet-900',
        red: 'bg-red-50 border-red-300 text-red-900',
        rose: 'bg-rose-50 border-rose-300 text-rose-900',
    };

    const colorClass = colorClasses[randomMotivasi.color] || colorClasses.blue;

    return (
        <div className="border-t">
            <div className="p-8">
                <div className={`border rounded-lg p-4 shadow-sm ${colorClass}`}>
                    <div className="flex items-center mb-2">
                        <i className={`fa ${randomMotivasi.icon} mr-2 text-lg opacity-80`}></i>
                        <span className="font-semibold text-sm md:text-base">
                            {randomMotivasi.title}
                        </span>
                    </div>
                    <p className="text-sm leading-relaxed text-justify italic">
                        “{randomMotivasi.text}”
                    </p>
                    <p className="text-xs text-right mt-2 font-medium opacity-80">
                        {randomMotivasi.source}
                    </p>
                </div>
            </div>
        </div>
    );
}
