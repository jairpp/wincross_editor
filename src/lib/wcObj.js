import * as wcFuncs from "./wcFuncs";

// Create an object instance with all relevant info on the current question
// to parse WC checks

export class createWCObj {
  constructor(allData, qNumber) {
    // Set Current Q Number
    this.currentQNumber = qNumber;

    // Set Index number (position) within questions reducer
    // This is used to look up previous question choices as bases
    this.currentQIndex = wcFuncs.getQIndexNum(this.currentQNumber, allData);

    // Set Current Question's Info
    this.currentQuestion = wcFuncs.setCurrentQuestion(
      allData.questions,
      this.currentQNumber
    );

    // Set Current Choice's Info
    this.currentChoices = wcFuncs.setCurrentChoices(
      allData.choices,
      this.currentQNumber
    );

    // Find the choice type for this question
    this.currentQType = wcFuncs.setChoiceType(
      this.currentQuestion,
      this.currentChoices
    );

    // Set initial passChoices
    this.passChoices = wcFuncs.setPassChoices(this.currentChoices);

    // Set data length of choices ie. 1/10:3 (:3 is the data length)
    this.dataLength = wcFuncs.setDataLength(this.currentChoices);

    // Set current card number
    this.currentCardNum = wcFuncs.setCurrentCardNum(this.currentChoices);

    // Set current column number
    this.firstColumnNum = wcFuncs.getColNum(this.currentChoices);

    // Set bases for current question
    this.bases = wcFuncs.getBases(allData, this.currentQIndex);

    // Set prefix bases for current question
    this.preBases = wcFuncs.getPreBases(allData, this.currentQIndex);
  }
}
