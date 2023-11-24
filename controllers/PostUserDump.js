const User = require("../models/user");
const Credentials = require("../models/credential");
const bcrypt = require("bcrypt")
var generator = require('generate-password');
const mailer = require("../components/mailer");
const saltRounds = 10;

class PostUserDumpController {
    static async Execute(req, res) {

        const {
            valuesArray,
        } = req.body;

        if (!valuesArray || valuesArray.length == 0) {
            res.status(400).json({
                message: `Invalid Request`,
            });
        } else {

            valuesArray.forEach(async item => {

                if (item.length == 8) {

                    await User.find({ email: item[3] }).then(async result => {

                        if (result.length == 0 &&
                            item[1] != '' &&
                            item[2] != '' &&
                            item[3] != '' &&
                            item[4] != '' &&
                            item[5] != '' &&
                            item[6] != '') {

                            await User.create(
                                {
                                    firstName: item[1],
                                    lastName: item[2],
                                    email: item[3].toLowerCase().trim(),
                                    mobile: item[4],
                                    isVerified: false,
                                    dialCode: item[5],
                                    role: 'user',
                                    department: item[6],
                                    designation: item[7]
                                }).then(results => {
                                    var password = generator.generate({
                                        length: 10,
                                        numbers: true
                                    });

                                    bcrypt.hash(password, saltRounds).then(async function (hash) {

                                        Credentials.create(
                                            {
                                                user: results._id,
                                                email: results.email.trim(),
                                                password: hash,
                                                role: 'user',
                                                OTP: password,
                                            }
                                        ).then(async () => {

                                            const mailOptions = {
                                                from: 'info@artisan10x.com',
                                                to: results.email,
                                                subject: "Welcome to Sheikhani Group Communication!",
                                                html: `
                                                <!DOCTYPE html>
                                                <html lang="en">
                                                    <head>
                                                        <meta charset="UTF-8">
                                                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                        <link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'>
                                                        <style>
                                                            html * {
                                                                font-family: 'Roboto' !important;
                                                            }
                                                            /* table,
                                                                                                    th {
                                                                                                        border: 1px solid black;
                                                                                                    }
                                                
                                                                                                    td {
                                                                                                        border-bottom: 1px solid black;
                                                                                                        padding: 10px
                                                                                                    } */
                                                            #details {
                                                                font-family: Arial, Helvetica, sans-serif;
                                                                border-collapse: collapse;
                                                                width: 100%;
                                                            }
                                                
                                                            #details td,
                                                            #details th {
                                                                border: 1px solid #ddd;
                                                                padding: 8px;
                                                            }
                                                
                                                            #details tr:nth-child(even) {
                                                                background-color: #f2f2f2;
                                                            }
                                                
                                                            #details tr:hover {
                                                                background-color: #ddd;
                                                            }
                                                
                                                            #details th {
                                                                padding-top: 12px;
                                                                padding-bottom: 12px;
                                                                text-align: left;
                                                                background-color: #04AA6D;
                                                                color: white;
                                                            }
                                                
                                                            h3 {
                                                                font-weight: 400;
                                                            }
                                                            .btn:hover {
                                                                transform: scale(1.05);
                                                            }
                                                        </style>
                                                    </head>
                                                    <body>
                                                
                                                        <div style="max-width : 600px; margin:auto">
                                                            <div>
                                                                <img src="https://sheikhanigroup.com/wp-content/uploads/2023/02/retina-business4-1.png" alt="Sheikhani Group LOGO" width="100%"/>
                                                            </div>
                                                
                                                            <h3>Hello ${item[1]},</h3>
                                                
                                                
                                                            <p>Welcome aboard! We're thrilled to have you join our dynamic team and become a part of our company's vibrant community. As we embrace effective communication and collaboration, we're excited to introduce you to our internal chat app.</p>
                                                            <p>To get started, please set your password by clicking on the link below:</p>
                                                            <a href="http://test-sheikhani.it-ace.com/setPassword/${encodeURIComponent(hash)}">
                                                                <button class="btn" style="background-color: #fec148; color : #000; font-weight: 500; font-size: 20px; padding : 10px 25px; border : unset; border-radius: 10px;" type="button">Verify Now</button>
                                                            </a>
                                                
                                                            <p>Once your password is set, you can log in to the chat app using your credentials. Our internal chat app is designed to streamline communication, foster teamwork, and enhance overall collaboration within the company.</p>
                                                            <p>Feel free to explore the app, join relevant channels, and connect with your colleagues. Whether you have questions, ideas, or just want to say hello, the chat app is the place to be.</p>
                                                            <p>If you encounter any issues or have questions during the onboarding process, don't hesitate to reach out to our support team at ahmed@sheikhanigroup.com</p>
                                                            <p>We're looking forward to seeing you in the app and working together to achieve great things!</p>
                                                            <p>
                                                                Best regards,<br>
                                                                <strong>
                                                                    Sheikhani Group Inc
                                                                </strong>
                                                            </p>
                                                
                                                
                                                            <div style="text-align: center; margin-top:50px ;">
                                                                <img width="350px" src="https://sheikhanigroup.com/wp-content/uploads/2023/02/retina-business4-1.png" alt="Sheikhani Group LOGO">
                                                                <p style="font-size: 12px;">7478 Harwin Dr, Houston, Texas 77036, US</p>
                                                            </div>
                                                        </body>
                                                    </body>
                                                </html>
                                            `
                                                ,
                                            };

                                            await mailer.sendMail(mailOptions).then(res => {
                                                console.log(res, "nodemailer")
                                            }).catch(err => {
                                                console.log(err, "nodemailer")
                                            });



                                        }).catch(err => {
                                            console.log(err)
                                        })

                                    })
                                }).catch(err => {
                                    console.log(err)
                                })

                        }

                    })

                } else {
                    res.status(400).json({
                        message: `Invalid Format`,
                    });
                }

            })

            try {
                res.status(200).json({
                    message: `Entry Saved.`,
                });
            } catch (e) {
                console.log(e)
            }

        }
    }

}

module.exports = PostUserDumpController