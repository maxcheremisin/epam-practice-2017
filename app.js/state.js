let State = (function() {
    'use strict';

    let playing;
    let pause;
    let interval;

    function startPlaying() {
        playing = true;
    }

    function stopPlaying() {
        playing = false;
    }

    function isPlaying() {
        return playing;
    }

    function setPauseOn() {
        pause = true;
    }

    function setPauseOff() {
        pause = false;
    }

    function isPause() {
        return pause;
    }

    function startMove(func, delay) {
        interval = setInterval(func, delay);
    }

    function stopMove() {
        clearInterval(interval);
    }

    return {
        startPlaying: startPlaying,
        stopPlaying: stopPlaying,
        isPlaying: isPlaying,
        setPauseOn: setPauseOn,
        setPauseOff: setPauseOff,
        isPause: isPause,
        startMove: startMove,
        stopMove: stopMove
    };

})();
