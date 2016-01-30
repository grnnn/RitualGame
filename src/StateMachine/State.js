export default class State
{
  constructor()
  {
    this.transitions = [];
  }

  setTransition( state, conditional )
  {
    var transition = {state: state, conditional: conditional};
    this.transitions.push(transition);
  }
}
