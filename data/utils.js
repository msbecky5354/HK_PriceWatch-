// utils.js 終極藍圖版 (支援複合優惠擂台對決 + 15大 Case Study 詳盡註解)
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return { status: 'ERROR_EXCEPTION', price: null, formula: 'Error' };

    try {
        // ==========================================
        // 🛠️ 預處理 1：複合優惠拆解 (The Wrapper)
        // 將字串用 '/' 劈開，獨立成多個 offer，準備掟上擂台
        // ==========================================
        let rawOffers = enPromoText.split('/');
        
        let bestPrice = null;     // 擂台王者：最低折實價
        let bestFormula = 'Unparsed';
        let bestStatus = 'ERROR_UNPARSED';

        // ⚔️ 擂台對決：逐個拆出嚟嘅優惠進行獨立計算
        for (let i = 0; i < rawOffers.length; i++) {
            let offer = rawOffers[i].trim();
            
            // 🛡️ 神級過濾器：如果呢一截字串，連核心優惠字眼都冇，當「廢氣」飛走
            if (!/(buy|add|get|save|for|%)/i.test(offer)) {
                continue; 
            }

            // ==========================================
            // 🛠️ 預處理 2：字串清理防禦
            // ==========================================
            let p = offer.toLowerCase().replace(/\s+/g, ' '); 
            p = p.replace(/\.(?!\d)/g, ''); 
            
            // 修復超市 API 漏空格盲區 (例: "Buy2get1Free" -> "buy 2 get 1 free")
            p = p.replace(/(buy|add|get|save)\s*(\d+)/g, '$1 $2');
            
            const getNum = (n) => parseFloat(n);
            const is2nd = p.includes('2nd') || p.includes('second');

            // ==========================================
            // 🎯 正則表達式攔截網 (Regex Matchers)
            // ==========================================
            // 🚨 優先攔截盲區 (Priority Intercept Cases)
            let mAddToCart = p.match(/add\s+(\d+).*?get\s+(\d+)\s+free/);       // Case 13
            let mShorthand = p.match(/x\s*(\d+)\s*,\s*([0-9.]+)%\s*off/);       // Case 14
            let mOrMore    = p.match(/(\d+)\s*or\s*more\s*([0-9.]+)%\s*off/);   // Case 15
            
            // 📊 核心常規攔截 (Core Regex Cases)
            let mGetFor     = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?(?:for|at)\s*\$([0-9.]+)/); // Case 1
            let mSave       = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?save.*?\$([0-9.]+)/);                           // Case 2
            let mGetHalf    = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?half/);                     // Case 3
            let mGetPerc    = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b\s+([0-9.]+)%\s*off/);         // Case 4
            let mBuyPercOff = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:to\s*)?(?:get|enjoy)\s+([0-9.]+)%\s*off/);     // Case 5
            let mGetFree    = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:get|free).*?\b([0-9]+)\b(?!\s*%)/);           // Case 6
            let m2ndFor     = p.match(/(?:second|2nd).*?(?:for|at)\s*\$([0-9.]+)/);                                  // Case 7
            let m2ndPerc    = p.match(/(?:second|2nd).*?([0-9.]+)%|([0-9.]+)%.*?(?:second|2nd)/);                    // Case 9
            let mFor        = p.match(/\b([0-9]+)\b[^\d\$]*\$([0-9.]+)/);                                            // Case 10
            let mPerc       = p.match(/([0-9.]+)%\s*off/);                                                           // Case 11

            let currentPrice = null;
            let currentFormula = '';

            // ==========================================
            // 🧮 執行運算 (依優先級別嚴格向下過濾)
            // ==========================================

            // 🚨 Case 13: 購物車陷阱 (例如: Add 2 item(s) to cart and get 1 free)
            if (mAddToCart) {
                let totalItems = getNum(mAddToCart[1]), freeItems = getNum(mAddToCart[2]), paidItems = totalItems - freeItems;
                if (totalItems > freeItems && paidItems > 0) { 
                    currentPrice = (originalPrice * paidItems) / totalItems; 
                    currentFormula = `(${originalPrice} * ${paidItems}) / ${totalItems} [Case 13]`; 
                }
            }
            // 🚨 Case 14: 極簡縮寫 (例如: Sel Sanitary x3,30%off)
            else if (mShorthand) {
                let discount = getNum(mShorthand[2]); 
                currentPrice = originalPrice * (1 - (discount / 100)); 
                currentFormula = `${originalPrice} * (1 - (${discount} / 100)) [Case 14]`;
            }
            // 🚨 Case 15: 或以上折扣 (例如: 2 Or More 25%Off)
            else if (mOrMore) {
                let discount = getNum(mOrMore[2]); 
                currentPrice = originalPrice * (1 - (discount / 100)); 
                currentFormula = `${originalPrice} * (1 - (${discount} / 100)) [Case 15]`;
            }
            // 📊 Case 1: 買 X 件，第 Y 件特價 (例如: Buy 2 get 1 for $10)
            else if (mGetFor) {
                currentPrice = (originalPrice * getNum(mGetFor[1]) + getNum(mGetFor[3])) / (getNum(mGetFor[1]) + getNum(mGetFor[2])); 
                currentFormula = `(${originalPrice} * ${mGetFor[1]} + ${mGetFor[3]}) / (${mGetFor[1]} + ${mGetFor[2]}) [Case 1]`;
            }
            // 📊 Case 2: 買 X 件慳 Y 蚊 (例如: Buy 3 to save $45)
            else if (mSave) {
                currentPrice = (originalPrice * getNum(mSave[1]) - getNum(mSave[2])) / getNum(mSave[1]); 
                currentFormula = `(${originalPrice} * ${mSave[1]} - ${mSave[2]}) / ${mSave[1]} [Case 2]`;
            }
            // 📊 Case 3: 買 X 件，第 Y 件半價 (例如: Buy 2 get 1 half price)
            else if (mGetHalf) {
                currentPrice = (originalPrice * getNum(mGetHalf[1]) + (originalPrice * 0.5 * getNum(mGetHalf[2]))) / (getNum(mGetHalf[1]) + getNum(mGetHalf[2])); 
                currentFormula = `(${originalPrice} * ${mGetHalf[1]} + (${originalPrice} * 0.5 * ${mGetHalf[2]})) / (${mGetHalf[1]} + ${mGetHalf[2]}) [Case 3]`;
            }
            // 📊 Case 4: 買 X 件，第 Y 件打折 (例如: Buy 2 get 1 30% off)
            else if (mGetPerc) {
                currentPrice = (originalPrice * getNum(mGetPerc[1]) + (originalPrice * (1 - getNum(mGetPerc[3])/100) * getNum(mGetPerc[2]))) / (getNum(mGetPerc[1]) + getNum(mGetPerc[2])); 
                currentFormula = `(${originalPrice} * ${mGetPerc[1]} + (${originalPrice} * (1 - ${mGetPerc[3]}/100) * ${mGetPerc[2]})) / (${mGetPerc[1]} + ${mGetPerc[2]}) [Case 4]`;
            }
            // 📊 Case 5: 買滿 X 件全單打折 (例如: Buy 3 to enjoy 15% off)
            else if (mBuyPercOff) {
                currentPrice = originalPrice * (1 - (getNum(mBuyPercOff[2]) / 100)); 
                currentFormula = `${originalPrice} * (1 - (${mBuyPercOff[2]} / 100)) [Case 5]`;
            }
            // 📊 Case 6: 買 X 送 Y (例如: Buy 2 get 1 free)
            else if (mGetFree) {
                currentPrice = (originalPrice * getNum(mGetFree[1])) / (getNum(mGetFree[1]) + getNum(mGetFree[2])); 
                currentFormula = `(${originalPrice} * ${mGetFree[1]}) / (${mGetFree[1]} + ${mGetFree[2]}) [Case 6]`;
            }
            // 📊 Case 7: 第二件一口價 (例如: 2nd for $20)
            else if (m2ndFor) {
                currentPrice = (originalPrice + getNum(m2ndFor[1])) / 2; 
                currentFormula = `(${originalPrice} + ${m2ndFor[1]}) / 2 [Case 7]`;
            }
            // 📊 Case 8: 第二件半價 (例如: 2nd item half price)
            else if (p.match(/(?:second|2nd).*?half/)) {
                currentPrice = (originalPrice * 1.5) / 2; 
                currentFormula = `(${originalPrice} * 1.5) / 2 [Case 8]`;
            }
            // 📊 Case 9: 第二件打折 (例如: 2nd 40% off)
            else if (m2ndPerc) {
                let perc = getNum(m2ndPerc[1] || m2ndPerc[2]); 
                currentPrice = (originalPrice * (2 - (perc / 100))) / 2; 
                currentFormula = `(${originalPrice} * (2 - (${perc} / 100))) / 2 [Case 9]`;
            }
            // 📊 Case 10: X 件 Y 蚊 - 超級萬用網 (例如: 3 for $210 / 3 pcs $210)
            else if (mFor && !is2nd) {
                currentPrice = getNum(mFor[2]) / getNum(mFor[1]); 
                currentFormula = `${mFor[2]} / ${mFor[1]} [Case 10]`;
            }
            // 📊 Case 11: 淨係寫住打幾多折 (例如: 25% off)
            else if (mPerc && !is2nd) {
                currentPrice = originalPrice * (1 - (getNum(mPerc[1]) / 100)); 
                currentFormula = `${originalPrice} * (1 - (${mPerc[1]} / 100)) [Case 11]`;
            }
            // 📊 Case 12: 淨半價字眼 (例如: Selected items half price)
            else if (p.includes('half price') && !is2nd) {
                currentPrice = originalPrice * 0.5; 
                currentFormula = `${originalPrice} * 0.5 [Case 12]`;
            }

            // ==========================================
            // ⚖️ 擂台比對機制 (Comparison)
            // ==========================================
            // 🛡️ 終極防線校驗: 只有折實價大過底價 5% 先會被接納為有效算力
            if (currentPrice !== null && currentPrice >= (originalPrice * 0.05)) {
                // 如果係第一次計，或者今次計出嚟平過舊記錄 (自動取最抵優惠)
                if (bestPrice === null || currentPrice < bestPrice) {
                    bestPrice = currentPrice;
                    bestFormula = currentFormula;
                    bestStatus = 'OK';
                }
            }
        } // 🔄 for loop 完結

        // 🏆 宣佈賽果
        if (bestPrice !== null) {
            return { status: bestStatus, price: parseFloat(bestPrice.toFixed(2)), formula: bestFormula };
        }
        
        return { status: 'ERROR_UNPARSED', price: null, formula: 'Unparsed' };

    } catch(e) { 
        return { status: 'ERROR_EXCEPTION', price: null, formula: 'Error' };
    }
}

module.exports = { calculateAvgPrice };