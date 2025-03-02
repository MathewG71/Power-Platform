function compareDates(executionContext) {
    var formContext = executionContext.getFormContext();
    var productPhaseEntity = "cr852_productphase";
    var productPhaseEndDateColumn = "cr852_productphaseenddate";
    var productPhaseStartDateColumn = "cr852_productphasestart";
    var productcolumnName = "cr852_productfk";

    var enteredStartDate = formContext.getAttribute(productPhaseStartDateColumn).getValue();
    var enteredProductName = formContext.getAttribute(productcolumnName).getValue()[0];

    formContext.getControl(productPhaseStartDateColumn).clearNotification('unique_id');

    var query = `?$filter=_${productcolumnName}_value eq '${enteredProductName.id.slice(1, -1).toLowerCase()}'`;

    Xrm.WebApi.retrieveMultipleRecords(productPhaseEntity, query).then(
        function success(result) {
            var isValid = true;
            if (result.entities.length > 0) {
                result.entities.forEach(function (record) {
                    var productPhaseEndDate = record[productPhaseEndDateColumn] ? new Date(record[productPhaseEndDateColumn]) : null;
                    if (productPhaseEndDate && enteredStartDate < productPhaseEndDate) {
                        isValid = false;
                    }
                });
                if (!isValid) {
                    formContext.getControl(productPhaseStartDateColumn).addNotification({
                        messages: ['CheckDate'],
                        notificationLevel: 'ERROR',
                        uniqueId: 'unique_id'
                    });
                }
            }
            else {
                console.log("No records found")
            }
        },
        function (error) {
            console.log("Error Encountered - " + error.message);
        }
    )
}