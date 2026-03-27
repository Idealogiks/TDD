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

    if (new Date(booking.endDate) < new Date(booking.startDate)) {
        throw new ValidationError("End date cannot be before the start date");
    }

    const existingBookings = localStorage.getBookings();
    for (const existing of existingBookings) {
        if ( new Date(booking.startDate) < new Date(existing.endDate) && new Date(booking.endDate) > new Date(existing.startDate)) {
            throw new ValidationError("Booking conflicts with an existing booking");
        }
    }

    try {
        localStorage.addBooking(booking);
    } catch (e) {
        throw new ServiceError("Localstorage doesn't respond");
    }
}


module.exports = { addBooking };