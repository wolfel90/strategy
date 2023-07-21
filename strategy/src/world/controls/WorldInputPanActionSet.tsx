import { WorldContext } from "../WorldContext";
import { WorldInputActionSet } from "./WorldInputActionSet";
import { WorldInputMouseEvent } from "./WorldInputMouseEvent";

export class WorldInputPanActionSet implements WorldInputActionSet {
    worldContext: WorldContext;

    constructor(worldContext: WorldContext) {
        this.worldContext = worldContext;
    }

    activate(): void {}

    deactivate(): void {}

    onWorldMouseClick(e: WorldInputMouseEvent): void {
        if (
            this.worldContext !== null &&
            this.worldContext.activeViewport !== null
        ) {
            const p = this.worldContext.activeViewport.worldVecToScreenVec(
                e.point
            );
        }
    }

    onWorldMouseDown(e: WorldInputMouseEvent): void {}

    onWorldMouseUp(e: WorldInputMouseEvent): void {}

    onWorldMouseMove(e: WorldInputMouseEvent): void {}

    onWorldMouseDragStart(e: WorldInputMouseEvent): void {}

    onWorldMouseDrag(e: WorldInputMouseEvent): void {
        this.worldContext.activeViewport?.translate(e.movement.invert());
    }

    onWorldMouseDragRelease(e: WorldInputMouseEvent): void {}

    onWorldMouseScroll(e: WorldInputMouseEvent): void {
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
    }
}
