import "./App.css";
import "./components/canvas/Canvas";
import Canvas from "./components/canvas/Canvas";
import { CanvasMouseEventHandler } from "./utils/CanvasMouseEventHandler";
import { WorldContext } from "./world/WorldContext";
import { WorldElementSprite } from "./world/elements/WorldElementSprite";
import { WorldGrid } from "./world/elements/WorldGrid";
import { WorldLayer } from "./world/WorldLayer";
import { Rectangle2f } from "./utils/geom/Rectangle2f";
import { Vector2f } from "./utils/geom/Vector2f";
import UILayer from "./components/ui/UILayer";
import { WorldViewport } from "./world/utils/WorldViewport";
import { useEffect, useState } from "react";
import WorldInputController from "./world/utils/WorldInputController";
import { WorldInputPanActionSet } from "./world/controls/WorldInputPanActionSet";

const worldGrid = new WorldGrid(48, "#ffffff55");

const worldTerrainLayer = new WorldLayer("Terrain");
const worldObjectLayer = new WorldLayer("Objects");

// Terrain. Move Later
const grassSpriteSrc =
    "./images/canvas_elements/scenery/terrain/grass_green_02.png";

for (let y = 0; y <= 45; ++y) {
    for (let x = 0; x <= 60; ++x) {
        const element = new WorldElementSprite(
            grassSpriteSrc,
            new Vector2f(x * 256 + 128, y * 256 + 128),
            new Vector2f(256, 256)
        );
        element.locked = true;

        worldTerrainLayer.addChild(element);
    }
}

/* for (let x = 0; x <= 60; ++x) {
    const element = new WorldElementSprite(
        roadSpriteSrc,
        new Vector2f(x * 256 + 128, 20 * 256),
        new Vector2f(256, 256)
    );
    element.locked = true;
    worldTerrainLayer.addChild(element);
} */

const canvasRenderingOptions = {
    cullingOptions: [],
    // drawBoundingBox: (element) => true,
};

const defaultViewport = new WorldViewport(
    Rectangle2f.fromOriginAndDimensions(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    )
);

const canvasMouseTrackingHandler = new CanvasMouseEventHandler();
const worldInputController: WorldInputController = new WorldInputController({
    canvasMouseEventHandler: canvasMouseTrackingHandler,
});

const worldContext = new WorldContext({
    layers: [worldTerrainLayer, worldObjectLayer],
    viewports: [defaultViewport],
    worldInputController,
    canvasRenderingOptions,
});
worldContext.grid = worldGrid;
worldContext.activeLayer = worldObjectLayer;
worldInputController.setActiveInputActionSet(
    new WorldInputPanActionSet(worldContext)
);
worldInputController.worldContext = worldContext;

function App() {
    const [canvasSize, setCanvasSize] = useState<{
        width: Number;
        height: number;
    }>({ width: window.innerWidth, height: window.innerHeight });
    console.log(-90 % 360);
    useEffect(() => {
        function handleResize() {
            const scalar = defaultViewport.scalar;
            defaultViewport.bounds = Rectangle2f.fromOriginAndDimensions(
                defaultViewport.bounds.x,
                defaultViewport.bounds.y,
                window.innerWidth * scalar.x,
                window.innerHeight * scalar.y
            );
            defaultViewport.canvasDimensions = new Vector2f(
                window.innerWidth,
                window.innerHeight
            );
            setCanvasSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    });

    return (
        <div className="App">
            <div className="container">
                <Canvas
                    worldContext={worldContext}
                    mouseTrackingHandler={canvasMouseTrackingHandler}
                    width={canvasSize.width}
                    height={canvasSize.height}
                />
                <UILayer worldContext={worldContext} />
            </div>
        </div>
    );
}

export default App;
