"use strict";

//Dinky little state class
class State
{
  constructor()
  {
    //public
    this.transitions = [];
    this.data = {};
    this.update = function(state){};

    //private
    this._resetData = {};
  }

  setTransition( state /*: State*/, conditional /*:bool(State)*/, priority /*:int*/)
  {
    var transition = { targetState: state,
                       conditional: conditional,
                       priority: priority };
    this.transitions.push(transition);

    this.transitions.sort(function(a, b){
      return a.priority - b.priority;
    });
  }

  setTransition( state /*: State*/, conditional /*:bool(State)*/)
  {
    var transition = { targetState: state,
                       conditional: conditional,
                       priority: 0 };
    this.transitions.push(transition);

    this.transitions.sort(function(a, b){
      return a.priority - b.priority;
    });
  }

  setData(data /*{}*/)
  {
    this._resetData = data;
    this.data = data;
  }

  setUpdate(update /*: void(State)*/)
  {
    this.update = update;
  }

  reset()
  {
    this.data = this._resetData;
  }
}

/* Usage:
var stateA = new State();
stateA.setData({timer: 60});

var stateB = new State();

function exampleConditional(state)
{
  return state.data.timer == 0;
}

stateA.setTransition(stateB, exampleConditional);
stateA.setUpdate(function(state){
  state.data.timer--;
});

When the timer in stateA reaches 0, the StateMachine will transition to stateB.
Conditionals are tested every frame. When transitioning to a new state, the
'data' field of the old state will be reset.

*/
