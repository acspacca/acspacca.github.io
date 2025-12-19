(function(){
    const canvas = document.getElementById("starfield");
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, ratio = window.devicePixelRatio || 1;

    function resize(){
        ratio = window.devicePixelRatio || 1;
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.floor(w * ratio);
        canvas.height = Math.floor(h * ratio);
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    const STAR_COUNT = Math.max(60, Math.floor((w + h) / 8));
    const stars = [];
    for (let i = 0; i < STAR_COUNT; i++) stars.push(makeStar(true));

    function makeStar(init){
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            z: Math.random(),            // depth
            r: Math.random() * 1.4 + 0.3,
            speed: 0.2 + Math.random() * 1.6,
            twinkle: Math.random() * 0.8 + 0.2,
            theta: Math.random() * Math.PI * 2
        };
    }

    let mouseX = w / 2, mouseY = h / 2, px = mouseX, py = mouseY;
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    window.addEventListener('touchmove', e => { const t = e.touches[0]; if (t) { mouseX = t.clientX; mouseY = t.clientY; } }, { passive: true });

    let last = performance.now();
    let paused = false;
    document.addEventListener('visibilitychange', () => { paused = document.hidden; if (!paused) { last = performance.now(); requestAnimationFrame(loop); } });

    const shootingStars = [];
    function spawnShootingStar(){
        const angle = Math.PI * 0.8 + Math.random() * 0.6;
        const speed = 6 + Math.random() * 8;
        shootingStars.push({
            x: Math.random() * w,
            y: Math.random() * h * 0.3,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 40,
            maxLife: 40
        });
    }

    function loop(now){
        if (paused) return;
        const dt = Math.min(50, now - last);
        last = now;

        // smooth pointer for parallax
        px += (mouseX - px) * 0.02;
        py += (mouseY - py) * 0.02;
        const cx = (px - w / 2) * 0.0009;
        const cy = (py - h / 2) * 0.0009;

        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < stars.length; i++){
            const s = stars[i];
            // movement depends on depth
            s.x += (0.3 + s.z * 1.6) * s.speed * (dt / 16) + cx * (1 + s.z * 3);
            s.y += (0.1 + s.z * 0.8) * s.speed * (dt / 16) + cy * (1 + s.z * 3);
            s.theta += 0.02 * s.twinkle;

            // wrap-around
            if (s.x > w + 20) s.x = -20;
            if (s.x < -20) s.x = w + 20;
            if (s.y > h + 20) s.y = -20;
            if (s.y < -20) s.y = h + 20;

            // draw with subtle twinkle
            const glow = 0.6 + 0.4 * Math.sin(s.theta * 3 + s.z * 6);
            const size = s.r * (0.6 + s.z * 1.6);
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${0.7 * glow})`;
            ctx.arc(s.x, s.y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        // shooting stars
        if (Math.random() < 0.006) spawnShootingStar();
        for (let i = shootingStars.length - 1; i >= 0; i--){
            const ss = shootingStars[i];
            ss.x += ss.vx * (dt / 16);
            ss.y += ss.vy * (dt / 16);
            ss.life -= dt / 16;

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 3, ss.y - ss.vy * 3);
            grad.addColorStop(0, `rgba(255,255,255,${ss.life / ss.maxLife})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x - ss.vx * 3, ss.y - ss.vy * 3);
            ctx.stroke();
            ctx.restore();

            if (ss.life <= 0 || ss.x < -50 || ss.x > w + 50 || ss.y < -50 || ss.y > h + 50) shootingStars.splice(i, 1);
        }

        requestAnimationFrame(loop);
    }

    // Intersection observer for sections and titles (kept from previous script)
    document.addEventListener("DOMContentLoaded", () => {
        const sections = document.querySelectorAll(".item-section, .section-title, .items-title");
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("fade-in"); });
        }, { threshold: 0.2 });
        sections.forEach(section => observer.observe(section));
    });

    requestAnimationFrame(loop);
})();
