import device;
import animate;
// import AudioManager;

import event.Emitter as EventEmitter;

import ui.View as View;

import ui.BlendEngine as BlendEngine;
import ui.ParticleEngine as ParticleEngine;


// import src.config.uiconfig as uiConfig;
// TODO: clean uiConfig format
uiConfig = {
  state: {
    transition: {
      style: 'slide',
      duration: 400
    }
  }
};


exports = Class(EventEmitter, function () {
  /**
   * Constructor. Called when GameController is initialized.
   *
   * Expects opts.gameView;
   */
  this.init = function (opts) {
    // debug flag
    this._debug = false;

    // save the config
    this.config = opts;

    // save the game view
    this.gameView = opts.gameView;

    // overwrite the gameView tick function with our own
    this.gameView.tick = bind(this, this.onTick);

    // particle engine
    this.particles = new ParticleEngine({superview: this.gameView});
    this.blendParticles = new BlendEngine({superview: this.gameView});

    // create data stores
    this.stores = this.createDataStores();

    // create game states
    this._states = this.createGameStates();

    // do other setup if necessary
    this.setup();

    // finally, call ready
    this.ready();
  };

  /*
   * Return an object with all of the data stores.
   */
  this.createDataStores = function () {
    return {};
  };

  /*
   * Return an object with all of your game states.
   */
  this.createGameStates = function () {
    logger.warn('createGameStates should be overwritten');
    return {};
  };

  /*
   * Override with additional setup requirements. Called once at initialization
   * after createGameStates and before ready.
   */
  this.setup = function () {
  };

  /*
   * Called after everything is set up.
   */
  this.ready = function () {
  };

  // set initial state
  this.start = function (weebyData) {
    this.reset();
  };

  // called to reset the entire game
  this.reset = function () {
    logger.warn("Reset - Not Implemented");
  };

  /**
   * Changes the current state. The active state is hidden (which
   * calls onBeforeHide and onAfterHide) and the new state is shown
   * (which calls onBeforeShow and onAfterShow).
   *
   *
   * Options:
   *   - instant: if true, does not animate states
   */
  this.setState = function (opts) {
    // assert(opts.state);
    // assert(opts.state in this._states);

    var curState = !!this._currentState;

    // hide the current state
    curState && this._currentState.onBeforeHide();

    var oldTarget = {};
    var newTarget = {};
    if (uiConfig.state.transition.style === 'slide') {
      oldTarget.x = -this.gameView.style.width;
      if (this._currentState) {
        this._currentState.style.x = this.gameView.style.width;
      }
      newTarget.x = 0;
    } else if (uiConfig.state.transition.style === 'turn') {
      oldTarget.scaleX = 0;
      if (this._currentState) {
        this._currentState.style.x = this.gameView.style.width;
        this._currentState.style.scaleX = 0;
      }
      newTarget.x = 0;
      newTarget.scaleX = 1;
    } else if (uiConfig.state.transition.style === 'fade') {
      oldTarget.opacity = 0;
      if (this._currentState) {
        this._currentState.style.opacity = 0;
      }
      newTarget.opacity = 1;
    }

    // animate out
    if (!opts.instant) {
      if (this._currentState) {
        var oldState = this._currentState;
        animate(oldState)
          .now(oldTarget, 1000)
          .then(function () {
            oldState.style.visible = false;
            oldState.onAfterHide && oldState.onAfterHide();
          });
      }
    }

    this._currentState = this._states[opts.state];
    this._currentState.style.visible = true;
    this._currentState.onBeforeShow();

    // animate in
    if (!opts.instant) {
      var newState = this._currentState;
      animate(this._currentState)
        .now(newTarget, uiConfig.state.transition.duration)
        .then(function () {
          newState.onAfterShow();
        });
    }
  };

  /**
   * Replaces the gameView tick function. Called every frame
   * with the time since the last frame in milliseconds.
   */
  this.onTick = function (dt) {
    // TODO: tools to smooth dt

    // get dt in seconds
    var dtSeconds = dt / 1000;

    // tick particle engines
    this.particles.runTick(dt);
    this.blendParticles.runTick(dt);
  };

  /**
   * Delegate for handling actions instead of GC.app
   */
  this.handleAction = function (actionName, opts) {
    // if action is a state change, handle it
    if (actionName === 'setState') {
      this.setState(opts.state);
    } else if (this._currentState && this._currentState.handleAction) {
      // send other actions to active game state
      this._currentState.handleAction.apply(
        this._currentState,
        arguments
      );
    }
  };
});
