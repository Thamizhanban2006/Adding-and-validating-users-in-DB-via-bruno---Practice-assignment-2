const express = require('express');
const { resolve } = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 3010;
const bcrypt = require('bcrypt');

require('dotenv').config();
app.use(express.json());
const uri = process.env.uri;


const signin= new mongoose.Schema({

email:{
    type:String,
    required:true,
    unique:true
},
password:{
    type:String,
    required:true
}
})

const userScehma = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }

});

const User = mongoose.model('User',userScehma);

const Signin = mongoose.model('Signin',signin);

mongoose.connect(uri)
.then(()=>console.log('Database connected successfully!'))
.catch((err)=>console.log(err));

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.post('/users',async(req,res)=>{
  try{
    const {email,password} = req.body;

    if(!email || !password){
      return res.status(404).json({
        message:"Data missing"
      })
    };
    const dataexist = await User.findOne({ email });
    if(!dataexist){
      return res.json({message:"User didn't exist!"});
    };

    const isMatch = await bcrypt.compare(password,dataexist.password);
    if(!isMatch){
      return res.status(401).json({message:"Invalid email or password!"})

    }
    const newData = await Signin.create({email,password});
    res.status(201).json({message:"Login successful!"});

  }
  catch(err){
    return res.status(500).json({err:err.message});
  }
});

app.get('/users', async (req, res) => {
  try {
    const data = await Signin.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
