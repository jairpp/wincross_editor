// Import Singl Choice Functions
import * as SC from "./wcSingleChoice";
import { setVendorSuffix } from "./wcVendors";

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

export const PRE = "Prefix";
export const SUFF = "Suffix";

/* ----- Initialize all necessary data to contruct test for the current question iteration  ------*/

// **** NOTE: Right now all functions to create SC test is in 1 file.  However if testing
// with a base for a suffix that is a different question type, that quesiton will need to
// be routed to a different file and return only the data needed for writing that test
// suffix.  Need to refactor SC file and all other routes in future to accept the
// follwoing as arguments and return only necessary values:
// (appropriate question data, return data needed ie. prefix/suffix)
// **********************************************************************

export const initializeTest = allData => {
  let testSuffix = null;
  let testPrefix = null;
  let wcObjSuffix = null;

  // Create a WC instance with all question/choice data to create a prefix
  const wcObjPrefix = new wcInitData(allData, allData.qNumber);

  // route prefix data by question type and pass WC intance & project info
  testPrefix = directByQType(allData.project, wcObjPrefix, PRE);

  // Find Previous Question Indedx # to set base Suffix
  const prevQNumber = findPrevIndexNum(wcObjPrefix.currentQIndex, allData);

  // Create wcObj if a previous question exists in order to create a test suffix
  if (prevQNumber) {
    wcObjSuffix = new wcInitData(allData, prevQNumber);
    // route suffix data by question type and pass WC instance & proj. info
    testSuffix = directByQType(allData.project, wcObjSuffix, SUFF);
  } else {
    // If no prev question to use as suffix base, use vendor
    testSuffix = setVendorSuffix(allData.project.vendors);
  }

  // Return test object back to WC Component
  return {
    test: `${testPrefix} and not ${testSuffix}`,
    reverseTest: `${testSuffix} and not ${testPrefix}`
  };
};

class wcInitData {
  constructor(qData, qNumber) {
    // Set Current Q Number
    this.currentQNumber = qNumber;

    // Set Index number (position) within questions reducer
    // This is used to look up previous question choices as bases
    this.currentQIndex = setQIndexNum(this.currentQNumber, qData);

    // Set Current Question's Info
    this.currentQuestion = setCurrentQuestion(
      qData.questions,
      this.currentQNumber
    );

    // Set Current Choice's Info
    this.currentChoices = setCurrentChoices(qData.choices, this.currentQNumber);

    // Find the choice type for this question
    this.currentQType = setChoiceType(
      this.currentQuestion,
      this.currentChoices
    );

    // Set initial passChoices
    this.passChoices = setPassChoices(this.currentChoices);

    // Set data length of choices ie. 1/10:3 (:3 is the data length)
    this.dataLength = setDataLength(this.currentChoices);

    // Set current card number
    this.currentCardNum = setCurrentCardNum(this.currentChoices);

    // Set current column number
    this.firstColumnNum = getColNum(this.currentChoices);
  }
}

// Set tests prefix/suffix based on question type
const directByQType = (project, qDataObj, prefixOrSuffix) => {
  switch (qDataObj.currentQType) {
    case "Single-Choice":
      let SCresults = SC.createTests(project, qDataObj, prefixOrSuffix);
      return SCresults;

    default:
      console.log(
        `ERROR: Unable to detect question type for question ${currentQNumber}`
      );
  }
};

/* --------------------- END Initialization -----------------------------*/

/* ------------------------ Initialization Function ------------------------ */

// Select and set current question info
const setCurrentQuestion = (allQuestions, currentQNumber) => {
  const currentQuestions = allQuestions.filter(question => {
    return question.qNumber === currentQNumber;
  });
  return currentQuestions[0];
};

// Select and set the current choices info
const setCurrentChoices = (allChoices, currentQNumber) => {
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
const setChoiceType = (currentQuestion, currentChoices) => {
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

// Set question index number in questions reducer
const setQIndexNum = (currentQNumber, allData) => {
  for (let i = 0; i < allData.questions.length; i++) {
    if (allData.questions[i].qNumber === currentQNumber) {
      return i;
    }
  }
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

// Find previous Question Index # to create Suffix Test
const findPrevIndexNum = (currentQIndex, allData) => {
  return currentQIndex > 0
    ? allData.questions[currentQIndex - 1].qNumber
    : null;
};

/* ------------------------ END Wincross helper functions ------------------------ */
