import { BackgroundLayer } from "./BackgroundLayer.js";

class Parallax {
    constructor() {
        this.layers = [];
    }

    add_layer(layer) {
        this.layers.push(layer);
    }

    update() {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].update();
        }
    }

    render() {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].render();
        }
    }
}