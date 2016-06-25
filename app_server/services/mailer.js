var nodemailer = require('nodemailer');

function getTransporter() {
  return nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: process.env.MAILGUN_USERNAME,
      pass: process.env.MAILGUN_PASSWORD
    }
  });
}



exports.sendMail = function(emailTo, emailSubject, emailText, emailHtml, emailFrom) {
  return new Promise(function(resolve, reject){
    emailFrom = emailFrom || 'support@atgdevelopment.net';
    var transporter = getTransporter();
    var mailOptions = {
      to: emailTo,
      from: emailFrom,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
  };
