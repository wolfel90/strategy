export enum ToolsEnum {
    Pan,
    Stamp,
    Move,
}

export function getToolsEnumLabel(tool: ToolsEnum): string {
    switch (tool) {
        case ToolsEnum.Pan:
            return "Pan";
        case ToolsEnum.Stamp:
            return "Stamp";
        case ToolsEnum.Move:
            return "Move";
        default:
            return "Unknown";
    }
}
