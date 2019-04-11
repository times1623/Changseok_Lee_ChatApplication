import ChatMessage from './modules/ChatMessage.js';

const socket = io();

function logConnect({sID, currentusers}) { //{sID, message}
    console.log(sID, currentusers);
    vm.socketID = sID;
    vm.currentusers = currentusers;
}

function announcement({notifications}){
    vm.notifications.push(notifications);
}

function userDisconnect({disconnection}){
    vm.disconnections.push(disconnection);
}

function appendMessage(message) {
    vm.messages.push(message);
}

// create Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        nickname: "",
        message: "",
        notification: "",
        notifications: [],
        disconnection: "", 
        disconnections: [],
        userconnect: "",
        messages: []

    },

    created() {
        socket.on('userconnect', (currentusers) => {
            vm.userconnect = currentusers;
        });
    },

    methods: {
        dispatchMessage() {
            // emit message event from the client side
            socket.emit('chat message', { content: this.message, name: this.nickname || "Anonymous"});

            // reset the message field
            this.message = "";

        }
    },
    components: {
        newmessage: ChatMessage
    }
}).$mount(`#app`);

socket.on('connected', logConnect);
socket.on('joined', announcement);
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', userDisconnect); // this one is optional