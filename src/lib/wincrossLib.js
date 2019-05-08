// Import Singl Choice Functions
import * as SC from "./wcSingleChoice";

// Store all question/choice info for current question
export let currentQuestion = null; // Current Question Object
export let currentChoices = null; // All Current Choices for Question
export let currentQNumber = null; // Current Mapped Question Number
export let currentQType = null; // Single, Multi, Custom Rating(CR)
export let dataLength = null; // 1/10:3 (:3 is data length)
export let currentCardNum = null; // 1/10 (1) is currentCardNum
export let firstColumnNum = null; // The First Choices Column # ie. 1/10 (10) is the firstColumnNum

// PassChoices = choices that are not set as term points
export let passChoices = null;

/* ----- Initialize all necessary data to contruct test for the current question iteration  ------*/
export const initializeTest = allData => {
  // Set Current Q Number
  currentQNumber = allData.qNumber;

  // Set Current Question's Info
  currentQuestion = setCurrentQuestion(allData.questions);

  // Set Current Choice's Info
  currentChoices = setCurrentChoices(allData.choices);

  // Find the choice type for this question
  currentQType = setChoiceType();

  // Set initial passChoices
  passChoices = setPassChoices(currentChoices);

  // Set data length of choices ie. 1/10:3 (:3 is the data length)
  dataLength = setDataLength(currentChoices);

  // Set current card number
  currentCardNum = setCurrentCardNum(currentChoices);

  // Set current column number
  firstColumnNum = getColNum(currentChoices);

  // Set tests prefix/suffix based on question type
  switch (currentQType) {
    case "Single-Choice":
      let SCresults = SC.createTests(allData.project);
      return SCresults;

    default:
      alert(
        `ERROR: Unable to detect question type for question ${currentQNumber}`
      );
  }
};

/* --------------------- END Initialization -----------------------------*/

/* ------------------------ Initialization Function ------------------------ */

// Select and set current question info
const setCurrentQuestion = allQuestions => {
  const currentQuestions = allQuestions.filter(question => {
    return question.qNumber === currentQNumber;
  });
  return currentQuestions[0];
};

// Select and set the current choices info
const setCurrentChoices = allChoices => {
  for (let i = 0; i < allChoices.length; i++) {
    let choices = allChoices[i].filter(choice => {
      return choice.qNumber === currentQNumber;
    });

    if (choices.length > 0) {
      return choices;
    }
  }
  return null;
};

// Set the current choice type
const setChoiceType = () => {
  if (currentQuestion.CRranges.length > 0) {
    // Will only have ranges if CR
    return "Custom-Rating";
  }

  if (isDataConsecutive(currentChoices, "cCol")) {
    // "col" specifies to check columns otherwise check locations
    return "Multi-Choice";
  } else {
    return "Single-Choice";
  }
};

// Figuire out datalength of quesiton
const setDataLength = choices => {
  const len = choices[0].cLocation.toString().length;
  return len > 1 ? `:${len}` : "";
};

// Set current card number
const setCurrentCardNum = choices => {
  return choices[0].cCard;
};

// Set current card number
const getColNum = choices => {
  return choices[0].cCol;
};

/* ------------------------ END Initialization Function ------------------------ */

/* ------------------------ Wincross helper functions ------------------------ */

// Check/Set passChoices
const setPassChoices = choices => {
  let allPassChoices = choices.filter(choice => {
    return !choice.isTermPoint;
  });
  // console.log("PassING: ", allPassChoices);
  return allPassChoices;
};

// Check to see if the current choice's columns are consecutive or not (*** This only works well to test columns not data locations)
export const isDataConsecutive = (choices, type) => {
  if (choices.length <= 1) {
    return null;
  }

  let columnOrLocation = type === "cCol" ? "cCol" : "cLocation";
  let allChoicesColOrLoc = choices
    .map(choice => {
      return choice[columnOrLocation];
    })
    .sort(function(a, b) {
      // Sort the columns
      return a - b;
    });

  if (allChoicesColOrLoc[0] === allChoicesColOrLoc[1]) {
    return false;
  } else {
    return true;
  }
};

/* ------------------------ END Wincross helper functions ------------------------ */
