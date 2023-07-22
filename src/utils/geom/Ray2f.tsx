import { Vector2f } from "./Vector2f";

export class Ray2f {
    protected _origin: Vector2f;
    protected _direction: Vector2f;

    public get origin(): Vector2f {
        return this._origin;
    }
    public set origin(origin: Vector2f) {
        this._origin = origin;
    }

    public get direction(): Vector2f {
        return this._direction;
    }
    public set direction(direction: Vector2f) {
        if (direction.x === 0 && direction.y === 0) {
            // Disallow non-direction
            this._direction = new Vector2f(1, 0);
        } else {
            this._direction = direction.normalize();
        }
    }

    public get slope(): number {
        if (this.direction.y === 0) {
            return 0;
        } else {
            if (this.direction.x === 0) {
                return this.direction.y / Number.MAX_SAFE_INTEGER;
            } else {
                return this.direction.y / this.direction.x;
            }
        }
    }

    public get yIntercept(): number {
        const s = this.slope;
        if (s === 0) {
            return this.origin.y;
        } else {
            return this.origin.y - s * this.origin.x;
        }
    }

    public get slopeAndYIntercept(): { slope: number; yIntercept: number } {
        const s = this.slope;
        if (s === 0) {
            return { slope: s, yIntercept: this.origin.y };
        } else {
            return { slope: s, yIntercept: this.origin.y - s * this.origin.x };
        }
    }

    constructor(
        origin: Vector2f = new Vector2f(),
        direction: Vector2f = new Vector2f(1, 0)
    ) {
        this._origin = origin;
        this._direction = direction;
    }

    public intersection(target: Ray2f): Vector2f | null {
        const sm1 = this.slopeAndYIntercept;
        const sm2 = target.slopeAndYIntercept;

        if (sm1.slope === sm2.slope) {
            return null;
        } else {
            const dx = target.origin.x - this.origin.x;
            const dy = target.origin.y - this.origin.y;
            const det =
                target.direction.x * this.direction.y -
                target.direction.y * this.direction.x;
            const u = (dy * target.origin.x - dx * target.origin.y) / det;
            const v = (dy * this.origin.x - dx * this.origin.y) / det;

            if (u < 0 || v < 0) {
                return null;
            }

            const x =
                (sm2.yIntercept - sm1.yIntercept) / (sm2.slope - sm1.slope);
            return new Vector2f(x, sm1.slope * x + sm1.yIntercept);
        }
    }

    public intersects(target: Ray2f): boolean {
        return this.intersection(target) !== null;
    }
}
