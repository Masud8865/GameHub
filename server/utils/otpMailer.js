const transporter = require('./mailer');

const sendOtpEmail = async (to, otp) => {
    try {
        const mailOptions = {
            from: `GameHub Support <${process.env.SUPPORT_EMAIL}>`,
            to: to,
            subject: 'Your Password Reset OTP - GameHub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333; text-align: center;">GameHub Password Reset</h2>
                    <p style="color: #555; font-size: 16px;">We received a request to reset your password. Here is your One-Time Password (OTP):</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; background-color: #f4f4f4; color: #333; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
                    </div>
                    <p style="color: #555; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">If you did not request this, please ignore this email or contact support if you have concerns.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Could not send OTP email");
    }
};

module.exports = { sendOtpEmail };
