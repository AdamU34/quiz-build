import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { db } from "../firebase";
import QuestionView from "../components/QuestionView";

const ViewQuizPage = () => {
  const { linkCode } = useParams();

  const [quiz, setQuiz] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "quizes"),
        where("linkCode", "==", linkCode)
      );
      onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        if (!data.length) {
          return setError("Quiz not found");
        }
        setQuiz(data[0]);
        setAnswers(data[0].questions.map((option) => false));
        setLoading(false);
      });
    };
    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleQuestionChange = (id, newAnswer) => {
    const newAnswers = answers.map((answer, ind) =>
      ind === id - 1 ? newAnswer : answer
    );
    setAnswers(newAnswers);
    setScore(newAnswers.filter((answer) => answer).length);
  };

  const handleSubmit = () => {
    setIsCompleted(true);
  };

  return (
    <div>
      <h3>{quiz?.title}</h3>
      <hr />
      <div style={{ marginBottom: 24 }}>
        {quiz.questions.map((question, ind) => (
          <QuestionView
            key={ind}
            order={ind + 1}
            {...question}
            isDisabled={isCompleted}
            onChange={handleQuestionChange}
          />
        ))}
        {!isCompleted ? (
          <Button variant="primary" onClick={handleSubmit}>
            Complete
          </Button>
        ) : (
          <Button variant="success" onClick={() => window.location.reload()}>
            Start Again
          </Button>
        )}
      </div>
      {isCompleted && (
        <Alert variant="success">
          You answered <strong>{`${score} / ${quiz.questions.length}`}</strong>{" "}
          questions correctly
        </Alert>
      )}
    </div>
  );
};

export default ViewQuizPage;
