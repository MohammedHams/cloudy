const expreess = require('express');
const path = require('path');
const app = expreess();
const session = require("express-session");
const sessionStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash');

const authRouter = require('./routes/authRoute');


app.use(expreess.static(path.join(__dirname,'assets')));
app.use(expreess.static(path.join(__dirname,'images')));
app.use(flash());

const STORE = new sessionStore({
    uri: 'mongodb://localhost:27017/online-shop',
    collection: 'sessions'
});
app.use(session({
    secret: "123456789abcdefjhijkmlnopqrstuwxyz",
    saveUninitialized: false,
    store: STORE
}));

app.set('view engine' , 'ejs');
app.set('views' , 'views');

app.use('/', authRouter);
app.use('/', authRouter);




app.listen(3000 , () => {
    console.log('Server Is Listen on port 3000')
});
