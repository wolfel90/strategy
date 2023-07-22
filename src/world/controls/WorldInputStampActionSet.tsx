import { Rectangle2f } from "../../utils/geom/Rectangle2f";
import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldContext } from "../WorldContext";
import { WorldInputActionSet } from "./WorldInputActionSet";
import { WorldInputMouseEvent } from "./WorldInputMouseEvent";
import { WorldElement } from "../elements/WorldElement";
import { WorldElementHandle } from "../utils/WorldElementHandle";
import { WorldElementSprite } from "../elements/WorldElementSprite";
import { WorldElementTemplate } from "../elements/WorldElementTemplate";
import { Angle1f } from "../../utils/geom/Angle1f";

export class WorldInputStampActionSet implements WorldInputActionSet {
    worldContext: WorldContext;

    private _stampElement: WorldElementSprite | null = null;
    private _stampScale: Vector2f = new Vector2f(1, 1);
    private _stampRotation: Angle1f = new Angle1f();

    constructor(
        worldContext: WorldContext,
        stampElement: WorldElementTemplate | null
    ) {
        this.worldContext = worldContext;
        this.updateStampElement(stampElement);
    }

    private updateStampElement(template: WorldElementTemplate | null): void {
        if (this._stampElement != null) {
            this.worldContext.activeLayer?.removeChild(this._stampElement);
        }

        if (template === null) {
            this._stampElement = null;
            return;
        }

        this._stampElement = new WorldElementSprite(
            template.spriteSrc ?? "",
            new Vector2f(),
            template.size,
            this._stampScale,
            this._stampRotation
        );

        this.worldContext.activeLayer?.addChild(this._stampElement);
    }

    activate(): void {
        if (this._stampElement !== null) {
            this.worldContext.activeLayer?.addChild(this._stampElement);
        }
    }

    deactivate(): void {
        if (this._stampElement !== null) {
            this.worldContext.activeLayer?.removeChild(this._stampElement);
        }
    }

    onControllerStampElementChange(
        template: WorldElementTemplate | null
    ): void {
        this.updateStampElement(template);
    }

    onWorldMouseClick(e: WorldInputMouseEvent): void {
        if (
            this.worldContext.activeLayer !== null &&
            this._stampElement != null &&
            !e.altKey
        ) {
            const element = new WorldElementSprite(
                this._stampElement.spriteSrc,
                e.point,
                this._stampElement.sizeUnscaled,
                this._stampScale,
                this._stampRotation
            );

            this.worldContext.activeLayer.addChild(element);
        }
    }

    onWorldMouseDown(e: WorldInputMouseEvent): void {}

    onWorldMouseUp(e: WorldInputMouseEvent): void {}

    onWorldMouseMove(e: WorldInputMouseEvent): void {
        if (this._stampElement != null) {
            console.log(
                this._stampElement?.position.x +
                    " : " +
                    this._stampElement?.position.y
            );
            this._stampElement.translateTo(e.point);
        }
    }

    onWorldMouseDragStart(e: WorldInputMouseEvent): void {}

    onWorldMouseDrag(e: WorldInputMouseEvent): void {
        if (e.altKey) {
            this.worldContext.activeViewport?.translate(e.movement.invert());
        }
    }

    onWorldMouseDragRelease(e: WorldInputMouseEvent): void {}

    onWorldMouseScroll(e: WorldInputMouseEvent): void {
        if (e.altKey) {
            if (this.worldContext.activeViewport !== null) {
                if (e.delta > 0) {
                    this.worldContext.activeViewport.bounds =
                        this.worldContext.activeViewport.bounds.focalScale(
                            1 + e.delta / 1000,
                            e.point
                        );
                } else if (e.delta < 0) {
                    this.worldContext.activeViewport.bounds =
                        this.worldContext.activeViewport.bounds.focalScale(
                            1 + e.delta / 1000,
                            e.point
                        );
                }
            }
        } else if (e.shiftKey) {
            if (e.delta > 0) {
                this._stampScale = this._stampScale.scale(0.9);
            } else if (e.delta < 0) {
                this._stampScale = this._stampScale.scale(1.1);
            }
            if (this._stampElement != null) {
                this._stampElement.scale = this._stampScale;
            }
        } else {
            if (e.delta > 0) {
                this._stampRotation = this._stampRotation.rotateByValue(
                    -15,
                    "DEGREES"
                );
            } else if (e.delta < 0) {
                this._stampRotation = this._stampRotation.rotateByValue(
                    15,
                    "DEGREES"
                );
            }
            if (this._stampElement != null) {
                this._stampElement.rotation = this._stampRotation;
            }
        }
    }
}
