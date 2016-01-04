/* eslint prefer-arrow-callback: 0 */

const NodeGit = require('nodegit');
const Promise = require('nodegit-promise');

const Base = require('../../src/Base');
const Config = require('../../src/Config');

describe('Base', function() {
  beforeEach(function() {
    const repoConfig = {
      setString() {
        return Promise.resolve();
      }
    };
    this.repo = {
      config() {
        return Promise.resolve(repoConfig);
      }
    };

    spyOn(NodeGit.Branch, 'lookup').and.returnValue(Promise.resolve());
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
      return Base.init()
        .then(jasmine.fail)
        .catch((reason) => {
          expect(reason).toEqual(jasmine.any(Error));
          done();
        });
    });

    it('should return new flow object if repository is passed', function(done) {
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
  });

  describe('open', function() {
    it('should throw error if no repository is passed', function(done) {
      return Base.open()
        .then(jasmine.fail)
        .catch((reason) => {
          expect(reason).toEqual(jasmine.any(Error));
          done();
        });
    });

    it('should throw error if repository does not have gitflow initialized', function(done) {
      spyOn(Base, 'isInitialized').and.returnValue(Promise.resolve(false));

      return Base.open(this.repo)
        .then(jasmine.fail)
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
