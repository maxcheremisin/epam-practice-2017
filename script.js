(function () {
    'use strict';

    const ctx = document.getElementById('canvas-tetris').getContext('2d');
    const COLS = 10, ROWS = 20;
    const WIDTH = 300, HEIGHT = 600;
    let playing = false;
    let score, rows, bestScore = 0;
    let speed;
    let canvas = [];
    let interval;
    let pause;
    let currentShape, nextShape;
    let shapeSize;
    let shapeColor;
    let positionX, positionY;
    let shapes = [
        {
            name: 'I-shape',
            size: 4,
            color: 'lightblue',
            model: [0, 1, 0, 0,
                    0, 1, 0, 0,
                    0, 1, 0, 0,
                    0, 1]
        },

        {
            name: 'L-shape',
            size: 3,
            color: 'orange',
            model: [1, 1, 1,
                    1]
        },

        {
            name: 'J-shape',
            size: 3,
            color: 'blue',
            model: [1, 1, 1,
                    0, 0, 1]
        },

        {
            name: 'O-shape',
            size: 2,
            color: 'yellow',
            model: [1, 1,
                    1, 1]
        },

        {
            name: 'Z-shape',
            size: 3,
            color: 'red',
            model: [1, 1, 0,
                    0, 1, 1]
        },

        {
            name: 'S-shape',
            size: 3,
            color: 'green',
            model: [0, 1, 1,
                    1, 1]
        },

        {
            name: 'T-shape',
            size: 3,
            color: 'purple',
            model: [0, 1, 0,
                    1, 1, 1]
        }
    ];

    function newShape(shapes) {
        let shape = shapes[Math.floor(Math.random() * shapes.length)];
        let shapeSize_ = shape.size;
        let shapeColor_ = shape.color;

        let currentShape_ = [];
        for (let y = 0; y < shapeSize_; y += 1) {
            currentShape_[y] = [];
            for (let x = 0; x < shapeSize_; x += 1) {
                let i = shapeSize_ * y + x;

                currentShape_[y][x] = shape.model[i] ? shapeColor_ : 0;
            }
        }

        let positionX_ = Math.floor(Math.random() * COLS);
        let positionY_ = 0;
        for (let x = 0; x < shapeSize_; x += 1) {
            for (let y = 0; y < shapeSize_; y += 1) {
                if (currentShape_[y][x] && (x + positionX_ >= 10)) {
                    positionX_ -= 1;
                }
            }
        }

        return {
            currentShape: currentShape_,
            shapeSize: shapeSize_,
            shapeColor: shapeColor_,
            positionX: positionX_,
            positionY: positionY_
        };
    }

    function controlButtons() {
        let space = document.querySelector('.pause-image');
        let up = document.querySelector('.rotate-image');
        let left = document.querySelector('.left-image');
        let down = document.querySelector('.down-image');
        let right = document.querySelector('.right-image');

        space.addEventListener('click', onPauseButton);
        up.addEventListener('click', onRotateButton);
        left.addEventListener('click', onLeftButton);
        down.addEventListener('click', onDownButton);
        right.addEventListener('click', onRightButton);
    }

    function onPauseButton() {
        if (!playing) {
            newGame();
        } else {
            gamePause();
        }
    }

    function onRotateButton() {
        let rotated = rotateShape(currentShape);
        if (checkPosition(0, 0, rotated) && !pause) {
            currentShape = rotated;
        }
    }

    function onLeftButton() {
        if (checkPosition(-1) && !pause) {
            positionX -= 1;
        }
    }

    function onDownButton() {
        if (checkPosition(0, 1) && !pause) {
            positionY += 1;
        }
    }

    function onRightButton() {
        if (checkPosition(1) && !pause) {
            positionX += 1;
        }
    }

    document.body.onkeydown = function (e) {
        let keys = {
            37: 'left',
            39: 'right',
            40: 'down',
            38: 'rotate',
            32: 'pause'
        };

        keyPress(keys[e.keyCode]);
    };

    function keyPress(key) {
        switch (key) {
            case 'left':
                onLeftButton();
                break;
            case 'right':
                onRightButton();
                break;
            case 'down':
                onDownButton();
                break;
            case 'rotate':
                onRotateButton();
                break;
            case 'pause':
                onPauseButton();
        }
    }

    function rotateShape(currentShape) {
        let newCurrentShape = [];
        if (shapeSize === 4) {
            for (let y = 0; y < shapeSize; y += 1) {
                newCurrentShape[y] = [];
                for (let x = 0; x < shapeSize; x += 1) {
                    newCurrentShape[y][x] = currentShape[x][y];
                }
            }
        } else {
            for (let y = 0; y < shapeSize; y += 1) {
                newCurrentShape[y] = [];
                for (let x = 0; x < shapeSize; x += 1) {
                    newCurrentShape[y][x] = currentShape[shapeSize - 1 - x][y];
                }
            }
        }
        return newCurrentShape;
    }

    function checkPosition(offsetX = 0, offsetY = 0, newCurrentShape = currentShape) {
        offsetX = positionX + offsetX;
        offsetY = positionY + offsetY;

        for (let y = 0; y < shapeSize; y += 1) {
            for (let x = 0; x < shapeSize; x += 1) {
                if (newCurrentShape[y][x]) {
                    if (
                        x + offsetX < 0 ||
                        y + offsetY >= ROWS ||
                        x + offsetX >= COLS ||
                        canvas[y + offsetY][x + offsetX]
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function moveShape() {
        if (checkPosition(0, 1)) {
            positionY += 1;
        } else {
            freezeShape();
            clearLines();
            releaseShape();
        }
    }

    function freezeShape() {
        for (let y = 0; y < shapeSize; y += 1) {
            for (let x = 0; x < shapeSize; x += 1) {
                if (currentShape[y][x]) {
                    canvas[y + positionY][x + positionX] = currentShape[y][x];
                }
            }
        }

        if (positionY === 0) {
            loseGame();
        }
    }

    function clearLines() {
        for (let y = ROWS - 1; y >= 0; y -= 1) {
            let rowFilled = true;
            for (let x = 0; x < COLS; x += 1) {
                if (canvas[y][x] === 0 ) {
                    rowFilled = false;
                    break;
                }
            }
            if (rowFilled) {
                for (let y_ = y; y_ > 0; y_ -= 1) {
                    for (let x = 0; x < COLS; x += 1) {
                        canvas[y_][x] = canvas[y_ - 1][x];
                    }
                }
                y += 1;
                score += 100;
                rows += 1;
                updateScore();
                if (speed > 200) {
                    speed -= 10;
                }
                clearInterval(interval);
                interval = setInterval(moveShape, speed)
            }
        }
    }

    function clearCanvas() {
        for (let y = 0; y < ROWS; y += 1) {
            canvas[y] = [];
            for (let x = 0; x < COLS; x += 1) {
                canvas[y][x] = 0;
            }
        }
    }

    function renderCanvas() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        // draw canvas
        for (let x = 0; x < COLS; x += 1) {
            for (let y = 0; y < ROWS; y += 1) {
                if (canvas[y][x]) {
                    ctx.fillStyle = canvas[y][x];
                    ctx.fillRect(
                        x * WIDTH / COLS,
                        y * HEIGHT / ROWS,
                        WIDTH / COLS, HEIGHT / ROWS
                    );
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        x * WIDTH / COLS,
                        y * HEIGHT / ROWS,
                        WIDTH / COLS, HEIGHT / ROWS
                    );
                }
            }
        }

        // draw moving shape
        for (let y = 0; y < shapeSize; y += 1) {
            for (let x = 0; x < shapeSize; x += 1) {
                if (currentShape[y][x]) {
                    ctx.fillStyle = shapeColor;
                    ctx.fillRect(
                        x * WIDTH / COLS + positionX * WIDTH / COLS,
                        y * HEIGHT / ROWS + positionY * HEIGHT / ROWS,
                        WIDTH / COLS, HEIGHT / ROWS
                    );
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(
                        x * WIDTH / COLS + positionX * WIDTH / COLS,
                        y * HEIGHT / ROWS + positionY * HEIGHT / ROWS,
                        WIDTH / COLS, HEIGHT / ROWS
                    );
                }
            }
        }
    }

    function renderNextShape(nextShape, shapeSize, shapeColor) {
        let ctx_ = document.getElementById('canvas-shape').getContext('2d');
        let COLS_ = 5, ROWS_ = 6;
        let WIDTH_ = 150, HEIGHT_ = 180;
        let offset;

        ctx_.clearRect(0, 0, WIDTH_, HEIGHT_);

        for (let y = 0; y < shapeSize; y += 1) {
            for (let x = 0; x < shapeSize; x += 1) {
                if (nextShape[y][x]) {
                    if (shapeSize === 2) {
                        offset = (WIDTH_ / COLS_) * 1.5;
                    } else {
                        offset = WIDTH_ / COLS_;
                    }
                    ctx_.fillStyle = shapeColor;
                    ctx_.fillRect(
                        x * WIDTH_ / COLS_ + offset,
                        y * HEIGHT_ / ROWS_ + HEIGHT_ / ROWS_,
                        WIDTH_ / COLS_, HEIGHT_ / ROWS_
                    );
                    ctx_.strokeStyle = 'black';
                    ctx_.lineWidth = 2;
                    ctx_.strokeRect(
                        x * WIDTH_ / COLS_ + offset,
                        y * HEIGHT_ / ROWS_ + HEIGHT_ / ROWS_,
                        WIDTH_ / COLS_, HEIGHT_ / ROWS_
                    );
                }
            }
        }
    }

    function gamePause() {
        if (pause) {
            interval = setInterval(moveShape, speed);
            pause = false;
        } else {
            clearInterval(interval);
            pause = true;
        }
    }

    function updateScore() {
        let scoreField = document.querySelector('.score-count');
        let rowsField = document.querySelector('.score-rows');
        let bestScoreField = document.querySelector('.best-score-count');

        scoreField.innerHTML = score;
        rowsField.innerHTML = 'ROWS: ' + rows;
        if (score > bestScore) {
            bestScore = score;
        }
        bestScoreField.innerHTML = bestScore;
    }

    function releaseShape() {
        if (playing) {
            score += 10;
            currentShape = nextShape.currentShape;
            shapeColor = nextShape.shapeColor;
            shapeSize = nextShape.shapeSize;
            positionX = nextShape.positionX;
            positionY = nextShape.positionY;
            nextShape = newShape(shapes);
            renderNextShape(nextShape.currentShape, nextShape.shapeSize, nextShape.shapeColor);
            updateScore();
        }
    }

    function loseGame() {
        let playButton = document.querySelector('.pause-label');
        let gameOver = document.querySelector('.game-over');

        clearInterval(interval);
        playing = false;
        if (!playing) {
            playButton.innerHTML = '<span class="pause-label-red">PLAY</span>';
        }
        gameOver.innerHTML = 'GAME OVER';
    }

    function newGame() {
        let playButton = document.querySelector('.pause-label');
        let gameOver = document.querySelector('.game-over');
        
        nextShape = newShape(shapes);
        playing = true;
        if (playing) {
            playButton.innerHTML = 'PAUSE';
        }
        gameOver.innerHTML = '';
        pause = false;
        score = -10;
        rows = 0;
        speed = 500;
        clearCanvas();
        clearInterval(interval);
        interval = setInterval(moveShape, speed);
        releaseShape();
        setInterval(renderCanvas, 20);
    }

    controlButtons();
}());