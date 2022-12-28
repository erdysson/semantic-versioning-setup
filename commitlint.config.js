module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'header-max-length': [2, 'always', 72],
        'header-min-length': [2, 'always', 10],
        'scope-enum': [
            2,
            'always',
            [
                'semantic-versioning-setup',
                'any-scope-you-configured',
            ],
        ],
    },
};
