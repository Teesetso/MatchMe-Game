let mode = '';
let players = [];
let males = [];
let females = [];
let team1Name = 'Team 1';
let team2Name = 'Team 2';
let playerQueue = [];
let team1Queue = [];
let team2Queue = [];
let nextTeamIndex = 0;
let selectedPlayer = null;
let canOpenBox = true;
let soundEnabled = true;
let audioContext;
let timerInterval;
let resultRecorded = false;
let spinInterval;
let isSpinning = false;
let matchRound = 0;
let team1Score = 0;
let team2Score = 0;
const totalMatchRounds = 16;

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

const funChallenges = [
    "Talk like a robot for 30 seconds", "Do your funniest dance", "Tell a silly joke",
    "Make three animal sounds", "Walk like a crab across the room", "Pull your funniest face",
    "Pretend you are a superhero", "Sing the chorus of a happy song", "Do 5 star jumps",
    "Balance a book on your head", "Act like a slow-motion movie star", "Say the alphabet dramatically",
    "Create a secret handshake", "Make everyone laugh without talking", "Do your best chicken dance",
    "Name 5 fruits in 10 seconds", "Pretend the floor is lava", "Give yourself a funny nickname",
    "Tell a story using only 5 words", "Do a victory celebration", "Copy another player's pose",
    "Make up a silly superhero name", "Freeze like a statue for 20 seconds", "Lead a silly group cheer"
];

const challengeCategories = {
    all: funChallenges,
    funny: [
        "Talk like a robot for 30 seconds", "Pull your funniest face", "Act like a slow-motion movie star",
        "Make everyone laugh without talking", "Do your best chicken dance", "Give yourself a funny nickname",
        "Make up a silly superhero name", "Lead a silly group cheer"
    ],
    movement: [
        "Do 5 star jumps", "Walk like a crab across the room", "Pretend the floor is lava",
        "Do a victory celebration", "Freeze like a statue for 20 seconds", "Do your funniest dance"
    ],
    creative: [
        "Create a secret handshake", "Tell a story using only 5 words", "Make up a silly superhero name",
        "Name 5 fruits in 10 seconds", "Give yourself a funny nickname", "Draw an imaginary animal in the air"
    ],
    teamwork: [
        "Copy another player's pose", "Lead a silly group cheer", "Create a secret handshake",
        "Make everyone laugh without talking", "Choose someone to do a matching pose"
    ]
};

const matchChallengeCategories = {
    all: [
        "{player} represents {team}! Make your funniest team pose!",
        "{player} represents {team}! Make three animal sounds!",
        "{player} represents {team}! Create a team cheer in 30 seconds!",
        "{player} represents {team}! Have a funny dance!",
        "{player} represents {team}! Name as many fruits as you can!",
        "{player} represents {team}! Make your silliest face!",
        "{player} represents {team}! Show your best superhero pose!",
        "{player} represents {team}! Tell a funny 5-word story!"
    ],
    funny: [
        "{player} represents {team}! Make three animal sounds!",
        "{player} represents {team}! Make your silliest face!",
        "{player} represents {team}! Perform your funniest pose!"
    ],
    movement: [
        "{player} represents {team}! Have a funny dance!",
        "{player} represents {team}! Do 5 star jumps!",
        "{player} represents {team}! Perform a victory celebration!"
    ],
    creative: [
        "{player} represents {team}! Create a team cheer in 30 seconds!",
        "{player} represents {team}! Invent an imaginary superhero pose!",
        "{player} represents {team}! Tell a funny 5-word story!"
    ],
    teamwork: [
        "{player} represents {team}! Create a secret handshake for your team!",
        "{player} represents {team}! Lead your team in a matching pose!",
        "{player} represents {team}! Lead your team in a cheer!"
    ]
};

const timedChallenges = new Map([
    ["Talk like a robot for 30 seconds", 30],
    ["Walk like a crab across the room", 20],
    ["Do 5 star jumps", 20],
    ["Freeze like a statue for 20 seconds", 20],
    ["Do your funniest dance", 30],
    ["Name 5 fruits in 10 seconds", 10]
]);

const matchTimedChallenges = new Map([
    ["{player} represents {team}! Create a team cheer in 30 seconds!", 30],
    ["{player} represents {team}! Name as many fruits as you can!", 30],
    ["{player} represents {team}! Create a secret handshake for your team!", 30]
]);

function playSound(notes, duration = 0.12) {
    if (!soundEnabled) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext = audioContext || new AudioContext();
    if (audioContext.state === 'suspended') audioContext.resume();

    notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const startTime = audioContext.currentTime + index * duration;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    });
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundButton = document.getElementById('soundToggle');
    soundButton.innerText = soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
    if (soundEnabled) playSound([523, 659, 784]);
}

function celebrate() {
    const colors = ['#ff4081', '#ffd166', '#06d6a0', '#118ab2', '#8338ec'];
    const container = document.getElementById('confetti');
    container.innerHTML = '';
    for (let i = 0; i < 36; i++) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[i % colors.length];
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ''; }, 1800);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    const timer = document.getElementById('challengeTimer');
    if (timer) timer.style.display = 'none';
}

function startChallengeTimer(challenge) {
    stopTimer();
    const seconds = (mode === 'match' ? matchTimedChallenges : timedChallenges).get(challenge);
    if (!seconds) return;

    const timer = document.getElementById('challengeTimer');
    let remaining = seconds;
    timer.innerText = `⏱️ ${remaining}s`;
    timer.style.display = 'block';
    timerInterval = setInterval(() => {
        remaining -= 1;
        timer.innerText = `⏱️ ${remaining}s`;
        if (remaining <= 0) {
            stopTimer();
            timer.innerText = '🎉 Time!';
            timer.style.display = 'block';
            playSound([784, 988, 1175], 0.12);
        }
    }, 1000);
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Mode Selection
function setMode(selectedMode) {
    mode = selectedMode;
    if (mode === 'match') {
        matchRound = 0;
        team1Score = 0;
        team2Score = 0;
    }
    
    // Apply the background class to the body
    document.body.classList.remove('single-mode', 'match-mode');
    document.body.classList.add(mode === 'single' ? 'single-mode' : 'match-mode');

    showPage('playerPage');
    document.getElementById('spinnerTitle').innerText =
        mode === 'match' ? 'Team 1 vs Team 2!' : 'Who will be selected?';
    document.getElementById('challengeTitle').innerText =
        mode === 'match' ? 'Team Challenge!' : 'Choose a Fun Challenge!';
    document.getElementById('challengeInstructions').innerText =
        mode === 'match'
            ? 'Team 1 and Team 2 compete together. Pick one challenge box!'
            : 'Pick one box. Remember: you can always skip.';
    let title = mode === 'single' ? 'Enter Player Names (2-19 players)' : 'Enter Team 1 and Team 2 Players';
    document.getElementById('playerPageTitle').innerText = title;
    
    let container = document.getElementById('playerInputs');
    container.innerHTML = '';

    if (mode === 'single') {
        for (let i = 0; i < 3; i++) addPlayerInput();
        container.innerHTML += `<div style="width:100%"><button onclick="addPlayerInput()">+ Add Player</button></div>`;
    } else {
        container.innerHTML += `<div class="team-name-row"><label for="team1NameInput">Team 1 name:</label><input id="team1NameInput" type="text" value="Team 1" maxlength="24"></div>`;
        container.innerHTML += `<div class="team-name-row"><label for="team2NameInput">Team 2 name:</label><input id="team2NameInput" type="text" value="Team 2" maxlength="24"></div>`;
        container.innerHTML += `<div style="width:100%"><h3>Team 1:</h3><div id="maleInputs"></div><button onclick="addMaleInput()">+ Team 1 Player</button></div>`;
        container.innerHTML += `<div style="width:100%"><h3>Team 2:</h3><div id="femaleInputs"></div><button onclick="addFemaleInput()">+ Team 2 Player</button></div>`;
        for (let i = 0; i < 2; i++) { addMaleInput(); addFemaleInput(); }
    }
}

// Input Helpers
function addPlayerInput() { createInput('playerInput', 'playerInputs', 'Player'); }
function addMaleInput() { createInput('maleInput', 'maleInputs', 'Team 1 player'); }
function addFemaleInput() { createInput('femaleInput', 'femaleInputs', 'Team 2 player'); }

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
    if (mode === 'match' && (males.length < 1 || females.length < 1)) return alert("Each team needs at least one player");

    if (mode === 'match') {
        team1Name = document.getElementById('team1NameInput').value.trim() || 'Team 1';
        team2Name = document.getElementById('team2NameInput').value.trim() || 'Team 2';
        matchRound = 0;
        team1Score = 0;
        team2Score = 0;
        updateScoreboard();
    }
    playerQueue = [];
    team1Queue = [];
    team2Queue = [];
    nextTeamIndex = Math.random() < 0.5 ? 0 : 1;
    refillPlayerQueue();
    updateTeamLabels();
    showPage('spinnerPage');
}

function refillPlayerQueue() {
    if (mode === 'single') {
        playerQueue = [...players.map(name => ({ name, label: name, teamName: '' }))]
            .sort(() => Math.random() - 0.5);
        return;
    }

    team1Queue = [...males.map(name => ({
        name, label: `🔵 ${name} (${team1Name})`, teamName: team1Name
    }))].sort(() => Math.random() - 0.5);
    team2Queue = [...females.map(name => ({
        name, label: `🔴 ${name} (${team2Name})`, teamName: team2Name
    }))].sort(() => Math.random() - 0.5);
}

function getNextPlayer() {
    if (mode === 'single') {
        if (playerQueue.length === 0) refillPlayerQueue();
        return playerQueue.shift();
    }

    const activeQueue = nextTeamIndex === 0 ? team1Queue : team2Queue;
    if (activeQueue.length === 0) {
        nextTeamIndex = nextTeamIndex === 0 ? 1 : 0;
    }

    const fallbackQueue = nextTeamIndex === 0 ? team2Queue : team1Queue;
    const selected = (activeQueue.length ? activeQueue : fallbackQueue).shift();
    nextTeamIndex = nextTeamIndex === 0 ? 1 : 0;
    return selected;
}

function updateTeamLabels() {
    document.getElementById('spinnerTitle').innerText =
        mode === 'match' ? `${team1Name} vs ${team2Name}!` : 'Who will be selected?';
    document.getElementById('challengeInstructions').innerText =
        mode === 'match'
            ? `${team1Name} and ${team2Name} compete together. ${selectedPlayer ? selectedPlayer.name : 'The selected player'} opens the challenge box!`
            : 'Pick one box. Remember: you can always skip.';
    document.getElementById('judgeInstructions').innerText = mode === 'match'
        ? 'Facilitator: watch the challenge and award the point fairly. The teams do not judge each other.'
        : '';
    document.getElementById('team1PointButton').innerText = `${team1Name} Gets Point`;
    document.getElementById('team2PointButton').innerText = `${team2Name} Gets Point`;
}

function personalizeChallenge(challenge) {
    return challenge
        .replaceAll('{team1}', team1Name)
        .replaceAll('{team2}', team2Name)
        .replaceAll('{team}', selectedPlayer ? selectedPlayer.teamName : team1Name)
        .replaceAll('{player}', selectedPlayer ? selectedPlayer.name : 'the selected player');
}

function updateScoreboard() {
    const scoreboard = document.getElementById('scoreboard');
    if (!scoreboard) return;
    scoreboard.innerText = `🔵 ${team1Name}: ${team1Score}    🔴 ${team2Name}: ${team2Score}`;
}

function updateRoundLabel() {
    const roundLabel = document.getElementById('roundLabel');
    if (roundLabel) {
        roundLabel.innerText = mode === 'match'
            ? `Challenge ${Math.min(matchRound + 1, totalMatchRounds)} of ${totalMatchRounds}`
            : '';
    }
}

// Spin the Bottle
function spin() {
    const selectedText = document.getElementById('selectedPlayer');
    const openBoxBtn = document.getElementById('openBoxBtn');
    const namePicker = document.getElementById('namePicker');
    const rollingName = document.getElementById('rollingName');
    
    if (isSpinning) return;
    isSpinning = true;
    openBoxBtn.style.display = 'none';
    namePicker.classList.remove('winner');
    selectedText.innerText = "Spinning...";
    playSound([392, 440, 494, 523], 0.08);

    const selected = getNextPlayer();
    selectedPlayer = selected;
    const choices = playerQueue.length ? [...playerQueue, selected] : [selected];
    let elapsed = 0;
    let delay = 70;

    const showNextName = () => {
        const rollingChoice = choices[Math.floor(Math.random() * choices.length)];
        rollingName.innerText = rollingChoice.label;
        selectedText.innerText = `✨ ${rollingChoice.label} ✨`;
        elapsed += delay;
        delay = Math.min(delay + 12, 220);

        if (elapsed >= 2600) {
            clearTimeout(spinInterval);
            selectedText.innerText = mode === 'single'
                ? `⭐ ${selected.label} ⭐`
                : `${selected.label} is selected!`;
            rollingName.innerText = selected.label;
            namePicker.classList.add('winner');
            openBoxBtn.innerText = `${selected.name}: Open Your Challenge Box`;
            openBoxBtn.style.display = 'inline-block';
            isSpinning = false;
            playSound([523, 659, 784, 1047], 0.14);
            return;
        }
        spinInterval = setTimeout(showNextName, delay);
    };

    showNextName();
}

// Challenge Grid
function setupChallenges() {
    showPage('challengePage');
    canOpenBox = true;
    const container = document.getElementById('boxContainer');
    const continueBtn = document.getElementById('continueBtn');
    const challengeActions = document.getElementById('challengeActions');
    const challengeResult = document.getElementById('challengeResult');
    
    container.innerHTML = '';
    continueBtn.style.display = 'none';
    challengeActions.style.display = 'none';
    challengeResult.innerText = '';
    stopTimer();
    resultRecorded = false;
    updateScoreboard();
    updateRoundLabel();
    updateTeamLabels();
    document.getElementById('selectedRepresentative').innerText = mode === 'match'
        ? `${selectedPlayer.name} from ${selectedPlayer.teamName} opens the challenge box and represents the team!`
        : `${selectedPlayer.name} opens the challenge box for their challenge!`;
    document.getElementById('openBoxBtn').innerText = `${selectedPlayer.name}: Open Your Challenge Box`;

    const isMatch = mode === 'match';
    document.getElementById('singleCompleteButton').style.display = isMatch ? 'none' : 'inline-block';
    document.getElementById('team1PointButton').style.display = isMatch ? 'inline-block' : 'none';
    document.getElementById('team2PointButton').style.display = isMatch ? 'inline-block' : 'none';
    document.getElementById('bothPointButton').style.display = isMatch ? 'inline-block' : 'none';
    document.getElementById('tryAnotherButton').style.display = isMatch ? 'none' : 'inline-block';

    // --- PICK THE CORRECT LIST BASED ON MODE ---
    const selectedCategory = document.getElementById('challengeCategory').value;
    const activeCategories = mode === 'match' ? matchChallengeCategories : challengeCategories;
    const activeList = activeCategories[selectedCategory] || activeCategories.all;

    for (let i = 0; i < 36; i++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.innerText = '?';
        
        box.onclick = function() {
            if (canOpenBox) {
                this.classList.add('opened');
                
                // Select random challenge from the active list
                            const challengeTemplate = activeList[Math.floor(Math.random() * activeList.length)];
                            const challenge = personalizeChallenge(challengeTemplate);
                            this.innerText = challenge;
                document.getElementById('challengeResult').innerText = challenge;
                document.getElementById('challengeActions').style.display = 'flex';
                startChallengeTimer(challengeTemplate);
                
                canOpenBox = false; 
                continueBtn.style.display = 'block'; 
                document.querySelectorAll('.box').forEach(b => {
                    if(!b.classList.contains('opened')) b.classList.add('disabled');
                });
                playSound([659, 784, 988], 0.13);
            }
        };
        container.appendChild(box);
    }
}

function nextRound() {
    stopTimer();
    if (mode === 'match' && matchRound >= totalMatchRounds) {
        showFinalScore();
        return;
    }
    document.getElementById('selectedPlayer').innerText = '';
    document.getElementById('selectedRepresentative').innerText = '';
    document.getElementById('openBoxBtn').style.display = 'none';
    document.getElementById('openBoxBtn').innerText = 'Open Your Challenge Box';
    showPage('spinnerPage');
}

function tryAnotherChallenge() {
    stopTimer();
    setupChallenges();
}

function skipChallenge() {
    playSound([330, 262], 0.16);
    if (mode === 'match') {
        recordMatchResult('none');
        return;
    }
    tryAnotherChallenge();
}

function completeChallenge() {
    stopTimer();
    document.getElementById('challengeResult').innerText = '🌟 Amazing job! 🌟';
    playSound([523, 659, 784, 1047], 0.12);
}

function recordMatchResult(result) {
    if (mode !== 'match' || resultRecorded) return;

    resultRecorded = true;
    if (result === 'team1' || result === 'both') team1Score += 1;
    if (result === 'team2' || result === 'both') team2Score += 1;
    matchRound += 1;
    canOpenBox = false;
    stopTimer();
    updateScoreboard();

    const challengeActions = document.getElementById('challengeActions');
    challengeActions.style.display = 'none';
    document.getElementById('continueBtn').innerText =
        matchRound >= totalMatchRounds ? 'See Final Score' : 'Next Challenge';
    document.getElementById('continueBtn').style.display = 'block';
    document.getElementById('challengeResult').innerText =
        result === 'none' ? 'No point this round.' : 'Point recorded! 🌟';
    if (result !== 'none') celebrate();
    playSound(result === 'none' ? [330, 262] : [523, 659, 784], 0.12);
}

function showFinalScore() {
    const winnerText = team1Score === team2Score
        ? "It's a tie! Both teams were amazing! 🤝"
        : team1Score > team2Score
            ? `🔵 ${team1Name} wins! Congratulations! 🎉`
            : `🔴 ${team2Name} wins! Congratulations! 🎉`;
    document.getElementById('finalScore').innerText =
        `${team1Name}: ${team1Score} points  •  ${team2Name}: ${team2Score} points`;
    document.getElementById('winnerText').innerText = winnerText;
    showPage('finalPage');
    celebrate();
    playSound([523, 659, 784, 1047], 0.14);
}

function resetToHome() {
    if (confirm("Are you sure you want to reset? This will delete all names.")) {
        players = []; males = []; females = [];
        selectedPlayer = null;
        playerQueue = [];
        team1Queue = [];
        team2Queue = [];
        nextTeamIndex = 0;
        team1Name = 'Team 1';
        team2Name = 'Team 2';
        clearTimeout(spinInterval);
        isSpinning = false;
        matchRound = 0;
        team1Score = 0;
        team2Score = 0;
        stopTimer();
        document.getElementById('selectedPlayer').innerText = "";
        document.getElementById('rollingName').innerText = "Ready?";
        document.getElementById('namePicker').classList.remove('winner');
        document.getElementById('openBoxBtn').style.display = 'none';
        document.body.classList.remove('single-mode', 'match-mode');
        showPage('startPage');
    }
}