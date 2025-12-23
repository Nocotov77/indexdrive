/* script.js - Подключите этот файл в конце body на нужных страницах */

// --- Логика для страницы Бронирования ---
const dateStart = document.getElementById('dateStart');
const dateEnd = document.getElementById('dateEnd');
const priceDisplay = document.getElementById('finalPrice');
const discountFill = document.getElementById('discountFill');
const discountText = document.getElementById('discountText');
const pricePerDay = 3000; // Пример цены

function calculatePrice() {
    if(!dateStart || !dateEnd || !dateStart.value || !dateEnd.value) return;

    const start = new Date(dateStart.value);
    const end = new Date(dateEnd.value);
    
    // Разница во времени
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (days <= 0) return;

    // Расчет скидки (каждые 3 дня +5%, макс 25%)
    // Логика: если > 3 дней, начинается скидка.
    let discountPercent = 0;
    if (days > 3) {
        // Сколько полных троек дней прошло сверх минимума?
        // Или просто каждые 3 дня? По ТЗ: "срок больше 3-х дней... каждые 3 дня скидка прибавляется"
        // Интерпретация: 4-6 дней = 5%, 7-9 дней = 10% и т.д.
        discountPercent = Math.floor(days / 3) * 5; 
        if (discountPercent > 25) discountPercent = 25;
    }

    const totalRaw = days * pricePerDay;
    const discountAmount = totalRaw * (discountPercent / 100);
    const final = totalRaw - discountAmount;

    // Вывод
    if(priceDisplay) priceDisplay.innerText = final + ' ₽';
    if(discountFill) discountFill.style.width = discountPercent * 4 + '%'; // *4 для визуализации 25% как 100% ширины бара, или просто discountPercent + '%'
    if(discountFill) discountFill.style.width = (discountPercent / 25 * 100) + '%'; // 25% = полная шкала
    if(discountText) discountText.innerText = `Ваша скидка: ${discountPercent}%`;
}

// Слушатели событий
if(dateStart && dateEnd) {
    dateStart.addEventListener('change', calculatePrice);
    dateEnd.addEventListener('change', calculatePrice);
}


// --- Логика для страницы Банковские карты (Модальное окно и Тип) ---
const modal = document.getElementById('cardModal');
const btnAddCard = document.getElementById('btnAddCard');
const btnClose = document.querySelector('.close-modal');
const cardNumberInput = document.getElementById('cardNumber');

if(btnAddCard) {
    btnAddCard.onclick = () => modal.style.display = "flex";
    btnClose.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; }
}

// Определение типа карты при вводе
if(cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\s/g, '');
        // Форматирование пробелами
        e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
        
        // Определение типа
        const typeLabel = document.getElementById('cardTypeLabel');
        if(val.startsWith('1111')) typeLabel.innerText = "Тип: Visa";
        else if(val.startsWith('2222')) typeLabel.innerText = "Тип: MasterCard";
        else if(val.startsWith('3333')) typeLabel.innerText = "Тип: Мир";
        else typeLabel.innerText = "Тип: Не определен";
    });
}
