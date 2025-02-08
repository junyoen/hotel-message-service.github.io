// 유효한 객실 번호 배열 생성
function generateValidRooms() {
    const validRooms = new Set();
    
    // 5층
    for (let i = 501; i <= 513; i++) {
        validRooms.add(i);
    }
    
    // 6층-20층
    for (let floor = 6; floor <= 20; floor++) {
        if (floor === 13) continue; // 13층 제외
        for (let room = 1; room <= 13; room++) {
            validRooms.add(floor * 100 + room);
        }
    }
    
    // 21층과 22층 (9호 제외)
    for (let floor of [21, 22]) {
        for (let room = 1; room <= 13; room++) {
            if (room !== 9) { // 9호 제외
                validRooms.add(floor * 100 + room);
            }
        }
    }
    
    return validRooms;
}

const validRooms = generateValidRooms();

// DOM 요소
const languageBtns = document.querySelectorAll('.language-btn');
const form = document.getElementById('roomForm');
const roomInput = document.getElementById('roomNumber');
const roomError = document.getElementById('roomError');
const submitBtn = document.querySelector('.submit-btn');

let selectedLang = '';

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
    const roomNumber = parseInt(roomInput.value);
    const isValidRoom = validRooms.has(roomNumber);
    const isValidLang = selectedLang !== '';
    
    submitBtn.disabled = !(isValidRoom && isValidLang);
    
    if (roomInput.value && !isValidRoom) {
        roomError.style.display = 'block';
    } else {
        roomError.style.display = 'none';
    }
}

// 객실 번호 입력 이벤트
roomInput.addEventListener('input', validateForm);

// 폼 제출 이벤트
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const roomNumber = parseInt(roomInput.value);
    
    if (!validRooms.has(roomNumber)) {
        roomError.style.display = 'block';
        return;
    }

    // 다음 페이지로 이동
    window.location.href = `message.html?room=${roomNumber}&lang=${selectedLang}`;
});