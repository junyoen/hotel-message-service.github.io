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

// 선택된 카테고리
let selectedCategory = '';

// 초기 정보 표시
roomInfo.textContent = `객실 번호: ${roomNumber}`;
languageInfo.textContent = `선택 언어: ${languageNames[selectedLanguage] || selectedLanguage}`;

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
messageInput.addEventListener('input', validateForm);

// 폼 유효성 검사
function validateForm() {
    const isValid = selectedCategory && messageInput.value.trim().length > 0;
    sendButton.disabled = !isValid;
}

// 메시지 전송 버튼 이벤트
sendButton.addEventListener('click', async () => {
    const messageData = {
        roomNumber,
        language: selectedLanguage,
        category: selectedCategory,
        message: messageInput.value.trim()
    };

    try {
        // TODO: 실제 서버로 메시지 전송 구현
        console.log('전송할 메시지:', messageData);
        alert('메시지가 전송되었습니다.');
        
        // 입력 필드 초기화
        messageInput.value = '';
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        selectedCategory = '';
        validateForm();
    } catch (error) {
        console.error('메시지 전송 실패:', error);
        alert('메시지 전송에 실패했습니다. 다시 시도해 주세요.');
    }
});
