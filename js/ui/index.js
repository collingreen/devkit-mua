import device;

/**
 *
 * Scale - fit the narrow side, overflow the other
 *
 * Accepts a view and scales it to 576x1024 (or 1024x576 if
 * landscape) by stretching the narrow dimension to fit the device
 * exactly (on portrait, the width stretches to the edge) potentially
 * cropping the other dimension on resolutions that are not 16x9.
 * This method will not work for every application.
 *
 *   opts:
 *     - view: view to scale
 *     - orientation: portrait|landscape
 *     - center: if true, centers the view
 */
exports.scale = function (opts) {
  opts = opts || {};

  if (!opts.view) {
    return;
  }

  var orientation = opts.orientation || 'portrait';
  var small = 576;
  var large = 1024;
  var width, height, scale;

  // calculate scaled width and height
  if (orientation === 'portrait') {
    width = device.width;
    scale = device.width / small;
    height = large * scale;
  } else {
    height = device.height;
    scale = device.height / small;
    width = large * scale;
  }

  // update view
  opts.view.style.width = width;
  opts.view.style.height = height;

  // set anchorpoint if requested
  if (opts.center) {
    opts.view.style.anchorX = width / 2;
    opts.view.style.anchorY = height / 2;
  }
};

/**
 *
 * Safe - fit the wider side, shrinking the narrow
 *
 * Accepts a view and scales it to 576x1024 (or 1024x576 if
 * landscape) by stretching the wider dimension to fit the device
 * exactly (on portrait, the length stretches to the edge), potentially
 * letterboxing the other dimension on resolutions that are not 16x9.
 * This method will not work for every application.
 *
 *   opts:
 *     - view: view to scale
 *     - orientation: portrait|landscape
 */
exports.safe = function (opts) {
  opts = opts || {};

  if (!opts.view) {
    return;
  }

  var orientation = opts.orientation || 'portrait';
  var small = 576;
  var large = 1024;
  var width, height, scale;

  // calculate scaled width and height
  if (orientation === 'portrait') {
    height = device.height;
    scale = device.height / large;
    width = small * scale;
  } else {
    width = device.width;
    scale = device.width / large;
    height = small * scale;
  }

  // update view
  opts.view.style.width = width;
  opts.view.style.height = height;
};
