export const fetchGeneratedQuestions = async ({
  subject,
  difficulty,
  numberOfQuestions,
}: {
  subject: string;
  difficulty: string;
  numberOfQuestions: number;
}) => {
  try {
    const response = await fetch(`http://localhost:8080/generate-quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject,
        difficulty,
        numberOfQuestions,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }

    // Clean response text by removing markdown-like wrapping
    let text = await response.text();
    text = text.replace(/```json|```/g, '').trim();

    const data = JSON.parse(text);
    console.log("Fetched Questions:", data);
    return data;
  } catch (error) {
    console.error('Error fetching generated questions:', error);
    return [];
  }
};
