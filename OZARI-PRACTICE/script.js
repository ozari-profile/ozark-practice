document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    const filtersSection = document.getElementById('filters');
    const introTitle = document.querySelector('.intro-title');
    const introText = document.querySelector('.intro-text');

    // Названия сфер
    const sphereNames = {
        'development': 'Развитие',
        'health': 'Здоровье',
        'meaning': 'Смысл',
        'realization': 'Реализация',
        'relationships': 'Отношения',
        'rest': 'Отдых'
    };


    // Load Kinescope only after a visitor chooses a practice.
    // This prevents 22 third-party video players from loading on mobile.
    const originalVideoMarkup = new Map(
        Array.from(document.querySelectorAll('.ozari-video-placeholder'), element => [element, element.innerHTML])
    );
    const grid = document.getElementById('grid');
    let activeVideoContainer = null;

    function stopActiveVideo() {
        if (!activeVideoContainer) return;
        const markup = originalVideoMarkup.get(activeVideoContainer);
        if (markup) activeVideoContainer.innerHTML = markup;
        activeVideoContainer = null;
    }

    if (grid) {
        grid.addEventListener('click', function(event) {
            const button = event.target.closest('.ozari-video-play');
            if (!button) return;
            const container = button.closest('.ozari-video-placeholder');
            if (!container) return;

            const url = container.getAttribute('data-embed-url') || '';
            if (!/^https:\/\/kinescope\.io\/embed\/[A-Za-z0-9]+$/.test(url)) return;

            stopActiveVideo();
            const frame = document.createElement('iframe');
            frame.src = url;
            frame.title = 'Видео: ' + (container.closest('.card')?.querySelector('.card-title')?.textContent || 'Практика ОЗАРИ');
            frame.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer; clipboard-write; screen-wake-lock';
            frame.allowFullscreen = true;
            frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
            frame.className = 'ozari-video-frame';
            container.replaceChildren(frame);
            activeVideoContainer = container;
        });
    }

    // Функция фильтрации
    function filterCards(sphere) {
        stopActiveVideo();
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

    // Читаем параметры из адреса
    const urlParams = new URLSearchParams(window.location.search);
    const sphereParam = urlParams.get('sphere');
    const lessonParam = urlParams.get('lesson');

    // Режим 1: показать одну конкретную карточку (?lesson=...)
    if (lessonParam) {
        // Скрываем все карточки
        cards.forEach(card => {
            if (card.id === lessonParam) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        // Скрываем блок фильтров
        if (filtersSection) {
            filtersSection.style.display = 'none';
        }

        // Меняем заголовок на название практики
        const targetCard = document.getElementById(lessonParam);
        if (targetCard) {
            const cardTitle = targetCard.querySelector('.card-title');
            if (cardTitle && introTitle) {
                introTitle.textContent = cardTitle.textContent;
            }
        }
        if (introText) {
            introText.textContent = 'Практика, которую вы выбрали. Приятного просмотра.';
        }
        return;
    }

    // Режим 2: показать сферу (?sphere=...)
    if (sphereParam) {
        filterCards(sphereParam);

        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.sphere === sphereParam) {
                btn.classList.add('active');
            }
        });

        if (filtersSection) {
            filtersSection.style.display = 'none';
        }

        if (sphereNames[sphereParam] && introTitle) {
            introTitle.textContent = 'Практики для сферы «' + sphereNames[sphereParam] + '»';
        }
    }
});
