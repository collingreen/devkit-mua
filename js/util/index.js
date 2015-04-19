/**
 * Utility functions for various common tasks.
 *
 */
exports = {
  /**
   * Return a number from -X to X.
   */
  plusOrMinus: function (x) {
    return (Math.random() * x * 2) - x;
  }
};
