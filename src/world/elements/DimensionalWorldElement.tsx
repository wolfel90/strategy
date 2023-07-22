import { Angle1f } from "../../utils/geom/Angle1f";
import { CanvasRenderingOptions } from "../../utils/canvas/CanvasRenderingOptions";
import { CullingOptionEnum } from "../../utils/canvas/CullingOptions";
import { Rectangle2f } from "../../utils/geom/Rectangle2f";
import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldElementContainer } from "./WorldElementContainer";
import { WorldElement } from "./WorldElement";
import { WorldViewport } from "../utils/WorldViewport";

/** A World Element with a width and height. */
export class DimensionalWorldElement extends WorldElement {
    private _baseSize: Vector2f;
    private _scale: Vector2f;
    private _bounds: Rectangle2f;

    /** Get the size of the element, after applying its current scale. */
    public get sizeUnscaled(): Vector2f {
        return this._baseSize;
    }
    public get sizeScaled(): Vector2f {
        return this._baseSize.scaleVector(this._scale);
    }
    /** Reset the base size of the element. Actual size is also dependent on the element's scale. */
    public set size(size: Vector2f) {
        this._baseSize = size;
        this.refreshBounds();
    }
    public get scale(): Vector2f {
        return this._scale;
    }
    public set scale(scale: Vector2f) {
        this._scale = scale;
        this.refreshBounds();
    }
    public override get bounds(): Rectangle2f {
        return this._bounds;
    }

    constructor(
        position: Vector2f = new Vector2f(),
        size: Vector2f = new Vector2f(1, 1),
        scale: Vector2f = new Vector2f(1, 1),
        rotation: Angle1f = new Angle1f()
    ) {
        super(position);

        this._baseSize = size;
        this._scale = scale;
        this._rotation = rotation;

        const s = this.sizeScaled;
        this._bounds = Rectangle2f.fromOriginAndDimensions(
            position.x - s.x / 2,
            position.y - s.y / 2,
            s.x,
            s.y
        );
    }

    public refreshBounds() {
        const s = this.sizeScaled;
        this._bounds = Rectangle2f.fromOriginAndDimensions(
            this._position.x - s.x / 2,
            this._position.y - s.y / 2,
            s.x,
            s.y
        );
    }

    public translate(vector: Vector2f) {
        if (vector.magnitude > 0) {
            this._position = this._position.translate(vector);
        }
        this.refreshBounds();
    }

    public translateTo(vector: Vector2f) {
        this._position = vector;
        this.refreshBounds();
    }

    public override shouldRender(
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ): boolean {
        return (
            options?.canvasRenderingOptions?.cullingOptions?.includes(
                CullingOptionEnum.RENDER_OUTSIDE_VIEWPORT
            ) ||
            (origin ? this.bounds.translate(origin) : this.bounds).overlaps(
                viewport.bounds
            )
        );
    }

    public getRenderBoundsForViewport(
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ): Rectangle2f {
        /* return viewport.worldRectToScreenRect(
            origin ? this.bounds.translate(origin) : this.bounds
        ); */
        if (origin == null || origin.isZero()) {
            return viewport.worldRectToScreenRect(this.bounds);
        } else {
            if (
                orientation != null &&
                orientation !== Vector2f.IdentityVector
            ) {
                const newCenter = origin.translateOriented(
                    this._position,
                    orientation
                );
                return viewport.worldRectToScreenRect(
                    Rectangle2f.fromOriginAndDimensions(
                        newCenter.x - this.sizeScaled.x / 2,
                        newCenter.y - this.sizeScaled.y / 2,
                        this.sizeScaled.x,
                        this.sizeScaled.y
                    )
                );
                /* return viewport.worldRectToScreenRect(
                    this.bounds.translateOriented(origin, orientation)
                ); */
            } else {
                return viewport.worldRectToScreenRect(
                    this.bounds.translate(origin)
                );
            }
        }
        /* return viewport.worldRectToScreenRect(
            orientation ? (origin ?? new Vector2f()).translateOriented(this.bounds, orientation) : (origin ?? new Vector2f()).translate(this.bounds)
        ); */
    }

    protected override drawBoundingBox(
        ctx: CanvasRenderingContext2D,
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions },
        precalculatedRect: Rectangle2f | null = null
    ): void {
        const rect =
            precalculatedRect === null
                ? this.getRenderBoundsForViewport(
                      viewport,
                      origin,
                      orientation,
                      options
                  )
                : precalculatedRect;

        ctx.translate(rect.center.x, rect.center.y);
        ctx.rotate(this.rotation.angleRadians);
        ctx.strokeStyle = this.boundingBoxColor;
        ctx.strokeRect(
            -rect.width / 2,
            -rect.height / 2,
            rect.width,
            rect.height
        );
        ctx.rotate(-this.rotation.angleRadians);
        ctx.translate(-rect.center.x, -rect.center.y);
    }

    /** Performs the rendering operation specific to this element. */
    protected override renderSelf(
        ctx: CanvasRenderingContext2D,
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ) {
        if (options?.canvasRenderingOptions?.drawBoundingBox != null) {
            if (options.canvasRenderingOptions.drawBoundingBox(this)) {
                const rect = this.shouldRender(
                    viewport,
                    origin,
                    orientation,
                    options
                )
                    ? this.getRenderBoundsForViewport(
                          viewport,
                          origin,
                          orientation,
                          options
                      )
                    : null;

                if (rect !== null) {
                    this.drawBoundingBox(
                        ctx,
                        viewport,
                        origin,
                        orientation,
                        options,
                        rect
                    );
                }
            }
        }
    }
}
