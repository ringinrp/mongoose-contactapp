const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));

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
app.get('/contact', (req,res)=>{
    const contacts = ;

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