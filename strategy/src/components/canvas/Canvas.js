import { useRef, useEffect } from "react";
import "./canvas.css";

export default function Canvas({
    worldContext,
    mouseTrackingHandler,
    width,
    height,
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas === null) {
            return;
        }
        const context = canvas.getContext("2d");
        let frameCount = 0;
        let animationFrameId;

        const render = () => {
            //console.log("Render");
            frameCount++;
            if (worldContext !== null) {
                worldContext.render(context, {
                    canvasRenderingOptions: worldContext.canvasRenderingOptions,
                });
            }
            animationFrameId = window.requestAnimationFrame(render);
        };
        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            className="canvas"
            ref={canvasRef}
            width={width}
            height={height}
            onClick={mouseTrackingHandler.onClick}
            onMouseDown={mouseTrackingHandler.onMouseDown}
            onMouseUp={mouseTrackingHandler.onMouseUp}
            onMouseMove={mouseTrackingHandler.onMouseMove}
            onKeyDown={mouseTrackingHandler.onKeyDown}
            onWheel={mouseTrackingHandler.onScroll}
        />
    );
}
