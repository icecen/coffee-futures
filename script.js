// Data Configuration: Initial base price and volatility
const DUMMY_DATA = {
    arabica: { base: 185.50, vol: 2.5 }, // USd/Lbs
    robusta: { base: 2843, vol: 15 } // USD/MT
};

// DOM Elements
const elTime = document.getElementById('time-stamp');
const elArabica = document.getElementById('ice-arabica');
const elArabicaTrend = document.getElementById('arabica-trend');
const elArabica7d = document.getElementById('arabica-7d');
const elRobusta = document.getElementById('ice-robusta');
const elRobustaTrend = document.getElementById('robusta-trend');
const elRobusta7d = document.getElementById('robusta-7d');
const elUserPoints = document.getElementById('user-points');
const elPredictList = document.getElementById('predict-list');

// State
let isCertified = false;
let userPoints = 0;

// Formatters for displaying prices
const fmtA = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtR = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

// Modal Logic
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    } else {
        modal.style.display = 'flex';
        // forced reflow to ensure transition works
        void modal.offsetWidth;
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    toggleModal(modalId || 'register-modal');
}

// Click outside to close modal
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Update Clock
function updateTime() {
    const now = new Date();
    elTime.textContent = now.toLocaleString('zh-CN', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    }) + " (实盘交易中)";
}

// Simulate Market Data Ticks
function generateTick(base, vol, isFloat = true) {
    const change = (Math.random() - 0.5) * vol;
    const newPrice = base + change;
    const pct = (change / base) * 100;
    return {
        price: isFloat ? newPrice : Math.round(newPrice),
        change: change,
        pct: pct
    };
}

function updateMarketData() {
    // Arabica Update
    const aTick = generateTick(DUMMY_DATA.arabica.base, DUMMY_DATA.arabica.vol, true);
    DUMMY_DATA.arabica.base = aTick.price;
    updateCard(elArabica, elArabicaTrend, elArabica7d, aTick, fmtA);

    // Robusta Update
    const rTick = generateTick(DUMMY_DATA.robusta.base, DUMMY_DATA.robusta.vol, false);
    DUMMY_DATA.robusta.base = rTick.price;
    updateCard(elRobusta, elRobustaTrend, elRobusta7d, rTick, fmtR);
}

function updateCard(priceEl, trendEl, weekEl, tick, formatter) {
    // Animate color change slightly
    priceEl.style.opacity = '0.7';
    setTimeout(() => priceEl.style.opacity = '1', 100);

    priceEl.textContent = formatter.format(tick.price);
    
    priceEl.className = 'price';
    trendEl.className = 'trend-box';

    const sign = tick.change >= 0 ? '+' : '';
    trendEl.textContent = `${sign}${formatter.format(tick.change)} (${sign}${tick.pct.toFixed(2)}%)`;

    if (tick.change >= 0) {
        priceEl.classList.add('up');
        trendEl.classList.add('up');
    } else {
        priceEl.classList.add('down');
        trendEl.classList.add('down');
    }

    // Simulate random 7d movement for effect
    const d7 = (Math.random() * 10 - 5);
    const d7Sign = d7 > 0 ? '+' : '';
    weekEl.textContent = `${d7Sign}${d7.toFixed(2)}%`;
    weekEl.style.color = d7 > 0 ? 'var(--accent-green)' : 'var(--accent-red)';
}

// Handle User Registration
document.getElementById('reg-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const code = document.getElementById('username').value;
    if (code.trim() === '') return;
    
    isCertified = true;
    const btnReg = document.querySelector('.btn-reg');
    btnReg.textContent = '已认证: 交易员 ' + code.substring(0,4).toUpperCase();
    btnReg.style.background = 'var(--coffee-primary)';
    btnReg.style.color = 'var(--bg-color)';
    btnReg.style.boxShadow = '0 0 15px rgba(212, 163, 115, 0.4)';
    
    closeModal('register-modal');
    // slight delay for alert to allow modal animation to finish
    setTimeout(() => {
        alert('认证成功！您现在可以提交价格预判了。');
    }, 300);
});

// Handle Prediction Form Submission
document.getElementById('predict-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!isCertified) {
        alert('请先完成交易员认证！');
        toggleModal('register-modal');
        return;
    }

    const ha = document.getElementById('pre-h-a').value;
    const la = document.getElementById('pre-l-a').value;
    const ca = document.getElementById('pre-c-a').value;
    const hr = document.getElementById('pre-h-r').value;
    const lr = document.getElementById('pre-l-r').value;
    const cr = document.getElementById('pre-c-r').value;

    const dateStr = new Date().toLocaleDateString('zh-CN');
    
    // Reward points for predicting
    userPoints += 50;
    elUserPoints.textContent = userPoints;
    
    // Add to history
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <strong>${dateStr} 预判提交</strong><br>
            <span style="color:var(--text-muted); font-size:12px;">Arabica: ${ha}/${la}/${ca} | Robusta: ${hr}/${lr}/${cr}</span>
        </div>
        <span style="color:var(--coffee-primary); font-weight: 600;">+50 ⭐</span>
    `;
    
    elPredictList.prepend(li);
    this.reset();
    
    // Animating the new list item
    li.style.opacity = '0';
    li.style.transform = 'translateY(-10px)';
    li.style.transition = 'all 0.4s ease';
    // trigger reflow
    void li.offsetWidth; 
    li.style.opacity = '1';
    li.style.transform = 'translateY(0)';
    
    alert('提交成功！预判积分已发放，结算将在每日 20:00 进行。');
});

// Share Achievement Handler
function shareAchievement() {
    if (!isCertified) {
        alert('请先完成交易员认证后再分享成绩！');
        return;
    }
    if (userPoints === 0) {
        alert('当前预判积分为0，先去提交一次预判吧！');
        return;
    }
    alert(`🎉 复制成功！\n我在 BV 咖啡生豆预测中累计获得 ${userPoints} 积分，快来和我一起洞察豆价！`);
}

// Start timers and initial calls
setInterval(updateTime, 1000);
updateTime();

setInterval(updateMarketData, 3000);
updateMarketData();
