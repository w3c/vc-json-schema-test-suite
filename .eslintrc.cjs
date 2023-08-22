module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        'google',
        'plugin:react/recommended',
    ],
    'overrides': [
        {
            'env': {
                'node': true,
            },
            'files': [
                '.eslintrc.{js,cjs}',
            ],
            'parserOptions': {
                'sourceType': 'script',
            },
        },
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
    },
    'plugins': [
        'react',
    ],
    'rules': {
        "max-len": [
            "error",
            {
                "code": 100,
                "tabWidth": 2,
                "ignoreComments": true, //"comments": 80
                "ignoreUrls": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true
            }
        ]
    },
};
