import { ObjectId } from 'mongodb';

import Notification from '../../infra/typeorm/schemas/Notification';
import IFindAllProvidersDTO from '../../dtos/ICreateNotificationDTO';
import INotificationsRepository from '../INotificationsRepository';

class FakeNotificationsRepository implements INotificationsRepository {
    private notifications: Notification[] = [];

    public async create({
        content,
        recipient_id,
    }: IFindAllProvidersDTO): Promise<Notification> {
        const notification = new Notification();

        Object.assign(notification, {
            id: new ObjectId(),
            content,
            recipient_id,
        });

        this.notifications.push(notification);

        return notification;
    }
}

export default FakeNotificationsRepository;
