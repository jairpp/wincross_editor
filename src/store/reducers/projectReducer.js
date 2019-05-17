import * as actions from "../actions";

const initialState = {
  title: "Test Project 1",
  projectCode: 1234567,
  jobNumber: 3070019,
  companyCode: "000101",
  bases: [],
  systemBaseType: "PREVIOUS", // Set reverse test as PREVIOUS for previous question or TERM for nearest term point
  vendors: [
    {
      MON: "1"
    },
    {
      CX: "2"
    },
    {
      MarketCube: "3"
    }
  ]
};

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.TOGGLE_SYSTEM_BASE:
      let tmpState = state;
      return Object.assign({}, tmpState, { systemBaseType: action.baseType });

    default:
      return state;
  }
};

export default projectReducer;
