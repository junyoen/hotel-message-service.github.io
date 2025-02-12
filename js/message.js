// Azure Translator API 설정
const TRANSLATOR_KEY = '9QIOsH4sQRqW8crgBjJE4X7BKMSMsRbDnXy7OwS61QV2yN4GLNBsJQQJ99BBAC3pKaRXJ3w3AAAbACOGDxZf';
const TRANSLATOR_REGION = 'eastasia';
const TRANSLATOR_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';

// Telegram 설정
const TELEGRAM_BOT_TOKEN = '7641859647:AAF9SGLlCpkXAQNQFt9SBQJkJYDgGsdXSts';
const TELEGRAM_CHAT_ID = '-471428962';

// 카테고리 한글 매핑
const categoryNames = {
    'cleaning': '청소 요청',
    'amenity': '어메니티 요청',
    'maintenance': '수리 요청',
    'other': '기타 문의'
};

// 기존 코드는 그대로 유지...

// 메시지 전송 버튼 이벤트 수정
sendButton.addEventListener('click', async () => {
    const originalMessage = messageInput.value.trim();
    const translatedText = await translateText(originalMessage);
    const currentTime = new Date().toLocaleString();
    
    // 텔레그램 메시지 형식
    const telegramMessage = `
📢 새로운 요청
방번호: ${roomNumber}
구분: ${categoryNames[selectedCategory]}
메시지: ${originalMessage}
번역: ${translatedText}
시간: ${currentTime}
`;

    try {
        // 텔레그램으로 메시지 전송
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: '✅ 처리완료',
                            callback_data: `complete_${roomNumber}`
                        }
                    ]]
                }
            })
        });

        if (!response.ok) {
            throw new Error('메시지 전송 실패');
        }

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
