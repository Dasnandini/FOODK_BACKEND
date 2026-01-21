class ServiceResponse {
  static STATUS_SUCCESS = "Success";
  static STATUS_FAIL = "Fail";

  constructor() {
    this.serviceResponse = "";
    this.serviceStatus = "";
    this.serviceError = "";
  }

  success(data) {
    this.serviceResponse = data;
    this.serviceStatus = ServiceResponse.STATUS_SUCCESS;
    this.serviceError = "";
    return this;
  }

  fail(error) {
    this.serviceResponse = "";
    this.serviceStatus = ServiceResponse.STATUS_FAIL;
    this.serviceError = error;
    return this;
  }
}

export default ServiceResponse;
