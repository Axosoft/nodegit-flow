import { defineConfig } from "eslint/config";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import jsdoc from 'eslint-plugin-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: [compat.extends("eslint:recommended"), jsdoc.configs['flat/recommended']],
    plugins: { jsdoc },

    languageOptions: {
        globals: {
            ...globals.jasmine,
            ...globals.node,
            pit: true,
        },
    },

    rules: {
        indent: [2, 2],
        "no-console": 1,
        "no-const-assign": 2,
        "no-trailing-spaces": 2,
        "no-var": 2,
        "prefer-arrow-callback": 2,
        "prefer-const": 2,
        quotes: [2, "single"],
        semi: [2, "always"],
        "jsdoc/check-param-names": 0,
        "jsdoc/no-undefined-types": 0,
        "jsdoc/require-param-description": 0,
        "jsdoc/require-param-type": 0,
        "jsdoc/require-returns": 0
    },
}]);
