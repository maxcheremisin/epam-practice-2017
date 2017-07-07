let Score = (function() {
    'use strict';
    
    let score;
    let bestScore = 0;
    let rows;
    let speed;

    function setScore(score_) {
        score = score_;
    }

    function getScore() {
        return score;
    }

    function setBestScore() {
        if (score > bestScore) {
            bestScore = score;
        }
    }

    function getBestScore() {
        return bestScore;
    }

    function setRows(rows_) {
        rows = rows_;
    }

    function getRows() {
        return rows;
    }

    function setSpeed(speed_) {
        speed = speed_;
    }

    function getSpeed() {
        return speed;
    }

    function increaseScore(score_ = 0, rows_ = 0, speed_ = 0) {
        score += score_;
        rows += rows_;
        if (speed > 200) {
            speed -= speed_;
        }
    }

    return {
        setScore: setScore,
        getScore: getScore,
        setBestScore: setBestScore,
        getBestScore: getBestScore,
        setRows: setRows,
        getRows: getRows,
        setSpeed: setSpeed,
        getSpeed: getSpeed,
        increaseScore: increaseScore
    }

})();