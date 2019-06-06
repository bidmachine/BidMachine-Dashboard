export interface Payload { //JSON Web Token (JWT)(RFC) https://tools.ietf.org/html/rfc7519#section-4.1
    sub: string;
    iss: string;
    exp: number;
    iat: number;
    jti: string;
    resourceId?: number;
    resourceType?: "agency"
    analyticHostId?: string
}

export class Token {
    type: string;
    payload: Payload;

    constructor(type: string) {
        this.type = type;
        this.payload = {} as any;
        if (this.get()) {
            this.updatePayload()
        }
    }

    updatePayload() {
        let [, base64Url,] = this.get().split('.');
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        this.payload = JSON.parse(window.atob(base64));
    }

    set(value) {
        localStorage.setItem(this.type.toString(), value)
        this.updatePayload()
    }

    get(): string | null {
        return localStorage.getItem(this.type.toString());
    }

    remove() {
        localStorage.removeItem(this.type.toString())
    }
}

export default {
    access: new Token("access-token")
};
