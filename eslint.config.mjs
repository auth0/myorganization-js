import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            // Allow namespaces (commonly used in generated code and type declarations)
            "@typescript-eslint/no-namespace": "off",
            // Allow empty interfaces/objects (common in API types)
            "@typescript-eslint/no-empty-object-type": "off",
        },
    },
    // Relaxed rules for test files
    {
        files: ["tests/**/*.ts", "**/*.test.ts", "**/*.spec.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-misused-promises": "off",
        },
    },
    // Relaxed rules for core/generated files
    {
        files: ["src/core/**/*.ts", "src/api/**/*.ts", "src/Client.ts", "src/BaseClient.ts", "src/errors/**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-return": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-redundant-type-constituents": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-base-to-string": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-unnecessary-type-assertion": "off",
            "no-case-declarations": "off",
            "prefer-const": "off",
        },
    },
    {
        ignores: [
            "dist/**",
            "node_modules/**",
            "coverage/**",
            "docs/**",
            "package/**",
            "*.js",
            "*.mjs",
            "scripts/**",
            ".mock/**",
            "*.config.ts",
            "*.config.js",
            "*.config.mjs",
            "example.ts",
            "tests/mock-server/**",
        ],
    },
];
