import Button from "../common/Button";
import FlexBox from "../common/FlexBox";
import { ToolsEnum, getToolsEnumLabel } from "../../../utils/tools/ToolsEnum";

type Props = {
    activeTool?: ToolsEnum;
    setActiveTool?: (tool: ToolsEnum) => void;
};

const tools: Array<ToolsEnum> = [
    ToolsEnum.Pan,
    ToolsEnum.Stamp,
    ToolsEnum.Move,
];

export default function CanvasToolsToolbar(props: Props): JSX.Element {
    return (
        <FlexBox style={{ width: 225, position: "absolute" }}>
            {tools.map((tool) => (
                <Button
                    key={tool}
                    label={getToolsEnumLabel(tool)}
                    highlighted={props.activeTool === tool}
                    onClick={() => props.setActiveTool?.(tool)}
                />
            ))}
        </FlexBox>
    );
}
