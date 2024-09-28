import { getGenerator } from "./llmUtils";
import { removeStopwords } from "stopword";
import { lemmatizer } from "lemmatizer";
import keyword_extractor from "keyword-extractor";

export async function extractKeywordsFromResumeText(text, maxLength = 500) {
	if (typeof text !== "string" || text.trim().length === 0) {
		throw new Error("Input text must be a non-empty string.");
	}

	let generator;
	try {
		generator = await getGenerator();
	} catch (error) {
		throw new Error(`Failed to get generator: ${error.message}`);
	}

	// Preprocessing: Clean and process the text
	let cleanedText = text
		.toLowerCase() // Convert to lowercase
		.replace(/[^\w\s]/gi, "") // Remove special characters
		.replace(/\d+/g, "") // Remove numbers
		.split(/\s+/); // Split into words

	cleanedText = cleanedText.map((word) => lemmatizer(word)); // Lemmatize words
	const filteredWords = removeStopwords(cleanedText);
	const filteredText = filteredWords.join(" ").trim(); // Join words and trim extra spaces

	// Determine the number of keywords based on the length of the text
	const maxKeywords = Math.max(5, Math.floor(filteredWords.length / 10));

	// Step 1: Use keyword-extractor to get initial keywords
	let initialKeywords;
	try {
		initialKeywords = keyword_extractor.extract(filteredText, {
			language: "english",
			remove_digits: true,
			return_changed_case: true,
			remove_duplicates: true,
			return_max_ngrams: 2,
		});
		// Limit to maxKeywords
		initialKeywords = initialKeywords.slice(0, maxKeywords);
	} catch (error) {
		throw new Error(`Failed to extract initial keywords: ${error.message}`);
	}

	// Step 2: Create prompt for LLM using only initial keywords
	const prompt = `
		Given the following initial keywords extracted from a resume:

		${initialKeywords.join(", ")}

		Please refine this list to better represent the main skills and qualifications. Provide a concise, comma-separated list of the most relevant keywords that can be used to find suitable job opportunities.
		`;

	let output;
	try {
		output = await generator(prompt, { max_length: maxLength });
	} catch (error) {
		throw new Error(`Failed to generate keywords: ${error.message}`);
	}

	// Assuming the output is a comma-separated list of keywords
	let keywordsText = output[0]?.generated_text.trim() || "";

	// Replace dashes with commas
	keywordsText = keywordsText.replace(/ - /g, ", ");

	// Split the keywords and trim whitespace
	const refinedKeywords = keywordsText
		.split(",")
		.map((keyword) => keyword.trim())
		.filter((keyword) => keyword.length > 0);

	return refinedKeywords;
}
