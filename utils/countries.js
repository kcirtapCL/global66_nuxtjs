export const allowedCountries = (code = true) => {
  if (code) {
    return ["AR", "BR", "CL", "CO", "EC", "MX", "PE"];
  }
  return [
    ["AR", "Argentina"],
    ["BR", "Brasil"],
    ["CL", "Chile"],
    ["CO", "Colombia"],
    ["EC", "Ecuador"],
    ["MX", "México"],
    ["PE", "Perú"]
  ];
};
