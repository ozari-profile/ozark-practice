document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    const filtersSection = document.getElementById('filters');

    // Функция фильтрации
    function filterCards(sphere) {
        cards.forEach(card => {
            if (sphere === 'all' || card.dataset.sphere === sphere) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Обработка кликов по кнопкам фильтра
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterCards(this.dataset.sphere);
        });
    });

    // Проверяем параметр в адресе (?sphere=...)
    const urlParams = new URLSearchParams(window.location.search);
    const sphereParam = urlParams.get('sphere');

    if (sphereParam) {
        filterCards(sphereParam);

        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.sphere === sphereParam) {
                btn.classList.add('active');
            }
        });

        // Скрываем блок с фильтрами
        if (filtersSection) {
            filtersSection.style.display = 'none';
        }

        // Меняем заголовок на название сферы
        const sphereNames = {
            'development': 'Развитие',
            'health': 'Здоровье',
            'meaning': 'Смысл',
            'realization': 'Реализация',
            'relationships': 'Отношения',
            'rest': 'Отдых'
        };

        if (sphereNames[sphereParam]) {
            const introTitle = document.querySelector('.intro-title');
            if (introTitle) {
                introTitle.textContent = 'Практики для сферы «' + sphereNames[sphereParam] + '»';
            }
        }
    }
});
// Скролл к конкретной карточке, если в адресе есть #hash
document.addEventListener('DOMContentLoaded', function() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    // Ждём, пока страница прогрузится
    setTimeout(() => {
        const targetCard = document.getElementById(hash);
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Подсвечиваем карточку на 2 секунды
            targetCard.style.transition = 'box-shadow 0.3s ease';
            targetCard.style.boxShadow = '0 0 0 3px #c5a880';
            setTimeout(() => {
                targetCard.style.boxShadow = '';
            }, 2000);
        }
    }, 300);
});
