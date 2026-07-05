// =====================================================================
// 🧠 PriceWatch - 核心數據適配與算力中樞 (dataCore.js) - 極速版
// =====================================================================

window.unwrapData = function(d) {
    if (!d) return [];
    let rawData = d;
    if (!Array.isArray(rawData) && (rawData.results || rawData.data)) rawData = rawData.results || rawData.data;
    if (!Array.isArray(rawData)) rawData = [rawData];
    if (rawData.length > 0) {
        if (rawData[0] && rawData[0].json && rawData[0].json.snapshot_data) return rawData[0].json.snapshot_data;
        if (rawData[0] && rawData[0].snapshot_data) return rawData[0].snapshot_data;
        if (rawData[0] && rawData[0].json) return rawData.map(i => i.json);
    }
    if (rawData.length === 1 && rawData[0] && rawData[0].snapshot_data) return rawData[0].snapshot_data;
    return rawData;
};

window.buildStructuredData = function() {
    if (!window.snapshotData || !Array.isArray(window.snapshotData) || window.snapshotData.length === 0) return;
    window.structuredData = {};

    // 💡 已經徹底移除 rawApiData (pricewatch.json) 嘅翻譯 Map 邏輯

    window.snapshotData.forEach(item => {
        const cat1 = item.c1 || (window.currentLang === 'en' ? 'Uncategorized' : '未分類');
        const cat2 = 'Default';
        const prodName = item.n || '';
        const brandName = item.b || '';
        const uniqueProdKey = item.id || `${brandName}_${prodName}`;

        let rawCode = (item.sm || 'DEFAULT').toUpperCase();
        let smName = item.sm || '未知超市';
        
        if (typeof window.supermarketDict !== 'undefined' && 
            window.supermarketDict[window.currentLang] && 
            window.supermarketDict[window.currentLang][rawCode]) {
            smName = window.supermarketDict[window.currentLang][rawCode]; 
        }

        if (!window.structuredData[cat1]) window.structuredData[cat1] = {};
        if (!window.structuredData[cat1][cat2]) window.structuredData[cat1][cat2] = {};

        if (!window.structuredData[cat1][cat2][uniqueProdKey]) {
            window.structuredData[cat1][cat2][uniqueProdKey] = {
                originalUniqueName: prodName,
                // 直接使用 Snapshot 提供嘅語言數據作為搜尋基礎
                searchKeywords: window.normalizeStr ? window.normalizeStr(`${prodName} ${brandName} ${cat1}`) : `${prodName} ${brandName} ${cat1}`.toLowerCase(),
                brand: brandName,
                brandEn: brandName, // 無英文字典，Fallback 用返本身語言 
                enName: prodName,   // 無英文字典，Fallback 用返本身語言
                prices: []
            };
        }

        let currentKeywords = window.structuredData[cat1][cat2][uniqueProdKey].searchKeywords;
        let appendStr = ` ${rawCode} ${smName} `.toLowerCase();
        if (!currentKeywords.includes(rawCode.toLowerCase())) {
            window.structuredData[cat1][cat2][uniqueProdKey].searchKeywords += appendStr;
        }

        window.structuredData[cat1][cat2][uniqueProdKey].prices.push({
            supermarket: smName,
            rawCode: rawCode,
            basePrice: parseFloat(item.cb_p) || 0,
            effPrice: parseFloat(item.ce_p) || 0,
            promoDisplay: item.co && item.co !== '無' ? item.co : '',
            isCentralCalculated: true,
            prevBasePrice: parseFloat(item.pb_p) || 0,
            prevEffPrice: parseFloat(item.pe_p) || 0,
            prevOfferZh: item.po || '',
            prevOfferEn: item.po || '',
            prevOfferHans: item.po || '',
            statusKey: item.status || 'maintained',
            // 🟢 核心修復：對齊最新 SQL 鍵值，精準讀取真實嘅變動生效日期
            lastChangeDate: item.lc_date|| ''
        });
    });
};

window.checkPriceGap = function(info) {
    let validPrices = info.prices.map(p => !isNaN(p.effPrice) ? p.effPrice : p.basePrice).filter(v => v > 0);
    if (validPrices.length < 2) return { isBigGap: false, percentage: 0 };
    let min = Math.min(...validPrices);
    let max = Math.max(...validPrices);
    if (min === 0) return { isBigGap: false, percentage: 0 };
    let gap = ((max - min) / min) * 100;
    return { isBigGap: gap >= 10, percentage: Math.round(gap) };
};

window.getFilteredProductsHTML = function(keywordToTest) {
    const isAll = ['所有', '全部', 'all', 'list', '*'].includes(keywordToTest) || !keywordToTest;
    let exactMatchProducts = [];
    let fuzzyMatchProducts = [];
    let pureQuery = (keywordToTest || '').trim();
    
    const stripRegex = /[\s\-()\[\]{}（）【】、，。,\/\+!！?功能?？"']/g;
    
    let cleanQuery = pureQuery.toLowerCase().replace(/克/g, 'g').replace(/毫升/g, 'ml').replace(/件/g, '枚').replace(/pack/g, '包').replace(/coke/gi, 'cola');
    let compactQuery = cleanQuery.replace(stripRegex, '');
    
    let queryTokens = cleanQuery.split(stripRegex).filter(t => t.trim().length > 0);
    if (queryTokens.length === 0) queryTokens = [cleanQuery];

    const categoriesToSearch = window.selectedCat1 && window.selectedCat1 !== 'GLOBAL' ? [window.selectedCat1] : Object.keys(window.structuredData);

    categoriesToSearch.forEach(cat1 => {
        if (!window.structuredData[cat1]) return;
        Object.keys(window.structuredData[cat1]).forEach(cat2 => {
            Object.keys(window.structuredData[cat1][cat2]).forEach(productKey => {
                const info = window.structuredData[cat1][cat2][productKey];
                const safeSearchTarget = info.searchKeywords.toLowerCase();
                const hasDiscount = info.prices.some(p => p.effPrice < p.basePrice || p.promoDisplay);
                const matchesDiscount = !window.isDiscountMode || hasDiscount;

                if (matchesDiscount) {
                    let score = 0;
                    if (isAll) { 
                        score = 100; 
                    } else {
                        let cleanTarget = safeSearchTarget.replace(/克/g, 'g').replace(/毫升/g, 'ml').replace(/件/g, '枚').replace(/pack/g, '包');
                        let compactTarget = cleanTarget.replace(stripRegex, '');
                        
                        if (queryTokens.every(token => compactTarget.includes(token))) { 
                            score = 100; 
                        } 
                        else if (window.selectedCat1 && window.selectedCat1 !== 'GLOBAL' && cat1 === window.selectedCat1) {
                            score = 80;
                        }
                        else {
                            let matchCount = 0;
                            queryTokens.forEach(token => {
                                if (compactTarget.includes(token)) {
                                    matchCount++;
                                }
                            });
                            if (matchCount > 0) {
                                score = Math.round((matchCount / queryTokens.length) * 100);
                            }
                        }
                    }

                    if (score >= 60) {
                        const gapInfo = window.checkPriceGap(info);
                        if (window.isBigGapMode && !gapInfo.isBigGap) return;

                        let minEffectivePrice = Infinity;
                        info.prices.forEach(p => {
                            let eff = (!isNaN(p.effPrice) && p.effPrice > 0) ? p.effPrice : p.basePrice;
                            if (eff < minEffectivePrice) minEffectivePrice = eff;
                        });

                        const productData = { pName: info.originalUniqueName, info: info, gapPercent: gapInfo.percentage || 0, minEffectivePrice: minEffectivePrice, score: score };
                        
                        if (score === 100) {
                            exactMatchProducts.push(productData); 
                        } else {
                            fuzzyMatchProducts.push(productData);
                        }
                    }
                }
            });
        });
    });

    const sortFunc = (a, b) => window.isBigGapMode ? b.gapPercent - a.gapPercent : a.minEffectivePrice - b.minEffectivePrice;
    exactMatchProducts.sort(sortFunc);
    fuzzyMatchProducts.sort((a, b) => b.score - a.score);

    return {
        exactHtml: exactMatchProducts.slice(0, 100).map(item => window.generateProductCardHTML(item.pName, item.info)).join(''),
        fuzzyHtml: fuzzyMatchProducts.slice(0, 5).map(item => window.generateProductCardHTML(item.pName, item.info)).join(''),
        exactCount: exactMatchProducts.length,
        fuzzyCount: fuzzyMatchProducts.length
    };
};

window.generateProductCardHTML = function(pName, info) {
    info.prices.sort((a, b) => (a.effPrice || a.basePrice) - (b.effPrice || b.basePrice));
    let validPrices = info.prices.map(p => p.effPrice || p.basePrice).filter(v => !isNaN(v));
    let minBasePrice = Math.min(...info.prices.map(p => p.basePrice).filter(pr => !isNaN(pr)));
    let minEffectivePrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
    let allSameBasePrice = info.prices.filter(p => !isNaN(p.basePrice)).every(v => v.basePrice === minBasePrice);
    let allSameEffectivePrice = validPrices.length > 1 && validPrices.every(v => Math.abs(v - validPrices[0]) < 0.01);

    const gapInfo = window.checkPriceGap(info);
    let gapBadgeHtml = '';
    if (gapInfo.isBigGap) {
        let badgeText = window.currentLang === 'en' ? `Gap ${gapInfo.percentage}%` : (window.currentLang === 'zh-Hans' ? `差价 ${gapInfo.percentage}%` : `差價 ${gapInfo.percentage}%`);
        gapBadgeHtml = `<span class="ml-2 px-2 py-0.5 bg-[#8BC34A]/10 text-[#558B2F] font-bold text-[10px] rounded-md border border-[#8BC34A]/30 inline-flex items-center dark:bg-[#8BC34A]/20 dark:text-[#AEEA00]"><svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>${badgeText}</span>`;
    }

    const priceList = info.prices.map((p, pIdx) => {
        let parsed = p.basePrice;
        let currentEffPrice = p.effPrice || parsed;
        let isLowestBase = (parsed === minBasePrice && info.prices.length > 1 && !allSameBasePrice);
        let code = (p.rawCode || '').toUpperCase();
        let dict = window.supermarketStyleDict || {};
        let style = dict[code] || dict['DEFAULT'] || { indexCard: 'border-slate-100 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-700/30', indexText: 'text-slate-600 dark:text-slate-300' };
        
        let avgLabel = '', fakePromoIcon = ''; 
        if (currentEffPrice < parsed) {
            let isAbsoluteLowest = (minEffectivePrice !== null && Math.abs(currentEffPrice - minEffectivePrice) < 0.01 && validPrices.length > 1 && !allSameEffectivePrice);
            let starHtml = isAbsoluteLowest ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 ml-1 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>` : '';
            avgLabel = `<span class="bg-[#FFB74D] text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold shadow-sm ml-1 flex items-center">${(window.currentLang === 'en' ? 'Avg' : '折合')} $${currentEffPrice.toFixed(1)}/${(window.currentLang === 'en' ? 'ea' : '件')}${starHtml}</span>`;
        } else if (p.isCentralCalculated && currentEffPrice >= parsed && p.promoDisplay) {
            let stampText = (window.currentLang === 'en') ? 'NO OFFER' : (window.currentLang === 'zh-Hans' ? '无实质降价' : '無實質降價');
            fakePromoIcon = `<span class="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-[#FFF9F2] text-[#E65100] rounded-md border border-[#FFB74D]/30 dark:bg-orange-900/30 dark:text-orange-400">${stampText}</span>`;
        }
        
        let prevEffPriceNum = parseFloat(p.prevEffPrice);
        let realStatus = 'maintained';
        if (p.statusKey === 'NEW_ADDED' || p.statusKey === 'new') realStatus = 'new';
        else if (!isNaN(prevEffPriceNum)) {
            if (currentEffPrice < prevEffPriceNum) realStatus = 'drop';      
            else if (currentEffPrice > prevEffPriceNum) realStatus = 'increase'; 
            else if (currentEffPrice === prevEffPriceNum && p.promoDisplay !== p.prevOfferZh) realStatus = 'promo_changed';
        }

        let statusText = '', statusColor = '';
        if (realStatus === 'drop') {
            statusText = window.currentLang === 'en' ? 'Price Drop' : '真降價';
            statusColor = 'border-[#8BC34A]/30 bg-[#8BC34A]/10 text-[#558B2F] dark:bg-green-900/30 dark:text-[#AEEA00]';
        } else if (realStatus === 'new') {
            statusText = window.currentLang === 'en' ? 'New' : '首次上架';
            statusColor = 'border-[#345B8C]/20 bg-[#E8F0F8] text-[#345B8C] dark:bg-slate-700 dark:text-[#6A95CC]';
        } else if (realStatus === 'increase') {
            statusText = window.currentLang === 'en' ? 'Price Up' : '價格暗升';
            statusColor = 'border-red-200 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
        } else if (realStatus === 'promo_changed') {
            statusText = window.currentLang === 'en' ? 'Promo Changed' : '優惠變動';
            statusColor = 'border-[#FFB74D]/30 bg-[#FFF9F2] text-[#E65100] dark:bg-orange-900/30 dark:text-[#FFCC80]';
        } else {
            statusText = window.currentLang === 'en' ? 'Maintained' : '價格維持';
            statusColor = 'border-slate-200 bg-[#F8F8F8] text-slate-500 dark:bg-slate-800 dark:text-slate-400';
        }

        let lastDateText = (p.lastChangeDate && p.lastChangeDate !== 'null') ? String(p.lastChangeDate).substring(0, 10) : '-';
        let prevPriceHtml = (p.prevEffPrice && realStatus !== 'maintained' && realStatus !== 'new') ? `<span class="opacity-75 font-medium">$${parseFloat(p.prevEffPrice).toFixed(1)} &rarr;&nbsp;</span>` : '';
        let prevOfferText = p.prevOfferZh || (window.currentLang === 'en' ? 'None' : '無');

        const uniqueProdId = String(info.searchKeywords).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        const boxId = `hist-${p.rawCode}-${uniqueProdId}-${pIdx}`;
        const iconId = `icon-${p.rawCode}-${uniqueProdId}-${pIdx}`;

       return `<div class="price-row flex flex-col p-3 rounded-2xl border ${style.indexCard} ${isLowestBase ? 'ring-2 ring-green-400 dark:ring-green-500 bg-white dark:bg-slate-800 scale-[1.01] shadow-md z-10' : ''} relative transition-all">
                    <div class="flex justify-between items-start sm:items-center w-full gap-2">
                        <div class="flex items-start sm:items-center flex-1 gap-1 sm:gap-2">
                            <span class="font-black text-[13px] ${style.indexText} w-[95px] sm:w-[130px] shrink-0 leading-tight break-words">${p.supermarket}</span>
                            
                            <div class="flex flex-col items-start relative mt-0.5 sm:mt-0 z-20">
                                <div class="inline-flex items-center gap-1.5 cursor-pointer" onclick="window.toggleHistoryBox('${boxId}', '${iconId}', event)">
                                    <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${statusColor} shadow-sm">${prevPriceHtml}${statusText}</span>
                                    <div class="bg-[#F8F8F8] dark:bg-slate-700 rounded-full p-0.5 border border-slate-200 dark:border-slate-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" id="${iconId}" class="history-icon w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                                <div id="${boxId}" class="history-dropdown hidden mt-1.5 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 text-[11px] text-slate-500 absolute top-full left-0 shadow-lg z-50 space-y-2 min-w-[160px]">
                                    <div class="flex justify-between"><span>上次變動:</span> <strong>${lastDateText}</strong></div>
                                    <div class="flex justify-between"><span>上次原價:</span> <strong>$${parseFloat(p.prevBasePrice || 0).toFixed(1)}</strong></div>
                                    <div class="flex justify-between"><span>上次折實:</span> <strong class="text-[#345B8C]">$${parseFloat(p.prevEffPrice || 0).toFixed(1)}</strong></div>
                                    <div class="flex justify-between pt-1.5 border-t border-slate-100"><span class="shrink-0">上次優惠:</span> <span class="truncate max-w-[100px]">${prevOfferText}</span></div>
                                </div>
                            </div>
                        </div>
                        <span class="text-[17px] font-black text-[#345B8C] dark:text-[#608BC1] flex items-center shrink-0">
                            $${parsed.toFixed(1)}
                            ${isLowestBase ? `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-1.5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>` : ''}
                        </span>
                    </div>
                    ${p.promoDisplay ? `<div class="mt-2 flex items-center justify-between gap-1 w-full"><span class="text-[11px] font-bold text-[#E65100] bg-[#FFF9F2] px-2 py-0.5 rounded-md border border-[#FFB74D]/30 flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"></path></svg> ${p.promoDisplay}</span><div class="flex items-center">${fakePromoIcon}${avgLabel}</div></div>` : ''}
                </div>`;
    }).join('');

    let fullSearchQuery = pName.replace(/'/g, "\\'").replace(/"/g, "&quot;");
    let displayZhName = pName;
    if (info.brand && displayZhName.startsWith(info.brand + ' - ')) displayZhName = displayZhName.substring(info.brand.length + 3);
    
    // 💡 因為飛走咗英文字典，一律顯示原始 snapshot 個名
    let defaultDisplayName = displayZhName;

    return `<div class="product-card bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-4 relative">
                <div class="flex justify-between items-start gap-3">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <div class="product-brand text-[12px] text-[#345B8C] font-black tracking-widest uppercase">${info.brand || '綜合品牌'}</div>
                            <button onclick="window.open('https://www.google.com/search?tbm=isch&q=' + encodeURIComponent('${fullSearchQuery}'), '_blank')" class="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-200 rounded text-[#345B8C]"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="5" cy="5" r="4"/><line x1="11" y1="11" x2="8" y2="8"/></svg></button> 
                        </div>
                        <h3 class="font-bold text-slate-800 dark:text-slate-100 text-[16px] leading-tight break-words flex flex-wrap items-center gap-1">
                            <span class="product-name">${defaultDisplayName}</span>
                            ${gapBadgeHtml} </h3>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                        <button onclick="if(typeof openAlertModal === 'function') openAlertModal('${fullSearchQuery}', '${minBasePrice}')" class="w-9 h-9 flex items-center justify-center rounded-full bg-[#F8F8F8] text-slate-400 border border-slate-200"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
                        <button onclick="window.shareProduct('${displayZhName.replace(/'/g, "\\'")}', '${info.brand}', '${minBasePrice}')" class="w-9 h-9 flex items-center justify-center rounded-full bg-[#345B8C] text-white"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
                    </div>
                </div>
                <div class="flex flex-col gap-2.5">${priceList}</div>
            </div>`;
};