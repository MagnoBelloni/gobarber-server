import { container } from 'tsyringe';

import IMailTempalteProvider from './models/IMailTemplateProvider';

import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';

const providers = {
    handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTempalteProvider>(
    'MailTemplateProvider',
    providers.handlebars,
);
