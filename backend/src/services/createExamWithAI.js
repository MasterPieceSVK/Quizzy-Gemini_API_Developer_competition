const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getPrompt, getTextPrompt } = require("../utils/aiPrompt");
const { response } = require("express");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function createExamWithAI(parsedText, questionNum, aditional) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = getPrompt(parsedText, questionNum, aditional);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // console.log(text);
    const json = JSON.parse(cleanJSON(text));
    return json;
  } catch (e) {
    console.log(e);
  }
}

async function createExamWithAIFromText(about, questionNum, aditional) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = getTextPrompt(about, questionNum, aditional);
    // console.log(prompt);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // console.log(text);
    const json = JSON.parse(cleanJSON(text));
    return json;
  } catch (e) {
    console.log(e);
  }
}

function cleanJSON(input) {
  input = input.replace(/```/g, "");
  input = input.replace(/json/g, "");
  input = input.trim();
  return input;
}

module.exports = { createExamWithAI, createExamWithAIFromText };
