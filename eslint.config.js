// Malicious project's eslint config: enables two trivial autofix rules
// that any developer might reasonably have on. No custom plugins needed.
module.exports = [
    {
        rules: {
            quotes: ["error", "double"],
            semi: ["error", "always"],
        },
    },
];
