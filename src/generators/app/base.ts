/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import dotenv from 'dotenv';
import findup from 'findup-sync';
import os from 'os';

export const envPath = findup('.env') ?? findup('.generator-mht/.env', { cwd: `${os.homedir()}` });
envPath && dotenv.config({ path: envPath });

import Generator, { Question } from 'yeoman-generator';
import kebabCase from 'lodash.kebabcase';
import axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';
import { table } from 'table';
import createPrompt, { PromptKey } from './prompts';

export const CIProviders = ['CircleCI', 'GitLab', 'no'] as const;
export type CIProvider = typeof CIProviders[number];

export const Repositories = ['GitHub', 'GitLab'] as const;
export type Repository = typeof Repositories[number];

export const RepositoryUrls: { [key in Repository]: string } = {
    GitHub: 'github.com',
    GitLab: 'gitlab.com',
};

export interface CommonAnswers extends Generator.Answers {
    ci: CIProvider;
    repo: Repository;
    repoUserName: string;
    repoName: string;
    moduleName: string;
    authorName: string;
    description: string;
    devDep: boolean;
    vscode: boolean;
}

export default class<TAnswers extends CommonAnswers = CommonAnswers> extends Generator {
    protected answers: TAnswers = {
        ci: 'CircleCI',
        repo: 'GitHub',
        repoUserName: 'MichaelHettmer',
        repoName: kebabCase(this.appname.replace(/\s/g, '-')).toLowerCase(),
        moduleName: kebabCase(this.appname.replace(/^docker-/, '').replace(/\s/g, '-')).toLowerCase(),
        authorName: 'Michael Hettmer',
        description: 'empty description',
        devDep: false,
        vscode: true,
    } as TAnswers;

    constructor(args: string | string[], opts: {}) {
        super(args, opts);

        this.option('oss', {
            alias: 'o',
            description: 'Default configuration for an OpenSource project on GitHub with CircleCI',
            default: false,
            type: Boolean,
        });

        this.option('private', {
            alias: 'p',
            description: 'Default configuration for a private project on GitLab with GitLabCi',
            default: false,
            type: Boolean,
        });

        this.option('local', {
            alias: 'l',
            description: 'Skip all git push and publish steps including CI registration',
            default: false,
            type: Boolean,
        });

        this.option('skip-signing', {
            alias: 's',
            description: 'Skip signing of the initial git commit',
            default: false,
            type: Boolean,
        });

        this.option('skip-installation', {
            alias: 'i',
            description: 'Skip installation of npm dependencies',
            default: false,
            type: Boolean,
        });

        if (envPath && envPath.length > 0) this.log(chalk.green(`using ${envPath} as your environment setup`));
        else this.log(chalk.red(`no environment setup found`));
    }

    protected printOptions = () => {
        this.log(`started ${this.rootGeneratorName()} v${this.rootGeneratorVersion()} with the following options:`);
        const data = [
            [chalk.bold('option'), chalk.bold('value')],
            ['oss', this.options.oss],
            ['private', this.options.private],
            ['local', this.options.local],
            ['skip-signing', this.options['skip-signing']],
        ];
        this.log(table(data));
    };

    protected getContext = (): { [key: string]: string | boolean } => ({
        ...this.answers,
        repositoryUrl: RepositoryUrls[this.answers.repo],
    });

    protected cp = (from: string, to: string = from) =>
        this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), this.getContext(), {});

    protected cps = (from: string, to: string = from) => this.cp(`../../app/templates/${from}`, to);

    protected exs = (from: string, to: string = from) => {
        this.cps(from, to);
        const tmpName = `__temp__${from}`;
        this.cp(from, tmpName);
        const content = this.fs.readJSON(this.destinationPath(tmpName)) ?? {};
        this.fs.extendJSON(this.destinationPath(to), content);
        this.fs.delete(this.destinationPath(tmpName));
    };

    protected prompts = async (promptsToExecute: (PromptKey | Question)[]) => {
        this.answers = {
            ...this.answers,
            ...(await this.prompt(
                promptsToExecute.map(prompt =>
                    typeof prompt === 'string' ? createPrompt[prompt]({ default: this.answers[prompt] }) : prompt,
                ),
            )),
        };
        return this.answers;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected logAxiosError = (error: any, msg: string | undefined = undefined) => {
        msg && this.log(chalk.red(msg));
        if (error.response) {
            this.log(chalk.red(`data: ${error.response.data}`));
            this.log(chalk.red(`status: ${error.response.status}`));
            this.log(chalk.red(`headers: ${error.response.headers}`));
        } else if (error.request) this.log(chalk.red(`data: ${error.request}`));
        else this.log(chalk.red(`data: ${error.message}`));
    };

    protected logAxiosUnexpectedAnswer = (result: AxiosResponse, msg: string | undefined = undefined) => {
        msg && this.log(chalk.red(msg));
        this.log(chalk.red(`status: ${result.status}`));
        this.log(chalk.red(`statusText: ${result.statusText}`));
        this.log(chalk.red(`cloneUrl: ${result.data.ssh_url}`));
    };

    protected pushGitToRemote = async (ssh_url: string) => {
        if (ssh_url) {
            this.spawnCommandSync('git', ['remote', 'add', 'origin', ssh_url]);
            this.log(chalk.green(`successfully set remote origin to ${ssh_url}`));
            if ((this.spawnCommandSync('git', ['push', '-u', 'origin', 'master']), { stdio: [process.stderr] })) {
                this.log(chalk.green(`successfully pushed generated files as initial commit`));
                return true;
            } else this.log(chalk.red(`failed to push generated files as initial commit`));
            return false;
        }
    };

    protected checkGitHubProjectExists = async (): Promise<boolean> => {
        try {
            const result = await axios.get(
                `https://api.github.com/repos/${this.answers.repoUserName}/${this.answers.repoName}`,
                {
                    headers: {
                        Accept: 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    },
                },
            );
            if (result.status === 200) {
                this.log(chalk.green(`GitHub repository does exist`));
                return true;
            } else this.log(chalk.red(`GitHub repository does not exist`));
        } catch (error) {
            this.logAxiosError(error, `error while fetching GitHub repository`);
        }
        return false;
    };

    protected createGitHubProjectAndPush = async (): Promise<string | undefined> => {
        if (this.options.local) {
            this.log(chalk.yellow(`skip create GitHub project because local option is given`));
            return;
        }

        if (this.options.local) {
            this.log(
                chalk.yellow(
                    `skip create GitHub project because repository provider is set to be ${this.answers.repo}`,
                ),
            );
            return;
        }

        if (!process.env.GITHUB_TOKEN) {
            this.log(chalk.yellow(`skip create GitHub project because environment variable GITHUB_TOKEN is missing`));
        }

        try {
            const result = await axios.post(
                'https://api.github.com/user/repos',
                {
                    name: this.answers.repoName,
                    description: this.answers.description,
                    visibility: 'public',
                    has_issues: true,
                    has_projects: false,
                    has_wiki: true,
                    is_template: false,
                    auto_init: false,
                    allow_squash_merge: false,
                    allow_merge_commit: true,
                    allow_rebase_merge: false,
                    delete_branch_on_merge: true,
                },
                {
                    headers: {
                        Accept: 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    },
                },
            );
            if (result.status === 201 && result.data.ssh_url) {
                this.log(chalk.green(`successfully created ${result.data.ssh_url}`));
                await this.pushGitToRemote(result.data.ssh_url);
                return result.data.ssh_url;
            } else this.logAxiosUnexpectedAnswer(result, `unexpected response while creating GitHub repository`);
        } catch (error) {
            this.logAxiosError(error, 'error while creating GitHub repository');
        }
        return undefined;
    };

    protected followGitHubProjectWithCircleCI = async () => {
        if (this.options.local) {
            this.log(chalk.yellow(`skip follow GitHub project on CircleCI because local option is given`));
            return;
        }

        if (this.answers.ci !== 'CircleCI') {
            this.log(chalk.yellow(`skip follow GitHub project on CircleCI because ci is ${this.answers.ci}`));
            return;
        }

        if (!process.env.CIRCLECI_TOKEN) {
            this.log(
                chalk.yellow(
                    `skip follow GitHub project on CircleCI because environment variable CIRCLECI_TOKEN is missing`,
                ),
            );
            return;
        }

        if (!(await this.checkGitHubProjectExists())) {
            this.log(chalk.yellow(`skip follow GitHub project on CircleCI because GitHub project does not exist`));
            return;
        }

        try {
            const result = await axios.post(
                `https://circleci.com/api/v1.1/project/gh/${this.answers.repoUserName}/${this.answers.repoName}/follow?circle-token=${process.env.CIRCLECI_TOKEN}`,
                {},
                { headers: { Accept: 'application/json' } },
            );
            if (result.status === 200) {
                this.log(chalk.green(`successfully followed GitHub repository with CircleCI`));

                await this.postCircleCIEnvVar('GITHUB_TOKEN');
                await this.postCircleCIEnvVar('NPM_TOKEN');
                await this.postCircleCIEnvVar('DOCKER_USERNAME');
                await this.postCircleCIEnvVar('DOCKER_PASSWORD');
            } else
                this.logAxiosUnexpectedAnswer(
                    result,
                    `unexpected answer while following GitHub repository with CircleCI`,
                );
        } catch (error) {
            this.logAxiosError(error, `error while following GitHub repository with CircleCI`);
        }
    };

    protected initGitSync = () => this.spawnCommandSync('git', ['init']);

    protected initialCommitSync = () => {
        this.spawnCommandSync('git', ['add', '.']);
        if (
            this.spawnCommandSync(
                'git',
                [
                    'commit',
                    ...(this.options['skip-signing'] ? [] : ['-S']),
                    '-m',
                    'feat: initial commit [skip release]',
                ],
                {
                    stdio: [process.stderr],
                },
            )
        )
            this.log(chalk.green(`successfully commited generated files as initial commit`));
        else this.log(chalk.red(`failed to commit generated files as initial commit`));
    };

    protected npmInstallSync = () => !this.options['skip-installation'] && this.spawnCommandSync('npm', ['install']);

    protected fetchGitIgnore = async (type: string): Promise<string | undefined> => {
        try {
            const result = await axios.get(`https://www.gitignore.io/api/${type}`, {
                headers: { Accept: 'text/plain' },
            });
            if (result.status === 200) {
                this.log(chalk.green(`successfully fetched .gitignore for project type ${type}`));
                return result.data;
            } else
                this.logAxiosUnexpectedAnswer(
                    result,
                    `unexpected answer while fetching .gitignore for project type ${type}`,
                );
        } catch (error) {
            this.logAxiosError(error, `error while fetching .gitignore for project type ${type}`);
        }
    };

    protected postCircleCIEnvVar = async (name: string, key: string = name): Promise<boolean> => {
        if (!process.env[key]) {
            this.log(
                chalk.yellow(`can't post CircleCI environment variable ${name} with key ${key} because it is missing`),
            );
            return false;
        }

        try {
            const result = await axios.post(
                `https://circleci.com/api/v1.1/project/gh/${this.answers.repoUserName}/${this.answers.repoName}/envvar?circle-token=${process.env.CIRCLECI_TOKEN}`,
                { name, value: process.env[key] },
                { headers: { Accept: 'application/json' } },
            );
            if (result.status === 201) {
                this.log(chalk.green(`successfully add environment variable ${name} to CircleCI`));
                return true;
            } else
                this.logAxiosUnexpectedAnswer(
                    result,
                    `unexpected answer while adding environment variable ${name} to CircleCI`,
                );
        } catch (error) {
            this.logAxiosError(error, `error while adding environment variable ${name} to CircleCI`);
        }
        return false;
    };
}
