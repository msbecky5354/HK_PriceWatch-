// =====================================================================
// 🧠 PriceWatch - 核心數據適配與算力中樞 (dataCore.js) - 跨語系終極版
// =====================================================================

window.globalSearchDict = {}; // 存放跨語系字典

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
            // 🎯 核心升級：跨語系索引池 (對接 search_dict.json)
            // 如果字典裡有這個 ID 的資料，就把它拿出來；沒有就算了。
            const extraKeywords = window.globalSearchDict[uniqueProdKey] || '';

            // 將原本的英文名字 (prodName) 與字典裡的中英文混合字串 (extraKeywords) 合併
            let rawCombined = `${prodName} ${brandName} ${cat1} ${extraKeywords}`;
            
            let processedKeywords = rawCombined.toLowerCase();

            window.structuredData[cat1][cat2][uniqueProdKey] = {
                originalUniqueName: prodName,
                searchKeywords: window.normalizeStr ? window.normalizeStr(processedKeywords) : processedKeywords,
                brand: brandName,
                brandEn: brandName, 
                enName: prodName,   
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
        
        // =========================================================
        // 🧠 核心升級：對齊 MECE 16 項白名單判定引擎 (修復 realStatus 脫鉤)
        // =========================================================
        let currEffCompare = currentEffPrice;
        let prevEffCompare = parseFloat(p.prevEffPrice);
        let currBase = parsed; 
        let prevBase = parseFloat(p.prevBasePrice);
        
        let hasCompetitors = info.prices.length > 1;
        let isAbsoluteLowest = (minEffectivePrice !== null && Math.abs(currentEffPrice - minEffectivePrice) < 0.01 && validPrices.length > 1 && !allSameEffectivePrice);

        let statusText = '';
        let statusColor = 'border-slate-200 bg-[#F8F8F8] text-slate-500 dark:bg-slate-800 dark:text-slate-400';
        let realStatus = 'maintained'; 

        if (p.statusKey === 'NEW_ADDED' || p.statusKey === 'new') {
            realStatus = 'new';
            statusText = window.currentLang === 'en' ? (hasCompetitors && isAbsoluteLowest ? 'Newly Added' : (hasCompetitors ? 'Secondary New' : 'Newly Added')) : (hasCompetitors && isAbsoluteLowest ? '首次上架' : (hasCompetitors ? '次平首次上架' : '首次上架'));
            statusColor = 'border-[#345B8C]/20 bg-[#E8F0F8] text-[#345B8C] dark:bg-slate-700 dark:text-[#6A95CC]';
        } else if (!isNaN(prevEffCompare) && prevEffCompare > 0) {
            let rawDiff = currEffCompare - prevEffCompare;
            let rawAbsDiffPct = Math.abs((rawDiff / prevEffCompare) * 100);
            let isTolerance = rawAbsDiffPct > 0 && rawAbsDiffPct <= 1 && Math.abs(rawDiff) > 0.0001;

            if (isTolerance) {
                realStatus = 'tolerance';
                if (rawDiff > 0) {
                    statusText = window.currentLang === 'en' ? 'Maintained (Tol. Up)' : '價格維持 (容差內升)';
                } else {
                    statusText = window.currentLang === 'en' ? 'Maintained (Tol. Down)' : '價格維持 (容差內跌)';
                }
            } else if (currEffCompare > prevEffCompare) {
                realStatus = 'increase';
                if (hasCompetitors) {
                    statusText = window.currentLang === 'en' ? 'Competitive Hike' : '競爭加價';
                    statusColor = 'border-red-200 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400';
                } else {
                    statusText = window.currentLang === 'en' ? 'Exclusive Hike' : '獨家加價';
                    statusColor = 'border-red-200 bg-red-50 text-[#be123c] dark:bg-red-900/30 dark:text-[#be123c]';
                }
            } else if (currEffCompare < prevEffCompare) {
                realStatus = 'drop';
                if (hasCompetitors) {
                    if (isAbsoluteLowest) {
                        statusText = window.currentLang === 'en' ? 'True Price Drop' : '真降價';
                        statusColor = 'border-[#8BC34A]/30 bg-[#8BC34A]/10 text-[#558B2F] dark:bg-green-900/30 dark:text-[#AEEA00]';
                    } else {
                        statusText = window.currentLang === 'en' ? 'Secondary Drop' : '次平真降價';
                        statusColor = 'border-[#8BC34A]/30 bg-[#8BC34A]/10 text-[#27ae60] dark:bg-green-900/30 dark:text-[#AEEA00]';
                    }
                } else {
                    statusText = window.currentLang === 'en' ? 'Exclusive Drop' : '獨家降價';
                    statusColor = 'border-[#8BC34A]/30 bg-[#8BC34A]/10 text-[#15803d] dark:bg-green-900/30 dark:text-[#AEEA00]';
                }
            } else {
                // 折實價完全相等 (0% 波幅)
                if (p.promoDisplay !== p.prevOfferZh) {
                    realStatus = 'promo_changed';
                    statusText = window.currentLang === 'en' ? 'Promo Changed' : '優惠變動';
                    statusColor = 'border-[#FFB74D]/30 bg-[#FFF9F2] text-[#E65100] dark:bg-orange-900/30 dark:text-[#FFCC80]';
                } else if (currBase !== prevBase) {
                    realStatus = 'base_changed';
                    statusText = window.currentLang === 'en' ? 'Base Prc Changed' : '底價變動';
                } else {
                    realStatus = 'maintained';
                    statusText = window.currentLang === 'en' ? 'Maintained' : '價格維持';
                }
            }
        } else {
            realStatus = 'maintained';
            statusText = window.currentLang === 'en' ? 'Maintained' : '價格維持';
        }
        // =========================================================

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
                            <button onclick="window.open('https://www.google.com/search?tbm=isch&q=' + encodeURIComponent('${fullSearchQuery}'), '_blank')" class="w-6 h-6 flex items-center justify-center bg-slate-50 border border-slate-200 rounded text-[#345B8C] active:scale-95 transition-transform"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="5" cy="5" r="4"/><line x1="11" y1="11" x2="8" y2="8"/></svg></button> 
                            
                            <button onclick="window.openStatusGuide()" class="w-6 h-6 flex items-center justify-center bg-[#E8F0F8] border border-[#345B8C]/20 rounded text-[#345B8C] dark:bg-slate-700 dark:border-slate-600 dark:text-[#608BC1] active:scale-95 transition-transform" title="狀態標籤說明">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                            </button>
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

// =========================================================
// 📚 狀態標籤指南 (16 項全景 MECE 字典與 Modal 觸發器)
// =========================================================
window.openStatusGuide = function() {
    const dict = {
        'zh-Hant': {
            title: '📊 狀態標籤全景指南',
            content: `
                <div class="space-y-3 text-[13px] text-left max-h-[60vh] overflow-y-auto no-scrollbar pr-1 pb-4">
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-2 border-b dark:border-slate-700 pb-1">🟢 降價陣營</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#558B2F] border border-[#8BC34A]/30">真降價</span> <span>折實價錄得實質下跌，且為全網最低價。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#27ae60] border border-[#8BC34A]/30">次平真降價</span> <span>折實價錄得下跌，但並非全網最低。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#15803d] border border-[#8BC34A]/30">獨家降價</span> <span>僅單一超市發售，且折實價錄得實質下跌。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🔴 加價陣營</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-50 text-red-600 border border-red-200">競爭加價</span> <span>多間超市發售下，折實價錄得實質上升。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-50 text-[#be123c] border border-red-200">獨家加價</span> <span>僅單一超市發售，折實價錄得實質上升。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🟠 促銷變動陣營</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#FFF9F2] text-[#E65100] border border-[#FFB74D]/30">無效促銷</span> <span>表面新增促銷字眼，但折實價並未實質下降。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-600 border border-purple-200">促銷包裝更改</span> <span>促銷條件或搭售數量改變。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-600 border border-teal-200">字眼微調</span> <span>標點符號或無意義字眼改變，條件實質不變。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🆕 新增與其他陣營</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#E8F0F8] text-[#345B8C] border border-[#345B8C]/20">首次上架</span> <span>系統首次紀錄，且為全網最低價。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#E8F0F8] text-[#345B8C] border border-[#345B8C]/20">次平首次</span> <span>系統首次紀錄，但並非全網最低價。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#FFF9F2] text-[#E65100] border border-[#FFB74D]/30">優惠完結</span> <span>舊有促銷活動結束，價格恢復常態。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-300">底價變動</span> <span>折實價不變，但標示的「原價/底價」改變。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-300">資料微調</span> <span>價格與促銷不變，僅系統內部標籤更新。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">⏸️ 維持與容差陣營</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">完全不變 (0%)</span> <span>折實價與促銷字眼 100% 相同。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">容差內升 (≤1%)</span> <span>價格微升 ≤1%，系統視同匯率或尾數微調。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">容差內跌 (≤1%)</span> <span>價格微跌 ≤1%，系統視同匯率或尾數微調。</span></div>
                </div>
            `
        },
        'zh-Hans': {
            title: '📊 状态标签全景指南',
            content: `
                <div class="space-y-3 text-[13px] text-left max-h-[60vh] overflow-y-auto no-scrollbar pr-1 pb-4">
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-2 border-b dark:border-slate-700 pb-1">🟢 降价阵营</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#558B2F] border border-[#8BC34A]/30">真降价</span> <span>折实价录得实质下跌，且为全网最低价。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#27ae60] border border-[#8BC34A]/30">次平真降价</span> <span>折实价录得下跌，但并非全网最低。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#15803d] border border-[#8BC34A]/30">独家降价</span> <span>仅单一超市发售，且折实价录得实质下跌。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🔴 加价阵营</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-50 text-red-600 border border-red-200">竞争加价</span> <span>多间超市发售下，折实价录得实质上升。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-50 text-[#be123c] border border-red-200">独家加价</span> <span>仅单一超市发售，折实价录得实质上升。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🟠 促销变动阵营</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#FFF9F2] text-[#E65100] border border-[#FFB74D]/30">无效促销</span> <span>表面新增促销字眼，但折实价并未实质下降。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-600 border border-purple-200">促销包装更改</span> <span>促销条件或搭售数量改变。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-600 border border-teal-200">字眼微调</span> <span>标点符号或无意义字眼改变，条件实质不变。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🆕 新增与其他阵营</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#E8F0F8] text-[#345B8C] border border-[#345B8C]/20">首次上架</span> <span>系统首次纪录，且为全网最低价。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#E8F0F8] text-[#345B8C] border border-[#345B8C]/20">次平首次</span> <span>系统首次纪录，但并非全网最低价。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#FFF9F2] text-[#E65100] border border-[#FFB74D]/30">优惠完结</span> <span>旧有促销活动结束，价格恢复常态。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-300">底价变动</span> <span>折实价不变，但标示的「原价/底价」改变。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-300">资料微调</span> <span>价格与促销不变，仅系统内部标签更新。</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">⏸️ 维持与容差阵营</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">完全不变 (0%)</span> <span>折实价与促销字眼 100% 相同。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">容差内升 (≤1%)</span> <span>价格微升 ≤1%，系统视同汇率或尾数微调。</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">容差内跌 (≤1%)</span> <span>价格微跌 ≤1%，系统视同汇率或尾数微调。</span></div>
                </div>
            `
        },
        'en': {
            title: '📊 Full Status Labels Guide',
            content: `
                <div class="space-y-3 text-[13px] text-left max-h-[60vh] overflow-y-auto no-scrollbar pr-1 pb-4">
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-2 border-b dark:border-slate-700 pb-1">🟢 Price Drops</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#558B2F] border border-[#8BC34A]/30">True Drop</span> <span>Actual price decreased and is the lowest across market.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#27ae60] border border-[#8BC34A]/30">Sec. Drop</span> <span>Actual price decreased, but not the lowest.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#8BC34A]/10 text-[#15803d] border border-[#8BC34A]/30">Excl. Drop</span> <span>Available in one supermarket, price decreased.</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🔴 Price Hikes</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-50 text-red-600 border border-red-200">Comp. Hike</span> <span>Actual price increased among competitors.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-50 text-[#be123c] border border-red-200">Excl. Hike</span> <span>Actual price increased in a single supermarket.</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🟠 Promotions</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#FFF9F2] text-[#E65100] border border-[#FFB74D]/30">Fake Promo</span> <span>Promo tag added, but actual price didn't drop.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-600 border border-purple-200">Pack Changed</span> <span>Bundle quantity or terms altered.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-50 text-teal-600 border border-teal-200">Wording Adj.</span> <span>Punctuation or minor terms changed, same actual price.</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">🆕 Additions & Others</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#E8F0F8] text-[#345B8C] border border-[#345B8C]/20">Newly Added</span> <span>First recorded, is the lowest price.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#E8F0F8] text-[#345B8C] border border-[#345B8C]/20">Sec. New</span> <span>First recorded, not the lowest price.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#FFF9F2] text-[#E65100] border border-[#FFB74D]/30">Promo Ended</span> <span>Previous promo ended, price back to normal.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-300">Base Changed</span> <span>Actual price maintained, but displayed 'Base Price' changed.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-300">Data Tweaked</span> <span>System internal tag updated, price identical.</span></div>
                    
                    <div class="font-bold text-slate-800 dark:text-slate-200 mt-4 border-b dark:border-slate-700 pb-1">⏸️ Maintained & Tolerance</div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">Maintained (0%)</span> <span>Price and promo terms are 100% identical.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">Tol. Up (≤1%)</span> <span>Micro increase ≤1%, treated as FX/rounding adjustments.</span></div>
                    <div class="flex gap-2 items-start"><span class="shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#F8F8F8] text-slate-500 border border-slate-200">Tol. Down (≤1%)</span> <span>Micro decrease ≤1%, treated as FX/rounding adjustments.</span></div>
                </div>
            `
        }
    };

    const activeLang = window.currentLang || 'zh-Hant';
    const modalData = dict[activeLang] || dict['zh-Hant'];

    const titleEl = document.getElementById('modalTitle');
    const contentEl = document.getElementById('modalContent');
    const infoModal = document.getElementById('infoModal');
    const modalBox = document.getElementById('modalBox');

    if (titleEl && contentEl && infoModal && modalBox) {
        titleEl.innerHTML = modalData.title;
        contentEl.innerHTML = modalData.content;
        
        infoModal.classList.remove('hidden');
        setTimeout(() => { 
            infoModal.classList.remove('opacity-0'); 
            modalBox.classList.remove('scale-95'); 
            modalBox.classList.add('scale-100'); 
        }, 10);
    }
};
// =========================================================