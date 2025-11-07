document.addEventListener("DOMContentLoaded", () => {
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('hover-area');

    // Устанавливаем задержку для плавного скрытия интро и отображения основного контента
    setTimeout(() => {
        introScreen.classList.add('hidden');
        mainContent.classList.add('visible');

        // Через 2 секунды (время завершения анимации) удаляем интро экран из DOM и разрешаем прокрутку
        setTimeout(() => {
            introScreen.remove();
            document.body.style.overflow = 'auto';
        }, 2000);
    }, 3000); // Длительность показа интро экрана
});
