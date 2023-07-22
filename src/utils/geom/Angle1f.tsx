import { Vector2f } from "./Vector2f";

export type AngleType = "DEGREES" | "RADIANS" | "PERCENTAGE";

export class Angle1f {
    public static IdentityAngle = new Angle1f(0, "PERCENTAGE");

    readonly angle: number;

    public get anglePercentage(): number {
        return this.angle;
    }
    public get angleDegrees(): number {
        return this.angle * 360;
    }
    public get angleRadians(): number {
        return this.angle * Math.PI * 2;
    }

    constructor(angle: number = 0, format: AngleType = "PERCENTAGE") {
        this.angle = Angle1f.getNormalizedValue(angle, format);
    }

    public static getNormalizedValue(
        angle: number,
        format: AngleType = "PERCENTAGE"
    ): number {
        switch (format) {
            case "DEGREES":
                return angle < 0
                    ? 360 + (angle % 360) / 360
                    : (angle % 360) / 360;
            case "RADIANS":
                return angle < 0
                    ? Math.PI * 2 + (angle % (Math.PI * 2)) / (Math.PI * 2)
                    : (angle % (Math.PI * 2)) / (Math.PI * 2);
            case "PERCENTAGE":
                return angle < 0 ? 1 + (angle % 1) : angle % 1;
        }
    }

    public normalized(): Angle1f {
        return new Angle1f(
            this.angle < 0 ? 1 + (this.angle % 1) : this.angle % 1
        );
    }

    public invert(): Angle1f {
        return new Angle1f(Angle1f.getNormalizedValue(this.angle + 0.5));
    }

    public rotate(a2: Angle1f): Angle1f {
        return new Angle1f(Angle1f.getNormalizedValue(this.angle + a2.angle));
    }

    public rotateByValue(
        angle: number,
        format: AngleType = "PERCENTAGE"
    ): Angle1f {
        return new Angle1f(
            Angle1f.getNormalizedValue(
                (format === "PERCENTAGE"
                    ? this.angle
                    : format === "DEGREES"
                    ? this.angleDegrees
                    : this.angleRadians) + angle,
                format
            )
        );
    }

    public toVector(): Vector2f {
        return new Vector2f(
            Math.cos(this.angleRadians),
            Math.sin(this.angleRadians)
        );
    }
}
