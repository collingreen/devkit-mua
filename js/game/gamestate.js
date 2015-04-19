/**
 * Base class for game states. Fits into mua.game.gamecontroller
 * for easy state management.
 *
 */

import ui.View as View;


exports = Class(View, function (supr) {

  /**
   * opts:
   *   - gameView: superview for this state
   *   - stores: object of all the datastores
   */
  this.init = function (opts) {
    // assert(opts.gameView);

    supr(this, 'init', {});

    this.gameView = opts.gameView;
    this.gameView.addSubview(this);
    this.style.width = this.gameView.style.width;
    this.style.height = this.gameView.style.height;
    this.style.visible = false;

    // save the datastores
    this.stores = opts.stores || {};

    this.setup();
  };

  this.setup = function () {};

  this.onBeforeShow = function () {};
  this.onAfterShow = function () {};
  this.onBeforeHide = function () {};
  this.onAfterHide = function () {};

  this.onTick = function (dt) {};
});
