const transporter = require("../config/mail");

const sendBookingConfirmationEmail = async (user, car, bookingDetails) => {
    const mailOptions = {
        from: '"Car Rental Service" <varuntyagarayan.g@iiits.in>',
        to: user.email,
        subject: "Booking Confirmation",
        html: `
            <h3>Booking Confirmation</h3>
            <p>Dear ${user.name},</p>
            <p>Your booking for the car <strong>${car.name} (${car.make} ${car.model} - ${car.year})</strong> has been confirmed.</p>
            <h4>Booking Details:</h4>
            <ul>
                <li>Start Time: ${new Date(bookingDetails.from).toLocaleString()}</li>
                <li>End Time: ${new Date(bookingDetails.to).toLocaleString()}</li>
                <li>Total Duration: ${calculateDuration(bookingDetails.from, bookingDetails.to)} hours</li>
                <li>Rate per Hour: $${car.rentPerHour}</li>
                <li>Total Amount: $${calculateTotalAmount(bookingDetails.from, bookingDetails.to, car.rentPerHour)}</li>
            </ul>
            <p>Thank you for using our service!</p>
            <p>Best regards,<br/>Car Rental Service</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Booking confirmation email sent successfully!");
    } catch (error) {
        console.error("Error sending booking confirmation email:", error.message);
    }
};

const calculateDuration = (from, to) => {
    const startTime = new Date(from);
    const endTime = new Date(to);
    const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
    return durationInHours;
};

const calculateTotalAmount = (from, to, rentPerHour) => {
    const duration = calculateDuration(from, to);
    return duration * rentPerHour;
};

module.exports = sendBookingConfirmationEmail;
