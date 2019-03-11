# cps630-test-server

Have a channel for each lobby

Adding to channel
- Player send messages to chanel
- Function that gives channel wordbank object ( $scope.processwordbank=function(param){ process wordbank ...} )
- Players all type onto channel
- Player sends message to channel with word they typed. JS checks if its matches with word bank then
- Add to channels as player join. If 6 people join one channel, create new one and add users to that one now, and close old channel.
- FOR NOW create function that calculates points of words and gives it to user.
- 


TESTING
- Have <li> list and remove words from html when user types it.




MESSAGES 
- Player messages channel with word 
- Callback(function) have callback match any word in wordbank if it dosn't return false, else return true
- Listener listens to callback and infroms user if word is correct. listener will recieve true or false values.
-
