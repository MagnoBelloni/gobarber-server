import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/provider/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import ForgotPasswordService from './ForgotPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeForgotPassword: ForgotPasswordService;

describe('ForgotPassword', () => {
    beforeEach(() => {
        fakeMailProvider = new FakeMailProvider();
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeForgotPassword = new ForgotPasswordService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository,
        );
    });

    it('should be able to send an email for recover password', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'Fulano',
            email: 'fulano@gmail.com',
            password: '123',
        });

        await fakeForgotPassword.execute({
            email: 'fulano@gmail.com',
        });

        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a password for a non-existing email', async () => {
        await expect(
            fakeForgotPassword.execute({
                email: 'juninho@bol.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Fulano',
            email: 'fulano@gmail.com',
            password: '123',
        });

        await fakeForgotPassword.execute({
            email: 'fulano@gmail.com',
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
