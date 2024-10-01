import {
	calculateFleschKincaidGradeLevel,
	getTop10SentencesByReadingLevel,
} from "./utils/fleschKincaid.js";
import { countPersonalPronouns } from "./utils/metrics.js";
import { extractKeywordsFromJobDescriptionText } from "./utils/keywordExtractor.js";
import { evalCoverLetter } from "./utils/evalText.js";

const coverLetterTextarea = document.getElementById("cover-letter");
const jobDescriptionTextarea = document.getElementById("job-description");
const analyzeButton = document.getElementById("analyze-button");
const extractKeywordsButton = document.getElementById(
	"extract-keywords-button",
);
const keywordsResultElement = document.getElementById("keywords-result");
const loadingSpinner = document.getElementById("loading-spinner");
const llmEval = document.getElementById("llm-evaluation");

// Add event listener to the "Analyze" button
analyzeButton.addEventListener("click", updateMetrics);

// Add event listener to the "Extract Keywords" button
extractKeywordsButton.addEventListener("click", extractKeywords);

async function updateMetrics() {
	const coverLetterText = coverLetterTextarea.value;
	const jobDescriptionText = jobDescriptionTextarea.value;

	// Calculate Flesch Kincaid Reading Level
	const fleschKincaidResult = calculateFleschKincaidGradeLevel(coverLetterText);
	const fleschKincaidElement = document.getElementById("flesch-kincaid");
	fleschKincaidElement.innerHTML = `
    <span class="text-2xl font-bold">${fleschKincaidResult.score.toFixed(1)}</span>
    <br>
    <span class="text-sm">${fleschKincaidResult.description}</span>
  `;

	// Get Top 10 Sentences by Reading Level
	const topSentences = getTop10SentencesByReadingLevel(coverLetterText);

	// Inject the generated <li> elements into the <ol> container
	document.getElementById("top-sentences").innerHTML = topSentences.join("");

	// Calculate Personal Pronoun Usage
	const pronounCount = countPersonalPronouns(coverLetterText);
	const pronounCountElement = document.getElementById("pronoun-count");
	pronounCountElement.innerHTML = `
    <span class="text-2xl font-bold">${pronounCount}</span>
  `;

	// Calculate LLM evaluation
	loadingSpinner.classList.remove("hidden");
	llmEval.classList.add("hidden");
	const coverLetterEval = await evalCoverLetter(
		coverLetterText,
		jobDescriptionText,
	);
	loadingSpinner.classList.add("hidden");
	llmEval.classList.remove("hidden");
	llmEval.innerHTML = `
    <span class="text-sm">${coverLetterEval}</span>
  `;
}

// Extract keywords from the job description
async function extractKeywords() {
	const jobDescriptionText = jobDescriptionTextarea.value;
	keywordsResultElement.innerHTML = "";
	const loadingKeywordsSpinner = document.getElementById(
		"loading-keywords-spinner",
	);

	// Show loading spinner
	loadingKeywordsSpinner.classList.remove("hidden");

	const keywords =
		await extractKeywordsFromJobDescriptionText(jobDescriptionText);

	// Hide loading spinner
	loadingKeywordsSpinner.classList.add("hidden");

	keywordsResultElement.innerHTML = `
  <h4 class="text-lg font-bold">Extracted Keywords:</h4>
  <p class="mt-2">${keywords.join(", ")}</p>
  `;
}
