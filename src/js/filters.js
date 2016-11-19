// Filter for messages sent during the day
morningFilter = function(data) {
    return data.time.am;
}

senderFilter = function (data, sender) {
    return data.sender === sender;
}