import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/provider/StorageProvider/fakes/FakeStorageProvider';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCacheProvider: FakeCacheProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        fakeCacheProvider = new FakeCacheProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
            fakeCacheProvider,
        );
    });

    it('should be able to update avatar', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user.', async () => {
        await expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when a new one is created', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

        expect(user.avatar).toBe('avatar2.jpg');
    });
});
