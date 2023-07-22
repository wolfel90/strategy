import { CanvasMouseEventHandler } from "../../utils/CanvasMouseEventHandler";
import { MouseEvent } from "react";
import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldContext } from "../WorldContext";
import { WorldElement } from "../elements/WorldElement";
import { WheelEvent } from "react";
import { WorldInputActionSet } from "../controls/WorldInputActionSet";
import { WorldInputMouseEvent } from "../controls/WorldInputMouseEvent";
import { WorldElementTemplate } from "../elements/WorldElementTemplate";

export default class WorldInputController {
    private static CursorPositionHistoryMaxLength = 100;
    private _canvasMouseEventHandler: CanvasMouseEventHandler | null = null;
    private cursorPositionHistory: Array<Vector2f> = [];
    private _worldContext: WorldContext | null = null;
    private _activeWorldInputActionSet: WorldInputActionSet | null = null;
    private _selectedWorldElementIDs: Array<string> = [];
    private _stampElement: WorldElementTemplate | null = null;

    public get canvasMouseEventHandler() {
        return this._canvasMouseEventHandler;
    }
    public get worldContext(): WorldContext | null {
        return this._worldContext;
    }
    public set worldContext(worldContext: WorldContext | null) {
        this._worldContext = worldContext;
    }

    public get activeWorldInputActionSet() {
        return this._activeWorldInputActionSet;
    }
    public setActiveInputActionSet(
        worldInputActionSet: WorldInputActionSet | null
    ) {
        if (this._activeWorldInputActionSet?.deactivate != null) {
            this._activeWorldInputActionSet.deactivate();
        }
        this._activeWorldInputActionSet = worldInputActionSet;
        if (worldInputActionSet?.activate != null) {
            worldInputActionSet.activate();
        }
    }

    public get selectedWorldElementIDs(): Array<string> {
        return this._selectedWorldElementIDs;
    }
    public selectWorldElement(element: WorldElement) {
        if (!this._selectedWorldElementIDs.includes(element.id)) {
            this._selectedWorldElementIDs.push(element.id);
        }
    }
    public unselectWorldElement(element: WorldElement) {
        if (this._selectedWorldElementIDs.includes(element.id)) {
            this._selectedWorldElementIDs =
                this._selectedWorldElementIDs.filter((e) => e === element.id);
        }
    }
    public unselectAllWorldElements() {
        this._selectedWorldElementIDs = [];
    }

    public get stampElement(): WorldElementTemplate | null {
        return this._stampElement;
    }
    public setStampElement(element: WorldElementTemplate | null) {
        this._stampElement = element;
        if (this._activeWorldInputActionSet != null) {
            this._activeWorldInputActionSet.onControllerStampElementChange?.(
                element
            );
        }
    }

    constructor(options?: {
        canvasMouseEventHandler?: CanvasMouseEventHandler;
    }) {
        this.setCanvasMouseEventHandler(
            options?.canvasMouseEventHandler ?? null
        );
    }

    private cursorPointToWorldPoint(x: number, y: number): Vector2f {
        if (
            this._worldContext !== null &&
            this._worldContext.activeViewport !== null
        ) {
            return this._worldContext.activeViewport.screenVecToWorldVec(
                new Vector2f(x, y)
            );
        }
        return new Vector2f();
    }

    public setCanvasMouseEventHandler(
        canvasMouseEventHandler: CanvasMouseEventHandler | null
    ) {
        this._canvasMouseEventHandler = canvasMouseEventHandler;

        if (this._canvasMouseEventHandler !== null) {
            this._canvasMouseEventHandler.onCanvasMouseClick = (e) =>
                this.onWorldMouseClick(e);
            this._canvasMouseEventHandler.onCanvasMouseDown = (e) =>
                this.onWorldMouseDown(e);
            this._canvasMouseEventHandler.onCanvasMouseUp = (e) =>
                this.onWorldMouseUp(e);
            this._canvasMouseEventHandler.onCanvasMouseMove = (e) =>
                this.onWorldMouseMove(e);
            this._canvasMouseEventHandler.onCanvasMouseDragStart = (e) =>
                this.onWorldMouseDragStart(e);
            this._canvasMouseEventHandler.onCanvasMouseDrag = (e) =>
                this.onWorldMouseDrag(e);
            this._canvasMouseEventHandler.onCanvasMouseDragRelease = (e) =>
                this.onWorldMouseDragRelease(e);
            this._canvasMouseEventHandler.onCanvasScroll = (e) =>
                this.onWorldMouseScroll(e);
        }
    }

    private getWorldInputMouseEventFromMouseEvent(e: MouseEvent) {
        const point = this.cursorPointToWorldPoint(e.clientX, e.clientY);
        return new WorldInputMouseEvent(
            point,
            e.button,
            e.altKey,
            e.ctrlKey,
            e.shiftKey,
            this.getMovementFromHistoryTo(point)
        );
    }

    private getWorldInputWheelEventFromWheelEvent(e: WheelEvent) {
        const point = this.cursorPointToWorldPoint(e.clientX, e.clientY);
        return new WorldInputMouseEvent(
            point,
            e.button,
            e.altKey,
            e.ctrlKey,
            e.shiftKey,
            this.getMovementFromHistoryTo(point),
            e.deltaY
        );
    }

    private onWorldMouseClick(e: MouseEvent): void {
        if (this.activeWorldInputActionSet?.onWorldMouseClick != null) {
            this.activeWorldInputActionSet.onWorldMouseClick(
                this.getWorldInputMouseEventFromMouseEvent(e)
            );
        }
    }
    private onWorldMouseDown(e: MouseEvent): void {
        if (this.activeWorldInputActionSet?.onWorldMouseDown != null) {
            this.activeWorldInputActionSet.onWorldMouseDown(
                this.getWorldInputMouseEventFromMouseEvent(e)
            );
        }
    }
    private onWorldMouseUp(e: MouseEvent): void {
        if (this.activeWorldInputActionSet?.onWorldMouseUp != null) {
            this.activeWorldInputActionSet.onWorldMouseUp(
                this.getWorldInputMouseEventFromMouseEvent(e)
            );
        }
    }
    private onWorldMouseMove(e: MouseEvent): void {
        const point = this.cursorPointToWorldPoint(e.clientX, e.clientY);
        const worldInputMouseEvent = new WorldInputMouseEvent(
            point,
            e.button,
            e.altKey,
            e.ctrlKey,
            e.shiftKey,
            this.getMovementFromHistoryTo(point)
        );

        if (this.activeWorldInputActionSet?.onWorldMouseMove != null) {
            this.activeWorldInputActionSet.onWorldMouseMove(
                worldInputMouseEvent
            );
        }

        this.appendToCursorPositionHistory(point);
    }
    private onWorldMouseDragStart(e: MouseEvent): void {
        if (this.activeWorldInputActionSet?.onWorldMouseDragStart != null) {
            this.activeWorldInputActionSet.onWorldMouseDragStart(
                this.getWorldInputMouseEventFromMouseEvent(e)
            );
        }
    }
    private onWorldMouseDrag(e: MouseEvent): void {
        if (this.activeWorldInputActionSet?.onWorldMouseDrag != null) {
            this.activeWorldInputActionSet.onWorldMouseDrag(
                this.getWorldInputMouseEventFromMouseEvent(e)
            );
        }
    }
    private onWorldMouseDragRelease(e: MouseEvent): void {
        if (this.activeWorldInputActionSet?.onWorldMouseDragRelease != null) {
            this.activeWorldInputActionSet.onWorldMouseDragRelease(
                this.getWorldInputMouseEventFromMouseEvent(e)
            );
        }
    }
    private onWorldMouseScroll(e: WheelEvent): void {
        if (this.activeWorldInputActionSet?.onWorldMouseScroll != null) {
            this.activeWorldInputActionSet.onWorldMouseScroll(
                this.getWorldInputWheelEventFromWheelEvent(e)
            );
        }
    }

    private appendToCursorPositionHistory(pos: Vector2f): void {
        if (
            this.cursorPositionHistory.length >=
            WorldInputController.CursorPositionHistoryMaxLength
        ) {
            this.cursorPositionHistory.shift();
        }
        this.cursorPositionHistory.push(pos);
    }

    public getMostRecentCursorWorldPosition(): Vector2f {
        return this.cursorPositionHistory.length > 0
            ? this.cursorPositionHistory[this.cursorPositionHistory.length - 1]
            : new Vector2f();
    }

    private getMovementFromHistoryTo(vec: Vector2f): Vector2f {
        if (this.cursorPositionHistory.length > 0) {
            return this.cursorPositionHistory[
                this.cursorPositionHistory.length - 1
            ].vectorTo(vec);
        } else {
            return vec;
        }
    }
}
