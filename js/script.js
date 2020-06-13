window.addEventListener('DOMContentLoaded', function () {
    'use strict';

    let info = document.querySelector('.info-header'),
        tab = document.querySelectorAll('.info-header-tab'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tab.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');
        }
    }

    hideTabContent(1);

    function showTabContent(a) {
        if (tabContent[a].classList.contains('hide')) {
            tabContent[a].classList.add('show');
            tabContent[a].classList.remove('hide');
        }
    }

    info.addEventListener('click', function (e) {
        let target = e.target;
        if (target && target.matches('.info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                }
            }
        }
    });

    //Timer
    let deadline = new Date(2020, 4, 13);

    function getTimeReamaning(endTime) {
        let t = endTime - new Date(),
            sec = Math.floor((t / 1000) % 60),
            min = Math.floor((t / 1000 / 60) % 60),
            hours = Math.floor(t / (1000 * 60 * 60));
        return {
            'total': t,
            'sec': sec,
            'min': min,
            'hours': hours
        };
    }

    function changeClock(id, end) {
        let hours = id.querySelector('.hours'),
            min = id.querySelector('.minutes'),
            sec = id.querySelector('.seconds');

        let t = setTimeout(function changeTime() {
            let a = getTimeReamaning(end);
            if (a.total != 0 && a.total > 0) {
                hours.textContent = a.hours;
                min.textContent = a.min;
                sec.textContent = a.sec;
                t = setTimeout(changeTime, 1000);
            } else {
                clearInterval(t);
                hours.textContent = '00';
                min.textContent = '00';
                sec.textContent = '00';
                let begin = document.querySelector('.timer-action');
                begin.textContent = 'Акция началась!!!';
                begin.style.color = '#c78030';
                begin.style.textTransform = 'Uppercase';
                begin.style.textDecoration = 'Underline';
                begin.style.fontSize = '46px';
            }
        }, 1000);
    }

    let timer = document.getElementById('timer');

    changeClock(timer, deadline);



    //TAB

    let more = document.querySelector('.more'),
        overlay = document.querySelector('.overlay'),
        close = document.querySelector('.popup-close');

    more.addEventListener('click', function () {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', function () {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    let infoMain = document.querySelector('.info');
    infoMain.addEventListener('click', function (e) {

        if (e.target && e.target.matches('.description-btn')) {
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    });





    let mainForm = document.querySelector('.main-form'),
        stateMessage = {
            load: 'Загрузка...',
            done: 'Отлично! Мы вам перезвоним!',
            fail: 'Произошла ошибка. Попробуйте позже'
        },
        innerMessage = document.createElement('div');

    function sendForm(form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            form.appendChild(innerMessage);

            function postForm(data) {
                return new Promise((resolve, reject) => {
                    let request = new XMLHttpRequest();
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-type', 'applitaction/json; charset=urf-8');
                    let formData = new FormData(data),
                        obj = {};
                    formData.forEach(function (value, key) {
                        obj[key] = value;
                    });
                    let json = JSON.stringify(obj);
                    request.send(json);
                    request.addEventListener('readystatechange', () => {
                        if (request.readyState < 4) {
                            resolve();
                        } else if (request.readyState === 4 && request.status == 200) {
                            resolve();
                        } else {
                            reject();

                        }
                    });
                });
            }
            postForm(form)
                .then(() => {
                    innerMessage.textContent = stateMessage.load;
                })
                .then(() => {
                    innerMessage.textContent = stateMessage.done;
                })
                .catch(() => innerMessage.textContent = stateMessage.fail)
                .finally(() => {
                    let input = form.getElementsByTagName('input');
                    for (let i = 0; i < input.length; i++) {
                        input[i].value = '';
                        input[i].placeholder = '';
                    }
                });
        });
    }

    sendForm(mainForm);





    //2 form

    let form = document.getElementById('form');

    sendForm(form);
    

    let slideIndex = 0,
        slideItem = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dots = document.querySelector('.slider-dots'),
        dot = document.querySelectorAll('.dot');
    
    function activeSlide(n) {
        
        if(n > slideItem.length - 1) {
            n = 0;
            slideIndex = 0;
        }
        if(n < 0) {
            n = slideItem.length - 1;
            slideIndex = slideItem.length - 1;
        }
        slideItem.forEach((item) => {
            item.style.display = "none";
        });
        slideItem[n].style.display = "block";

        dot.forEach((item) => {
            item.classList.remove('dot-active');
        });

        dot[n].classList.add('dot-active');
    }

    activeSlide(0);

    next.addEventListener('click', () => {
        activeSlide(++slideIndex);
    });

    prev.addEventListener('click', () => {
        activeSlide(--slideIndex);
    });

    dots.addEventListener("click", (e) => {
        let target = e.target;
        dot.forEach((item, index) => {
            if(target == dot[index]) {
                activeSlide(index);
                slideIndex = index;
            }
        });
    });

    //CALC

    let persons = document.querySelectorAll('.counter-block-input')[0],
        days = document.querySelectorAll('.counter-block-input')[1],
        select = document.getElementById('select'),
        totalElement = document.getElementById('total'),
        totalSum = 0;

    totalElement.textContent = 0;

    function travelCalc(persons, days, modificator) {
        return persons.value * days.value * 1 * modificator.options[modificator.selectedIndex].value;
    }
    
    persons.addEventListener('input', function() {
        if(days.value == "") {
            totalSum = 0;
        } else {
            totalSum = travelCalc(persons, days, select);
            totalElement.textContent = totalSum;
        }
    });

    days.addEventListener('input', function() {
        if(persons.value == "") {
            totalSum = 0;
        } else {
            totalSum = travelCalc(persons, days, select);
            totalElement.textContent = totalSum;
        }
    });

    select.addEventListener('change', function() {
        if(persons.value == "" || days.value == "") {
            totalSum = 0;
        } else {
            totalElement.textContent = travelCalc(persons, days, select);
        }
    });

});