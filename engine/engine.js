import { update } from "/game/main.js";
import { Scene } from "./game_objects/Scene.js";

let _scene_classes = {Object};
let _scene = Scene;
let _running = 1;
let _scenes = Object;

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
    _scene = await scene_load(_scenes.entry);
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

/**
 * @function scene_load
 * @description Loads a scene with the given meta data
 * @param {Object} scene_meta - The meta data for the scene to load
 * @returns {Scene} A promise that resolves to a new scene
 */
const scene_load = async function scene_load(scene_meta) {
    // Set up the entry scene
    const new_scene = await new Scene({
        canvas_size: scene_meta.canvas_size
    });


    // TODO: Move the object loading to the Scene class so that when we destroy a scene,
    //       we can destroy all the objects in it as well at the same time so they can be
    //       garbage collected
    // Add all the game objects to the scene
    for (let i = 0; i < scene_meta.gameObjects.length; i++) {
        // Check if the object class has already been loaded
        if ([...Object.keys(_scene_classes)].indexOf(scene_meta.gameObjects[i].class) === -1) {
            // If not, load it
            await import(`/game/classes/${scene_meta.gameObjects[i].name}.js`)
                .then(module => {
                    // Add the class object to the list of loaded classes
                    _scene_classes[scene_meta.gameObjects[i].name] = module[scene_meta.gameObjects[i].name];
                   })
                .catch(error => {
                    console.error(`Error loading class ${scene_meta.gameObjects[i].name}: `, error);
                }
            );           
        }

        // Create the game object
        const gameObject_meta = scene_meta.gameObjects[i];
        new_scene.gameObjects[i] = await new _scene_classes[scene_meta.gameObjects[i].name]({
            ...gameObject_meta,
            ...{                
                scene: new_scene,
            }
        });
        new_scene.add_object(new_scene.gameObjects[i]);
    }

    return new_scene;    
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


