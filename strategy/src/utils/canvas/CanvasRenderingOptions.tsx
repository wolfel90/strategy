import { CullingOptions } from "./CullingOptions";
import { WorldElement } from "../../world/elements/WorldElement";

export type CanvasRenderingOptions = {
    cullingOptions?: CullingOptions | null | undefined;
    drawBoundingBox?: ((element: WorldElement) => boolean) | null | undefined;
};

/* export default class CanvasRenderingOptions {
    public cullingOptions: CullingOptions | null | undefined;
    public drawBoundingBox:
        | ((element: WorldElement) => boolean)
        | null
        | undefined;

    constructor(options: {
        cullingOptions?: CullingOptions;
        drawBoundingBox?: (element: WorldElement) => boolean;
    }) {
        this.cullingOptions = options.cullingOptions ?? null;
        this.drawBoundingBox = options.drawBoundingBox ?? null;
    }
} */
