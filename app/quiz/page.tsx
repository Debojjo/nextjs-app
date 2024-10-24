"use client";

import { useState, useEffect } from "react";

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const Quiz = () => {
  const [categories] = useState([
    {
      id: 9,
      name: "General Knowledge",
      api: "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple",
    },
    {
      id: 18,
      name: "Science",
      api: "https://opentdb.com/api.php?amount=10&category=17&difficulty=easy&type=multiple",
    },
    {
      id: 21,
      name: "Sports",
      api: "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple",
    },
    {
      id: 17,
      name: "Science: Gadgets",
      api: "https://opentdb.com/api.php?amount=10&category=30&difficulty=easy&type=multiple",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = (apiUrl) => {
    setLoading(true);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results) {
          const shuffledQuestions = data.results.map((q) => ({
            ...q,
            allAnswers: shuffleArray([
              ...q.incorrect_answers,
              q.correct_answer,
            ]),
          }));
          setQuestions(shuffledQuestions);
        } else {
          console.error("No results found:", data);
        }
      })
      .catch((error) => console.error("Error fetching questions:", error))
      .finally(() => setLoading(false));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    fetchQuestions(category.api);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleNext();
    }
  }, [timeLeft]);

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion]?.correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setSelectedOption("");
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(10);
    } else {
      setShowResults(true);
    }
  };

  const retakeQuiz = () => {
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption("");
    setShowResults(false);
    setTimeLeft(10); 
    setQuestions([]); 
    setSelectedCategory(null); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {!selectedCategory ? (
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">
            Select a Quiz Category:
          </h2>
          {categories.map((category) => (
            <button
              key={category.id}
              className="m-2 p-4 bg-gradient-to-r from-sky-900 to-amber-700 text-white rounded shadow-lg transition-transform transform hover:scale-105"
              onClick={() => handleCategorySelect(category)}
            >
              {category.name}
            </button>
          ))}
        </div>
      ) : !showResults ? (
        questions.length > 0 && currentQuestion < questions.length ? (
          <>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-800 h-2.5 rounded-full"
                style={{
                  width: `${(currentQuestion / questions.length) * 100}%`,
                }}
              ></div>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              {questions[currentQuestion].question}
            </h2>
            <p className="text-red-700 font-bold">
              Time left: {timeLeft} seconds
            </p>
            <div className="mt-4">
              {questions[currentQuestion].allAnswers.map((option, index) => (
                <button
                  key={index}
                  className={`m-2 p-4 rounded shadow-md transition-all duration-300 ${
                    selectedOption === option
                      ? "bg-green-500 text-white"
                      : "bg-purple-900 text-white hover:bg-green-900"
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <button
              className="mt-4 bg-gradient-to-r from-sky-900 to-amber-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105"
              onClick={handleNext}
            >
              Next Question
            </button>
          </>
        ) : loading ? (
          <h2 className="text-white">Loading questions...</h2>
        ) : (
          <h2 className="text-white">
            No questions available for this category.
          </h2>
        )
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Quiz Complete! Your score is: {score}/{questions.length}
          </h2>
          <h3 className="text-xl text-white mb-4">Thank you for playing!</h3>
          <button
            className="mt-4 bg-gradient-to-r from-sky-900 to-amber-700 text-white font-bold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105"
            onClick={retakeQuiz}
          >
            Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
