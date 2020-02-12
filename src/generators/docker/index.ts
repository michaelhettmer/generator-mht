/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import dotenv from 'dotenv';
import findup from 'findup-sync';
import os from 'os';

const envPath = findup('.env') ?? findup('.generator-mht/.env', { cwd: `${os.homedir()}` });
envPath && dotenv.config({ path: envPath });

import Generator from 'yeoman-generator';
import kebabCase from 'lodash.kebabcase';
import startCase from 'lodash.startcase';
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
    ci: CIProvider;
    repo: Repository;
    repoUserName: string;
    repoName: string;
    moduleName: string;
    dockerUserName: string;
    authorName: string;
    description: string;
    devDep: boolean;
    vscode: boolean;
}

export default class extends Generator {
    public answers: Answers = {
        ci: 'CircleCI',
        repo: 'GitHub',
        repoUserName: 'MichaelHettmer',
        repoName: kebabCase(this.appname.replace(/\s/g, '-')).toLowerCase(),
        moduleName: kebabCase(this.appname.replace(/^docker-/, '').replace(/\s/g, '-')).toLowerCase(),
        dockerUserName: 'michaelhettmer',
        authorName: 'Michael Hettmer',
        description: 'empty description',
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

        this.option('local', {
            alias: 'l',
            description: 'Skip all git push and publish steps including CI registration',
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
                        name: 'repoUserName',
                        message: `What is your user name in this repository?`,
                        default: this.answers.repoUserName,
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
                        name: 'dockerUserName',
                        message: `What is your docker user name?`,
                        default: this.answers.repoUserName.toLowerCase(), // reuse repoUserName
                        type: 'input',
                        store: true,
                    },
                    {
                        name: 'authorName',
                        message: `What is your real name?`,
                        default: startCase(this.answers.repoUserName), // reuse repoUserName
                        type: 'input',
                        store: true,
                    },
                    {
                        name: 'moduleName',
                        message: 'What do you want to name your module?',
                        default: kebabCase(
                            this.answers.repoName.replace(/^docker-/, '').replace(/\s/g, '-'),
                        ).toLowerCase(), // reuse repoName
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

        cps('.all-contributorsrc');
        cps('.dockerignore');
        cps('.gitattributes');
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
                        `https://circleci.com/api/v1.1/project/gh/${this.answers.repoUserName}/${this.answers.repoName}/envvar?circle-token=${process.env.CIRCLECI_TOKEN}`,
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

        this.spawnCommandSync('git', ['add', '.']);
        if (
            this.spawnCommandSync('git', ['commit', '-S', '-m', 'feat: initial commit [skip release]'], {
                stdio: [process.stderr],
            })
        )
            this.log(chalk.green(`successfully commited generated files as initial commit`));
        else this.log(chalk.red(`failed to commit generated files as initial commit`));

        if (!this.options.local && this.answers.repo === 'GitHub' && process.env.GITHUB_TOKEN) {
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
                    this.spawnCommandSync('git', ['remote', 'add', 'origin', result.data.ssh_url]);
                    this.log(chalk.green(`successfully set remote origin to ${result.data.ssh_url}`));
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
                        try {
                            const result = await axios.post(
                                `https://circleci.com/api/v1.1/project/gh/${this.answers.repoUserName}/${this.answers.repoName}/follow?circle-token=${process.env.CIRCLECI_TOKEN}`,
                                {},
                                { headers: { Accept: 'application/json' } },
                            );
                            if (result.status === 200) {
                                this.log(chalk.green(`successfully followed GitHub repository with CircleCI`));

                                await postCircleCIEnvVar('GITHUB_TOKEN');
                                await postCircleCIEnvVar('NPM_TOKEN');
                                await postCircleCIEnvVar('DOCKER_USERNAME');
                                await postCircleCIEnvVar('DOCKER_PASSWORD');
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
