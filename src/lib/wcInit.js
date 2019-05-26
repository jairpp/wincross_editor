// Import Singl Choice Functions
import * as SC from "./wcSingleChoice";
import * as wcObj from "./wcObj";
import * as wcFuncs from "./wcFuncs";
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
  let parsedBases = null;
  let parsedPreBases = null;
  let currentQIndex = null;

  // Create a WC instance with all question/choice data to create a prefix
  const wcObjPrefix = new wcObj.createWCObj(allData, allData.qNumber);

  // Set current Q index #
  currentQIndex = wcFuncs.getQIndexNum(allData.qNumber, allData);

  // route prefix data by question type and pass WC intance & project info
  testPrefix = directByQType(allData.project, wcObjPrefix, PRE);

  // If project is set to use the previous question as it's basic base
  if (allData.project.systemBaseType === "PREVIOUS") {
    // Find Previous Question Indedx # to set base Suffix
    const prevQNumber = wcFuncs.findPrevIndexNum(
      wcObjPrefix.currentQIndex,
      allData
    );

    if (prevQNumber) {
      // Create wcObj if a previous question exists in order to create a test suffix
      wcObjSuffix = new wcObj.createWCObj(allData, prevQNumber);

      // route suffix data by question type and pass WC instance & proj. info
      testSuffix = directByQType(allData.project, wcObjSuffix, SUFF);
    } else {
      // If no prev question to use as suffix base, use vendor
      testSuffix = setVendorSuffix(allData.project.vendors);
    }
  }
  // Else if project is set to use Term points as basic base
  else if (allData.project.systemBaseType === "TERM") {
    // Find closest question with term point that is relevant to current question
    const closestTermPointQNumber = wcFuncs.findClosestTermPoint(allData);
    // If found set wcObj with that qNumber and route bases on that question type
    if (closestTermPointQNumber) {
      wcObjSuffix = new wcObj.createWCObj(allData, closestTermPointQNumber);

      // route suffix data by question type and pass WC instance & proj. info
      testSuffix = directByQType(allData.project, wcObjSuffix, SUFF);
    } else {
      // If no previous TERM points found use vendors as base
      testSuffix = setVendorSuffix(allData.project.vendors);
    }
  }

  // Parse the suffix bases
  parsedBases =
    allData.questions[currentQIndex].bases.length > 0
      ? wcFuncs.parseBases(allData.questions[currentQIndex].bases)
      : "";

  // Get the joined bases from parsedBases and apend to suffix
  const combinedSuffix = parsedBases
    ? `{${testSuffix}${parsedBases}}`
    : `${testSuffix}${parsedBases}`;

  // Parse the prefix bases
  parsedPreBases = wcObjPrefix ? wcFuncs.parseBases(wcObjPrefix.preBases) : "";

  //  Handle any skip bases

  // Get the joined bases from parsedPreBases and apend to prefix
  const combinedPrefix = parsedPreBases
    ? `{${testPrefix}${parsedPreBases}}`
    : `${testPrefix}${parsedPreBases}`;

  // Return test object back to WC Component
  return {
    test: `${combinedPrefix} and not ${combinedSuffix}`,
    reverseTest: `${combinedSuffix} and not ${combinedPrefix}`
  };
};

// Set tests prefix/suffix based on question type
const directByQType = (project, wcObj, prefixOrSuffix) => {
  switch (wcObj.currentQType) {
    case "Single-Choice":
      let SCresults = SC.createTests(project, wcObj, prefixOrSuffix);
      return SCresults;

    default:
      console.log(
        `ERROR: Unable to detect question type for question ${
          wcObj.currentQNumber
        }`
      );
  }
};
