"use strict";

class StateMachine
{
  constructor( currentState /*: State*/ )
  {
    //private
    this._currentState = currentState;
  }

  set currentState( currentState /*: State*/)
  {
    if (this._currentState !== undefined)
    {
      this._currentState = this._currentState.reset();
    }
    this._currentState = currentState;
  }

  update()
  {
    this._currentState.update(this._currentState);

    for (var i = 0; i < this._currentState.transitions.length; i++)
    {
      var transition = this._currentState.transitions[i];

      // test if we transition to another state
      if (transition.conditional(this._currentState))
      {
        this._currentState.reset();
        this._currentState = transition.state;
      }
    }
  }

}
