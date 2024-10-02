module.exports = {
    apps : [{
      script: 'index.js',
      watch: '.'
    }],
  
    deploy : {
      production : {
        "user": "ubuntu",
        "host": "15.207.82.210",
        "ref": "origin/main",
        "repo": "git@gitlab.n2rtechnologies.com:KrishnaMishra/jungle-crm-node.git",
        "path": "/var/www",
        'pre-deploy-local': '',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
        'pre-setup': ''
      }
    }
  };