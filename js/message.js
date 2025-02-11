// Azure Translator API 설정
const TRANSLATOR_KEY = '9QIOsH4sQRqW8crgBjJE4X7BKMSMsRbDnXy7OwS61QV2yN4GLNBsJQQJ99BBAC3pKaRXJ3w3AAAbACOGDxZf';
const TRANSLATOR_REGION = 'eastasia';
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

// URL 파라미터에서 값 가져오기
const urlParams = new URLSearchParams(window.location.search);
const roomNumber = urlParams.get('room');
const selectedLanguage = urlParams.get('lang');

// DOM 요소
const roomInfo = document.getElementById('roomInfo');
const languageInfo = document.getElementById('languageInfo');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const categoryButtons = document.querySelectorAll('.category-btn');
const translatedMessage = document.getElementById('translatedMessage');

// 언어 표시 텍스트
const languageNames = {
    'ko': '한국어',
    'en': 'English',
    'ja': '日本語',
    'zh': '中文'
};

// 번역을 위한 언어 코드 매핑
const translateLanguageCodes = {
    'ko': 'ko',
    'en': 'en',
    'ja': 'ja',
    'zh': 'zh-Hans'
};

// 다국어 텍스트 정의
const translations = {
    'ko': {
        pageTitle: '메시지 작성',
        roomNumber: '객실 번호: ',
        selectedLanguage: '선택 언어: ',
        categorySelect: '카테고리 선택',
        categories: {
            cleaning: '청소 요청',
            amenity: '어메니티 요청',
            maintenance: '수리 요청',
            other: '기타 문의'
        },
        messageContent: '메시지 내용',
        messagePlaceholder: '메시지를 입력하세요',
        backButton: '뒤로가기',
        sendButton: '메시지 전송'
    },
    'en': {
        pageTitle: 'Write Message',
        roomNumber: 'Room Number: ',
        selectedLanguage: 'Selected Language: ',
        categorySelect: 'Select Category',
        categories: {
            cleaning: 'Cleaning Request',
            amenity: 'Amenity Request',
            maintenance: 'Maintenance Request',
            other: 'Other Inquiry'
        },
        messageContent: 'Message Content',
        messagePlaceholder: 'Enter your message',
        backButton: 'Back',
        sendButton: 'Send Message'
    },
    'ja': {
        pageTitle: 'メッセージ作成',
        roomNumber: '部屋番号: ',
        selectedLanguage: '選択言語: ',
        categorySelect: 'カテゴリー選択',
        categories: {
            cleaning: '清掃リクエスト',
            amenity: 'アメニティリクエスト',
            maintenance: '修理リクエスト',
            other: 'その他のお問い合わせ'
        },
        messageContent: 'メッセージ内容',
        messagePlaceholder: 'メッセージを入力してください',
        backButton: '戻る',
        sendButton: 'メッセージを送信'
    },
    'zh': {
        pageTitle: '写信息',
        roomNumber: '房间号: ',
        selectedLanguage: '所选语言: ',
        categorySelect: '选择类别',
        categories: {
            cleaning: '清洁请求',
            amenity: '客房用品请求',
            maintenance: '维修请求',
            other: '其他咨询'
        },
        messageContent: '信息内容',
        messagePlaceholder: '请输入信息',
        backButton: '返回',
        sendButton: '发送信息'
    }
};

// 선택된 카테고리
let selectedCategory = '';

// 디바운스 타이머
let translationTimeout;

// 번역 함수
async function translateText(text) {
    if (!text.trim()) {
        translatedMessage.style.display = 'none';
        return;
    }

    // 원본 언어가 한국어이면 선택된 언어로 번역, 아니면 한국어로 번역
    const targetLang = selectedLanguage === 'ko' ? translateLanguageCodes[selectedLanguage] : 'ko';

    try {
        const response = await fetch(`${TRANSLATOR_ENDPOINT}/translate`, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
                'Ocp-Apim-Subscription-Region': TRANSLATOR_REGION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                text: text,
                to: targetLang
            }])
        });

        if (!response.ok) {
            throw new Error('Translation failed');
        }

        const data = await response.json();
        const translatedText = data[0].translations[0].text;
        
        // 번역된 텍스트 표시
        translatedMessage.textContent = translatedText;
        translatedMessage.style.display = 'block';
        
        return translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        translatedMessage.textContent = '번역 중 오류가 발생했습니다.';
        translatedMessage.style.display = 'block';
    }
}

// 페이지 텍스트 업데이트 함수
function updatePageLanguage(language) {
    const texts = translations[language] || translations['en'];
    
    // 페이지 제목 업데이트
    document.querySelector('.hotel-logo h1').textContent = texts.pageTitle;
    document.title = texts.pageTitle;
    
    // 룸 정보 및 언어 정보 업데이트
    roomInfo.textContent = texts.roomNumber + roomNumber;
    languageInfo.textContent = texts.selectedLanguage + languageNames[language];
    
    // 카테고리 관련 텍스트 업데이트
    document.getElementById('categoryLabel').textContent = texts.categorySelect;
    document.querySelector('[data-category="cleaning"]').textContent = texts.categories.cleaning;
    document.querySelector('[data-category="amenity"]').textContent = texts.categories.amenity;
    document.querySelector('[data-category="maintenance"]').textContent = texts.categories.maintenance;
    document.querySelector('[data-category="other"]').textContent = texts.categories.other;
    
    // 메시지 입력 관련 텍스트 업데이트
    document.getElementById('messageLabel').textContent = texts.messageContent;
    messageInput.placeholder = texts.messagePlaceholder;
    
    // 버튼 텍스트 업데이트
    document.querySelector('.back-btn').textContent = texts.backButton;
    document.getElementById('sendButton').textContent = texts.sendButton;
}

// 폼 유효성 검사
function validateForm() {
    const isValid = selectedCategory && messageInput.value.trim().length > 0;
    sendButton.disabled = !isValid;
}

// 카테고리 버튼 이벤트
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // 기존 선택 해제
        categoryButtons.forEach(b => b.classList.remove('active'));
        // 새로운 선택
        btn.classList.add('active');
        selectedCategory = btn.dataset.category;
        validateForm();
    });
});

// 메시지 입력 이벤트
messageInput.addEventListener('input', () => {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(() => {
        validateForm();
        translateText(messageInput.value);
    }, 500); // 500ms 디바운스
});

// 메시지 전송 버튼 이벤트
sendButton.addEventListener('click', async () => {
    const originalMessage = messageInput.value.trim();
    const translatedText = await translateText(originalMessage);
    
    const messageData = {
        roomNumber,
        language: selectedLanguage,
        category: selectedCategory,
        originalMessage,
        translatedMessage: translatedText,
        timestamp: new Date().toISOString()
    };

    try {
        // TODO: 실제 서버로 메시지 전송 구현
        console.log('전송할 메시지:', messageData);
        alert('메시지가 전송되었습니다.');
        
        // 입력 필드 초기화
        messageInput.value = '';
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        selectedCategory = '';
        translatedMessage.style.display = 'none';
        validateForm();
    } catch (error) {
        console.error('메시지 전송 실패:', error);
        alert('메시지 전송에 실패했습니다. 다시 시도해 주세요.');
    }
});

// 페이지 초기화
updatePageLanguage(selectedLanguage);
