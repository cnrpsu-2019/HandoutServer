const app = require("express")()
const port = 3030
const zmq = require("zeromq")
var io = require("socket.io")(3060)
var zmqPullSock = new zmq.Pull()
async function pulling() {
  zmqPullSock.connect("tcp://127.0.0.1:3090")
  console.log("Worker is ready")

  while (true) {
    try {
      const [mgs] = await zmqPullSock.receive()
      let mgsInString = mgs.toString()
      console.log(mgsInString)
      let mgsInObject = JSON.parse(mgsInString)
      console.log(mgsInObject)
      //Handling Out To Socket.io
      if (mgsInObject != null) {
        io.on("Enroll", mgsInObject)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

pulling()
app.get("", (req, res) => {
  res.send("You are On Front page of Handling Out Server")
})
// //Open Port for Socket.io
io.on("Enroll", (socket, messageObject) => {
  console.log("Socket IO is Ready")
  console.log(messageObject)
  socket.emit(messageObject.StudentID, data => {
    console.log("Data has send to" + messageObject.StudentID)
    console.log(data)
  })
})
