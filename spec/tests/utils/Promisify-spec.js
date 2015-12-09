/* eslint prefer-arrow-callback: 0 */

const promisify = require('../../../src/utils/Promisify');

describe('Promisify', function() {
  beforeEach(function() {
    const test = this;
    test.successMessage = 'Successfully called this function';
    test.errorMessage = 'This is an error';

    this.standardFunction = (arg, cb) => {
      if (arg) {
        cb(null, test.successMessage);
      }
      else {
        cb(test.errorMessage);
      }
    };
  });

  it('can promisify a standard function with a callback and succeed', function(done) {
    const promisifiedFunction = promisify(this.standardFunction);
    promisifiedFunction(true)
      .then((res) => {
        expect(res).toBe(this.successMessage);
        done();
      });
  });

  it('can promisify a standard function with a callback and fail', function(done) {
    const promisifiedFunction = promisify(this.standardFunction);
    promisifiedFunction(false)
      .catch((err) => {
        expect(err).toBe(this.errorMessage);
        done();
      });
  });
});
