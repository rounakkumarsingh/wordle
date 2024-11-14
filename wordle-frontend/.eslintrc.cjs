// .eslintrc.cjs
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json"],
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["react-refresh", "import", "@typescript-eslint"],
    settings: {
        react: { version: "18.2" },
        "import/resolver": {
            typescript: {},
        },
    },
    rules: {
        // Prevent default exports
        "import/no-default-export": "error",
        "import/prefer-default-export": "off",

        // Common best practices
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-unused-vars": "off", // Use TypeScript rule instead
        "@typescript-eslint/no-unused-vars": ["error"],
        "import/order": [
            "error",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                ],
                "newlines-between": "always",
                alphabetize: { order: "asc" },
            },
        ],

        // React rules
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/jsx-no-leaked-render": [
            "error",
            { validStrategies: ["ternary"] },
        ],

        // TypeScript rules
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports" },
        ],

        "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
        ],
    },
};
