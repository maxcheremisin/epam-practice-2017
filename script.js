(function () {
    'use strict';

    const ctx = document.getElementById('canvas-tetris').getContext('2d');
    const COLS = 10, ROWS = 20;
    const WIDTH = 300, HEIGHT = 600;
    let canvas = [];
    let interval;
    let timer;
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

    function newShape() {
        let shape = shapes[Math.floor(Math.random() * shapes.length)];
        shapeSize = shape.size;
        shapeColor = shape.color;

        currentShape = [];
        for (let y = 0; y < shapeSize; y += 1) {
            currentShape[y] = [];
            for (let x = 0; x < shapeSize; x += 1) {
                let i = shapeSize * y + x;

                currentShape[y][x] = shape.model[i] ? 1 : 0;
            }
        }

        positionX = Math.floor(Math.random() * COLS);
        positionY = 0;
        for (let x = 0; x < shapeSize; x += 1) {
            for (let y = 0; y < shapeSize; y += 1) {
                if (currentShape[y][x] && (x + positionX >= 10)) {
                    positionX -= 1;
                }
            }
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
                if (checkPosition(-1) && timer) {
                    positionX -= 1;
                }
                break;
            case 'right':
                if (checkPosition(1) && timer) {
                    positionX += 1;
                }
                break;
            case 'down':
                if (checkPosition(0, 1) && timer) {
                    positionY += 1;
                }
                break;
            case 'rotate':
                let rotated = rotateShape(currentShape);
                if (checkPosition(0, 0, rotated) && timer) {
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
            newShape();
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
            return block === 1;
        }
        
        function cutRow(y, newRow) {
            canvas.splice(y, 1);
            canvas.unshift(newRow);
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
    
    function gamePause() {
        if (timer) {
            clearInterval(interval);
            timer = false;
        } else {
            interval = setInterval(moveShape, 500);
            timer = true;
        }
    }

    function newGame() {
        clearInterval(interval);
        timer = true;
        clearCanvas();
        newShape();
        interval = setInterval(moveShape, 500);
    }

    newGame();
    setInterval(renderCanvas, 20);
}());