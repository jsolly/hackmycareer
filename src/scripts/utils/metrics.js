import { pipeline } from "@xenova/transformers";

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

export async function computeLLMEval(coverLetterText, jobDescriptionText) {
	const generator = await getGenerator();

	// Check if coverLetterText and jobDescriptionText are valid
	if (!coverLetterText || coverLetterText.trim() === "") {
		return "The cover letter text is empty or invalid.";
	}
	if (!jobDescriptionText || jobDescriptionText.trim() === "") {
		return "The job description text is empty or invalid.";
	}

	const prompt = `
		Please evaluate the effectiveness of the following cover letter in the context of the provided job description:

		**Cover Letter:**
		"${coverLetterText}"

		**Job Description:**
		"${jobDescriptionText}"

		Consider the following aspects:

		- **Relevance**: How well does the cover letter address the job requirements?
		- **Engagement**: Does it capture the reader's attention?
		- **Clarity**: Is it clear and easy to understand?
		- **Professionalism**: Does it present the candidate appropriately?
		- **Impact**: Does it make a strong, positive impression?

		Provide constructive feedback, highlighting strengths and areas for improvement. Offer specific suggestions on how to enhance the cover letter.
		`;

	const output = await generator(prompt, { max_length: 1000 });

	return output[0].generated_text.trim();
}

export async function extractKeywordsFromJobDescription(jobDescriptionText) {
	const generator = await getGenerator();

	const prompt = `
		Extract the most relevant keywords from the following job description:

		"${jobDescriptionText}"

		Provide a list of keywords that best represent the key skills, qualifications, and responsibilities mentioned in the job description.
	`;

	const output = await generator(prompt, { max_length: 100 });

	// Assuming the output is a comma-separated list of keywords
	const keywords = output[0].generated_text
		.trim()
		.split(",")
		.map((keyword) => keyword.trim());

	return keywords;
}
