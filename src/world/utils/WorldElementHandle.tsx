import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldElement } from "../elements/WorldElement";

export class WorldElementHandle {
    private _element: WorldElement;
    public get element() {
        return this._element;
    }
    private _position: Vector2f;
    public get position() {
        return this._position;
    }

    constructor(element: WorldElement, position: Vector2f) {
        this._element = element;
        this._position = position;
    }

    public translate(vector: Vector2f) {
        if (vector.magnitude > 0) {
            this._position = this._position.translate(vector);
            this._element.translate(vector);
        }
    }
}
