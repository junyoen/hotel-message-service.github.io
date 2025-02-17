// message.js
const urlParams = new URLSearchParams(window.location.search);
const roomNumber = urlParams.get('room');
const selectedLanguage = urlParams.get('lang');

// Worker URL
const WORKER_URL = 'https://hotel-message-service.joeykim9010.workers.dev';

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

// 다국어 텍스트
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

// 버튼 클릭 체크 함수
async function checkForButtonClicks() {
    try {
        const response = await fetch(`${WORKER_URL}/api/check-clicks`);
        const data = await response.json();
        
        if (data.clicked && data.messageId) {
            await fetch(`${WORKER_URL}/api/update-button`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messageId: data.messageId
                })
            });
        }
    } catch (error) {
        console.error('Check updates error:', error);
    }
}

// 주기적으로 버튼 클릭 체크 (5초마다)
const checkInterval = 5000;
setInterval(checkForButtonClicks, checkInterval);

// 번역 함수
async function translateText(text) {
    if (!text.trim()) {
        translatedMessage.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${WORKER_URL}/api/translate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                targetLanguage: 'ko'
            })
        });

        if (!response.ok) {
            throw new Error(`Translation failed: ${response.status}`);
        }

        const data = await response.json();
        translatedMessage.textContent = data.translatedText;
        translatedMessage.style.display = 'block';
        return data.translatedText;
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
        
        const response = await fetch(`${WORKER_URL}/api/send-message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomNumber,
                originalMessage,
                translatedText,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('메시지 전송 실패');
        }

        const result = await response.json();
        
        if (result.success) {
            alert('메시지가 전송되었습니다.');
            messageInput.value = '';
            translatedMessage.style.display = 'none';
            validateForm();
        } else {
            throw new Error('메시지 전송 실패');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('메시지 전송에 실패했습니다. 다시 시도해 주세요.');
    }
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage(selectedLanguage);
});
