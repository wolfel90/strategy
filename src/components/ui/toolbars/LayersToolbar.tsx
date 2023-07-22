import Button from "../common/Button";
import FlexBox from "../common/FlexBox";
import { WorldLayer } from "../../../world/WorldLayer";

type Props = {
    layers?: Array<WorldLayer>;
    activeLayer?: WorldLayer | null;
    setActiveLayer?: (layer: WorldLayer) => void;
};

export default function LayersToolbar(props: Props): JSX.Element {
    return (
        <FlexBox
            direction="column"
            style={{ width: 225, position: "absolute", left: 225 }}
        >
            {props.layers !== undefined
                ? props.layers.map((layer) => {
                      return (
                          <Button
                              key={layer.id}
                              label={layer.name}
                              highlighted={props.activeLayer === layer}
                              onClick={() => props.setActiveLayer?.(layer)}
                          />
                      );
                  })
                : null}
        </FlexBox>
    );
}
