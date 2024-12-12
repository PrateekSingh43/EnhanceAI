const mongoose = require("mongoose") ;  


const promptSchmea = new mongoose.Schema({
	userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
	prompt:{type:String , required:true}, 
	
	
} , 
{ timestamps: true}


)

const Prompt = mongoose.model("Prompt" , promptSchmea); 

module.exports = Prompt ; 