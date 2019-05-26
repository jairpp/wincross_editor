// Set question index number in questions reducer
export const getQIndexNum = (currentQNumber, allData) => {
  for (let i = 0; i < allData.questions.length; i++) {
    if (allData.questions[i].qNumber === currentQNumber) {
      return i;
    }
  }
};

// Select and set current question info
export const setCurrentQuestion = (allQuestions, currentQNumber) => {
  const currentQuestions = allQuestions.filter(question => {
    return question.qNumber === currentQNumber;
  });
  return currentQuestions[0];
};

// Select and set the current choices info
export const setCurrentChoices = (allChoices, currentQNumber) => {
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
export const setChoiceType = (currentQuestion, currentChoices) => {
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

// Check/Set passChoices
export const setPassChoices = choices => {
  let allPassChoices = choices.filter(choice => {
    return !choice.isTermPoint;
  });
  // console.log("PassING: ", allPassChoices);
  return allPassChoices;
};

// Figuire out datalength of quesiton
export const setDataLength = choices => {
  const len = choices[0].cLocation.toString().length;
  return len > 1 ? `:${len}` : "";
};

// Set current card number
export const setCurrentCardNum = choices => {
  return choices[0].cCard;
};

// Set current card number
export const getColNum = choices => {
  return choices[0].cCol;
};

// Get all bases for current question
export const getBases = (qData, currentQIndex) => {
  return qData.questions[currentQIndex].bases;
};

// Get all prefix bases for current question
export const getPreBases = (qData, currentQIndex) => {
  return qData.questions[currentQIndex].preBases;
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

// Check locations of passChoices to see if consecutive
export const areLocationsConsecutive = choices => {
  let consecutive = false;
  // Get all locations out of passChoices object and sort them
  let allLocations = choices
    .map(choice => parseInt(choice.cLocation, 10))
    .sort(function(a, b) {
      return a - b;
    });

  // Check if each location is consecutive
  for (let i = 0; i < allLocations.length - 1; i++) {
    if (allLocations[i + 1] === allLocations[i] + 1) {
      consecutive = true;
    } else {
      consecutive = false;
      break;
    }
  }
  return consecutive;
};

// Find previous Question Index # to create Suffix Test
export const findPrevIndexNum = (currentQIndex, allData) => {
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

// String all bases for a question together with their operator ie(AND, AND NOT, etc)
export const parseBases = bases => {
  let parsedBases = bases
    .map(base => {
      return ` ${base.operator} ${base.location}`;
    })
    .join(" ");

  return parsedBases;
};

// Get range of questions using "fromQNum" and "toQNum"
export const getListOfQNumbersByRange = (fromQNum, toQNum, allData) => {
  const startIndex = getQIndexNum(fromQNum, allData);
  const endIndex = getQIndexNum(toQNum, allData);

  console.log(fromQNum, startIndex, toQNum, endIndex);
  // Throw error if range is inaccurate
  if (startIndex >= endIndex) {
    console.log('The "From" range # must be less than the "To" range #.');
    return;
  }
  // Store question #'s
  let qNumberArr = [];

  // Loop through questions using the start and ending indices
  for (let i = startIndex; i <= endIndex; i++) {
    qNumberArr.push(allData.questions[i].qNumber); // Push QNumbers into array
  }

  return qNumberArr;
};
