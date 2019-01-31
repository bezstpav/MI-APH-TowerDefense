import Component from '../engine/Component';

/**
 * Component for mouse-input handling
 */
export class MouseInputComponent extends Component {
    private canvas: HTMLCanvasElement;
    public x?: number;
    public y?: number;

    onInit() {
        this.canvas = (document.getElementById("gameCanvas") as HTMLCanvasElement);
        this.canvas.addEventListener("mousedown", this.onDown.bind(this), false);
        document.addEventListener("mouseup", this.onUp.bind(this), false);
    }

    onRemove() {
        this.canvas.removeEventListener("mousedown", this.onDown.bind(this));
        document.removeEventListener("mouseup", this.onUp.bind(this));
    }

    private onDown(evt: MouseEvent) {
        this.x = evt.pageX - this.canvas.offsetLeft;
        this.y = evt.pageY - this.canvas.offsetTop;
    }

    private onUp(evt: MouseEvent){
        this.x = undefined;
        this.y = undefined;
    }
}