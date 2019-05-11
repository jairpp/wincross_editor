import * as wcInit from "./wincrossLib";
import { setVendorSuffix } from "./wcVendors";

// NOTE 1:
/*
  Have to check the passChoices to see if the data locations are consecutive.  If they are that means
  all of the choices need to be considered for the test and should use the choiceRanges ie:
  test 001 = 1/10(100-103).

  If they aren't consecutive that means a location was marked as a term point and should be ignored ie.
  (location)

  *** Ignore note as it may not matter after all
*/

// Note 2:
/* 
  Bases should be objects with a property of either (AND, AND NOT, OR, NOT) so that it can be easily parsed into a test
  ${wcInit.prefix.operator} ${wcInit.prefix.location} this can be added to the test prefix if necessary i.e
  test 001 = 1/10(100-103) ... becomes
  test 001 = {1/10(100-103) and 1/12(1)}
*/

export let vendorSuffix = null; // If there are no bases use vendors as test suffix ie. ... and not 1/8(01-10)

// Store both sides of test ie:
// test 001 = rightHandSide(prefix) AND NOT leftHandSide(suffix)
export let prefix = { operator: "", location: "" }; // The first values of a test (left hand side)
export let suffix = { operator: "", location: "" }; // The second values of a test (right hand side)

export const createTests = (project, wcObj, prefixOrSuffix) => {
  // Create a suffix(base) for the vendor in case there are no term points for this question
  vendorSuffix = setVendorSuffix(project.vendors);

  // Set the prefix(start of Wincross Check)
  if (prefixOrSuffix === wcInit.PRE) {
    return setPrefix(
      wcObj.dataLength,
      wcObj.currentCardNum,
      wcObj.firstColumnNum,
      wcObj.currentChoices
    );
  } else if (prefixOrSuffix === wcInit.SUFF) {
    return parseSuffix(
      wcObj.dataLength,
      wcObj.currentCardNum,
      wcObj.firstColumnNum,
      wcObj.passChoices
    );
  } else {
    const err =
      "Error: Unable to resolve if test is Prefix or Suffix in wcSingleChoice.js";
    console.warn(err);
    return err;
  }

  // console.log("PREF: ", prefix);
  // // Set the suffix(end of Wincross Check)
  // setSuffix(project.bases);
  // return {
  //   test: `${prefix} and not ${suffix}`,
  //   reverseTest: `${suffix} and not ${prefix}`
  // };
};

// Create the begining portion of a WC check
export const setPrefix = (dLength, cardNum, colNum, choices) => {
  // Get
  const locations = choices.map(choice => {
    return choice.cLocation;
  });

  let prefix = `${cardNum}/${colNum}${dLength}(${locations[0]}-${
    locations[locations.length - 1]
  })`;

  return prefix;
};

// Create the ending portion of a WC check if base is not a vendor
export const parseSuffix = (dLength, cardNum, colNum, passChoices) => {
  // Get all of the locations for the pass choices ie. [101,102,103]
  const passLocations = passChoices.map(choice => {
    return choice.cLocation;
  });
  // If the pass choices are consecutive use first and last locations to write test ie
  // [1,2,3] => 1/10(1-3)

  if (areLocationsConsecutive(passChoices)) {
    let prefix = `${cardNum}/${colNum}${dLength}(${passLocations[0]}-${
      passLocations[passLocations.length - 1]
    })`;

    return prefix;
  } else {
    // Make sure that not all choices were selected as term points
    if (passLocations.length > 0) {
      // If not consecutive join all locations with a ','
      let prefix = `${cardNum}/${colNum}${dLength}(${passLocations.join(",")})`;
      return prefix;
    } else {
      // If there are no passChoices and all choices were set as term points
      // Set error in test prefix for user
      let prefix = "Error: All choices can not be term points.\t";
      return prefix;
    }
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

export const setSuffix = (bases, wcObj) => {
  // If there are no term points use vendors as base
  if (bases.length === 0) {
    suffix = vendorSuffix;
  }
};
