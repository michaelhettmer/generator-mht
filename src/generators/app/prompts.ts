import { Question } from 'yeoman-generator';
import { CIProviders, Repositories } from './base';
import { ListQuestion, InputQuestion, ConfirmQuestion } from 'inquirer';

export type PromptKey = (
    | 'ci'
    | 'repo'
    | 'repoUserName'
    | 'repoName'
    | 'dockerUserName'
    | 'authorName'
    | 'moduleName'
    | 'description'
    | 'devDep'
    | 'isLib'
    | 'vscode'
    | 'latexDocumentName'
    | 'latexOutDir'
) &
    string;

const prompts: { [key in PromptKey]: ({}: Question) => Question } = {
    ci: params =>
        ({
            name: 'ci',
            message: 'Select a CI provider',
            default: CIProviders[0],
            type: 'list',
            choices: CIProviders,
            store: true,
            ...params,
        } as ListQuestion),
    repo: params =>
        ({
            name: 'repo',
            message: 'Select a repository provider',
            default: Repositories[0],
            type: 'list',
            choices: Repositories,
            store: true,
            ...params,
        } as ListQuestion),
    repoUserName: params =>
        ({
            name: 'repoUserName',
            message: `What is your user name in this repository?`,
            default: '',
            type: 'input',
            store: true,
            ...params,
        } as InputQuestion),
    repoName: params =>
        ({
            name: 'repoName',
            message: 'What do you want to name your repository?',
            default: '',
            type: 'input',
            store: true,
            ...params,
        } as InputQuestion),
    dockerUserName: params =>
        ({
            name: 'dockerUserName',
            message: `What is your docker user name?`,
            default: '',
            type: 'input',
            store: true,
            ...params,
        } as InputQuestion),
    authorName: params =>
        ({
            name: 'authorName',
            message: `What is your real name?`,
            default: '',
            type: 'input',
            store: true,
            ...params,
        } as InputQuestion),
    moduleName: params =>
        ({
            name: 'moduleName',
            message: 'What do you want to name your module?',
            default: '',
            type: 'input',
            store: true,
            ...params,
        } as InputQuestion),
    description: params =>
        ({
            name: 'description',
            message: 'What does your module do in one sentence?',
            default: '',
            type: 'input',
            store: true,
            ...params,
        } as InputQuestion),
    isLib: params =>
        ({
            name: 'isLib',
            message: 'Is your module a library?',
            default: false,
            type: 'confirm',
            store: true,
            ...params,
        } as ConfirmQuestion),
    devDep: params =>
        ({
            name: 'devDep',
            message: 'Should your module be installed as a devDependency?',
            default: false,
            type: 'confirm',
            store: true,
            ...params,
        } as ConfirmQuestion),
    vscode: params =>
        ({
            name: 'vscode',
            message: 'Do you use VSCode?',
            default: true,
            type: 'confirm',
            store: true,
            ...params,
        } as ConfirmQuestion),
    latexDocumentName: params => ({
        name: 'latexDocumentName',
        message: 'What should the name of the initial document be?',
        default: 'document',
        type: 'input',
        store: true,
        ...params,
    }),
    latexOutDir: params => ({
        name: 'latexOutDir',
        message: 'Which directory should be used for generated files?',
        default: 'out',
        type: 'input',
        store: true,
        ...params,
    }),
};

export default prompts;
