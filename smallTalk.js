// 🔧 smallTalk.js
// 呢個檔案先係真正負責「判斷使用者係咪係傾偈而唔係搵貨品」嘅邏輯。
// botResponses.js 淨係有回覆文字，無呢個檔案就永遠唔會觸發任何閒聊回覆。
// 支援：繁體中文 / 简体中文 / English 三種語言關鍵字偵測。

(function () {
    // 每一組對應 botResponses.js 入面嘅一個 key，keywords 可以隨意加減
    const smallTalkGroups = [
        {
            key: 'replyGreeting',
            keywords: [
                'hi', 'hello', 'hey', 'morning', 'good morning', 'good afternoon', 'good evening',
                '哈囉', '哈囉囉', '你好', '您好', '早晨', '早安', '午安', '晚安', '在嗎', '喂', '喂喂',
                '你好', '您好', '早安', '在吗', '喂'
            ]
        },
        {
            key: 'replyThanks',
            keywords: [
                'thanks', 'thank you', 'thx', 'ty', 'appreciate it',
                '多謝', '唔該', '謝謝', '感謝', '感激', '多谢晒', '唔该晒',
                '多谢', '谢谢', '感谢', '感激'
            ]
        },
        {
            key: 'replyBye',
            keywords: [
                'bye', 'goodbye', 'bye bye', 'see you', 'see ya', 'cya', 'gtg', 'gotta go',
                '拜拜', '再見', '走先', '收工', '886', '掰掰',
                '再见', '拜拜', '走了', '886'
            ]
        },
        {
            key: 'replyPraise',
            keywords: [
                'good job', 'well done', 'nice', 'awesome', 'great', 'amazing', 'cool', 'you are smart', "you're smart",
                '叻仔', '叻女', '好叻', '勁', '犀利', '你好棒', '你真棒', '厲害', '勁呀', '好正',
                '厉害', '你真棒', '你好棒', '真行', '牛'
            ]
        },
        {
            key: 'replyJoke',
            keywords: [
                'joke', 'funny', 'tell me a joke', 'make me laugh',
                '講笑話', '講個笑話', '笑話', '搞笑', '玩下', '攪笑',
                '讲笑话', '讲个笑话', '笑话', '搞笑'
            ]
        },
        {
            key: 'replySmallTalkExtra',
            keywords: [
                'weather', 'how are you', "what's up", 'chat with you', 'talk to me', 'bored',
                '天氣', '今日天氣', '傾偈', '陪我傾偈', '同我傾', '悶', '今日點呀', '你食咗飯未',
                '天气', '今天天气', '聊天', '陪我聊天', '无聊', '你吃了吗'
            ]
        },
        {
            key: 'replyOmg',
            keywords: [
                'omg', 'wow', 'oh my god', 'no way', 'really?!',
                '嘩', '哇', '哇塞', '天呀', '天啊', '嚇親', '咁誇張', '咁犀利',
                '哇塞', '天哪', '吓到我'
            ]
        },
        {
            key: 'replyAgreement',
            keywords: [
                'yes', 'yeah', 'yep', 'sure', 'agree', 'totally', 'ok', 'okay',
                '係呀', '係啊', '係喎', '係嘅', '無錯', '正確', '同意',
                '是呀', '是的', '没错', '同意'
            ]
        },
        {
            key: 'replyHelp',
            keywords: [
                'help', 'how to use', 'how does this work', 'instructions', 'guide',
                '點用', '點樣用', '使用方法', '點玩', '怎麼用', '教學',
                '怎么用', '怎样用', '使用方法', '教程'
            ]
        },
        {
            key: 'replyWho',
            keywords: [
                'who are you', 'what are you', 'are you a robot', 'are you ai', 'your name',
                '你係邊個', '你係咩', '你叫咩名', '你係機械人', '你係AI', '你叫咩',
                '你是谁', '你是什么', '你叫什么', '你是机器人', '你是AI'
            ]
        },
        {
            key: 'r_no_product',
            keywords: [
                'cant find', "can't find", 'not found', 'no result', 'no results', 'missing product',
                '搵唔到', '搵唔到貨', '無貨', '無呢隻', '無呢個', '冇貨',
                '找不到', '找不到货', '没有货', '没有这个'
            ]
        },
        {
            key: 'r_privacy',
            keywords: [
                'privacy', 'is it safe', 'data collect', 'personal data', 'secure',
                '私隱', '個人資料', '安唔安全', '安全嗎', '收唔收集資料', '會唔會洩漏',
                '隐私', '个人资料', '安全吗', '会收集资料吗'
            ]
        },
        {
            key: 'r_alert',
            keywords: [
                'price alert', 'set alert', 'notify me', 'how to track price', 'alert me',
                '到價提醒', '點set提醒', '點set到價', '價格提醒', '幫我提醒',
                '到价提醒', '怎么设置提醒', '价格提醒'
            ]
        },
        {
            key: 'r_gap',
            keywords: [
                'big gap', 'price gap', 'biggest difference', 'price difference',
                '差價', '大差價', '超大差價', '邊度平好多', '邊隻差價大', '邊度抵好多',
                '差价', '大差价', '哪里便宜很多'
            ]
        },
        {
            key: 'r_home',
            keywords: [
                'add to home screen', 'install app', 'add to homescreen', 'pin to home',
                '加桌面', '加到主畫面', '加入主屏幕', '加圖示落桌面', '點set桌面icon',
                '加到主屏幕', '加图标', '怎么安装app'
            ]
        }
    ];

   window.checkSmallTalk = function (q) {
        if (!q) return null;
        const norm = String(q).toLowerCase().trim().replace(/[？\?。！\!，,.~～]/g, '');
        if (!norm) return null;

        // 💡 容易誤判嘅字白名單 (只要求呢啲字絕對精準，防止 Shiraz / 植物牛油 誤判)
        const exactMatchWords = ['hi', 'hey', 'thx', 'ty', 'bye', 'cya', 'gtg', 'ok', 'omg', 'wow', 'yes', 'yep', '牛', '喂', '悶'];

        for (const group of smallTalkGroups) {
            const hit = group.keywords.some(kw => {
                const lowerKw = kw.toLowerCase();
                
                if (exactMatchWords.includes(lowerKw)) {
                    // 如果係高危短字，必須絕對相等 或 獨立成詞
                    return norm === lowerKw || norm.split(/\s+/).includes(lowerKw);
                } else {
                    // 其他字眼 (例如: 天氣, 笑話) 允許包含在句子內
                    return norm.includes(lowerKw);
                }
            });

            if (hit) {
                if (typeof getBotReply === 'function') {
                    return getBotReply(group.key);
                }
                if (window.botResponses && window.botResponses[window.currentLang] && window.botResponses[window.currentLang][group.key]) {
                    return window.botResponses[window.currentLang][group.key];
                }
                return null;
            }
        }
        return null;
    };

    console.log("🔥 smallTalk.js 已經成功接通，升級版閒聊偵測功能已啟動！");
})();
