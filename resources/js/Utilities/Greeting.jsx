const greeting = (name) => {
    const hours = new Date().getHours();
    let message = '';
    if (hours < 12) {
      message = `Selamat pagi, ${name}`;
    } else if (hours >= 12 && hours < 18) {
      message = `Selamat siang, ${name}`;
    } else if (hours >= 18 && hours < 21) {
      message = `Selamat sore, ${name}`;
    } else {
      message = `Selamat malam, ${name}`;
    }
    return message;
};

export default greeting;
