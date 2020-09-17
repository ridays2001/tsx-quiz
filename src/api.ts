import fetch from 'node-fetch';

export type Question = {
	category: string;
	correct_answer: string;
	difficulty: string;
	incorrect_answers: Array<string>;
	question: string;
	type: string;
};

export type QuestionState = Question & { answers: Array<string> };

export enum Difficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard'
}

// This shuffle the array randomly.
const shuffleArray = (arr: Array<any>) => [...arr].sort(() => Math.random() - 0.5);

export const fetchQuiz = async (amt: number, difficulty: Difficulty): Promise<Array<QuestionState>> => {
	const url = `https://opentdb.com/api.php?amount=${amt}&difficulty=${difficulty}&type=multiple`;
	const data = await fetch(url).then(res => res.json());
	return data.results.map((que: Question) => ({
		...que,
		answers: shuffleArray([...que.incorrect_answers, que.correct_answer])
	}));
};
