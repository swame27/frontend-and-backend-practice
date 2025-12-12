document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle?.querySelector('i');
    
    if (!themeToggle) return;
    
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Обновляем иконку
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
    } else {
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌓';
    }
    
    // Обработчик клика
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Устанавливаем новую тему
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Обновляем иконку
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        } else {
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌓';
        }
    });
});