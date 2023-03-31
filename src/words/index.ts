import words from "./words";

const MinWordLength = 3;
const MaxWordLength = words.length - 1;

const getRandomLength = () => {
  return (
    MinWordLength +
    Math.floor(Math.random() * (MaxWordLength - MinWordLength + 1))
  );
};

const getRandomWord = (length: number = 0) => {
  if (length === 0) {
    length = getRandomLength();
  }
  const targets = words[length];
  return targets[Math.floor(Math.random() * targets.length)];
};

const isWordValid = (word: string) => {
  const length = word.length;
  return length < words.length && words[length].includes(word);
};

export { getRandomWord, isWordValid, MinWordLength, MaxWordLength };
