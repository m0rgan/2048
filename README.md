# 2048 Game

 

A web-based implementation of the classic 2048 puzzle game using pure JavaScript, HTML, and CSS.

 

## About

 

2048 is a sliding tile puzzle game where you combine tiles with the same number to create larger numbers. The goal is to create a tile with the value 2048.

 

## Features

 

- **Pure JavaScript** - No external libraries or frameworks

- **Responsive Design** - Works on desktop and mobile devices

- **Smooth Animations** - CSS transitions for tile movements and merges

- **Score Tracking** - Tracks current score and best score (persisted in localStorage)

- **Game Status Detection** - Automatic win/loss detection

- **Docker Support** - Easy deployment with Docker and docker-compose

 

## How to Play

 

- Use **arrow keys** (↑ ↓ ← →) to move tiles

- When two tiles with the same number touch, they **merge into one**

- After each move, a new tile (2 or 4) appears randomly on an empty spot

- The game is **won** when you create a tile with the value **2048**

- The game is **over** when the grid is full and no more moves are possible

 

## Project Structure

 

```

2048/

├── ex00/

│   ├── index.html           # Main HTML structure

│   ├── styles.css           # Game styling and animations

│   ├── script.js            # Game logic

│   ├── Dockerfile           # Docker configuration

│   └── docker-compose.yml   # Docker Compose configuration

└── README.md                # This file

```

 

## Running with Docker

 

### Prerequisites

- Docker

- Docker Compose

 

### Build and Run

 

1. Navigate to the project directory:

```bash

cd ex00

```

 

2. Build and start the container:

```bash

docker-compose up -d --build

```

 

3. Access the game:

Open your browser and navigate to `http://localhost:8080`

 

### Managing the Container

 

**Stop the game:**

```bash

docker-compose stop

```

 

**Start the game (if already built):**

```bash

docker-compose start

```

 

**Stop and remove the container:**

```bash

docker-compose down

```

 

**View logs:**

```bash

docker-compose logs -f

```

 

**Rebuild after changes:**

```bash

docker-compose down

docker-compose up -d --build

```



## Game Logic

 

### Movement Algorithm

The game uses a rotation-based algorithm:

1. Rotate grid to make any direction become "left"

2. Slide tiles left (remove zeros → merge → remove zeros → pad)

3. Rotate back to original orientation

 

### Merging Rules

- Only adjacent tiles with the same value can merge

- Each tile can only merge **once per move**

- The score increases by the value of the merged tile

 

### Win/Loss Detection

- **Win:** Any tile reaches 2048

- **Loss:** Grid is full AND no adjacent tiles can merge

 

## Technologies Used

 

- **HTML5** - Structure

- **CSS3** - Styling and animations

- **JavaScript** - Game logic

- **Docker** - Containerization

- **nginx** - Web server in production

 

## License

 

This project is created for educational purposes as part of the Globant Piscine Project 0.

 

## Author

migumore
 

Developed as a learning project for Globant Piscine.