import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Project Camp",
            link: "https://projectcamp.com",
        },
    });

    const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    const emailHtml = mailGenerator.generate(options.mailGenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: "projectcamp@gmail.com", //sender
        to: options.email, // Receiver
        subject: options.subject,
        text: emailText,
        html: emailHtml,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("EMAIL FAILED: ", error);
    }
};

const emailVerificationMailGenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Project Camp! We're very excited to have you on board.",
            action: {
                instructions:
                    "To get started with Project Camp, please click here:",
                button: {
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset your password.",
            action: {
                instructions: "To reset your password, please click here:",
                button: {
                    color: "#bc2a22ff",
                    text: "Reset your password",
                    link: passwordResetUrl,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };
};

// sendMail(
//     {
//         email: user.email,
//         subject: "abc",
//         mailGenContent: emailVerificationMailGenContent(
//             username,
//             `url`
//         )
//     }
// )

// options
//     {
//         email: user.email,
//         subject: "abc",
//         mailGenContent: emailVerificationMailGenContent(
//             username,
//             `url`
//         )
//     }

export {
    sendMail,
    emailVerificationMailGenContent,
    forgotPasswordMailGenContent,
};
