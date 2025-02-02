const dotenv = require("dotenv");
dotenv.config();

class Constants {
  constructor() {
    //Status_code Constants
    (this.BAD_REQUEST = 400),
      (this.NOT_ACCPT_CODE = 400),
      (this.GOOD_CODE = 200),
      (this.DATA_CREATE_CODE = 201),
      (this.NOT_CODE = 404),
      (this.ERR_CODE = 500),
      (this.AUTH_CODE = 401),
      (this.FORB_CODE = 403),
      (this.NOT_ACCEPT_CODE = 406),
    //considering access urls===========>

    this.INPUT_MISSING = "Input is missing ";
    this.STRING_INPUT = "Must be a String";
    this.INT_INPUT = "Must Be Integer Range";
    this.URL_INPUT = "Must be a Url";
    this.CREATION_ERROR = "Data is not created";
    this.NO_TOKEN = "Access denied, no token provided";
    this.INVALID_TOKEN = "Invalid or expired token";
    this.MISSINGMANDATS = "MANDATORY HEADERS OR PARAMS ARE MISSING";
    this.NOT_FOUND = "Data not found";
    this.ALREADY_EXISTS = "Data already exists";
    this.ARRAY_INPUT = "Must be an array with at least two choices"
    this.WRONG_INPUT = "Wrong Input"
    this.DELECTION = "Deletion Unsuccessfull";
    this.INVALID_FORMAT="Invalid options format"
    //SUCCESS=============>

    this.SUCCESSFUL = "Created Successfully";
    this.UPDATED = "Updated Successfully";
    this.DELETED = "Deleted Successfully";
    this.FETCHED = "Fetched Successfully";

    //error=============>

    this.COMMON_ERROR = "Internal Server Error";
  }
}
module.exports = new Constants();
