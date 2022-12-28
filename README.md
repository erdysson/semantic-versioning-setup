### Semantic versioning setup

This repository contains setup for efficient development and versioning of your applications / libraries

### Content

- semantic versioning setup
- using husky hooks for early notifications
- running [commitlint](https://commitlint.js.org/#/) in your pipeline

### Package.json overview

```json
{
    "devDependencies": {
        "@commitlint/cli": "^16.2.3",
        "@commitlint/config-angular": "16.2.3",
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
        "url": "url-to-your-repo.git"
    }
}
```

### .releaserc.json overview

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
#### Note on custom types

> Be aware that custom types with functionality of path, minor and major release types, will not play nice with your changelog generator. So, I recommend you to stick with the types defined in types enum below.

### commitlint.config.js

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

you can find common types from **conventional changelog** [here](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional#type-enum)
