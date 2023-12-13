
// countdown
const countdownTime = 420; 


let minutes = Math.floor(countdownTime / 60);
let seconds = countdownTime % 60;


document.getElementById('countdown').innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

const countdownInterval = setInterval(() => {
  seconds--;

  if (seconds < 0) {
    minutes--;
    seconds = 59;
  }

  if (minutes < 0) {
    clearInterval(countdownInterval);
    document.getElementById('countdown').innerHTML = 'Link expired';
  
  } else {
    document.getElementById('countdown').innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}, 1000);

