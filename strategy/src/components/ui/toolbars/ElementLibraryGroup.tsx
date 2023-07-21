import Button from "../common/Button";
import FlexBox from "../common/FlexBox";
import { WorldLayer } from "../../../world/WorldLayer";
import { useState } from "react";
import { WorldElementTemplate } from "../../../world/elements/WorldElementTemplate";

type Props = {
    value: string;
    label: string;
    elements: Array<WorldElementTemplate>;
    selectedElement: WorldElementTemplate | null;
    setSelectedElement?: (element: WorldElementTemplate | null) => void;
};

export default function ElementLibraryGroup(props: Props): JSX.Element {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    function getElementRows(): JSX.Element[] {
        const rowSize = 5;
        const result: Array<JSX.Element> = [];
        for (let i = 0; i < props.elements.length; i += rowSize) {
            const buttons = props.elements
                .filter((_, index) => index >= i && index < i + rowSize)
                .map((element) => {
                    return (
                        <Button
                            key={element.id}
                            label={element.name}
                            iconSrc={element.spriteSrc}
                            hideLabel={true}
                            style={{ width: 35, height: 35, padding: 4 }}
                            highlighted={props.selectedElement === element}
                            onClick={() => {
                                if (props.selectedElement === element) {
                                    props.setSelectedElement?.(null);
                                } else {
                                    props.setSelectedElement?.(element);
                                }
                            }}
                        />
                    );
                });
            result.push(
                <FlexBox
                    key={`elements_${i}-${i + rowSize - 1}`}
                    direction="row"
                >
                    {buttons}
                </FlexBox>
            );
        }
        return result;
    }

    return (
        <FlexBox key={`${props.value}-wrapper`} direction="column">
            <Button
                key={`${props.value}-button`}
                label={props.label}
                highlighted={isExpanded}
                onClick={() => setIsExpanded(!isExpanded)}
            />
            {isExpanded && props.elements.length > 0 && getElementRows()}
        </FlexBox>
    );
}
