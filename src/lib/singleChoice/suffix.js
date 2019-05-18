import * as wcFuncs from "../wcFuncs";

// Create the ending portion of a WC check if base is not a vendor
export const parseSuffix = wcObj => {
  // Get all of the locations for the pass choices ie. [101,102,103]
  const passLocations = wcObj.passChoices.map(choice => {
    return choice.cLocation;
  });
  // If the pass choices are consecutive use first and last locations to write test ie
  // [1,2,3] => 1/10(1-3)
  let suffix = null;
  if (wcFuncs.areLocationsConsecutive(wcObj.passChoices)) {
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
    }
  }
  return suffix;
};
