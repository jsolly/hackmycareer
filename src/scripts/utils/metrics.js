import { pipeline } from "@xenova/transformers";

/**
 * Counts the number of personal pronouns in a given text.
 *
 * @param {string} text - The input text to analyze for personal pronouns.
 * @returns {number} The count of personal pronouns found in the text.
 */
export function countPersonalPronouns(text) {
	const personalPronouns = [
		"I",
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

export async function analyzeFirstSentence(
	coverLetterText,
	jobDescriptionText,
) {
	const generator = await pipeline(
		"text2text-generation",
		"Xenova/LaMini-Flan-T5-783M",
	);

	const firstSentence = `${coverLetterText.split(". ")[0]}.`;

	const prompt = `

        First Sentence of Cover Letter:
        "${firstSentence}"
        
        Instruction:
        Evaluate the strength of the first sentence as an opening for the cover letter and explain your reasoning.
        `;

	const output = await generator(prompt, { max_length: 500 });

	return output[0].generated_text;
}
