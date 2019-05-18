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
