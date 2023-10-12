class GameObject {
    /**
     * @class GameObject
     * @classdesc A game object.
     * @abstract - Do not instantiate this class directly
     * @param {Object} props - Object containing all the props for a game Object
     * @param {Scene} props.scene - The scene the game Object belongs to
     * @param {Number} [props.x] - The x coordinate of the game Object. Defaults to 0
     * @param {Number} [props.y] - The y coordinate of the game Object. Defaults to 0
     * @param {Number} [props.w] - The width of the game Object. Defaults to 600
     * @param {Number} [props.h] - The height of the game Object. Defaults to 600
     * @param {Number} [props.size] - The size of the game Object. If w and h are not defined, this will be used for both
     */
    constructor(
        {
            name,
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            size = 600,
            scene,
            collisions = false,
        }
    ) {
        this.name = name;

        this.x = x;
        this.y = y;
        this.width  = width || size;
        this.height = height || size;
        
        this.ctx = scene.ctx;
        this.canvas = scene.canvas;
        this.scene = scene;

        this.collisions = collisions;

        // Set default values
        this.speed = 0;
        this.dir = "s"; // 'u', 'd', 'l', 'r' for up, down, left, right and 's' for stationary
        
        return this;
    }

    /**
     * Move the sprite in a direction
     * @param {String} dir - 'u', 'd', 'l', 'r' for up, down, left, right
     */
    move(dir) {
        switch (dir) {
            case "u":
                this.y -= this.speed;
                break;
            case "d":
                this.y += this.speed;
                break;
            case "l":
                this.x -= this.speed;
                break;
            case "r":
                this.x += this.speed;
                break;
        }
    }
}

// Export the class
export { GameObject };