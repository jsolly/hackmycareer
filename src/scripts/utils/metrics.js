/**
 * Counts the number of personal pronouns in a given text.
 *
 * @param {string} text - The input text to analyze for personal pronouns.
 * @returns {number} The count of personal pronouns found in the text.
 */
export function countPersonalPronouns(text) {
	const personalPronouns = [
		"i",
		"me",
		"my",
		"mine",
		"you",
		"your",
		"yours",
		"he",
		"him",
		"his",
		"she",
		"her",
		"hers",
		"it",
		"its",
		"we",
		"us",
		"our",
		"ours",
		"they",
		"them",
		"their",
		"theirs",
	];

	const words = text.toLowerCase().split(/\s+/);
	let pronounCount = 0;

	for (const word of words) {
		if (personalPronouns.includes(word)) {
			pronounCount++;
		}
	}

	return pronounCount;
}
