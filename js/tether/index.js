/**
 * Tether
 * 2015 - Collin Green - collin@collingreen.com
 *
 * An extremely simple (too simple?) framework for one way data binding,
 * modular components, and sane user interaction.
 *
 * UI --action--> GC.app.handleAction --> DataStore ---update---> view
 */

import .datastore as DataStore;
import .tetherview as TetherView;


exports = {
  DataStore: DataStore,
  TetherView: TetherView
};
