angular.module('app', ["pubnub.angular.service"])
    .controller('ChatCtrl', function($scope, Pubnub) {
        $scope.channel = 'messages-channel';
        // Generating a random uuid between 1 and 100 using an utility function from the lodash library.         
        $scope.uuid = _.random(100).toString();
        Pubnub.init({
            publish_key: 'pub-c-1f91d296-28dd-4d8e-9e54-9ac3393a9772',
            subscribe_key: 'sub-c-de35a980-441a-11e9-bd6d-163ac0efd868',
            uuid: 'MyUUID'
        });

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
                },
                callback: function(m) {
                    console.log(m); // callback object function fires when we finish sending a message(m) to the channel
                }
            });
            // Reset the messageContent input
            $scope.messageContent = '';

        }
    });