const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const {
    body,
    validationResult,
    check
} = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

const app = express();
const port = 3000;

//setup method override
app.use(methodOverride('_method'));

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
        cookie: {
            maxAge: 6000
        },
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
app.get('/contact', async (req, res) => {
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

//Halaman form tambah data contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
    });
});

//Proses tambah data contact
app.post('/contact', [
    body('nama').custom(async (value) => {
        const duplikat = await Contact.findOne({
            nama: value
        });
        if (duplikat) {
            throw new Error('Nama sudah digunakan!!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'Nomer Handphone tidak valid!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(404).json({errors: errors.array()});
        res.render('add-contact', {
            title: 'Form tambah data contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        })
    } else {
        Contact.insertMany(req.body, (error, result) => {
            //kirim flash messsage
            req.flash('msg', 'Data contact berhasil ditambahkan');
            res.redirect('/contact');
        })
    }
})

//proses delete contact
// app.get('/contact/delete/:nama', async (req, res)=>{
//     const contact =await Contact.findOne({nama : req.params.nama});

//     //jika contact tidak ada
//     if(!contact){
//         res.status(404);
//         res.send('<h1>404</h1>')
//     }else{
//         Contact.deleteMany({_id : contact._id}).then((result)=>{
//             req.flash('msg', 'Data contact berhasil ditambahkan');
//             res.redirect('/contact');
//         });
//     }
// });
app.delete('/contact', (req, res) => {
    Contact.deleteOne({nama: req.body.nama}).then((result)=>{
        req.flash('msg', 'Data contact berhasil ditambahkan');
        res.redirect('/contact');
    });
});

//halaman form edit data contact
app.get('/contact/edit/:nama',async (req, res) => {
    const contact = await Contact.findOne({nama : req.params.nama})

    res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        contact,
    });
});

//proses ubah data
app.put('/contact', [
    body('nama').custom(async (value, {req})=>{
        const duplikat =await Contact.findOne({nama : value});
        if(value !== req.body.oldName && duplikat){
            throw new Error('Nama sudah digunakan!!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'Nomer Handphone tidak valid!').isMobilePhone('id-ID') 
], (req, res)=>{
    const errors = validationResult (req);
    if (!errors.isEmpty()){
        res.render('edit-contact', {
            title: 'Form ubah data contact',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contacts: req.body,
        })
    }else{
        Contact.updateOne({_id: req.body._id},
            {
                $set: {
                    nama: req.body.nama,
                    email: req.body.email,
                    nohp: req.body.nohp,
                },
            }
        ).then((result)=>{

            //kirim flash messsage
            req.flash('msg', 'Data contact berhasil diubah');
            res.redirect('/contact');
        });
    }
})

//Halaman detail contact
app.get('/contact/:nama', async (req, res) => {
    //     const contact = findContact(req.params.nama);
    const contact = await Contact.findOne({
        nama: req.params.nama
    });

    res.render('detail', {
        title: 'Halaman Detail Contact',
        layout: 'layouts/main-layout',
        contact,
    });
});

app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at https://localhost:${port}`);
});