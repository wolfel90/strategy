import { WorldContext } from "../WorldContext";
import { DimensionalWorldElement } from "../elements/DimensionalWorldElement";
import { WorldElement } from "../elements/WorldElement";
import { WorldElementSprite } from "../elements/WorldElementSprite";
import { WorldElementHandle } from "../utils/WorldElementHandle";
import { WorldInputActionSet } from "./WorldInputActionSet";
import { WorldInputMouseEvent } from "./WorldInputMouseEvent";

export class WorldInputMoveActionSet implements WorldInputActionSet {
    private targetElement: WorldElement | null = null;
    private dragHandle: WorldElementHandle | null = null;
    worldContext: WorldContext;

    constructor(worldContext: WorldContext) {
        this.worldContext = worldContext;
    }

    activate(): void {}

    deactivate(): void {}

    onWorldMouseClick(e: WorldInputMouseEvent): void {}

    onWorldMouseDown(e: WorldInputMouseEvent): void {
        let target = this.worldContext.pickElement(e.point);

        if (target !== null) {
            this.dragHandle = new WorldElementHandle(
                target,
                target.bounds.position.vectorTo(e.point)
            );
            this.worldContext?.worldInputController?.unselectAllWorldElements();
            this.worldContext?.worldInputController?.selectWorldElement(target);
        }
    }

    onWorldMouseUp(e: WorldInputMouseEvent): void {
        this.dragHandle = null;
    }

    onWorldMouseMove(e: WorldInputMouseEvent): void {}

    onWorldMouseDragStart(e: WorldInputMouseEvent): void {}

    onWorldMouseDrag(e: WorldInputMouseEvent): void {
        if (e.altKey) {
            this.worldContext.activeViewport?.translate(e.movement.invert());
        } else {
            if (this.dragHandle !== null) {
                this.dragHandle.translate(e.movement);
            }
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
            if (
                this.dragHandle != null &&
                this.dragHandle.element != null &&
                this.dragHandle.element instanceof DimensionalWorldElement
            ) {
                if (e.delta > 0) {
                    this.dragHandle.element.scale =
                        this.dragHandle.element.scale.scale(0.9);
                } else if (e.delta < 0) {
                    this.dragHandle.element.scale =
                        this.dragHandle.element.scale.scale(1.1);
                }
            }
        } else {
            if (
                this.dragHandle != null &&
                this.dragHandle.element != null &&
                this.dragHandle.element instanceof DimensionalWorldElement
            ) {
                if (e.delta > 0) {
                    this.dragHandle.element.rotation =
                        this.dragHandle.element.rotation.rotateByValue(
                            -15,
                            "DEGREES"
                        );
                } else if (e.delta < 0) {
                    this.dragHandle.element.rotation =
                        this.dragHandle.element.rotation.rotateByValue(
                            15,
                            "DEGREES"
                        );
                }
            }
        }
    }
}
