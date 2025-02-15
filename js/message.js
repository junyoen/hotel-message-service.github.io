// Azure Translator API 설정
const TRANSLATOR_KEY = '9QIOsH4sQRqW8crgBjJE4X7BKMSMsRbDnXy7OwS61QV2yN4GLNBsJQQJ99BBAC3pKaRXJ3w3AAAbACOGDxZf';
const TRANSLATOR_REGION = 'eastasia';
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

// Telegram 설정
const TELEGRAM_BOT_TOKEN = '7641859647:AAF9SGLlCpkXAQNQFt9SBQJkJYDgGsdXSts';
const TELEGRAM_CHAT_ID = '-471428962';

// URL 파라미터에서 값 가져오기
const urlParams = new URLSearchParams(window.location.search);
const roomNumber = urlParams.get('room');
const selectedLanguage = urlParams.get('lang');

// DOM 요소
const roomInfo = document.getElementById('roomInfo');
const languageInfo = document.getElementById('languageInfo');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
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
        messageContent: '메시지 내용',
        messagePlaceholder: '메시지를 입력하세요',
        backButton: '뒤로가기',
        sendButton: '메시지 전송'
    },
    'en': {
        pageTitle: 'Write Message',
        roomNumber: 'Room Number: ',
        selectedLanguage: 'Selected Language: ',
        messageContent: 'Message Content',
        messagePlaceholder: 'Enter your message',
        backButton: 'Back',
        sendButton: 'Send Message'
    },
    'ja': {
        pageTitle: 'メッセージ作成',
        roomNumber: '部屋番号: ',
        selectedLanguage: '選択言語: ',
        messageContent: 'メッセージ内容',
        messagePlaceholder: 'メッセージを入力してください',
        backButton: '戻る',
        sendButton: 'メッセージを送信'
    },
    'zh': {
        pageTitle: '写信息',
        roomNumber: '房间号: ',
        selectedLanguage: '所选语言: ',
        messageContent: '信息内容',
        messagePlaceholder: '请输入信息',
        backButton: '返回',
        sendButton: '发送信息'
    }
};

// 디바운스 타이머
let translationTimeout;

// 번역 함수
async function translateText(text) {
    if (!text.trim()) {
        translatedMessage.style.display = 'none';
        return;
    }

    try {
        const response = await fetch('https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=ko', {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': TRANSLATOR_KEY,
                'Ocp-Apim-Subscription-Region': TRANSLATOR_REGION,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{
                text: text
            }])
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data && data[0] && data[0].translations && data[0].translations[0]) {
            const translatedText = data[0].translations[0].text;
            translatedMessage.textContent = translatedText;
            translatedMessage.style.display = 'block';
            return translatedText;
        }
    } catch (error) {
        console.error('Translation error:', error);
        translatedMessage.textContent = '번역 중 오류가 발생했습니다.';
        translatedMessage.style.display = 'block';
    }
}

// 폼 유효성 검사
function validateForm() {
    const isValid = messageInput.value.trim().length > 0;
    sendButton.disabled = !isValid;
}

// 버튼 클릭 이벤트 처리 함수
async function handleButtonClick(messageId) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageReplyMarkup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '✅ 확인 완료',
                            callback_data: 'completed'
                        }
                    ]]
                }
            })
        });

        if (!response.ok) {
            console.error('Button update failed:', await response.text());
            return false;
        }
        return true;
    } catch (error) {
        console.error('Button click handler error:', error);
        return false;
    }
}

// 클릭 이벤트 수신 함수
async function checkForButtonClicks() {
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=-1`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
            const update = data.result[0];
            if (update.callback_query) {
                const messageId = update.callback_query.message.message_id;
                await handleButtonClick(messageId);
            }
        }
    } catch (error) {
        console.error('Check updates error:', error);
    }
}

// 주기적으로 버튼 클릭 체크
const checkInterval = 5000;
setInterval(checkForButtonClicks, checkInterval);

// 메시지 입력 이벤트
messageInput.addEventListener('input', () => {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(() => {
        validateForm();
        translateText(messageInput.value);
    }, 500);
});

// 페이지 텍스트 업데이트 함수
function updatePageLanguage(language) {
    const texts = translations[language] || translations['en'];
    
    // 페이지 제목 업데이트
    document.querySelector('.hotel-logo h1').textContent = texts.pageTitle;
    document.title = texts.pageTitle;
    
    // 룸 정보 및 언어 정보 업데이트
    roomInfo.textContent = texts.roomNumber + roomNumber;
    languageInfo.textContent = texts.selectedLanguage + languageNames[language];
    
    // 메시지 입력 관련 텍스트 업데이트
    document.getElementById('messageLabel').textContent = texts.messageContent;
    messageInput.placeholder = texts.messagePlaceholder;
    
    // 버튼 텍스트 업데이트
    document.querySelector('.back-btn').textContent = texts.backButton;
    sendButton.textContent = texts.sendButton;
}

// 메시지 전송 버튼 이벤트
sendButton.addEventListener('click', async () => {
    try {
        const originalMessage = messageInput.value.trim();
        const translatedText = await translateText(originalMessage);
        const currentTime = new Date().toLocaleString();
        const messageId = Date.now();

        // 텔레그램 메시지 형식
        const telegramMessage = `
📢 새로운 요청
방번호: ${roomNumber}
메시지: ${originalMessage}
번역: ${translatedText}
시간: ${currentTime}
`;

        const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '⚠️ 확인 전',
                            callback_data: `resolved_${roomNumber}_${messageId}`
                        }
                    ]]
                }
            })
        });

        if (!telegramResponse.ok) {
            throw new Error('메시지 전송 실패');
        }

        alert('메시지가 전송되었습니다.');
        messageInput.value = '';
        translatedMessage.style.display = 'none';
        validateForm();

    } catch (error) {
        console.error('메시지 전송 실패:', error);
        alert('메시지 전송에 실패했습니다. 다시 시도해 주세요.');
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage(selectedLanguage);
    validateForm();
});