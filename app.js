import { i18n } from './i18n.js';
import { renderHeader } from './header.js';
import { renderFooter } from './footer.js';
import { getAIConfig, getGradingRule } from './promptConfig.js';

renderHeader('header-container');
renderFooter('footer-container');

// DOM Elements
const els = {
    langSelect: document.getElementById('langSelect'), engineSelect: document.getElementById('engineSelect'),
    openSettingsBtn: document.getElementById('openSettingsBtn'), openShareBtn: document.getElementById('openShareBtn'),
    settingsModal: document.getElementById('settingsModal'), shareModal: document.getElementById('shareModal'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    qrCodeImg: document.getElementById('qrCodeImg'), copyLinkBtn: document.getElementById('copyLinkBtn'),
    
    taskMode: document.getElementById('taskMode'),
    levelSelect: document.getElementById('studentLevel'), subjectSelect: document.getElementById('subjectSelect'),
    customSubjectInput: document.getElementById('customSubjectInput'), countSelect: document.getElementById('questionCount'),
    countContainer: document.getElementById('countContainer'),
    focusInput: document.getElementById('customFocusInput'), apiKeyInput: document.getElementById('apiKeyInput'),
    
    tabImage: document.getElementById('tabImageBtn'), tabText: document.getElementById('tabTextBtn'),
    imageArea: document.getElementById('imageArea'), textArea: document.getElementById('textArea'),
    cameraInput: document.getElementById('cameraInput'), imageGrid: document.getElementById('imageGrid'),
    textInput: document.getElementById('textInput'),
    generateBtn: document.getElementById('generateBtn'), loading: document.getElementById('loading'),
    resultsSection: document.getElementById('resultsSection'), tutorWorkspace: document.getElementById('tutorWorkspace'),
    
    uiCurrentSettingsSummary: document.getElementById('ui-currentSettingsSummary'),
    openSettingsLinkBtn: document.getElementById('openSettingsLinkBtn')
};

let currentImages = []; let currentExamState = null; 

const historySection = document.createElement('div');
historySection.id = 'historyReviewSection'; historySection.className = "w-full max-w-2xl mx-auto mt-2"; historySection.style.display = 'none'; 
els.resultsSection.parentNode.insertBefore(historySection, els.resultsSection);

const navElements = { tutorBtn: document.getElementById('navTutorBtn'), studentBtn: document.getElementById('navStudentBtn'), navContainer: document.getElementById('navContainer') };

// ⚙️ Modal 綁定邏輯
function setupModal(modalEl, openBtns, closeBtnClass) {
    if(!modalEl) return;
    const openM = () => {
        modalEl.classList.remove('hidden');
        setTimeout(() => { modalEl.classList.remove('opacity-0'); modalEl.querySelector('.modal-content').classList.replace('scale-95', 'scale-100'); }, 10);
    };
    const closeM = () => {
        modalEl.classList.add('opacity-0'); modalEl.querySelector('.modal-content').classList.replace('scale-100', 'scale-95');
        setTimeout(() => modalEl.classList.add('hidden'), 300);
    };
    if (openBtns) openBtns.forEach(btn => btn?.addEventListener('click', openM));
    if (closeBtnClass) document.querySelectorAll(closeBtnClass).forEach(b => b.addEventListener('click', closeM));
    modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeM(); });
    return closeM;
}

const closeSettingsModal = setupModal(els.settingsModal, [els.openSettingsBtn, els.openSettingsLinkBtn], '.closeSettingsBtn');
setupModal(els.shareModal, [els.openShareBtn], '.closeShareBtn');

// 📤 分享 App (QR Code)
els.openShareBtn.addEventListener('click', () => {
    const currentUrl = window.location.href.split('#')[0].split('?')[0]; 
    els.qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&margin=10`;
});

els.copyLinkBtn.addEventListener('click', async () => {
    const t = i18n[els.langSelect.value];
    const cleanUrl = window.location.href.split('#')[0].split('?')[0];
    await navigator.clipboard.writeText(`${t.sharePromoText}\n${cleanUrl}`);
    els.copyLinkBtn.innerText = t.copySuccess; els.copyLinkBtn.classList.replace('bg-indigo-600', 'bg-emerald-600');
    setTimeout(() => { els.copyLinkBtn.innerText = t.copyLinkBtn; els.copyLinkBtn.classList.replace('bg-emerald-600', 'bg-indigo-600'); }, 3000);
});

setTimeout(() => { const fb = document.getElementById('ui-footerLinks'); if(fb) { setupModal(document.getElementById('infoModal'), [fb], '.closeModalBtn'); } }, 100);

// 🌟 動態科目系統
function getCustomSubjects() { return JSON.parse(localStorage.getItem('eduMindCustomSubjects')) || []; }
function addCustomSubject(name) { let subs = getCustomSubjects(); if (!subs.includes(name) && name.trim()) { subs.push(name); localStorage.setItem('eduMindCustomSubjects', JSON.stringify(subs)); } }

function updateLevelAndSubjectOptions(lang) {
    const t = i18n[lang]; if(!t) return;
    const tVal = els.taskMode.value; els.taskMode.innerHTML = `<option value="quiz" id="opt-quiz">${t.optQuiz}</option><option value="tutor" id="opt-tutor">${t.optTutor}</option>`;
    if(Array.from(els.taskMode.options).some(o=>o.value===tVal)) els.taskMode.value = tVal; else els.taskMode.value = 'quiz';
    const lVal = els.levelSelect.value; els.levelSelect.innerHTML = `<option value="kg">${t.lvlKg}</option><option value="pri">${t.lvlPri}</option><option value="sec">${t.lvlSec}</option><option value="dse">${t.lvlDse}</option><option value="uni">${t.lvlUni}</option>`;
    if(Array.from(els.levelSelect.options).some(o=>o.value===lVal)) els.levelSelect.value = lVal; else els.levelSelect.value = 'pri';
    let optionsHtml = `<option value="math">${t.subMath}</option><option value="chinese">${t.subChi}</option><option value="english">${t.subEng}</option><option value="science">${t.subSci}</option>`;
    getCustomSubjects().forEach(sub => { optionsHtml += `<option value="custom_${sub}">🏷️ ${sub}</option>`; }); optionsHtml += `<option value="custom" class="font-bold text-indigo-600">${t.subCustom}</option>`;
    const sVal = els.subjectSelect.value; els.subjectSelect.innerHTML = optionsHtml;
    if (sVal && Array.from(els.subjectSelect.options).some(o => o.value === sVal)) els.subjectSelect.value = sVal;
}

function updateSummaryUI(t) {
    let subText = els.subjectSelect.value === 'custom' ? els.customSubjectInput.value : els.subjectSelect.options[els.subjectSelect.selectedIndex]?.text || '';
    subText = subText.replace('🏷️ ', '');
    let lvlText = els.levelSelect.options[els.levelSelect.selectedIndex]?.text.split('/')[0].trim() || '';
    let taskText = els.taskMode.options[els.taskMode.selectedIndex]?.text || ''; taskText = taskText.split('(')[0].trim() || '';
    let countText = els.taskMode.value === 'tutor' ? '' : ` | ${els.countSelect.value}${t.countSuffix || '題'}`;
    document.getElementById('ui-currentSettingsLabel').innerText = t.currentSettingsLabel; els.openSettingsLinkBtn.innerText = t.editSettingsLink;
    els.uiCurrentSettingsSummary.innerText = `[${taskText}] ${lvlText} | ${subText}${countText}`;
}

function updateLanguage(lang) {
    const t = i18n[lang]; if (!t) return;
    updateLevelAndSubjectOptions(lang);
    document.getElementById('ui-title').innerText = t.appTitle; document.getElementById('ui-sub').innerText = t.appSub; document.getElementById('ui-taskLabel').innerText = t.taskLabel;
    els.tabImage.innerText = t.tabImage; els.tabText.innerText = t.tabText; document.getElementById('ui-uploadBtn').innerText = t.uploadBtn; els.textInput.placeholder = t.textPlaceholder;
    els.generateBtn.innerText = els.taskMode.value === 'tutor' ? t.genTutorBtn : t.genQuizBtn; navElements.tutorBtn.innerText = t.navTutor; navElements.studentBtn.innerText = t.navStudent;
    document.getElementById('ui-settingsTitle').innerText = t.settingsTitle; document.getElementById('ui-apiKeyLabel').innerText = t.apiKeyLabel; els.apiKeyInput.placeholder = t.apiKeyPlaceholder;
    document.getElementById('ui-tutorLabel').innerText = t.tutorLabel; document.getElementById('ui-subjectLabel').innerText = t.subjectLabel; els.customSubjectInput.placeholder = t.customSubPlaceholder;
    document.getElementById('ui-countLabel').innerText = t.countLabel; document.getElementById('ui-customLabel').innerText = t.customLabel; els.focusInput.placeholder = t.customPlaceholder; els.saveSettingsBtn.innerText = t.saveSettingsBtn;
    document.getElementById('ui-shareTitle').innerText = t.shareTitle; document.getElementById('ui-sharePromoText').innerText = t.sharePromoText; els.copyLinkBtn.innerHTML = t.copyLinkBtn;
    if(document.getElementById('ui-footerLinks')) { document.getElementById('ui-footerLinks').innerText = t.footerLinks; document.getElementById('ui-footerCopyright').innerText = t.footerCopyright; document.getElementById('ui-footerDevTeam').innerText = t.footerDevTeam; document.getElementById('ui-footerDevLink').innerText = t.footerDevLink; document.getElementById('ui-modalTitle').innerText = t.modalTitle; document.getElementById('ui-modalAboutTitle').innerText = t.modalAboutTitle; document.getElementById('ui-modalAboutContent').innerText = t.modalAboutContent; document.getElementById('ui-modalTermsTitle').innerText = t.modalTermsTitle; document.getElementById('ui-modalTermsContent').innerHTML = t.modalTermsContent; }
    document.querySelectorAll('.closeModalBtn').forEach(b => b.innerText = t.closeModalBtn);
    els.countContainer.style.display = els.taskMode.value === 'tutor' ? 'none' : 'block'; updateSummaryUI(t); if (historySection.style.display === 'block') renderHistoryUI();
}

els.subjectSelect.addEventListener('change', (e) => { if (e.target.value === 'custom') { els.customSubjectInput.classList.remove('hidden'); els.customSubjectInput.focus(); } else els.customSubjectInput.classList.add('hidden'); });
els.taskMode.addEventListener('change', (e) => { const t = i18n[els.langSelect.value]; els.generateBtn.innerText = e.target.value === 'tutor' ? t.genTutorBtn : t.genQuizBtn; els.countContainer.style.display = e.target.value === 'tutor' ? 'none' : 'block'; updateSummaryUI(t); });

function loadDefaults() {
    updateLanguage(els.langSelect.value);
    try {
        const d = JSON.parse(localStorage.getItem('eduMindDefaults'));
        if (d) {
            if(d.apiKey) els.apiKeyInput.value = d.apiKey;
            if(d.taskMode) { els.taskMode.value = d.taskMode; els.taskMode.dispatchEvent(new Event('change')); }
            if(d.level) els.levelSelect.value = d.level; if(d.count) els.countSelect.value = d.count; if(d.focus) els.focusInput.value = d.focus;
            if(d.subject) { if(d.subject === 'custom' && d.customSubjectStr) { els.subjectSelect.value = 'custom'; els.customSubjectInput.classList.remove('hidden'); els.customSubjectInput.value = d.customSubjectStr; } else els.subjectSelect.value = d.subject; }
        }
    } catch (e) {}
    updateSummaryUI(i18n[els.langSelect.value]);
}
loadDefaults();
els.langSelect.addEventListener('change', (e) => updateLanguage(e.target.value));

els.saveSettingsBtn.addEventListener('click', () => {
    let finalSubject = els.subjectSelect.value; let customText = els.customSubjectInput.value.trim();
    if (finalSubject === 'custom' && customText) { addCustomSubject(customText); finalSubject = `custom_${customText}`; updateLevelAndSubjectOptions(els.langSelect.value); els.subjectSelect.value = finalSubject; els.customSubjectInput.classList.add('hidden'); }
    localStorage.setItem('eduMindDefaults', JSON.stringify({ apiKey: els.apiKeyInput.value.trim(), taskMode: els.taskMode.value, level: els.levelSelect.value, subject: finalSubject, customSubjectStr: customText, count: els.countSelect.value, focus: els.focusInput.value.trim() }));
    updateSummaryUI(i18n[els.langSelect.value]); const t = i18n[els.langSelect.value]; alert(t.saveSettingsSuccess); if(closeSettingsModal) closeSettingsModal();
});

function switchPage(page) {
    navElements.navContainer.style.display = 'flex'; 
    if (page === 'tutor') {
        navElements.tutorBtn.className = "flex-1 py-3 text-sm font-bold rounded-xl bg-white text-indigo-600 shadow-sm transition-all"; navElements.studentBtn.className = "flex-1 py-3 text-sm font-bold rounded-xl text-slate-500 hover:text-indigo-500 hover:bg-white/50 transition-all";
        els.tutorWorkspace.style.display = 'block'; historySection.style.display = 'none'; els.resultsSection.innerHTML = ''; currentExamState = null; 
    } else {
        navElements.studentBtn.className = "flex-1 py-3 text-sm font-bold rounded-xl bg-white text-indigo-600 shadow-sm transition-all"; navElements.tutorBtn.className = "flex-1 py-3 text-sm font-bold rounded-xl text-slate-500 hover:text-indigo-500 hover:bg-white/50 transition-all";
        els.tutorWorkspace.style.display = 'none'; historySection.style.display = 'block'; els.resultsSection.innerHTML = ''; renderHistoryUI(); 
    }
}
navElements.tutorBtn.addEventListener('click', () => switchPage('tutor')); navElements.studentBtn.addEventListener('click', () => switchPage('student'));

function switchTab(mode) {
    if (mode === 'image') {
        els.tabImage.className = "flex-1 py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 transition-all"; els.tabText.className = "flex-1 py-3 text-sm font-bold text-slate-500 border-b-2 border-transparent hover:text-indigo-500 transition-all";
        els.imageArea.classList.remove('hidden'); els.textArea.classList.add('hidden');
    } else {
        els.tabText.className = "flex-1 py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 transition-all"; els.tabImage.className = "flex-1 py-3 text-sm font-bold text-slate-500 border-b-2 border-transparent hover:text-indigo-500 transition-all";
        els.textArea.classList.remove('hidden'); els.imageArea.classList.add('hidden');
    }
}

// 🚀 引擎切換防呆邏輯
els.tabImage.addEventListener('click', () => { if (els.engineSelect.value !== 'deepseek' && els.engineSelect.value !== 'groq') switchTab('image'); }); 
els.tabText.addEventListener('click', () => switchTab('text'));
els.engineSelect.addEventListener('change', (e) => { 
    if (e.target.value === 'deepseek' || e.target.value === 'groq') { 
        switchTab('text'); els.tabImage.classList.add('opacity-50', 'cursor-not-allowed'); currentImages = []; els.imageGrid.innerHTML = ''; els.cameraInput.value = ''; alert(i18n[els.langSelect.value].textOnlyAlert); 
    } else { els.tabImage.classList.remove('opacity-50', 'cursor-not-allowed'); } 
});

els.cameraInput.addEventListener('change', async (e) => { els.imageGrid.innerHTML = ''; currentImages = []; const files = Array.from(e.target.files); for (let file of files) { const base64 = await compressImage(file); currentImages.push(base64); const img = document.createElement('img'); img.src = base64; img.className = "h-20 w-20 object-cover rounded-lg border-2 border-slate-200 shadow-sm flex-shrink-0"; els.imageGrid.appendChild(img); } els.imageGrid.classList.remove('hidden'); });
function compressImage(file) { return new Promise((resolve) => { const reader = new FileReader(); reader.onload = (e) => { const img = new Image(); img.onload = () => { const canvas = document.createElement('canvas'); let w = img.width, h = img.height; if (Math.max(w, h) > 1024) { const ratio = 1024 / Math.max(w, h); w *= ratio; h *= ratio; } canvas.width = w; canvas.height = h; const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, w, h); resolve(canvas.toDataURL('image/jpeg', 0.8)); }; img.src = e.target.result; }; reader.readAsDataURL(file); }); }

function fallbackJSON(reason, brokenText = "") {
    const t = i18n[els.langSelect.value] || i18n['zh-HK']; const snippet = brokenText.length > 200 ? brokenText.substring(0, 200) + "..." : brokenText;
    return JSON.stringify([{ error: true, explanation: `${t.aiErrorTitle} (${reason})。<br><br><b>${t.ctoReportTitle}</b><br><code class="text-xs text-red-600 bg-red-50 border border-red-200 p-3 block mt-2 rounded overflow-x-auto whitespace-pre-wrap">${snippet}</code>` }]);
}

function cleanAIResponse(text, taskMode) {
    const t = i18n[els.langSelect.value];
    let cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/```json/gi, '').replace(/```/g, '').trim();
    cleaned = cleaned.replace(/[\n\r\t]/g, ' ').replace(/}\s*{/g, '},{').replace(/,\s*([\]}])/g, '$1');
    let start = cleaned.indexOf('[');
    if (start !== -1) { let attemptStr = cleaned.substring(start); let end = attemptStr.lastIndexOf(']'); while (end !== -1) { let attempt = attemptStr.substring(0, end + 1); try { JSON.parse(attempt); return attempt; } catch (e) { end = attemptStr.lastIndexOf(']', end - 1); } } }
    let salvaged = [];
    if (taskMode === 'quiz') {
        let parts = cleaned.split(/"question"\s*:/);
        for (let i = 1; i < parts.length; i++) { let part = '{"question":' + parts[i]; let closeIndex = part.indexOf('}'); while(closeIndex !== -1) { let objStr = part.substring(0, closeIndex + 1); try { let parsedObj = JSON.parse(objStr); if(parsedObj.question && parsedObj.options) { salvaged.push(parsedObj); break; } } catch(e) { closeIndex = part.indexOf('}', closeIndex + 1); } } }
    } else {
        let keyword = taskMode === 'tutor' ? '"question"' : '"answer"'; let parts = cleaned.split(new RegExp(keyword + "\\s*:"));
        for (let i = 1; i < parts.length; i++) { let part = `{${keyword}:` + parts[i]; let closeIndex = part.indexOf('}'); while(closeIndex !== -1) { let objStr = part.substring(0, closeIndex + 1); try { let parsedObj = JSON.parse(objStr); if(parsedObj.explanation) { salvaged.push(parsedObj); break; } } catch(e) { closeIndex = part.indexOf('}', closeIndex + 1); } } }
    }
    if (salvaged.length > 0) return JSON.stringify(salvaged); return fallbackJSON(t.contextExhaustion, text);
}

// 🌐 智能環境偵測 (自動分辨 Local 定 Vercel)
const isLocalEnv = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

els.generateBtn.addEventListener('click', async () => {
    const isTextMode = els.imageArea.classList.contains('hidden'); const textData = els.textInput.value.trim(); const apiKey = els.apiKeyInput.value.trim(); const currentLang = els.langSelect.value; const taskMode = els.taskMode.value; const t = i18n[currentLang];
    if (!apiKey || (isTextMode && !textData) || (!isTextMode && currentImages.length === 0)) { alert(t.alertProvideInput); els.openSettingsLinkBtn.click(); return; }
    let count = els.countSelect.value; if(count > 10) count = 10; 
    let finalSubjectStr = els.subjectSelect.value === 'custom' ? els.customSubjectInput.value.trim() || '未分類' : (els.subjectSelect.value.startsWith('custom_') ? els.subjectSelect.value.replace('custom_', '') : els.subjectSelect.options[els.subjectSelect.selectedIndex].text);
    document.getElementById('ui-loadingText').innerText = taskMode === 'tutor' ? t.loadingTutor : t.loadingQuiz; els.loading.classList.remove('hidden'); els.resultsSection.innerHTML = '';
    
    const aiConfig = getAIConfig(els.levelSelect.value, currentLang, taskMode, finalSubjectStr, count);
    const customFocus = els.focusInput.value.trim(); const middleLayer = customFocus ? `${t.focusLabel}${customFocus}\n` : "";
    const finalPrompt = `${aiConfig.persona}\n【目標科目：${finalSubjectStr}】\n${middleLayer}\n${aiConfig.guardrail}`;

    try {
        let rawJSONText = ""; const engine = els.engineSelect.value; let currentTokenUsage = {}; 
        
        if (engine === 'gemini') {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: finalPrompt }, ...(isTextMode ? [{ text: textData }] : currentImages.map(b64 => ({ inlineData: { mimeType: 'image/jpeg', data: b64.split(',')[1] } })))] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1, maxOutputTokens: 4000 } }) });
            const data = await res.json(); if (!res.ok) throw new Error(data.error?.message || "API Error");
            if (data.usageMetadata) currentTokenUsage = { promptTokens: data.usageMetadata.promptTokenCount, responseTokens: data.usageMetadata.candidatesTokenCount, totalTokens: data.usageMetadata.totalTokenCount }; rawJSONText = data.candidates[0].content.parts[0].text;
        } 
        else if (engine === 'deepseek' || engine === 'groq') {
            // 🚀 智能路由：如果係 Local 就直指 Groq (配合 CORS 外掛)；如果係 Vercel 就指去 /api/groq
            let endpoint = '';
            let modelName = '';
            if (engine === 'deepseek') {
                endpoint = 'https://api.deepseek.com/chat/completions';
                modelName = 'deepseek-reasoner';
            } else {
                endpoint = isLocalEnv ? 'https://api.groq.com/openai/v1/chat/completions' : '/api/groq';
                // ✅ 統一更新為 Llama 3.3
                modelName = 'llama-3.3-70b-versatile';
            }
            
            const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify({ model: modelName, messages: [{ role: "user", content: [{ type: "text", text: finalPrompt }, ...(isTextMode ? [{ type: "text", text: textData }] : [])] }], max_tokens: 4000, temperature: 0.1 }) });
            const data = await res.json(); if (!res.ok) throw new Error(data.error?.message || "API Error");
            if (data.usage) currentTokenUsage = { promptTokens: data.usage.prompt_tokens, responseTokens: data.usage.completion_tokens, totalTokens: data.usage.total_tokens }; rawJSONText = data.choices[0].message.content;
        }

        const cleanedJSON = cleanAIResponse(rawJSONText, taskMode); let finalQA = JSON.parse(cleanedJSON);
        if (Array.isArray(finalQA) && !finalQA[0]?.error) {
            els.tutorWorkspace.style.display = 'none'; navElements.navContainer.style.display = 'none'; 
            if (taskMode === 'quiz') {
                finalQA = finalQA.slice(0, parseInt(count)); currentExamState = { taskMode: 'quiz', subjectStr: finalSubjectStr, questions: finalQA, engine: engine, apiKey: apiKey, textData: textData, isTextMode: isTextMode, images: [...currentImages], step1Tokens: currentTokenUsage, level: els.levelSelect.value, customFocus: customFocus }; renderExamMode();
            } else {
                saveToHistoryStorage({ task_mode: "tutor", subject: finalSubjectStr, student_level: els.levelSelect.value, custom_focus: customFocus, engine: engine, token_cost: currentTokenUsage }, finalQA); renderTutorBoard(finalQA);
            }
        } else { renderResultsError(finalQA[0].explanation); }
    } catch (error) { console.error(error); renderResultsError(t.apiError); } finally { els.loading.classList.add('hidden'); }
});

function renderExamMode() {
    const t = i18n[els.langSelect.value]; els.resultsSection.classList.remove('hidden'); els.resultsSection.innerHTML = ''; 
    currentExamState.questions.forEach((qa, i) => {
        const qDiv = document.createElement('div'); qDiv.className = "bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-4";
        let html = `<p class="font-bold text-lg mb-4 text-slate-800"><span class="text-indigo-600 mr-2">Q${i+1}.</span>${qa.question}</p><div class="flex flex-col gap-2">`;
        qa.options.forEach(opt => { html += `<button class="exam-opt text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium text-slate-700">${opt}</button>`; });
        html += `</div>`; qDiv.innerHTML = html;
        qDiv.querySelectorAll('.exam-opt').forEach(btn => {
            btn.onclick = () => { qDiv.querySelectorAll('.exam-opt').forEach(b => b.className = "exam-opt text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all font-medium text-slate-700"); btn.className = "exam-opt text-left p-3 border-2 border-indigo-500 bg-indigo-50 rounded-lg font-bold text-indigo-800 transition-all"; currentExamState.questions[i].studentAnswer = btn.innerText; };
        });
        els.resultsSection.appendChild(qDiv);
    });
    const submitBtn = document.createElement('button'); submitBtn.className = "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-md transition-all text-center mt-2"; submitBtn.innerHTML = t.submitExam; submitBtn.onclick = submitForGrading; els.resultsSection.appendChild(submitBtn);
}

function renderTutorBoard(qaArray, isFromHistory = false) {
    const t = i18n[els.langSelect.value]; els.resultsSection.classList.remove('hidden'); els.resultsSection.innerHTML = ''; 
    const backBtn = document.createElement('button'); backBtn.className = "mb-6 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"; backBtn.innerHTML = `${t.backBtn}`; backBtn.onclick = () => switchPage('student'); els.resultsSection.appendChild(backBtn);
    if (!isFromHistory) { const successMsg = document.createElement('div'); successMsg.className = "mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold text-sm shadow-sm flex items-center gap-2"; successMsg.innerHTML = t.savedSuccess; els.resultsSection.appendChild(successMsg); }
    qaArray.forEach((qa, i) => {
        const qDiv = document.createElement('div'); qDiv.className = `bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-4 border-l-4 border-l-amber-500`;
        qDiv.innerHTML = `<div class="flex flex-col gap-2 mb-3 border-b border-slate-100 pb-4"><div class="flex items-center gap-2"><span class="bg-amber-100 text-amber-700 text-xs font-extrabold px-2 py-1 rounded">Step ${i+1}</span><h3 class="font-bold text-lg text-slate-800">${qa.question || "解說"}</h3></div>${qa.knowledge_tag && qa.knowledge_tag !== "未分類" ? `<div><span class="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">🏷️ ${qa.knowledge_tag}</span></div>` : ''}</div><div class="bg-amber-50/30 p-4 rounded-lg border border-amber-50"><p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">${qa.explanation}</p></div>`; els.resultsSection.appendChild(qDiv);
    });
}

async function submitForGrading() {
    const t = i18n[els.langSelect.value]; const unanswered = currentExamState.questions.filter(q => !q.studentAnswer);
    if (unanswered.length > 0) { alert(t.unansweredAlert); return; }
    document.getElementById('ui-loadingText').innerText = t.gradingText; els.loading.classList.remove('hidden'); els.resultsSection.innerHTML = '';
    const gradingPrompt = getGradingRule(els.langSelect.value) + `\n\n學生作答紀錄：\n` + JSON.stringify(currentExamState.questions.map((q, i) => ({ questionId: `Q${i+1}`, question: q.question, studentAnswer: q.studentAnswer })));
    try {
        let rawJSONText = ""; let step2Tokens = {}; const engine = currentExamState.engine; const apiKey = currentExamState.apiKey;
        if (engine === 'gemini') {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: gradingPrompt }, ...(currentExamState.isTextMode ? [{ text: currentExamState.textData }] : currentExamState.images.map(b64 => ({ inlineData: { mimeType: 'image/jpeg', data: b64.split(',')[1] } })))] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1, maxOutputTokens: 4000 } }) });
            const data = await res.json(); if (!res.ok) throw new Error(data.error?.message || "API Error");
            if (data.usageMetadata) step2Tokens = { promptTokens: data.usageMetadata.promptTokenCount, responseTokens: data.usageMetadata.candidatesTokenCount, totalTokens: data.usageMetadata.totalTokenCount }; rawJSONText = data.candidates[0].content.parts[0].text;
        } else if (engine === 'deepseek' || engine === 'groq') {
            // 🚀 智能路由同樣應用喺批改度
            let endpoint = '';
            let modelName = '';
            if (engine === 'deepseek') {
                endpoint = 'https://api.deepseek.com/chat/completions';
                modelName = 'deepseek-reasoner';
            } else {
                endpoint = isLocalEnv ? 'https://api.groq.com/openai/v1/chat/completions' : '/api/groq';
                // ✅ 統一更新為 Llama 3.3
                modelName = 'llama-3.3-70b-versatile';
            }
            
            const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify({ model: modelName, messages: [{ role: "user", content: [{ type: "text", text: gradingPrompt }, ...(currentExamState.isTextMode ? [{ type: "text", text: currentExamState.textData }] : [])] }], max_tokens: 4000, temperature: 0.1 }) });
            const data = await res.json(); if (!res.ok) throw new Error(data.error?.message || "API Error");
            if (data.usage) step2Tokens = { promptTokens: data.usage.prompt_tokens, responseTokens: data.usage.completion_tokens, totalTokens: data.usage.total_tokens }; rawJSONText = data.choices[0].message.content;
        }
        const cleanedJSON = cleanAIResponse(rawJSONText, 'grade'); let gradingResults = JSON.parse(cleanedJSON);
        if (Array.isArray(gradingResults) && !gradingResults[0]?.error) {
            let correctCount = 0; const finalTokens = { promptTokens: currentExamState.step1Tokens.promptTokens + (step2Tokens.promptTokens || 0), responseTokens: currentExamState.step1Tokens.responseTokens + (step2Tokens.responseTokens || 0), totalTokens: currentExamState.step1Tokens.totalTokens + (step2Tokens.totalTokens || 0) };
            currentExamState.questions.forEach((q, i) => {
                const grade = gradingResults[i] || { isCorrect: false, explanation: t.fallbackExp.replace('{ans}', "N/A"), answer: "N/A", knowledge_tag: "未分類" };
                q.isCorrect = grade.isCorrect; q.explanation = grade.explanation || t.fallbackExp.replace('{ans}', grade.answer); q.correctAnswer = grade.answer; q.knowledge_tag = grade.knowledge_tag || "未分類"; if (q.isCorrect) correctCount++;
            });
            const scoreData = { correct: correctCount, total: currentExamState.questions.length };
            saveToHistoryStorage({ task_mode: "quiz", subject: currentExamState.subjectStr, student_level: currentExamState.level, custom_focus: currentExamState.customFocus, engine: engine, token_cost: finalTokens }, currentExamState.questions, scoreData); renderGradedReview(currentExamState.questions, scoreData, false); currentExamState = null; 
        } else { renderResultsError(gradingResults[0].explanation); }
    } catch (error) { console.error(error); renderResultsError(t.apiError); } finally { els.loading.classList.add('hidden'); }
}

function saveToHistoryStorage(metaContext, qaData, scoreData = null) {
    try {
        let history = JSON.parse(localStorage.getItem('eduMindHistory')) || [];
        history.unshift({ id: `hist_${Date.now()}`, timestamp: new Date().toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong' }), created_at: new Date().toISOString(), context: metaContext, score: scoreData, generatedQuestions: qaData }); 
        localStorage.setItem('eduMindHistory', JSON.stringify(history));
    } catch (e) { console.error("LocalStorage Save Error:", e); }
}

function renderHistoryUI() {
    const container = historySection; if (!container) return; const t = i18n[els.langSelect.value]; const history = JSON.parse(localStorage.getItem('eduMindHistory')) || [];
    if (history.length === 0) { container.innerHTML = `<div class="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200"><span class="text-4xl mb-4 block">📭</span><h3 class="font-bold text-lg text-slate-700 mb-2">${t.histEmpty}</h3><p class="text-sm text-slate-400">${t.histEmptySub}</p></div>`; return; }
    let listHtml = `<div class="flex justify-between items-end mb-6"><div><h2 class="text-2xl font-extrabold text-slate-800">${t.histTitle}</h2><p class="text-sm text-slate-500 font-medium">${t.histSub.replace('{n}', history.length)}</p></div><button id="clearHistoryBtn" class="text-sm font-bold text-rose-500 hover:text-rose-700 transition-all flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200"><span>🗑️</span> ${t.clearBtn.replace('🗑️ ', '')}</button></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
    history.forEach((record, index) => {
        const dateObj = new Date(parseInt(record.id.replace('hist_', ''))); const dateStr = dateObj.toLocaleDateString('zh-HK', { month: 'short', day: 'numeric' }); const timeStr = dateObj.toLocaleTimeString('zh-HK', { hour: '2-digit', minute: '2-digit' });
        const isQuiz = record.context?.task_mode === 'quiz' || !record.context?.task_mode; const taskTagStr = isQuiz ? `📝 ${t.tagQuiz}` : `🆘 ${t.tagTutor}`; const taskColor = isQuiz ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'; const subStr = record.context?.subject || '未分類';
        
        let engineBadge = '';
        if ((record.context?.engine || record.engine) === 'gemini') engineBadge = '<span class="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">GEMINI</span>';
        else if ((record.context?.engine || record.engine) === 'deepseek') engineBadge = '<span class="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">DEEPSEEK</span>';
        else engineBadge = '<span class="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">GROQ</span>';
        
        const tokens = record.context?.token_cost || record.tokenUsage; const tokenBadge = tokens?.totalTokens ? `<span class="text-[10px] font-mono text-slate-400">🔥 ${tokens.totalTokens} Tk</span>` : '';
        const scoreStr = isQuiz && record.score ? `<span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-2 inline-block">得分: ${record.score.correct}/${record.score.total}</span>` : '';
        listHtml += `<div class="history-card group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-${isQuiz ? 'indigo' : 'amber'}-400 cursor-pointer transition-all relative overflow-hidden" data-id="${record.id}"><div class="absolute top-0 left-0 w-1 h-full ${isQuiz ? 'bg-indigo-500' : 'bg-amber-500'} opacity-0 group-hover:opacity-100 transition-all"></div><div class="flex justify-between items-start mb-3"><div class="flex flex-col items-start gap-1.5"><div class="flex gap-2 items-center"><span class="${taskColor} text-xs font-extrabold px-2.5 py-1 rounded-md">${taskTagStr} #${history.length - index}</span>${scoreStr}</div><span class="text-[10px] font-bold text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">${subStr}</span></div><div class="flex flex-col items-end gap-1">${engineBadge}${tokenBadge}</div></div><h3 class="font-bold text-sm text-slate-800 mb-1 line-clamp-2">${record.generatedQuestions[0]?.question || "已儲存紀錄"}</h3><p class="text-xs text-slate-400 flex items-center gap-1 mt-3 border-t border-slate-50 pt-3"><span>📅</span> ${dateStr} ${timeStr}</p><div class="mt-2 flex justify-end"><span class="text-sm font-bold ${isQuiz ? 'text-indigo-600' : 'text-amber-600'} flex items-center gap-1">${t.startReview} <span>➡️</span></span></div></div>`;
    });
    listHtml += `</div>`; container.innerHTML = listHtml;
    container.querySelectorAll('.history-card').forEach(item => {
        item.onclick = () => {
            const rec = history.find(r => r.id === item.getAttribute('data-id'));
            if (rec) { container.style.display = 'none'; if ((rec.context ? rec.context.task_mode : 'quiz') === 'tutor') renderTutorBoard(rec.generatedQuestions, true); else renderGradedReview(rec.generatedQuestions, rec.score, true); els.resultsSection.scrollIntoView({ behavior: 'smooth' }); }
        };
    });
    document.getElementById('clearHistoryBtn').onclick = () => { if (confirm(t.confirmClear)) { localStorage.removeItem('eduMindHistory'); renderHistoryUI(); } };
}

function renderGradedReview(qaArray, scoreData, isFromHistory = false) {
    const t = i18n[els.langSelect.value]; els.resultsSection.classList.remove('hidden'); els.resultsSection.innerHTML = ''; 
    const backBtn = document.createElement('button'); backBtn.className = "mb-6 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"; backBtn.innerHTML = `${t.backBtn}`; backBtn.onclick = () => switchPage('student'); els.resultsSection.appendChild(backBtn);
    if (!isFromHistory) { const successMsg = document.createElement('div'); successMsg.className = "mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold text-sm shadow-sm flex items-center gap-2"; successMsg.innerHTML = t.savedSuccess; els.resultsSection.appendChild(successMsg); }
    if (scoreData) {
        const scorePercentage = Math.round((scoreData.correct / scoreData.total) * 100); const scoreDiv = document.createElement('div'); scoreDiv.className = `mb-6 p-6 rounded-xl border-2 text-center shadow-sm ${scorePercentage >= 50 ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`; scoreDiv.innerHTML = `<h2 class="text-2xl font-extrabold">${t.scoreReport.replace('{score}', scorePercentage).replace('{correct}', scoreData.correct).replace('{total}', scoreData.total)}</h2>`; els.resultsSection.appendChild(scoreDiv);
    }
    qaArray.forEach((qa, i) => {
        const qDiv = document.createElement('div'); qDiv.className = `bg-white p-6 rounded-xl border-2 shadow-sm mb-4 ${qa.isCorrect ? 'border-emerald-300' : 'border-rose-300'}`;
        const tagHtml = qa.knowledge_tag && qa.knowledge_tag !== "未分類" ? `<span class="inline-block mt-2 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded">🏷️ ${qa.knowledge_tag}</span>` : '';
        let html = `<div class="flex justify-between items-start mb-4"><div><p class="font-bold text-lg text-slate-800"><span class="text-indigo-600 mr-2">Q${i+1}.</span>${qa.question}</p>${tagHtml}</div><span class="px-3 py-1 rounded text-sm font-bold flex-shrink-0 ${qa.isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">${qa.isCorrect ? '✔ 正確' : '✘ 錯誤'}</span></div><div class="flex flex-col gap-2">`;
        qa.options.forEach(opt => { 
            let btnClass = "text-left p-3 border rounded-lg font-medium ";
            if (opt === qa.studentAnswer) { btnClass += qa.isCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-2 ring-emerald-200" : "bg-rose-50 border-rose-500 text-rose-800 font-bold ring-2 ring-rose-200"; } 
            else if (!qa.isCorrect && qa.correctAnswer && opt.includes(qa.correctAnswer)) { btnClass += "bg-emerald-50 border-emerald-400 text-emerald-700 border-dashed"; } 
            else { btnClass += "bg-slate-50 border-slate-200 text-slate-500 opacity-70"; }
            html += `<div class="${btnClass}">${opt}</div>`; 
        });
        html += `</div><div class="mt-4 bg-indigo-50 p-4 rounded-lg border border-indigo-100"><p class="text-sm text-indigo-900 whitespace-pre-wrap leading-relaxed">${qa.explanation}</p></div>`;
        qDiv.innerHTML = html; els.resultsSection.appendChild(qDiv);
    });
}

function renderResultsError(msg) {
    els.resultsSection.classList.remove('hidden'); els.resultsSection.innerHTML = `<div class="bg-red-50 p-4 border border-red-200 rounded-lg text-red-700 font-bold">${msg}</div>`;
    if (navElements.tutorBtn.parentNode.style.display === 'none') {
        const rescueBtn = document.createElement('button'); rescueBtn.className = "mt-4 text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"; rescueBtn.innerHTML = i18n[els.langSelect.value].backBtn; rescueBtn.onclick = () => switchPage('tutor'); els.resultsSection.appendChild(rescueBtn);
    }
}