let Score = (function() {
    'use strict';
    
    let score = 0;
    let bestScore = 0;
    let lines = 0;
    let speed = 500;

    function setScore(score_) {
        score = score_;
    }

    function getScore() {
        return score;
    }

    function setBestScore() {
        bestScore = score > bestScore ? score : bestScore;
    }

    function getBestScore() {
        return bestScore;
    }

    function setLines(lines_) {
        lines = lines_;
    }

    function getLines() {
        return lines;
    }

    function setSpeed(speed_) {
        speed = speed_;
    }

    function getSpeed() {
        return speed;
    }

    function increaseScore(score_ = 0, lines_ = 0, speed_ = 0) {
        score += score_;
        lines += lines_;
        speed = speed > 200 ? speed -= speed_ : speed;
    }

    return {
        setScore: setScore,
        getScore: getScore,
        setBestScore: setBestScore,
        getBestScore: getBestScore,
        setLines: setLines,
        getLines: getLines,
        setSpeed: setSpeed,
        getSpeed: getSpeed,
        increaseScore: increaseScore
    };

})();
