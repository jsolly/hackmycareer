import { pipeline } from "@xenova/transformers";
let generator;

export async function getGenerator() {
	if (!generator) {
		generator = await pipeline(
			"text2text-generation",
			"Xenova/LaMini-Flan-T5-783M",
		);
	}
	return generator;
}
