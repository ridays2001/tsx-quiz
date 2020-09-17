import React, { MouseEvent, useState } from 'react';

import QuestionCard from './QuestionCard';
import { fetchQuiz, Difficulty, QuestionState } from './api';

// CSS
import './styles/style.css';
import './styles/bootstrap.min.css';

export type AnswerType = {
	question: string;
	answer: string;
	isCorrect: boolean;
	correct: string;
};

const TOTAL_QUESTIONS = 10;

const App = () => {
	const [loading, setLoading] = useState(false);
	const [questions, setQuestions] = useState<Array<QuestionState>>([]);
	const [num, setNum] = useState(0);
	const [userAnswers, setUserAnswers] = useState<Array<AnswerType>>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(true);
	const [display, setDisplay] = useState(false);

	const startQuiz = async () => {
		setLoading(true);
		setGameOver(false);
		setScore(0);
		setUserAnswers([]);
		setNum(0);
		setDisplay(false);

		const newQuiz = await fetchQuiz(TOTAL_QUESTIONS, Difficulty.EASY);
		setQuestions(newQuiz);

		setLoading(false);
	};

	const checkAnswer = (e: MouseEvent<HTMLButtonElement>) => {
		if (gameOver) return undefined;
		setDisplay(true);
		const answer = e.currentTarget.value;
		const isCorrect = questions[num].correct_answer === answer;

		// Determine score based on difficulty.
		const difficulty = questions[num].difficulty;
		if (isCorrect) {
			if (difficulty === Difficulty.EASY) setScore(prev => prev + 1);
			else if (difficulty === Difficulty.MEDIUM) setScore(prev => prev + 5);
			else if (difficulty === Difficulty.HARD) setScore(prev => prev + 10);
			else setScore(prev => prev + 2);
		} else {
			e.currentTarget.classList.remove('btn-light');
			e.currentTarget.classList.add('btn-danger');
		}

		const newAns = {
			question: questions[num].question,
			correct: questions[num].correct_answer,
			answer,
			isCorrect
		};
		setUserAnswers(prev => [...prev, newAns]);
	};

	const nextQuestion = () => {
		setDisplay(false);
		setNum(n => n + 1);
	};

	const endGame = () => setGameOver(true);

	const startButton = (
		<div className='start'>
			<p>Click on the start button to start the quiz!</p>
			<button className='start btn btn-primary' id='startBtn' onClick={startQuiz}>
				Start
			</button>
		</div>
	);

	const nextButton = (gameOver: boolean, loading: boolean, userAnswers: Array<AnswerType>, num: number) => {
		if (gameOver || loading) return undefined;
		if (num === TOTAL_QUESTIONS - 1) return undefined;
		if (userAnswers.length !== num + 1) return undefined;
		return (
			<button className='next btn btn-primary mt-4 mb-2' onClick={nextQuestion}>
				Next Question
			</button>
		);
	};

	const endButton = (loading: boolean, num: number, gameOver: boolean, userAnswers: Array<AnswerType>) => {
		if (gameOver || loading) return undefined;
		if (num !== TOTAL_QUESTIONS - 1) return undefined;
		if (userAnswers.length !== num + 1) return undefined;
		return (
			<button className='end btn btn-primary mt-4 mb-2' onClick={endGame}>
				End Game
			</button>
		);
	};

	const qc = (
		loading: boolean,
		gameOver: boolean,
		num: number,
		questions: Array<QuestionState>,
		userAnswers: Array<AnswerType>
	) => {
		if (gameOver || loading) return undefined;
		return (
			<QuestionCard
				question={questions[num].question}
				answers={questions[num].answers}
				userAnswer={userAnswers[num]}
				callback={checkAnswer}
				display={display}
				correct={questions[num].correct_answer}
			/>
		);
	};

	return (
		<div className='App text-center col-md-8 col-lg-6'>
			<h2 id='heading'>TSX Quiz</h2>
			<div className='quiz col-md-10 mx-auto'>
				{gameOver && startButton}
				{!gameOver && (
					<div className='row justify-content-around my-5'>
						{<div className='info col-5 col-md'>Score: {score}</div>}
						{!loading && (
							<div className='info col-7 col-md'>
								Qs: {num + 1} / {TOTAL_QUESTIONS}
							</div>
						)}
					</div>
				)}
				{loading && <p>Loading Questions...</p>}
				{qc(loading, gameOver, num, questions, userAnswers)}
				{nextButton(gameOver, loading, userAnswers, num)}
				{endButton(loading, num, gameOver, userAnswers)}
			</div>
		</div>
	);
};

export default App;
