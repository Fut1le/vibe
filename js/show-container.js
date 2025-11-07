document.addEventListener('DOMContentLoaded', () => {
    const playerContainer = document.getElementById('player-container');
    const hoverArea = document.getElementById('hover-area');
    const panelHideToggle = document.getElementById('panelHideToggle');
    
    let hideTimeout = null;
    
    // Initialize toggle state from localStorage
    const initialState = localStorage.getItem('autoHideEnabled') === 'true';
    panelHideToggle.textContent = initialState ? "Panel-hide: ON" : "Panel-hide: OFF";
    
    function hidePlayerContainer() {
        if (localStorage.getItem('autoHideEnabled') === 'true') {
            playerContainer.classList.add('hidden');
        }
    }
    
    function showPlayerContainer() {
        playerContainer.classList.remove('hidden');
    }

    panelHideToggle.addEventListener('click', () => {
        const currentState = localStorage.getItem('autoHideEnabled') === 'true';
        const newState = !currentState;
        localStorage.setItem('autoHideEnabled', newState);
        panelHideToggle.textContent = newState ? "Panel-hide: ON" : "Panel-hide: OFF";
        if (!newState) {
            showPlayerContainer();
        }
    });
    
    hoverArea.addEventListener('mouseenter', () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
        showPlayerContainer();
    });
    
    hoverArea.addEventListener('mouseleave', () => {
        if (localStorage.getItem('autoHideEnabled') === 'true') {
            hideTimeout = setTimeout(hidePlayerContainer, 3000); // 3 seconds delay
        }
    });
    
    if (localStorage.getItem('autoHideEnabled') === 'true') {
        playerContainer.classList.add('hidden');
    } else {
        playerContainer.classList.remove('hidden');
    }
});