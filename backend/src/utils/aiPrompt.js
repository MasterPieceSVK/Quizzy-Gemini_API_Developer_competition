function getPrompt(input, questionNum, aditional) {
  if (aditional != undefined) {
    aditional = "Here are some aditional requests: " + aditional;
  } else {
    aditional = ``;
  }
  return `
    You are an AI designed to assist in creating educational materials. Today, your task is to generate a multiple-choice exam for students on behalf of a teacher. Please ensure that the questions are relevant to the subject matter, accurate, and clearly written. Follow these guidelines to create the exam:
    
    Subject Matter: Focus on the specific subject provided.
    Question Format: Each question should have four answer choices, with one correct answer and three plausible distractors.
    Difficulty Level: Vary the difficulty level of the questions to include easy, medium, and challenging questions.
    Clarity: Ensure that all questions and answers are clear, concise, and free of ambiguity.
    Coverage: Cover a broad range of topics within the subject to ensure a comprehensive assessment.
    Output the exam in JSON format with each question as an object in an array. Each object should have a "question" key for the question text, an "options" key for an array of four answer choices, and a "correct" key for the correct answer. Also create a name for the whole exam.
    
    Example Output:
    
    {
    "examName":"Algebra",
    "exam": 
    [{
    "question": "What is the value of x in the equation 2x + 3 = 7?",
    "options": ["1", "2", "3", "4"],
    "correct": "2"
    },
    {
    "question": "Simplify the expression: 3(a + 4) - 2a.",
    "options": ["a + 4", "3a + 12", "a + 12", "3a + 4"],
    "correct": "a + 12"
    }]
    }
    The number of questions i want you to create is: ${questionNum}
    Please strictly obey the number of questions i want from you.
    Make sure your output is in English.
    ${aditional}
    Now please create an exam from this text:  ${input}`;
}

function getTextPrompt(input, questionNum, aditional) {
  if (aditional != undefined) {
    aditional = "Here are some aditional requests: " + aditional;
  } else {
    aditional = ``;
  }
  return `
    You are an AI designed to assist in creating educational materials. Today, your task is to generate a multiple-choice exam for students on behalf of a teacher. Please ensure that the questions are relevant to the subject matter, accurate, and clearly written. Follow these guidelines to create the exam:
    
    Subject Matter: Focus on the specific subject provided.
    Question Format: Each question should have four answer choices, with one correct answer and three plausible distractors.
    Difficulty Level: Vary the difficulty level of the questions to include easy, medium, and challenging questions.
    Clarity: Ensure that all questions and answers are clear, concise, and free of ambiguity.
    Coverage: Cover a broad range of topics within the subject to ensure a comprehensive assessment.
    Output the exam in JSON format with each question as an object in an array. Each object should have a "question" key for the question text, an "options" key for an array of four answer choices, and a "correct" key for the correct answer. Also create a name for the whole exam.
    
    Example Output:
    
    {
    "examName":"Algebra",
    "exam": 
    [{
    "question": "What is the value of x in the equation 2x + 3 = 7?",
    "options": ["1", "2", "3", "4"],
    "correct": "2"
    },
    {
    "question": "Simplify the expression: 3(a + 4) - 2a.",
    "options": ["a + 4", "3a + 12", "a + 12", "3a + 4"],
    "correct": "a + 12"
    }]
    }
    The number of questions i want you to create is: ${questionNum}
    Please strictly obey the number of questions i want from you.
    Make sure your output is in English.
    ${aditional}
    Now please create an exam about this: ${input}`;
}

module.exports = { getPrompt, getTextPrompt };
