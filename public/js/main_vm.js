import ChatMessage from './modules/ChatMessage.js';

const socket = io();

function logConnect({sID, message, notifications}) { //{sID, message}
    console.log(sID, message, notifications);
    vm.socketID = sID;
    vm.notifications.push(notifications);
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
        messages: []

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
socket.addEventListener('chat message', appendMessage);
socket.addEventListener('disconnect', appendMessage); // this one is optional