let mode = '';
let players = [];
let males = [];
let females = [];
let currentRotation = 0;
let canOpenBox = true;

// --- DUAL CHALLENGE LISTS ---
const singleChallenges = [
    "Sing a song", "Do 10 push-ups", "Tell a secret", 
    "Dance for 30 seconds", "Imitate someone in the group",
    "Say a tongue twister", "Do a funny pose", "Draw something blindfolded",
    "Hop on one foot", "Spin 3 times", "Make a funny face",
    "Recite an alphabet backward", "Act like an animal", "Whistle a tune",
    "Clap 10 times", "Do 5 squats", "Pretend to be a robot",
    "Say a joke", "Do a silly walk", "Make an animal sound"
];

const adultChallenges = [
"Give a deep, lingering kiss that lasts for a full minute",
"Kiss them slowly from their jawline down to their collarbone",
"Blindfold them and kiss them in three unexpected places",
"Hold their face in your hands and give them a passionate 'movie' kiss",
"Trace their lips with yours before leanining in for a full kiss",
"Give a soft, playful bite to their bottom lip while kissing",
"Sit on their lap and maintain a deep kiss for 30 seconds",
"Whisper your most romantic fantasy while kissing their earlobe",
"Kiss every inch of their neck slowly and gently",
"Remove an item of their clothing while keeping eye contact",
"Give a slow kiss trail starting from their wrist up to their shoulder",
"Pull them close by the waist and give them a breathless kiss",
"Let them choose exactly where they want your next ten kisses",
"Use a silk scarf to lightly touch them between kisses",
"Kiss their forehead, then their cheeks, and finally their lips",
"Slowly undress each other while maintaining physical contact",
"Run your fingers through their hair while giving a deep kiss",
"Press your bodies together and slow dance without any music",
"Give them a lingering kiss on the back of their neck",
"Tell them one thing that always turns you on about them",
"Hold a single kiss for as long as you both can breathe comfortably",
"Kiss their palms and then pull their hands around your waist",
"Describe how much you want them while kissing their shoulder",
"Take turns leading a deep, rhythmic kiss for two minutes",
"End the session with a long, silent hug and one final deep kiss"
];
// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Mode Selection
function setMode(selectedMode) {
    mode = selectedMode;
    
    // Apply the background class to the body
    document.body.classList.remove('single-mode', 'match-mode');
    document.body.classList.add(mode === 'single' ? 'single-mode' : 'match-mode');

    showPage('playerPage');
    let title = mode === 'single' ? 'Enter Player Names (2-19 players)' : 'Enter Male & Female Names';
    document.getElementById('playerPageTitle').innerText = title;
    
    let container = document.getElementById('playerInputs');
    container.innerHTML = '';

    if (mode === 'single') {
        for (let i = 0; i < 3; i++) addPlayerInput();
        container.innerHTML += `<div style="width:100%"><button onclick="addPlayerInput()">+ Add Player</button></div>`;
    } else {
        container.innerHTML += `<div style="width:100%"><h3>Males:</h3><div id="maleInputs"></div><button onclick="addMaleInput()">+ Male</button></div>`;
        container.innerHTML += `<div style="width:100%"><h3>Females:</h3><div id="femaleInputs"></div><button onclick="addFemaleInput()">+ Female</button></div>`;
        for (let i = 0; i < 2; i++) { addMaleInput(); addFemaleInput(); }
    }
}

// Input Helpers
function addPlayerInput() { createInput('playerInput', 'playerInputs', 'Player'); }
function addMaleInput() { createInput('maleInput', 'maleInputs', 'Male'); }
function addFemaleInput() { createInput('femaleInput', 'femaleInputs', 'Female'); }

function createInput(cls, containerId, placeholder) {
    let container = document.getElementById(containerId);
    let count = document.querySelectorAll('.' + cls).length;
    if (count < 19) {
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `${placeholder} ${count + 1}`;
        input.className = cls;
        container.appendChild(input);
    }
}

// Start Game
function startGame() {
    players = Array.from(document.querySelectorAll('.playerInput')).map(i => i.value.trim()).filter(v => v !== '');
    males = Array.from(document.querySelectorAll('.maleInput')).map(i => i.value.trim()).filter(v => v !== '');
    females = Array.from(document.querySelectorAll('.femaleInput')).map(i => i.value.trim()).filter(v => v !== '');

    if (mode === 'single' && players.length < 2) return alert("Need at least 2 players");
    if (mode === 'match' && (males.length < 1 || females.length < 1)) return alert("Need at least one of each");

    showPage('spinnerPage');
}

// Spin the Bottle
function spin() {
    const bottle = document.getElementById('bottle');
    const selectedText = document.getElementById('selectedPlayer');
    const openBoxBtn = document.getElementById('openBoxBtn');
    
    openBoxBtn.style.display = 'none';
    selectedText.innerText = "Spinning...";

    const addedRotation = Math.floor(Math.random() * 3600) + 720;
    currentRotation += addedRotation;
    bottle.style.transform = `rotate(${currentRotation}deg)`;

    const spinSound = document.getElementById('spinSound');
    if(spinSound) {
        spinSound.currentTime = 0;
        spinSound.play();
    }

    setTimeout(() => {
        let result = "";
        if (mode === 'single') {
            result = `⭐ ${players[Math.floor(Math.random() * players.length)]} ⭐`;
        } else {
            const m = males[Math.floor(Math.random() * males.length)];
            const f = females[Math.floor(Math.random() * females.length)];
            result = `💙 ${m} & 💖 ${f}`;
        }
        selectedText.innerText = result;
        openBoxBtn.style.display = 'inline-block';
    }, 3000);
}

// Challenge Grid
function setupChallenges() {
    showPage('challengePage');
    canOpenBox = true;
    const container = document.getElementById('boxContainer');
    const continueBtn = document.getElementById('continueBtn');
    
    container.innerHTML = '';
    continueBtn.style.display = 'none';

    // --- PICK THE CORRECT LIST BASED ON MODE ---
    const activeList = (mode === 'single') ? singleChallenges : adultChallenges;

    for (let i = 0; i < 24; i++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.innerText = '?';
        
        box.onclick = function() {
            if (canOpenBox) {
                this.classList.add('opened');
                
                // Select random challenge from the active list
                this.innerText = activeList[Math.floor(Math.random() * activeList.length)];
                
                canOpenBox = false; 
                continueBtn.style.display = 'block'; 
                document.querySelectorAll('.box').forEach(b => {
                    if(!b.classList.contains('opened')) b.classList.add('disabled');
                });
                const boxSound = document.getElementById('boxSound');
                if(boxSound) {
                    boxSound.currentTime = 0;
                    boxSound.play();
                }
            }
        };
        container.appendChild(box);
    }
}

function nextRound() {
    document.getElementById('selectedPlayer').innerText = '';
    document.getElementById('openBoxBtn').style.display = 'none';
    showPage('spinnerPage');
}

function resetToHome() {
    if (confirm("Are you sure you want to reset? This will delete all names.")) {
        players = []; males = []; females = [];
        currentRotation = 0;
        document.getElementById('bottle').style.transform = `rotate(0deg)`;
        document.getElementById('selectedPlayer').innerText = "";
        document.getElementById('openBoxBtn').style.display = 'none';
        document.body.classList.remove('single-mode', 'match-mode');
        showPage('startPage');
    }
}
