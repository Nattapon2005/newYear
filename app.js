
// const targetDate = new Date(Date.now() + 6 * 1000).getTime();
const targetDate = new Date('January 1, 2026 00:00:00').getTime();


let previousValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
let isCelebrating = false;

// 2. ฟังก์ชันสร้างดวงดาวพื้นหลัง (ลดจำนวนเหลือ 40 เพื่อความลื่นไหล)
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

// 3. ฟังก์ชันอัปเดตตัวเลขถอยหลัง
function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
        displayZeros();
        celebrateNewYear();
        return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    updateTimeValue('days', d);
    updateTimeValue('hours', h);
    updateTimeValue('minutes', m);
    updateTimeValue('seconds', s);
}

function updateTimeValue(id, value) {
    const element = document.getElementById(id);
    if (!element) return;
    const formattedValue = value.toString().padStart(2, '0');

    if (previousValues[id] !== value) {
        element.classList.add('flip');
        element.textContent = formattedValue;
        setTimeout(() => element.classList.remove('flip'), 300);
        previousValues[id] = value;
    }
}

function displayZeros() {
    ['days', 'hours', 'minutes', 'seconds'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '00';
    });
}

function celebrateNewYear() {
    if (isCelebrating) return;
    isCelebrating = true;

    const footerText = document.getElementById('footerText');
    if (footerText) {
        footerText.textContent = '🎉 Happy New Year 2026! 🎉';
        footerText.classList.add('celebrate');
    }
    startFireworks();
}

// 4. ระบบพลุ (Canvas Fireworks - Optimized Version)
function startFireworks() {
    const canvas = document.getElementById('fireworks');
    if (!canvas) return;
    canvas.classList.add('active');
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const fireworks = [];
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#F7DC6F', '#BB8FCE'];

    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.2;
            this.vy = -6 - Math.random() * 4;
            this.exploded = false;
            this.particles = [];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            if (!this.exploded) {
                this.y += this.vy;
                this.vy += 0.1;
                if (this.y <= this.targetY || this.vy > 0) this.explode();
            } else {
                this.particles = this.particles.filter(p => p.life < p.maxLife);
                this.particles.forEach(p => p.update());
            }
        }
        draw() {
            if (!this.exploded) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            } else {
                this.particles.forEach(p => p.draw());
            }
        }
        explode() {
            this.exploded = true;
            const particleCount = 25 + Math.floor(Math.random() * 15); // ลดปริมาณสะเก็ด
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const speed = 2 + Math.random() * 5;
                this.particles.push(new Particle(this.x, this.y, angle, speed, this.color));
            }
        }
        isDead() { return this.exploded && this.particles.length === 0; }
    }

    class Particle {
        constructor(x, y, angle, speed, color) {
            this.x = x; this.y = y;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = 0;
            this.maxLife = 40 + Math.random() * 30; // หายไวขึ้น
            this.color = color;
            this.size = 1 + Math.random() * 3; // ขนาดเล็กลง
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy += 0.04; this.vx *= 0.98;
            this.life++;
        }
        draw() {
            const opacity = 1 - (this.life / this.maxLife);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0.5, Math.PI * 2);
            ctx.fillStyle = this.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
            ctx.fill();
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        fireworks.forEach((fw, i) => {
            fw.update();
            fw.draw();
            if (fw.isDead()) fireworks.splice(i, 1);
        });
        requestAnimationFrame(animate);
    }

    // สร้างพลุทุก 1.2 วินาที
    const fireworkInterval = setInterval(() => {
        if (fireworks.length < 12) {
            fireworks.push(new Firework());
        }
    }, 300);

    // --- 5. หยุดทำงานพลุหลังจากเริ่มไปแล้ว 1 ชั่วโมง ---
    const ONE_HOUR = 60 * 60 * 1000;
    setTimeout(() => {
        clearInterval(fireworkInterval);
        setTimeout(() => {
            fireworks.length = 0;
            canvas.style.display = 'none';
        }, 5000); // รอให้ลูกสุดท้ายหายไป
    }, ONE_HOUR);

    animate();
}

// เริ่มต้นระบบ
createStars();
updateCountdown();
setInterval(updateCountdown, 1000);

