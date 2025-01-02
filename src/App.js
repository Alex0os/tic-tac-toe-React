import { createElement, useState } from "react";

function rowAndCol(lastPlayIndex) {
	let row, column;
	if (lastPlayIndex <= 2 && lastPlayIndex >= 0)
		row = 1;
	else if (lastPlayIndex <= 5 && lastPlayIndex >= 3)
		row = 2;
	else if (lastPlayIndex <= 8 && lastPlayIndex >= 6)
		row = 3;

	if (lastPlayIndex % 3 === 0)
		column = 1;
	else if (lastPlayIndex % 3 === 1)
		column = 2;
	else if (lastPlayIndex % 3 === 2)
		column = 3;

	return [row, column];
}


function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], lines[i]];
		}
	}
	return null;
}


function Square({isWinner, value, onSquareClick}) {
	return <button 
	className={isWinner ? "winnerSquare": "square"}
	onClick={onSquareClick}>
		{value}
		</button>
}

function Board({xIsNext, squares, onPlay}) {
	function handleClick(i) {
		if (squares[i] || calculateWinner(squares))
			return;

		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = "X";
		}
		else {
			nextSquares[i] = "O"
		}
		onPlay(nextSquares)
	}

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner[0];
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}


	const createSqrs = (i) => squares.slice(i * 3, i * 3 + 3).map((sqr, index) => {

		return <Square isWinner={winner && winner[1].includes(i * 3 + index)} key={i * 3 + index} value={sqr} onSquareClick={() => handleClick(i * 3 + index)}/>;
		// You were calling the handleClick function instead of passing a
		// function object
	});

	const board = Array(3).fill().map((_, index) => {
		return createElement("div", {key: index, className: "board-row"}, createSqrs(index));
	});

	return ( 
      <>
		<div className="status">{status}</div>
		{board}
    </>)
}


export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xAsNext = currentMove % 2 === 0;
	const currentBoard = history[currentMove];
	const [games, changeCurrentGame] = useState([0]);


	function handlePlay(squares) {
		const nextHistory = [...history.slice(0, currentMove + 1), squares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);

		const diffIndex = currentBoard.findIndex((value, index) => {
			return currentBoard[index] !== squares[index];
		})
		changeCurrentGame([...games, rowAndCol(diffIndex)]);
	}


	function jumpTo(selectedMove) {
		setCurrentMove(selectedMove)
		// It works but it shows undefined when I go back into a previous play
		changeCurrentGame(games.slice(0, selectedMove + 1));
	}

	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			description = `Go to move # ${move} -> ${games[move]}`;
		} else {
			description = "Go to game start";
		}
		return (
			<li>
			<button key={move} onClick={
				() => jumpTo(move)}>{description}</button>
			</li>
		)
	})


	return (
		<div className="game">
		  <div className="game-board">
		   <Board xIsNext={xAsNext} squares={currentBoard} onPlay={handlePlay}/>
		  </div>
		  <div className="game-info">
			<ol>{moves}</ol>
		  </div>
		</div>
	);
}
