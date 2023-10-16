class BackgroundLayer {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.image = new Image();
    }

    update() {
        this.x -= 0.5;
        if (this.x < -this.width) {
            this.x = 0;
        }
    }

    render(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}