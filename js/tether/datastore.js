/**
 * DataStore
 *
 * Super simple wrapper around an object with
 * update events expected by tetherviews.
 *
 */
import lib.PubSub as PubSub;


exports = Class(PubSub, function (supr) {
  this.init = function (opts) {
    supr(this, 'init', opts);
    this._data = {};

    // initial update events
    this.set(opts.data);
  };

  /**
   * Update the data with the given object's key/values.
   * Does absolutely nothing fancy.
   *
   * Expects a flat object.
   * TODO: worthwhile to implement nested dict dot notation?
   */
  this.set = function (updateObject) {
    var resultObject = {};
    var keys = Object.keys(updateObject);
    for (var i in keys) {
      var key = keys[i];
      var previousValue = this._setOne(key, updateObject[key]);
      resultObject[key] = {
        value: updateObject[key],
        previousValue: previousValue
      };
    }

    this.update(resultObject);
  };

  this._setOne = function (key, value) {
    var previousValue = this._data[key];
    this._data[key] = value;
    return previousValue;
  };

  this.get = function (key) {
    return this._data[key];
  };

  // all the internal data for this store
  this.getData = function () {
    return this._data;
  };

  /**
   * Emit an update event
   * update (
   *    store: datastore,
   *    updates: {
   *      key: {
   *        value:
   *        previousValue;
   *      }
   *    }
   * )
   */
   this.update = function (updates) {
     this.emit('update', {
       updates: updates,
       store: this.getData()
      });
  };

});
