document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('themeToggle');
    if (!toggleButton) return;

    const icon = toggleButton.querySelector('i') || toggleButton; // иконка или сам текст кнопки

    // Определяем текущую тему
    const getCurrentTheme = () => {
        // Сначала проверяем Bootstrap-атрибут
        const bsTheme = document.documentElement.getAttribute('data-bs-theme');
        if (bsTheme && (bsTheme === 'dark' || bsTheme === 'light')) {
            return bsTheme;
        }
        // Потом кастомный атрибут
        const customTheme = document.documentElement.getAttribute('data-theme');
        if (customTheme && (customTheme === 'dark' || customTheme === 'light')) {
            return customTheme;
        }
        // По умолчанию — светлая
        return 'light';
    };

    // Устанавливаем тему
    const setTheme = (theme) => {
        // Для Bootstrap 5.3+
        document.documentElement.setAttribute('data-bs-theme', theme);
        // Для твоих кастомных стилей (если используешь :root + [data-theme])
        document.documentElement.setAttribute('data-theme', theme);
        // Сохраняем выбор
        localStorage.setItem('theme', theme);

        // Меняем иконку
        if (icon.tagName === 'I') {
            if (theme === 'dark') {
                icon.classList.replace('bi-moon', 'bi-sun');
                icon.classList.replace('bi-moon-stars', 'bi-sun');
                icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            } else {
                icon.classList.replace('bi-sun', 'bi-moon');
                icon.classList.replace('bi-sun-fill', 'bi-moon-stars');
            }
        } else {
            // Если это не иконка, а текст/эмодзи
            icon.textContent = theme === 'dark' ? 'Солнце' : 'Луна';
        }
    };

    // При загрузке страницы — восстанавливаем сохранённую тему
    const savedTheme = localStorage.getItem('theme');
    const preferredTheme = savedTheme || getCurrentTheme();
    setTheme(preferredTheme);

    // Обработчик клика
    toggleButton.addEventListener('click', () => {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
});