module.exports = {
  apps : [{
    name: 'Hunch',
    script: './dist/bin/www',
    autorestart: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],

  deploy : {
    production : {
      user : 'ec2-user',
      host : 'ec2-54-200-177-87.us-west-2.compute.amazonaws.com',
      key  : '~/.ssh/hunch_instance_key.pem',
      ref  : 'origin/master',
      repo : 'git@github.com:vincentbello/hunch.git',
      path : '/home/ec2-user/hunch',
      'post-deploy' : 'cd api && yarn && cp ~/.hunch_env .env && sudo cp public/privacy_policy.html /www/public/privacy_policy.html && npm run build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
