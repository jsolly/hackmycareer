/**
 * Calculates the Flesch-Kincaid Grade Level for the given text and returns a human-readable description.
 * @param {string} text - The input text to analyze.
 * @returns {Object} An object containing the score and human-readable description.
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
