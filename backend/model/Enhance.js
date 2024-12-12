const mongoose = require("mongoose"); 


const enhanceSchmea = new mongoose.Schema({
	userId:{type:mongoose.Schema.Types.ObjectId, ref:"User" , required: true }, 
	prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt'  , required: true }],
	prompt:{type:String , required:true}, 
	

}, 
{ timestamps: true}


)

const Enhance = mongoose.model("Enhance" , enhanceSchmea); 

module.exports = Enhance ; 