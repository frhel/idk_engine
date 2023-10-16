import { update } from "/game/main.js";
import { Scene } from "./classes/Scene.js";

let _scene = Scene;
let _running = 1;
let _scenes = Object;
let game_speed = 1;

// ************************ //
// ******* LOADING ******** //
// ************************ //

/**
 * @function ready_check_interval
 * @description Checks if the document is ready and if so, starts the game loop
 */
const ready_check_interval = setInterval(async function() {
    if (document.readyState === "complete") {
        clearInterval(ready_check_interval);
        start_game();
    }
}, 100);

/**
 * @function start_game
 * @description Starts the game loop
 */
async function start_game() {
    _scenes = await scene_list_load();
    _scene = new Scene({..._scenes.entry, game_speed: game_speed});
    engine_loop();
}


// ************************ //
// ******* SCENE ********** //
// ************************ //

/**
 * @function scene_list_load
 * @description Loads the scene list from a json file from the server
 * @returns {Object} A promise that resolves to the scene list
 */
async function scene_list_load() {
    return fetch("/game/scenes.json")
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error("Error loading scenes.json: ", error);
        }
    );
}


// ************************ //
// ******* ENGINE ********* //
// ************************ //

/**
 * @function engine_loop
 * @description The main engine loop
 * @param {Number} [timeStamp=0] - The current time stamp since the first frame
 */
function engine_loop(timeStamp = 0) {
    let delta = (timeStamp - _scene.frame_time);
    _scene.frame_time = timeStamp;
    _scene.time_to_frame += delta;
    
    _scene.frame += 1;

    // Update gets called as often as possible so whatever is in there
    // has to be manually throttled to whatever operations per second we want
    update(
        {
            timeStamp: timeStamp,
            scene: _scene
        }
    );

    // Draw the elements according to the fps
    if ((1000 / _scene.fps) < _scene.time_to_frame || (_scene.frame === 0)) {
        _scene.time_to_frame = 0;

        _scene.ctx.clearRect(0, 0, _scene.canvas.width, _scene.canvas.height);

        draw_objects(_scene);
    }

    if (_running === 1) {
        requestAnimationFrame(engine_loop);
    }
}



// ************************ //
// ******* GRAPHICS ******* //
// ************************ //

/**
 * @function draw_objects
 * @description Draws all the objects in the scene
 * @param {Scene} scene - The scene to draw the objects from
 */
const draw_objects = function draw_objects(scene) {
    // Update dynamic objects
    for (let i = 0; i < scene.gameObjects.length; i++) {
        scene.gameObjects[i].update();
    }
}

// Export the draw_objects function
export { draw_objects };




// ************************ //
// ******* NETWORK ******** //
// ************************ //


