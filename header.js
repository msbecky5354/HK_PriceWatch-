// header.js - 共用 Header 組件
document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    
    const headerHtml = `
    <header class="bg-white border-b flex-none z-30 px-3 py-3 shadow-sm sticky top-0 dark:bg-slate-900 dark:border-slate-800 transition-colors">
        <div class="flex justify-between items-center w-full max-w-[600px] mx-auto">
            <div onclick="${isHomePage ? 'showLevel1()' : 'window.location.href=\'index.html?lang=\' + currentLang'}" class="flex items-center gap-2.5 cursor-pointer active:scale-[0.97] transition-transform shrink-0" title="返回主頁">
                <img src="logo.JPG" alt="Logo" class="w-10 h-10 object-cover rounded-xl border border-slate-100 shadow-sm dark:border-slate-700">
                <div class="flex flex-col justify-center gap-1">
                    <h1 id="appTitle" class="text-[16px] bg-gradient-to-r from-indigo-600 to-blue-700 bg-clip-text text-transparent font-black tracking-tight leading-none dark:from-indigo-400 dark:to-blue-400">慳真D</h1>
                    <span id="todayStatusLabel" class="text-[9px] text-slate-400 font-medium whitespace-nowrap leading-none">載入中...</span>
                </div>
            </div>
            
            <div class="flex items-center gap-2.5 shrink-0">
                <div class="flex items-center gap-1">
                    <span class="hidden min-[390px]:block text-[10px] font-bold text-slate-400 leading-none">EN/中</span>
                    <select id="langSelector" onchange="changeLanguage(this.value)" class="bg-slate-100 border-none text-[11px] font-bold text-slate-700 rounded-md px-1.5 py-1 outline-none cursor-pointer dark:bg-slate-800 dark:text-slate-200 transition-colors">
                        <option value="zh-Hant">繁體</option>
                        <option value="zh-Hans">简体</option>
                        <option value="en">Eng</option>
                    </select>
                </div>

                <div class="flex items-center gap-1.5">
                    <button onclick="toggleTheme()" id="themeBtn" class="w-7 h-7 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 border border-slate-200 shadow-sm active:scale-95 transition-all dark:bg-slate-800 dark:border-slate-700">☀️</button>
                    <button onclick="openMyAlerts()" class="relative w-7 h-7 flex items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100 shadow-sm active:scale-95 transition-all dark:bg-rose-900/30 dark:border-rose-800">🔔</button>
                    <button onclick="openManual()" class="w-7 h-7 flex items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-100 shadow-sm text-[12px] active:scale-95 transition-all dark:bg-amber-900/30 dark:border-amber-800">📖</button>
                    <button onclick="openShareAppModal()" class="w-7 h-7 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm active:scale-95 transition-all dark:bg-blue-900/30 dark:border-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>
                </div>
            </div>
        </div>
    </header>
    `;
    
    // 將 header 插入到 body 的最上方
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
});
