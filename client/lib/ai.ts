import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY: string = process.env.GEMINI_API_KEY!; 

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

type GenerateQuizQuestionsParams = {
  subject: string;
  difficulty: string;
  numberOfQuestions: number;
};

type Question = {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
};

export async function generateQuizQuestions({
  subject,
  difficulty,
  numberOfQuestions,
}: GenerateQuizQuestionsParams): Promise<Question[]> {
  try {
    const prompt = `
      Create ${numberOfQuestions} multiple-choice quiz questions about ${subject} at a ${difficulty} difficulty level.
      
      For each question:
      1. Provide a clear question text
      2. Create 4 possible answers labeled a, b, c, and d
      3. Indicate which answer is correct
      
      Format your response as a valid JSON array with the following structure:
      [
        {
          "id": 1,
          "text": "Question text here?",
          "options": [
            { "id": "a", "text": "First option" },
            { "id": "b", "text": "Second option" },
            { "id": "c", "text": "Third option" },
            { "id": "d", "text": "Fourth option" }
          ],
          "correctAnswer": "a"
        },
        ...more questions
      ]
      
      Make sure the questions are appropriate for ${difficulty} level students studying ${subject}.
      Ensure the JSON is valid with no trailing commas.
    `;

    const response = await model.generateContent(prompt);
    const text = await response.response.text();

    // Extract the JSON part from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const jsonString = jsonMatch[0];
    const questions = JSON.parse(jsonString) as Question[];

    return questions.map((q, index) => ({
      ...q,
      id: index + 1,
    }));
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate quiz questions");
  }
}
