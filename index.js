// const { urlencoded } = require("express")
const express = require("express")
// const {port, url} = require("./config")
// const userRouter = require("./router/user-route")
const db = require("./db")
const firestore = db.database.firestore()
const collection = "userdb"

const app = express()
app.use(express.urlencoded({ extended: false }))

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("login")
})

app.post("/", async (req, res)=>{
    const data = {
        username: req.body.username,
        password: req.body.password
    }
    let checkUser = await firestore.collection(collection).where(
        "username",
        "==",
        data.username
    ).get()
    if(checkUser.empty){
        return res.render("error",{
            message: "User not found",
            link: "<a href='/'>go back to login</a>"
        })
    }
    let usr= {}
    checkUser.forEach(doc =>{
        const x = {
            username: doc.data().username,
            password: doc.data().password
        }
        user = x
    })
    if(data.password != user.password){
        return res.render("error", {
            message: "password is not correct",
            link: "<a href ='/'>go back to login</a>"
        })
    }
    return res.render("welcome",{
        username: data.username
    })
})
app.get("/register", (req, res) => {
    res.render("register")
})

app.use(express.json())

// app.use(urlencoded({ extended: false}))

// app.get("/", (req, res) => {
//     res.render("login",{
//         message: ""
//     })
// })

// app.post("/" ,async(req, res) =>{
//     const userdb = firestore.collection("userdb")
//     const query = await userdb.where("username", "==", req.body.username).get()
//     if (query.empty){
//         return res.render("login",{
//             message: `<p>${req.body.username} dose not wakanda </p>`
//         })
//     }
// })

app.post("/register", async (req, res) => {
    let checkUser = await firestore.collection("collection").where(
        "username",
        "==",
        req.body.username
    ).get()
    if (!checkUser.empty) {
        return res.render("error", {
            message: "user already exist",
            link: "<a href='/register'>go to back register</a>"
        })

    }
    const data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }
    await firestore.collection(collection).doc().set(data)
    return res.render("success", {
        message: "register success",
        link: "<a href= '/'>go to login</a>"
    })
})

app.listen(8800, () => console.log(`running at http://localhost:8800`))