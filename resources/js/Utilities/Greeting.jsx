// const greeting = (name) => {
//     const hours = new Date().getHours();
//     let message = '';
//     let waveEmoji = '<span class="inline-block animate-wave origin-[70%_70%]">👋</span>';

//     // Pagi: Dari jam 00:00 s/d 10:59
//     if (hours < 11) {
//         message = `Selamat Pagi, ${name} ${waveEmoji}`;
//     } 
//     // Siang: Dari jam 11:00 s/d 14:59
//     else if (hours >= 11 && hours < 15) {
//         message = `Selamat Siang, ${name} ${waveEmoji}`;
//     } 
//     // Sore: Dari jam 15:00 s/d 18:29
//     else if (hours >= 15 && hours < 18.5) { // Menggunakan 18.5 untuk mencakup hingga 18:29
//         message = `Selamat Sore, ${name} ${waveEmoji}`;
//     } 
//     // Malam: Dari jam 18:30 dan seterusnya
//     else {
//         message = `Selamat Malam, ${name} ${waveEmoji}`;
//     }
    
//     return message;
// };

// export default greeting;
import React, { useEffect } from 'react';

const Greeting = ( name = 'Kamu' ) => {
  const hours = new Date().getHours();
  let text = '';

  if (hours < 11) {
    text = 'Selamat Pagi';
  } else if (hours < 15) {
    text = 'Selamat Siang';
  } else if (hours < 18.5) {
    text = 'Selamat Sore';
  } else {
    text = 'Selamat Malam';
  }

  const fullGreeting = `${text}, ${name}`;

  useEffect(() => {
    const speak = () => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(fullGreeting);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();

      // 🔥 Cari voice Bahasa Indonesia
      const indoVoice = voices.find(v =>
        v.lang === 'id-ID' || v.lang.startsWith('id')
      );

      if (indoVoice) {
        utterance.voice = indoVoice;
      }

      window.speechSynthesis.speak(utterance);
    };

    // Edge butuh event ini
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = speak;
    } else {
      speak();
    }

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <span>
      {text}, {name}{' '}
      <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
    </span>
  );
};

export default Greeting;
