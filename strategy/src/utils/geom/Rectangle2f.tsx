import { Vector2f } from "./Vector2f";

export class Rectangle2f {
    readonly position: Vector2f;
    readonly size: Vector2f;

    public get x(): number {
        return this.position.x;
    }
    public get y(): number {
        return this.position.y;
    }
    public get width(): number {
        return this.size.x;
    }
    public get height(): number {
        return this.size.y;
    }
    public get right(): number {
        return this.position.x + this.size.x;
    }
    public get top(): number {
        return this.position.y + this.size.y;
    }

    public get topRight(): Vector2f {
        return new Vector2f(this.right, this.top);
    }

    static fromOriginAndDimensions(
        x: number,
        y: number,
        width: number,
        height: number
    ): Rectangle2f {
        return new Rectangle2f(new Vector2f(x, y), new Vector2f(width, height));
    }

    static fromCoords(x1: number, y1: number, x2: number, y2: number) {
        return new Rectangle2f(
            new Vector2f(x1, y1),
            new Vector2f(x2 - x1, y2 - y1)
        );
    }

    constructor(position: Vector2f, size: Vector2f) {
        this.position = position;
        this.size = size;
    }

    public translate(vec: Vector2f): Rectangle2f {
        return new Rectangle2f(this.position.translate(vec), this.size);
    }

    public translateXY(x: number = 0.0, y: number = 0.0): Rectangle2f {
        return new Rectangle2f(this.position.translateXY(x, y), this.size);
    }

    public translateOriented(
        vec: Vector2f,
        orientation: Vector2f = Vector2f.IdentityVector
    ): Rectangle2f {
        const newOrigin = this.center.translateOriented(vec, orientation);
        return Rectangle2f.fromOriginAndDimensions(
            newOrigin.x - this.width / 2,
            newOrigin.y - this.height / 2,
            this.width,
            this.height
        );
    }

    public resize(width: number, height: number): Rectangle2f {
        return new Rectangle2f(
            new Vector2f(this.position.x, this.position.y),
            new Vector2f(width, height)
        );
    }

    public scale(ratio: number): Rectangle2f {
        const center = this.center;
        return Rectangle2f.fromOriginAndDimensions(
            center.x - this.width * ratio * 0.5,
            center.y - this.height * ratio * 0.5,
            this.width * ratio,
            this.height * ratio
        );
    }

    public focalScale(ratio: number, focalPoint: Vector2f): Rectangle2f {
        const diffVector = this.position.vectorTo(focalPoint);
        //const center = this.center;
        return Rectangle2f.fromOriginAndDimensions(
            focalPoint.x - this.width * ratio * (diffVector.x / this.width),
            focalPoint.y - this.height * ratio * (diffVector.y / this.height),
            this.width * ratio,
            this.height * ratio
        );
    }

    public scaleByVector(vec: Vector2f) {
        const center = this.center;
        return Rectangle2f.fromOriginAndDimensions(
            center.x - this.width * vec.x * 0.5,
            center.y - this.height * vec.y * 0.5,
            this.width * vec.x,
            this.height * vec.y
        );
    }

    public get center(): Vector2f {
        return new Vector2f(
            this.position.x + this.size.x / 2,
            this.position.y + this.size.y / 2
        );
    }

    public contains(point: Vector2f): boolean {
        return (
            point.x >= this.position.x &&
            point.x <= this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y <= this.position.y + this.size.y
        );
    }

    public overlaps(rect: Rectangle2f): boolean {
        if (
            (this.x < rect.x && this.right < rect.x) ||
            (this.x > rect.right && this.right > rect.right)
        ) {
            return false;
        }

        if (
            (this.y < rect.y && this.top < rect.y) ||
            (this.y > rect.top && this.top > rect.top)
        ) {
            return false;
        }

        return true;
    }
}
