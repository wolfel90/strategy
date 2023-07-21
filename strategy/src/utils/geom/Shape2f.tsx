import { Angle1f } from "./Angle1f";
import { Rectangle2f } from "./Rectangle2f";
import { Vector2f } from "./Vector2f";

export class Shape2f {
    private _position: Vector2f;
    private _vertices: Array<Vector2f>;
    private _scale: Vector2f;
    private _rotation: Angle1f;
    readonly bounds: Rectangle2f;

    public get position(): Vector2f {
        return this._position;
    }
    public set position(pos: Vector2f) {
        this._position = pos;
    }

    public get vertices(): Array<Vector2f> {
        return this._vertices;
    }
    public set vertices(vertices: Array<Vector2f>) {
        this._vertices = vertices;
        this.calculateBoundingBox();
    }

    public get scale(): Vector2f {
        return this._scale;
    }
    public set scale(scale: Vector2f) {
        this._scale = scale;
        this.calculateBoundingBox();
    }

    public get rotation(): Angle1f {
        return this._rotation;
    }
    public set rotation(rotation: Angle1f) {
        this._rotation = rotation;
        this.calculateBoundingBox();
    }

    public get boundingBox(): Rectangle2f {
        return this.bounds;
    }

    constructor(
        position: Vector2f = new Vector2f(),
        vertices: Array<Vector2f> = [],
        scale: Vector2f = new Vector2f(1, 1),
        rotation: Angle1f = new Angle1f()
    ) {
        this._position = position;
        this._vertices = vertices;
        this._scale = scale;
        this._rotation = rotation;
        this.bounds = this.calculateBoundingBox();
    }

    private calculateBoundingBox(): Rectangle2f {
        let minX = Number.MAX_VALUE,
            minY = Number.MAX_VALUE,
            maxX = Number.MIN_VALUE,
            maxY = Number.MIN_VALUE;
        let verts = [...this._vertices];

        for (let i = 0; i < verts.length; ++i) {
            verts[i] = verts[i].scaleVector(this._scale);
            if (this._rotation !== Angle1f.IdentityAngle) {
                verts[i] = verts[i].rotate(this._rotation);
            }
        }

        this._vertices.forEach((vertex) => {
            if (vertex.x < minX) {
                minX = vertex.x;
            }
            if (vertex.y < minY) {
                minY = vertex.y;
            }

            if (vertex.x > maxX) {
                maxX = vertex.x;
            }
            if (vertex.y > maxY) {
                maxY = vertex.y;
            }
        });

        return Rectangle2f.fromCoords(minX, minY, maxX, maxY);
    }

    public translate(vector: Vector2f) {
        if (vector.magnitude > 0) {
            this._position = this._position.translate(vector);
        }
    }
}
