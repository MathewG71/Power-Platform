function bulkDeleteRecords(gridContext, selectedItemsId) {
  if (selectedItemsId.length > 0) {
    Xrm.Utility.showProgressIndicator("Checking for child records.");
    const checkChildApiPromises = selectedItemsId.map(itemId => checkChildRecords(itemId));
    Promise.all(checkChildApiPromises)
      .then(results => {
        if (results.includes(true)) {
          Xrm.Utility.closeProgressIndicator();
          Xrm.Navigation.openErrorDialog({ message: "Detetion operation terminated because of one or more record have child record." });
        } else {
          Xrm.Utility.closeProgressIndicator();
          Xrm.Utility.showProgressIndicator("Deleting records...");
          const deleteRecordApiPromises = selectedItemsId.map(itemId => deleteRecord(itemId));
          Promise.all(deleteRecordApiPromises)
            .then(results => {
              Xrm.Utility.closeProgressIndicator();
              var alertStrings = { confirmButtonLabel: "OK", text: "All records deleted successfully.", title: "" };
              var alertOptions = { height: 200, width: 420 };
              Xrm.Navigation.openAlertDialog(alertStrings, alertOptions)
                .then(function () {
                  gridContext.refresh();
                });
            })
            .catch(error => {
              console.log("One or more API calls failed:", error);
              Xrm.Navigation.openErrorDialog({ message: "Something went wrong. Please try again later." });
            });
        }
      })
      .catch(error => {
        console.log("One or more API calls failed:", error);
        Xrm.Navigation.openErrorDialog({ message: "Something went wrong. Please try again later." });
      });
  } else {
    var alertStrings = { confirmButtonLabel: "OK", text: "You must select one or more records before you can perform this action.", title: "" };
    var alertOptions = { height: 200, width: 420 };
    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
  }
}

function checkChildRecords(itemId) {
  return new Promise((resolve, reject) => {
    let childTableLogicalName = "cr1bf_course"; // Child table logical Name
    let lookupColumnLogicalName = "cr1bf_professor"; // Lookup column logical name (Lookup with parent in child table)
    Xrm.WebApi.retrieveMultipleRecords(childTableLogicalName, `?$filter=_${lookupColumnLogicalName}_value eq '${itemId}'&$top=2`).then(
      function success(result) {
        if (result.entities.length > 1) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      function (error) {
        console.log(error);
        reject();
      }
    );
  });
}

function deleteRecord(itemId) {
  return new Promise((resolve, reject) => {
    let parentTableLogicalName = "cr1bf_professor"; // Parent table logical name
    Xrm.WebApi.deleteRecord(parentTableLogicalName, itemId).then(
      function success(result) {
        console.log("Record deleted");
        resolve();
      },
      function (error) {
        console.log(error);
        reject();
      }
    );
  });
}