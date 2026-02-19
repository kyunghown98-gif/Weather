import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { weatherAction } from '../redux/weatherAction'
import '../css/game.css'

const Game = () => {
  const dispatch = useDispatch()
  const { gameUser, gameCom, gameResult, gameScore } = useSelector(state => state.weather)

  return (
    <div className='game'>
      <div className='game-header'>
        <h2 className='game-title'>MINI GAME</h2>
        <div className='game-score'>
          <span className='score-win'>{gameScore.win}W</span>
          <span className='score-draw'>{gameScore.draw}D</span>
          <span className='score-lose'>{gameScore.lose}L</span>
        </div>
      </div>

      <div className='game-board'>
        <div className={`game-box ${gameResult === 'WIN' ? 'winner' : gameResult === 'LOSE' ? 'loser' : ''}`}>
          <span className='game-label'>YOU</span>
          <span className='game-emoji'>{gameUser ? gameUser.emoji : '❓'}</span>
          <span className='game-choice'>{gameUser ? gameUser.name : '-'}</span>
        </div>

        <div className='game-vs'>
          {gameResult ? (
            <span className={`game-result ${gameResult.toLowerCase()}`}>{gameResult}</span>
          ) : (
            <span className='game-result'>VS</span>
          )}
        </div>

        <div className={`game-box ${gameResult === 'LOSE' ? 'winner' : gameResult === 'WIN' ? 'loser' : ''}`}>
          <span className='game-label'>COM</span>
          <span className='game-emoji'>{gameCom ? gameCom.emoji : '❓'}</span>
          <span className='game-choice'>{gameCom ? gameCom.name : '-'}</span>
        </div>
      </div>

      <div className='game-buttons'>
        <button onClick={() => dispatch(weatherAction.playGame('scissors'))}>✌️ 가위</button>
        <button onClick={() => dispatch(weatherAction.playGame('rock'))}>✊ 바위</button>
        <button onClick={() => dispatch(weatherAction.playGame('paper'))}>🖐️ 보</button>
      </div>
    </div>
  )
}

export default Game