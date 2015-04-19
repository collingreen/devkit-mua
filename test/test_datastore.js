var chai = require('chai');
var assert = chai.assert;

var DataStore = jsio('tether.datastore');


describe('mua.tether.datastore', function () {
  describe('#datastore', function () {
    var store;

    before(function () {
      store = new DataStore({
        data: {
          foo: 'bar'
        }
      });
    });

    it('should accept initial data', function () {
      assert.equal(store._data.foo, 'bar');
    });

    it('should allow setting and getting data', function () {
      store.set({fizz: 'buzz'});
      assert.equal(store.get('fizz'), 'buzz');
    });

    it('should call update when setting data', function (done) {
      store.once('update', function () {
        done();
      });
      store.set({alice: 'bob'});
    });

    it('should include full data in update', function (done) {
      store.set({fizz: 'buzz'});
      store.once('update', function (info) {
        assert.property(info, 'store');
        assert.equal(info.store.alice, 'bob');
        assert.equal(info.store.fizz, 'buzz');
        done();
      });
      store.set({alice: 'bob'});
    });

    it('should include changed fields in update', function (done) {
      store.set({alice: 'bob'});
      store.once('update', function (info) {
        assert.property(info, 'updates');
        assert.equal(info.updates.alice.value, 'bob2');
        assert.equal(info.updates.alice.previousValue, 'bob');
        done();
      });
      store.set({alice: 'bob2'});
    });

    it('should support getting all the data', function () {
      var data = store.getData();
      store.set({fizz: 'buzz'});
      assert.equal(data.fizz, 'buzz');
    });
  });
});
