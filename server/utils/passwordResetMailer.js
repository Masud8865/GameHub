const transporter = require('./mailer');

const sendPasswordResetSuccessEmail = async (to) => {
    try {
        const mailOptions = {
            from: `GameHub Support <${process.env.SUPPORT_EMAIL}>`,
            to: to,
            subject: 'Password Successfully Reset - GameHub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">GameHub Password Reset Successful</h2>
                    <p style="color: #555; font-size: 16px;">Hello,</p>
                    <p style="color: #555; font-size: 16px;">This email is to confirm that the password for your GameHub account has been successfully reset.</p>
                    <p style="color: #555; font-size: 16px;">You can now log in using your new password.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">If you did not perform this action, please contact our support team immediately.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw new Error("Could not send password reset success email");
    }
};

module.exports = { sendPasswordResetSuccessEmail };
