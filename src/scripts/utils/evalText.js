import { getGenerator } from "./llmUtils";

export async function evalCoverLetter(coverLetterText, jobDescriptionText) {
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
