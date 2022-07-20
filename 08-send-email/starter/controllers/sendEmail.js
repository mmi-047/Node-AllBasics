const nodemailer = require('nodemailer')



const sendEmail = async(req,res)=>{
let testAccount = await nodemailer.createTestAccount()
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'christina.kshlerin69@ethereal.email',
        pass: 'UU9YtyV4HqjgTJd5nM'
    }
});
let info = await transporter.sendMail({
    from:'"mehul"<mroxx34@gmail.com>',
    to:'bar@example.com',
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<h2>Sending email with node js</h2>",


})

    res.json(info)
}
module.exports= sendEmail