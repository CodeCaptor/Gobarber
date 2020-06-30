export default {
host: process.env.MAIL_HOST,
port: process.env.MAIL_PORT,
secure: false,
debug: true, // show debug output
logger: true, // log information in console
auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
},
default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>'
}
};
