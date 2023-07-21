import { WorldInputMouseEvent } from "./WorldInputMouseEvent";
import { WorldContext } from "../WorldContext";
import { WorldElementTemplate } from "../elements/WorldElementTemplate";

export interface WorldInputActionSet {
    worldContext: WorldContext;

    activate?(): void;

    deactivate?(): void;

    onControllerStampElementChange?(element: WorldElementTemplate | null): void;

    onWorldMouseClick?(e: WorldInputMouseEvent): void;

    onWorldMouseDown?(e: WorldInputMouseEvent): void;

    onWorldMouseUp?(e: WorldInputMouseEvent): void;

    onWorldMouseMove?(e: WorldInputMouseEvent): void;

    onWorldMouseDragStart?(e: WorldInputMouseEvent): void;

    onWorldMouseDrag?(e: WorldInputMouseEvent): void;

    onWorldMouseDragRelease?(e: WorldInputMouseEvent): void;

    onWorldMouseScroll?(e: WorldInputMouseEvent): void;
}
