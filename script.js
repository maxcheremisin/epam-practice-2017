(function () {
    'use strict';

    let COLS = 10, ROWS = 20;
    let WIDTH = 300, HEIGHT = 600;
    let interval;
    let currentShape;
    let shapeSize;
    let positionX, positionY;
    let shapes = [
        [4,
         0, 1, 0, 0,
         0, 1, 0, 0,
         0, 1, 0, 0,
         0, 1],

        [3, // size of matrix
         1, 1, 1,
         1],

        [3,
         1, 1, 1,
         0, 0, 1],

        [2,
         1, 1,
         1, 1],

        [3,
         1, 1, 0,
         0, 1, 1],

        [3,
         0, 1, 1,
         1, 1],

        [3,
         0, 1, 0,
         1, 1, 1]
    ];

    function newShape() {
        let id = Math.floor(Math.random() * shapes.length);
        let shape = shapes[id];
        shapeSize = shape[0];

        currentShape = [];
        for (let y = 0; y < shapeSize; ++y) {
            currentShape[y] = [];
            for (let x = 0; x < shapeSize; ++x) {
                let i = shapeSize * y + x;
                if (typeof shape[i + 1] != 'undefined' && shape[i + 1]) {
                    currentShape[y][x] = 1;
                }
                else {
                    currentShape[y][x] = 0;
                }
            }
        }
        
        positionX = Math.floor(Math.random() * COLS);
        positionY = 0;
        for (let x = 0; x < shapeSize; x++) {
            for (let y = 0; y < shapeSize; y++) {
                if ((currentShape[y][x]) && x + positionX >= 10) {
                    --positionX;
                }
            }
        }
    }

    function drawFigure() {
        let ctx = document.getElementById('canvas-tetris').getContext('2d');
        ctx.clearRect(0, 0, 300, 600)
        for (let y = 0; y < shapeSize; ++y) {
            for (let x = 0; x < shapeSize; ++x) {
                if (currentShape[y][x]) {
                    ctx.fillStyle = "yellow";
                    ctx.fillRect( x * WIDTH/COLS + positionX * WIDTH / COLS,
                                    y * HEIGHT/ROWS + positionY * HEIGHT / ROWS,
                                    WIDTH / COLS - 2, HEIGHT / ROWS - 2);
                    ctx.strokeStyle = "black";
                    ctx.lineWidth = 3;
                    ctx.strokeRect( x * WIDTH/COLS + positionX * WIDTH / COLS,
                                    y * HEIGHT/ROWS + positionY * HEIGHT / ROWS,
                                    WIDTH / COLS - 1, HEIGHT / ROWS - 1);
                }
            }
        }
    }

    document.body.onkeydown = function(e) {
        let keys = {
            37: 'left',
            39: 'right',
            40: 'down',
            38: 'rotate'
        };

        keyPress(keys[e.keyCode]);
        drawFigure();
    };

    function keyPress(key) {
        switch (key) {
            case 'left':
                if (checkPosition(-1)) {
                    --positionX;
                }
                break;
            case 'right':
                if (checkPosition(1)) {
                    ++positionX;
                }
                break;
            case 'down':
                // if (checkPosition(0, 1)) {
                    ++positionY;
                // }
                break;
            case 'rotate':
                let rotated = rotate(currentShape);
                if (checkPosition(0, 0, rotated)) {
                    currentShape = rotated;
                }
                break;
        }
    }

    function rotate(currentShape) {
        let newCurrentShape = [];
        if (shapeSize == 4) {
            for (let y = 0; y < shapeSize; ++y) {
                newCurrentShape[y] = [];
                for (let x = 0; x < shapeSize; ++x) {
                    newCurrentShape[y][x] = currentShape[x][y];
                }
            }
        } else {
            for (let y = 0; y < shapeSize; ++y) {
                newCurrentShape[y] = [];
                for (let x = 0; x < shapeSize; ++x) {
                    newCurrentShape[y][x] = currentShape[shapeSize - 1 - x][y];
                }
            }
        }
        return newCurrentShape;
    }

    function checkPosition(offsetX, offsetY, newCurrentShape) {
        offsetX = offsetX || 0;
        offsetY = offsetY || 0;
        newCurrentShape = newCurrentShape || currentShape;

        offsetX = positionX + offsetX;
        offsetY = positionY + offsetY;

        for (let y = 0; y < shapeSize; ++y) {
            for (let x = 0; x < shapeSize; ++x) {
                if (newCurrentShape[y][x]) {
                    if (x + offsetX < 0 ||
                        y + offsetY >= ROWS ||
                        x + offsetX >= COLS) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function moveShape() {
        drawFigure();
        if (checkPosition(0, 0)) {
            ++positionY;
        } else {
            newShape();
        }
    }

    function newGame() {
        clearInterval(interval);
        newShape();
        interval = setInterval(moveShape, 500);
    }

    newGame();
}());