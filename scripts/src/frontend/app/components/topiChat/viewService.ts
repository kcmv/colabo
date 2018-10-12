export class TopiChatViewService {
    private provider: any = {
        config: {
            messages: {
                showImages: true,
                showTypes: true
            },
            users: {
                showNames: true,
                showImages: true,
                showTypes: true
            }
        }
    };

    get():any {
        return this.provider;
    }
}
