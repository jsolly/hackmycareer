import { extractKeywordsFromResumeText } from "./utils/keywordExtractor.js";
import {
	generateSearchQuery,
	generateQueryVariation,
	generateLinkedInSearchUrl,
} from "./utils/buildSearchQuery.js";

const analyzeButton = document.getElementById("analyze-button");
const resumeTextarea = document.getElementById("resume");
const includeKeywordsTextarea = document.getElementById("include-keywords");
const excludeKeywordsTextarea = document.getElementById("exclude-keywords");
const includeCompaniesTextarea = document.getElementById("include-companies");
const excludeCompaniesTextarea = document.getElementById("exclude-companies");
const queryOutput = document.getElementById("query-output");
const loadingSpinner = document.getElementById("loading-spinner");
const copyButton = document.getElementById("copy-button");
const mixItUpButton = document.getElementById("mix-it-up-button");
const resetButton = document.getElementById("reset-button");
const linkedinSearchLink = document.getElementById("linkedin-search-link");

let query = "";

analyzeButton.addEventListener("click", async () => {
	const resumeText = resumeTextarea.value.trim();

	// Show loading spinner
	loadingSpinner.classList.remove("hidden");

	// Extract keywords
	const includeKeywords = await extractKeywordsFromResumeText(resumeText);
	const excludeKeywords = []; // Initialize excludeKeywords as an empty array

	// Hide loading spinner
	loadingSpinner.classList.add("hidden");

	// Overwrite keywords in textareas
	includeKeywordsTextarea.value = includeKeywords.join(", ");
	excludeKeywordsTextarea.value = excludeKeywords.join(", ");

	// Generate initial query
	query = generateSearchQuery(
		includeKeywordsTextarea.value,
		excludeKeywordsTextarea.value,
		includeCompaniesTextarea.value,
		excludeCompaniesTextarea.value,
	);
	queryOutput.textContent = query;
});

updateLinkedInSearchLink(query);

// Real-time query generation as user types
const textareas = [
	includeKeywordsTextarea,
	excludeKeywordsTextarea,
	includeCompaniesTextarea,
	excludeCompaniesTextarea,
];

for (const textarea of textareas) {
	textarea.addEventListener("input", () => {
		query = generateSearchQuery(
			includeKeywordsTextarea.value,
			excludeKeywordsTextarea.value,
			includeCompaniesTextarea.value,
			excludeCompaniesTextarea.value,
		);
		queryOutput.textContent = query;
		updateLinkedInSearchLink(query);
	});
}

// Copy to Clipboard Functionality
copyButton.addEventListener("click", () => {
	const queryText = queryOutput.textContent;
	navigator.clipboard.writeText(queryText).then(() => {
		copyButton.textContent = "Copied!";
		setTimeout(() => {
			copyButton.textContent = "Copy to Clipboard";
		}, 2000);
	});
});

// Mix it Up Functionality
mixItUpButton.addEventListener("click", () => {
	const mixedQuery = generateQueryVariation(query);
	queryOutput.textContent = mixedQuery;
	updateLinkedInSearchLink(query);
});

// Reset Functionality
resetButton.addEventListener("click", () => {
	queryOutput.textContent = query;
	updateLinkedInSearchLink(query);
});

function updateLinkedInSearchLink(query) {
	if (query.trim() === "") {
		linkedinSearchLink.href = "#";
	} else {
		const linkedinSearchUrl = generateLinkedInSearchUrl(query);
		linkedinSearchLink.href = linkedinSearchUrl;
	}
}
