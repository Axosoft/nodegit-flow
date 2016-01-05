/* eslint prefer-arrow-callback: 0 */

const NodeGit = require('nodegit');
const Promise = require('nodegit-promise');

const Base = require('../../src/Base');
const Config = require('../../src/Config');

describe('Base', function() {
  beforeEach(function() {
    const repoConfig = {
      getString(key) {
        const defaultConfig = Config.getConfigDefault();
        return defaultConfig[key] || true;
      },
      setString() {
        return Promise.resolve();
      }
    };
    this.repo = {
      config() {
        return Promise.resolve(repoConfig);
      },
      createBranch() {
        return Promise.resolve();
      },
      getBranchCommit() {
        return Promise.resolve({id(){ return '12345';}});
      }
    };
  });

  it('should be able to require Base', function() {
    expect(Base).toBeDefined();
  });

  it('should have all its static methods', function() {
    expect(Base.init).toEqual(jasmine.any(Function));
    expect(Base.isInitialized).toEqual(jasmine.any(Function));
    expect(Base.open).toEqual(jasmine.any(Function));
  });

  describe('init', function() {
    it('should throw error if no repository is passed', function(done) {
      spyOn(NodeGit.Branch, 'lookup').and.returnValue(Promise.resolve());
      return Base.init()
        .then(jasmine.fail)
        .catch((reason) => {
          expect(reason).toEqual(jasmine.any(Error));
          done();
        });
    });

    it('should return new flow object if repository is passed', function(done) {
      spyOn(NodeGit.Branch, 'lookup').and.returnValue(Promise.resolve());
      const defaultConfig = Config.getConfigDefault();
      return Base.init(this.repo, defaultConfig)
        .then((flow) => {
          expect(flow).toBeDefined();
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
          done();
        });
    });

    it('develop branch should exist after initialization', function(done) {
      spyOn(NodeGit.Branch, 'lookup').and.returnValue(Promise.resolve());
      const defaultConfig = Config.getConfigDefault();
      return Base.init(this.repo, defaultConfig)
        .then(() => Base.developBranchExists(this.repo))
        .then((exists) => {
          expect(exists).toBeTruthy();
          done();
        });
    });

    it('develop branch should not exist after initialization and delete develop branch', function(done) {
      const defaultConfig = Config.getConfigDefault();
      spyOn(NodeGit.Branch, 'lookup').and.callFake((repo, branchName) => {
        if (branchName === defaultConfig['gitflow.branch.develop']) {
          return Promise.reject(new Error('Could not find branch'));
        }
        return Promise.resolve();
      });
      return Base.init(this.repo, defaultConfig)
        .then(() => Base.developBranchExists(this.repo))
        .then((exists) => {
          expect(exists).toBeFalsy();
          done();
        });
    });

    it('master branch should not exist after initialization and delete master branch', function(done) {
      const defaultConfig = Config.getConfigDefault();
      spyOn(NodeGit.Branch, 'lookup').and.callFake((repo, branchName) => {
        if (branchName === defaultConfig['gitflow.branch.master']) {
          return Promise.reject(new Error('Could not find branch'));
        }
        return Promise.resolve();
      });
      return Base.masterBranchExists(this.repo)
        .then((exists) => {
          expect(exists).toBeFalsy();
          done();
        });
    });
  });

  describe('open', function() {
    beforeEach(function() {
      spyOn(NodeGit.Branch, 'lookup').and.returnValue(Promise.resolve());
    });

    it('should throw error if no repository is passed', function(done) {
      return Base.open()
        .catch((reason) => {
          expect(reason).toEqual(jasmine.any(Error));
          done();
        });
    });

    it('should throw error if repository does not have gitflow initialized', function(done) {
      spyOn(Base, 'isInitialized').and.returnValue(Promise.resolve(false));

      return Base.open(this.repo)
        .catch((reason) => {
          expect(reason).toEqual(jasmine.any(Error));
          done();
        });
    });

    it('should create a Flow instance for an already initialized repository', function(done) {
      spyOn(Base, 'isInitialized').and.returnValue(Promise.resolve(true));

      return Base.open(this.repo)
        .then((flow) => {
          expect(flow).toBeDefined();
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
          done();
        });
    });
  });
});
