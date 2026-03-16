const {createDefaultPreset} = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.[tj]sx?$": ["ts-jest", {tsconfig: {allowJs: true}}],
    },
    testPathIgnorePatterns: [
        "<rootDir>/client/e2e/",
    ],
    transformIgnorePatterns: [
        "/node_modules/(?!(?:@faker-js/faker)/)",
    ]
};