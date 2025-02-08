// URL 파라미터에서 값 가져오기
const urlParams = new URLSearchParams(window.location.search);
const roomNumber = urlParams.get('room');
const selectedLanguage = urlParams.get('lang');

// 다국어 텍스트 정의
const translations = {
    'ko': {
        title: '메시지 작성',
        roomLabel: '객실 번호: ',
        languageLabel: '선택 언어: ',
        categoryLabel: '카테고리 선택',
        cleaning: '청소 요청',
        amenity: '어메니티 요청',
        maintenance: '수리 요청',
        other: '기타 문의',
        messageLabel: '메시지 내용',
        messagePlaceholder: '메시지를 입력하세요',
        backButton: '뒤로가기',
        sendButton: '메시지 전송'
    },
    'en': {
        title: 'Write Message',
        roomLabel: 'Room Number: ',
        languageLabel: 'Selected Language: ',
        categoryLabel: 'Select Category',
        cleaning: 'Cleaning Request',
        amenity: 'Amenity Request',
        maintenance: 'Maintenance Request',
        other: 'Other Inquiry',
        messageLabel: 'Message',
        messagePlaceholder: 'Enter your message',
        backButton: 'Back',
        sendButton: 'Send Message'
    },
    'ja': {
        title: 'メッセージ作成',
        roomLabel: '部屋番号：',
        languageLabel: '選択言語：',
        categoryLabel: 'カテゴリー選択',
        cleaning: '清掃リクエスト',
        amenity: 'アメニティリクエスト',
        maintenance: '修理リクエスト',
        other: 'その他',
        messageLabel: 'メッセージ内容',
        messagePlaceholder: 'メッセージを入力してください',
        backButton: '戻る',
        sendButton: 'メッセージ送信'
    },
    'zh': {
        title: '撰写信息',
        roomLabel: '房间号：',
        languageLabel: '所选语言：',
        categoryLabel: '选择类别',
        cleaning: '清洁请求',
        amenity: '客房用品请求',
        maintenance: '维修请求',
        other: '其他咨询',
        messageLabel: '信息内容',
        messagePlaceholder: '请输入信息',
        backButton: '返回',
        sendButton: '发送信息'
    }
};

// 페이지 텍스트 업데이트 함수
function updatePageLanguage(language) {
    const texts = translations[language] || translations['en']; // 기본값은 영어

    // 제목 업데이트
    document.querySelector('.hotel-logo h1').textContent = texts.title;

    // 라벨 업데이트
    document.querySelector('label[for="categorySelector"]').textContent = texts.categoryLabel;
    document.querySelector('label[for="messageInput"]').textContent = texts.messageLabel;

    // 카테고리 버튼 업데이트
    document.querySelector('[data-category="cleaning"]').textContent = texts.cleaning;
    document.querySelector('[data-category="amenity"]').textContent = texts.amenity;
    document.querySelector('[data-category="maintenance"]').textContent = texts.maintenance;
    document.querySelector('[data-category="other"]').textContent = texts.other;

    // 입력 필드 플레이스홀더 업데이트
    messageInput.placeholder = texts.messagePlaceholder;

    // 버튼 텍스트 업데이트
    document.querySelector('.back-btn').textContent = texts.backButton;
    sendButton.textContent = texts.sendButton;

    // 정보 텍스트 업데이트
    roomInfo.textContent = texts.roomLabel + roomNumber;
    languageInfo.textContent = texts.languageLabel + languageNames[language];
}

// 페이지 로드 시 언어 적용
updatePageLanguage(selectedLanguage);

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
