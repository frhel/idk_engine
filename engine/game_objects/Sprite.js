import { GameObject } from "./GameObject.js";

class Sprite extends GameObject {
    /**
     * @class Sprite
     * @extends GameObject
     * @classdesc A sprite game object class.
     * @param {Object} props - Object containing all the props for a game object plus an image and the number of frames     
     * @param {String} props.image - The image to use for the sprite
     * @param {Number} [props.spriteWidth] - The width of the sprite. Defaults to the width of the image
     */    
    constructor(props) {
        super(props);
        this.image = new Image();
        this.image.src = props.image;
        // Get the metadata from the image

        this.spriteWidth = Math.ceil(props.width / props.cols);
        this.spriteHeight = Math.ceil(props.height / props.rows);
        this.dx = props.dx || 0;
        this.dy = props.dy || 0;
        this.dw = this.spriteWidth;
        this.dh = this.spriteHeight;
        
        this.base_animation_speed = props.base_animation_speed || 5;
        this.animations = props.animations;

        this.generate_frame_list();

        this.set_animation("idle");

        return this;
    }

    get_animation_list() {
        return this.animations.map((anim) => anim.name);
    }

    set_animation(animation) {
        if (!this.get_animation_list().includes(animation)) {
            return;
        }

        this.curr_animation = this.animations.filter((anim) => anim.name === animation)[0];
        this.curr_animation.speed = this.curr_animation.speed || this.base_animation_speed;        
    }

    generate_frame_list() {
        this.get_animation_list().forEach((_, idx) => {
            let frames = {
                loc: [], // {x, y}
            }
            for (let i = 0; i < this.animations[idx].frames; i++) {
                frames.loc.push({col: this.spriteWidth * i, row: idx * this.spriteHeight});
            }
            this.animations[idx].frames = frames;
        });
    }

    /**
     * Update the sprite's frame index and calculate the next frame
     */
    update() {
        this.#draw();
    }

    /**
     * Draw the sprite to the canvas
     */
    #draw() {
        // Calculate when to change frames
        let frame_loc = (
            Math.floor(this.scene.frame/this.curr_animation.speed) 
            % this.curr_animation.frames.loc.length
        )
        
        // Draw the sprite
        this.ctx.drawImage(
            this.image,
            this.curr_animation.frames.loc[frame_loc].col,
            this.curr_animation.frames.loc[frame_loc].row,
            this.spriteWidth,
            this.spriteHeight,
            this.dx,
            this.dy,
            this.dw,
            this.dh
        );
    }    
}

// Export the class
export { Sprite };