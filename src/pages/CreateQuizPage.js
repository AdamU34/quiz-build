import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import omit from "lodash.omit";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { addDoc, collection, Timestamp } from "firebase/firestore";

import QuestionCreate from "../components/QuestionCreate";
import { db, auth } from "../firebase";
import { generateLinkCode, formatQuestions } from "../utils";

export default function CreateQuizPage() {
  const navigate = useNavigate();
  const titleRef = useRef();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [optionCount, setOptionCount] = useState({ 1: 2 });
  const [validationErrors, setValidationErrors] = useState([]);
  const [questions, setQuestions] = useState({
    "question-1": {
      text: "",
      options: {
        "question-1:option-1": {
          text: "",
          id: "question-1:option-1",
        },
        "question-1:option-2": {
          text: "",
          id: "question-1:option-2",
        },
      },
    },
  });
  const title = (titleRef?.current?.value || "").trim();

  const validateForm = () => {
    setValidationErrors([]);
    if (!Object.keys(questions).length) {
      return false;
    }
    const arr = Array.from(Object.keys(questions), (item, ind) => ({
      number: ind + 1,
      error: "",
    }));
    let i = 0;
    for (const [key, { options = {}, text = "" }] of Object.entries(
      questions
    )) {
      const optionsArr = Object.values(options);
      arr[i].error = [];
      if (
        !text &&
        (!optionsArr.length || optionsArr.every((option) => !!option?.text))
      ) {
        i++;
        continue;
      }
      if (!text) {
        arr[i].error.push("Question text is required!");
      }

      if (!optionsArr.length) {
        arr[i].error.push("At least two options are required!");
      } else if (
        optionsArr.filter((option) => !!option?.text).length !==
        optionsArr.length
      ) {
        arr[i].error.push("Please fill all options!");
      } else if (!optionsArr.filter((option) => option?.isCorrect).length) {
        arr[i].error.push("Please select at least one correct answer!");
      }
      i++;
    }
    const validationsArr = arr.filter(({ error }) => !!error?.length);
    setValidationErrors(validationsArr);

    return validationsArr.length > 0;
  };

  const handleCompleteClick = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (validateForm() || !title) {
      return;
    }

    const link = generateLinkCode();
    try {
      await addDoc(collection(db, "quizes"), {
        questions: formatQuestions(questions),
        title,
        completed: true,
        userId: auth.currentUser.uid,
        linkCode: link,
        created: Timestamp.now(),
      });
      navigate("/");
    } catch (err) {
      alert(err);
    }
  };

  const addQuestionRow = () => {
    if (questionCount > 9) {
      return;
    }
    const prefix = `question-${questionCount + 1}:option`;
    const options = {};

    options[`${prefix}-1`] = { text: "", id: `${prefix}-1` };
    options[`${prefix}-2`] = { text: "", id: `${prefix}-2` };

    setQuestions({
      ...questions,
      [`question-${questionCount + 1}`]: {
        text: "",
        options,
      },
    });

    setOptionCount({
      ...optionCount,
      [questionCount + 1]: 2,
    });

    setQuestionCount(questionCount + 1);
  };

  const removeQuestionRow = () => {
    if (isSubmitted) {
      validateForm();
    }
    if (questionCount < 2) {
      return;
    }
    setOptionCount(omit(optionCount, [questionCount]));
    setQuestions(omit(questions, [`question-${questionCount}`]));
    setQuestionCount(questionCount - 1);
  };

  const addOptionRow = (questionNo) => {
    if (optionCount?.[questionNo] >= 5) {
      return;
    }
    const newOptionIndex = optionCount[questionNo] + 1;
    setOptionCount({
      ...optionCount,
      [questionNo]: newOptionIndex,
    });

    setQuestions({
      ...questions,
      [`question-${questionNo}`]: {
        ...questions[`question-${questionNo}`],
        options: {
          ...questions[`question-${questionNo}`].options,
          [`question-${questionNo}:option-${newOptionIndex}`]: {
            text: "",
            id: `question-${questionNo}:option-${newOptionIndex}`,
          },
        },
      },
    });
  };

  const removeOptionRow = (questionNumber) => {
    if (isSubmitted) {
      validateForm();
    }
    const question = questions[`question-${questionNumber}`];
    const removalOptionIndex = optionCount?.[questionNumber];
    setOptionCount({
      ...optionCount,
      [questionNumber]: optionCount?.[questionNumber] - 1,
    });
    if (!question) {
      return;
    }

    if (removalOptionIndex < 3) {
      return;
    }

    const removeOptionPropName = `question-${questionNumber}:option-${removalOptionIndex}`;
    if (question?.options?.[removeOptionPropName]) {
      const newOptions = { ...question.options };
      delete newOptions[removeOptionPropName];
      setQuestions({
        ...questions,
        [`question-${questionNumber}`]: {
          ...question,
          options: newOptions,
        },
      });
    }
  };

  const handleQuestionChange = (e) => {
    const { name, value = "" } = e.target;
    setQuestions({
      ...questions,
      [name]: { ...questions?.[name], text: value },
    });
  };

  const handleOptionChange = (e) => {
    const { name, value = "" } = e.target;

    const questionName = name.substring(0, name.indexOf(":"));
    setQuestions({
      ...questions,
      [questionName]: {
        ...questions?.[questionName],
        options: {
          ...questions?.[questionName]?.options,
          [name]: {
            ...questions?.[questionName]?.options?.[name],
            id: name,
            text: value,
          },
        },
      },
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const questionName = name.substring(0, name.indexOf(":"));
    setQuestions({
      ...questions,
      [questionName]: {
        ...questions?.[questionName],
        options: {
          ...questions?.[questionName]?.options,
          [name]: {
            ...questions?.[questionName]?.options?.[name],
            id: name,
            isCorrect: checked,
          },
        },
      },
    });
  };

  const showErrors = isSubmitted && (validationErrors.length > 0 || !title);

  return (
    <div className="create-quiz-page-container">
      <h2>Create a new quiz</h2>
      <br />
      <InputGroup className="mb-3" style={{ width: "500px" }}>
        <InputGroup.Text id="quiz-title">Title</InputGroup.Text>
        <Form.Control
          aria-label="Title"
          aria-describedby="inputGroup-sizing-default"
          ref={titleRef}
        />
      </InputGroup>

      {[...Array(questionCount).keys()].map((el, i) => (
        <QuestionCreate
          key={`question-${i}`}
          questionIndx={i}
          optionCount={optionCount}
          onQuestionChange={handleQuestionChange}
          onOptionChange={handleOptionChange}
          onCheckboxChange={handleCheckboxChange}
          onAddOptionRow={addOptionRow}
          onRemoveOptionRow={removeOptionRow}
        />
      ))}

      <div style={{ marginTop: "10px" }}>
        {questionCount !== 10 && (
          <Button
            variant="outline-primary"
            className="mr-2"
            onClick={() => addQuestionRow()}
          >
            Add question
          </Button>
        )}
        {questionCount !== 1 && (
          <Button
            className="ml-1"
            variant="outline-danger"
            onClick={() => removeQuestionRow()}
          >
            Remove last question
          </Button>
        )}
      </div>
      {showErrors && (
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <Alert variant="danger" className="question-wrapper">
            <ul>
              {!title && <li>Please enter a quiz title!</li>}
              {!title && validationErrors.length > 0 && <br />}
              {validationErrors.map((item) => (
                <li key={item.number}>
                  Question-{item.number}
                  <ul>
                    {item.error.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Alert>
        </div>
      )}
      <div style={{ marginTop: "30px" }}>
        <Button variant="success" onClick={handleCompleteClick}>
          Complete Quiz
        </Button>
      </div>
    </div>
  );
}
