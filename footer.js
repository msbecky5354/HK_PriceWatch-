// footer.js - 統一全站 Footer (自帶字典、全域感應版)
document.addEventListener('DOMContentLoaded', () => {

    // 🌟 1. 封裝 Footer 專屬多語系字典
    const footerI18n = {
        'zh-Hant': {
            links: '關於我們、條款及免責聲明',
            copy: '© 2026 慳真D',
            team: '開發團隊: ',
            devName: '懶人工具駅',
            modalTitle: '免責聲明及服務條款',
            modalBtn: '我明白及接受'
        },
        'zh-Hans': {
            links: '关于我们、条款及免责声明',
            copy: '© 2026 悭真D',
            team: '开发团队: ',
            devName: '懒人工具駅',
            modalTitle: '免责声明及服务条款',
            modalBtn: '我明白及接受'
        },
        'en': {
            links: 'About Us, Terms & Disclaimer',
            copy: '© 2026 SmartDeal',
            team: 'Developed by: ',
            devName: 'Lazy Tools Station',
            modalTitle: 'Disclaimer & Terms of Service',
            modalBtn: 'I Understand & Accept'
        }
    };

    // 🌟 2. 純 DOM 骨架
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

    // 🌟 3. Footer 渲染引擎
    function renderFooterLang() {
        const lang = localStorage.getItem('appLang') || 'zh-Hant';
        const dict = footerI18n[lang] || footerI18n['zh-Hant'];

        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.innerText = txt; };

        setTxt('ft-links', dict.links);
        setTxt('ft-copy', dict.copy);
        setTxt('ft-team', dict.team);
        setTxt('ft-devName', dict.devName);
        setTxt('ft-modalTitle', dict.modalTitle);
        setTxt('ft-modalBtn', dict.modalBtn);
    }

    // 🌟 4. 終極修復：全域攔截 LocalStorage 變更 (Global Sensor)
    // 透過改寫 setItem，任何網頁只要轉語言，Footer 就會瞬間自行更新，唔使改其他 HTML！
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        originalSetItem.apply(this, arguments);
        if (key === 'appLang') {
            renderFooterLang();
        }
    };

    // 兼容舊版事件廣播 (雙重保險)
    window.addEventListener('languageChanged', renderFooterLang);

    // 初始化渲染
    renderFooterLang();
});