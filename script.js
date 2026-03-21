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
    "Give a slow 2-minute massage anywhere they choose",
    "Whisper your boldest fantasy in their ear",
    "Hold eye contact and slowly lean in without kissing",
    "Remove one item of clothing slowly",
    "Kiss their neck for 30 seconds",
    "Blindfold them and tease them gently",
    "Let them guide your hands wherever they want",
    "Slow dance with full body contact",
    "Feed them something without using hands",
    "Sit on their lap and don’t move for 1 minute",
    "Trace their body slowly with one finger",
    "Give a deep, lingering kiss",
    "Let them remove one item of your clothing",
    "Whisper something you've never said before",
    "Kiss them somewhere unexpected",
    "Run your hands under their shirt",
    "Maintain intense eye contact for 60 seconds",
    "Pull them closer by the waist slowly",
    "Let them blindfold you and take control",
    "Give a slow kiss trail down their arm",
    "Lightly scratch their back or shoulders",
    "Say exactly what you find most attractive about them",
    "Lean in close but don’t kiss for 10 seconds",
    "Hold their face and kiss them deeply",
    "Let your hands wander (with consent)",
    "Sit behind them and wrap your arms around them",
    "Whisper what you’d do if there were no rules",
    "Playfully pin them down for 10 seconds",
    "Press your forehead against theirs and stay still",
    "Give a soft bite somewhere playful",
    "Tell them something that turns you on",
    "Run your fingers through their hair slowly",
    "Let them kiss you anywhere except lips",
    "Slowly spin them and pull them back in",
    "Stay very close without touching for 20 seconds",
    "Give a lingering hug from behind",
    "Brush your lips lightly against theirs repeatedly",
    "Say something teasing or dominant",
    "Kiss from their shoulder down slowly",
    "Let them choose how you touch them for 1 minute",
    "Mirror their movements slowly",
    "Sit close and breathe together slowly",
    "Hold their hands and pull them closer",
    "Let tension build without speaking for 30 seconds",
    "Give a slow kiss on their collarbone",
    "Let them control the pace completely",
    "Rest your head on them and stay still",
    "Say your favorite physical detail about them",
    "Let them explore your hands across their body",
    "End with a long, slow kiss"
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
