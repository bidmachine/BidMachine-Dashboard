export class ModelLabels {
    private labels = new Map<string, string>();

    constructor(labels: { [key: string]: string }) {
        this.labels = new Map<string, string>(Object.keys(labels).map(key => [key, labels[key]] as [string, string]));
    }

    get(key: string) {
        if (this.labels.has(key)) {
            return this.labels.get(key);
        } else {
            return key;
        }
    }
}
