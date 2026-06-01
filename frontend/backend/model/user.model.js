const mangoose = require('mongoose')

const userSchema  = new mangoose.Schema({
    name : {
        type:String,
        require:true,
    },

    email:{
        type:String,
        require:true,
        unique:true
    },

    password:{
        type:String,
        require:true  
      }
    



},{timestamps:true})


const User = mangoose.model('user',userSchema)

module.exports = User