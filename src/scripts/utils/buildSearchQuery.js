function splitAndCleanInput(input) {
	if (typeof input !== "string") {
		return [];
	}
	return input
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
}

export function generateSearchQuery(
	includeKeywordsInput,
	excludeKeywordsInput,
	includeCompaniesInput,
	excludeCompaniesInput,
) {
	const includeKeywords = splitAndCleanInput(includeKeywordsInput);
	const excludeKeywords = splitAndCleanInput(excludeKeywordsInput);
	const includeCompanies = splitAndCleanInput(includeCompaniesInput);
	const excludeCompanies = splitAndCleanInput(excludeCompaniesInput);

	// Build LinkedIn search query
	const queryParts = [];

	// Include Keywords in title field
	if (includeKeywords.length > 0) {
		const includeKeywordsQuery = includeKeywords
			.map((k) => {
				// Use parentheses only if keyword contains spaces
				if (k.includes(" ")) {
					return `title:(${k})`;
				}
				return `title:${k}`;
			})
			.join(" OR ");
		queryParts.push(`(${includeKeywordsQuery})`);
	}

	// Include Companies
	if (includeCompanies.length > 0) {
		const includeCompaniesQuery = includeCompanies
			.map((c) => {
				if (c.includes(" ")) {
					return `company:(${c})`;
				}
				return `company:${c}`;
			})
			.join(" OR ");
		queryParts.push(`(${includeCompaniesQuery})`);
	}

	// Exclude Keywords
	if (excludeKeywords.length > 0) {
		const excludeKeywordsQuery = excludeKeywords
			.map((k) => {
				// Wrap in quotes if keyword contains spaces or not
				return `-"${k}"`;
			})
			.join(" ");
		queryParts.push(excludeKeywordsQuery);
	}

	// Exclude Companies
	if (excludeCompanies.length > 0) {
		const excludeCompaniesQuery = excludeCompanies
			.map((c) => {
				// Wrap in quotes if company contains spaces or not
				return `-company:"${c}"`;
			})
			.join(" ");
		queryParts.push(excludeCompaniesQuery);
	}

	// Combine all parts
	const query = queryParts.join(" ");

	return query;
}

export function generateLinkedInSearchUrl(keywords) {
	const baseUrl = "https://www.linkedin.com/jobs/search/";
	const params = new URLSearchParams({
		keywords: keywords,
	});
	return `${baseUrl}?${params.toString()}`;
}
