export class ResourceReference<T> {
    private _references: string[];
    public get references(): string[] {
        return this._references;
    }

    private _resource: T;
    public get resource(): T {
        return this._resource;
    }

    constructor(resource: T, ...references: string[]) {
        this._references = references;
        this._resource = resource;
    }

    public addReference(reference: string): boolean {
        if (!this._references.includes(reference)) {
            this._references.push(reference);
            return true;
        }
        return false;
    }

    public addReferences(...references: string[]): void {
        references.forEach((ref) => this.addReference(ref));
    }

    public setResource(resource: T): void {
        this._resource = resource;
    }

    /** Removes the specified reference from this ResourceReference, if it exists. Returns the number of references that exist on this ResourceReference after the removal. */
    public removeReference(reference: string): number {
        if (this._references.includes(reference)) {
            this._references = this._references.filter((r) => r !== reference);
        }
        return this._references.length;
    }
}
