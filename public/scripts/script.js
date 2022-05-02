const chatify = JSON.parse(localStorage.getItem('chatify'));
const menuBtn = $('.burger');
const recentMessagesContainer = $('.recent-messages');
const searchInput = $('.searchInput');
const searchResultsContainer = $('.search-results-container');
const chatsContainer = $('.chats');
const recentMessagesList = $('.recent-messages-list');
const sendBtn = $('#sendBtn');
const chatInput = $('.chatInput');
const receiverProfile = $('.receiver-profile');
const logoutBtn = $('#logout')
const COLORS = {a: '#F66B0E', b: '#205375', c: '#F66B0E', d: '#205375', e: '#006E7F', f: '#446A46', g: '#B22727', h: '#DEA057', i: '#A85CF9', j: '#FF6FB5', k: '#001E6C', l: '#8E3200', m: '#F55353',n: '#FD5D5D', o: '#4D96FF', p: '#E15FED', q: '#180A0A', r: '#890F0D', s: '#533E85', t: '#488FB1', u: '#5902EC', v: '#1C0A00', w: '#085E7D', x: '#203239',y: '#65C18C', z: '#EF6D6D',}

let recentMessagesShow = false;
menuBtn.on('click', () =>{
    if(!recentMessagesShow){
        recentMessagesContainer.css({'left': '0'})
        recentMessagesShow = true
    }else{
        recentMessagesContainer.css({'left': '-75%'})
        recentMessagesShow = false;
    }
    
})

logoutBtn.on('click', (e) =>{
    e.preventDefault();
    localStorage.removeItem('chatify')
    document.cookie = 'chatifyToken='
    window.location.href = '/login'
})

const currentChat = {};
const resultItemHandler = async () =>{
    const response = await axios.post('/message/getmessages',{
        userId: chatify.userId,
        sender: chatify.userId,
        receiver: currentChat.room
    },{
        headers: {
            authorization: 'Bearer ' + chatify.token
        }
    })
    chatsContainer.html("")
    response.data.map((chat) =>{
        chatsContainer.append(`
            <span class=${chat.sender === chatify.userId ? "message-sent": "message-receive" }>${chat.message}</span>
        `)
    })
    chatsContainer.animate({scrollTop: chatsContainer[0].scrollHeight})
    receiverProfile.html(`
        <div style="background-color: ${COLORS[currentChat.fullName[0]]};" class="profile-photo">
            <p>${currentChat.fullName[0]}</p>
        </div>
        <p class="profile-name">${currentChat.fullName}</p>
        
    `)
}
searchInput.on('keyup', async (e) =>{
    if(e.target.value.trim() === ""){
        searchResultsContainer.html('')
        return
    }
   const response = await axios.post('/user/search',{
       userId: chatify.userId,
       fullName: e.target.value
   },{
       headers:{
           authorization: 'Bearer ' + chatify.token
       }
   })
   searchResultsContainer.html('')
   const results = response.data.map((person) =>{
        searchResultsContainer.append(`
            <div id=${person.room} class="results-item" style='position: relative'>
                <span class='search-result-selector' style='position: absolute; width: 100%; height: 100%; background-color: transparent; top: 0; left: 0'></span>
                <div style="background-color: ${COLORS[person.fullName[0]]};" class="img-container">
                    <p  style='text-transform: capitalize'>${person.fullName[0]}</p>
                </div>
                <p class='person-fullName' style='text-transform: capitalize' class="result-name">${person.fullName}</p>
            </div>
        `)
   })
//    $('.results-item').on('click', (e) =>{
//         currentChat.room = $(e.target).parent().attr('id');
//         currentChat.fullName = $(e.target).parent().children('.person-fullName').text();
//         resultItemHandler();
        
//     })
   
})
const displayRecentMessages = async () =>{
    const response = await axios.post('recent-message', {
        userId: chatify.userId,
    })
    const recents = response.data;
    recentMessagesList.html('')
    recents.map((data) =>{
        recentMessagesList.append(`
            <div id="${data.personId}" class="recent-message-item" style='position: relative'>
                <span  class='recent-messages-selector' style='position: absolute; width: 100%; height: 100%; background-color: transparent; top: 0; left: 0'></span>
                <div style="background-color: ${COLORS[data.personFullName[0]]};" class="recent-item-img-container">
                    <p  style='text-transform: capitalize'>${data.personFullName[0]}</p>
                </div>
                <div class="recent-item-txt">
                    <p class='person-fullName' style='text-transform: capitalize'>${data.personFullName}</p>
                    <p class=${data.opened ? 'chat-opened' : 'chat-unopened'}>${data.lastMessage}</p>
                </div>
            </div>
        `)
    })
    // $('.recent-message-item').on('click', (e) =>{
    //     currentChat.room = $(e.target).parent().attr('id');
    //     currentChat.fullName = $(e.target).parent().children('.recent-item-txt').children('.person-fullName').text();
    //     resultItemHandler();
    // })
}
const addToRecentMessages = async (userId, personId, personFullName, senderFullName, opened, lastMessage) =>{
    const recentMessages = await axios.post('recent-message', {
        userId: chatify.userId,
    })
    const recents = recentMessages.data;
    const existing = recents.find((person) =>{
        return person.personId === personId
    })
    
    if(existing !== undefined){
        const response = await axios.patch('/update-last-message',{
            userId,
            personId,
            opened,
            lastMessage
        })
        displayRecentMessages();
        return
    }
    const response = await axios.post('/add-recent-message', {
        userId,
        personId,
        personFullName,
        senderFullName,
        opened,
        lastMessage,
    })
    recentMessagesList.append(`
            <div id="${personId}" class="recent-message-item" style='position: relative'>
                <span class='recent-messages-selector' style='position: absolute; width: 100%; height: 100%; background-color: transparent; top: 0; left: 0'></span>
                <div style="background-color: ${COLORS[personFullName[0]]};" class="recent-item-img-container">
                    <p style='text-transform: capitalize'>${personFullName[0]}</p>
                </div>
                <div class="recent-item-txt">
                    <p class='person-fullName' style='text-transform: capitalize'>${personFullName}</p>
                    <p class=${opened ? 'chat-opened' : 'chat-unopened'}>${lastMessage}</p>
                </div>
            </div>
        `)
}

const socket = io();
socket.emit('initialRoom', chatify.userId);
const sendMessage = async (message, from, to, sender) =>{
    chatsContainer.append(`
            <span class="message-sent"}>${message}</span>
        `)
        chatsContainer.animate({scrollTop: chatsContainer[0].scrollHeight})
    const response = await axios.post('message/addmessage',{
        userId: chatify.userId,
        message,
        sender: from,
        receiver: to,
        sender,
    },{
        headers: {
            authorization: "Bearer " + chatify.token
        }
    })
    addToRecentMessages(from, to, currentChat.fullName, chatify.fullName, true, message)
}
sendBtn.on('click', (e) =>{
    e.preventDefault();
    if(chatInput.val().trim() === ""){
        return
    }
    if(currentChat.room && currentChat.fullName){
        socket.emit('send', {
            userId: chatify.userId,
            room: currentChat.room,
            fullName: chatify.fullName,
            message: chatInput.val(),
        })
        sendMessage(chatInput.val(), chatify.userId, currentChat.room, chatify.userId)
        chatInput.val("")
    }
})
socket.on('receive', async (data) =>{
    if(data.userId === currentChat.room){
        chatsContainer.append(`
            <span class="message-receive"}>${data.message}</span>
        `)
    }
    
    chatsContainer.animate({scrollTop: chatsContainer[0].scrollHeight})
    recentMessagesList.children(`#${data.userId}`).remove();
    recentMessagesList.prepend(`
        <div id="${data.userId}" class="recent-message-item" style='position: relative'>
            <span class='recent-messages-selector' style='position: absolute; width: 100%; height: 100%; background-color: transparent; top: 0; left: 0'></span>
            <div style="background-color: ${COLORS[data.fullName[0]]};" class="recent-item-img-container">
                <p style='text-transform: capitalize'>${data.fullName[0]}</p>
            </div>
            <div class="recent-item-txt">
                <p class='person-fullName' style='text-transform: capitalize'>${data.fullName}</p>
                <p class=${'chat-unopened'}>${data.message}</p>
            </div>
        </div>
    `)
})

displayRecentMessages();
$(document).on('click', '.recent-messages-selector', (e) =>{
        currentChat.room = $(e.target).parent().attr('id');
        currentChat.fullName = $(e.target).parent().children('.recent-item-txt').children('.person-fullName').text();
        resultItemHandler();
})
$(document).on('click', '.search-result-selector', (e) =>{
        currentChat.room = $(e.target).parent().attr('id');
        currentChat.fullName = $(e.target).parent().children('.person-fullName').text();
        resultItemHandler();
})
