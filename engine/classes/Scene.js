import { GameObject } from "./GameObject.js";

// Create a class to hold elements
class Scene {
    /**
     * @class Scene
     * @classdesc A class to setup and hold global scene elements
     * @param {Object} props - Object containing the props for initializing the scebe
     * @param {Number} [props.canvas_width] - The width of the main canvas. Defaults to 600
     * @param {Number} [props.canvas_height] - The height of the main canvas. Defaults to 600
     * @param {Number} [props.canvas_size] - The size of the main canvas. If width and height are not defined, this will be used for both. Defaults to 600
     */
    constructor(props) {
        this.canvas = document.getElementById("game-canvas");
        this.width = this.canvas.width = props.canvas_width || props.canvas_size || 600;
        this.height = this.canvas.height = props.canvas_height || props.canvas_size || 600;

        this.game_speed = props.game_speed || 1;

        // Default values
        this.ctx = this.canvas.getContext('2d');
        
        this.modules = {Object: GameObject};

        this.gameObjects_meta = props.gameObjects || [];
        this.gameObjects = [];
        this.load_game_objects();

        // this.backgrounds_meta = props.backgrounds || [];
        // this.background = this.load_background();



        this.frame = 0;
        this.time_to_frame = 0;
        this.frame_time = 0;
        this.fps = 60;

        return this;
    }

    load_class_file = async function load_class_file(module_name, path) {
        // Check if the object class has already been loaded
        if ([...Object.keys(this.modules)].indexOf(module_name) === -1) {
            // If not, load it
            await import(`${path}${module_name}.js`)
                .then(module => {
                    // Add the class object to the list of loaded classes
                    this.modules[module_name] = module[module_name];
                })
                .catch(error => {
                    console.error(`Error loading class ${module_name}: `, error);
                }
            );           
        }     
    }

    /**
     * @function scene_load
     * @description Loads the available game objects from the server
     * @returns {Scene} A promise that resolves to a new scene
     */
    load_game_objects = async function load_game_objects() {
        let path = "/game/game_objects/";
        // Add all the game objects to the scene
        for (let i = 0; i < this.gameObjects_meta.length; i++) {
            let module_name = this.gameObjects_meta[i].name;
            await this.load_class_file(module_name, path);

            this.gameObjects[i] = new this.modules[module_name]({
                ...this.gameObjects_meta[i],
                ...{                
                    scene: this,
                }
            });
        }
    }

    // load_background = async function load_background() {
    //     if (this.backgrounds_meta.type = "parallax") {
    //         return new ParallaxBackground(this.backgrounds_meta);
    //     }
    // }
}

// Export the class
export { Scene };