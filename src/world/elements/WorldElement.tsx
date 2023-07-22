import { CanvasRenderingOptions } from "../../utils/canvas/CanvasRenderingOptions";
import { CullingOptionEnum } from "../../utils/canvas/CullingOptions";
import { Angle1f } from "../../utils/geom/Angle1f";
import { Rectangle2f } from "../../utils/geom/Rectangle2f";
import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldViewport } from "../utils/WorldViewport";
import { WorldElementContainer } from "./WorldElementContainer";

/** The simplest version of a World Element, having a position, but only a fixed-point dimension. */
export class WorldElement extends WorldElementContainer {
    public static defaultBoundingBoxColor: string = "#ff0000";
    public locked: boolean = false;
    private _parent: WorldElementContainer | null = null;
    private _boundingBoxColor: string | null = null;
    protected _position: Vector2f;

    protected _rotation: Angle1f = new Angle1f();

    public get parent(): WorldElementContainer | null {
        return this._parent;
    }

    public set parent(parent: WorldElementContainer | null) {
        if (this._parent !== parent) {
            this._parent = parent;
        }
    }

    public get boundingBoxColor(): string {
        return this._boundingBoxColor ?? WorldElement.defaultBoundingBoxColor;
    }

    public get position(): Vector2f {
        return this._position;
    }

    get rotation(): Angle1f {
        return this._rotation;
    }
    set rotation(rotation: Angle1f) {
        this._rotation = rotation;
    }

    public get bounds(): Rectangle2f {
        return Rectangle2f.fromOriginAndDimensions(
            this._position.x - 0.5,
            this._position.y - 0.5,
            1,
            1
        );
    }

    constructor(position: Vector2f = new Vector2f()) {
        super();
        this._position = position;
    }

    public translate(vector: Vector2f) {
        if (vector.magnitude > 0) {
            this._position = this._position.translate(vector);
        }
    }

    public translateTo(vector: Vector2f) {
        this._position = vector;
    }

    public shouldRender(
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ): boolean {
        return (
            options?.canvasRenderingOptions?.cullingOptions?.includes(
                CullingOptionEnum.RENDER_OUTSIDE_VIEWPORT
            ) ||
            viewport.bounds.contains(
                origin ? this._position.translate(origin) : this._position
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
                        newCenter.x - 0.5,
                        newCenter.y - 0.5,
                        1,
                        1
                    )
                );
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

    protected drawBoundingBox(
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

        ctx.strokeStyle = this.boundingBoxColor;

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
    protected renderSelf(
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

    /** Calls this element's self-render function, then calls render for this element's children. This behavior is mostly universal: renderSelf should be overridden unless this pattern specifically needs to be changed. */
    public render(
        ctx: CanvasRenderingContext2D,
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ) {
        this.renderSelf(ctx, viewport, origin, orientation, options);

        this.renderChildren(
            ctx,
            viewport,
            origin
                ? orientation
                    ? origin.translateOriented(this._position, orientation)
                    : origin.translate(this._position)
                : orientation
                ? new Vector2f().translateOriented(this._position, orientation)
                : this._position,
            orientation
                ? orientation //.rotate(this._rotation)
                : Vector2f.IdentityVector.rotate(this._rotation),
            options
        );
    }
}
