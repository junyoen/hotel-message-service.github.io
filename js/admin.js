// 층별 객실 정보 생성
const floorInfo = {
    5: { start: 501, end: 513 },
    6: { start: 601, end: 613 },
    7: { start: 701, end: 713 },
    8: { start: 801, end: 813 },
    9: { start: 901, end: 913 },
    10: { start: 1001, end: 1013 },
    11: { start: 1101, end: 1113 },
    12: { start: 1201, end: 1213 },
    14: { start: 1401, end: 1413 },
    15: { start: 1501, end: 1513 },
    16: { start: 1601, end: 1613 },
    17: { start: 1701, end: 1713 },
    18: { start: 1801, end: 1813 },
    19: { start: 1901, end: 1913 },
    20: { start: 2001, end: 2013 },
    21: { start: 2101, end: 2113, exclude: [2109] },
    22: { start: 2201, end: 2213, exclude: [2209] }
};

// DOM 요소
const floorList = document.querySelector('.floor-list');
const messagePopup = document.getElementById('messagePopup');
const closePopupBtn = document.querySelector('.close-btn');

// 층별 UI 생성
function createFloorUI() {
    const floors = Object.keys(floorInfo);
    floorList.innerHTML = ''; // 기존 내용 초기화

    floors.forEach(floor => {
        const floorDiv = document.createElement('div');
        floorDiv.className = 'floor-item';
        
        // 층 헤더 생성
        const floorHeader = document.createElement('div');
        floorHeader.className = 'floor-header';
        floorHeader.innerHTML = `
            <span class="floor-number">${floor}층</span>
            <span class="new-message-badge" id="floor-${floor}-badge">0</span>
        `;

        // 객실 목록 컨테이너
        const roomList = document.createElement('div');
        roomList.className = 'room-list';
        roomList.id = `floor-${floor}-rooms`;

        // 객실 번호 생성
        const { start, end, exclude } = floorInfo[floor];
        for (let room = start; room <= end; room++) {
            if (!exclude || !exclude.includes(room)) {
                const roomDiv = document.createElement('div');
                roomDiv.className = 'room-number';
                roomDiv.dataset.roomNumber = room;
                roomDiv.textContent = room;
                roomDiv.addEventListener('click', () => showMessage(room));
                roomList.appendChild(roomDiv);
            }
        }

        // 층 헤더 클릭 이벤트 - 객실 목록 토글
        floorHeader.addEventListener('click', () => {
            const isVisible = roomList.style.display === 'grid';
            roomList.style.display = isVisible ? 'none' : 'grid';
        });

        floorDiv.appendChild(floorHeader);
        floorDiv.appendChild(roomList);
        floorList.appendChild(floorDiv);
    });
}

// 메시지 팝업 표시
function showMessage(roomNumber) {
    // TODO: 실제 메시지 데이터 가져오기
    const messageData = {
        roomNumber: roomNumber,
        category: '청소 요청',
        timestamp: new Date().toLocaleString(),
        originalMessage: '原文メッセージ',
        translatedMessage: '번역된 메시지'
    };

    document.getElementById('popupRoomNumber').textContent = messageData.roomNumber;
    document.getElementById('popupCategory').textContent = messageData.category;
    document.getElementById('popupTime').textContent = messageData.timestamp;
    document.getElementById('popupOriginalMessage').textContent = messageData.originalMessage;
    document.getElementById('popupTranslatedMessage').textContent = messageData.translatedMessage;

    messagePopup.style.display = 'block';
}

// 팝업 닫기
closePopupBtn.addEventListener('click', () => {
    messagePopup.style.display = 'none';
});

// 메시지 도착 시뮬레이션
function simulateNewMessage(roomNumber) {
    const floor = Math.floor(roomNumber / 100);
    const badge = document.getElementById(`floor-${floor}-badge`);
    const roomElement = document.querySelector(`[data-room-number="${roomNumber}"]`);

    if (roomElement) {
        roomElement.classList.add('has-message');
        badge.style.display = 'inline-block';
        badge.textContent = parseInt(badge.textContent || 0) + 1;
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    createFloorUI();
    
    // 테스트용 메시지 시뮬레이션
    setTimeout(() => simulateNewMessage(505), 1000);
    setTimeout(() => simulateNewMessage(1202), 2000);
});
