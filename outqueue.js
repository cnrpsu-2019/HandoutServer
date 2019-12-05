const EventEmitter = require("events")
const pusherEventLoop = new EventEmitter()

const zmq = require("zeromq")
var zmqPushSock = new zmq.Push()

//Mockup data the real data will provide by frost
let mockdata = {
  StudentID: "5910110150",
  SubjectSuccessEnroll: ["240-460", "240-461"]
}

pusherEventLoop.on("push", (student, subject) => {
  let dataObj = {
    StudentID: student,
    SubjectSuccessEnroll: subject
  }

  zmqPushSock.send(JSON.stringify(dataObj)).then(() => {
    console.log("Successful Push in to outQueue/ Processed Queue")
  })
})

zmqPushSock.bind("tcp://127.0.0.1:3090").then(() => {
  pusherEventLoop.emit("push", mockdata)
})
