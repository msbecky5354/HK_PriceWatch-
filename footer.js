// footer.js - 統一全站 Footer (無縫對接全域 lang.js 版)
document.addEventListener('DOMContentLoaded', () => {

    // 🌟 1. 純 DOM 骨架 (維持不變)
    const footerHtml = `
    <div class="text-center pt-8 pb-8 flex-none w-full z-20 relative"> 
        <button id="ft-links" onclick="document.getElementById('disclaimerModal').classList.remove('hidden');" 
                class="text-[11px] text-blue-500 dark:text-white hover:text-blue-600 dark:hover:text-slate-300 underline decoration-slate-200 dark:decoration-slate-700 transition">
        </button>
        <div class="text-[10px] text-slate-500 dark:text-slate-100 mt-1.5 tracking-wide flex items-center justify-center transition-colors">
            <span id="ft-copy"></span> 
            <span class="mx-1.5">|</span> 
            <span id="ft-team"></span>
            <a id="ft-devName" href="https://lazytoolsstation.vercel.app" target="_blank" class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline transition cursor-pointer ml-1"></a>
        </div>
    </div>
    `;

    const modalHtml = `
    <div id="disclaimerModal" class="hidden fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh] border dark:border-slate-700 transition-colors duration-300">
            <div class="flex items-center gap-2 mb-4">
                <span class="text-[20px]">🛡️</span>
                <h2 id="ft-modalTitle" class="text-[17px] font-black text-slate-800 dark:text-slate-100 transition-colors"></h2>
            </div>        
            <div id="disclaimerBody" class="overflow-y-auto text-[13px] text-slate-600 dark:text-slate-300 space-y-4 pr-1 mb-2 leading-relaxed transition-colors"></div>
            <button onclick="document.getElementById('disclaimerModal').classList.add('hidden')" id="ft-modalBtn" class="mt-4 w-full bg-blue-600 dark:bg-blue-500 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-transform text-[15px] shadow-md shadow-blue-100 dark:shadow-none"></button>
        </div>
    </div>
    `;
    
    // 掛載 DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const level1Inner = document.querySelector('#level1Section > div.flex.flex-col.flex-1');
    if (level1Inner) {
        level1Inner.insertAdjacentHTML('beforeend', footerHtml);
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHtml);
    }

    // 🌟 2. Footer 渲染引擎 (改為讀取 window.uiText)
    function renderFooterLang() {
        const lang = localStorage.getItem('appLang') || 'zh-Hant';
        
        // 確保 window.uiText 存在，否則 fallback
        if (!window.uiText) return; 
        const dict = window.uiText[lang] || window.uiText['zh-Hant'];
        if (!dict) return;

        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };

        // 讀取你在三個 lang_*.js 檔案中早已寫好的變數名稱
        setTxt('ft-links', dict.miniFooterLinks);
        setTxt('ft-copy', dict.miniFooterCopy);
        setTxt('ft-team', dict.footerDevTeam);
        setTxt('ft-devName', dict.footerDevName);
        setTxt('ft-modalTitle', dict.disclaimerTitle);
        setTxt('ft-modalBtn', dict.modalBtn);
        
        // 將 HTML 格式的 disclaimerText 寫入模態框
        const bodyEl = document.getElementById('disclaimerBody');
        if (bodyEl) bodyEl.innerHTML = dict.disclaimerText;
    }

    // 🌟 3. 終極修復：全域攔截 LocalStorage 變更
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'appLang') {
            renderFooterLang();
        }
    };

    window.addEventListener('languageChanged', renderFooterLang);

    // 初始化渲染 (加入少量 delay 確保三個 lang 檔案已經載入完畢)
    setTimeout(renderFooterLang, 50);
});
