import React, { FC, MouseEvent } from 'react';

import { AnswerType } from './App';

type MyProps = {
	question: string;
	answers: Array<string>;
	callback: (e: MouseEvent<HTMLButtonElement>) => void;
	userAnswer: AnswerType | undefined;
	display: boolean;
	correct: string;
};

const setClass = (display: boolean, current: string, correct: string) => {
	const def = 'btn col-md-5 my-2 mx-2';
	if (current !== correct) return `${def} btn-light`;
	if (!display) return `${def} btn-light`;
	return `${def} btn-success`;
};

const QuestionCard: FC<MyProps> = ({ question, answers, callback, userAnswer, display, correct }) => (
	<div id='qc'>
		<p dangerouslySetInnerHTML={{ __html: question }} />
		<div className='justify-content-between col-md-10 mx-auto'>
			{answers.map(ans => (
				<span key={ans}>
					<button
						disabled={Boolean(userAnswer)}
						onClick={callback}
						value={ans}
						className={setClass(display, ans, correct)}
					>
						<span dangerouslySetInnerHTML={{ __html: ans }} />
					</button>
				</span>
			))}
		</div>
	</div>
);

export default QuestionCard;
