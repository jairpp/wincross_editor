const initialState = {
  title: "Test Project 1",
  projectCode: 1234567,
  jobNumber: 3070019,
  companyCode: "000101",
  bases: [],
  systemBaseType: "TERM", // Set reverse test as PREVIOUS for previous question or TERM for nearest term point
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
  return state;
};

export default projectReducer;
