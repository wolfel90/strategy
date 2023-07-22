import { ImageLibrary } from "./ImageLibrary";

export class ImageLoader {
    static loadImageToLibrary(src: string, ...references: string[]): void {
        ImageLibrary.addToLoading(src);
        console.log("Loading " + src);
        let img = new Image();
        img.onload = function () {
            createImageBitmap(img).then((result) => {
                ImageLibrary.addImage(src, result, references);
            });
        };
        img.src = src;
    }
}
