import { Vector2f } from "../../utils/geom/Vector2f";

export class WorldInputMouseEvent {
    public altKey: boolean;
    public ctrlKey: boolean;
    public shiftKey: boolean;
    public button: number;
    public point: Vector2f;
    public movement: Vector2f;
    public delta: number;

    constructor(
        point: Vector2f,
        button: number,
        altKey: boolean = false,
        ctrlKey: boolean = false,
        shiftKey: boolean = false,
        movement: Vector2f = new Vector2f(),
        delta: number = 0
    ) {
        this.point = point;
        this.button = button;
        this.altKey = altKey;
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.movement = movement;
        this.delta = delta;
    }
}
