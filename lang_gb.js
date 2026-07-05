// lang_gb.js - 簡體中文詞庫 (zh-Hans)
window.uiText = window.uiText || {};
window.uiText['zh-Hans'] = { 
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
    
    quickAll: "📦 查看全部",
    quickDiscount: "🏷️ 只看有优惠",
    quickHome: "🏠 回主目录",
    quickBye: "👋 拜拜",
    
    miniFooterLinks: "关于我们、条款及免责声明",
    miniFooterCopy: "© 2026 悭真D",
    disclaimerTitle: "免责声明及服务条款",
    
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

    appTitle: "智选真抵榜", pageTitleText: "智选真抵榜", subTitleText: "踢走假降价，对比全城平均价",
    filterPlace: "搜索分类、品牌、商品或推荐超市...", backBtn: "返回",
    optSmAll: "推荐超市 (全部)", optCatAll: "所有分类", optSortDiff: "📉 真・减幅最高", optSortMinP: "💰 折实价最低", optSortCustom: "自定义排序",
    qsLabel: "热门搜索:", qs1: "可乐", qs2: "出前一丁", qs3: "百佳", qs4: "惠康",
    listTitle: "🔥 今日 Top 降价商品", dailyUpdateBadge: "每日更新",
    thRank: "排名", thCat: "分类", thSm: "超市", thBrand: "品牌", thName: "商品名称", thType: "优惠类型", thOrig: "原价", thEff: "折实价", thDiff: "真・减幅", thOther: "其他超市定价",
    typeDiscount: "📉 真降价", typePromo: "🏷️ 促销优惠", noData: "暂无数据 🤷‍♂️", origPriceStr: "原价", fail: "读取数据失败"
};

window.supermarketDict = window.supermarketDict || {};
window.supermarketDict['zh-Hans'] = { 
    'WELLCOME': '惠康', 
    'PARKNSHOP': '百佳', 
    'JASONS': 'Market Place (Jasons)',
    'MARKETPLACE': 'Market Place (Jasons)', 
    'AEON': 'AEON', 
    'WATSONS': '屈臣氏', 
    'MANNINGS': '万宁', 
    'USELECT': 'U购', 
    'LUNGFUNG': '龙丰',
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
window.categoryDict['zh-Hans'] = {
    '飲品': '饮品',
    '米 / 食油 / 罐頭 / 蔬果 / 肉類': '米 / 食油 / 罐头 / 蔬果 / 肉类',
    '家居用品 / 寵物食品及用品': '家居用品 / 宠物食品及用品',
    '粉麵 / 煮食用料 / 冷凍加工食品': '粉面 / 煮食用料 / 冷冻加工食品',
    '奶類及乳製品 / 大豆製品 / 蛋類': '奶类及乳制品 / 大豆制品 / 蛋类',
    '糖果 / 餅乾 / 小食': '糖果 / 饼干 / 小食',
    '麵包蛋糕 / 穀類早餐 / 麵包醬': '面包蛋糕 / 谷类早餐 / 面包酱',
    '酒類': '酒类',
    '個人護理': '个人护理',
    '奶粉 / 嬰兒用品': '奶粉 / 婴儿用品'
};