import { Rectangle2f } from "../../utils/geom/Rectangle2f";
import { Vector2f } from "../../utils/geom/Vector2f";

export class WorldViewport {
    private _bounds: Rectangle2f;
    private _canvasDimensions: Vector2f;
    private _scalar: Vector2f;

    public get bounds(): Rectangle2f {
        return this._bounds;
    }
    public set bounds(bounds: Rectangle2f) {
        this._bounds = bounds;
        this._scalar = this.calculateScalar();
    }

    public get canvasDimensions(): Vector2f {
        return this._canvasDimensions;
    }
    public set canvasDimensions(canvasDimensions: Vector2f) {
        this._canvasDimensions = canvasDimensions;
        this._scalar = this.calculateScalar();
    }

    public get scalar(): Vector2f {
        return this._scalar;
    }

    private calculateScalar(): Vector2f {
        return new Vector2f(
            this._canvasDimensions.x /
                (this._bounds.width === 0
                    ? 0.0000000000000001
                    : this._bounds.width),
            this._canvasDimensions.y /
                (this._bounds.height === 0
                    ? 0.0000000000000001
                    : this._bounds.height)
        );
    }

    constructor(bounds: Rectangle2f, canvasDimensions?: Vector2f) {
        this._bounds = bounds;
        this._canvasDimensions =
            canvasDimensions ?? new Vector2f(bounds.width, bounds.height);
        this._scalar = this.calculateScalar();
    }

    public translate(vec: Vector2f) {
        this._bounds = this._bounds.translate(vec);
    }

    public translateXY(x: number, y: number) {
        this._bounds = this._bounds.translateXY(x, y);
    }

    public worldRectToScreenRect(rect: Rectangle2f): Rectangle2f {
        return Rectangle2f.fromOriginAndDimensions(
            this.worldXToScreenX(rect.x),
            this.worldYToScreenY(rect.top),
            rect.width * this._scalar.x,
            rect.height * this._scalar.y
        );
    }

    public screenRectToWorldRect(rect: Rectangle2f): Rectangle2f {
        return Rectangle2f.fromOriginAndDimensions(
            this.screenXToWorldX(rect.x),
            this.screenYToWorldY(rect.top),
            rect.width * this._scalar.x,
            rect.height * this._scalar.y
        );
    }

    public worldVecToScreenVec(vec: Vector2f): Vector2f {
        return new Vector2f(
            this.worldXToScreenX(vec.x),
            this.worldYToScreenY(vec.y)
        );
    }

    public screenVecToWorldVec(vec: Vector2f): Vector2f {
        return new Vector2f(
            this.screenXToWorldX(vec.x),
            this.screenYToWorldY(vec.y)
        );
    }

    public worldXToScreenX(x: number): number {
        return (x - this._bounds.x) * this._scalar.x;
    }

    public screenXToWorldX(x: number): number {
        return x / this._scalar.x + this._bounds.x;
    }

    public worldYToScreenY(y: number): number {
        return (this._bounds.height - y + this._bounds.y) * this._scalar.y;
    }

    public screenYToWorldY(y: number): number {
        return -(y / this._scalar.y - this._bounds.height - this._bounds.y);
    }
}
