// alertSystem.js - 慳真D🔎 純前端到價提醒系統 (修正：支援 index 與 true_discount 雙頁面)

// 修正後的數據獲取函數
function getCurrentMinPrice(pName) {
    // 1. 如果是 index.html (透過 structuredData)
    if (window.structuredData) {
        for (let cat1 in window.structuredData) {
            for (let cat2 in window.structuredData[cat1]) {
                if (window.structuredData[cat1][cat2][pName]) {
                    const info = window.structuredData[cat1][cat2][pName];
                    let validPrices = info.prices.map(p => parseFloat(p.price)).filter(p => !isNaN(p));
                    return validPrices.length > 0 ? Math.min(...validPrices) : null;
                }
            }
        }
    } 
    // 2. 如果是 true_discount.html (透過 fullDataList)
    else if (typeof fullDataList !== 'undefined') {
        const product = fullDataList.find(item => {
            const name = typeof item.name === 'object' ? (item.name['zh-Hant'] || '') : item.name;
            return name === pName;
        });
        if (product) return product.effectivePrice;
    }
    return null;
}

// (以下保持 alertModal, saveAlert 等函數不變，只需確保上面的 getCurrentMinPrice 修正即可)
// ... [其餘原本的程式碼保持不動] ...



// 1. 打開設定心水價彈窗
function openAlertModal(pName, currentMinPrice) {
    // 🌐 多語言設定包底
    let tTitle = "設定到價提醒";
    let tCurrent = "目前最抵折實價：";
    let tPrompt = "當跌穿以下心水價 (HK$) 時提醒我：";
    let tPrivacy = "<b>私隱保證：</b>本功能採用離線運算技術，追蹤清單只會存在你的手機瀏覽器內，絕對不會收集任何個人資料。";
    let tBtn = "加入追蹤清單";

    if (typeof uiText !== 'undefined' && uiText[currentLang]) {
        if (uiText[currentLang].alertModalTitle) tTitle = uiText[currentLang].alertModalTitle;
        if (uiText[currentLang].alertModalCurrentPrice) tCurrent = uiText[currentLang].alertModalCurrentPrice;
        if (uiText[currentLang].alertModalTargetPrompt) tPrompt = uiText[currentLang].alertModalTargetPrompt;
        if (uiText[currentLang].alertModalPrivacy) tPrivacy = uiText[currentLang].alertModalPrivacy;
        if (uiText[currentLang].alertModalBtn) tBtn = uiText[currentLang].alertModalBtn;
    }

    let modal = document.getElementById('priceAlertModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'priceAlertModal';
        modal.className = 'fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col transform scale-95 transition-all duration-300 border dark:border-slate-700" id="priceAlertBox">
            <div class="flex justify-between items-center mb-4 border-b pb-3 border-slate-100 dark:border-slate-700">
                <h3 class="text-[17px] font-black text-slate-800 dark:text-slate-100 flex items-center gap-2"><span class="text-amber-500">🔔</span> ${tTitle}</h3>
                <button onclick="closeAlertModal()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold active:scale-90 transition">✕</button>
            </div>
            <p class="text-[14px] text-slate-700 dark:text-slate-200 mb-2 font-black leading-tight" id="alertProductName">${pName}</p>
            <p class="text-[12px] text-slate-500 dark:text-slate-400 mb-4">${tCurrent}<span id="alertCurrentPrice" class="font-bold text-blue-600 dark:text-blue-400 text-[14px] ml-1">$${currentMinPrice}</span></p>
            
            <div class="mb-5">
                <label class="block text-[12px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">${tPrompt}</label>
                <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input type="number" id="targetPriceInput" step="0.1" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 pl-8 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500 font-black text-[18px] text-slate-800 dark:text-slate-100 transition-all shadow-sm inset-y-0">
                </div>
            </div>
            
            <div class="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl mb-5 border border-emerald-100 dark:border-emerald-800 flex gap-2 items-start">
                <span class="text-[14px]">🛡️</span>
                <p class="text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium mt-0.5">${tPrivacy}</p>
            </div>
            
            <button onclick="saveAlert()" class="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition-all shadow-md shadow-amber-200/50 dark:shadow-none text-[15px]">
                ${tBtn}
            </button>
        </div>
    `;
    
    // 預設幫用戶打個9折做心水價
    let suggestedPrice = parseFloat(currentMinPrice) * 0.9;
    document.getElementById('targetPriceInput').value = suggestedPrice.toFixed(1); 
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        document.getElementById('priceAlertBox').classList.remove('scale-95');
    }, 10);
}

function closeAlertModal() {
    const modal = document.getElementById('priceAlertModal');
    if(modal) {
        modal.classList.add('opacity-0');
        const box = document.getElementById('priceAlertBox');
        if(box) box.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

// 2. 儲存設定到 localStorage
function saveAlert() {
    const pName = document.getElementById('alertProductName').innerText;
    const targetPrice = parseFloat(document.getElementById('targetPriceInput').value);
    
    let errorMsg = "請輸入有效的心水價！";
    if (typeof uiText !== 'undefined' && uiText[currentLang] && uiText[currentLang].alertInvalidPrice) {
        errorMsg = uiText[currentLang].alertInvalidPrice;
    }

    if (isNaN(targetPrice) || targetPrice <= 0) {
        alert(errorMsg); return;
    }

    let myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    myAlerts[pName] = { 
        targetPrice: targetPrice, 
        dateAdded: new Date().getTime() 
    };
    localStorage.setItem('hk_price_alerts', JSON.stringify(myAlerts));

    closeAlertModal();
    if(typeof showToast === 'function') showToast(); 
    updateAlertBadge();
}

function removeAlert(pName) {
    let myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    delete myAlerts[pName];
    localStorage.setItem('hk_price_alerts', JSON.stringify(myAlerts));
    openMyAlerts(); // 重新整理清單
    updateAlertBadge();
}

// 3. 更新 Header 嘅通知紅點狀態
function updateAlertBadge() {
    const myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    const badge = document.getElementById('alertBadge');
    if (!badge) return;

    const alertKeys = Object.keys(myAlerts);
    if (alertKeys.length === 0) {
        badge.classList.add('hidden');
        return;
    }

    badge.classList.remove('hidden');
    
    let hasReachedTarget = false;
    for (let pName of alertKeys) {
        let currentPrice = getCurrentMinPrice(pName);
        if (currentPrice !== null && currentPrice <= myAlerts[pName].targetPrice) {
            hasReachedTarget = true;
            break;
        }
    }

    if (hasReachedTarget) {
        badge.className = "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-800 rounded-full animate-pulse";
    } else {
        badge.className = "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800 rounded-full";
    }
}

// 4. 打開「我的追蹤」通知中心
function openMyAlerts() {
    let tListTitle = "我的追蹤清單";
    let tEmpty = "<span class='text-3xl block mb-2'>📭</span>你尚未追蹤任何貨品。<br>喺產品卡片撳 🔔 就可以加入追蹤！";
    let tHit = "到價！而家";
    let tCurrent = "現價:";
    let tTarget = "心水價:";
    let tClose = "關閉";

    if (typeof uiText !== 'undefined' && uiText[currentLang]) {
        if (uiText[currentLang].alertListTitle) tListTitle = uiText[currentLang].alertListTitle;
        if (uiText[currentLang].alertListEmpty) tEmpty = uiText[currentLang].alertListEmpty;
        if (uiText[currentLang].alertListHit) tHit = uiText[currentLang].alertListHit;
        if (uiText[currentLang].alertListCurrent) tCurrent = uiText[currentLang].alertListCurrent;
        if (uiText[currentLang].alertListTarget) tTarget = uiText[currentLang].alertListTarget;
        if (uiText[currentLang].alertListClose) tClose = uiText[currentLang].alertListClose;
    }

    let modal = document.getElementById('myAlertsListModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'myAlertsListModal';
        modal.className = 'fixed inset-0 bg-slate-900/40 dark:bg-slate-900/80 z-[100] hidden flex items-center justify-center p-4 backdrop-blur-sm transition-opacity opacity-0';
        document.body.appendChild(modal);
    }

    const myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    const alertKeys = Object.keys(myAlerts);
    
    let listHtml = '';
    if (alertKeys.length === 0) {
        listHtml = `<div class="text-center py-10 text-slate-400 dark:text-slate-500 text-[13px]">${tEmpty}</div>`;
    } else {
        listHtml = alertKeys.map(pName => {
            let data = myAlerts[pName];
            let currentPrice = getCurrentMinPrice(pName);
            let isHit = currentPrice !== null && currentPrice <= data.targetPrice;
            
            let statusBadge = isHit 
                ? `<span class="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold animate-pulse shadow-sm">${tHit} $${currentPrice.toFixed(1)}</span>`
                : `<span class="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-[10px] px-1.5 py-0.5 rounded-md font-bold">${tCurrent} $${currentPrice !== null ? currentPrice.toFixed(1) : '--'}</span>`;

            let bgClass = isHit ? 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-900' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700';

            return `
            <div class="p-3 rounded-2xl border ${bgClass} shadow-sm dark:shadow-none flex items-center justify-between gap-3 transition-all relative overflow-hidden">
                <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-black text-slate-700 dark:text-slate-200 leading-tight mb-1">${pName}</div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-[11px] text-slate-500 dark:text-slate-400 font-medium">${tTarget} <b class="text-slate-700 dark:text-slate-300">$${data.targetPrice}</b></span>
                        ${statusBadge}
                    </div>
                </div>
                <button onclick="removeAlert('${pName}')" class="w-7 h-7 flex-none flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 hover:text-red-500 dark:hover:text-red-400 active:scale-90 transition">✕</button>
            </div>
            `;
        }).join('');
    }

    modal.innerHTML = `
        <div class="bg-slate-50 dark:bg-slate-900 rounded-3xl max-w-sm w-full shadow-2xl flex flex-col transform scale-95 transition-transform duration-300 max-h-[85vh] border dark:border-slate-700" id="myAlertsListBox">
            <div class="bg-white dark:bg-slate-800 rounded-t-3xl px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shrink-0">
                <h3 class="text-[16px] font-black text-slate-800 dark:text-slate-100 flex items-center gap-2"><span class="text-rose-500">🔔</span> ${tListTitle}</h3>
                <button onclick="closeMyAlerts()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold active:scale-90 transition">✕</button>
            </div>
            
            <div class="overflow-y-auto p-4 space-y-3 no-scrollbar flex-1">
                ${listHtml}
            </div>
            
            <div class="bg-white dark:bg-slate-800 rounded-b-3xl p-4 border-t border-slate-100 dark:border-slate-700 shrink-0">
                <button onclick="closeMyAlerts()" class="w-full bg-slate-800 dark:bg-slate-700 text-white font-bold py-3.5 rounded-2xl active:scale-95 transition shadow-md dark:shadow-none text-[14px]">
                    ${tClose}
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        const box = document.getElementById('myAlertsListBox');
        if(box) box.classList.remove('scale-95');
        
        // 💡 關鍵修正：打開通知中心後，立即檢查一次狀態並更新紅點
        if (typeof updateAlertBadge === 'function') {
            updateAlertBadge();
        }
    }, 10);
}

function closeMyAlerts() {
    const modal = document.getElementById('myAlertsListModal');
    if(modal) {
        modal.classList.add('opacity-0');
        const box = document.getElementById('myAlertsListBox');
        if(box) box.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function updateAlertBadge() {
    const badge = document.getElementById('alertBadge');
    if (!badge) return;

    // 1. 使用正確的 Key：'hk_price_alerts'
    const myAlerts = JSON.parse(localStorage.getItem('hk_price_alerts') || '{}');
    const alertKeys = Object.keys(myAlerts);

    if (alertKeys.length === 0) {
        badge.classList.add('hidden');
        return;
    }

    // 2. 檢查是否有任何產品已經達到目標價
    let hasReachedTarget = false;
    for (let pName of alertKeys) {
        let currentPrice = getCurrentMinPrice(pName); // 這是你原有的 Helper 函數
        if (currentPrice !== null && currentPrice <= myAlerts[pName].targetPrice) {
            hasReachedTarget = true;
            break; // 只要有一個達到就顯示紅點
        }
    }

    // 3. 根據結果顯示或隱藏紅點
    if (hasReachedTarget) {
        badge.classList.remove('hidden');
        // 可選：如果你想要紅點閃爍效果，可以加上 pulse class
        badge.classList.add('animate-pulse'); 
    } else {
        badge.classList.add('hidden');
        badge.classList.remove('animate-pulse');
    }
}
