import { MouseEvent } from "react";
import { WheelEvent } from "react";

export class CanvasMouseEventHandler {
    private mouseDragging: boolean = false;
    private mouseDownTimestamp: number = 0;

    public onCanvasMouseClick: ((e: MouseEvent) => void) | null = null;
    public onCanvasMouseDown: ((e: MouseEvent) => void) | null = null;
    public onCanvasMouseUp: ((e: MouseEvent) => void) | null = null;
    public onCanvasMouseMove: ((e: MouseEvent) => void) | null = null;
    public onCanvasMouseDragStart: ((e: MouseEvent) => void) | null = null;
    public onCanvasMouseDrag: ((e: MouseEvent) => void) | null = null;
    public onCanvasMouseDragRelease: ((e: MouseEvent) => void) | null = null;
    public onCanvasScroll: ((e: WheelEvent) => void) | null = null;

    public onClick = (e: MouseEvent) => {
        if (Date.now() - this.mouseDownTimestamp < 500) {
            this.onCanvasMouseClick?.(e);
        }
    };

    public onMouseDown = (e: MouseEvent) => {
        this.onCanvasMouseDown?.(e);
        this.mouseDownTimestamp = Date.now();

        if (!this.mouseDragging) {
            this.mouseDragging = true;
            this.onCanvasMouseDragStart?.(e);
        }
    };

    public onMouseUp = (e: MouseEvent) => {
        this.onCanvasMouseUp?.(e);

        if (this.mouseDragging) {
            this.mouseDragging = false;
            this.onCanvasMouseDragRelease?.(e);
        }
    };

    public onMouseMove = (e: MouseEvent) => {
        if (this.mouseDragging) {
            this.onCanvasMouseDrag?.(e);
        }

        this.onCanvasMouseMove?.(e);
    };

    public onScroll = (e: WheelEvent) => {
        this.onCanvasScroll?.(e);
    };
}
