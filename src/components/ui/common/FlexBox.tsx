import { PropsWithChildren } from "react";
import "./UICommon.css";

type Props = {
    style?: React.CSSProperties;
    direction?: "row" | "column";
};

export default function FlexBox(props: PropsWithChildren<Props>): JSX.Element {
    return (
        <div
            className={
                props.direction === undefined || props.direction === "column"
                    ? "flexbox column"
                    : "flexbox row"
            }
            style={props.style}
        >
            {props.children}
        </div>
    );
}
