import * as wcInit from "./wincrossLib";
import { setVendorSuffix } from "./wcVendors";

export let vendorSuffix = null; // If there are no bases use vendors as test suffix ie. ... and not 1/8(01-10)

export const createTests = (project, wcObj, prefixOrSuffix) => {
  // Create a suffix(base) for the vendor in case there are no term points for this question
  vendorSuffix = setVendorSuffix(project.vendors);

  // Set the prefix(start of Wincross Check)
  if (prefixOrSuffix === wcInit.PRE) {
    return setPrefix(wcObj);
  } else if (prefixOrSuffix === wcInit.SUFF) {
    return parseSuffix(wcObj);
  } else {
    const err =
      "Error: Unable to resolve if test is Prefix or Suffix in wcSingleChoice.js";
    console.warn(err);
    return err;
  }
};

// Create the begining portion of a WC check
export const setPrefix = wcObj => {
  // Get
  const locations = wcObj.currentChoices.map(choice => {
    return choice.cLocation;
  });

  let prefix = `${wcObj.currentCardNum}/${wcObj.firstColumnNum}${
    wcObj.dataLength
  }(${locations[0]}-${locations[locations.length - 1]})`;

  return prefix;
};

// Create the ending portion of a WC check if base is not a vendor
export const parseSuffix = wcObj => {
  // Get all of the locations for the pass choices ie. [101,102,103]
  const passLocations = wcObj.passChoices.map(choice => {
    return choice.cLocation;
  });
  // If the pass choices are consecutive use first and last locations to write test ie
  // [1,2,3] => 1/10(1-3)
  let suffix = null;
  if (areLocationsConsecutive(wcObj.passChoices)) {
    suffix = `${wcObj.currentCardNum}/${wcObj.firstColumnNum}${
      wcObj.dataLength
    }(${passLocations[0]}-${passLocations[passLocations.length - 1]})`;

    // return suffix;
  } else {
    // Make sure that not all choices were selected as term points
    if (passLocations.length > 0) {
      // If not consecutive join all locations with a ','
      suffix = `${wcObj.currentCardNum}/${wcObj.firstColumnNum}${
        wcObj.dataLength
      }(${passLocations.join(",")})`;
      // return suffix;
    } else {
      // If there are no passChoices and all choices were set as term points
      // Set error in test suffix for user
      suffix = "Error: All choices can not be term points.\t";
      // return suffix;
    }
  }

  let parsedBases = wcInit.parseBases(wcObj.bases);
  console.log(parsedBases);
  // Get the joined bases from parseBases and apend to suffix then
  return parsedBases ? `{${suffix}${parsedBases}}` : `${suffix}${parsedBases}`;
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
