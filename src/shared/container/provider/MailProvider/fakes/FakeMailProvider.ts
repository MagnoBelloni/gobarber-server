import IMailProvider from '../models/IMailProvider';
import ISendMailProvider from '../dtos/ISendMailDTO';

interface IMessage {
    to: string;
    body: string;
}

export default class FakeMailProvider implements IMailProvider {
    private messages: ISendMailProvider[] = [];

    public async sendMail(message: ISendMailProvider): Promise<void> {
        this.messages.push(message);
    }
}
