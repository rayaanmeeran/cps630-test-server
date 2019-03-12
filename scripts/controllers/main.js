// VARIABLE FOR EACH PERSON
var val1;
var val2;


angular.module('app', ["pubnub.angular.service"])
    .controller('ChatCtrl', function($scope, Pubnub) {
        $scope.channel = 'messages-channel';
        $scope.numofPlayers = 0;
        // Generating a random uuid between 1 and 100 using an utility function from the lodash library.         
        $scope.uuid = "1";
        $scope.points = 0;
        Pubnub.init({
            publish_key: 'pub-c-dcae03d5-0a42-429b-996d-f1d7e02b4036',
            subscribe_key: 'sub-c-9282f932-4516-11e9-82b8-5ab7e7fd9be2',
            uuid: $scope.uuid,
            //  value: $scope.value
        });

        $scope.setUUID = function() {
            //Dont set to null/empty
            if (!$scope.userID || $scope.userID === '') {
                return;
            }
            $scope.uuid = $scope.userID;
            console.log("setUUID: $scope.uuid = " + $scope.uuid);
        }



        // Send the messages over PubNub Network
        $scope.sendMessage = function() {
            // Don't send an empty message 
            if (!$scope.messageContent || $scope.messageContent === '') {
                return;
            }

            Pubnub.publish({
                channel: $scope.channel,
                message: {
                    content: $scope.messageContent,
                    sender_uuid: $scope.uuid,
                    date: new Date()
                        //points=$scope.points
                },
                callback: function(m) { 
                    console.log(m); // callback object function fires when we finish sending a message(m) to the channel
                }
            });


            // Reset the messageContent input
            $scope.messageContent = '';
        }

        $scope.messages = [];
        $scope.words = ["hello", "bye", "tonight", "math", "math"];

        $scope.findword = function(string) {
            for (let i = 0; i < $scope.words.length; i++) {
                if (string === $scope.words[i]) {
                    $scope.words.splice($scope.words.indexOf(string), 1);
                    return true;
                }
            }

            return false;
        }




        

        // Subscribing to the ‘messages-channel’ and trigering the message callback
        Pubnub.subscribe({
            channel: $scope.channel,
            triggerEvents: ['callback'],
            withPresence: true
        });


  //  Pubnub.hereNow();


        // Listening to the callbacks THIS IS WHERE THE SYNCING HAPPENS
        $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function(ngEvent, m) {
            $scope.$apply(function() {

                $scope.messages.push(m); // push message m onto messages array
                // M IS OBJECT OF SENT OBJECT {content:.., uuid:..)}
                if ($scope.findword(m.content)) {

                }

                 console.log("$on: m.sender_uuid = " + m.sender_uuid);
                //console.log(m.uuid);
                // console.log($scope.messages);
                console.log($scope.numofPlayers);
                // console.log($scope.messages);
            });
        });


    });