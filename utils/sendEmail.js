import axios from "axios";

const sendResetEmail = async (to, resetLink) => {
    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: "Swiggy Clone",
                email: process.env.EMAIL_FROM, // MUST be verified in Brevo
            },
            to: [{ email: to }],
            subject: "Reset Password",
            htmlContent: `
        <h3>Password Reset</h3>
        <p>Click below link:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Valid for 10 minutes</p>
      `,
        },
        {
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "api-key": process.env.BREVO_API_KEY, // 👈 xkeysib-...
            },
        }
    );
};

export default sendResetEmail;
