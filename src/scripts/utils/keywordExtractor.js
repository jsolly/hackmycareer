import { getGenerator } from "./llmUtils";
import keyword_extractor from "keyword-extractor";

export async function extractKeywordsFromResumeText(text, maxLength = 500) {
	const generator = await getGenerator();

	// Preprocess the text
	const cleanedText = text.replace(/[^\w\s:]/gi, "");

	// Step 1: Use keyword-extractor to get initial keywords
	const initialKeywords = keyword_extractor.extract(cleanedText, {
		language: "english",
		remove_digits: true,
		return_changed_case: true,
		remove_duplicates: true,
		return_max_ngrams: 3,
	});

	const prompt = `
		Refine the following keywords for a LinkedIn search query.

		${initialKeywords.join(", ")}

		Provide a concise, comma-separated list of the most relevant skills and qualifications.
	`;

	const output = await generator(prompt, { max_length: maxLength });

	// Improved output parsing
	let keywordsText = output[0]?.generated_text.trim() || "";
	keywordsText = keywordsText.replace(/[\n;]/g, ", ");

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
