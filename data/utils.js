// utils.js 修正版
function calculateAvgPrice(enPromoText, originalPrice) {
    if (!enPromoText || isNaN(originalPrice)) return { status: 'ERROR_EXCEPTION', price: null, formula: 'Error' };
    
    let finalPrice = null;
    let formulaStr = 'Unparsed'; 
    
    try {
        let p = enPromoText.toLowerCase().replace(/\s+/g, ' '); 
        p = p.replace(/\.(?!\d)/g, ''); 
        
        // 🛡️ 終極修正：自動修復超市打錯字，無縫拆解 "Buy1", "get2" 等連字盲區
        p = p.replace(/(buy|add|get|save)\s*(\d+)/g, '$1 $2');
        
        const getNum = (n) => parseFloat(n);
        const is2nd = p.includes('2nd') || p.includes('second');
        
        let mGetFor = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?(?:for|at)\s*\$([0-9.]+)/);
        let mSave = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?save.*?\$([0-9.]+)/);
        let mGetHalf = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b.*?half/);
        let mGetPerc = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?get.*?\b([0-9]+)\b\s+([0-9.]+)%\s*off/);
        let mBuyPercOff = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:to\s*)?(?:get|enjoy)\s+([0-9.]+)%\s*off/);
        let mGetFree = p.match(/(?:buy|add).*?\b([0-9]+)\b.*?(?:get|free).*?\b([0-9]+)\b(?!\s*%)/);
        let m2ndFor = p.match(/(?:second|2nd).*?(?:for|at)\s*\$([0-9.]+)/);
        let m2ndPerc = p.match(/(?:second|2nd).*?([0-9.]+)%|([0-9.]+)%.*?(?:second|2nd)/);
        
        // 💡 修正 1：非數字與貨幣符號捕捉網，擊破 "Buy 2 pcs $32" 盲區
        // 此正則能自動適配 "for", "at", "pcs", "pieces" 甚至是毫無介詞之字串
        let mFor = p.match(/\b([0-9]+)\b[^\d\$]*\$([0-9.]+)/);
        
        let mPerc = p.match(/([0-9.]+)%\s*off/);

        if (mGetFor) {
            finalPrice = (originalPrice * getNum(mGetFor[1]) + getNum(mGetFor[3])) / (getNum(mGetFor[1]) + getNum(mGetFor[2]));
            formulaStr = `(${originalPrice} * ${mGetFor[1]} + ${mGetFor[3]}) / (${mGetFor[1]} + ${mGetFor[2]})`;
        }
        else if (mSave) {
            finalPrice = (originalPrice * getNum(mSave[1]) - getNum(mSave[2])) / getNum(mSave[1]);
            formulaStr = `(${originalPrice} * ${mSave[1]} - ${mSave[2]}) / ${mSave[1]}`;
        }
        else if (mGetHalf) {
            finalPrice = (originalPrice * getNum(mGetHalf[1]) + (originalPrice * 0.5 * getNum(mGetHalf[2]))) / (getNum(mGetHalf[1]) + getNum(mGetHalf[2]));
            formulaStr = `(${originalPrice} * ${mGetHalf[1]} + (${originalPrice} * 0.5 * ${mGetHalf[2]})) / (${mGetHalf[1]} + ${mGetHalf[2]})`;
        }
        else if (mGetPerc) {
            finalPrice = (originalPrice * getNum(mGetPerc[1]) + (originalPrice * (1 - getNum(mGetPerc[3])/100) * getNum(mGetPerc[2]))) / (getNum(mGetPerc[1]) + getNum(mGetPerc[2]));
            formulaStr = `(${originalPrice} * ${mGetPerc[1]} + (${originalPrice} * (1 - ${mGetPerc[3]}/100) * ${mGetPerc[2]})) / (${mGetPerc[1]} + ${mGetPerc[2]})`;
        }
        else if (mBuyPercOff) {
            finalPrice = originalPrice * (1 - (getNum(mBuyPercOff[2]) / 100));
            formulaStr = `${originalPrice} * (1 - (${mBuyPercOff[2]} / 100))`;
        }
        else if (mGetFree) {
            finalPrice = (originalPrice * getNum(mGetFree[1])) / (getNum(mGetFree[1]) + getNum(mGetFree[2]));
            formulaStr = `(${originalPrice} * ${mGetFree[1]}) / (${mGetFree[1]} + ${mGetFree[2]})`;
        }
        else if (m2ndFor) {
            finalPrice = (originalPrice + getNum(m2ndFor[1])) / 2;
            formulaStr = `(${originalPrice} + ${m2ndFor[1]}) / 2`;
        }
        else if (p.match(/(?:second|2nd).*?half/)) {
            finalPrice = (originalPrice * 1.5) / 2;
            formulaStr = `(${originalPrice} * 1.5) / 2`;
        }
        else if (m2ndPerc) {
            let perc = getNum(m2ndPerc[1] || m2ndPerc[2]);
            finalPrice = (originalPrice * (2 - (perc / 100))) / 2;
            formulaStr = `(${originalPrice} * (2 - (${perc} / 100))) / 2`;
        }
        else if (mFor && !is2nd) {
            finalPrice = getNum(mFor[2]) / getNum(mFor[1]);
            formulaStr = `${mFor[2]} / ${mFor[1]}`;
        }
        else if (mPerc && !is2nd) {
            finalPrice = originalPrice * (1 - (getNum(mPerc[1]) / 100));
            formulaStr = `${originalPrice} * (1 - (${mPerc[1]} / 100))`;
        }
        else if (p.includes('half price') && !is2nd) {
            finalPrice = originalPrice * 0.5;
            formulaStr = `${originalPrice} * 0.5`;
        }

        // 💡 修正 2：防禦底線放寬至 5% (0.05)，拯救 8% 折扣率之真實跳水價
        if (finalPrice !== null && finalPrice >= (originalPrice * 0.05)) {
            return { status: 'OK', price: parseFloat(finalPrice.toFixed(2)), formula: formulaStr };
        }
        
        return { status: 'ERROR_UNPARSED', price: null, formula: 'Unparsed' };
    } catch(e) { 
        return { status: 'ERROR_EXCEPTION', price: null, formula: 'Error' };
    }
}

module.exports = { calculateAvgPrice };
