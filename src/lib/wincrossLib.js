// Import Singl Choice Functions
import * as SC from "./wcSingleChoice";
import { setVendorSuffix } from "./wcVendors";

// PassChoices = choices that are not set as term points
export let passChoices = null;

export const PRE = "Prefix";
export const SUFF = "Suffix";

/* ----- Initialize all necessary data to contruct test for the current question iteration  ------*/

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

  if (prevQNumber) {
    // If project is set to use the previous question as it's basic base
    if (allData.project.systemBaseType === "PREVIOUS") {
      // Create wcObj if a previous question exists in order to create a test suffix
      wcObjSuffix = new wcInitData(allData, prevQNumber);

      // route suffix data by question type and pass WC instance & proj. info
      testSuffix = directByQType(allData.project, wcObjSuffix, SUFF);
    }
    // Else if project is set to use Term points as basic base
    else if (allData.project.systemBaseType === "TERM") {
      // Find closest question with term point that is relevant to current question
      const closestTermPointQNumber = findClosestTermPoint(allData);
      // If found set wcObj with that qNumber and route bases on that question type
      if (closestTermPointQNumber) {
        wcObjSuffix = wcObjSuffix = new wcInitData(
          allData,
          closestTermPointQNumber
        );
        testSuffix = directByQType(allData.project, wcObjSuffix, SUFF);
      } else {
        // If no previous TERM points found use vendors as base
        testSuffix = setVendorSuffix(allData.project.vendors);
      }
    }
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
    this.currentQIndex = getQIndexNum(this.currentQNumber, qData);

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

    // Set bases for current question
    this.bases = getBases(qData, this.currentQIndex);
  }
}

// Set tests prefix/suffix based on question type
const directByQType = (project, wcObj, prefixOrSuffix) => {
  switch (wcObj.currentQType) {
    case "Single-Choice":
      let SCresults = SC.createTests(project, wcObj, prefixOrSuffix);
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
const getQIndexNum = (currentQNumber, allData) => {
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

export const findClosestTermPoint = allData => {
  // Get current qIndex
  let qIndex = getQIndexNum(allData.qNumber, allData) - 1;

  // Traverse choices arrays backwards from current qNumber until a term point is found
  for (let i = qIndex; i >= 0; i--) {
    for (let j = 0; j <= allData.choices[i].length - 1; j++) {
      let choice = allData.choices[i][j];
      if (choice.isTermPoint) {
        return choice.qNumber;
      }
    }
  }
  return null;
};

export const getBases = (qData, currentQIndex) => {
  return qData.questions[currentQIndex].bases;
};

/* ------------------------ END Wincross helper functions ------------------------ */

// String all bases for a question together with their operator ie(AND, AND NOT, etc)
export const parseBases = bases => {
  let parsedBases = bases
    .map(base => {
      return ` ${base.operator} ${base.location}`;
    })
    .join(" ");

  return parsedBases;
};
