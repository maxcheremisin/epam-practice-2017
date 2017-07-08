let Controller = (function (Score, State, Shape, ModelShapes, View) {
    'use strict';

    const COLS = 10;
    const ROWS = 20;

    let canvas = [];

    function newShape(ModelShapes) {
        let shape = ModelShapes[Math.floor(Math.random() * ModelShapes.length)];
        let size = shape.size;
        let color = shape.color;
        let shape_ = [];

        for (let y = 0; y < size; y += 1) {
            shape_[y] = [];
            for (let x = 0; x < size; x += 1) {
                let i = size * y + x;

                shape_[y][x] = shape.model[i] ? color : 0;
            }
        }

        let positionX = Math.floor(Math.random() * COLS);
        let positionY = size === 4 ? -1 : 0;

        for (let x = 0; x < size; x += 1) {
            for (let y = 0; y < size; y += 1) {
                if (shape_[y][x] && (x + positionX >= 10)) {
                    positionX -= 1;
                }
            }
        }

        return {
            shape: shape_,
            size: size,
            color: color,
            positionX: positionX,
            positionY: positionY
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
        if (!State.isPlaying()) {
            newGame();
        } else {
            gamePause();
        }
    }

    function onRotateButton() {
        Shape.current = checkPosition(0, 0, rotateShape(Shape.current, Shape.size))
                            && !State.isPause()
                            && State.isPlaying()
            ? rotateShape(Shape.current, Shape.size)
            : Shape.current;
    }

    function onLeftButton() {
        Shape.positionX = checkPosition(-1)
                            && !State.isPause()
                            && State.isPlaying()
            ? Shape.positionX -= 1
            : Shape.positionX;
    }

    function onDownButton() {
        Shape.positionY = checkPosition(0, 1)
                            && !State.isPause()
                            && State.isPlaying()
            ? Shape.positionY += 1
            : Shape.positionY;
    }

    function onRightButton() {
        Shape.positionX = checkPosition(1)
                            && !State.isPause()
                            && State.isPlaying()
            ? Shape.positionX += 1
            : Shape.positionX;
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

    function rotateShape(current, size) {
        let newCurrent = [];
        if (size === 4) {
            for (let y = 0; y < size; y += 1) {
                newCurrent[y] = [];
                for (let x = 0; x < size; x += 1) {
                    newCurrent[y][x] = current[x][y];
                }
            }
        } else {
            for (let y = 0; y < size; y += 1) {
                newCurrent[y] = [];
                for (let x = 0; x < size; x += 1) {
                    newCurrent[y][x] = current[size - 1 - x][y];
                }
            }
        }
        return newCurrent;
    }

    function checkPosition(offsetX = 0, offsetY = 0, newCurrent = Shape.current) {
        offsetX = Shape.positionX + offsetX;
        offsetY = Shape.positionY + offsetY;

        for (let y = 0; y < Shape.size; y += 1) {
            for (let x = 0; x < Shape.size; x += 1) {
                if (newCurrent[y][x]) {
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

    function clearCanvas() {
        for (let y = 0; y < ROWS; y += 1) {
            canvas[y] = [];
            for (let x = 0; x < COLS; x += 1) {
                canvas[y][x] = 0;
            }
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
                Score.increaseScore(100, 1, 10);
                View.updateScoreFields();
                State.stopMove();
                State.startMove(moveShape, Score.getSpeed());
            }
        }
    }

    function moveShape() {
        if (checkPosition(0, 1)) {
            Shape.positionY += 1;
        } else {
            freezeShape();
            clearLines();
            releaseShape(Shape.next);
        }
    }

    function freezeShape() {
        for (let y = 0; y < Shape.size; y += 1) {
            for (let x = 0; x < Shape.size; x += 1) {
                if (Shape.current[y][x]) {
                    canvas[y + Shape.positionY][x + Shape.positionX] = Shape.current[y][x];
                    if (Shape.positionY === 0 && Shape.current[0].some(function(x) {
                            return x;
                        })) {
                        loseGame();
                    }
                }
            }
        }
    }

    function setNextShape(nextShape) {
        Shape.current = nextShape.shape;
        Shape.color = nextShape.color;
        Shape.size = nextShape.size;
        Shape.positionX = nextShape.positionX;
        Shape.positionY = nextShape.positionY;
        Shape.next = newShape(ModelShapes);
    }

    function releaseShape() {
        if (State.isPlaying()) {
            Score.increaseScore(10);
            setNextShape(Shape.next);
            View.renderNextShape(Shape.next);
            View.updateScoreFields();
        }
    }

    function gamePause() {
        if (State.isPause()) {
            State.startMove(moveShape, Score.getSpeed());
            State.setPauseOff();
        } else {
            State.stopMove();
            State.setPauseOn();
        }
    }

    function loseGame() {
        State.stopMove();
        State.stopPlaying();
        View.updateSpaceButton('PLAY', 'GAME OVER');
    }

    function newGame() {
        View.updateSpaceButton('PAUSE');
        Shape.next = newShape(ModelShapes);
        State.startPlaying();
        State.setPauseOff();
        Score.setScore(-10);
        Score.setLines(0);
        Score.setSpeed(500);
        clearCanvas();
        State.stopMove();
        State.startMove(moveShape, Score.getSpeed());
        releaseShape(Shape.next);
        setInterval(View.refresh, 20, canvas);
    }

    return {
        controlButtons: controlButtons
    }

})(Score, State, Shape, ModelShapes, View);
