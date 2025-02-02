const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value !== "string" || value == "") return false;
  return true;
};

const validString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const validateInteger = (value) => {
  if (isNaN(value) || value <= 0) return false;
  return true;
};

const validateVideoLink = (value) => {
  const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
  if (!value || !urlRegex.test(value)) return false;
  return true;
};

module.exports = {
  validString,
  validateInteger,
  validateVideoLink,
  isValid,
};
