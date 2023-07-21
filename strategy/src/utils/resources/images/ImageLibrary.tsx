import { ResourceReference } from "../ResourceReference";

export class ImageLibrary {
    private static _loading: Array<string> = [];
    private static _images: Array<
        ResourceReference<{ key: String; img: ImageBitmap }>
    > = [];
    static get images() {
        return ImageLibrary._images;
    }

    public static hasKey(key: string): boolean {
        return (
            this._loading.includes(key) ||
            this._images.some((e) => e.resource.key === key)
        );
    }

    public static addToLoading(src: string) {
        if (!this._loading.includes(src)) {
            this._loading.push(src);
        }
    }

    /** Adds an image to the Library, keyed by its search string, having the provided references. If the image already exists, the image will be updated, maintaining existing references.  */
    public static addImage(
        src: string,
        img: ImageBitmap,
        references?: string[]
    ) {
        const existing = this._images.findIndex((e) => e.resource.key === src);
        if (existing === -1) {
            console.log(`Adding ${src} to image library.`);
            this._images.push(
                new ResourceReference({ key: src, img }, ...(references ?? []))
            );
        } else {
            this._images[existing].setResource({ key: src, img });
            if (references) {
                this._images[existing].addReferences(...references);
            }
        }
        this._loading = this._loading.filter((e) => e !== src);
    }

    public static getImage(src: string): ImageBitmap | null {
        return (
            this._images.find((e) => e.resource.key === src)?.resource.img ??
            null
        );
    }

    public static addReference(src: string, reference: string): boolean {
        const index = this._images.findIndex((e) => e.resource.key === src);
        if (index >= 0) {
            this._images[index].addReference(reference);
            return true;
        }
        return false;
    }
}
