import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        updateProfile = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Fulano de Souza',
            email: 'fulano@hotmail.com',
        });

        expect(updateUser.name).toBe('Fulano de Souza');
        expect(updateUser.email).toBe('fulano@hotmail.com');
    });

    it('should not be able to update the profile from non-existing user', async () => {
        await expect(
            updateProfile.execute({
                user_id: 'non-existing-user-id',
                name: 'Fulano de Souza',
                email: 'fulano@hotmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to change the email to a already used email', async () => {
        await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        const user = await fakeUsersRepository.create({
            name: 'Teste',
            email: 'test@gmail.com',
            password: '123',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Fulano da Silva',
                email: 'fulano@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        const updateUser = await updateProfile.execute({
            user_id: user.id,
            name: 'Fulano de Souza',
            email: 'fulano@hotmail.com',
            old_password: '123',
            password: '123456',
        });

        expect(updateUser.password).toBe('123456');
    });

    it('should not be able to update the password if the old password is not informed', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Fulano de Souza',
                email: 'fulano@hotmail.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password if the old password is incorrect', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        await expect(
            updateProfile.execute({
                user_id: user.id,
                name: 'Fulano de Souza',
                email: 'fulano@hotmail.com',
                old_password: '12345',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
