import "dotenv/config";
import express, { response } from "express";
import nunjucks from "nunjucks";
import sassMiddleware from "node-sass-middleware";
import {getAllBooks, addBook, deleteBook} from "./database";
import {getAllMembers, addMember, deleteMember} from "./database";
import { request } from "http";
import { addNewUser } from "./passwords";
import Passport from "passport";
import passportLocal from "passport-local";
import expresssession from "express-session";
import cookieParser from "cookie-parser";

//"./database";

const app = express();
const port = process.env['PORT'] || 3000;
app.use(express.urlencoded({ extended: true}));

const srcPath = __dirname + "/../stylesheets";
const destPath = __dirname + "/../public";
app.use(
    sassMiddleware({
        src: srcPath,
        dest: destPath,
        debug: true,
        outputStyle: 'compressed',
        prefix: '',
    }),
    //no src
    express.static('public')
);

app.use(cookieparser());
app.use(expresssession({
    secret: "secret"
}));

passport.serializedUser(function(user, done){
    done(null, user);
});

passportLocal.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(passport.initialize());

const LocalStrategy = passportlocal.Strategy;
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
    async (email, password, done) => {
        const member = await tryLoginMember(email, password);
       if (member === false) {
            return done(null, false, { message: "email or password is incorrect"})
        }
        else {
           return done(null, member);
        }
    }
))

const PATH_TO_TEMPLATES = "./templates/";
nunjucks.configure(PATH_TO_TEMPLATES, { 
    autoescape: true,
    express: app
});

app.get("/", (req, res) => {
    const model = {
        message: ""
    }
    res.render('index.html', model);
});


app.get("/member", async ( request, response) => {
    const memberList = await getAllMembers();
    const Template= {
        members: memberList
    }
    response.render('members.html', Template);
})

// all books 
app.get("/book", async (request, response) => {
    const bookList = await getAllBooks();
    const Model= {
        books: bookList
    }
    response.render('books.html', Model);
})

// get a single book (findBook)
//app.get("/book1", async (request, response) => {
   // const bookList = await findBook(id:any);
 //   const Model= {
      //  books: bookList

   // }
//response.render('findBook.html', Model)

//})


//add new book to book page
app.post("/book/add", async (request, response) => {
    const id  = request.body.id as number;
    const title = request.body.title as string;
    const author = request.body.author as string;
    const model = await addBook(id, title, author);
    response.redirect("/book")
})

// delete book from book page

app.post("/book/delete", async (request, response) => {
    const delete_book = request.body.id
    await deleteBook(delete_book)
    response.redirect("/book")
}),

//add new member to member page
app.post("/member/add", async (request, response) => {
    const id  = request.body.id as number;
    const first_name = request.body.first_name as string;
    const last_name = request.body.last_name as string;
    const email = request.body.email as string;
    const model = await addMember(id, first_name, last_name, email);
    response.redirect("/member")
});

// delete member from member page

app.post("/member/delete", async (request, response) => {
    const delete_member = request.body.id
    await deleteMember(delete_member)
    response.redirect("/member")
});

// register members

app.get("/register", async (request, response) => {
    response.render('register.html')
})

app.post("/register", async (request, response) => {
    const newUser = request.body;
    const sqlResultRegister = await addNewUser(newUser);
    const model = {
        register: sqlResultRegister
    }
    response.render('register.html')
})

app.post("/login", async (request, response) => {
   response.render("/login")
});

app.post("/login",
    passport.authenticate('local', {
       successRedirect: '/',
        failureRedirect: '/login',
    })
);


    

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
});
