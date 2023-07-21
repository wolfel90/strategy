import { Vector2f } from "../utils/geom/Vector2f";
import { WorldElement } from "./elements/WorldElement";
import { WorldElementContainer } from "./elements/WorldElementContainer";
import { WorldLayer } from "./WorldLayer";
import { WorldGrid } from "./elements/WorldGrid";
import { WorldViewport } from "./utils/WorldViewport";
import { CanvasRenderingOptions } from "../utils/canvas/CanvasRenderingOptions";
import WorldInputController from "./utils/WorldInputController";
import { Rectangle2f } from "../utils/geom/Rectangle2f";
import { WorldElementTemplate } from "./elements/WorldElementTemplate";

export class WorldContext {
    readonly fillColor: string = "#000000";
    private _layers: Array<WorldLayer>;
    private _activeLayer: WorldLayer | null = null;
    private _viewports: Array<WorldViewport>;
    private _activeViewport: WorldViewport | null = null;
    private _worldInputController: WorldInputController | null;
    public canvasRenderingOptions: CanvasRenderingOptions | null;
    public grid: WorldGrid | null = null;

    get layers(): Array<WorldLayer> {
        return this._layers;
    }

    public get activeLayer(): WorldLayer | null {
        return this._activeLayer;
    }
    public set activeLayer(layer: WorldLayer | null) {
        if (layer === null) {
            this._activeLayer = null;
            return;
        }
        this._activeLayer = this._layers.includes(layer) ? layer : null;
    }

    public get viewports(): Array<WorldViewport> {
        return this._viewports;
    }

    public get activeViewport(): WorldViewport | null {
        return this._activeViewport;
    }
    public set activeViewport(viewport: WorldViewport | null) {
        if (viewport === null) {
            this._activeViewport = null;
            return;
        }
        this._activeViewport = this._viewports.includes(viewport)
            ? viewport
            : null;
    }

    public get worldInputController(): WorldInputController | null {
        return this._worldInputController;
    }
    public set worldInputController(
        worldInputController: WorldInputController | null
    ) {
        this._worldInputController = worldInputController;
    }

    constructor(props: {
        layers?: Array<WorldLayer>;
        viewports?: Array<WorldViewport>;
        worldInputController?: WorldInputController;
        canvasRenderingOptions?: CanvasRenderingOptions;
    }) {
        this._layers = props.layers ?? [];
        this._viewports = props.viewports ?? [];

        if (this._viewports.length > 0) {
            this._activeViewport = this._viewports[0];
        }
        this._worldInputController = props.worldInputController ?? null;
        this.canvasRenderingOptions = props.canvasRenderingOptions ?? null;
    }

    public addViewport(viewport: WorldViewport) {
        if (!this._viewports.includes(viewport)) {
            this._viewports.push(viewport);
            if (this._activeViewport === null) {
                this.activeViewport =
                    this._viewports[this._viewports.length - 1];
            }
        }
    }

    public findChildElementByID(
        id: string,
        searchNested: boolean = false
    ): WorldElementContainer | null {
        for (let i = 0; i < this._layers.length; ++i) {
            return this._layers[i].findChildElementByID(id, searchNested);
        }
        return null;
    }

    public pickElement(point: Vector2f): WorldElement | null {
        let result: WorldElement | null = null;
        let resultDist: number = 0;
        this._layers.forEach((layer) => {
            layer.children.forEach((element) => {
                if (!element.locked) {
                    if (element.bounds.contains(point)) {
                        if (result === null) {
                            result = element;
                            resultDist = point.distance(element.bounds.center);
                        } else {
                            let newDist = point.distance(element.bounds.center);
                            if (newDist <= resultDist) {
                                result = element;
                                resultDist = newDist;
                            }
                        }
                    }
                }
            });
        });

        return result;
    }

    public render(
        ctx: CanvasRenderingContext2D,
        options?: {
            canvasRenderingOptions?: CanvasRenderingOptions;
        }
    ): void {
        ctx.fillStyle = this.fillColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const modifiedOptions = {
            ...options,
            canvasRenderingOptions: {
                ...options?.canvasRenderingOptions,
                drawBoundingBox: (element: WorldElement) =>
                    this._worldInputController?.selectedWorldElementIDs.includes(
                        element.id
                    ) ?? false,
            },
        };
        const viewport = this.activeViewport;
        if (viewport !== null) {
            this._layers.forEach((layer) => {
                layer.render(ctx, viewport, null, null, modifiedOptions);
            });

            /* if (this.grid !== null) {
                ctx.strokeStyle = this.grid.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                for (
                    let x = 0;
                    x < 3000;
                    x +=
                        this.grid.size * viewport.scalar.x < 1
                            ? 1
                            : this.grid.size * viewport.scalar.x
                ) {
                    ctx.moveTo(viewport.worldXToScreenX(x), 0);
                    ctx.lineTo(viewport.worldXToScreenX(x), 2000);
                }
                for (
                    let y = 0;
                    y < 2000;
                    y +=
                        this.grid.size * viewport.scalar.y < 1
                            ? 1
                            : this.grid.size * viewport.scalar.y
                ) {
                    ctx.moveTo(0, viewport.worldYToScreenY(y));
                    ctx.lineTo(3000, viewport.worldYToScreenY(y));
                }
                ctx.stroke();
            } */

            ctx.strokeStyle = "#cc222288";
            ctx.lineWidth = 4;
            let rect = viewport.bounds;

            /* rect = viewport.worldRectToScreenRect(rect);
            ctx.beginPath();
            ctx.moveTo(rect.x, rect.y);
            ctx.lineTo(rect.right, rect.y);
            ctx.lineTo(rect.right, rect.top);
            ctx.lineTo(rect.x, rect.top);
            ctx.lineTo(rect.x, rect.y);
            ctx.moveTo(rect.x + 25, rect.top);
            ctx.lineTo(rect.x + 25, rect.top - 25);
            ctx.lineTo(rect.x, rect.top - 25);
            ctx.moveTo(rect.x, rect.top);
            ctx.lineTo(rect.right, rect.y);
            ctx.stroke(); */
        }
    }
}
