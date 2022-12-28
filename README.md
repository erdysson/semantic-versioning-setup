### Semantic versioning setup

This repository contains setup for efficient development and versioning of your applications / libraries

### Content

- using [husky](https://github.com/typicode/husky) hooks for early notifications
- setting up [semantic release](https://github.com/semantic-release/semantic-release)
- running [commitlint](https://commitlint.js.org/#/) in your git hooks (and pipeline)

### Husky hooks

The usage of the git hooks in detail depends very much on your project. What we are interested here is running commitlint in the hooks, so for that purpose, [prepare-commit-msg](./.husky/prepare-commit-msg) hook looks like this to run commitlint

```shell
npx --no-install commitlint --from HEAD~1 --to HEAD --verbose
```

### Package.json overview

```json
{
    "devDependencies": {
        "@commitlint/cli": "^16.2.3",
        "@commitlint/config-conventional": "^16.2.1",
        "@semantic-release/changelog": "^6.0.1",
        "@semantic-release/commit-analyzer": "^9.0.2",
        "@semantic-release/exec": "^6.0.3",
        "@semantic-release/git": "^10.0.1",
        "@semantic-release/release-notes-generator": "^10.0.3",
        "semantic-release": "^19.0.2",
        "husky": "^7.0.4"
    },
    "repository": {
        "type": "git",
        "url": "https://github.com/erdysson/semantic-versioning-setup.git"
    }
}
```

#### Note

It is important to have the setting in [package.json](./package.json) below in order to see the **commits** between bug fixes / feature / breaking changes within the [changelog](./CHANGELOG.md) file.

```json
{
    "repository": {
        "type": "git",
        "url": "https://github.com/erdysson/semantic-versioning-setup.git"
    }
}
```

### .releaserc.json overview

This file is consumed by semantic-release.

```json
{
    "branches": [
        "master",
        "main"
    ],
    "plugins": [
        [
            "@semantic-release/commit-analyzer",
            {
                "preset": "angular",
                "releaseRules": [
                    {
                        "type": "your-custom-type",
                        "release": "minor|major|breaking"
                    },
                    {
                        "type": "breaking",
                        "release": "major"
                    }
                ]
            }
        ],
        "@semantic-release/release-notes-generator",
        [
            "@semantic-release/changelog",
            {
                "changelogFile": "CHANGELOG.md"
            }
        ],
        [
            "@semantic-release/exec",
            {
                "execCwd": ".",
                "prepareCmd": "npm version ${nextRelease.version} --no-git-tag-version"
            }
        ],
        [
            "@semantic-release/git",
            {
                "assets": [
                    "./package.json",
                    "./CHANGELOG.md"
                ],
                "message": "chore(your-scope): created tag ${nextRelease.version}\n\n${nextRelease.notes}"
            }
        ]
    ]
}
```

#### Note!

Be aware that custom types with functionality of path, minor and major release types, will not play nice with your changelog generator. So, I recommend you to stick with the types defined in types enum below.
Also, if you decide to extend release types, make sure that they are reflected to [commitlint.config.js](./commitlint.config.js) as well

### commitlint.config.js

This file is consumed by commitlint.

```javascript
module.exports = {
    extends: ['@commitlint/config-angular'],
    rules: {
        'header-max-length': [2, 'always', 72],
        'header-min-length': [2, 'always', 10],
        'type-enum': [2, 'always', ['your-custom-type', 'breaking', 'any-type-you-configured']],
        'scope-enum': [
            2,
            'always',
            [
                'my-app',
                'my-app-e2e',
                'my-lib',
                'shared-lib',
            ],
        ],
    },
};
```

You can find common types and many more settings from **conventional changelog** [here](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum)

### Setting up commitlint in pipeline

In my opinion, it is better to run commitlint in your pipeline as well, since commit hooks could be skipped locally with `--no-verify` flag. Therefore, if your deployments are based on the tags created by `semantic-release`, you may want to run commitlint in your pipeline.
In this regard, you can add the script below to your pipeline stage / job as an example; for gitlab ci

```shell
echo "${CI_COMMIT_MESSAGE}" | npx commitlint
```

### Test your setup

Finally, to see your changes and versions created by semantic-release, simply run

```shell
npx --no-install semantic-release
```

Which you can run in your pipeline in the same way as well.
