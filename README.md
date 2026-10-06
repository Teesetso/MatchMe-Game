# MatchME Fun Game

MatchME is a child-friendly browser game for fun group activities at schools, youth programs, and community settings. Players are selected by an animated name picker and receive safe, playful challenges from mystery boxes.

> **Have fun and be kind!** Players should only complete challenges they feel comfortable with. A challenge can always be skipped.

## Play online

Open the live game here:

<https://teesetso.github.io/MatchMe-Game/>

Use the GitHub Pages link above to play the game. The repository link displays the project files and is not the game itself.

## Game modes

### Single Mode

- Add 2–19 individual players.
- The animated name picker selects one player at a time.
- Players take turns fairly before being selected again.
- The selected player opens a challenge box and completes the challenge.
- Choose from Everything, Funny, Movement, Creative, or Teamwork challenges.

### Match Mode

- Create two teams and give each team a custom name.
- Add one or more players to each team.
- Teams alternate turns, giving each team equal opportunity.
- The game has **16 rounds**, giving each team 8 representative turns.
- Players rotate within their own team before being selected again.
- The selected player opens the challenge box and represents their team.
- A neutral facilitator watches the challenge and awards the point fairly.
- The facilitator can award the point to either team, both teams, or neither team.
- The final screen shows both scores and announces the winning team or a tie.

## Features

- Fast animated name picker with a final selected player.
- Personalized team and player messages.
- 36 mystery challenge boxes.
- Challenge categories for different activity types.
- Optional generated sound effects with a sound on/off control.
- Timers for selected timed challenges.
- Skip and try-again controls.
- Confetti celebrations when points are awarded and when the game ends.
- Accessible focus styles and live result announcements.
- Names and scores are kept in the browser during the game and are not uploaded by the application.

## Project structure

```text
MatchMe-Game/
├── index.html
├── script.js
├── style.css
└── picture/
    ├── match.webp
    ├── single.jfif
    └── teamwork.jpg
```

## Run the game locally

No build step or package installation is required.

1. Clone the repository:

   ```bash
   git clone https://github.com/Teesetso/MatchMe-Game.git
   cd MatchMe-Game
   ```

2. Open `index.html` in a modern web browser.

For the best experience, serve the folder with a local web server if your browser restricts local files:

```bash
python -m http.server
```

Then open <http://localhost:8000>.

## Facilitator guidance

Before playing:

1. Review the challenge list for the age group and setting.
2. Explain that skipping is always allowed.
3. In Match Mode, use a neutral facilitator to award points.
4. Encourage effort, kindness, and teamwork rather than embarrassing anyone.
5. Keep the sound and movement level suitable for the group.

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Web Audio API for generated sound effects

The game does not require a backend, database, login, or external JavaScript libraries.
