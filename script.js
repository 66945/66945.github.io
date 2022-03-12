const LIGHT = {
    background: '#FFFFFF',
    text: '#000000',
    shadow: '#00000080',
    gray: '#808080'
};
const DARK = {
    background: '#1a1a1a',
    text: '#FFFFFF',
    shadow: '#000000',
    gray: '#C7C7C7'
};

let darkMode = false;
let sideBar = false;

setDarkMode(darkMode);

let scrollChange = false;

window.addEventListener('scroll', setScroll, false);
window.addEventListener('resize', reactResolution, false);

setScroll();
reactResolution();

function setScroll() {
    let scrollPercent = window.scrollY / (document.body.offsetHeight - window.innerHeight);
    document.body.style.setProperty('--scroll', scrollPercent);

    if(scrollChange !== window.scrollY < 300) {
        if(window.scrollY < 300)
            document.getElementById('toplink').style.transform = 'scale(0)';
        else
            document.getElementById('toplink').style.transform = 'scale(1)';
        
        console.log('change');
    }

    scrollChange = window.scrollY < 300;
}

function reactResolution() {
    if(window.innerWidth < 1024) {
        document.body.classList.remove('laptop');
        document.body.classList.add('mobile');
    } else if(window.innerWidth < 1600) {
        document.body.classList.remove('mobile');
        document.body.classList.add('laptop');
    } else {
        document.body.classList.remove('mobile');
        document.body.classList.remove('laptop');
    }
}

function setDarkMode(mode) {
    if(mode) {
        document.body.style.setProperty('--background', DARK.background);
        document.body.style.setProperty('--text', DARK.text);
        document.body.style.setProperty('--gray', DARK.gray);
        document.body.style.setProperty('--shadow', DARK.shadow);
    } else {
        document.body.style.setProperty('--background', LIGHT.background);
        document.body.style.setProperty('--text', LIGHT.text);
        document.body.style.setProperty('--gray', LIGHT.gray);
        document.body.style.setProperty('--shadow', LIGHT.shadow);
    }
}

function toggleSideBar() {
    sideBar = !sideBar;
    
    if(sideBar)
        document.getElementById('sidebar').style.transform = 'translateX(110%)';
    else
        document.getElementById('sidebar').style.transform = 'translateX(0)';
}