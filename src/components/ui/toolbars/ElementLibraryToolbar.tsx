import Button from "../common/Button";
import FlexBox from "../common/FlexBox";
import ElementLibraryGroup from "./ElementLibraryGroup";
import { useState } from "react";
import { WorldElementTemplate } from "../../../world/elements/WorldElementTemplate";

type Props = {
    groups: Array<{
        value: string;
        label: string;
        elements: Array<WorldElementTemplate>;
    }>;
    selectedWorldElementTemplate?: WorldElementTemplate | null;
    setSelectedWorldElementTemplate?: (
        element: WorldElementTemplate | null
    ) => void;
};

export default function ElementLibraryToolbar(props: Props): JSX.Element {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [selectedElement, setSelectedElement] =
        useState<WorldElementTemplate | null>(
            props.selectedWorldElementTemplate ?? null
        );

    return (
        <FlexBox
            direction="column"
            style={{ width: 225, position: "absolute", left: 450 }}
        >
            <Button
                label="Elements"
                highlighted={isExpanded}
                onClick={() => setIsExpanded(!isExpanded)}
            />
            {isExpanded &&
                props.groups.map((group) => {
                    return (
                        <ElementLibraryGroup
                            key={group.value}
                            value={group.value}
                            label={group.label}
                            elements={group.elements}
                            selectedElement={selectedElement}
                            setSelectedElement={(element) => {
                                setSelectedElement(element);
                                props.setSelectedWorldElementTemplate?.(
                                    element
                                );
                            }}
                        />
                    );
                })}
        </FlexBox>
    );
}
