const nodemailer=require('nodemailer')
const sendEmail=async options=>{//async because of last line of code returns promise
    const transporter=nodemailer.createTransport({
        host:"smtp.mailtrap.io",//ye sab isliye kar rahe kyuki unlike gmail mailtrap predefined nai hai nodemaiiler par,waran sevice likh ke kaam ho jata
        port:2525,
        auth:{
            user:"b1cbd8cd972ef7",
            pass:"8cb6ecbb483b90",
        }      

    });
    //2)Define the email options
    const mailOptions={
        from:'Prashant Gautam <prashant@gmail.com>',
        to:options.email,
        subject:options.subject,
        text:options.message,
        // html:
    }

    //3)Actually send email
    await transporter.sendMail(mailOptions);

};
module.exports=sendEmail;