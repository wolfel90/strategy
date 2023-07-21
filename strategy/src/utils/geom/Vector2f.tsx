import { Angle1f } from "./Angle1f";
import { AngleType } from "./Angle1f";

export class Vector2f {
    public static IdentityVector: Vector2f = new Vector2f(0, 1);

    readonly x: number;
    readonly y: number;

    public get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    constructor(x: number = 0.0, y: number = 0.0) {
        this.x = x;
        this.y = y;
    }

    public translate(vec: Vector2f): Vector2f {
        return new Vector2f(this.x + vec.x, this.y + vec.y);
    }

    public translateXY(x: number, y: number): Vector2f {
        return new Vector2f(this.x + x, this.y + y);
    }

    /** Returns a new vector that results from translating this vector along the provided "up" orientation vector. */
    public translateOriented(
        vec: Vector2f,
        orientation: Vector2f = Vector2f.IdentityVector
    ): Vector2f {
        return this.translate(orientation.scaleNormalized(vec.x)).translate(
            orientation.perpendicular().scaleNormalized(vec.y)
        );
    }

    public translateOrientedXY(
        x: number,
        y: number,
        orientation: Vector2f = Vector2f.IdentityVector
    ) {
        return this.translate(orientation.scaleNormalized(x)).translate(
            orientation.perpendicular().scaleNormalized(y)
        );
    }

    public subtract(vec: Vector2f): Vector2f {
        return new Vector2f(this.x - vec.x, this.y - vec.y);
    }

    public invert(): Vector2f {
        return new Vector2f(-this.x, -this.y);
    }

    public angle(vec: Vector2f): Angle1f {
        return new Angle1f(Math.acos(this.dot(vec)), "RADIANS");
    }

    public dot(vec: Vector2f): number {
        return this.x * vec.x + this.y * vec.y;
    }

    /** Returns a new vector that runs perpendicular to this one. */
    public perpendicular(): Vector2f {
        return new Vector2f(-this.y, this.x);
    }

    public normalize(): Vector2f {
        if (this.x === 0 && this.y === 0) {
            return new Vector2f(0, 0);
        } else {
            const mag = this.magnitude;
            return new Vector2f(this.x / mag, this.y / mag);
        }
    }

    public isZero(): boolean {
        return this.x === 0 && this.y === 0;
    }

    public isNormalized(): boolean {
        return this.magnitude === 1;
    }

    public scale(scalar: number): Vector2f {
        return new Vector2f(this.x * scalar, this.y * scalar);
    }

    /** Returns a vector that is the result of normalizing this vector and then scaling it by the provided scalar. */
    public scaleNormalized(scalar: number): Vector2f {
        if (this.x === 0 && this.y === 0) {
            return new Vector2f(0, 0);
        } else {
            const mag = this.magnitude;
            return new Vector2f(
                (this.x / mag) * scalar,
                (this.y / mag) * scalar
            );
        }
    }

    public scaleVector(scalar: Vector2f) {
        return new Vector2f(this.x * scalar.x, this.y * scalar.y);
    }

    /** Returns a vector that is the result of normalizing this vector and then scaling it by the provided scalar vector. */
    public scaleVectorNormalized(scalar: Vector2f) {
        if (this.x === 0 && this.y === 0) {
            return new Vector2f(0, 0);
        } else {
            const mag = this.magnitude;
            return new Vector2f(
                (this.x / mag) * scalar.x,
                (this.y / mag) * scalar.y
            );
        }
    }

    public rotate(angle: Angle1f): Vector2f {
        return this.toAngle().rotateByValue(-angle.angle).toVector();
    }

    public distance(target: Vector2f): number {
        return Math.sqrt(
            Math.pow(Math.abs(target.x - this.x), 2) +
                Math.pow(Math.abs(target.y - this.y), 2)
        );
    }

    public vectorTo(target: Vector2f): Vector2f {
        return new Vector2f(target.x - this.x, target.y - this.y);
    }

    public toString(): string {
        return `Vector2f(${this.x}, ${this.y})`;
    }

    public toAngle(): Angle1f {
        return new Angle1f(Math.atan2(this.y, this.x));
    }
}
