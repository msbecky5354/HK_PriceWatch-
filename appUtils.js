// appUtils.js - 共用工具與邏輯模組
document.addEventListener('DOMContentLoaded', () => {
    // 1. 注入共用 Modals (避免每個 HTML 都寫一遍)
    injectSharedModals();
});

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.textContent = isDark ? '🌙' : '☀️';
}

// --- 分享功能模組 ---
function openShareAppModal() {
    const modal = document.getElementById('shareAppModal');
    const box = document.getElementById('shareAppBox');
    if (modal && box) {
        const currentUrl = window.location.origin + window.location.pathname;
        const qrCodeImg = document.getElementById('qrCodeImg');
        if (qrCodeImg) {
            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}&margin=10`;
        }
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            box.classList.remove('scale-95');
            box.classList.add('scale-100');
        }, 10);
    }
}

function closeShareAppModal() {
    const modal = document.getElementById('shareAppModal');
    const box = document.getElementById('shareAppBox');
    if (modal && box) {
        modal.classList.add('opacity-0');
        box.classList.remove('scale-100');
        box.classList.add('scale-95');
        setTimeout(() => { modal.classList.add('hidden'); }, 300);
    }
}

function showToast() {
    const toastMsg = document.getElementById('toastMsg');
    if (toastMsg) {
        toastMsg.classList.remove('opacity-0', 'translate-y-[-20px]');
        setTimeout(() => { toastMsg.classList.add('opacity-0', 'translate-y-[-20px]'); }, 2000);
    }
}

function copyAppUrl() {
    const currentUrl = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(currentUrl).then(() => {
        showToast();
        setTimeout(closeShareAppModal, 1000);
    });
}

function shareToWhatsApp() {
    const currentUrl = window.location.origin + window.location.pathname;
    const defaultMsg = "推薦你用「慳真D🔎」！秒速格價，幫你慳到盡！🛒\n";
    const msgText = (typeof uiText !== 'undefined' && typeof currentLang !== 'undefined' && uiText[currentLang] && uiText[currentLang].shareMessage) 
                    ? uiText[currentLang].shareMessage 
                    : defaultMsg;
    const msg = encodeURIComponent(msgText + currentUrl);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function shareNative() {
    const currentUrl = window.location.origin + window.location.pathname;
    const defaultMsg = "推薦你用「慳真D🔎」！秒速格價，幫你慳到盡！🛒\n";
    const msgText = (typeof uiText !== 'undefined' && typeof currentLang !== 'undefined' && uiText[currentLang] && uiText[currentLang].shareMessage) 
                    ? uiText[currentLang].shareMessage 
                    : defaultMsg;
    
    if (navigator.share) {
        navigator.share({
            title: (typeof uiText !== 'undefined' && typeof currentLang !== 'undefined' && uiText[currentLang] && uiText[currentLang].title) ? uiText[currentLang].title : '慳真D',
            text: msgText,
            url: currentUrl
        }).catch(console.error);
    } else {
        copyAppUrl(); 
    }
}

function openManual() {
    const lang = localStorage.getItem('appLang') || 'zh-Hant';
    const pages = { 'zh-Hant': 'manual_tw.html', 'zh-Hans': 'manual_cn.html', 'en': 'manual_en.html' };
    window.location.href = pages[lang] || pages['zh-Hant'];
}

// 統一注入 Modal HTML (完整版)
function injectSharedModals() {
    if (document.getElementById('shareAppModal')) return; // 已存在則不重複注入
    
    const div = document.createElement('div');
    div.innerHTML = `
    <div id="shareAppModal" class="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 z-[60] hidden flex items-center justify-center p-4 backdrop-blur-sm opacity-0 transition-opacity duration-300">
        <div class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-sm overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col border dark:border-slate-700" id="shareAppBox">
            <div class="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 id="shareAppTitle" class="text-[16px] font-black text-slate-800 dark:text-slate-100">分享 App</h3>
                <button onclick="closeShareAppModal()" class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 active:scale-90 transition">✕</button>
            </div>
            <div class="p-5 flex flex-col items-center text-center">
                <p id="shareAppDesc" class="text-[13px] text-slate-500 dark:text-slate-400 mb-4"></p>
                <div class="p-2 bg-white border-2 border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm mb-5">
                    <img id="qrCodeImg" src="" alt="QR Code" class="w-40 h-40 object-contain rounded-xl">
                </div>
                
                <div class="grid grid-cols-2 gap-3 w-full">
                    <button onclick="copyAppUrl()" class="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 active:bg-slate-100 dark:active:bg-slate-700 transition">
                        <span class="text-lg">🔗</span>
                        <span id="shareBtnCopy" class="text-[12px] font-bold text-slate-700 dark:text-slate-200">複製連結</span>
                    </button>
                    <button onclick="shareToWhatsApp()" class="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 active:bg-green-100 dark:active:bg-green-900/50 transition">
                        <span class="text-lg">💬</span>
                        <span id="shareBtnWhatsApp" class="text-[12px] font-bold text-green-700 dark:text-green-400">WhatsApp</span>
                    </button>
                </div>
                <button onclick="shareNative()" class="mt-3 w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[13px] border border-blue-100 dark:border-blue-800 active:scale-95 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    <span id="shareBtnMore">更多選項</span>
                </button>
            </div>
        </div>
    </div>
    <div id="toastMsg" class="fixed top-14 left-1/2 transform -translate-x-1/2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-full shadow-lg text-[13px] font-bold z-[70] transition-all duration-300 opacity-0 pointer-events-none translate-y-[-20px]">
        ✅ 連結已複製！
    </div>
    `;
    document.body.appendChild(div);

    // 套用多語言翻譯 (如果 uiText 已載入)
    if (typeof uiText !== 'undefined' && typeof currentLang !== 'undefined' && uiText[currentLang]) {
        const d = uiText[currentLang];
        const t = (id, text) => { if(document.getElementById(id) && text) document.getElementById(id).innerText = text; };
        t('shareAppTitle', d.shareAppTitle);
        t('shareAppDesc', d.shareAppDesc);
        t('shareBtnCopy', d.shareBtnCopy);
        t('shareBtnWhatsApp', d.shareBtnWhatsApp);
        t('shareBtnMore', d.shareBtnMore);
        t('toastMsg', d.copiedToast);
    }
}
