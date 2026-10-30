// Игровые переменные
let balance = 10000000;
const symbols = ['🍒', '🍋', '🍊', '🍉', '⭐️', '7️⃣', '🎰'];
const payouts = {
    '🍒🍒🍒': 2,
    '🍋🍋🍋': 3,
    '🍊🍊🍊': 4,
    '🍉🍉🍉': 5,
    '⭐️⭐️⭐️': 10,
    '7️⃣7️⃣7️⃣': 20,
    '🎰🎰🎰': 100
};

// Функция для проверки загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация игры...');
    
    // Получаем элементы DOM
    const balanceSpan = document.getElementById('balance');
    const slot1 = document.getElementById('slot1');
    const slot2 = document.getElementById('slot2');
    const slot3 = document.getElementById('slot3');
    const spinButton = document.getElementById('spinBtn');
    const betInput = document.getElementById('bet');
    const messageDiv = document.getElementById('message');
    
    // Проверяем, что все элементы найдены
    if (!balanceSpan || !slot1 || !slot2 || !slot3 || !spinButton || !betInput || !messageDiv) {
        console.error('Не удалось найти все элементы DOM!');
        return;
    }
    
    console.log('Все элементы найдены');
    
    // Состояние игры
    let spinning = false;
    let spinInterval = null;
    
    // Функция обновления баланса
    function updateBalance() {
        balanceSpan.textContent = balance;
    }
    
    // Функция показа сообщения
    function showMessage(text, isWin) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + (isWin ? 'win' : 'lose');
        setTimeout(() => {
            if (messageDiv.textContent === text) {
                messageDiv.textContent = '';
                messageDiv.className = 'message';
            }
        }, 2000);
    }
    
    // Получение случайного символа
    function getRandomSymbol() {
        return symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    // Запуск анимации вращения
    function startSpinAnimation() {
        slot1.classList.add('spinning');
        slot2.classList.add('spinning');
        slot3.classList.add('spinning');
        
        spinInterval = setInterval(() => {
            slot1.textContent = getRandomSymbol();
            slot2.textContent = getRandomSymbol();
            slot3.textContent = getRandomSymbol();
        }, 100);
    }
    
    // Остановка анимации
    function stopSpinAnimation() {
        slot1.classList.remove('spinning');
        slot2.classList.remove('spinning');
        slot3.classList.remove('spinning');
        
        if (spinInterval) {
            clearInterval(spinInterval);
            spinInterval = null;
        }
    }
    
    // Проверка выигрыша
    function checkWin(symbol1, symbol2, symbol3, bet) {
        const combination = symbol1 + symbol2 + symbol3;
        const multiplier = payouts[combination];
        
        if (multiplier) {
            return bet * multiplier;
        }
        return 0;
    }
    
    // Основная функция вращения
    async function spin() {
        console.log('Кнопка нажата');
        
        // Проверка, не идет ли уже вращение
        if (spinning) {
            console.log('Уже идет вращение');
            return;
        }
        
        // Получаем и проверяем ставку
        const bet = parseInt(betInput.value);
        
        if (isNaN(bet) || bet < 10) {
            showMessage('Минимальная ставка 10 ₽', false);
            return;
        }
        
        if (bet > balance) {
            showMessage('Недостаточно средств!', false);
            return;
        }
        
        console.log('Начинаем вращение, ставка:', bet);
        
        // Начинаем вращение
        spinning = true;
        spinButton.disabled = true;
        spinButton.textContent = '🎲 Крутится... 🎲';
        
        // Запускаем анимацию
        startSpinAnimation();
        
        // Ждем 1 секунду
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Получаем финальные символы
        const finalSymbol1 = getRandomSymbol();
        const finalSymbol2 = getRandomSymbol();
        const finalSymbol3 = getRandomSymbol();
        
        console.log('Результат:', finalSymbol1, finalSymbol2, finalSymbol3);
        
        // Останавливаем анимацию
        stopSpinAnimation();
        
        // Показываем результат
        slot1.textContent = finalSymbol1;
        slot2.textContent = finalSymbol2;
        slot3.textContent = finalSymbol3;
        
        // Проверяем выигрыш
        const winAmount = checkWin(finalSymbol1, finalSymbol2, finalSymbol3, bet);
        
        if (winAmount > 0) {
            balance += winAmount;
            updateBalance();
            showMessage(`🎉 ПОБЕДА! Вы выиграли ${winAmount} ₽! 🎉`, true);
            console.log('Выигрыш:', winAmount);
        } else {
            balance -= bet;
            updateBalance();
            showMessage(`😢 Проигрыш! Вы потеряли ${bet} ₽`, false);
            console.log('Проигрыш:', bet);
        }
        
        // Проверка на банкротство
        if (balance < 10) {
            showMessage('💸 ИГРА ОКОНЧЕНА! Обновите страницу 💸', false);
            spinButton.disabled = true;
            spinning = false;
            return;
        }
        
        // Разблокируем кнопку
        spinButton.disabled = false;
        spinButton.textContent = '🎲 Крутить 🎲';
        spinning = false;
    }
    
    // Назначаем обработчик события на кнопку
    spinButton.addEventListener('click', spin);
    
    // Инициализация игры
    updateBalance();
    console.log('Игровой автомат успешно загружен!');
});