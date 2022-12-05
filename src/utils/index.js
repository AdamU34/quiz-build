export const generateLinkCode = () => {
  let key = "",
    characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  for (let i = 0; i < 6; i++) {
    key += characters.substr(
      Math.floor(Math.random() * characters.length + 1),
      1
    );
  }

  return key.toUpperCase();
};

export const formatQuestions = (questions = {}) => {
  if (Object.keys(questions).length === 0) return;

  return Object.keys(questions).map((el) => {
    const optionsArr = Object.keys(questions?.[el]?.options).map(
      (item) => questions?.[el]?.options?.[item]
    );
    return { ...questions?.[el], options: optionsArr };
  });
};
