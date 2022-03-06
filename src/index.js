const path = require('path');
const express = require('express');
//hien thi request từ cline, khi refest se hien log ở terminal
const morgan = require('morgan');
// chuyen doi post thanh put 
const methodOverride = require('method-override');
const { engine } = require ('express-handlebars');
// import middle ware 
const sortMiddleware = require('./app/middlewares/sortMiddleware')
// gui thong bao loi 
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')


const app = express();
var sessionStore = new session.MemoryStore;
const port = 3000;
//cai dat upload 
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
//  cau hinh thong bao 

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());
app.use(function(req, res, next){
  // if there's a flash message in the session request, make it available in the response, then delete it
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});


//goi route
const route = require('./routes');

//ket noi database
const db = require('./config/db');

//tao duong dan den public
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
//su method chuyen doi post thanh put
app.use(methodOverride('_method'));

//su dung middleware
app.use(sortMiddleware)
// http logger
app.use(morgan('combined'));


//teample engine
app.engine('hbs',engine({
    //doi duoi cho file teamplade  
    extname: '.hbs',
    helpers: require('./helpers/handlebars'),

}))

app.set('view engine','hbs');
app.set('views',[
  path.join(__dirname,'./backend'),
  path.join(__dirname,'./crm'),
  path.join(__dirname,'/fontend','views'),

]);

//chay route init
route(app);


app.listen(port, () => {
  console.log(`App webux listening at http://localhost:${port}`)
})