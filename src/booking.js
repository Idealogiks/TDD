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

function deleteBooking(bookingId, localStorage) {
    const existingBookings = localStorage.getBookings();
    const ListBookings = existingBookings.findIndex(b => b.id === bookingId);

    if (ListBookings === -1) {
        throw new ValidationError("Booking with this id does not exist");
    }

    const booking = existingBookings[ListBookings];
    const now = new Date();
    const startDate = new Date(booking.startDate);

    if (startDate - now < 48 * 60 * 60 * 1000) {
        throw new ValidationError("Cannot delete a booking that starts in less than 48h");
    }

    localStorage.deleteBooking(bookingId);
}

function searchBookingByDate(date, localStorage) {
    if (isNaN(Date.parse(date))) {
        throw new ValidationError("Date is not valid");
    }

    const existingBookings = localStorage.getBookings();
    return existingBookings.filter(booking => {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        return date >= startDate && date <= endDate;
    });
}


module.exports = { addBooking, deleteBooking, searchBookingByDate };