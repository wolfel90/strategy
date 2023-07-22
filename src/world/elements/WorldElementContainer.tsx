import { Angle1f } from "../../utils/geom/Angle1f";
import { CanvasRenderingOptions } from "../../utils/canvas/CanvasRenderingOptions";
import { WorldElement } from "./WorldElement";
import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldViewport } from "../utils/WorldViewport";

/** Abstract class for objects capable of containing World Elements */
export abstract class WorldElementContainer {
    private _id: string = crypto.randomUUID();
    public get id(): string {
        return this._id;
    }

    protected _children: WorldElement[] = [];
    get children(): WorldElement[] {
        return this._children;
    }

    /** Adds child element to the end of this container's children, if that child is not already present. Returns true if child is added. */
    public addChild(child: WorldElement): boolean {
        if (!this._children.includes(child)) {
            this._children.push(child);
            if (child.parent !== null) {
                child.parent.removeChild(child);
            }
            child.parent = this;
            return true;
        }
        return false;
    }

    /** Adds child element to this container's children, at the specified index, if that child is not already present. If index is out of bounds,
     * it will be clamped to the appropriate value. Returns the index the child can be found at after this operation. */
    public addChildAt(child: WorldElement, index: number): number {
        let foundIndex = this._children.findIndex((c) => c === child);
        if (foundIndex >= 0) {
            return foundIndex;
        }

        let actualIndex =
            index < 0
                ? 0
                : index >= this._children.length
                ? this._children.length
                : index;
        if (actualIndex === 0) {
            this._children = [child, ...this._children];
        } else if (actualIndex === this._children.length) {
            this._children.push(child);
        } else {
            this._children = [
                ...this._children.slice(0, actualIndex),
                child,
                ...this._children.slice(actualIndex),
            ];
        }
        if (child.parent !== null) {
            child.parent.removeChild(child);
        }
        child.parent = this;

        return actualIndex;
    }

    /** Remove child element, if it exists. Returns true if child is removed. */
    public removeChild(child: WorldElement): boolean {
        if (this._children.includes(child)) {
            this._children = this._children.filter((c) => c !== child);
            return true;
        }
        return false;
    }

    /** Returns the world element in this container's children matching the provided ID, if it is found, null otherwise. If searchNested is true, grandchildren, etc. will be included in the search. */
    public findChildElementByID(
        id: string,
        searchNested: boolean = true
    ): WorldElementContainer | null {
        for (let i = 0; i < this._children.length; ++i) {
            if (this._children[i].id === id) {
                return this._children[i];
            } else if (searchNested) {
                return this._children[i].findChildElementByID(id, searchNested);
            }
        }
        return null;
    }

    /** Iterate through the children, in index-order, and call each of their draw functions. */
    public renderChildren(
        ctx: CanvasRenderingContext2D,
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ) {
        this._children.forEach((child) => {
            child.render(ctx, viewport, origin, orientation, options);
        });
    }
}
