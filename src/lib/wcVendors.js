export const setVendorSuffix = vendors => {
  // if more than 9 vendors add a padding of 0 to the beginning of 1-9 vendor cells
  let vendorPadding = vendors.length > 9 ? "0" : "";
  let vendorLength = vendors.length > 9 ? ":2" : "";
  let vendorDash = vendors.length > 1 ? "-" : "";
  // let firstVendorKey = Object.keys(vendors[0])[0];
  let lastVendorKey = Object.keys(vendors[Object.keys(vendors).length - 1])[0];
  let vendorRanges = [
    vendors[0]["MON"],
    vendors[vendors.length - 1][lastVendorKey]
  ];
  let vendorSuffix = `1/8${vendorLength}(${vendorPadding}${
    vendorRanges[0]
  }${vendorDash}${vendorRanges[1]})`;

  return vendorSuffix;
};
