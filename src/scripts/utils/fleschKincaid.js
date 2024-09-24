/**
 * Calculates the Flesch-Kincaid Grade Level for the given text and returns a human-readable description.
 * @param {string} text - The input text to analyze.
 * @returns {score: number, description: string} An object containing the Flesch-Kincaid score and a description.
 */
export function calculateFleschKincaidGradeLevel(text) {
	const cleanText = text.replace(/[^\w\s]/g, "").toLowerCase();

	const words = cleanText.split(/\s+/);
	const sentences = text.split(/[.!?]+/).filter(Boolean);

	function countSyllables(word) {
		const vowels = word.match(/[aeiou]/gi);
		let count = vowels ? vowels.length : 0;
		if (word.length > 3 && word.endsWith("e")) count--;
		if (word.length > 3 && word.endsWith("le")) count++;
		return Math.max(1, count);
	}

	const totalSyllables = words.reduce(
		(sum, word) => sum + countSyllables(word),
		0,
	);

	const averageWordsPerSentence = words.length / sentences.length;
	const averageSyllablesPerWord = totalSyllables / words.length;

	const score =
		206.835 - 1.015 * averageWordsPerSentence - 84.6 * averageSyllablesPerWord;

	function getReadabilityDescription(score) {
		if (score >= 90)
			return "5th grade: Very easy to read. Easily understood by an average 11-year-old student.";
		if (score >= 80)
			return "6th grade: Easy to read. Conversational English for consumers.";
		if (score >= 70) return "7th grade: Fairly easy to read.";
		if (score >= 60)
			return "8th & 9th grade: Plain English. Easily understood by 13- to 15-year-old students.";
		if (score >= 50) return "10th to 12th grade: Fairly difficult to read.";
		if (score >= 30) return "College: Difficult to read.";
		if (score >= 10)
			return "College graduate: Very difficult to read. Best understood by university graduates.";
		return "Professional: Extremely difficult to read. Best understood by university graduates.";
	}

	return {
		score: Number.parseFloat(score.toFixed(1)),
		description: getReadabilityDescription(score),
	};
}

/**
 * Returns the top 10 sentences with the highest Flesch-Kincaid reading level as <li> tags with Tailwind classes applied.
 * @param {string} text - The input text to analyze.
 * @returns {Array<string>} An array of <li> strings with the appropriate Tailwind classes applied.
 */
export function getTop10SentencesByReadingLevel(text) {
	const sentences = text.split(/[.!?]+/).filter(Boolean);

	// Map Flesch-Kincaid score to Tailwind class
	function getTailwindClass(score) {
		if (score >= 40) return "text-green-400"; // Very easy
		if (score < 50) return "text-orange-400"; // Difficult
		return "text-red-400";
	}

	// Create an array of sentences with their corresponding Flesch-Kincaid score
	const sentenceScores = sentences.map((sentence) => {
		const { score } = calculateFleschKincaidGradeLevel(sentence);
		return { sentence: sentence.trim(), score };
	});

	// Sort sentences by score in descending order
	const sortedSentences = sentenceScores.sort((a, b) => a.score - b.score);

	// Map sorted sentences to <li> elements with the appropriate Tailwind class and score
	const sortedSentenceElements = sortedSentences.map(({ sentence, score }) => {
		const className = getTailwindClass(score);
		return `<li class="${className}">${sentence} (${score.toFixed(1)})</li>`;
	});

	// Return the top 10 sentences or fewer if there are less than 10
	return sortedSentenceElements.slice(0, 10);
}
