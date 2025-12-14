class Sprite {
	constructor(asset, framecount, w, h, target = 'body') {
		this.spriteAsset = asset;
		this.spriteWidth = w;
		this.spriteHeight = h;
		this.spriteCurFrame = 0;
		this.spriteMaxFrame = framecount;
		
		const elTarget = document.querySelector(target);
		this.spriteEntity = this.spawnSprite(elTarget);
	}
	
	setPosition(x, y) {
		if (!this.isValid()) {
			return;
		}
		
		this.spriteEntity.style.top = `${y}px`;
		this.spriteEntity.style.left = `${x}px`;
	}

	setRotation(rot) {
		this.spriteEntity.style.rotate = `${rot}deg`;
	}

	setTransformOrigin(origin) {
		this.spriteEntity.style.transformOrigin = origin;
	}

	setPlacement(value) {
		this.spriteEntity.style.position = value;
	}
	
	getX() {
		if (!this.isValid()) {
			return -1;
		}
		
		return parseInt(this.spriteEntity.style.left.replace('px', ''));
	}
	
	getY() {
		if (!this.isValid()) {
			return -1;
		}
		
		return parseInt(this.spriteEntity.style.top.replace('px', ''));
	}

	getRotation() {
		if (this.spriteEntity.style.rotate === '') {
			return 0;
		}

		return parseInt(this.spriteEntity.style.rotate.replace('deg', ''));
	}

	getTransformOrigin() {
		return this.spriteEntity.style.transformOrigin;
	}

	getPlacement() {
		return this.spriteEntity.style.position;
	}

	setVisibility(flag) {
		if (flag) {
			this.spriteEntity.style.opacity = '1.0';
		} else {
			this.spriteEntity.style.opacity = '0.0';
		}
	}

	isVisible() {
		return parseInt(this.spriteEntity.style.opacity) == 1;
	}
	
	flip() {
		if (!this.isValid()) {
			return;
		}
		
		this.spriteEntity.style.transform = 'scaleX(-1)';
	}
	
	resetFlip() {
		if (!this.isValid()) {
			return;
		}
		
		this.spriteEntity.style.transform = 'unset';
	}
	
	setZIndex(value) {
		if (!this.isValid()) {
			return;
		}
		
		this.spriteEntity.style.zIndex = value;
	}

	getElement() {
		return this.spriteEntity;
	}
	
	isValid() {
		return (typeof this.spriteEntity !== 'undefined') && (this.spriteEntity !== null);
	}
	
	spawnSprite(target) {
		let el = document.createElement('div');
		
		el.style.position = 'fixed';
		el.style.zIndex = '1000';
		el.style.width = `${this.spriteWidth}px`;
		el.style.height = `${this.spriteHeight}px`;
		el.style.backgroundImage = `url('${this.spriteAsset}')`;
		el.style.backgroundPosition = '-64 0';
		target.appendChild(el);
		
		return el;
	}

	updateFrames() {
		if (!this.isValid()) {
			return;
		}
		
		this.spriteEntity.style.backgroundPosition = '-' + (this.spriteCurFrame * 32) + 'px 0';
		
		this.spriteCurFrame++;
		if (this.spriteCurFrame >= this.spriteMaxFrame) {
			this.spriteCurFrame = 0;
		}
	}

	destroy() {
		this.spriteEntity.remove();
	}
}

window.bannerAnim = function() {
	const IMAGE_COUNT = 9;
    const DELAY_SWITCH = 10000;

    let currentIndex = 0;

    const banner = document.querySelector('.banner');
    banner.classList.add('frisky-crossfade');

    function imageAsset(num) {
        return window.location.origin + '/themes/frisky/img/banner' + num + '.jpg';
    }

    banner.style.backgroundImage = `url('` + imageAsset(currentIndex) + `')`;
    banner.style.setProperty('--current-bg', `url('` + imageAsset(currentIndex) + `')`);

    function swapBanner() {
        const nextIndex = (currentIndex + 1) % IMAGE_COUNT;
        
        banner.style.setProperty('--next-bg', `url('` + imageAsset(currentIndex) + `')`);
        banner.classList.add('frisky-fade');

        setTimeout(() => {
            banner.style.backgroundImage = `url('` + imageAsset(currentIndex) + `')`;
            banner.style.setProperty('--current-bg', `url('` + imageAsset(currentIndex) + `')`);
            banner.classList.remove('frisky-fade');

            currentIndex = nextIndex;
        }, 2000);
    }

    swapBanner();

    setInterval(swapBanner, DELAY_SWITCH);
};

window.spawnBirds = function() {
	const BIRD_COUNT = 10;

	const navbar = document.querySelector('.navbar');

	let birds = [];
	let dir = false;

	for (let i = 0; i < BIRD_COUNT; i++) {
		const startX = (!dir) ? -20 : window.innerWidth + 20;
		const startY = window.getRandomInt(window.innerHeight - 50) + navbar.clientHeight + 20;

		let bird = new Sprite(window.location.origin + '/themes/frisky/img/bird' + (window.getRandomInt(5) + 1) + '.png', 3, 32, 32, '.container');
		bird.setPosition(startX, startY);
		bird.setVisibility(false);

		if (!dir) {
			bird.flip();
		}

		const callback = bird.updateFrames.bind(bird);
		setInterval(callback, 200);

		dir = !dir;

		birds.push({
			ent: bird,
			dir: dir,
			x: startX,
			y: startY,
			speed: window.getRandomInt(50) + 1,
			delay: window.getRandomInt(5000) + 100,
			timer: null,
			destruct: false
		});
	}

	for (i = 0; i < birds.length; i++) {
		const item = birds[i];

		setTimeout(function() {
			item.ent.setVisibility(true);

			item.timer = setInterval(function() {
				let x = item.ent.getX();
				let y = item.ent.getY();

				if (!item.dir) {
					x -= 3;

					if (x < -50) {
						item.destruct = true;
					}

					item.ent.setPosition(x, y);
				} else {
					x += 3;
					
					if (x > window.innerWidth + 50) {
						item.destruct = true;
					}

					item.ent.setPosition(x, y);
				}	
			}, item.speed);
		}, item.delay);
	}

	setInterval(function() {
		for (let i = 0; i < birds.length; i++) {
			let item = birds[i];

			if (item.destruct) {
				item.ent.destroy();
				birds.splice(i, 1);

				break;
			}
		}
	}, 1000);
};

window.birdAnim = function() {
	const WAVE_DELAY = 15000;
	setInterval(window.spawnBirds, WAVE_DELAY + window.getRandomInt(5000));
	window.spawnBirds();
};

window.plantAnim = function() {
	const ROTATION_SPAN = 5;
	const SPAWN_RATE = 300;
	const ELEM_CONTAINER = '.container';

	let spawnData = [];

	if (window.isMobileScreen()) {
		let spawnBoxW = 40;
		let spawnBoxH = 25;
		let spawnX = 0;
		let spawnY = window.innerHeight - spawnBoxH;
		let spawnRate = Math.floor(window.innerWidth / spawnBoxW);

		let bottomnav = document.querySelector('.bottomnav');
		if (bottomnav) {
			spawnY -= bottomnav.clientHeight;
		}

		for (let i = 0; i < spawnRate; i++) {
			spawnX = i * spawnBoxW;

			spawnData.push({
				x: spawnX + spawnBoxW / 4,
				y: spawnY,
				pl: 'fixed'
			});
		}
	} else {
		let columns = document.getElementsByClassName('column');
		let columnWidth = (window.innerWidth - columns[1].clientWidth) / 2;
		let columnHeight = columns[1].clientHeight;
		let columnCorrection = ((window.innerWidth - document.querySelector(ELEM_CONTAINER).clientWidth) / 2) + 10;

		for (let i = 0; i < SPAWN_RATE; i++) {
			spawnData.push({
				x: window.getRandomInt(columnWidth - 50) - columnCorrection + 20,
				y: window.getRandomInt(columnHeight - 50) + 50,
				pl: 'absolute'
			});
		}

		for (let j = 0; j < SPAWN_RATE; j++) {
			spawnData.push({
				x: window.getRandomInt(columnWidth - 50) + columnWidth + columns[1].clientWidth - columnCorrection + 20,
				y: window.getRandomInt(columnHeight - 50) + 50,
				pl: 'absolute'
			});
		}
	}

	const assets = [
		{
			file: 'plant1.png',
			w: 34,
			h: 32
		},

		{
			file: 'plant2.png',
			w: 18,
			h: 24
		},

		{
			file: 'plant3.png',
			w: 39,
			h: 35
		},

		{
			file: 'plant4.png',
			w: 32,
			h: 36
		},

		{
			file: 'plant5.png',
			w: 32,
			h: 27
		},

		{
			file: 'plant6.png',
			w: 30,
			h: 30
		}
	];

	for (let i = 0; i < spawnData.length; i++) {
		const startX = spawnData[i].x;
		const startY = spawnData[i].y;
		const placement = spawnData[i].pl;

		const rndpick = window.getRandomInt(assets.length);
		const asset = assets[rndpick];

		const plant = new Sprite(window.location.origin + '/themes/frisky/img/' + asset.file, 1, asset.w, asset.h, ELEM_CONTAINER);
		plant.setPosition(startX, startY);
		plant.setTransformOrigin('50% 90%');
		plant.setPlacement(placement);
		plant.setZIndex(100);

		let rotValue = -ROTATION_SPAN;
		let rotDir = 1;

		setInterval(function() {
			plant.setRotation(rotValue);

			rotValue += rotDir;
			if ((rotValue > ROTATION_SPAN) || (rotValue < -ROTATION_SPAN)) {
				rotDir *= -1;
			}
		}, 55);
	}
};

window.playSound = function(soundfile) {
	try {
		const sound = new Audio(window.location.origin + '/themes/frisky/snd/' + soundfile);
		sound.play();
	} catch (err) {
		console.log(err);
	}
};

window.loadAmbientSounds = function() {
	const sounds = ['chirp.wav', 'goldfinch1.wav', 'goldfinch2.wav', 'peacock.wav'];

	window.arrAmbientSounds = [];

	for (let i = 0; i < sounds.length; i++) {
		try {
			const audio = new Audio(window.location.origin + '/themes/frisky/snd/' + sounds[i]);

			window.arrAmbientSounds.push(audio);
		} catch (err) {
			console.log(err);
		}
	}
};

window.ambientSound = function() {
	function playAmbientSound() {
		let index = window.getRandomInt(window.arrAmbientSounds.length);
		window.arrAmbientSounds[index].play();
	}
	
	setInterval(playAmbientSound, 5000);
	playAmbientSound();
};

const FRISKY_SETTINGS_IDENT = 'frisky';

window.getSetting = function(ident, fallback = null) {
	const result = localStorage.getItem(`${FRISKY_SETTINGS_IDENT}.${ident}`);
	if (result === null) {
		return fallback;
	}

	return result;
};

window.setSetting = function(ident, value) {
	localStorage.setItem(`${FRISKY_SETTINGS_IDENT}.${ident}`, value);

	if ((typeof window.sndDialogSelection === 'object') && (window.animFeatureEnabled('sound'))) {
		window.sndDialogSelection.play();
	}
};

window.embedSettingsDialog = function() {
	let htmlDialog = `
		<div class="frisky-settings" id="frisky-settings">
			<div class="frisky-settings-item">
				<input type="checkbox" class="checkbox" id="frisky-setting-birds" onclick="window.setSetting('birds', (this.checked) ? 1 : 0);" value="1">&nbsp;<span>Enable birds</span>
			</div>

			<div class="frisky-settings-item">
				<input type="checkbox" class="checkbox" id="frisky-setting-sound" onclick="window.setSetting('sound', (this.checked) ? 1 : 0);" value="1">&nbsp;<span>Enable sound</span>
			</div>

			<div class="frisky-settings-item">
				<input type="checkbox" class="checkbox" id="frisky-setting-plants" onclick="window.setSetting('plants', (this.checked) ? 1 : 0);" value="1">&nbsp;<span>Enable meadow</span>
			</div>

			<div class="frisky-settings-action">
				<span><button class="button" onclick="window.closeSettingsDialog();">Close</button></span>
			</div>
		</div>
	`;

	let htmlButton = `
		<div class="frisky-action-button" id="frisky-action-button">
			<div class="frisky-action-button-inner">
				<a href="javascript:void(0);" onclick="window.showSettingsDialog();"><i class="fa-solid fa-spa up-color"></i></a>
			</div>
		</div>
	`;

	let target = document.querySelector('.container');
	target.innerHTML += htmlDialog + htmlButton;

	const bottomnav = document.querySelector('.bottomnav');
	if ((bottomnav) && (window.innerWidth < 1087) && (bottomnav.style.display !== 'none')) {
		let settingsDialog = document.querySelector('#frisky-settings');
		if (settingsDialog) {
			settingsDialog.style.bottom = '83px';
		}

		let actionButton = document.querySelector('#frisky-action-button');
		if (actionButton) {
			actionButton.style.bottom = '83px';
		}
	}
};

window.showSettingsDialog = function() {
	let elBirds = document.querySelector('#frisky-setting-birds');
	elBirds.checked = parseInt(window.getSetting('birds', 1));

	let elSound = document.querySelector('#frisky-setting-sound');
	elSound.checked = parseInt(window.getSetting('sound', 1));

	let elPlants = document.querySelector('#frisky-setting-plants');
	elPlants.checked = parseInt(window.getSetting('plants', 1));

	let dialog = document.querySelector('#frisky-settings');
	dialog.style.display = 'inherit';

	if (window.animFeatureEnabled('sound')) {
		window.sndDialogToggle.play();
	}
};

window.initialThemeSettings = function() {
	const settingBird = window.getSetting('birds');
	const settingSound = window.getSetting('sound');
	const settingPlants = window.getSetting('plants');

	if (settingBird === null) {
		window.setSetting('birds', 1);
	}

	if (settingSound === null) {
		window.setSetting('sound', 1);
	}

	if (settingPlants === null) {
		window.setSetting('plants', 1);
	}
};

window.animFeatureEnabled = function(feature) {
	return parseInt(window.getSetting(feature, 0)) == 1;
};

window.closeSettingsDialog = function() {
	let dialog = document.querySelector('#frisky-settings');
	dialog.style.display = 'none';

	if (window.animFeatureEnabled('sound')) {
		window.sndDialogToggle.play();
	}
};

window.getRandomInt = function(max) {
  return Math.floor(Math.random() * max);
};

window.isMobileScreen = function() {
	return window.innerWidth <= 1087;
};

document.addEventListener('DOMContentLoaded', function() {
	window.initialThemeSettings();
	window.embedSettingsDialog();
    window.bannerAnim();
	
	if (window.animFeatureEnabled('birds')) {
		window.birdAnim();
	}

	if (window.animFeatureEnabled('plants')) {
		window.plantAnim();
	}
	
	if (window.animFeatureEnabled('sound')) {
		window.loadAmbientSounds();
		window.ambientSound();
	}

	try {
		window.sndDialogToggle = new Audio(window.location.origin + '/themes/frisky/snd/toggle.wav');
		window.sndDialogSelection = new Audio(window.location.origin + '/themes/frisky/snd/select.wav');
	} catch (err) {
		console.log(err);
	}
});
