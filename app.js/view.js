let View = (function () {
    'use strict';

    function refresh(canvas) {
        const ctx = document.getElementById('canvas-tetris').getContext('2d');
        const WIDTH = 300;
        const HEIGHT = 600;
        const COLS = 10;
        const ROWS = 20;
        const W_BRICK = WIDTH / COLS;
        const H_BRICK = HEIGHT / ROWS;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        renderCanvas(canvas,ctx, W_BRICK, H_BRICK, COLS, ROWS);
        renderShape(ctx, W_BRICK, H_BRICK);
    }

    function renderShape(ctx, W_BRICK, H_BRICK) {
        let posX = Shape.positionX * W_BRICK;
        let posY = Shape.positionY * H_BRICK;

        for (let y = 0; y < Shape.size; y += 1) {
            for (let x = 0; x < Shape.size; x += 1) {
                if (Shape.current[y][x]) {
                    drawBrick(x, y, posX, posY, ctx, W_BRICK, H_BRICK, Shape.color);
                }
            }
        }
    }

    function renderCanvas(canvas, ctx, W_BRICK, H_BRICK, COLS, ROWS) {
        for (let x = 0; x < COLS; x += 1) {
            for (let y = 0; y < ROWS; y += 1) {
                if (canvas[y][x]) {
                    drawBrick(x, y, 0, 0, ctx, W_BRICK, H_BRICK, canvas[y][x]);
                }
            }
        }
    }

    function renderNextShape(nextShape) {
        const ctx = document.getElementById('canvas-shape').getContext('2d');
        const WIDTH = 150;
        const HEIGHT = 150;
        const W_BRICK = WIDTH / 5;
        const H_BRICK = HEIGHT / 5;
        let shape = nextShape.shape;
        let size = nextShape.size;
        let color = nextShape.color;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        let position = size === 2 ?
            W_BRICK * 1.5 :
            size === 4 ? W_BRICK * 0.5 :
                W_BRICK;

        for (let y = 0; y < size; y += 1) {
            for (let x = 0; x < size; x += 1) {
                if (shape[y][x]) {
                    drawBrick(x, y, position, H_BRICK, ctx, W_BRICK, H_BRICK, color);
                }
            }
        }
    }

    function drawBrick(x, y, posX, posY, ctx, w_brick, h_brick, color) {
        ctx.fillStyle = color;
        ctx.fillRect(
            x * w_brick + posX,
            y * h_brick + posY,
            w_brick, h_brick
        );
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            x * w_brick + posX,
            y * h_brick + posY,
            w_brick, h_brick
        );
    }

    function updateScoreFields() {
        let scoreField = document.querySelector('.score-count');
        let rowsField = document.querySelector('.score-rows');
        let bestScoreField = document.querySelector('.best-score-count');

        scoreField.innerHTML = Score.getScore();
        rowsField.innerHTML = 'LINES: ' + Score.getLines();
        Score.setBestScore();
        bestScoreField.innerHTML = Score.getBestScore();
    }

    function updateSpaceButton(action, message = '') {
        let playButton = document.querySelector('.pause-label');
        let gameOver = document.querySelector('.game-over');

        action = action === 'PLAY'
            ? '<span class="pause-label-red">' + action + '</span>'
            : action;

        playButton.innerHTML = action;
        gameOver.innerHTML = message;
    }

    return {
        refresh: refresh,
        renderNextShape: renderNextShape,
        updateScoreFields: updateScoreFields,
        updateSpaceButton: updateSpaceButton
    };

})();
