const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())   

mongoose.connect()

app.post("/add",(req,res)=>{
    const task = req.body.task
    const newTask = new Task({
        task:task
    })
    newTask.save()
    res.json(newTask)
})

app.listen(3001,()=>{
    console.log("Server running ...")
})