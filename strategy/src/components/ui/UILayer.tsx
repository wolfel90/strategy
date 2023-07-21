import { WorldContext } from "../../world/WorldContext";
import CanvasToolsToolbar from "./toolbars/CanvasToolsToolbar";
import ElementLibraryToolbar from "./toolbars/ElementLibraryToolbar";
import ElementLibraryGroups from "../../resources/json/ElementLibraryGroups.json";
import LayersToolbar from "./toolbars/LayersToolbar";
import { useState } from "react";
import { ToolsEnum } from "../../utils/tools/ToolsEnum";
import { Vector2f } from "../../utils/geom/Vector2f";
import { WorldLayer } from "../../world/WorldLayer";
import { WorldInputMoveActionSet } from "../../world/controls/WorldInputMoveActionSet";
import { WorldInputPanActionSet } from "../../world/controls/WorldInputPanActionSet";
import { WorldInputStampActionSet } from "../../world/controls/WorldInputStampActionSet";
import "./UILayer.css";
import { WorldElementTemplate } from "../../world/elements/WorldElementTemplate";

const elementGroups = ElementLibraryGroups.map((g) => {
    return {
        value: g.value,
        label: g.name,
        elements: g.elements.map((ele) => {
            return {
                id: ele.id,
                name: ele.name,
                spriteSrc: ele.spriteSrc,
                size: new Vector2f(ele.size.x, ele.size.y),
            };
        }),
    };
});

type Props = {
    worldContext: WorldContext;
};

export default function UILayer({ worldContext }: Props): JSX.Element {
    const [activeTool, setActiveTool] = useState<ToolsEnum>(ToolsEnum.Pan);
    const [activeLayer, setActiveLayer] = useState<WorldLayer | null>(
        worldContext.activeLayer
    );
    const [activeWorldElementTemplate, setActiveWorldElementTemplate] =
        useState<WorldElementTemplate | null>(null);

    function setContextWorldInputActionSetForTool(
        worldContext: WorldContext,
        tool: ToolsEnum | null
    ): void {
        switch (tool) {
            case ToolsEnum.Move:
                worldContext.worldInputController?.setActiveInputActionSet(
                    new WorldInputMoveActionSet(worldContext)
                );
                break;
            case ToolsEnum.Pan:
                worldContext.worldInputController?.setActiveInputActionSet(
                    new WorldInputPanActionSet(worldContext)
                );
                break;
            case ToolsEnum.Stamp:
                worldContext.worldInputController?.setActiveInputActionSet(
                    new WorldInputStampActionSet(
                        worldContext,
                        activeWorldElementTemplate
                    )
                );
                break;
            default:
                worldContext.worldInputController?.setActiveInputActionSet(
                    null
                );
        }
    }

    return (
        <div className="layer">
            <CanvasToolsToolbar
                activeTool={activeTool}
                setActiveTool={(tool) => {
                    setActiveTool(tool);
                    setContextWorldInputActionSetForTool(worldContext, tool);
                }}
            />
            <LayersToolbar
                layers={worldContext.layers}
                activeLayer={activeLayer}
                setActiveLayer={(layer) => {
                    setActiveLayer(layer);
                    worldContext.activeLayer = layer;
                }}
            />
            <ElementLibraryToolbar
                groups={elementGroups}
                selectedWorldElementTemplate={activeWorldElementTemplate}
                setSelectedWorldElementTemplate={(element) => {
                    setActiveWorldElementTemplate(element);
                    worldContext?.worldInputController?.activeWorldInputActionSet?.onControllerStampElementChange?.(
                        element
                    );
                }}
            />
        </div>
    );
}
