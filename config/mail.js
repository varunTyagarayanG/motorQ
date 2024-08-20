const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "varuntyagarayan.g22@iiits.in", 
        pass: "Tyagi__2004" 
    }
});

module.exports = transporter;
