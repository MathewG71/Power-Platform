function setCurrentDate(executionContext) {
  let dateColumnName = "cr1bf_startdate"; //Logical name Date field
  let currentDate = new Date();
  let formContext = executionContext.getFormContext();
  if (formContext.ui.getFormType() == 1) {
    formContext.getAttribute(dateColumnName).setValue(currentDate);
  }
}

function checkProductName(executionContext) {
  let formContext = executionContext.getFormContext();
  if (formContext.ui.getFormType() == 1) {
    let productEntity = "cr1bf_course"; //Logical name of table
    let productColumnName = "cr1bf_name"; //Logical name of Name field
    formContext.getControl(productColumnName).clearNotification('unique_id');
    let enteredProductName = formContext.getAttribute(productColumnName).getValue();
    let query = `?$filter=${productColumnName} eq '${enteredProductName}'&$top=3`;

    Xrm.WebApi.retrieveMultipleRecords(productEntity, query).then(
      function success(result) {
        if (result.entities.length > 0) {
          formContext.getControl(productColumnName).addNotification({
            messages: ['This name is already exist.'],
            notificationLevel: 'ERROR',
            uniqueId: 'unique_id'
          });
        }
      },
      function (error) {
        console.log("Error Encountered - " + error.message);
      }
    )
  }
}