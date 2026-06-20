// footer.js - 統一全站 Footer 與免責聲明彈窗 (Context-Aware 升級版)
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 拆分 Footer 結構
    const footerHtml = `
    <div class="text-center pt-8 pb-8 flex-none w-full z-20 relative"> 
        <button id="miniFooterLinks" onclick="document.getElementById('disclaimerModal').classList.remove('hidden');" 
                class="text-[11px] text-blue-500 dark:text-white hover:text-blue-600 dark:hover:text-slate-300 underline decoration-slate-200 dark:decoration-slate-700 transition">
            關於我們、條款及免責聲明
        </button>
        <div class="text-[10px] text-slate-500 dark:text-slate-100 mt-1.5 tracking-wide flex items-center justify-center transition-colors">
            <span id="miniFooterCopy">© 2026 慳真D</span> 
            <span class="mx-1.5">|</span> 
            <span id="footerDevTeam">開發團隊: </span>
            <a id="footerDevName" href="https://www.facebook.com/share/18j3qqx64K/?mibextid=wwXIfr" target="_blank" class="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 underline transition cursor-pointer ml-1">懶人工具駅</a>
        </div>
    </div>
    `;

    // 2. 拆分 Modal 結構
    const modalHtml = `
    <div id="disclaimerModal" class="hidden fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col max-h-[80vh] border dark:border-slate-700 transition-colors duration-300">
            <div class="flex items-center gap-2 mb-4">
                <span class="text-[20px]">🛡️</span>
                <h2 id="disclaimerTitle" class="text-[17px] font-black text-slate-800 dark:text-slate-100 transition-colors">免責聲明及服務條款</h2>
            </div>        
            <div id="disclaimerBody" class="overflow-y-auto text-[13px] text-slate-600 dark:text-slate-300 space-y-4 pr-1 mb-2 leading-relaxed transition-colors"></div>
            <button onclick="document.getElementById('disclaimerModal').classList.add('hidden')" id="modalCloseBtn" class="mt-4 w-full bg-blue-600 dark:bg-blue-500 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-transform text-[15px] shadow-md shadow-blue-100 dark:shadow-none">我明白及接受</button>
        </div>
    </div>
    `;
    
    // 🛡️ 防禦性設計 1：Modal 永遠放喺 body 最底層，防止 iOS fixed positioning 穿透 Bug
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // 🛡️ 防禦性設計 2：環境感知 (Context-Aware) 注入 Footer
    const level1Inner = document.querySelector('#level1Section > div.flex.flex-col.flex-1');
    
    if (level1Inner) {
        // 如果喺 index.html：安全收納入主頁容器，進入搜尋模式時自然一併隱藏
        level1Inner.insertAdjacentHTML('beforeend', footerHtml);
    } else {
        // 如果喺 dashboard.html 或其他獨立頁面：Fallback 安全寫入 body
        document.body.insertAdjacentHTML('beforeend', footerHtml);
    }

    // 確保插入後，自動觸發一次翻譯以覆蓋語言
    if (typeof updateLocalLanguage === 'function') {
        const curLang = localStorage.getItem('appLang') || 'zh-Hant';
        updateLocalLanguage(curLang);
    }
});
