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
				// Use quotes only if keyword contains spaces
				if (k.includes(" ")) {
					return `title:"${k}"`;
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
					return `company:"${c}"`;
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
				if (k.includes(" ")) {
					return `-"${k}"`;
				}
				return `-${k}`;
			})
			.join(" ");
		queryParts.push(excludeKeywordsQuery);
	}

	// Exclude Companies
	if (excludeCompanies.length > 0) {
		const excludeCompaniesQuery = excludeCompanies
			.map((c) => {
				if (c.includes(" ")) {
					return `-company:"${c}"`;
				}
				return `-company:${c}`;
			})
			.join(" ");
		queryParts.push(excludeCompaniesQuery);
	}

	// Combine all parts
	const query = queryParts.join(" ");

	return query;
}

export function generateQueryVariation(existingQuery) {
	let newQuery = existingQuery;
	const queryParts = existingQuery.split(" ");

	// Randomly select and apply modifications
	const modifications = [
		// Change OR to AND or vice versa for include keywords
		() => {
			newQuery = newQuery.replace(/\b(OR|AND)\b/g, (match) =>
				match === "OR" ? "AND" : "OR",
			);
		},

		// Toggle parentheses for include keywords
		() => {
			newQuery = newQuery.includes("(")
				? newQuery.replace(/\((title:[^)]+)\)/g, "$1")
				: newQuery.replace(/(title:[^ ]+( OR title:[^ ]+)+)/g, "($1)");
		},

		// Toggle quotes for keywords
		() => {
			newQuery = newQuery.includes('"')
				? newQuery.replace(/title:"([^"]+)"/g, "title:$1")
				: newQuery.replace(/title:([^ ]+)/g, 'title:"$1"');
		},

		// Toggle AND/OR for company names
		() => {
			const companyPart = newQuery.match(/\(company:[^)]+\)/);
			if (companyPart) {
				const companies = companyPart[0].slice(1, -1).split(" OR ");
				newQuery = newQuery.replace(
					companyPart[0],
					companies.length > 1
						? `(${companies.join(" AND ")})`
						: `(${companies.join(" OR ")})`,
				);
			}
		},

		// Toggle inclusion of exclusions
		() => {
			const exclusions = queryParts.filter((part) => part.startsWith("-"));
			if (exclusions.length > 0) {
				const nonExclusions = queryParts.filter(
					(part) => !part.startsWith("-"),
				);
				newQuery = `${nonExclusions.join(" ")} ${exclusions.join(" ")}`;
			}
		},
	];

	// Apply 2-4 random modifications
	const numModifications = Math.floor(Math.random() * 3) + 2;
	const shuffledMods = modifications.sort(() => 0.5 - Math.random());

	for (let i = 0; i < numModifications; i++) {
		shuffledMods[i]();
	}

	return newQuery.trim();
}

export function generateLinkedInSearchUrl(keywords) {
	const baseUrl = "https://www.linkedin.com/jobs/search/";
	const params = new URLSearchParams({
		keywords: keywords,
	});
	return `${baseUrl}?${params.toString()}`;
}
