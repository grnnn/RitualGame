"use strict";

class GameManager
{
  constructor()
  {
    //Initialize state machine
    this.menuState = new State();
    this.combatState = new State();
    this.pauseState = new State();

    this.stateMachine = new StateMachine(this.menuState);

    //Initialize state updates, managers, and test functions
    this.menuState.setData({manager: new MenuManager()});
    this.menuState.setUpdate(function(m_state){
      m_state.data.manager.update();
    });
    this.menuState.setTransition(this.combatState, function(m_state){
      return m_state.data.manager.testTransitionToCombat();
    });
    this.menuState.setTransition(this.pauseState, function(m_state){
      return m_state.data.manager.testTransitionToPause();
    });

    this.combatState.setData({manager: new CombatManager()});
    this.combatState.setUpdate(function(c_state){
      c_state.data.manager.update();
    });
    this.combatState.setTransition(this.menuState, function(c_state){
      return c_state.data.manager.testTransitionToMenu();
    });
    this.combatState.setTransition(this.pauseState, function(c_state){
      return c_state.data.manager.testTransitionToPause();
    });

    this.pauseState.setData({manager: new PauseManager()});
    this.pauseState.setUpdate(function(p_state){
      p_state.data.manager.update();
    });
    this.pauseState.setTransition(this.menuState, function(p_state){
      return p_state.data.manager.testTransitionToMenu();
    });
    this.pauseState.setTransition(this.combatState, function(p_state){
      return p_state.data.manager.testTransitionToCombat();
    });

    this.stateMachine = new StateMachine(this.menuState);
  }

  update()
  {
    this.stateMachine.update();
  }
}
