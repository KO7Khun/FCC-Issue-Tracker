const mongoose = require('mongoose')

const {Schema} = mongoose

const issueSchema = new Schema({
  assigned_to: {
    type : String,
    default : ""
  },
  status_text: {
    type : String,
    default : ""
  },
  open : Boolean,
  issue_title: {
    type : String,
    default : ""
  },
  issue_text: {
    type : String,
    default : ""
  },
  created_by: {
    type : String,
    default : ""
  },
  created_on : {
    type : String
  },
  updated_on : {
    type : String
  }
},{ versionKey: false })

const issueModel = (projectName) => {
  return mongoose.model(projectName, issueSchema)
}

module.exports = issueModel