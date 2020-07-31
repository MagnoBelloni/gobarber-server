import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';
import { uuid } from 'uuidv4';
import IFindAllProvidersDTO from '../../dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const userById = this.users.find(user => user.id === id);

        return userById;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const userByEmail = this.users.find(user => user.email === email);

        return userByEmail;
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, userData);

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );

        this.users[findIndex] = user;

        return user;
    }

    public async findAllProviders({
        expect_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let { users } = this;

        if (expect_user_id) {
            users = this.users.filter(user => user.id !== expect_user_id);
        }

        return users;
    }
}

export default FakeUsersRepository;
