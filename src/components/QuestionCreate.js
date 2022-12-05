import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

export default function QuestionCreate({
  questionIndx,
  onQuestionChange,
  onOptionChange,
  onCheckboxChange,
  onAddOptionRow,
  onRemoveOptionRow,
  optionCount,
}) {
  return (
    <div className="question-wrapper">
      <InputGroup className="mb-3">
        <InputGroup.Text id="quiz-question">{`Question ${
          questionIndx + 1
        }`}</InputGroup.Text>
        <Form.Control
          name={`question-${questionIndx + 1}`}
          aria-label="Question"
          aria-describedby="inputGroup-sizing-default"
          onChange={onQuestionChange}
        />
      </InputGroup>
      <div>
        {[...Array(optionCount?.[questionIndx + 1]).keys()].map((el, i) => (
          <InputGroup key={`option-${i}`} className="mb-3">
            <InputGroup.Checkbox
              name={`question-${questionIndx + 1}:option-${i + 1}`}
              aria-label="Checkbox for following text input"
              onChange={onCheckboxChange}
            />
            <Form.Control
              name={`question-${questionIndx + 1}:option-${i + 1}`}
              aria-label="Text input with checkbox"
              onChange={onOptionChange}
            />
          </InputGroup>
        ))}
      </div>

      <div style={{ alignSelf: "center" }}>
        {optionCount?.[questionIndx + 1] !== 5 && (
          <Button
            className="mr-2"
            onClick={() => onAddOptionRow(questionIndx + 1)}
          >
            Add option
          </Button>
        )}
        {optionCount?.[questionIndx + 1] !== 2 && (
          <Button
            variant="danger"
            onClick={() => onRemoveOptionRow(questionIndx + 1)}
          >
            Remove last option
          </Button>
        )}
      </div>
    </div>
  );
}
