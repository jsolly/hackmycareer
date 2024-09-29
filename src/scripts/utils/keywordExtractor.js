import { getGenerator } from "./llmUtils";
import keyword_extractor from "keyword-extractor";

/**
 * Generic function to extract and refine keywords from text using an LLM.
 * @param {string} text - The input text to extract keywords from.
 * @param {string} promptTemplate - The template for the LLM prompt.
 * @param {number} maxLength - The maximum length of the LLM output.
 * @returns {Promise<string[]>} - A promise that resolves to an array of refined keywords.
 */
async function extractKeywordsFromText(text, promptTemplate, maxLength = 500) {
	const generator = await getGenerator();

	// Preprocess the text
	const cleanedText = text.replace(/[^\w\s:]/gi, "");

	// Use keyword-extractor to get initial keywords
	const initialKeywords = keyword_extractor.extract(cleanedText, {
		language: "english",
		remove_digits: true,
		return_changed_case: true,
		remove_duplicates: true,
		return_max_ngrams: 3,
	});

	const prompt = promptTemplate.replace(
		"{{keywords}}",
		initialKeywords.join(", "),
	);

	const output = await generator(prompt, { max_length: maxLength });

	// Improved output parsing
	let keywordsText = output[0]?.generated_text.trim() || "";
	keywordsText = keywordsText.replace(/[\n;]/g, ", ");
	keywordsText = keywordsText.replace(/ - /g, ", ");

	// Remove any leading dashes
	if (keywordsText.startsWith("- ")) {
		keywordsText = keywordsText.substring(2);
	}

	const refinedKeywords = keywordsText
		.split(/,|\n|;/)
		.map((keyword) => keyword.trim())
		.filter((keyword) => keyword.length > 0);

	if (refinedKeywords.length === 0) {
		throw new Error("No keywords were extracted from the LLM's output.");
	}

	return refinedKeywords;
}

/**
 * Extracts refined keywords from a resume text.
 * @param {string} text - The resume text to extract keywords from.
 * @param {number} maxLength - The maximum length of the LLM output.
 * @returns {Promise<string[]>} - A promise that resolves to an array of refined keywords.
 */
export async function extractKeywordsFromResumeText(text, maxLength = 500) {
	const promptTemplate = `
    Refine the following keywords for a LinkedIn search query.

    {{keywords}}

    Provide a concise, comma-separated list of the most relevant skills and qualifications.
  `;
	return await extractKeywordsFromText(text, promptTemplate, maxLength);
}

/**
 * Extracts refined keywords from a job description text.
 * @param {string} text - The job description text to extract keywords from.
 * @param {number} maxLength - The maximum length of the LLM output.
 * @returns {Promise<string[]>} - A promise that resolves to an array of refined keywords.
 */
export async function extractKeywordsFromJobDescriptionText(
	text,
	maxLength = 500,
) {
	const promptTemplate = `
    Refine the following keywords extracted from a job description for a LinkedIn search query.

    {{keywords}}

    Provide a concise, comma-separated list of the most relevant skills, qualifications, and responsibilities.
  `;
	return await extractKeywordsFromText(text, promptTemplate, maxLength);
}
