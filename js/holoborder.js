const collectionDate = new Date("2026-01-03");

const holoImage = document.getElementById("holoImage");

// Start and end gradient colors
const startColors = ["#8a5f8b", "#7777ff"];
const endColors   = ["#bf77c2", "#3333ff"];

let step = 0;
let direction = 1; // forward (1) or backward (-1)
const totalSteps = 10;
const currentDate = new Date();
const diffTime = currentDate - collectionDate;
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

// Function to interpolate between two hex colors
function interpolateColor(color1, color2, factor) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);

    const r1 = (c1 >> 16) & 0xff, g1 = (c1 >> 8) & 0xff, b1 = c1 & 0xff;
    const r2 = (c2 >> 16) & 0xff, g2 = (c2 >> 8) & 0xff, b2 = c2 & 0xff;

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `rgb(${r}, ${g}, ${b})`;
}
function getSensorData(hour, minutes) {
    let t = 18 + 10 * Math.sin((hour - 6) * Math.PI / 12);
    let h = 70 - 20 * Math.sin((hour - 6) * Math.PI / 12);
    let l = Math.max(0, 100 * Math.sin(hour * Math.PI / 24));
    t += (currentDate.getMinutes() / minutes) * 2;
    h += (currentDate.getMinutes() / minutes) * 5;
    l += minutes>10?(currentDate.getMinutes() / minutes) * 2:-80;
    return {t: t.toFixed(1) + " °C", h: h.toFixed(1) + "%", l: l.toFixed(0) + " lux"};
}
function simulateDay() {
    const readingsDiv1 = document.getElementById("readings1");
    const readingsDiv2 = document.getElementById("readings2");
    const readingsDiv3 = document.getElementById("readings3");
    var data = getSensorData(currentDate.getHours()-1, 30);
    readingsDiv1.innerHTML = `${data.t} ${data.h} ${data.l}</p>`;
    var data = getSensorData(currentDate.getHours()-1, 15);
    readingsDiv2.innerHTML = `${data.t} ${data.h} ${data.l}</p>`;
    var data = getSensorData(currentDate.getHours()-1, 10);
    readingsDiv3.innerHTML = `${data.t} ${data.h} ${data.l}</p>`;
    document.getElementById("ttl").innerHTML = `${diffDays}`;
}
function updateGradient() {
    const factor = step / totalSteps;
    const colorA = interpolateColor(startColors[0], endColors[0], factor);
    const colorB = interpolateColor(startColors[1], endColors[1], factor);

    //holoImage.style.borderImage = `linear-gradient(45deg, ${colorA}, ${colorB}) 1`;

    step += direction;
    if (step > totalSteps || step < 0) {
    direction *= -1; // reverse direction
    step += direction; // keep within bounds
    }
}


  let hue = 0;
  const hueClass = document.querySelectorAll(".hue-effect");
  const beatClass = document.querySelectorAll(".beat-effect");

  function animateHue() {
    hue = (hue + 0.5) % 360; // cycle through 0–359 degrees
    hueClass.forEach(control => {
        control.style.filter = `hue-rotate(${hue}deg)`;
   });
    requestAnimationFrame(animateHue); // smooth animation loop
  }
 function animateBeat() {
    const scale = 1 + 0.05 * Math.sin(Date.now() / 500); // pulsate every 600ms
    beatClass.forEach(control => {
        control.style.transform = `scale(${scale})`;
    });
    requestAnimationFrame(animateBeat); // smooth animation loop
  }

simulateDay();
animateHue();
animateBeat();
