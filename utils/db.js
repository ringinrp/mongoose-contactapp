const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/kampus', {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true,
});



// Menambah 1 data
// const contact1 = new Contact({
//     nama: 'Cacang',
//     nohp:'082298225333',
//     email:'cacang@gmail.com',
// });

// //Simpan ke collection
// contact1.save().then((contact)=>console.log(contact));