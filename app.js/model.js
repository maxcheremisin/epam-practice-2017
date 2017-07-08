let ModelShapes = (function() {
    'use strict';

    let shapes = [
        {
            name: 'I-shape',
            size: 4,
            color: 'lightblue',
            model: [0, 0, 0, 0,
                    1, 1, 1, 1]
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

    return shapes;

})();
