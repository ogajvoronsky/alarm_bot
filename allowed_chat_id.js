// check is it allowed chat to recieve commands from

allowed_chat_ids = [-319395610, 303847037];

Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

module.exports = function(chat_id){
    console.log(typeof(chat_id))
    return allowed_chat_ids.contains(chat_id)
} 