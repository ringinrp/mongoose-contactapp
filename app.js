const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

//Setup EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

//Konfigurasi flash
app.use(cookieParser('secret'));
app.use( 
    session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    saveUninitialized: true,
})
);
app.use(flash());

//Halaman Home
app.get("/", (req, res) => {
    const mahasiswa = [{
            nama: 'Bejo',
            email: 'bejo@gmail.com'
        },
        {
            nama: 'Mawar',
            email: 'Mawar@gmail.com'
        },
    ];
    res.render('index', {
        layout: 'layouts/main-layout',
        nama: 'Ringin',
        mahasiswa,
        title: 'Halaman Home',
    });
    console.log('ini halaman home');
});

//Halaman about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Halaman About',
        layout: 'layouts/main-layout',
    })
})

//Halaman contact
app.get('/contact', async (req,res)=>{
    // const contacts = Contact.find().then((contact)=>{
    //     res.send(contact);
    // });

    const contacts = await Contact.find();

    res.render('contact', {
        title: 'Halaman Contact',
        layout: 'layouts/main-layout',
        contacts,
        msg: req.flash('msg'),
    });
})

app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at https://localhost:${port}`);
});