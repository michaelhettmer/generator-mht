/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import dotenv from 'dotenv';
import findup from 'findup-sync';
import os from 'os';

const envPath = findup('.env') ?? findup('.generator-mht/.env', { cwd: `${os.homedir()}` });
envPath && dotenv.config({ path: envPath });

import Generator from 'yeoman-generator';
import kebabCase from 'lodash.kebabcase';
import axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';

const CIProviders = ['CircleCI', 'GitLab', 'no'] as const;
type CIProvider = typeof CIProviders[number];

const Repositories = ['GitHub', 'GitLab'] as const;
type Repository = typeof Repositories[number];

const RepositoryUrls: { [key in Repository]: string } = {
    GitHub: 'github.com',
    GitLab: 'gitlab.com',
};

interface Answers extends Generator.Answers {
    repoName: string;
    moduleName: string;
    userName: string;
    description: string;
    devDep: boolean;
    vscode: boolean;
    repo: Repository;
    ci: CIProvider;
}

export default class extends Generator {
    public answers: Answers = {
        repo: 'GitHub',
        ci: 'CircleCI',
        userName: 'MichaelHettmer',
        repoName: kebabCase(this.appname.replace(/\s/g, '-')).toLowerCase(),
        moduleName: kebabCase(this.appname.replace(/\s/g, '-')).toLowerCase(),
        authorName: 'Michael Hettmer',
        description: 'short description',
        devDep: false,
        vscode: true,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    printAxiosError = (error: any, msg: string | undefined = undefined) => {
        msg && this.log(chalk.red(msg));
        if (error.response) {
            this.log(chalk.red(`data: ${error.response.data}`));
            this.log(chalk.red(`status: ${error.response.status}`));
            this.log(chalk.red(`headers: ${error.response.headers}`));
        } else if (error.request) this.log(chalk.red(`data: ${error.request}`));
        else this.log(chalk.red(`data: ${error.message}`));
    };

    printUnexpectedAnswer = (result: AxiosResponse, msg: string | undefined = undefined) => {
        msg && this.log(chalk.red(msg));
        this.log(chalk.red(`status: ${result.status}`));
        this.log(chalk.red(`statusText: ${result.statusText}`));
        this.log(chalk.red(`cloneUrl: ${result.data.ssh_url}`));
    };

    fetchGitIgnore = async (type: string): Promise<string | undefined> => {
        try {
            const result = await axios.get(`https://www.gitignore.io/api/${type}`, {
                headers: { Accept: 'text/plain' },
            });
            if (result.status === 200) {
                this.log(chalk.green(`successfully fetched .gitignore for project type ${type}`));
                return result.data;
            } else
                this.printUnexpectedAnswer(
                    result,
                    `unexpected answer while fetching .gitignore for project type ${type}`,
                );
        } catch (error) {
            this.printAxiosError(error, `error while fetching .gitignore for project type ${type}`);
        }
    };

    constructor(args: string | string[], opts: {}) {
        super(args, opts);

        this.option('oss', {
            alias: 'o',
            description: 'Default configuration for an OpenSource project on GitHub with CircleCI',
        });

        this.option('private', {
            alias: 'p',
            description: 'Default configuration for a private project on GitLab with GitLabCi',
        });

        if (envPath && envPath.length > 0) this.log(chalk.green(`using ${envPath} as your environment setup`));
        else this.log(chalk.red(`no environment setup found`));
    }

    async prompting() {
        if (this.options.oss) {
            this.answers.repo = 'GitHub';
            this.answers.ci = 'CircleCI';
        } else if (this.options.private) {
            // default config is already correct
        } else {
            this.answers = {
                ...this.answers,
                ...(await this.prompt<Answers>([
                    {
                        name: 'ci',
                        message: 'Select a CI provider',
                        default: this.answers.ci,
                        type: 'list',
                        choices: CIProviders,
                        store: true,
                    },
                    {
                        name: 'repo',
                        message: 'Select a repository provider',
                        default: this.answers.repo,
                        type: 'list',
                        choices: Repositories,
                        store: true,
                    },
                    {
                        name: 'userName',
                        message: `What is your username in this repository ?`,
                        default: this.answers.userName,
                        type: 'input',
                        store: true,
                    },
                    {
                        name: 'repoName',
                        message: 'What do you want to name your repository?',
                        default: this.answers.repoName,
                        type: 'input',
                        store: true,
                    },
                ])),
            };

            this.answers = {
                ...this.answers,
                ...(await this.prompt<Answers>([
                    {
                        name: 'authorName',
                        message: `What is your real name?`,
                        default: this.answers.userName, // reuse userName
                        type: 'input',
                        store: true,
                    },
                    {
                        name: 'moduleName',
                        message: 'What do you want to name your module?',
                        default: this.answers.repoName, // reuse repoName
                        type: 'input',
                        store: true,
                    },
                    {
                        name: 'description',
                        message: 'What does your module do in one sentence?',
                        default: this.answers.description,
                        type: 'input',
                        store: true,
                    },
                    {
                        name: 'devDep',
                        message: 'Should your module be installed as a devDependency?',
                        default: this.answers.devDep,
                        type: 'confirm',
                        store: true,
                    },
                    {
                        name: 'vscode',
                        message: 'Do you use VSCode?',
                        default: this.answers.vscode,
                        type: 'confirm',
                        store: true,
                    },
                ])),
            };
        }
    }

    async writing() {
        const context: { [key: string]: string | boolean } = {
            ...this.answers,
            repositoryUrl: RepositoryUrls[this.answers.repo],
        };
        const cps = (from: string, to: string = from) => cp(`../../app/templates/${from}`, to);
        const cp = (from: string, to: string = from) =>
            this.fs.copyTpl(this.templatePath(from), this.destinationPath(to), context, {});

        const gitignore = await this.fetchGitIgnore('node');
        gitignore && this.fs.write(this.destinationPath('.gitignore'), gitignore);

        cps('.all-contributorsrc.md');
        cps('CONTRIBUTING.md');
        cps('CODE_OF_CONDUCT.md');
        cps('LICENSE');
        cps('README.md');
        cp('.npmrc');
        cp('.releaserc');
        cp('Dockerfile');
        cp('package.json');

        if (this.answers.vscode) cp('.vscode');

        if (this.answers.ci === 'GitLab') cp('.gitlab-ci.yml');
        else if (this.answers.ci === 'CircleCI') cp('.circleci');

        if (this.answers.repo === 'GitHub') cps('.github');
    }

    async install() {
        this.spawnCommandSync('git', ['init']);
        this.spawnCommandSync('npm', ['install']);

        const postCircleCIEnvVar = async (name: string, key: string = name) => {
            if (process.env[key]) {
                try {
                    const result = await axios.post(
                        `https://circleci.com/api/v1.1/project/gh/${this.answers.userName}/${this.answers.moduleName}/envvar?circle-token=${process.env.CIRCLECI_TOKEN}`,
                        { name, value: process.env[key] },
                        { headers: { Accept: 'application/json' } },
                    );
                    if (result.status === 201)
                        this.log(chalk.green(`successfully add environment variable ${name} to CircleCI`));
                    else
                        this.printUnexpectedAnswer(
                            result,
                            `unexpected answer while adding environment variable ${name} to CircleCI`,
                        );
                } catch (error) {
                    this.printAxiosError(error, `error while adding environment variable ${name} to CircleCI`);
                }
            } else this.log(chalk.red(`environment variable ${name} with key ${key} cannot be found in process.env`));
        };

        if (this.answers.repo === 'GitHub' && process.env.GITHUB_TOKEN) {
            try {
                const result = await axios.post(
                    'https://api.github.com/user/repos',
                    {
                        name: this.answers.moduleName,
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
                    this.spawnCommandSync('git', ['remote', 'add', 'origin', result.data.ssh_url]);
                    this.log(chalk.green(`successfully set remote origin to ${result.data.ssh_url}`));
                    this.spawnCommandSync('git', ['add', '.']);
                    this.spawnCommandSync('git', ['commit', '-S', '-m', '"feat: initial commit [skip release]"']);
                    if ((this.spawnCommandSync('git', ['push', '-u', 'origin', 'master']), { stdio: [process.stderr] }))
                        this.log(chalk.green(`successfully pushed generated files as initial commit`));
                    else this.log(chalk.red(`failed to push generated files as initial commit`));
                } else this.printUnexpectedAnswer(result, `unexpected response while creating GitHub repository`);
            } catch (error) {
                this.printAxiosError(error, 'error while creating GitHub repository');
            }

            if (this.answers.ci === 'CircleCI' && process.env.CIRCLECI_TOKEN) {
                // check if GitHub repository exists
                try {
                    const result = await axios.get(
                        `https://api.github.com/repos/${this.answers.userName}/${this.answers.moduleName}`,
                        {
                            headers: {
                                Accept: 'application/vnd.github.v3+json',
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                            },
                        },
                    );
                    if (result.status === 200) {
                        try {
                            const result = await axios.post(
                                `https://circleci.com/api/v1.1/project/gh/${this.answers.userName}/${this.answers.moduleName}/follow?circle-token=${process.env.CIRCLECI_TOKEN}`,
                                {},
                                { headers: { Accept: 'application/json' } },
                            );
                            if (result.status === 200) {
                                this.log(chalk.green(`successfully followed GitHub repository with CircleCI`));

                                process.env.NPM_TOKEN && (await postCircleCIEnvVar('GITHUB_TOKEN'));
                                process.env.NPM_TOKEN && (await postCircleCIEnvVar('NPM_TOKEN'));
                                process.env.NPM_TOKEN && (await postCircleCIEnvVar('DOCKER_USERNAME'));
                                process.env.NPM_TOKEN && (await postCircleCIEnvVar('DOCKER_PASSWORD'));
                            } else
                                this.printUnexpectedAnswer(
                                    result,
                                    `unexpected answer while following GitHub repository with CircleCI`,
                                );
                        } catch (error) {
                            this.printAxiosError(error, `error while following GitHub repository with CircleCI`);
                        }
                    } else this.log(chalk.red(`GitHub repository does not exist`));
                } catch (error) {
                    this.printAxiosError(error, `error while fetching GitHub repository`);
                }
            }
        }
    }

    end() {
        this.log('make sure you configure all used bots / services manually, if it will not happen automatically');
        this.log('https://github.com/settings/installations');
    }
}
