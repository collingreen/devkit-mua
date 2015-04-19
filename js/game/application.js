import ui.View as View;


exports = Class(View, function (supr) {

  /*
   * handleAction
   *
   * Function for routing all user actions through one controller on the global
   * GC.app object.
   *
   * Used by tether.
   *
   */
  this.handleAction = function () {
    logger.log("handleAction", arguments);
  };
});
