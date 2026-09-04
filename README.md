# ESLint File Overwrite via Symlink

This is a weakness in ESLint v10.3.0 where the `--fix` option follows symbolic links when writing autofix results.

An attacker who can provide a symlink as an ESLint input file can cause ESLint to modify the file referenced by that symlink rather than restricting the modification to the intended project file.

## Attack Chain

1. Create a symbolic link that points to a file outside of the intended project directory.
2. Configure an ESLint rule with an autofix operation that modifies the input file.
3. Run ESLint with the `--fix` option against the symbolic link.
4. ESLint follows the symbolic link and writes the autofix result to the linked file.

## Proof of Concept

The repository contains an `innocuous.js` symbolic link used as the ESLint input.

Run:

```bash
eslint --fix innocuous.js
```

ESLint processes the linked file and applies the configured autofix operation.

The resulting modification is written to the target of the symbolic link rather than being confined to the directory containing `innocuous.js`.

### Expected Behavior

An ESLint invocation operating on a project file should not unintentionally modify a different file outside the intended project through a symbolic link.

### Observed Behavior

The `--fix` operation follows the symbolic link and modifies the file at the end of the link.

## Impact

This behavior can allow an attacker-controlled project containing symbolic links to cause ESLint to modify files outside the project directory when ESLint is executed with `--fix`.

The security impact depends on:

- Which files are writable by the ESLint process.
- Whether the attacker can predict or otherwise control the symbolic-link target.
- Whether the modified file is subsequently interpreted, executed, or otherwise trusted by another process.

This proof of concept demonstrates the **file modification primitive**. It does not claim that arbitrary code execution occurs in every environment.

## Affected Version

- ESLint v10.3.0

## Classification

- CWE-59: Improper Link Resolution Before File Access ('Link Following')
- Potentially CWE-22: Improper Limitation of a Pathname to a Restricted Directory

## Reproduction

Clone this repository and install the required ESLint version.

Then run:

```bash
eslint --fix innocuous.js
```

The command may report an ESLint error after processing the file. The important behavior is that the autofix operation follows the symbolic link and writes to its target.

## Security Consideration

Applications and automation systems that execute ESLint with `--fix` against untrusted source trees should treat the source tree as potentially hostile.

In particular, symbolic links should not be assumed to remain within the directory being linted.

## Disclaimer

This repository demonstrates the behavior described above for security research purposes.