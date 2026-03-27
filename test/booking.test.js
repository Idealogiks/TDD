import { jest } from "@jest/globals";
import { addBooking } from "../src/booking";
import { ServiceError, ValidationError } from "../errors";

function makeBooking() {
    return {
        localStorage: {
            addBooking: jest.fn()
        },
    };
}

describe("Given i try to add a booking", () => {
    test("When the booking does not have a name", () => {
        const booking = makeBooking();
        expect(() => addBooking({ 
            id: 1, 
            startDate: "2024-06-01", 
            endDate: "2024-06-02"
        }, booking.localStorage)).toThrow(new ValidationError("Booking must have a name"));
    });

    test("When the booking does not have a start date", () => {
        const booking = makeBooking();
        expect(() => addBooking({ 
            id: 1, 
            name: "Réservation", 
            endDate: "2024-06-02"
        }, booking.localStorage)).toThrow(new ValidationError("Booking must have a start date"));
    });

    test("When the booking does not have a end date", () => {
        const booking = makeBooking();
        expect(() => addBooking({ 
            id: 1, 
            name: "Réservation", 
            startDate: "2024-06-01"
        }, booking.localStorage)).toThrow(new ValidationError("Booking must have a end date"));
    });

    test("When the end date is before the start date", () => {
        const booking = makeBooking(); 
        expect(() => addBooking({ 
            id: 1, 
            name: "réservation", 
            startDate: "2024-06-02", 
            endDate: "2024-06-01"
        }, booking.localStorage)).toThrow(new ValidationError("End date cannot be before the start date"));
    });

    test("When the booking is at the same time as another booking", () => {
        const booking = makeBooking();
        booking.localStorage.getBookings.mockReturnValue([
            { id: 1, name: "Existante", startDate: "2024-06-01", endDate: "2024-06-03" }
        ]);

        expect(() => addBooking({
            id: 2,
            name: "Nouvelle",
            startDate: "2024-06-02",
            endDate: "2024-06-04"
        }, booking.localStorage)).toThrow(new ValidationError("Booking conflicts with an existing booking"));
    });
});