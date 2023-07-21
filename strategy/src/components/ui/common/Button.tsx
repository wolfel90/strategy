import FlexBox from "./FlexBox";
import "./UICommon.css";

type Props = {
    style?: React.CSSProperties;
    label?: string;
    hideLabel?: boolean;
    iconSrc?: string;
    highlighted?: boolean;
    onClick?: (e: React.MouseEvent) => void;
};

export default function Button(props: Props): JSX.Element {
    return (
        <div
            className={
                props.highlighted === true ? "button highlighted" : "button"
            }
            style={props.style}
            onClick={props.onClick}
        >
            <FlexBox direction="row">
                {(props.hideLabel !== true && props.label) ?? null}
                {props.iconSrc != null && (
                    <img
                        src={props.iconSrc}
                        width={25}
                        height={25}
                        alt={""}
                    ></img>
                )}
            </FlexBox>
        </div>
    );
}
