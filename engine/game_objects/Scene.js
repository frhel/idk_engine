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

        // Default values
        this.ctx = this.canvas.getContext('2d');
        this.gameObjects = [];

        this.frame = 0;
        this.time_to_frame = 0;
        this.frame_time = 0;
        this.fps = 30;

        return this;
    }

    add_object(obj) {
        this.gameObjects.push(obj);
    }
}

// Export the class
export { Scene };