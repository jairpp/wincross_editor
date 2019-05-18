import * as wcInit from "./wcInit";
import { setPrefix } from "./singleChoice/prefix";
import { parseSuffix } from "./singleChoice/suffix";

export const createTests = (project, wcObj, prefixOrSuffix) => {
  // // Route incoming data depending on whether it is Prefix/Suffix
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
