MUA Games Devkit Toolkit
---------

Some tools for building games in devkit.

NOTE: This is extremely experimental and will change rapidly. You have been
warned.

Run the tests before using (`npm test`). Add tests and docs when contributing.


## Layout
Game -
- Application -- base game application to subclass
- GameController -- base gamecontroller to subclass
- GameState -- base gamestate to subclass

Tether -
- DataStore -- simple data store for tether
- TetherView -- base view that reacts to datastore changes and emits actions


## Overview
When all used together, this forms a system for simplifying and modularizing
as many things as possible, which generally seems to be lacking in game
development. MUA and Tether follow a React-like 'one direction of event flow'
model: user action and other game changes are emitted as `action`s, which get
sent to the top level GC.App (which should be a subclass of mua.Application)
and then can be disseminated down the line to the active controller and
gamestate, which in turn update the datastores, which causes all of the
tetherviews attached to those stores to update themselves.

This provides a clean separation of concerns - views don't need to know anything
about the game - they just know how to represent the data and optionally emit
user actions, data lives happily in datastores, gamestates or the gamecontroller
respond to user actions to update the data. It also makes it much easier to
re-use components and to create complicated UI without creating unmanageable
mental overhead and shared state.

Essentially data flows through the application like this:
```
UI -> User Action -> Application -> GameController -> Active GameState ->
DataStores -> UI Updates
```


### MUA Application
The MUA Application simply defines the `handleAction` function. This is the very
top level of the tether event chain.


### MUA GameController
All important top level game code should go in a MUA GameController. The
GameController handles creating everything for the game (including GameStates
and DataStores) and manages both resetting the game and transitioning between
active GameStates. The GameController passes all actions on to the currently
active GameState.

On setup, the GameController instantiates a particle engine, binds a custom tick
function, wraps the game view, and calls a bunch of setup functions in a row:

`this.stores = this.createDataStores();`
Create all of your tether DataStores here and return an object pointing to
them all. This gets saved on the gamecontroller in `this.stores`.

`this._states = this.createGameStates();`
Create your GameStates here and return as an object pointing to them all. This
gets saved on the gamecontroller in `this._states`.

`this.setup();`
Do any other custom game setup here.

`this.ready();`
This gets called after all setup is finished.

`this.reset()`
Put code here to reset the game (and ideally nowhere else).

`this.setState(opts)`
Change the currently active state.


### MUA GameState
GameStates wrap up all of the views (tetherviews and normal views) for one
'state' of the game (for example, the gameplay, a pause screen, a menu, or a
shop). These should all be created in the GameController setup and should be
given any DataStores they need access to in order to render correctly.

GameStates are where most action handling will be done -- you should respond
to user actions in the `handleAction` function and update the DataStores
accordingly. This in turn updates all the listening TetherViews.


### Tether
Tether is a simple one way data binding system that underpins the entire system.
Tether includes DataStores which hold arbitrary data and emit `update` events
when changed, plus TetherViews which get subscribed to those updates
automatically by the GameStates that create them and know how to render that
information correctly (and re-render that any time the DataSource gets updated).


### TetherView
Subclass TetherView for anything that needs to render differently based on
current data (for example, a score, a lives bar, a shop) or that a user
interacts with directly (for example, a button).

On initialization, TetherViews expect an object of DataStores -- the view
will subscribe to update events for every DataStore in this object.

`this.create`
Overwrite this with any code to be run once on creation (generally creating
subviews).

`this.update`
Overwrite this to handle rendering (this is called when the view is created and
any time the DataStores are updated). This function is passed an object with
`updates` (an object with a key for every changed field) and `store` (all of the
the data in the updated store). If you want fine grained control, use the
`updates` dict, look for the relevant keys, and use the `value` and
`previousValue` properties as necessary. If you just want to hit the problem
with a sledgehammer, simply read the field you want from the `store` parameter
and update accordingly.

`this.action`
UI elements can communicate purely visual information with their gamestate
by emitting events (`this.emit`), but any user interaction that changes data or
the game should be sent to the top using the `this.action` function so
everything that needs to respond to those actions will get a chance. Any
arguments passed in to action are sent all the way through to the GameController
and GameState `handleAction` functions.


## Example
As an example, imagine a simple game where you click on a ball and it bounces
around, with a score for how many times you click. You can see
[this example on github](https://github.com/collingreen/muaBallExample).

In the MUA system, this would be an application and a game controller
with a single DataSource (perhaps {score: 0}) and a single GameState. There
would likely be two TetherViews, one for showing text with the score and one for
the ball. On click, the ball would send an action (perhaps `ballHit`), which
would get sent down from the Application to the GameController to the active
GameState. In the GameState `handleAction` function, when a `ballHit` action is
seen, the player's score will be incremented, which will trigger the score
tetherview to update itself, resetting the score text to be correct.

While the system for this simple example is slightly more cumbersome than just
writing a minimal application, it already demonstrates how the UI can be
separated from the game logic. Changing the game to have multiple balls is as
simple as duplicating the ball view. Each new ball will send the same `ballHit`
action, which means everything else is already working. Similarly, imagine
wanting to change the score from text to a progress bar showing the score out of
100. This simply requires updating the score tetherview to render the score from
the DataStore as a progress bar -- nothing else needs to know how the score view
works (or even that it exists). The score is updated in the DataStore, and the
score reacts accordingly.
