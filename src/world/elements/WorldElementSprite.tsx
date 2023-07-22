import { Angle1f } from "../../utils/geom/Angle1f";
import { CanvasRenderingOptions } from "../../utils/canvas/CanvasRenderingOptions";
import { CullingOptionEnum } from "../../utils/canvas/CullingOptions";
import { DimensionalWorldElement } from "./DimensionalWorldElement";
import { ImageLibrary } from "../../utils/resources/images/ImageLibrary";
import { ImageLoader } from "../../utils/resources/images/ImageLoader";
import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldElement } from "./WorldElement";
import { WorldViewport } from "../utils/WorldViewport";

export class WorldElementSprite extends DimensionalWorldElement {
    protected _spriteSrc: string = "";
    public get spriteSrc(): string {
        return this._spriteSrc;
    }

    constructor(
        spriteSrc: string,
        position: Vector2f = new Vector2f(),
        size: Vector2f = new Vector2f(1, 1),
        scale: Vector2f = new Vector2f(1, 1),
        rotation: Angle1f = new Angle1f()
    ) {
        super(position, size, scale, rotation);
        this.setSpriteSrc(spriteSrc);
    }

    public setSpriteSrc(spriteSrc: string) {
        this._spriteSrc = spriteSrc;
        if (ImageLibrary.hasKey(spriteSrc)) {
            ImageLibrary.addReference(spriteSrc, this.id);
        } else {
            ImageLoader.loadImageToLibrary(spriteSrc, this.id);
        }
    }

    protected override renderSelf(
        ctx: CanvasRenderingContext2D,
        viewport: WorldViewport,
        origin?: Vector2f | null,
        orientation?: Vector2f | null,
        options?: { canvasRenderingOptions?: CanvasRenderingOptions }
    ) {
        const rect = this.shouldRender(viewport, origin, orientation, options)
            ? this.getRenderBoundsForViewport(
                  viewport,
                  origin,
                  orientation,
                  options
              )
            : null;
        if (rect !== null) {
            if (
                this._spriteSrc !== null &&
                ImageLibrary.hasKey(this._spriteSrc)
            ) {
                const img = ImageLibrary.getImage(this._spriteSrc);
                if (img !== null) {
                    ctx.translate(rect.center.x, rect.center.y);
                    if (this.rotation.angle !== 0) {
                        ctx.rotate(this.rotation.angleRadians);
                    }
                    ctx.drawImage(
                        img,
                        -rect.width / 2,
                        -rect.height / 2,
                        rect.width,
                        rect.height
                    );
                    if (this.rotation.angle !== 0) {
                        ctx.rotate(-this.rotation.angleRadians);
                    }
                    ctx.translate(-rect.center.x, -rect.center.y);
                }
            }
        }

        super.renderSelf(ctx, viewport, origin, orientation, options);
    }
}
