import { Ray2f } from "./Ray2f";
import { Vector2f } from "./Vector2f";

export class Line2f extends Ray2f {
    private _length: number;

    public get length(): number {
        return this._length;
    }
    public set length(length: number) {
        this._length = length;
    }

    public get end(): Vector2f {
        return this.origin.translate(this.direction.scale(this.length));
    }
    public set end(end: Vector2f) {
        const diff = this._origin.vectorTo(end);
        this._direction = diff;
        this._length = diff.magnitude;
    }

    constructor(
        origin: Vector2f = new Vector2f(),
        end: Vector2f = new Vector2f()
    ) {
        const diff = origin.vectorTo(end);
        super(origin, diff);
        this._length = diff.magnitude;
    }

    public static fromRayAndLength(ray: Ray2f, length: number) {
        return new Line2f(ray.origin, ray.direction.scale(length));
    }
}
