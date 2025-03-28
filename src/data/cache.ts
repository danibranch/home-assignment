export class Cache {
    private map: Map<string, any>;

    constructor(private ttl: number = 1000 * 60 * 5) {
        this.map = new Map<string, any>();
    }

    public set(key: string, value: any) {
        const now = Date.now();
        this.map.set(key, { value, expiry: now + this.ttl });
    }

    public get(key: string) {
        const cached = this.map.get(key);
        if (!cached) return null;

        if (cached.expiry < Date.now()) {
            this.map.delete(key);
            return null;
        }
        return cached.value;
    }
}