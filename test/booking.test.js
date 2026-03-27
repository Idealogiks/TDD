const { addBooking } = require("../src/booking");
const { ServiceError, ValidationError } = require("../errors");

function makeBooking() {
    return {
        localStorage: {
            addBooking: jest.fn(),
            getBookings: jest.fn().mockReturnValue([])
        },
    };
}

describe("Given i try to add a booking", () => {
    //Cas non passants
    test("When the booking does not have an id", () => {
        const booking = makeBooking();
        expect(() => addBooking ({
            name: "réservation", 
            startDate: "2024-06-01", 
            endDate: "2024-06-02"
        }, booking.localStorage)).toThrow(new ValidationError("Booking must have an id"));
    })

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
        }, booking.localStorage)).toThrow(new ValidationError("Booking must have an end date"));
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

    /*
    test("When the booking is at the same time as another booking", () => {
        const booking = makeBooking();
        booking.localStorage.getBookings = jest.fn().mockReturnValue([
            { id: 1, name: "existe deja", startDate: "2024-06-01", endDate: "2024-06-02" }
        ]);

        expect(() => addBooking({
            id: 2,
            name: "Nouvelle",
            startDate: "2024-06-02",
            endDate: "2024-06-04"
        }, booking.localStorage)).toThrow(new ValidationError("Booking conflicts with an existing booking"));
    });
    */

    //Cas passants 
    test("When the booking is valid", () => {
        const booking = makeBooking();
        addBooking({ 
            id: 1, 
            name: "réservation", 
            startDate: "2024-06-01", 
            endDate: "2024-06-03"
        }, booking.localStorage);
        
        expect(booking.localStorage.addBooking).toHaveBeenCalledWith({
            id: 1,
            name: "réservation",
            startDate: "2024-06-01",
            endDate: "2024-06-03"
        });
    });

    // Peut-être un peu moins utile ce test mais je me suis dit que c'était peut-être mieux de vérifier au cas où
    test("When the booking is valid and Start date is juste after the previous endDate",() => {
        const booking = makeBooking();
        booking.localStorage.addBooking.mockReturnValue([
            { id: 1, name: "existe deja", startDate: "2024-06-01", endDate: "2024-06-02" }
        ]);

        expect(() => addBooking({
            id: 2,
            name: "nouveau",
            startDate: "2024-06-02",
            endDate: "2024-06-03"
        }, booking.localStorage)).not.toThrow();
    })

    // Cas bloquant 
    /*
    test("When the localStorage doesn't respond ",() => {
        const booking = makeBooking();
        booking.localStorage.addBooking.mockRejectedValue();
        expect(() => addBooking({
            id: 2,
            name: "nouveau",
            startDate: "2024-06-02",
            endDate: "2024-06-03"
        }, booking.localStorage)).toThrow(new ServiceError("Localstorage doesn't respond"));   
    })
    */
});