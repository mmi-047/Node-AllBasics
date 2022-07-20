const nodemailer = require('nodemailer')
const nodeMailerConfig = require('./nodeMailerConfig')

const sendEmail = async ({to,subject,html})=>{
   
    let testAccount = await nodemailer.createTestAccount(); 
    
    const transporter = nodemailer.createTransport(nodeMailerConfig);

return transporter.sendMail({
        from: '"Mehul Mistry👻" <mehul@gmail.com.com>', // sender address
        to,
        subject,
        html,
      });
}

module.exports = sendEmail