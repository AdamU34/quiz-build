import React, { useEffect, useState } from "react";

const QuestionView = (props) => {
  const [hasMultipleAnswers, setHasMultipleAnswers] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState("");

  useEffect(() => {
    const multipleAnswers =
      props.options.filter((option) => option.isCorrect).length > 1;
    let answers = "";
    props.options.forEach((option, ind) => {
      if (option.isCorrect) {
        answers += String(ind + 1);
      }
    });
    setCorrectAnswers(answers);
    setHasMultipleAnswers(multipleAnswers);
  }, [props.options]);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const handleCheckboxChange = (option, ind) => (e) => {
    const { checked } = e.target;
    let newSelectedAnswer = selectedAnswer;
    if (checked && !selectedAnswer.includes(ind)) {
      newSelectedAnswer = [...(selectedAnswer + ind)].sort().join("");
    } else if (!checked && selectedAnswer.includes(ind)) {
      newSelectedAnswer = [...selectedAnswer]
        .filter((i) => i !== ind)
        .sort()
        .join("");
    }
    setSelectedAnswer(newSelectedAnswer);
    props.onChange(props.order, newSelectedAnswer === correctAnswers);
  };

  const handleRadioChange = (isCorrect) => () => {
    props.onChange(props.order, isCorrect);
  };

  return (
    <div style={{ border: "1px solid gray", margin: "24px 0", padding: 16 }}>
      <div style={{ fontWeight: "bold", marginBottom: 6 }}>
        Q{props.order} - {props.text}
      </div>
      <div style={{ fontSize: 14, fontStyle: "italic" }}>
        {hasMultipleAnswers
          ? "This question has more than one correct answers"
          : "Please select only one of the options."}
      </div>
      <hr />
      <div>
        {props.options.map((option, ind) => (
          <div key={ind}>
            {!hasMultipleAnswers ? (
              <input
                type="radio"
                name={`question${props.order}`}
                value={option.text}
                disabled={props.isDisabled}
                onChange={handleRadioChange(option.isCorrect)}
              />
            ) : (
              <input
                type="checkbox"
                name={`question${props.order}`}
                value={option.text}
                disabled={props.isDisabled}
                onChange={handleCheckboxChange(option, String(ind + 1))}
              />
            )}
            <span style={{ marginLeft: 12 }}>{option.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionView;
