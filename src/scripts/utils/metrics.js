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

let generator;

async function getGenerator() {
	if (!generator) {
		generator = await pipeline(
			"text2text-generation",
			"Xenova/LaMini-Flan-T5-783M",
		);
	}
	return generator;
}

export async function analyzeFirstSentence(coverLetterText) {
	const generator = await getGenerator();

	// Extract the first sentence from the cover letter
	const firstSentence = coverLetterText.split(/(?<=[.!?])\s/)[0];

	// Check if firstSentence is valid
	if (!firstSentence || firstSentence.trim() === "") {
		return "The cover letter does not contain a valid opening sentence for evaluation.";
	}

	const prompt = `
        Please evaluate the effectiveness of the following first sentence from a cover letter:

        "${firstSentence}"

        Consider the following aspects:

        - **Engagement**: Does it capture the reader's attention?
        - **Clarity**: Is it clear and easy to understand?
        - **Professionalism**: Does it present the candidate appropriately?
        - **Impact**: Does it make a strong, positive impression?

        Provide constructive feedback, highlighting strengths and areas for improvement. Offer specific suggestions on how to enhance the sentence.
        `;

	const output = await generator(prompt, { max_length: 500 });

	return output[0].generated_text.trim();
}
