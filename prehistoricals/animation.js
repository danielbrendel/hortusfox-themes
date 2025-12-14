document.addEventListener('DOMContentLoaded', function() {
    const IMAGE_COUNT = 7;
    const DELAY_SWITCH = 10000;

    let currentIndex = 0;

    const banner = document.querySelector('.banner');
    banner.classList.add('prehistoricals-crossfade');

    function imageAsset(num) {
        return window.location.origin + '/themes/prehistoricals/banner' + num + '.jpg';
    }

    banner.style.backgroundImage = `url('` + imageAsset(currentIndex) + `')`;
    banner.style.setProperty('--current-bg', `url('` + imageAsset(currentIndex) + `')`);

    function swapBanner() {
        const nextIndex = (currentIndex + 1) % IMAGE_COUNT;
        
        banner.style.setProperty('--next-bg', `url('` + imageAsset(currentIndex) + `')`);
        banner.classList.add('prehistoricals-fade');

        setTimeout(() => {
            banner.style.backgroundImage = `url('` + imageAsset(currentIndex) + `')`;
            banner.style.setProperty('--current-bg', `url('` + imageAsset(currentIndex) + `')`);
            banner.classList.remove('prehistoricals-fade');

            currentIndex = nextIndex;
        }, 2000);
    }

    swapBanner();
    setInterval(swapBanner, DELAY_SWITCH);
});
