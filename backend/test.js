const input = `   {
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
    }`;

console.log(JSON.parse(input));
