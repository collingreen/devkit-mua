/**
 * TetherView
 * 2015 - Collin Green - collin@collingreen.com
 *
 * Simple wrapper for view creation that subscribes to 'update' events on
 * DataStores. Essentially creates a very simple update loop where views attach
 * to stores and re-render themselves whenever that store data is updated.
 *
 * User interactions should be handled by the view and sent to the rest of the
 * application by calling `action`.  This calls `handleAction` on the
 * Application (since GC.app is already an available global). Allows routing
 * and controlling to happen nicely in one direction.
 *
 * TODO: remove devkit view and GC.app
 */
import ui.View as View;


exports = Class(View, function (supr) {
  this.init = function (opts) {
    supr(this, 'init', [opts]);
    this.stores = opts.stores || {};

    // overwrite create to build the view hierarchy
    this.create();

    // subscribe to update events on the stores
    var storeKeys = Object.keys(this.stores);
    for (var i = 0; i < storeKeys.length; i++) {
      var store = this.stores[storeKeys[i]];
      store.on('update', bind(this, 'update'));

      // call an initial update with the store data
      this.update({
        updates: {},
        store: store.getData()
      });
    }
  };

  /**
   * Called during initialization. Should be used to create
   * the custom ui components for this view.
   */
  this.create = function () {
    // console.log("No create function for view. This is probably an error.");
  };

  /**
   *
   * opts: {
   *   store: the entire dataset in the store,
   *   updates: {
   *     <key>: {
   *       value: new value,
   *       previousValue: value before change
   *     }
   *   }
   * }
   */
  this.update = function (opts) {
    // console.log("No update function defined for view");
  };

  /**
   * action
   *
   * Call to encapsulate a user action. Calls `handleAction` on
   * GC.app, which then gets distributed.
   */
  this.action = function () {
    GC.app.handleAction && GC.app.handleAction.apply(GC.app, arguments);
  };
});
