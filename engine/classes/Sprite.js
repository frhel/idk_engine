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

        this.dw = this.spriteWidth / props.size;
        this.dh = this.spriteHeight / props.size;
        
        this.base_animation_speed = (props.base_animation_speed || 5);
        this.animations = props.animations;
        this.curr_animation = props.curr_animation || null;
        this.animations_list = this.animations.map((anim) => anim.name);
        this.generate_frame_list();        
        this.set_animation(this.curr_animation);

        return this;
    }

    /**
     * @function set_animation
     * @description Set the current animation for the sprite
     * @param {String} animation - The name of the animation to set
     * @memberof Sprite
     * @todo Add a check to make sure the animation is not already set
     */
    set_animation(animation) {
        if (animation == null) {console.error("No animation provided. Check that props.curr_animation is set in child object"); return;}
        if (!this.animations_list.includes(animation)) return;
        this.curr_animation = this.animations.filter((anim) => anim.name === animation)[0];
        this.curr_animation.speed = this.curr_animation.speed || this.base_animation_speed;        
    }

    /**
     * @function cycle_animation
     * @description Cycle to the next animation in the list
     * @param {String} dir - The direction to cycle the animation. 'next' or 'prev'
     * @memberof Sprite
     * @todo Add a check to make sure the animation list is not empty
     */
    cycle_animation(dir) {        
        let mod = dir === 'next' ? 1 : -1;
        let next_animation = (this.curr_animation.index + mod) % this.animations_list.length < 0 
                             ? this.animations_list.length - 1 
                             : (this.curr_animation.index + mod) % this.animations_list.length;
        this.set_animation(this.animations_list[next_animation]);
    }

    /**
     * @function generate_frame_list
     * @description Generate a list of frames for each animation
     * @memberof Sprite
     * @todo Add a check to make sure the animation list is not empty
     * @todo Add a check to make sure the frames property is not already set
     * @todo Save frame lists to the scene so that we don't have to generate them for each sprite of the same type
     */
    generate_frame_list() {
        this.animations_list.forEach((_, idx) => {
            let frames = {
                loc: [], // {x, y}
            }
            for (let i = 0; i < this.animations[idx].frames; i++) {
                frames.loc.push({col: this.spriteWidth * i, row: idx * this.spriteHeight});
            }
            this.animations[idx].frames = frames;
            this.animations[idx].index = idx;
        });
    }

    /**
     * @function update
     * @description Perform any updates to the sprite such as moving it, changing animations, drawing the next frame, etc.
     * @memberof Sprite
     */
    update() {
        this.#draw();
    }

    /**
     * @function draw
     * @description Draw the sprite to the canvas
     * @memberof Sprite
     *  
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