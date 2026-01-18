import {Schema,model} from "mongoose";

const userSchema = new Schema({
    firstName :{
        type:String,
        required:true
    },
    lastName :{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        unique:true,
        required:true
    }

}) 
const contentSchema = new Schema({
    link:String,
    type:String ,
    title:String,
    tags:[String],
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
    
})


const tagsSchema = new Schema({
    title:String
})

const linkSchema = new Schema({
    hash:String,
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",

    }
})


    
export const User = model('user',userSchema)
export const Content = model('content',contentSchema)
export const Tags = model('tags',tagsSchema)
export const Link = model('link',linkSchema)

