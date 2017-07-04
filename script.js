(function () {
    'use strict';

    const ctx = document.getElementById('canvas-tetris').getContext('2d');
    const COLS = 10, ROWS = 20;
    const WIDTH = 300, HEIGHT = 600;
    let score;
    let speed;
    let canvas = [];
    let interval;
    let pause;
    let currentShape;
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

    let nextShape = newShape(shapes);

    function newShape(shapes) {
        let shape = shapes[Math.floor(Math.random() * shapes.length)];
        let shapeSize_ = shape.size;
        let shapeColor_ = shape.color;

        let currentShape_ = [];
        for (let y = 0; y < shapeSize_; y += 1) {
            currentShape_[y] = [];
            for (let x = 0; x < shapeSize_; x += 1) {
                let i = shapeSize_ * y + x;

                currentShape_[y][x] = shape.model[i] ? 1 : 0;
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
                if (checkPosition(-1) && !pause) {
                    positionX -= 1;
                }
                break;
            case 'right':
                if (checkPosition(1) && !pause) {
                    positionX += 1;
                }
                break;
            case 'down':
                if (checkPosition(0, 1) && !pause) {
                    positionY += 1;
                }
                break;
            case 'rotate':
                let rotated = rotateShape(currentShape);
                if (checkPosition(0, 0, rotated) && !pause) {
                    currentShape = rotated;
                }
                break;
            case 'pause':
                gamePause();
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
    }

    function clearLines() {
        let newRow = [0,0,0,0,0,0,0,0,0,0];

        function isFilled(block) {
            return block;
        }
        
        function cutRow(y, newRow) {
            canvas.splice(y, 1);
            canvas.unshift(newRow);
            score += 100;
            updateScore();
            if (speed > 140) {
                speed -= 20;
            }
            clearInterval(interval);
            interval = setInterval(moveShape, speed)
        }

        for (let y = 0; y < ROWS; y += 1) {
            if (canvas[y].every(isFilled)) {
                for (let x = 0; x < COLS; x += 1) {
                    setTimeout(function () {
                        if (canvas[y][x]) {
                            ctx.fillStyle = 'yellow';
                            ctx.fillRect(
                                x * WIDTH / COLS,
                                y * HEIGHT / ROWS,
                                WIDTH / COLS, HEIGHT / ROWS
                            );
                        }
                    }, 10)
                }
                setTimeout(cutRow, 20, y, newRow);
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
                    ctx.fillStyle = 'yellowgreen';
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
        scoreField.innerHTML = score;
    }

    function releaseShape() {
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


    function newGame() {
        clearInterval(interval);
        clearCanvas();
        score = -10;
        speed = 500;
        pause = false;
        interval = setInterval(moveShape, speed);
        releaseShape();
    }

    newGame();
    setInterval(renderCanvas, 20);
}());