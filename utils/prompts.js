const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
  You are an AI trained to generate interview questions and answers.

  Task:

  - Role: ${role}
  - Candidate Experience: ${experience} years
  - Topics to Focus On: ${topicsToFocus}
  - Write ${numberOfQuestions} interview questions along with their detailed answers.
  - For each question, generate a detailed but beginner-friendly answer.
  - If the answer needs a code example, a small code block inside markdown format should be provided.
  - Keep formatting vert clean, clear and easy to read.
  - Return a pure JSON array like below:
  [
    {
      "question": "Question here?",
      "answer": "Answer here."
    },
    ...
  ]
    Important: Do NOT add any extra text outside the JSON array. Only return valid JSON. Reponse should be in Vietnamese.
`;
const conceptExplainPrompt = (
  question
) => `You are an AI trained to generate explainations for a given interview question.

  Task:

  - Explain the following interview question and its concept in depth as if you are teaching a beginner.
  - Question: ${question}
  - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
  - If the explanation needs a code example, a small code block inside markdown format should be provided.
  - Keep formatting vert clean, clear and easy to read.
  - Return a pure JSON array like below:
  {
    "title": "Short title here?",
    "explanation": "Explanation here."
  }
  Important: Do NOT add any extra text outside the JSON array. Only return valid JSON. Reponse should be in Vietnamese.
`;
module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
};
