var Base = require('../src/Base');
const pit = function(description, spec) {
  it(description, (done) => {
    spec()
      .then(done)
      .catch(done)
  });
};

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
        setString: function() {
          return Promise.resolve();
        }
      };
      this.repo = {
        config: function() {
          return Promise.resolve(repoConfig);
        }
      };
    });


    pit('should throw error if no repository is passed', function() {
      return Base.init()
        .then(function() {
          fail();
        })
        .catch(function(reason) {
          expect(reason).toEqual(jasmine.any(Error));
        });
    });

    pit('should return new flow object if repository is passed', function() {
      return Base.init(test.repo)
        .then(function(flow) {
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startFeature).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startHotfix).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
          expect(flow.startRelease).toEqual(jasmine.any(Function));
        });
    });
  });
});
