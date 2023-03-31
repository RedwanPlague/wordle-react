import React, { useCallback, useEffect, useState } from "react";
import "./index.css";

import {
  getRandomWord,
  isWordValid,
  MinWordLength,
  MaxWordLength,
} from "../../words";

type Option = {
  label: string;
  value: number;
};

const wordLengthOptions: Option[] = [{ label: "random", value: 0 }];
for (let i = MinWordLength; i <= MaxWordLength; i++) {
  wordLengthOptions.push({ label: `${i}`, value: i });
}

const MinNumberOfGuesses = 1;
const MaxNumberOfGuesses = 15;
const DefaultNumberOfGuesses = 6;

const numberOfGuessesOptions: Option[] = [{ label: "infinite", value: 0 }];
for (let i = MinNumberOfGuesses; i <= MaxNumberOfGuesses; i++) {
  numberOfGuessesOptions.push({ label: `${i}`, value: i });
}

function Game() {
  const [wordLength, setWordLength] = useState<number>(
    wordLengthOptions[0].value
  );

  const [wordToGuess, setWordToGuess] = useState<string>("");

  const [numberOfGuesses, setNumberOfGuesses] = useState<number>(
    DefaultNumberOfGuesses
  );

  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const generateWordToGuess = useCallback(() => {
    const newWordToGuess = getRandomWord(wordLength);
    setWordToGuess(newWordToGuess);
    setCurrentGuess("");
    setPreviousGuesses([]);
  }, [wordLength]);

  useEffect(() => {
    generateWordToGuess();
  }, [generateWordToGuess]);

  const handleWordLengthChange = (selectedValue: number) => {
    setWordLength(selectedValue);
  };

  const handleNumberOfGuessesChange = (selectedValue: number) => {
    setNumberOfGuesses(selectedValue);
  };

  const renderWordLengthSelector = () => {
    return (
      <div className="word-length">
        <div>
          <label>Word length: </label>
        </div>
        <select
          value={wordLength}
          onChange={(event) => handleWordLengthChange(+event.target.value)}
        >
          {wordLengthOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderNumberOfGuessesSelector = () => {
    return (
      <div className="number-of-guesses">
        <div>
          <label>Number of guesses: </label>
        </div>
        <select
          value={numberOfGuesses}
          onChange={(event) => handleNumberOfGuessesChange(+event.target.value)}
        >
          {numberOfGuessesOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderInputMessage = () => {
    if (currentGuess.length < wordToGuess.length) {
      return <span style={{ visibility: "hidden" }}>Too short</span>;
    }
    if (!isWordValid(currentGuess)) {
      return <span>Unrecognized word</span>;
    }
    if (previousGuesses.includes(currentGuess)) {
      return <span>Already guessed this word</span>;
    }
    return <span style={{ visibility: "hidden" }}>Valid guess</span>;
  };

  const gameFinished = () => {
    return (
      previousGuesses.includes(wordToGuess) ||
      (numberOfGuesses !== 0 && previousGuesses.length >= numberOfGuesses)
    );
  };

  const handleTypeGuess = (guess: string) => {
    if (guess.length <= wordToGuess.length) {
      setCurrentGuess(guess);
    }
  };

  const isGuessValid = () => {
    return (
      currentGuess.length === wordToGuess.length &&
      !previousGuesses.includes(currentGuess) &&
      isWordValid(currentGuess)
    );
  };

  const handleConfirmGuess = () => {
    if (isGuessValid()) {
      setPreviousGuesses([...previousGuesses, currentGuess]);
      setCurrentGuess("");
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "Enter") {
      handleConfirmGuess();
    }
  };

  const getColor = (ch: string, index: number) => {
    if (index >= wordToGuess.length) {
      return "red";
    }
    if (wordToGuess.charAt(index) === ch) {
      return "green";
    }
    if (wordToGuess.includes(ch)) {
      return "darkorange";
    }
    return "black";
  };

  return (
    <div className="Game">
      <div>{renderWordLengthSelector()}</div>
      <div>{renderNumberOfGuessesSelector()}</div>
      <div className="length-shower">
        Guess a {wordToGuess.length} letter word &nbsp;
        <button onClick={() => generateWordToGuess()}>Regenerate</button>
      </div>
      <div className="trials-left">
        Trials left:{" "}
        {numberOfGuesses === 0
          ? "infinite"
          : Math.max(0, numberOfGuesses - previousGuesses.length)}
      </div>
      <div className="guess">
        <input
          value={currentGuess}
          onChange={(event) => handleTypeGuess(event.target.value)}
          onKeyDown={(event) => handleKeyPress(event.key)}
          disabled={gameFinished()}
        ></input>
        <button onClick={() => handleConfirmGuess()} disabled={!isGuessValid()}>
          Guess
        </button>
        <div className="input-message">{renderInputMessage()}</div>
      </div>
      <div
        className="reveal"
        style={{ visibility: gameFinished() ? "visible" : "hidden" }}
      >
        The word was: <span className="word">{wordToGuess}</span>
      </div>
      <div>
        {previousGuesses
          .slice()
          .reverse()
          .map((guess) => (
            <div key={guess} className="char-row">
              {guess.split("").map((ch, i) => (
                <span
                  key={ch + "-" + i}
                  className="char-box"
                  style={{ backgroundColor: getColor(ch, i) }}
                >
                  {ch}
                </span>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Game;
