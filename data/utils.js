// utils.js 終極修正版 (包含 15 大陣列與清晰註解結構)
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return { status: 'ERROR_EXCEPTION', price: null, formula: 'Error' };

    let finalPrice = null;
    let formulaStr = 'Unparsed';

    try {
        // ==========================================
        // 🧹 1. 數據預處理 (Data Pre-processing)
        // ==========================================
        let p = enPromoText.toLowerCase().replace(/\s+/g, ' '); 
        p = p.replace(/\.(?!\d)/g, ''); 
        
        // 自動修復連字盲區 (例如 "Buy1" -> "Buy 1")
        p = p.replace(/(buy|add|get|save)\s*(\d+)/g, '$1 $2');
        
        const getNum = (n) => parseFloat(n);
        const is2nd = p.includes('2nd') || p.includes('second');

        // ==========================================
        // 🎯 2. 正則表達式攔截網 (Regex Matchers)
        // ==========================================
        
        // 🚨 [新增盲區] 優先攔截陷阱
        let mAddToCart = p.match(/add\s+(\d+).*?get\s+(\d+)\s+free/);       // Case 13: 購物車陷阱
        let mShorthand = p.match(/x\s*(\d+)\s*,\s*([0-9.]+)%\s*off/);       // Case 14: 極簡縮寫
        let mOrMore    = p.match(/(\d+)\s*or\s*more\s*([0-9.]+)%\s*off/);   // Case 15: 或以上折扣

        // 📊 [原有公式] 常規攔截
        let mGetFor     = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?(?:for|at)\s*\$([0-9.]+)/);
        let mSave       = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?save.*?\$([0-9.]+)/);
        let mGetHalf    = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?half/);
        let mGetPerc    = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b\s+([0-9.]+)%\s*off/);
        let mBuyPercOff = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:to\s*)?(?:get|enjoy)\s+([0-9.]+)%\s*off/);
        let mGetFree    = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:get|free).*?\b([0-9]+)\b(?!\s*%)/);
        let m2ndFor     = p.match(/(?:second|2nd).*?(?:for|at)\s*\$([0-9.]+)/);
        let m2ndPerc    = p.match(/(?:second|2nd).*?([0-9.]+)%|([0-9.]+)%.*?(?:second|2nd)/);
        let mFor        = p.match(/\b([0-9]+)\b[^\d\$]*\$([0-9.]+)/);
        let mPerc       = p.match(/([0-9.]+)%\s*off/);

        // ==========================================
        // 🧮 3. 執行運算 (依優先級別嚴格向下過濾)
        // ==========================================

        // Case 13: 購物車陷阱 (要畀錢嘅件數 = 總數 - 送嘅數量)
        if (mAddToCart) {
            let totalItems = getNum(mAddToCart[1]);
            let freeItems = getNum(mAddToCart[2]);
            let paidItems = totalItems - freeItems;
            
            if (totalItems > freeItems && paidItems > 0) {
                finalPrice = (originalPrice * paidItems) / totalItems;
                formulaStr = `(${originalPrice} * ${paidItems}) / ${totalItems} [Case 13: Cart Trap]`;
            }
        }
        // Case 14: 極簡縮寫 (直接按百分比打折)
        else if (mShorthand) {
            let discount = getNum(mShorthand[2]);
            finalPrice = originalPrice * (1 - (discount / 100));
            formulaStr = `${originalPrice} * (1 - (${discount} / 100)) [Case 14: Shorthand]`;
        }
        // Case 15: 或以上折扣 (直接按百分比打折)
        else if (mOrMore) {
            let discount = getNum(mOrMore[2]);
            finalPrice = originalPrice * (1 - (discount / 100));
            formulaStr = `${originalPrice} * (1 - (${discount} / 100)) [Case 15: Or More]`;
        }
        // Case 1: 買 X 件，第 Y 件特價
        else if (mGetFor) {
            finalPrice = (originalPrice * getNum(mGetFor[1]) + getNum(mGetFor[3])) / (getNum(mGetFor[1]) + getNum(mGetFor[2]));
            formulaStr = `(${originalPrice} * ${mGetFor[1]} + ${mGetFor[3]}) / (${mGetFor[1]} + ${mGetFor[2]}) [Case 1]`;
        }
        // Case 2: 買 X 件慳 Y 蚊
        else if (mSave) {
            finalPrice = (originalPrice * getNum(mSave[1]) - getNum(mSave[2])) / getNum(mSave[1]);
            formulaStr = `(${originalPrice} * ${mSave[1]} - ${mSave[2]}) / ${mSave[1]} [Case 2]`;
        }
        // Case 3: 買 X 件，第 Y 件半價
        else if (mGetHalf) {
            finalPrice = (originalPrice * getNum(mGetHalf[1]) + (originalPrice * 0.5 * getNum(mGetHalf[2]))) / (getNum(mGetHalf[1]) + getNum(mGetHalf[2]));
            formulaStr = `(${originalPrice} * ${mGetHalf[1]} + (${originalPrice} * 0.5 * ${mGetHalf[2]})) / (${mGetHalf[1]} + ${mGetHalf[2]}) [Case 3]`;
        }
        // Case 4: 買 X 件，第 Y 件打折
        else if (mGetPerc) {
            finalPrice = (originalPrice * getNum(mGetPerc[1]) + (originalPrice * (1 - getNum(mGetPerc[3])/100) * getNum(mGetPerc[2]))) / (getNum(mGetPerc[1]) + getNum(mGetPerc[2]));
            formulaStr = `(${originalPrice} * ${mGetPerc[1]} + (${originalPrice} * (1 - ${mGetPerc[3]}/100) * ${mGetPerc[2]})) / (${mGetPerc[1]} + ${mGetPerc[2]}) [Case 4]`;
        }
        // Case 5: 買滿 X 件全單打折
        else if (mBuyPercOff) {
            finalPrice = originalPrice * (1 - (getNum(mBuyPercOff[2]) / 100));
            formulaStr = `${originalPrice} * (1 - (${mBuyPercOff[2]} / 100)) [Case 5]`;
        }
        // Case 6: 買 X 送 Y
        else if (mGetFree) {
            finalPrice = (originalPrice * getNum(mGetFree[1])) / (getNum(mGetFree[1]) + getNum(mGetFree[2]));
            formulaStr = `(${originalPrice} * ${mGetFree[1]}) / (${mGetFree[1]} + ${mGetFree[2]}) [Case 6]`;
        }
        // Case 7: 第二件一口價
        else if (m2ndFor) {
            finalPrice = (originalPrice + getNum(m2ndFor[1])) / 2;
            formulaStr = `(${originalPrice} + ${m2ndFor[1]}) / 2 [Case 7]`;
        }
        // Case 8: 第二件半價 (純字眼捕捉)
        else if (p.match(/(?:second|2nd).*?half/)) {
            finalPrice = (originalPrice * 1.5) / 2;
            formulaStr = `(${originalPrice} * 1.5) / 2 [Case 8]`;
        }
        // Case 9: 第二件打折
        else if (m2ndPerc) {
            let perc = getNum(m2ndPerc[1] || m2ndPerc[2]);
            finalPrice = (originalPrice * (2 - (perc / 100))) / 2;
            formulaStr = `(${originalPrice} * (2 - (${perc} / 100))) / 2 [Case 9]`;
        }
        // Case 10: X 件 Y 蚊 (萬用網)
        else if (mFor && !is2nd) {
            finalPrice = getNum(mFor[2]) / getNum(mFor[1]);
            formulaStr = `${mFor[2]} / ${mFor[1]} [Case 10]`;
        }
        // Case 11: 淨打折
        else if (mPerc && !is2nd) {
            finalPrice = originalPrice * (1 - (getNum(mPerc[1]) / 100));
            formulaStr = `${originalPrice} * (1 - (${mPerc[1]} / 100)) [Case 11]`;
        }
        // Case 12: 淨半價字眼
        else if (p.includes('half price') && !is2nd) {
            finalPrice = originalPrice * 0.5;
            formulaStr = `${originalPrice} * 0.5 [Case 12]`;
        }

        // ==========================================
        // 🛡️ 4. 終極防線校驗 (Guardrails)
        // ==========================================
        // 防禦底線放寬至 5% (0.05)，拯救 8% 折扣率之真實跳水價
        if (finalPrice !== null && finalPrice >= (originalPrice * 0.05)) {
            return { status: 'OK', price: parseFloat(finalPrice.toFixed(2)), formula: formulaStr };
        }
        
        return { status: 'ERROR_UNPARSED', price: null, formula: 'Unparsed' };
    } catch(e) { 
        return { status: 'ERROR_EXCEPTION', price: null, formula: 'Error' };
    }
}

module.exports = { calculateAvgPrice };