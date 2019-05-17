export const TOGGLE_TERM_POINT = "TOGGLE_TERM_POINT";
export const toggle_term_point = choiceData => {
  return {
    type: TOGGLE_TERM_POINT,
    choiceData
  };
};

export const TOGGLE_SYSTEM_BASE = "TOGGLE_SYSTEM_BASE";
export const toggle_system_base = baseType => {
  return {
    type: TOGGLE_SYSTEM_BASE,
    baseType
  };
};
