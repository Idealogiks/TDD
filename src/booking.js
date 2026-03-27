const { ValidationError, ServiceError } = require("../errors");

function addBooking(booking, localStorage){
    if (!booking.id) {
        throw new ValidationError("Booking must have an id");
        
    }
    if (!booking.name) {
        throw new ValidationError("Booking must have a name");
    }

    if (!booking.startDate) {
        throw new ValidationError("Booking must have a start date");
    }

    if (!booking.endDate) {
        throw new ValidationError("Booking must have an end date");
    }
}


module.exports = { addBooking };