const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/login',(req,res)=>{
    res.send('this is login p0age')
})
app.get('/logout',(req,res)=>{
    res.send('thsis is logout page')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})