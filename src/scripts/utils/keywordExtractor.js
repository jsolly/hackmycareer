import { getGenerator } from "./llmUtils";

export async function extractKeywordsFromText(text) {
	const generator = await getGenerator();

	const prompt = `
    Extract the most relevant keywords from the following text:

    "${text}"

    Provide a comma-separated list of keywords that best represent the main topics and themes in the text.
  `;

	const output = await generator(prompt, { max_length: 100 });

	// Assuming the output is a comma-separated list of keywords
	const keywordsText = output[0].generated_text.trim();

	// Split the keywords and trim whitespace
	const keywords = keywordsText
		.split(",")
		.map((keyword) => keyword.trim())
		.filter((keyword) => keyword.length > 0);

	return keywords;
}

export async function extractNegativeKeywords(text) {
	const generator = await getGenerator();

	const prompt = `
    Based on the following resume:

    "${text}"

    Identify job titles, roles, or terms that are **not relevant** or should be **excluded** from the candidate's job search. These might include positions the candidate wants to avoid or areas outside their expertise.

    Provide a comma-separated list of negative keywords that should be used to exclude irrelevant job postings.

    Negative Keywords:
  `;

	const output = await generator(prompt, { max_length: 150 });

	// Assuming the output is a list of keywords after "Negative Keywords:"
	const negativeKeywordsText = output[0].generated_text.trim();

	// Extract the keywords after "Negative Keywords:"
	const keywordsStartIndex = negativeKeywordsText.indexOf("Negative Keywords:");
	let keywordsList = negativeKeywordsText;

	if (keywordsStartIndex !== -1) {
		keywordsList = negativeKeywordsText.substring(
			keywordsStartIndex + "Negative Keywords:".length,
		);
	}

	// Split the keywords and trim whitespace
	const negativeKeywords = keywordsList
		.split(",")
		.map((keyword) => keyword.trim())
		.filter((keyword) => keyword.length > 0);

	return negativeKeywords;
}
