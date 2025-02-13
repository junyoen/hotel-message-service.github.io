// main.js
// DOM 요소
const languageBtns = document.querySelectorAll('.language-btn');
const form = document.getElementById('roomForm');
const roomInput = document.getElementById('roomNumber');
const roomError = document.getElementById('roomError');
const submitBtn = document.querySelector('.submit-btn');

// 선택된 언어 저장
let selectedLang = '';

// 객실 번호 유효성 검사 함수
function isValidRoomNumber(number) {
    const roomNum = parseInt(number);
    const floor = Math.floor(roomNum / 100);
    const room = roomNum % 100;

    // 5층부터 22층까지 (13층 제외)
    if (floor < 5 || floor > 22 || floor === 13) return false;
    
    // 일반적으로 1~13호실까지 있음
    if (room < 1 || room > 13) return false;

    // 21층, 22층은 9호실이 없음
    if ((floor === 21 || floor === 22) && room === 9) return false;

    return true;
}

// 언어 선택 버튼 이벤트
languageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 기존 선택 해제
        languageBtns.forEach(b => b.classList.remove('active'));
        // 새로운 선택
        btn.classList.add('active');
        selectedLang = btn.dataset.lang;
        validateForm();
    });
});

// 폼 유효성 검사
function validateForm() {
    const isValid = roomInput.value && isValidRoomNumber(roomInput.value) && selectedLang;
    submitBtn.disabled = !isValid;
}

// 객실 번호 입력 이벤트
roomInput.addEventListener('input', () => {
    roomError.style.display = 'none';
    validateForm();
});

// 폼 제출 이벤트
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const roomNumber = roomInput.value;
    
    console.log('Form submitted with:', {
        roomNumber: roomNumber,
        selectedLang: selectedLang
    });
    
    // 객실 번호 유효성 검사
    if (!isValidRoomNumber(roomNumber)) {
        roomError.style.display = 'block';
        return;
    }

    // 언어 선택 확인
    if (!selectedLang) {
        alert('언어를 선택해주세요.');
        return;
    }

    // 다음 페이지로 이동
    window.location.href = `message.html?room=${roomNumber}&lang=${selectedLang}`;
});