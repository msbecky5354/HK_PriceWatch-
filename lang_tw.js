// lang_tw.js - 繁體中文詞庫 (zh-Hant)
window.uiText = window.uiText || {};
window.uiText['zh-Hant'] = { 
    title: "慳真D",
    ogTitle: '慳真D | 香港貨品格價神器',
    ogDesc: '香港超市格價神器，秒速幫你搵出最平貨品！',
    badge: "政府數據連線", 
    subLabel: "正在讀取更新時間...", 
    lastUpdated: "更新於: ",
    mainCat: "第一步：揀個主分類先", 
    sortTip: "常用優先", 
    back: "返回", 
    loading: "努力同步緊最新價格...", 
    error: "載入失敗", 
    send: "搵嘢", 
    placeholder: "輸入貨品、牌子或者關鍵字...", 

    notFound: "搵唔到喎！🤖 不過我喺數據庫幫你搵到啲相關嘅建議：",
    suggestBrand: "或者試吓呢個牌子：",
    suggestCategory: "你可能想搵呢類產品：",
    backToSearch: "重新搜尋",
    searchAnyway: "強制搜尋：{keyword}",
    
    chatWelcome: "收到！你揀咗", 
    chatAsk: "想搵邊款貨品或者牌子呢？", 
    chatFound: "為你搜羅到以下最抵結果：", 
    chatShowAll: "呢個分類嘅全部貨品清單：", 
    chatNoResult: "哎呀，搵唔到相關貨品添！🤔 不如試吓縮短關鍵字，或者用其他字眼再搵過？",

    alertModalTitle: "設定到價提醒",
    alertModalCurrentPrice: "目前最低折實價：",
    alertModalTargetPrompt: "當跌穿以下心水價 (HK$) 時提醒我：",
    alertModalPrivacy: "私隱保證：本功能採用離線運算技術，追蹤清單只會存在你的手機瀏覽器內，絕對不會收集任何個人資料。",
    alertModalBtn: "加入追蹤清單",
    alertInvalidPrice: "請輸入有效的心水價！",
    alertListTitle: "我的追蹤清單",
    alertListEmpty: "<span class='text-3xl block mb-2'>📭</span>你尚未追蹤任何貨品。<br>喺產品卡片撳 🔔 就可以加入追蹤！",
    alertListHit: "到價！而家",
    alertListCurrent: "現價:",
    alertListTarget: "心水價:",
    alertListClose: "關閉",
           
    ocrSuccess: "✅ 辨識完成！請確認字眼後再按下搜尋。",
    ocrError: "⚠️ 認唔到包裝上嘅字，請嘗試影得清楚啲！",

    ocrSuccessGemini: "🎯 Gemini 完美辨識完成！請確認字眼後按下搜尋。",
    ocrSuccessBasic: "✅ 辨識完成！請確認字眼後再按下搜尋掣。",
    ocrFailGemini: "⚠️ Gemini 認唔到相關嘅貨品名，請對準包裝再影多一次！",
    ocrFailBasic: "⚠️ AI 認唔到相關嘅貨品名，請對準包裝上嘅「大字牌子」或「中文字」再影多一次！",
    ocrErrorGemini: "Gemini 連線失敗，請檢查 API Key 是否正確！系統將暫時退回基礎模式。",
    ocrErrorBasic: "圖片辨識引擎啟動失敗！請檢查網絡連線或等一陣再試。",

    ocrModalTitle: "📷 AI 視覺辨識中",
    ocrLoadingGemini: "召喚 Gemini AI 視覺大腦...",
    ocrLoadingBasic: "準備啟動基礎 AI 引擎...",
    ocrProgress: "正在辨識包裝文字...",
    ocrLoadingLang: "正在載入 AI 語言庫...",

    cameraModalTitle: "📸 AI 視覺辨識",
    cameraBtn: "📷 拍照 或 選擇圖片",
    advSettings: "進階設定",
    geminiTitle: "⚙️ 連接 Gemini 專業大腦",
    geminiDesc: "預設使用離線基礎辨識。輸入 Google Gemini API Key 可大幅提升花巧包裝嘅認字準確率。(僅安全儲存於本機)",
    geminiPlaceholder: "API Key (AIzaSy...)",
    saveBtn: "儲存",
    clearBtn: "清除",
    statusConnected: "✅ 已連接 Gemini Pro 引擎",
    statusOffline: "🐢 目前使用基礎離線引擎",
    alertKeySaved: "✅ 鎖匙已安全儲存！",
    alertKeyCleared: "🗑️ 鎖匙已清除，回復基礎模式。",
    cameraTooltip: "AI 視覺辨識設定",
    geminiGuide: "👉 按此前往 Google 免費領取 API Key",
    
    r_no_product: "「慳真D」主要監察約 3,000 款民生必需品。極冷門或單一超市獨家發售的貨品未必涵蓋，建議用簡單的關鍵字搜尋！",
    r_privacy: "即係系統 100% 純前端離線運作，免登入、免註冊，絕不收集或儲存你的電話、Email 或任何隱私資料！",
    r_alert: "喺產品卡片撳一下【橙色鐘仔 🔔】，輸入心水價即可追蹤。每日開 App 系統會自動對獎，到價時頂部紅點會閃爍提示！",
    r_gap: "點擊底部的【🔥 超大差價】快捷鍵，系統會瞬間幫你篩選出商戶之間價格相差超過 10% 的暴利或激抵貨品！",
    r_home: "iOS 用戶請用 Safari 開啟並點擊「分享 ➔ 加入主畫面」；Android 用戶請用 Chrome 點擊「⋮ ➔ 加至主畫面」。",

    kwNoProduct: "搵唔到",
    kwPrivacy: "個資",
    kwAlert: "提示",
    kwGap: "差價",
    kwHome: "畫面",

    quickAll: "📦 睇晒全部",
    quickDiscount: "🏷️ 淨係睇有優惠",
    quickHome: "🏠 返主目錄",
    quickBye: "👋 拜拜",
    
    miniFooterLinks: "關於我們、條款及免責聲明",
    miniFooterCopy: "© 2026 慳真D",
    disclaimerTitle: "免責聲明及服務條款",
    
    disclaimerText: `
<strong>1. 資料來源及知識產權：</strong><br>
本應用程式之貨品價格及優惠數據取自政府資料一線通 (data.gov.hk) 的「網上價格一覽通」資料集。相關資料之知識產權擁有人為<strong>消費者委員會</strong>及相關商戶。<br><br>
<strong>2. 數據涵蓋範圍：</strong><br>
系統數據主要涵蓋消委會挑選之數千款熱門「民生必需品」，並未包含實體超市之所有存貨（如部分獨家或冷門貨品）。<br><br>
<strong>3. 自動運算提示：</strong><br>
系統顯示之<strong>「折合價」為程式自動運算之結果</strong>，所有資訊均以政府發佈之最新數據及實體超市最終標價為準。資訊僅供參考，強烈建議用戶購買前自行核實。<br><br>
<strong>4. 網站技術及廣告聲明：</strong><br>
本站使用 Google Analytics 進行流量分析，並透過 Google AdSense 顯示相關廣告。這些服務可能會透過 Cookie 收集匿名使用者數據。繼續使用本站即表示您同意我們使用 Cookie。<br><br>
<strong>5. 責任限制：</strong><br>
本程式以「現況」形式提供，用戶須自行承擔風險。對於任何因使用、依賴本程式資訊，或因數據延遲、價格差異而引致之任何損失或損害，本應用程式及開發者概不承擔任何法律責任。`,

    modalBtn: '我明白並接受',

    footerAbout: "關於我們",
    footerContact: "聯絡我們",
    footerPrivacy: "隱私權政策",
    footerTerms: "服務條款",
    footerDevTeam: "開發團隊: ",
    footerDevName: "懶人工具駅",
    
    aboutTitle: "關於 「慳真D🔎」",
    aboutContent: "「慳真D🔎」旨在為香港市民提供一個便捷的價格比較平台。<br><br>大家從此無需再下載及篩選繁複的政府 Excel 數據表，只需透過這個內置 AI 搜尋引擎的應用程式，即可輕鬆格價、秒速找出全港超市的最抵優惠與最低價格！",
    contactTitle: "聯絡我們",
    contactContent: "如有任何查詢或合作建議，歡迎聯絡我們。<br><br>（聯絡資料即將更新，敬請期待！）",
    privacyTitle: "隱私權政策",
    privacyContent: "我們重視您的隱私。本應用程式不會收集您的任何個人敏感資料或瀏覽紀錄。",
    termsTitle: "服務條款",
    termsContent: "本應用程式之價格及優惠數據均直接取自香港政府「資料一線通」(data.gov.hk) 之官方數據集。系統折合價為程式自動運算之結果，所有資訊均以政府每日發佈之最新數據為準。",

    shareAppTitle: "推薦「慳真D🔎」畀朋友！",
    shareAppDesc: "掃描下方 QR Code，或者複製連結分享畀親友，一齊慳到盡！",
    shareBtnCopy: "複製連結",
    shareBtnWhatsApp: "WhatsApp 分享",
    shareBtnMore: "更多選項",
    copiedToast: "✅ 連結已複製！",
    shareMessage: "推薦你用「慳真D🔎」！秒速格價，幫你慳到盡！🛒\n",
    
    shareProductTitle: "慳真D🔎推介",
    shareProductTemplate: "【慳錢情報】{brand} - {name}，最低價見 ${price}！快啲去慳真D🔎睇吓啦！🛒",

    globalTitle: "全網數據搜尋",
    modeStart: "為你啟動「{label}」模式 🌍<br>馬上為你搜尋...",
    globalStart: "收到！啟動「全網數據搜尋」模式 🌍<br>等我幫你搵吓。",
    askKeyword: "請問你想搵咩貨品呢？可以試下打「可樂」或者「公仔麵」。",

    foundBigGapKw: '為你搜尋到「{keyword}」中符合超大差價嘅最抵結果：',
    foundBigGapCat: '為你搜羅到該分類下符合超大差價嘅最抵結果：',
    foundDiscountKw: '為你搜尋到「{keyword}」中精選優惠貨品結果：',
    foundDiscountCat: '為你搜羅到該分類下精選優惠貨品結果：',
    foundKw: '為你搜尋到「{keyword}」嘅最抵結果：',

    appTitle: "慳真D", 
    pageTitleText: "智選真抵榜", 
    subTitleText: "踢走假劈價，對比全城平均價", 
    filterPlace: "搜尋分類、品牌、貨品或推薦超市...", 
    backBtn: "返回",
    optSmAll: "推薦超市 (全部)", 
    optCatAll: "所有分類", 
    optSortDiff: "📉 真・減幅最高", 
    optSortMinP: "💰 折實價最低", 
    optSortCustom: "自訂排序",
    qsLabel: "熱門搜尋:", 
    qs1: "可樂", qs2: "出前一丁", qs3: "百佳", qs4: "惠康",
    listTitle: "🔥 今日 Top 劈價貨品", 
    dailyUpdateBadge: "每日更新",
    thRank: "排名", thCat: "分類", thSm: "超市", thBrand: "品牌", thName: "貨品名稱", thType: "優惠類型", thOrig: "原價", thEff: "折實價", thDiff: "真・減幅", thOther: "其他超市定價",
    typeDiscount: "📉 真降價", typePromo: "🏷️ 促銷優惠", 
    noData: "暫時未有數據 🤷‍♂️", origPriceStr: "原價", fail: "讀取數據失敗"
};

window.supermarketDict = window.supermarketDict || {};
window.supermarketDict['zh-Hant'] = { 
    'WELLCOME': '惠康', 
    'PARKNSHOP': '百佳', 
    'JASONS': 'Market Place (Jasons)',
    'MARKETPLACE': 'Market Place (Jasons)', 
    'AEON': 'AEON', 
    'WATSONS': '屈臣氏', 
    'MANNINGS': '萬寧', 
    'USELECT': 'U購', 
    'LUNGFUNG': '龍豐',
    'DCHFOOD': '大昌食品',
    'SASA': '莎莎'
};

// 安全掛載：全域共用之超市樣式字典
window.supermarketStyleDict = window.supermarketStyleDict || {
    'WELLCOME': {
        indexCard: 'border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-900/20',
        indexText: 'text-red-700 dark:text-red-400',
        badgeBg: 'bg-red-50 dark:bg-red-900/20',
        badgeText: 'text-red-600 dark:text-red-400',
        badgeBorder: 'border-red-200 dark:border-red-800',
        battleBg: 'bg-red-50 dark:bg-red-900/20',
        battleBorder: 'border-red-100 dark:border-red-800/50',
        battleText: 'text-red-700 dark:text-red-400',
        battleCountBg: 'bg-red-600 text-white border-transparent'
    },
    'LUNGFUNG': {
        indexCard: 'border-red-200 bg-red-50/30 dark:border-red-900/50 dark:bg-red-900/20',
        indexText: 'text-red-700 dark:text-red-400',
        badgeBg: 'bg-red-50 dark:bg-red-900/20',
        badgeText: 'text-red-600 dark:text-red-400',
        badgeBorder: 'border-red-200 dark:border-red-800',
        battleBg: 'bg-red-50 dark:bg-red-900/20',
        battleBorder: 'border-red-100 dark:border-red-800/50',
        battleText: 'text-red-700 dark:text-red-400',
        battleCountBg: 'bg-red-600 text-white border-transparent'
    },
    'PARKNSHOP': {
        indexCard: 'border-blue-200 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-900/20',
        indexText: 'text-blue-700 dark:text-blue-400',
        badgeBg: 'bg-blue-50 dark:bg-blue-900/20',
        badgeText: 'text-blue-600 dark:text-blue-400',
        badgeBorder: 'border-blue-200 dark:border-blue-800',
        battleBg: 'bg-blue-50 dark:bg-blue-900/20',
        battleBorder: 'border-blue-100 dark:border-blue-800/50',
        battleText: 'text-blue-700 dark:text-blue-400',
        battleCountBg: 'bg-blue-600 text-white border-transparent'
    },
    'WATSONS': {
        indexCard: 'border-teal-200 bg-teal-50/30 dark:border-teal-900/50 dark:bg-teal-900/20',
        indexText: 'text-teal-700 dark:text-teal-400',
        badgeBg: 'bg-teal-50 dark:bg-teal-900/20',
        badgeText: 'text-teal-600 dark:text-teal-400',
        badgeBorder: 'border-teal-200 dark:border-teal-800',
        battleBg: 'bg-teal-50 dark:bg-teal-900/20',
        battleBorder: 'border-teal-100 dark:border-teal-800/50',
        battleText: 'text-teal-700 dark:text-teal-400',
        battleCountBg: 'bg-teal-600 text-white border-transparent'
    },
    'HKTVMALL': {
        indexCard: 'border-green-200 bg-green-50/30 dark:border-green-900/50 dark:bg-green-900/20',
        indexText: 'text-green-700 dark:text-green-400',
        badgeBg: 'bg-green-50 dark:bg-green-900/20',
        badgeText: 'text-green-600 dark:text-green-400',
        badgeBorder: 'border-green-200 dark:border-green-800',
        battleBg: 'bg-green-50 dark:bg-green-900/20',
        battleBorder: 'border-green-100 dark:border-green-800/50',
        battleText: 'text-green-700 dark:text-green-400',
        battleCountBg: 'bg-green-600 text-white border-transparent'
    },
    'JASONS': {
        indexCard: 'border-emerald-300 bg-emerald-100/40 dark:border-emerald-900/50 dark:bg-emerald-900/20',
        indexText: 'text-emerald-800 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        badgeText: 'text-emerald-700 dark:text-emerald-400',
        badgeBorder: 'border-emerald-200 dark:border-emerald-800',
        battleBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        battleBorder: 'border-emerald-100 dark:border-emerald-800/50',
        battleText: 'text-emerald-700 dark:text-emerald-400',
        battleCountBg: 'bg-emerald-600 text-white border-transparent'
    },
    'MARKETPLACE': {
        indexCard: 'border-emerald-300 bg-emerald-100/40 dark:border-emerald-900/50 dark:bg-emerald-900/20',
        indexText: 'text-emerald-800 dark:text-emerald-400',
        badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        badgeText: 'text-emerald-700 dark:text-emerald-400',
        badgeBorder: 'border-emerald-200 dark:border-emerald-800',
        battleBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        battleBorder: 'border-emerald-100 dark:border-emerald-800/50',
        battleText: 'text-emerald-700 dark:text-emerald-400',
        battleCountBg: 'bg-emerald-600 text-white border-transparent'
    },
    'MANNINGS': {
        indexCard: 'border-orange-300 bg-orange-50/50 dark:border-orange-900/50 dark:bg-orange-900/20',
        indexText: 'text-orange-500 dark:text-orange-400 drop-shadow-sm',
        badgeBg: 'bg-orange-100 dark:bg-orange-900/30',
        badgeText: 'text-orange-500 dark:text-orange-400 drop-shadow-sm',
        badgeBorder: 'border-orange-400 dark:border-orange-700',
        battleBg: 'bg-orange-50 dark:bg-orange-900/20',
        battleBorder: 'border-orange-200 dark:border-orange-800/50',
        battleText: 'text-orange-500 dark:text-orange-400 drop-shadow-sm',
        battleCountBg: 'bg-orange-500 text-white border-transparent shadow-sm'
    },
    'AEON': {
        indexCard: 'border-fuchsia-200 bg-fuchsia-50/30 dark:border-fuchsia-900/50 dark:bg-fuchsia-900/20',
        indexText: 'text-fuchsia-700 dark:text-fuchsia-400',
        badgeBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
        badgeText: 'text-fuchsia-600 dark:text-fuchsia-400',
        badgeBorder: 'border-fuchsia-200 dark:border-fuchsia-800',
        battleBg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
        battleBorder: 'border-fuchsia-100 dark:border-fuchsia-800/50',
        battleText: 'text-fuchsia-700 dark:text-fuchsia-400',
        battleCountBg: 'bg-fuchsia-600 text-white border-transparent'
    },
    'SASA': {
        indexCard: 'border-pink-200 bg-pink-50/30 dark:border-pink-900/50 dark:bg-pink-900/20',
        indexText: 'text-pink-700 dark:text-pink-400',
        badgeBg: 'bg-pink-50 dark:bg-pink-900/20',
        badgeText: 'text-pink-600 dark:text-pink-400',
        badgeBorder: 'border-pink-200 dark:border-pink-800',
        battleBg: 'bg-pink-50 dark:bg-pink-900/20',
        battleBorder: 'border-pink-100 dark:border-pink-800/50',
        battleText: 'text-pink-700 dark:text-pink-400',
        battleCountBg: 'bg-pink-600 text-white border-transparent'
    },
    'DCHFOOD': {
        indexCard: 'border-yellow-300 bg-yellow-50/50 dark:border-yellow-900/50 dark:bg-yellow-900/20',
        indexText: 'text-yellow-500 dark:text-yellow-400 drop-shadow-sm',
        badgeBg: 'bg-yellow-100 dark:bg-yellow-900/30',
        badgeText: 'text-yellow-500 dark:text-yellow-400 drop-shadow-sm',
        badgeBorder: 'border-yellow-400 dark:border-yellow-700',
        battleBg: 'bg-yellow-50 dark:bg-yellow-900/20',
        battleBorder: 'border-yellow-200 dark:border-yellow-800/50',
        battleText: 'text-yellow-500 dark:text-yellow-400 drop-shadow-sm',
        battleCountBg: 'bg-yellow-400 text-slate-900 border border-yellow-500 shadow-sm'
    },
    'DEFAULT': {
        indexCard: 'border-slate-100 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-700/30',
        indexText: 'text-slate-600 dark:text-slate-300',
        badgeBg: 'bg-slate-100 dark:bg-slate-700',
        badgeText: 'text-slate-600 dark:text-slate-300',
        badgeBorder: 'border-slate-200 dark:border-slate-600',
        battleBg: 'bg-slate-50 dark:bg-slate-900/20',
        battleBorder: 'border-slate-100 dark:border-slate-800/50',
        battleText: 'text-slate-700 dark:text-slate-400',
        battleCountBg: 'bg-slate-600 text-white border-transparent'
    }
};

window.categoryDict = window.categoryDict || {};
window.categoryDict['zh-Hant'] = {
    '飲品': '飲品',
    '米 / 食油 / 罐頭 / 蔬果 / 肉類': '米 / 食油 / 罐頭 / 蔬果 / 肉類',
    '家居用品 / 寵物食品及用品': '家居用品 / 寵物食品及用品',
    '粉麵 / 煮食用料 / 冷凍加工食品': '粉麵 / 煮食用料 / 冷凍加工食品',
    '奶類及乳製品 / 大豆製品 / 蛋類': '奶類及乳製品 / 大豆製品 / 蛋類',
    '糖果 / 餅乾 / 小食': '糖果 / 餅乾 / 小食',
    '麵包蛋糕 / 穀類早餐 / 麵包醬': '麵包蛋糕 / 穀類早餐 / 麵包醬',
    '酒類': '酒類',
    '個人護理': '個人護理',
    '奶粉 / 嬰兒用品': '奶粉 / 嬰兒用品'
};