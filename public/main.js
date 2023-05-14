const socket=io("http://localhost:4000")
socket.on('connection')

const clienttotal=document.getElementById('client-total')
const messagecontainer=document.getElementById('message-container')
const nameinput=document.getElementById('name')
const messageform=document.getElementById('message-form')
const messageinput=document.getElementById('message-input')

const messageTone=new Audio('/ring.mp3')

messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total',(data)=>{
    clienttotal.innerText=`Total client:${data}`
})

function sendMessage(){
    if(messageinput.value==='') return
    console.log(messageinput.value)
    const data={
        name:nameinput.value,
        message:messageinput.value,
        dateTime:new Date()
    }
    socket.emit('message',data)
    addmessagetoui(true,data)
    messageinput.value=''
}

socket.on('chat-message',(data)=>{
   // console.log(data)
    messageTone.play()
    addmessagetoui(false,data)
})

function addmessagetoui(isOwnMessage,data){
    clearfeedback()
    const element=` 
    <li class="${isOwnMessage ? "message-right":"message-left"}">
      <p class="message">
        ${data.message}
        <span> ${data.name} • ${moment(data.dateTime).fromNow()}</span>
      </p>
     </li>
   `

   messagecontainer.innerHTML+=element
   scrolltobottom()
}

function scrolltobottom(){
    messagecontainer.scrollTo(0,messagecontainer.scrollHeight)
}

messageinput.addEventListener('focus',(e)=>{
    socket.emit('feedback',{
        feedback:`✍ ${nameinput.value} is typing a message`
    })
})
messageinput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`✍ ${nameinput.value} is typing a message`
    })
})
messageinput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:''
    })
})

socket.on('feedback',(data)=>{
    clearfeedback()
    const element=`
    <li class="message-feedback">
        <p class="feedback" id="feedback">${data.feedback}</p>
    </li>`

    messagecontainer.innerHTML+=element
})

function clearfeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element=>{
        element.parentNode.removeChild(element)
    })
}