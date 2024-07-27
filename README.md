# 🎓 Quizzy: AI-Enhanced Quiz Creation and Participation Platform
## Overview

Quizzy is a full-stack web application built with Next.js for the frontend and Express.js (Node.js) for the backend. The platform empowers teachers to create quizzes using AI and provides students with a user-friendly environment to take these quizzes.

This project was created for the ***2024 Gemini API Developer Competition***.
## ✨ Features

  * 🤖 AI-Powered Quiz Creation: Teachers can leverage AI to generate quiz questions and answers.
  * 📝 Student Quiz Participation: Students can take quizzes and receive instant feedback.
  * 📱 Responsive Design: The application is fully responsive and works seamlessly on desktops, tablets, and mobile devices.
  * 🔒 User Authentication: Secure login and registration system for teachers and students.

## 🛠️ Technologies Used
### Frontend

  * Next.js
  * React
  * Tailwind CSS

### Backend

  * Express.js
  * Node.js
  * PostgreSQL
  * Google Gemini AI

## Getting Started
### Prerequisites

* Node.js (v21.7.3 recommended)
* npm (v10.5.0 recommended)

### Installation

  Clone the repository:

  ```bash
git clone https://github.com/MasterPieceSVK/Quizzy-Gemini_API_Developer_competition
cd Quizzy-Gemini_API_Developer_competition
```

### Install dependencies for both frontend and backend:

```bash

cd frontend
npm install
cd ../backend
npm install
```
### Set up environment variables:

Rename ```.env.example``` to ```.env``` and fill in the variables. \
Rename ```env.local.example``` to ```.env.local``` and fill in the variables.



### Run the development servers:

In the ```backend``` directory, start the backend server:


```bash
npm start
```

In the ```frontend``` directory, start the frontend server:


```bash
npm run dev
```
The application should now be running at http://localhost:3000.

## 📚 Usage
### Teacher

  * Sign up or log in.
  * Create a new quiz using the AI-powered tool.
  * Create groups and share invite codes with students.
  * Assign quizzes to students.
  * View quiz results and the average score for the group.

### Student

  * Sign up or log in.
  * Join a group using an invite code and take the assigned quizzes.
  * Submit the quiz and receive immediate feedback on your performance.

Enjoy using Quizzy! 🚀
