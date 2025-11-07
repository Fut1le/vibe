        document.addEventListener('DOMContentLoaded', function () {
            const currentMonth = new Date().getMonth(); // Получаем текущий месяц (0 - январь, 11 - декабрь)
            const snowToggleButton = document.getElementById('snow-toggle');
            let snowActive = false;

            function createSnow() {
                particlesJS('particles-js', {
                    particles: {
                        number: {
                            value: 100,
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: '#ffffff'
                        },
                        shape: {
                            type: 'circle',
                            stroke: {
                                width: 0,
                                color: '#000000'
                            }
                        },
                        opacity: {
                            value: 0.8,
                            random: true,
                            anim: {
                                enable: false,
                                speed: 1,
                                opacity_min: 0.1,
                                sync: false
                            }
                        },
                        size: {
                            value: 5,
                            random: true,
                            anim: {
                                enable: false,
                                speed: 40,
                                size_min: 0.1,
                                sync: false
                            }
                        },
                        line_linked: {
                            enable: false,
                        },
                        move: {
                            enable: true,
                            speed: 2,
                            direction: 'bottom',
                            random: false,
                            straight: false,
                            out_mode: 'out',
                            attract: {
                                enable: false,
                                rotateX: 600,
                                rotateY: 1200
                            }
                        }
                    },
                    interactivity: {
                        detect_on: 'canvas',
                        events: {
                            onhover: {
                                enable: true,mode: 'bubble'
                            },
                            onclick: {
                                enable: false,
                                mode: 'push'
                            },
                            resize: true
                        },
                        modes: {
                            grab: {
                                distance: 400,
                                line_linked: {
                                    opacity: 0.5
                                }
                            },
                            bubble: {
                                distance: 250,
                                size: 4,
                                duration: 0.5,
                                opacity: 1,
                                speed: 2
                            },
                            repulse: {
                                distance: 200,
                                duration: 0.4
                            },
                            push: {
                                particles_nb: 4
                            },
                            remove: {
                                particles_nb: 2
                            }
                        }
                    },
                    retina_detect: true
                });
                snowActive = true;
                localStorage.setItem('snowActive', 'true');
            }
            
            function destroySnow() {
                const particlesContainer = document.getElementById('particles-js');
                if (particlesContainer) {
                    particlesContainer.innerHTML = '';
                }
                snowActive = false;
                localStorage.setItem('snowActive', 'false');
            }
            
            function toggleSnow() {
                if (snowActive) {
                    destroySnow();
                } else {
                    createSnow();
                }
            }
            
            if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) { // Проверяем, если текущий месяц - декабрь, январь или февраль
                const savedSnowState = localStorage.getItem('snowActive');
                if (savedSnowState === 'true') {
                    createSnow(); // Запускаем анимацию снежинок, если она была включена ранее
                }
                snowToggleButton.style.display = 'block'; // Показываем кнопку
                snowToggleButton.addEventListener('click', toggleSnow);
            }
        });