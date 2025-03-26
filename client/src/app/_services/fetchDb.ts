export const fetchAllQuizzes = async () => {
  try {
    const response = await fetch('http://localhost:8080/quizzes');
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched Quizzes:", data);
    return data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

export const fetchQuizById = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8080/quizzes/${id}`);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched Quiz:", data);
    return data;
  } catch (error) {
    console.error(`Error fetching quiz with ID ${id}:`, error);
    return null;
  }
};


export const updateQuiz = async (id: number, quizData: {
  title: string;
  questions: number;
  timeLimit: string;
  dueDate: string;
}) => {
  try {
    const response = await fetch(`http://localhost:8080/quizzes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }
    console.log('Quiz updated successfully');
  } catch (error) {
    console.error(`Error updating quiz with ID ${id}:`, error);
  }
};

export const deleteQuiz = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8080/quizzes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }
    console.log('Quiz deleted successfully');
  } catch (error) {
    console.error(`Error deleting quiz with ID ${id}:`, error);
  }
};
