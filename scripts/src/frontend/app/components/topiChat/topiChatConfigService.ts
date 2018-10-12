export class TopiChatConfigService {
    private provider: any = {
        sniffing: {
            globalEnable: true
        }
    };

    get():any {
        return this.provider;
    }
}
