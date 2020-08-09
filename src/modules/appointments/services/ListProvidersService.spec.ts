import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviders = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider,
        );
    });

    it('should be able to list the providers', async () => {
        const provider1 = await fakeUsersRepository.create({
            name: 'Fulano da Silva',
            email: 'fulano@gmail.com',
            password: '123',
        });

        const provider2 = await fakeUsersRepository.create({
            name: 'Fulano de Souza',
            email: 'fulanosz@gmail.com',
            password: '123',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Fulano de Tal',
            email: 'fultal@hotmail.com',
            password: '123',
        });

        const providers = await listProviders.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([provider1, provider2]);
    });
});
