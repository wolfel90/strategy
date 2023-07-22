import { CanvasRenderingOptions } from "../utils/canvas/CanvasRenderingOptions";
import { WorldElementContainer } from "./elements/WorldElementContainer";
import { Vector2f } from "../utils/geom/Vector2f";
import { WorldViewport } from "./utils/WorldViewport";
import { Angle1f } from "../utils/geom/Angle1f";

export class WorldLayer extends WorldElementContainer {
    private _name: string;
    public get name() {
        return this._name;
    }

    constructor(name: string) {
        super();
        this._name = name;
    }

    public render(
        ctx: CanvasRenderingContext2D,
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ) {
        this.renderChildren(ctx, viewport, origin, orientation, options);
    }
}
