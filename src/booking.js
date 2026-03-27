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

    if (Date.parse(booking.endDate) < Date.parse(booking.startDate)) {
        throw new ValidationError("End date cannot be before the start date");
    }

    const existingBookings = localStorage.getBookings();
    for (const existing of existingBookings) {
        if ( Date.parse(booking.startDate) < Date.parse(existing.endDate) && Date.parse(booking.endDate) > Date.parse(existing.startDate)) {
            throw new ValidationError("Booking conflicts with an existing booking");
        }
    }

    try {
        localStorage.addBooking(booking);
    } catch (e) {
        throw new ServiceError("Localstorage doesn't respond");
    }
}

function deleteBooking(bookingId, localStorage) {
    const existingBookings = localStorage.getBookings();
    const bookingIndex = existingBookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
        throw new ValidationError("Booking with this id does not exist");
    }

    const booking = existingBookings[bookingIndex];

    if (Date.parse(booking.startDate) - Date.now() < 48 * 60 * 60 * 1000) {
        throw new ValidationError("Cannot delete a booking that starts in less than 48h");
    }

    localStorage.deleteBooking(bookingId);
}

function searchBookingByDate(date, localStorage) {
    if (isNaN(Date.parse(date))) {
        throw new ValidationError("Date is not valid");
    }

    const searchTime = Date.parse(date);
    const existingBookings = localStorage.getBookings();
    return existingBookings.filter(booking =>
        searchTime >= Date.parse(booking.startDate) &&
        searchTime <= Date.parse(booking.endDate)
    );
}


module.exports = { addBooking, deleteBooking, searchBookingByDate };