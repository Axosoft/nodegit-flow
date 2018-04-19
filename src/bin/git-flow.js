#!/usr/bin/env node

const promisify = require('../utils/Promisify');
const yargs = require('yargs');
const prompt = require('prompt');
const promptGet = promisify(prompt.get);
const Git = require('../');



const openRepoPromise = Git.Repository.open('./');

const getRepo = function() {
  return openRepoPromise;
};


const flowVerbBuilder = function(type, yargs) {
  yargs
    .command('start <name>', 'Start', {}, (argv) => {
      console.log('start', type, argv);
      const { name } = argv;
      return getRepo()
        .then((repo) => {
          if(type === 'feature') {
            return Git.Flow.startFeature(repo, name);
          }
          else if(type === 'release') {
            return Git.Flow.startRelease(repo, name);
          }
          else if(type === 'hotfix') {
            return Git.Flow.startHotfix(repo, name);
          }
        })
        .then((branch) => {
          console.log('Branch created:', branch && branch.shorthand());
        })
        .catch((err) => {
          console.log(`Error starting ${type}, ${name}`, err, err.stack);
        });
    })
    .command('publish <name>', 'Start', {}, (argv) => {
      console.log('publish', argv);
      console.log('`publish` command is not supported yet');
      /* * /
      return getRepo()
        .then((repo) => {
          var config = repo.config();
          var remoteOriginUrl = config.getString('remote.origin.url');

          return Git.Remote.create(
              repo,
              'origin',
              remoteOriginUrl
            )
            .then(function(remoteResult) {
              remote = remoteResult;

              // Create the push object for this remote
              return remote.push(
                // TODO: use proper ref
                ["refs/heads/master:refs/heads/master"],
                {
                  callbacks: {
                    credentials: function(url, userName) {
                      return nodegit.Cred.sshKeyFromAgent(userName);
                    }
                  }
                }
              );
            })
        });
        /* */
    })
    .command('finish <name>', 'Start', {}, (argv) => {
      console.log('finish', argv);
      const { name } = argv;
      return getRepo()
        .then((repo) => {
          if(type === 'feature') {
            return Git.Flow.finishFeature(repo, name);
          }
          else if(type === 'release') {
            return Git.Flow.finishRelease(repo, name);
          }
          else if(type === 'hotfix') {
            return Git.Flow.finishHotfix(repo, name);
          }
        })
        .then(function(mergeCommit) {
          console.log('asdf', arguments);
          console.log('Branch finished:', mergeCommit && mergeCommit.id());
        })
        .catch((err) => {
          console.log(`Error finishing ${type}, ${name}`, err, err.stack);
        });
    })
    .command('pull <name>', 'Start', {}, (argv) => {
      console.log('`pull` command is not supported yet');
    })
    .help('help')
    .alias('help', 'h')
    .argv;
};


const initHandler = function(argv) {
  console.log('init', argv);

  const defaultConfig = Git.Flow.getConfigDefault();
  const promptSchema = Object.keys(defaultConfig).reduce((schema, propName) => {
    schema.properties[propName] = {
      default: defaultConfig[propName],
      required: !!defaultConfig[propName]
    };

    return schema;
  }, { properties: {} });

  prompt.start();
  return promptGet(promptSchema)
    .catch((err) => {
      console.log('Error prompting for response', err, err.stack);
    })
    .then((resultConfig) => {
      return getRepo()
        .then((repo) => {
          return Git.Flow.init(repo, resultConfig);
        })
        .then(() => {
          console.log('git-flow is now initialized.');
        });
    })
    .catch((err) => {
      console.log('Error initializing git-flow', err, err.stack);
    });
};



yargs
  .command('init', 'Initialize git-flow in repository', {}, initHandler)
	.command('feature', 'Develop new features for upcoming releases', flowVerbBuilder.bind(null, 'feature'))
	.command('release', 'Support preparation of a new production release', flowVerbBuilder.bind(null, 'release'))
	.command('hotfix', 'Fix undesired state of a production release immediately ahead of a new production release', flowVerbBuilder.bind(null, 'hotfix'))
  .help('help')
  .alias('help', 'h')
  .argv;
