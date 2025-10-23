function startSnowfall(targetElement, flakeCount = 100) {
    function createSnowflake() {
        const flake = document.createElement("div");
        flake.classList.add("snowflake");

        const areaWidth = window.innerWidth;
        const areaHeight = window.innerHeight;

        flake.style.position = 'fixed';
        flake.style.zIndex = '9999';
        flake.style.top = "-5px";
        flake.style.left = Math.random() * areaWidth + "px";

        targetElement.appendChild(flake);

        const fallDuration = 3000 + Math.random() * 4000;
        const drift = (Math.random() - 0.5) * 100;
        const startLeft = parseFloat(flake.style.left);

        const startTime = performance.now();

        function fall(time) {
            const elapsed = time - startTime;
            const progress = elapsed / fallDuration;

            if (progress < 1) {
                const x = startLeft + drift * progress;
                const y = progress * (areaHeight + 10);
                flake.style.transform = `translate(${x - startLeft}px, ${y}px)`;
                requestAnimationFrame(fall);
            } else {
                flake.remove();
            }
        }

        requestAnimationFrame(fall);
    }

    const spawnRate = Math.max(10, 2000 / flakeCount); 

    setInterval(() => {
        createSnowflake();
    }, spawnRate);
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    startSnowfall(container, 200);
});
