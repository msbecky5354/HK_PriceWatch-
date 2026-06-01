// lang.js - 神器多語言及 AI 對答詞庫//

const uiText = {
    'zh-Hant': { 
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

        //new smark talk
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

        // 🔔 到價提醒 Modal
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
               
        // 📷 圖片辨識 (OCR)
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

        // 📸 相機與 API 設定選單
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
        geminiDesc: "預設使用離線辨識。輸入 API Key 可解鎖高精度模式。",
        
        // --- 新功能回覆 ---
        r_no_product: "「慳真D」主要監察約 3,000 款民生必需品。極冷門或單一超市獨家發售的貨品未必涵蓋，建議用簡單的關鍵字搜尋！",
        r_privacy: "即係系統 100% 純前端離線運作，免登入、免註冊，絕不收集或儲存你的電話、Email 或任何隱私資料！",
        r_alert: "喺產品卡片撳一下【橙色鐘仔 🔔】，輸入心水價即可追蹤。每日開 App 系統會自動對獎，到價時頂部紅點會閃爍提示！",
        r_gap: "點擊底部的【🔥 超大差價】快捷鍵，系統會瞬間幫你篩選出商戶之間價格相差超過 10% 的暴利或激抵貨品！",
        r_home: "iOS 用戶請用 Safari 開啟並點擊「分享 ➔ 加入主畫面」；Android 用戶請用 Chrome 點擊「⋮ ➔ 加至主畫面」。",

        // --- 關鍵字變數 ---
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
        
        // 免責聲明
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

        // 🚀 新增：分享 App 彈窗文字
        shareAppTitle: "推薦「慳真D🔎」畀朋友！",
        shareAppDesc: "掃描下方 QR Code，或者複製連結分享畀親友，一齊慳到盡！",
        shareBtnCopy: "複製連結",
        shareBtnWhatsApp: "WhatsApp 分享",
        shareBtnMore: "更多選項",
        copiedToast: "✅ 連結已複製！",
        shareMessage: "推薦你用「慳真D🔎」！秒速格價，幫你慳到盡！🛒\n",
        
        // 🛒 分享單一貨品 (Product Share)
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


        // --- 📊 Section 2: 智選真抵榜 (true_discount.html) ---
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
        thRank: "排名", thCat: "分類", thSm: "超市", thName: "貨品名稱", thType: "優惠類型", thOrig: "原價", thEff: "折實價", thDiff: "真・減幅", thOther: "其他超市定價",
        typeDiscount: "📉 真降價", typePromo: "🏷️ 促銷優惠", 
        noData: "暫時未有數據 🤷‍♂️", origPriceStr: "原價", fail: "讀取數據失敗"
    },
    
    'zh-Hans': { 
        title: "悭真D", 
        ogTitle: '悭真D | 香港超市比价神器',
        ogDesc: '香港超市比价神器，秒速帮你找出最平商品！',
        badge: "政府数据连线", 
        subLabel: "正在读取更新时间...", 
        lastUpdated: "更新于: ",
        mainCat: "第一步：请选择主分类", 
        sortTip: "常用優先", 
        back: "返回", 
        loading: "努力同步最新价格...", 
        error: "加载失败", 
        send: "搜索", 
        placeholder: "输入商品、品牌或关键词...", 
        notFound: "找不到哦！🤖 不过我在数据库帮您找到了一些相关建议：",
        suggestBrand: "或者试试这个品牌：",
        suggestCategory: "您可能想找这类产品：",
        backToSearch: "重新搜索",
        searchAnyway: "强制搜索：{keyword}",
        
        chatWelcome: "收到！您选择了", 
        chatAsk: "请问想找什么商品或品牌呢？", 
        chatFound: "为您搜索到以下比价结果：", 
        chatShowAll: "该分类下的全部商品清单：", 
        chatNoResult: "哎呀，找不到相关商品！🤔 不如尝试缩短关键词，或者换个字眼再搜搜看？",

        // 🔔 到价提醒 Modal
        alertModalTitle: "设定到价提醒",
        alertModalCurrentPrice: "目前最低折实价：",
        alertModalTargetPrompt: "当跌穿以下心水价 (HK$) 时提醒我：",
        alertModalPrivacy: "隐私保证：本功能采用离线运算技术，追踪清单只会存在你的手机浏览器内，绝对不会收集任何个人资料。",
        alertModalBtn: "加入追踪清单",
        alertInvalidPrice: "请输入有效的心水价！",
        alertListTitle: "我的追踪清单",
        alertListEmpty: "<span class='text-3xl block mb-2'>📭</span>你尚未追踪任何商品。<br>在产品卡片按 🔔 即可加入追踪！",
        alertListHit: "到价！现在",
        alertListCurrent: "现价:",
        alertListTarget: "心水价:",
        alertListClose: "关闭",
        
        // 📷 图片辨识 (OCR)
        ocrSuccess: "✅ 辨识完成！请确认字眼后再按下搜索。",
        ocrError: "⚠️ 认不到包装上的字，请尝试拍得清楚点！",

        ocrSuccessGemini: "🎯 Gemini 完美识别完成！请确认字眼后按下搜索。",
        ocrSuccessBasic: "✅ 识别完成！请确认字眼后再按下搜索。",
        ocrFailGemini: "⚠️ Gemini 认不到相关的货品名，请对准包装再拍一次！",
        ocrFailBasic: "⚠️ AI 认不到相关的货品名，请对准包装上的「大字牌子」或「中文字」再拍一次！",
        ocrErrorGemini: "Gemini 连接失败，请检查 API Key 是否正确！系统将暂时退回基础模式。",
        ocrErrorBasic: "图片识别引擎启动失败！请检查网络连接或稍后再试。",

        ocrModalTitle: "📷 AI 视觉辨识中",
        ocrLoadingGemini: "召唤 Gemini AI 视觉大脑...",
        ocrLoadingBasic: "准备启动基础 AI 引擎...",
        ocrProgress: "正在识别包装文字...",
        ocrLoadingLang: "正在载入 AI 语言库...",

        // 📸 相機與 API 設定選單
        cameraModalTitle: "📸 AI 视觉辨识",
        cameraBtn: "📷 拍照 或 选择图片",
        advSettings: "进阶设定",
        geminiTitle: "⚙️ 连接 Gemini 专业大脑",
        geminiDesc: "默认使用离线基础辨识。输入 Google Gemini API Key 可大幅提升复杂包装的识别准确率。(仅安全储存于本机)",
        geminiPlaceholder: "API Key (AIzaSy...)",
        saveBtn: "保存",
        clearBtn: "清除",
        statusConnected: "✅ 已连接 Gemini Pro 引擎",
        statusOffline: "🐢 目前使用基础离线引擎",
        alertKeySaved: "✅ 密钥已安全保存！",
        alertKeyCleared: "🗑️ 密钥已清除，回复基础模式。",
        cameraTooltip: "AI 视觉辨识设定",
        geminiGuide: "👉 点击此处前往 Google 免费领取 API Key",
        geminiDesc: "默认使用离线识别。输入 API Key 可解锁高精度模式。",
        
        quickAll: "📦 查看全部",
        quickDiscount: "🏷️ 只看有优惠",
        quickHome: "🏠 回主目录",
        quickBye: "👋 拜拜",
        
        miniFooterLinks: "关于我们、条款及免责声明",
        miniFooterCopy: "© 2026 悭真D",
        disclaimerTitle: "免责声明及服务条款",
        
        // 免責聲明：
        disclaimerText: `<strong>1. 资料来源及知识产权：</strong><br>本应用程式之货品价格及优惠数据取自政府资料一线通 (data.gov.hk) 的「网上价格一览通」数据集。相关资料之知识产权所有人为<strong>消费者委员会</strong>及相关商户。<br><br>
        <strong>2. 数据涵盖范围：</strong><br>系统数据主要涵盖消委会挑选之数千款热门「民生必需品」，并未包含实体超市之所有存货（如部分独家或冷门货品）。<br><br>
        <strong>3. 自动运算提示：</strong><br>系统显示之<strong>「折合价」为程序自动运算之结果</strong>，所有资讯均以政府发布之最新数据及实体超市最终标价为准。资讯仅供参考，强烈建议用户购买前自行核实。<br><br>
        <strong>4. 网站技术及广告声明：</strong><br>本站使用 Google Analytics 进行流量分析，并透过 Google AdSense 显示相关广告。这些服务可能会透过 Cookie 收集匿名使用者数据。继续使用本站即表示您同意我们使用 Cookie。<br><br>
        <strong>5. 责任限制：</strong><br>本程式以「现况」形式提供，用户须自行承担风险。对于任何因使用、依赖本程式资讯，或因数据延迟、价格差异而引致之任何损失或损害，本应用程式及开发者概不承担任何法律责任。`,

        modalBtn: '我明白并接受',
        
        footerAbout: "关于我们",
        footerContact: "联络我们",
        footerPrivacy: "隐私权政策",
        footerTerms: "服务条款",
        footerDevTeam: "开发团队: ",
        footerDevName: "懒人工具駅",
        
        aboutTitle: "关于 「悭真D🔎」",
        aboutContent: "「悭真D🔎」旨在为香港市民提供一个便捷的价格比较平台。<br><br>大家从此无需再下载及筛选繁复的政府 Excel 数据表，只需透过这个内置 AI 搜索引擎的应用程序，即可轻松比价、秒速找出全港超市的最划算优惠与最低价格！",
        contactTitle: "联络我们",
        contactContent: "如有任何查询或合作建议，欢迎联络我们。<br><br>（联络资料即将更新，敬请期待！）",
        privacyTitle: "隐私权政策",
        privacyContent: "我们重视您的隐私。本应用程序不会收集您的任何个人敏感资料或浏览纪录。",
        termsTitle: "服务条款",
        termsContent: "本应用程序之价格及优惠数据均直接取自香港政府「资料一线通」(data.gov.hk) 之官方数据集。系统折合价为程序自动运算之结果，所有信息均以政府每日发布之最新数据为准。",

        shareAppTitle: "推荐「悭真D🔎」给朋友！",
        shareAppDesc: "扫描下方 QR Code，或复制链接分享给亲友，一起省钱！",
        shareBtnCopy: "复制链接",
        shareBtnWhatsApp: "WhatsApp 分享",
        shareBtnMore: "更多选项",
        copiedToast: "✅ 链接已复制！",
        shareMessage: "推荐您使用「悭真D🔎」！秒速比价，帮您省到家！🛒\n",
        // 🛒 分享單一貨品 (Product Share)
        shareProductTitle: "悭真D🔎推荐",
        shareProductTemplate: "【省钱情报】{brand} - {name}，最低价见 ${price}！快去悭真D🔎看看吧！🛒",

        globalTitle: "全网数据搜索",
        modeStart: "为您启动「{label}」模式 🌍<br>马上为您搜索...",
        globalStart: "收到！启动「全网数据搜索」模式 🌍<br>让我帮您找找。",
        askKeyword: "请问想找什么商品呢？可以试着输入「可乐」或者「方便面」。",

        foundBigGapKw: '为您搜寻到「{keyword}」中符合超大差价的最抵结果：',
        foundBigGapCat: '为您搜罗到该分类下符合超大差价的最抵结果：',
        foundDiscountKw: '为您搜寻到「{keyword}」中精选优惠货品结果：',
        foundDiscountCat: '为您搜罗到该分类下精选优惠货品结果：',
        foundKw: '为您搜寻到「{keyword}」的最抵结果：',

        // 請將上述內容改為簡體，確保 Key 名稱與 zh-Hant 一模一樣
        appTitle: "智选真抵榜", pageTitleText: "智选真抵榜", subTitleText: "踢走假降价，对比全城平均价",
        filterPlace: "搜索分类、品牌、商品或推荐超市...", backBtn: "返回",
        optSmAll: "推荐超市 (全部)", optCatAll: "所有分类", optSortDiff: "📉 真・减幅最高", optSortMinP: "💰 折实价最低", optSortCustom: "自定义排序",
        qsLabel: "热门搜索:", qs1: "可乐", qs2: "出前一丁", qs3: "百佳", qs4: "惠康",
        listTitle: "🔥 今日 Top 降价商品", dailyUpdateBadge: "每日更新",
        thRank: "排名", thCat: "分类", thSm: "超市", thName: "商品名称", thType: "优惠类型", thOrig: "原价", thEff: "折实价", thDiff: "真・减幅", thOther: "其他超市定价",
        typeDiscount: "📉 真降价", typePromo: "🏷️ 促销优惠", noData: "暂无数据 🤷‍♂️", origPriceStr: "原价", fail: "读取数据失败"
    },
    
    'en': { 
        title: "HK Smart Price", 
        ogTitle: 'HK Smart Price | HK Gov Price Watch',
        ogDesc: 'HK Smart Price Watch. Find the best deals instantly!',
        badge: "Live Gov Data", 
        subLabel: "Fetching update time...", 
        lastUpdated: "Updated: ",
        mainCat: "Step 1: Select Category", 
        sortTip: "Frequent First", 
        back: "Back", 
        loading: "Syncing live prices...", 
        error: "Failed to load", 
        send: "Search", 
        placeholder: "Type product, brand or keywords...", 
        notFound: "Not found! 🤖 But I found some related suggestions for you:",
        suggestBrand: "Or try this brand:",
        suggestCategory: "You might be looking for this category:",
        backToSearch: "Search Again",
        searchAnyway: "Search anyway: {keyword}",
        
        chatWelcome: "Got it! You've selected", 
        chatAsk: "What product or brand are you looking for?", 
        chatFound: "Here are the best prices we found for you:", 
        chatShowAll: "Here is the full list of products in this category:", 
        chatNoResult: "Oops, we couldn't find any matching products! 🤔 Try using shorter or different keywords.",

        // 🔔 Alert Modal
        alertModalTitle: "Set Price Alert",
        alertModalCurrentPrice: "Current lowest price: ",
        alertModalTargetPrompt: "Remind me when the price drops below (HK$):",
        alertModalPrivacy: "Privacy Guarantee: This feature uses offline processing. Your watchlist is saved locally on your device and no personal data is collected.",
        alertModalBtn: "Add to Watchlist",
        alertInvalidPrice: "Please enter a valid target price!",
        alertListTitle: "My Watchlist",
        alertListEmpty: "<span class='text-3xl block mb-2'>📭</span>Your watchlist is empty.<br>Click 🔔 on a product card to add!",
        alertListHit: "Target Reached! Now",
        alertListCurrent: "Current:",
        alertListTarget: "Target:",
        alertListClose: "Close",
        
        // 📷 OCR (Image Recognition)
        ocrSuccess: "✅ Recognition complete! Please confirm the keyword before searching.",
        ocrError: "⚠️ Cannot recognize the text. Please try taking a clearer picture!",

        ocrSuccessGemini: "🎯 Gemini recognition complete! Please verify the keyword and search.",
        ocrSuccessBasic: "✅ Recognition complete! Please verify the keyword and search.",
        ocrFailGemini: "⚠️ Gemini couldn't recognize the product. Please aim at the packaging and try again!",
        ocrFailBasic: "⚠️ AI couldn't recognize the product. Please aim at the brand name and try again!",
        ocrErrorGemini: "Gemini connection failed. Check your API Key! Falling back to basic mode.",
        ocrErrorBasic: "OCR engine failed to start! Please check your network or try again later.",

        ocrModalTitle: "📷 AI Visual Recognition",
        ocrLoadingGemini: "Summoning Gemini AI Vision...",
        ocrLoadingBasic: "Starting basic AI engine...",
        ocrProgress: "Recognizing packaging text...",
        ocrLoadingLang: "Loading AI language data...",

        // 📸 相機與 API 設定選單
        cameraModalTitle: "📸 AI Visual Recognition",
        cameraBtn: "📷 Take Photo or Choose Image",
        advSettings: "Advanced Settings",
        geminiTitle: "⚙️ Connect Gemini Pro",
        geminiDesc: "Default uses basic offline recognition. Enter a Google Gemini API Key to significantly improve accuracy for complex packaging. (Safely stored locally)",
        geminiPlaceholder: "API Key (AIzaSy...)",
        saveBtn: "Save",
        clearBtn: "Clear",
        statusConnected: "✅ Connected to Gemini Pro",
        statusOffline: "🐢 Using basic offline engine",
        alertKeySaved: "✅ Key saved securely!",
        alertKeyCleared: "🗑️ Key cleared. Returning to basic mode.",
        cameraTooltip: "AI Vision Settings",
        geminiGuide: "👉 Click here to get your free Google API Key",
        geminiDesc: "Default uses basic offline recognition. Enter API Key to unlock high-precision mode.",

        quickAll: "📦 Show All",
        quickDiscount: "🏷️ Discounted Only",
        quickHome: "🏠 Main Menu",
        quickBye: "👋 Goodbye",
        
        miniFooterLinks: "About, Terms & Disclaimer",
        miniFooterCopy: "© 2026 HK Smart Price",
        disclaimerTitle: "Disclaimer & Terms of Service",
        
        // 免責聲明：
        disclaimerText: `<strong>1. Data Source & IP Rights:</strong><br>Price and promotional data in this app are sourced from the "Online Price Watch" dataset on Data.gov.hk. All intellectual property rights belong to the <strong>Consumer Council</strong> and respective merchants.<br><br>
        <strong>2. Data Coverage:</strong><br>The dataset mainly covers thousands of popular daily essentials selected by the Consumer Council and does not include all supermarket inventory (such as exclusive or niche items).<br><br>
        <strong>3. Automated Calculation:</strong><br>The calculated average prices displayed are <strong>automatically generated by the system</strong>. All information is based on the latest live data released by the government and final tags in physical stores. For reference only; users are advised to verify prices before purchasing.<br><br>
        <strong>4. Site Technology & Ad Disclosure:</strong><br>This site uses Google Analytics to analyze traffic and Google AdSense to display advertisements. These services may collect anonymous user data via cookies. By continuing to use this site, you agree to our use of cookies.<br><br>
        <strong>5. Limitation of Liability:</strong><br>This app is provided on an "AS IS" basis. Users assume all risks. The application and its developer shall not be held legally liable for any loss or damage arising from price differences, data delays, or reliance on the information provided.`,

        modalBtn: 'I Understand & Accept',

        footerAbout: "About Us",
        footerContact: "Contact Us",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Service",
        footerDevTeam: "Developed by: ",
        footerDevName: "Lazy Tools Station",
        
        aboutTitle: "About HK Smart Price🔎",
        aboutContent: "HK Smart Price🔎 aims to provide a convenient price comparison platform for Hong Kong citizens.<br><br>Say goodbye to downloading and filtering complex government Excel sheets! With our AI-powered search app, you can effortlessly compare prices and find the best discounts across supermarkets in seconds.",
        contactTitle: "Contact Us",
        contactContent: "For inquiries or collaborations, please feel free to reach out.<br><br>(Contact info coming soon!)",
        privacyTitle: "Privacy Policy",
        privacyContent: "We value your privacy. This application does not collect any sensitive personal data or browsing history.",
        termsTitle: "Terms of Service",
        termsContent: "All price and promotional data are directly sourced from the official 'Data.gov.hk' dataset provided by the Hong Kong Government. The calculated average prices are automatically generated by the system. All information is based on the latest daily data released by the government.",

        shareAppTitle: "Share with Friends!",
        shareAppDesc: "Scan the QR Code below or copy the link to share the savings with your friends and family!",
        shareBtnCopy: "Copy Link",
        shareBtnWhatsApp: "WhatsApp",
        shareBtnMore: "More Options",
        copiedToast: "✅ Link copied to clipboard!",
        shareMessage: "Check out the HK Smart Price Tracker🔎! Compare supermarket prices instantly and save money! 🛒\n",
        // 🛒 分享單一貨品 (Product Share)
        shareProductTitle: "HK Smart Price 🔎 Recommendation",
        shareProductTemplate: "[Hot Deal] {brand} - {name}, lowest price at ${price}! Check it out on HK Smart Price 🔎! 🛒",
   
        globalTitle: "Global Catalog Search",
        modeStart: "Starting '{label}' mode 🌍<br>Searching now...",
        globalStart: "Got it! Starting 'Global Catalog Search' mode 🌍<br>Let me find it for you.",
        askKeyword: "What product are you looking for? Try typing 'Cola' or 'Noodles'.",

        foundBigGapKw: 'Here are the top deals for "{keyword}" with huge price gaps:',
        foundBigGapCat: 'Here are the top deals with huge price gaps in this category:',
        foundDiscountKw: 'Here are the discounted products for "{keyword}":',
        foundDiscountCat: 'Here are the discounted products in this category:',
        foundKw: 'Here are the best results for "{keyword}":',

        // 請將上述內容改為英文，確保 Key 名稱與 zh-Hant 一模一樣
        appTitle: "SmartDeal Board", pageTitleText: "SmartDeal Board", subTitleText: "Compare with City Average",
        filterPlace: "Search category, brand, product or store...", backBtn: "Back",
        optSmAll: "Best Store (All)", optCatAll: "All Categories", optSortDiff: "📉 Highest True Discount", optSortMinP: "💰 Lowest Price", optSortCustom: "Custom Sort",
        qsLabel: "Quick Search:", qs1: "Cola", qs2: "Noodles", qs3: "PARKnSHOP", qs4: "Wellcome",
        listTitle: "🔥 Today's Top Discounts", dailyUpdateBadge: "Daily Update",
        thRank: "Rank", thCat: "Category", thSm: "Store", thName: "Product Name", thType: "Offer Type", thOrig: "Original", thEff: "Effective", thDiff: "True Diff", thOther: "Other Prices",
        typeDiscount: "📉 True Drop", typePromo: "🏷️ Promo Offer", noData: "No Data Found 🤷‍♂️", origPriceStr: "Orig.", fail: "Load Failed"
    
    }
};
    
const supermarketDict = {
    'zh-Hant': { 
        'WELLCOME': '惠康', 
        'PARKNSHOP': '百佳', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'WATSONS': '屈臣氏', 
        'MANNINGS': '萬寧', 
        'USELECT': 'U購', 
        'LUNGFUNG': '龍豐',
        'DCHFOOD': '大昌食品',
        'SASA': '莎莎'
    },
    'zh-Hans': { 
        'WELLCOME': '惠康', 
        'PARKNSHOP': '百佳', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'WATSONS': '屈臣氏', 
        'MANNINGS': '万宁', 
        'USELECT': 'U购', 
        'LUNGFUNG': '龙丰',
        'DCHFOOD': '大昌食品',
        'SASA': '莎莎'
    },
    'en': { 
        'WELLCOME': 'Wellcome', 
        'PARKNSHOP': 'PARKnSHOP', 
        'JASONS': 'Jasons', 
        'MARKETPLACE': 'Market Place', 
        'AEON': 'AEON', 
        'WATSONS': 'Watsons', 
        'MANNINGS': 'Mannings', 
        'USELECT': 'U-Select', 
        'LUNGFUNG': 'Lung Fung',
        'DCHFOOD': 'DCH Food',
        'SASA': 'Sasa'
    }
};
