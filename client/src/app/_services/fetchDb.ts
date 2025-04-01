export const fetchAllQuizzes = async () => {
  try {
    const response = await fetch('http://localhost:8080/quiz');
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

export const fetchQuizById = async (id: number) => {
  try {
    const response = await fetch(`http://localhost:8080/${id}`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching quiz with ID ${id}:`, error);
    return null;
  }
};

export const createQuiz = async (quizData) => {
  try {
    console.log('Quiz created successfully:', quizData);
    localStorage.setItem('createdQuiz', JSON.stringify(quizData));
    return true;
  } catch (error) {
    console.error('Error creating quiz:', error);
    return false;
  }
};

export const showQuizzes = async () => {
  try {
    const quizzes = localStorage.getItem('createdQuiz');
    if (quizzes) {
      return [JSON.parse(quizzes)];
    }
    return [];
  } catch (error) {
    console.error('Error fetching published quizzes:', error);
    return [];
  }
};

export const showStudents = async (quizId: number) => {
  try {
    const response = await fetch(`http://localhost:8080/show-students/${quizId}`);
    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching students for quiz ID ${quizId}:`, error);
    return [];
  }
};

export const completeQuiz = async (studentId: number, quizId: number, score: number) => {
  try {
    const response = await fetch('http://localhost:8080/complete-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, quizId, score }),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);
    console.log('Quiz attempt recorded successfully');
  } catch (error) {
    console.error('Error completing quiz:', error);
  }
};

export const fetchAllStudents = async () => {
  try {
    const response = await fetch("http://localhost:8080/students");
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Fetched Students:", data);
    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};


export const registerUser = async (username: string, password: string, userType: string) => {
  try {
    const response = await fetch('http://localhost:8080/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, userType }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }

    console.log('User registered successfully');
    return true;
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status} - ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    console.log('Login successful:', data);
    return data; // Could contain JWT, session data, or plain text
  } catch (error) {
    console.error('Error logging in:', error);
    return null;
  }
};
