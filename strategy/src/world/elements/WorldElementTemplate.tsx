import { Vector2f } from "../../utils/geom/Vector2f";

export type WorldElementTemplate = {
    id: string;
    name: string;
    spriteSrc?: string;
    size: Vector2f;
};
