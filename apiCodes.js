const express = require("express");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const app = express();

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");

// Register API

app.post("/register", async (request, response) => {
  const { firstName, lastName, email, password, confirmPassword } =
    request.body;
    const hashedPassword = await bcrypt.hash(password,10)
  client
    .db("Blogsdata")
    .collection("users")
    .findOne({ email: email })
    .then((res) => {
      if (res === null) {
        client
          .db("Blogsdata")
          .collection("users")
          .insertOne({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            confirmPassword: confirmPassword,
          })
          .then((res) => {
            console.log(res);
            response.send("User created successfully");
          });
      } else {
        response.json({ error_msg: "email already exists" });
      }
    });
});

// Login API

app.post('/login', async (request,response)=>{
    const {email,password}=request.body;
    let dbUser = client.db('Blogs').collection('users').findOne({email:email});
        dbUser
        .then((res)=>{
            if(res === undefined){
                response.json({ error_msg: "email_id is incorrect" });
            }else{

                const isPasswordMatch = await bcrypt.compare(password,dbUser.password);

                if (isPasswordMatch === true){

                    const payLoad = {
                        email: email,
                      };
                
                      const jwtToken = jwt.sign(payLoad, "MY_SECRET_TOKEN");
                      response.send(jwtToken);

                }else{
                    response.status(400);
                    response.json({ message: "Invalid Password" });
                }



            }
        })




    
})



module.exports = app;
