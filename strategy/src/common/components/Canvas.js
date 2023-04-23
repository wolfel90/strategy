import React, { useRef, useEffect } from "react";

export default function Canvas({ width, height }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            return;
        }
        const context = canvas.getContext("2d");

        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }, []);

    return <canvas ref={canvasRef} width={width - 20} height={height - 20} />;
}
