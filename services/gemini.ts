import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    // In a real app, strict checks would be here. For this demo, we assume the env var is set.
    // If it's missing, it will throw when initialized.
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiClient;
};

export const generateProductDescription = async (productName: string, price: number, category: string, keywords: string): Promise<string> => {
  try {
    const ai = getClient();
    
    // Determine context based on price (simple heuristic for demo)
    const isPremium = price > 5000;
    const tone = isPremium ? "Sophisticated, luxurious, and exclusive" : "Friendly, value-focused, and practical";

    const prompt = `Write a compelling, sales-oriented product description (approx 40-60 words) for an e-commerce product.
    
    Product Details:
    - Name: ${productName}
    - Price: ₹${price} (Context: ${tone})
    - Category: ${category}
    - Key Features/Keywords: ${keywords}
    
    Guidelines:
    - Focus on benefits and user experience.
    - Use natural, engaging language.
    - Do not use hashtags or markdown formatting (like **bold** or *italics*).
    - Keep it concise but descriptive.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating description. Please try again or check API key.";
  }
};

export const getSmartProductInsights = async (productName: string, description: string): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `Analyze this product and provide a 1-sentence "Why you'll love it" summary.
    Product: ${productName}
    Description: ${description}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Great choice for quality seekers.";
  } catch (error) {
    return "Top rated product in its category.";
  }
}