var Base = require('../../src/Base');
var Config = require('../../src/Config');

describe('Base', function() {
  let test;

  beforeEach(function() {
    test = this;
  });

  it('should be able to require Flow', function() {
    expect(Base).toBeDefined();
  });

  it('should have static method `init` and `isInitialized` on Flow object', function() {
    expect(Base.init).toEqual(jasmine.any(Function));
    expect(Base.isInitialized).toEqual(jasmine.any(Function));
  });

  describe('Init', function() {
    beforeEach(function() {
      var repoConfig = {
        setString() {
          return Promise.resolve();
        }
      };
      test.repo = {
        config() {
          return Promise.resolve(repoConfig);
        },
        getBranch() {
          return Promise.resolve();
        }
      };
    });


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
      return Base.init(test.repo, defaultConfig)
        .then((flow) => {
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
          done();
        })
        .catch((reason) => {
          console.log(reason);
        });
    });
  });
});
