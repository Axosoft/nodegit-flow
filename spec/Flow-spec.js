var Flow = require('../src/Flow');

describe('Flow', function() {
  it('should be able to require Flow', function() {
    expect(Flow).toBeDefined(Flow);
  });

  it('should have static method `init` and `isInitialized` on Flow object', function() {
    expect(Flow.init).toEqual(jasmine.any(Function));
    expect(Flow.isInitialized).toEqual(jasmine.any(Function));
  });

  describe('Init', function() {
    it('should throw error if no repository is passed', function() {
      Flow.init()
        .then(function() {
          fail();
        })
        .catch(function(reason) {
          expect(reason).toEqual(jasmine.any(Error));
        });
    });

    it('should return new flow object if repository is passed', function() {
      var flow = Flow.init({repository: {}});
      expect(flow.startFeature).toEqual(jasmine.any(Function));
      expect(flow.startFeature).toEqual(jasmine.any(Function));
      expect(flow.startHotfix).toEqual(jasmine.any(Function));
      expect(flow.startHotfix).toEqual(jasmine.any(Function));
      expect(flow.startRelease).toEqual(jasmine.any(Function));
      expect(flow.startRelease).toEqual(jasmine.any(Function));
    });
  });

  describe('Static methods', function() {
    it('should contain all of the static methods', function() {
      expect(Flow.startFeature).toEqual(jasmine.any(Function));
      expect(Flow.startFeature).toEqual(jasmine.any(Function));
      expect(Flow.startHotfix).toEqual(jasmine.any(Function));
      expect(Flow.startHotfix).toEqual(jasmine.any(Function));
      expect(Flow.startRelease).toEqual(jasmine.any(Function));
      expect(Flow.startRelease).toEqual(jasmine.any(Function));
    });
  });
});
