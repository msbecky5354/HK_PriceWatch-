/**
 * PriceWatch - dbEngine.js (本地快取層 - 完全對齊完全體)
 */

const DB_NAME = 'PriceWatchDB';
const STORE_NAME = 'DailySnapshots';

window.openDB = function() {
    return new Promise((resolve, reject) => {
        // 💡 1. 先盲測打開當前資料庫，獲取瀏覽器現存的版本號
        const probeRequest = indexedDB.open(DB_NAME);
        
        probeRequest.onsuccess = (e) => {
            const db = e.target.result;
            const currentVersion = db.version;
            
            // 檢查現存的 Store 是否包含我們新定義的 STORE_NAME
            if (db.objectStoreNames.contains(STORE_NAME)) {
                db.close();
                // 結構正確，直接用當前版本打開
                const req = indexedDB.open(DB_NAME, currentVersion);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            } else {
                db.close();
                console.log(`[DB Upgrade] 偵測到結構不符，強制從版本 ${currentVersion} 升級至 ${currentVersion + 1}`);
                // 💡 2. 結構不符，強制將版本號 +1，逼迫瀏覽器觸發 onupgradeneeded
                const upgradeRequest = indexedDB.open(DB_NAME, currentVersion + 1);
                
                upgradeRequest.onupgradeneeded = (evt) => {
                    const upgradeDb = evt.target.result;
                    if (!upgradeDb.objectStoreNames.contains(STORE_NAME)) {
                        upgradeDb.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
                    }
                };
                upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);
                upgradeRequest.onerror = () => reject(upgradeRequest.error);
            }
        };
        
        // 如果是全新乾淨的瀏覽器，直接初始化版本 1
        probeRequest.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
            }
        };
        probeRequest.onerror = () => reject(probeRequest.error);
    });
};

window.getCachedData = async function(cacheKey) {
    try {
        const db = await window.openDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(cacheKey);
            req.onsuccess = () => resolve(req.result ? req.result.data : null); // 💡 解構 data 屬性
            req.onerror = () => resolve(null);
        });
    } catch (e) { return null; }
};

window.setCachedData = async function(cacheKey, data) {
    try {
        const db = await window.openDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            store.put({ cacheKey: cacheKey, data: data, timestamp: Date.now() }); // 💡 封裝寫入
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        });
    } catch (e) { return false; }
};

window.loadDynamicSnapshot = async function(lang) {
    const cacheTimeKey = `pw_snapshot_time_${lang}`;
    const CACHE_EXPIRE_MS = 6 * 60 * 60 * 1000; 
    
    const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/msbecky5354/JSON/main/data/snapshot_";
    const targetDate = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().split('T')[0];
    const cacheKey = `${lang}_${targetDate}`;
    
    try {
        const cachedData = await window.getCachedData(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        
        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime) < CACHE_EXPIRE_MS)) {
            console.log(`[Cache Hit] Loaded ${lang} from IndexedDB`);
            return cachedData;
        }
    } catch (e) {
        console.warn("[Cache Error] 快取讀取失敗，轉為強制 Fetch:", e);
    }

    try {
        const response = await fetch(`${GITHUB_RAW_BASE}${lang}.json?v=${targetDate}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        await window.setCachedData(cacheKey, data);
        localStorage.setItem(cacheTimeKey, Date.now().toString());
        console.log(`[Cache Miss] Fetched & Cached ${lang} to IndexedDB`);
        
        return data;
    } catch (error) {
        console.error(`[Fetch Fatal] 無法載入 ${lang}:`, error);
        const staleData = await window.getCachedData(cacheKey);
        if (staleData) {
            console.log(`[Offline Fallback] 降級使用 ${lang} 過期快取`);
            return staleData;
        }
        return null;
    }
};