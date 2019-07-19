'use strict';
console.log('Loading function');

/* Import Libraries */
var mysql = require('mysql');
var uuid  = require('uuid'); 


var APP_NAME  = "Fifo";
var MAX_CHARACTER_LENGTH = 30;
var ALLOW_MORE_THAN_ONE_ACCOUNT = false;


var ErrorMessageGeneric = " Something went wrong. Try again shortly";



let kGuid       = "guid";
let kAcctId     = "acctId";
let kGender     = "gender";
let kUserName   = "userName";
let kFirstName  = "firstName";
let kLastName   = "lastName";
let kFullName   = "fullName";
let kVerified   = "verified";
let kCity       = "city";
let kState      = "state";
let kCountry    = "country";
let kAbout      = "about";
let kDomain     = "domain";
let kUserPhoto  = "userPhoto";


function splitGuid(guid) {
    return guid.split("#");
}

function convertToGuid(userId, acctId) {
    return userId + "#" + acctId;
}

// Helper function used to validate input
function invalidCharacters(username) {
    var regexp = /^[a-zA-Z0-9-_.]+$/;
    if ( regexp.test(username) ) { 
        return false;
    }
    return true;
}
     
function isInvalidUsername(username) {
    if (!username) {
        return "Please enter a username";
    }
    if (username.length > MAX_CHARACTER_LENGTH) {
        return "Username is too long. It can be at most "  + MAX_CHARACTER_LENGTH;  
    }
    
    if ( invalidCharacters(username) ){
        return "Username can only have letters, numbers, and ._-";  
    }        
}


console.log('creating connection');

var connection = mysql.createConnection({
    host     : 'mysqldromotest.cyoa59avdmjr.us-east-1.rds.amazonaws.com',
    user     : 'hannyalybear',
    password : 'SummerIsNearAndYellow1',
    database : 'dromotestmysqldb'
});


//   CONSTANTS
var CLICKS_COUNT  = "C";
var FRIENDS_COUNT = "F";

/* The following are the stored values in database */

var Relationship = {
    Unknown               : 0,
    NoneExist             : 1,
    FollowRequested       : 2,        //S
    IsFollowing           : 3,   
    CanceledFollowRequest : 4
};

// Notifications Type
var NotificationType = {
    SentFollowRequest     : 0,
    ReceivedFollowRequest : 1,
    IsFollowing           : 2,   // You are following JOhn232
    BeingFollowed         : 3   // JOhn232 is following you
};


var BlockedStatus = {
    BlockedUser   : 1, //   - B
    BlockedByUser : 2 //  - Y
};


// ACTIONS - Used in DRFriendAction
var FriendAction = {
    Follow    : 0,
    Unfollow  : 1,
    Accept    : 2
};

var MessageAction = {
	Block     : "B",
	Unblock   : "U"
}

function printError(err) {

    console.log('Error is :', JSON.stringify(err, null, 2));
    console.log('Error is :', JSON.stringify(err.code, null, 2));
    console.log('Error Message :', err.errorMessage);
                                    
    console.error('Error Stack is: ' + err.stack);
    console.error('Error Stack stringify: ' + JSON.stringify(err.stack, null, 2));
    console.log(err);
}



let kDidUpdate      = "didUpdate";
let kErrorMessage   = "errorMessage";
let kFriendStatus   = "friendStatus";
let kSuccess        = "success";
let kActive         = "active";

let kFriends        = "friends";

let kProfile        = "profile";
let kUpdatedValue   = "updatedValue";

let kOtherMessage   = "message";






function friendActionResponse(didUpdate, status) { 
    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kDidUpdate]    = didUpdate;
    response[kFriendStatus] = status;
    return response;
}

function listFriendsResponse( friends ) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kFriends] = friends;
    return response;
}



function activeResponse(activeStatus, errorMessage) {
    var response = {};
    response[kActive]       = activeStatus;
    response[kErrorMessage] = errorMessage;
    return response;
}


function errorResponse( errorMessage) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kErrorMessage] = errorMessage;
    return response;
}

function activeErrorMessage(activeValue) {

    var errorMessage;

    switch (activeValue) {
        case ActiveValues.Unknown:
            errorMessage = "You are not logged in";
            break;
        case ActiveValues.DoesNotExist:
            errorMessage = "This account does not exist";
            break;
        case ActiveValues.Deleted:
            errorMessage = "This account does not exist";
            break;
        case ActiveValues.Disabled:
            errorMessage = "This account has been disbaled"
            break;
        case ActiveValues.DisabledConfirmed:
            errorMessage = "This account has been disbaled"
            break;
        default:
            errorMessage = ErrorMessageGeneric
            break;
    }
    return errorMessage;
}



let kAction         = "action";
let kFriendGuid     = "fguid";
let kNotificationId = "notificationId";


let kProfileUrl = "profileUrl";


let kAlbumId    = "albumId"
let kType       = "type"

let kTimestamp  = "timestamp"
let kDate       = "date"
let kBlocked        = "blocked"


let kSelectedFriends = "selected";
let kAllFriends      = "allFriends";



var ActiveValues = {
    Active            : 0,
    Unknown           : 1,   
    DoesNotExist      : 2,   // Company suspended
    Deleted           : 3,   // User deleted 
    Disabled          : 4,   // User disbaled??
    DisabledConfirmed : 5,   // Company suspended
};


/*
    Shell command:
cd friends; ./compress.sh api-friends Rail-Friends-mobilehub-1247959479; cd ..

./compress.sh api-friends Rail-Friends-mobilehub-1247959479

*/



// errorMessage = "Unable to accept \(self.notificationModel.otherUser.userName)'s friend request. Try again shortly")


exports.handler = (event, context, callback) => {
 
    var responseCode = 200;
    var requestBody, pathParams, queryStringParams, headerParams, stage,
    stageVariables, cognitoIdentityId, httpMethod, sourceIp, userAgent,
    requestId, resourcePath;
    console.log("request: " + JSON.stringify(event));

    // Request Body
    requestBody = JSON.parse(event.body);

    // if (requestBody !== undefined && requestBody !== null) {

    //     // Set 'test-status' field in the request to test sending a specific response status code (e.g., 503)
    //     responseCode = JSON.parse(requestBody)['test-status'];
    //     console.log("responseCode: " + responseCode);
    // }

    // Path Parameters
    pathParams = event.path;
    console.log("pathParams: " + pathParams);

    // Query String Parameters
    queryStringParams = event.queryStringParameters;
    console.log("queryStringParams: " + queryStringParams);

    // Header Parameters
    headerParams = event.headers;
    console.log("headerParams: " + headerParams);

    if (event.requestContext !== null && event.requestContext !== undefined) {

        var requestContext = event.requestContext;
        console.log("requestContext: " + requestContext);

        // API Gateway Stage
        stage = requestContext.stage;
        console.log("API Gateway Stage: " + stage);

        // Unique Request ID
        requestId = requestContext.requestId;
        console.log("Unique Request ID: " + requestId);

        // Resource Path
        resourcePath = requestContext.resourcePath;
        console.log("Resource Path: " + resourcePath);

        var identity = requestContext.identity;
        console.log("identity: " + identity);

        // Amazon Cognito User Identity
        cognitoIdentityId = identity.cognitoIdentityId;
        console.log("Amazon Cognito User Identity: " + cognitoIdentityId);

        // Source IP
        sourceIp = identity.sourceIp;
        console.log("Source IP: " + sourceIp);

        // User-Agent
        userAgent = identity.userAgent;
        console.log("User-Agent: " + userAgent);

    }

    // API Gateway Stage Variables
    stageVariables = event.stageVariables;

    // HTTP Method (e.g., POST, GET, HEAD)
    httpMethod = event.httpMethod;
    console.log("HTTP Method: " + httpMethod);

    // TODO: Put your application logic here...


    function finalAppResponse( responseBody) {
        console.log("responseBody: " + JSON.stringify(responseBody))
        var response = {
            statusCode: responseCode,
            headers: {
                "x-custom-header" : "custom header value"
            },
            body: JSON.stringify(responseBody)
        };
        console.log("response: " + JSON.stringify(response))
        callback( null, response);
    } 



    function printTimeForEvent(event) {
        console.log("Event: " + event + ", Time left: " + context.getRemainingTimeInMillis());
    }
       
    context.callbackWaitsForEmptyEventLoop = false;

    console.log('Received event:', JSON.stringify(event, null, 2));
    


    var userId          = cognitoIdentityId;
    var acctId          = requestBody[kAcctId];
    var action          = requestBody[kAction];
    var friendGuid      = requestBody[kFriendGuid];
    
    var notificationId  = requestBody[kNotificationId];
    // var userName        = "TODO-Addusername"; //event.username.toLowerCase();
    // var friendUserName  = event.FriendUsername.toLowerCase();
    // var friendUserId    = event.friendUserId;
    
    

    var lastFname           = requestBody.lastFriendName;
    var albumId             = requestBody[kAlbumId];
    var shouldGetAllFriends = requestBody[kAllFriends];
        

    var date = new Date();    
    
    
    console.log("Action: " +  JSON.stringify(action, null, 2));

    //TODO: Check is userId, friendUserId, friendname, and username is legit
    
    // Error checking user input
    if ( userId.length > 100 ) {
        finalAppResponse( activeResponse( ActiveValues.Unknown, activeErrorMessage( ActiveValues.Unknown )));
        return;
    }


    var maxRetries = 3;








    // function insertNewFriendForAllPublicAlbums(guid, friendGuid) {

    //     1) select all public albums of friend and insert them for guid
        
    //     2) select all public albums of user and insert them into friendsGuid

    // }


    function addAllFriendsForPublicAlbum(guid, albumId) {

        console.log("getAllFriends");

        connection.query({
            sql: 'INSERT INTO `friends_album` (guid, fguid, album_id) SELECT `guid2` as guid, ? , ? FROM `friends` WHERE `guid1` = ? AND (`status` = ? OR `status` = ? )',
            values: [ guid, albumId, guid, Relationship.IsFollowing ] 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, "Uh oh. " + APP_NAME +  " couldn't create your album. Try against shortly." ));
            } else {
                 connection.commit(function(err) {
                    if (err) {
                        // Failed to commit queries. Rollback on failure
                        connection.rollback(function() {
                            printError(err);
                            finalAppResponse( activeResponse(ActiveValues.Active, "Uh oh. " + APP_NAME +  " couldn't create your album. Try against shortly." ));
                        });
                    } else  {
                        console.log('successful commit!');
                        finalAppResponse( createAlbumResponse( albumId));
                    }
                 });   
            }
        });
    }




/**
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 * 
 *                          Friend action - befriend, cancel, accept
 *                          relationshipaction.js
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 */


    function printToConsole(statement) {
        console.log(statement);
    }


    // Helper Func: Returns the max id of both users notifications

    function getUserNotificationIds(results, guid, friendGuid) {

        // var myLastId;
        // var friendsLastId;

        var info = {};

        results.forEach((result) => {
            console.log(result);

            if (result.guid == guid ) {
                info.id = result.id;
            } else if (result.guid == friendGuid ) {
                info.fId = result.id;
            }
        });
        return info;
    }

    function nextMaxNotificationIds( info ) {


        if (!info.id || info.id === null || info.id <= 0 ) {
            info.id = 1;
        } else {
            info.id += info.id + 1;
        }
        
        if (!info.fId || info.fId === null || info.id <= 0 ) {
            info.fId = 1;
        } else {
            info.fId += 1;
        }
        return info;
    }







/**
 * ====================================================================================================
 * ====================================================================================================
 * 
 * 
 *                          NOTIFICATIONS
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 */


    // Send a Follow Request with a private account

    function sendFollowRequestNotifications(guid, friendGuid, overrideRequest) {

        printTimeForEvent("sendFollowRequestNotifications" );
        
        var sql;
        /**
         *  'INSERT INTO `notifications` (guid, fguid, type) \
            VALUES ? \
            ON DUPLICATE KEY UPDATE type = VALUES(type)'
        */

        if (overrideRequest) {
            sql = 'INSERT INTO `notifications` (guid, id, fguid, type) VALUES ? ON DUPLICATE KEY UPDATE type = VALUES(type)';
        } else {
            sql = 'INSERT INTO `notifications` (guid, id,  fguid, type) VALUES ?';
        }


        console.log("lastNotificationId");
        // See if there is a relationship already        

        var sqlMaxId = "SELECT `guid`, MAX(`id`) as id FROM `notifications` WHERE `guid` = ? OR `guid` = ? GROUP BY `guid` DESC";
        

        // See if there is a relationship already
        connection.query({
            
            sql: sqlMaxId,
            values: [ guid, friendGuid ]
        }, 
        function (err, results) {
                
            if (err) {
                printError(err);
                connection.rollback(function() {
                    finalAppResponse(errorResponse( ErrorMessageGeneric))
                });                
            } else if (results) {
                
                var info   = getUserNotificationIds(results, guid, friendGuid);
                var maxIds = nextMaxNotificationIds(info);

                var myLastId      = maxIds.id;
                var friendsLastId = maxIds.fId;

                console.log("myLastId friendsLastId");

                // See if there is a relationship already
                var query = connection.query({
                    sql: sql,
                    values: [
                        [
                            [guid, myLastId, friendGuid, NotificationType.SentFollowRequest],
                            [friendGuid, friendsLastId, guid, NotificationType.ReceivedFollowRequest]
                        ]
                    ]
                },
                function (err, results) {
                    
                    printTimeForEvent("Tried inserting 2 rows");

                    if (err) {
                        printError(err);
                        connection.rollback(function() {
                            finalAppResponse(errorResponse( ErrorMessageGeneric))
                        });
                    } else {
                        // Commit queries
                        connection.commit(function(err) {

                            printTimeForEvent("sendFollowRequestNotifications Commit" );

                            if (err) {
                                printError(err);
                                connection.rollback(function() {
                                    finalAppResponse(errorResponse( ErrorMessageGeneric))
                                });
                            } else  {
                                console.log('successful commit!');
                                finalAppResponse( friendActionResponse( 
                                    true, Relationship.FollowRequested));
                            }
                        });
                    }
                });
            }
        });
    }


        // Update an acceptance of a Follow Request with a private account


    // Get friends notification info: Id, either we keep it the same and update the status and timestamp
    // Or we delete the notification, and insert a new one with id = MAX(id) and NotifType = 

    //TODO: For when a user accepts or cances? 
    function updateAcceptFollowNotification(guid, followerGuid, action) {

        console.log("updateNotification, guid: "  + guid + " followerGuid: "  + followerGuid);
            
        connection.query({
            sql: "SELECT `id`, `guid` FROM `notifications` WHERE (`guid` = ? AND `fguid` = ? AND `type` = ?) OR (`guid` = ? AND `fguid` = ? AND `type` = ?)",
            values: [ followerGuid, guid, NotificationType.SentFollowRequest, guid, followerGuid, NotificationType.ReceivedFollowRequest ]
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                connection.rollback(function() {
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                });
            } 
            if (results && results.length == 2) {

                console.log("updateNotification results results[0].id" + results[0].id);

                var userIds =  getUserNotificationIds(results, guid, followerGuid);

                var mynotificationId     = userIds.id;
                var friendNotificationId = userIds.fId;

                // What are we gonna do here????
    
                // var updateNotification = 'INSERT INTO `notifications` (guid, id, fguid, type) VALUES ? ON DUPLICATE KEY UPDATE type = VALUES(type)';

                connection.query({
                    sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND id = ?",
                    values: [ NotificationType.IsFollowing, followerGuid, friendNotificationId ]
                }, 
                function (err, results) {
                    if (err) {
                        printError(err);
                        connection.rollback(function() {
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    }
                    if (results.affectedRows > 0) {
                        console.log("updateNotifications result.affectedRows > 0");

                        connection.query({
                            sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND id = ?",
                            values: [ NotificationType.BeingFollowed, guid, mynotificationId ]
                        }, 
                        function (err, results) {
                            if (err) {
                                printError(err);
                                connection.rollback(function() {
                                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                                });
                            } else {
                                // Commit queries
                                connection.commit(function(err) {
                                    if (err) {
                                        // Failed to commit queries. Rollback on failure
                                        printError(err);
                                        connection.rollback(function() {
                                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                                        });
                                    } else  {
                                        console.log('successful commit!');
                                        finalAppResponse( friendActionResponse( 
                                            true, Relationship.IsFollowing)
                                        );
                                    }
                                });
                            }
                        });
                    } else {
                        console.log("No rows affected?");
                        connection.rollback(function() {
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    }
                });
            } else {
                connection.rollback(function() {
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                });
            }
        });
    }
    
    /**
     * 
     * 1) Register username and photo
     * 
     * 2) serach users
     * 
     * 3) click user profile and get info
     * 
     * 4) Befriend and cancelCount
     * 
     * 5) View notificaitions
     * 
     * 6) Respond to notifications
     * 
     * 7) Edit profile and username 
     * 
     * 8) 
     * 
     * 9)  
     * 
     */




    // Unfollow and cancel
    function unfollowNotifications(guid, friendGuid) {
        printToConsole("unfollowNotifications" );
    
        var notificationSql = "SELECT `id`, `guid` FROM `notifications` WHERE (`guid` = ? AND `fguid` = ? AND `type` = ?) OR (`guid` = ? AND `fguid` = ? AND `type` = ?)";
            
        connection.query({
            sql: notificationSql,
            values: [ guid, friendGuid, NotificationType.SentFollowRequest, friendGuid, guid, NotificationType.ReceivedFollowRequest ]
        },
        function (err, results) {
            if (err) {
                // Rollback on failure
                connection.rollback(function() {
                    printError(err);
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                });
            } 
            if (results && results.length == 2) {

                console.log("updateNotification results results[0].id" + results[0].id);

                var userIds =  getUserNotificationIds(results, guid, friendGuid);

                var myNotificationId     = userIds.id;
                var friendNotificationId = userIds.fId;

                connection.query({
                    sql: "DELETE FROM `notifications` WHERE `guid` = ? AND `id` = ?",
                    values: [guid, myNotificationId]

                    // sql: "DELETE FROM `notifications` WHERE `guid` = ? AND `fguid` = ? AND `type` = ?",
                    // values: [guid, friendGuid, Relationship.FollowRequested]
                }, 
                function (err, results) {
                    if (err) {
                        printError(err);
                        connection.rollback(function() {         
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    } else {

                        if (results.affectedRows == 1) {
                            connection.query({
                                sql: "UPDATE `notifications` SET `type` = ? WHERE `guid` = ? AND `id` = ?",
                                values:  [ Relationship.CanceledFollowRequest, friendGuid, friendNotificationId]
                            }, 
                            function (err, results) {
                                if (err) {
                                    printError(err);
                                    connection.rollback(function() {         
                                        finalAppResponse(errorResponse( ErrorMessageGeneric));
                                    });
                                } else {
                                    if (results && results.affectedRows == 1) {

                                        connection.commit(function(err) {
                                            if (err) {
                                                printError(err);
                                                connection.rollback(function() {
                                                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                                                });
                                            } else  {
                                                console.log('successful commit!');
                                                finalAppResponse( friendActionResponse( 
                                                    true, Relationship.NoneExist));
                                            }
                                        });
                                    } else {
                                        connection.rollback(function() {
                                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                                        });
                                    }
                                }
                            });
                        } else {
                            connection.rollback(function() {         
                                finalAppResponse(errorResponse( ErrorMessageGeneric));
                            });
                        }
                    }
                });
            } else {
                console.log("Results count = : " + results.length + ", Results: " + results);
                connection.rollback(function() {         
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                });
            }
        });
    }
    

    function followNotification(guid, friendGuid) {

        console.log("followNotification, guid: "  + guid + " friendGuid: "  + friendGuid);
    
        // See if there is a relationship already
        connection.query({
            sql: "SELECT `guid`, MAX(`id`) as id FROM `notifications` WHERE `guid` = ? OR `guid` = ? GROUP BY `guid` DESC",
            values: [ guid, friendGuid ]
        }, 
        function (err, results) {
                
            if (err) {
                printError(err);
                connection.rollback(function() {
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                });
            } else if (results) {
                
                var info   = getUserNotificationIds(results, guid, friendGuid);
                var maxIds = nextMaxNotificationIds(info);

                var myLastId      = maxIds.id;
                var friendsLastId = maxIds.fId;

                console.log("myLastId friendsLastId");

                connection.query({
                    sql: 'INSERT INTO `notifications` (`guid`, `id`, `fguid`, `type`) VALUES ?',
                    values:  [
                        [
                            [ guid, myLastId, friendGuid, NotificationType.IsFollowing],
                            [ friendGuid, friendsLastId, guid, NotificationType.BeingFollowed]
                        ]
                    ]
                },
                function (err, results) {
        
                    console.log("updateNotification results results[0].id" + results[0].id);

                    if (err) {
                        printError(err);
                        connection.rollback(function() {
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    } 
                    if (results) {

                        console.log("updateNotifications result.affectedRows > 0");

                        // Commit queries
                        connection.commit(function(err) {
                            if (err) {
                                printError(err);
                                connection.rollback(function() {
                                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                                });
                            } else  {
                                console.log('successful commit!');
                                finalAppResponse( friendActionResponse( 
                                    true, Relationship.IsFollowing)
                                );
                            }
                        });
                    } else {
                        console.log("No rows affected?");
                        connection.rollback(function() {
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    }
                });
            } else {
                connection.rollback(function() {
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                });
            }
        });
    }






    /**
     *  ====================================================================
     *  ====================================================================
     *  
     *                  PROCESS FOLLOW REQUESTS
     * 
     *  ====================================================================
     *  ====================================================================
     */

  

    /**
     *  If user has auto accept enabled, then we make people friends automatically
     * 
     *  Else we send a friend request
     */

    function sendFollowRequest(guid, friendGuid, overrideRequest) {

        // If user has
        connection.query({
            sql: 'SELECT `is_private` FROM `profile` WHERE guid = ?',
            values: [ friendGuid ]
        }, 
        function (err, results) {
            if (err) {                                 
                printError(err);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {
                // If auto accept allowed
                if (results && results.length > 0 && results[0].is_private === 0) {

                    connection.beginTransaction(function(err) {
                        if (err) { 
                            console.log('Error:', JSON.stringify(err, null, 2));
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        } else {
            
                            console.log("sendFollowRequest private account, ", guid, friendGuid, overrideRequest);

                            var sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ?';

                            if (overrideRequest) {
                                sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)';
                            } 
                            
                            // See if there is a relationship already
                            connection.query({
                                sql: sql, 
                                values:  [friendGuid, guid, Relationship.IsFollowing]
                            }, 
                            function (err, results) {
                                console.log("sendFollowRequest function");

                                if (err) {
                                    
                                    // Rollback on failure
                                    connection.rollback(function() {                                            
                                        printError(err);
                                        //TODO: figure out relationship
                                        if (err.code == "ER_DUP_ENTRY" && maxRetries > 0) {
                                            maxRetries -= 1;
                                            checkIfFollowRelationshipExists(guid, friendGuid, FriendAction.Follow);
                                        } else {
                                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                                        }                                           
                                    });    
                                } else {
                                    console.log("will call sendFollowRequestNotifications");
                                    followNotification(guid, friendGuid, Relationship.IsFollowing, false);
                                }
                            });
                        }
                    });
                } else {
                    // Send a request
                    connection.beginTransaction(function(err) {
                        if (err) { 
                            console.log('Error:', JSON.stringify(err, null, 2));
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        } else {
            
                            console.log("sendFollowRequest public accoun start", guid, friendGuid, overrideRequest);


                            var sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ?';


                            /*
                            * 'INSERT INTO `friends` (guid1, guid2, status) \
                                VALUES ? \
                                ON DUPLICATE KEY UPDATE status = VALUES(status)'
                            */

                            if (overrideRequest) {
                                sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)';
                            }
                            
                            // See if there is a relationship already
                            connection.query({
                                sql: sql,
                                values: [friendGuid, guid, Relationship.FollowRequested]
                            }, 
                            function (err, results) {
                                console.log("sendFollowRequest function");

                                if (err) {
                                    printError(err);                                    
                                    connection.rollback(function() {                                            
                                        if (err.code == "ER_DUP_ENTRY" && maxRetries > 0 ) {
                                            maxRetries -= 1;
                                            checkIfFollowRelationshipExists(guid, friendGuid, FriendAction.Follow);
                                        } else {
                                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                                        }                                           
                                    });    
                                } else {
                                    console.log("will call sendFollowRequestNotifications");
                                    sendFollowRequestNotifications(guid, friendGuid, false);
                                }
                            });
                        }
                    });
                }
            }
        });
    }






    function acceptFollowRequest(guid, friendGuid) {
   
        // Confirm we received a request 
   
        connection.beginTransaction(function(err) {
            if (err) { 
                console.log('Error:', JSON.stringify(err, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {                
                connection.query({
                    sql: 'UPDATE `friends` set `status` = ? WHERE `guid1` = ? AND `guid2` = ?',
                    // sql: 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)',
                    values: [ Relationship.IsFollowing, friendGuid, guid]
                }, 
                function (err, results) {
                    if (err) {                 
                        // Rollback on failure
                        connection.rollback(function() {                                            
                            printError(err);
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });    
                    } else {
                        console.log("will update notification");
                        updateAcceptFollowNotification(guid, friendGuid, FriendAction.Accept);
                    }
                }); 
            }
        }); 
    }






    function unfollowRequest(guid, friendGuid) {

        console.log("unfollowRequest");

        connection.beginTransaction(function(err) {
            if (err) { 
                printError(err);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {
                connection.query({
                    sql: 'UPDATE `friends` SET `status` = ?, `cancel_count` = `cancel_count` + 1 WHERE `guid1` = ? AND `guid2` = ?',
                    values: [ Relationship.CanceledFollowRequest, friendGuid, guid ]
                }, 
                function (err, results) {
                    if (err) {
                        printError(err);
                        connection.rollback(function() {                                            
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    } else {
                        unfollowNotifications(guid, friendGuid);
                    }
                });
            }
        });
    }

    


    function checkIfFollowRelationshipExists(guid, followeeGuid, action) {
         
        console.log("checkFollowRelationship");

        var query = connection.query({          // user         // follower
            sql: 'SELECT * FROM `friends` WHERE `guid1` = ? AND `guid2` = ?',
            values: [followeeGuid, guid]
        }, 
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }

            // If has Relationship
            if (results) {

                var status = null;
                var cancelInfo = [];

                if ( results.length > 0) {
                    console.log('Results:', JSON.stringify(results, null, 2));

                    let info = results[0];
                    status    = info.status;
                    cancelInfo[0] = info.cancel_count;
                    cancelInfo[1] = info.timestamp;
                }


                if ( action === FriendAction.Accept) {
                 
                    processAcceptFollowRequest(guid, followeeGuid, status);
                
                } else if ( action === FriendAction.Follow ) {
                   
                    processFollowUserRequest(guid, followeeGuid, status, cancelInfo);
                    
                } else if ( action === FriendAction.Unfollow ) {
                    
                    processUnfollowRequest(guid, followeeGuid, status);

                } else {
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                }
            } else {
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }






    /**
     *  ====================================================================
     *  ====================================================================
     *  
     *                  FOLLOW   ACTIONS
     * 
     *  ====================================================================
     *  ====================================================================
     */

  

    function processFollowUserRequest(guid, friendGuid, relationship, cancelInfo) {


        console.log("processRequest: Action = followUser, calling sendFollowRequest");

        if (relationship === null) {

            sendFollowRequest(guid, friendGuid, false);

            // IF either one of us canceled, then how many times? and how long ago?
        } else if (relationship == Relationship.CanceledFollowRequest) {
            
            var cancelCount = cancelInfo[0];
            var cancelDate  = cancelInfo[1];
            var milliSeconds = getTime(cancelDate);
            var dateObj = dateToString(cancelDate);


            console.log("cancelCount: " + cancelCount);
            console.log("cancelDate: " + cancelDate);
            console.log("dateObj: " + dateObj);

            if ( cancelCount < 3) {
                sendFollowRequest(guid, friendGuid, true);
            } else if ( !withIn24Hours(milliSeconds) ) {
                sendFollowRequest(guid, friendGuid, true);

            } else {
                finalAppResponse(errorResponse( "You've sent and canceled too many times. Try again tomorrow."));
            }
            // check how manytimes canceled
        } else if (relationship == Relationship.FollowRequested) {
            console.log("processRequest: Action = followUser. Already Relationship.SentFollowRequest");

            finalAppResponse( friendActionResponse( 
                true, Relationship.FollowRequested)
            );

        // Already Following
        } else if (relationship == Relationship.IsFollowing) {
            console.log("processRequest: Action = followUser. Already friends");

            finalAppResponse( friendActionResponse( 
                true, Relationship.IsFollowing)
            );
        } else {
            console.log("processRequest: Action = followUser. Error");
            finalAppResponse(errorResponse( ErrorMessageGeneric));
        }
    }




    function processAcceptFollowRequest(guid, friendGuid, relationship) {
       
        if (relationship === null) {
            finalAppResponse(errorResponse( ErrorMessageGeneric));
        
        } else if (relationship.localeCompare(Relationship.FollowRequested) === 0) {
        
            console.log("processRequest: Action = " + FriendAction.Accept + ", calling acceptFollowRequest");
            // Accept friend recommendation
            acceptFollowRequest(guid, friendGuid);

        } else if (relationship.localeCompare(Relationship.IsFollowing) === 0) {
            console.log("processRequest: Action = " + FriendAction.Accept + ". Already friends");
            finalAppResponse( friendActionResponse( 
                true, Relationship.IsFollowing)
            ); 
        } else  {
            console.log("processRequest: Action = " + FriendAction.Accept + ". Error");
            finalAppResponse(errorResponse( ErrorMessageGeneric));
        }                     
    }


    function processUnfollowRequest(guid, friendGuid, relationship){
       
        if ( relationship === null || relationship.localeCompare(Relationship.CanceledFollowRequest) === 0) {
            console.log("processRequest: Action =  FriendAction.Unfollow, calling ");

            finalAppResponse( friendActionResponse( 
                true, Relationship.NoneExist)
            );
            // IF either one of us canceled, then how many times? and how long ago?
        } else if ( relationship.localeCompare(Relationship.FollowRequest) === 0) {
            console.log("myRelationship == Relationship.SentFollowRequest");

            unfollowRequest(guid, friendGuid);

        } else if (relationship == Relationship.IsFollowing) {
            console.log("myRelationship == Relationship.IsFollowing && theirRelationship == Relationship.IsFollowing");

                finalAppResponse(errorResponse( "Too late! You're friends"));
        } else {
            finalAppResponse(errorResponse( ErrorMessageGeneric));
        }
    }






  // function mysqlDateToJavaScript(mySqlDate) {
    //      // Split timestamp into [ Y, M, D, h, m, s ]
    //     var t = mySqlDate.split(/[- :]/);

    //     // Apply each element to the Date function
    //     var d = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));

    //     console.log(d);
    //     return d;
    // }
    

    // //'2011-04-11T10:20:30Z'
    // function mysqlDateToJavaScript2(mySqlDate) {
    //      // Split timestamp into [ Y, M, D, h, m, s ]
    //     var t = mySqlDate.split(" ");

    //     var newDate = t[0] + "T" + t[1] + "Z";
    //     // Apply each element to the Date function
    //     var d = new Date(newDate);

    //     console.log(d);
    //     return d;
    // } 


    function withIn24Hours(lastCancelTimeInMilliSec) {

        console.log("lastCancelTime: " + lastCancelTimeInMilliSec);


        var lastCancelTimeInSec = lastCancelTimeInMilliSec/1000;
        
        var nowTime = new Date().getTime()/1000;
        var before24HoursAgos = nowTime - (24 * 3600);

        // var difference = now24HoursBefore - lastCancelTime;
        if (lastCancelTimeInSec > before24HoursAgos ){
            return true;
        }
        return false;           
    }

    function getTime(timestamp) {
        var d = new Date(timestamp);
        var time = d.getTime();
        console.log("Time: " + time);
        return time;
    }



    function dateToString(date) {

        if (date !== null) {
            return date.toString();
        } 
        return null;
    }




/**
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 * 
 *                          Get list of friends
 *                          userfriends.js
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 */



    // Following table

    // user = guid1, follower = guid2
    // I can add people to send to who are following me. 
    // People I follow, I can only view, but not send anything.

    function getFollowers(guid) {


        // "SELECT `friends`.`guid2` AS guid, `friends`.`status` AS status, `friends`.`blocked` AS blocked, `profile`.`username` AS username, `profile`.`fullname` AS fullname 
        // FROM `friends` 
        //     INNER JOIN `profile` 
        //     ON `friends`.`guid2` = `profile`.`guid`
        // WHERE `friends`.`guid1` = ? AND (`status` = ? OR `status` = ? )
        // ORDER BY `username`"


        var friendsSql = "SELECT `friends`.`guid2` AS guid, `friends`.`status` AS status, `friends`.`blocked` AS blocked, `profile`.`username` AS username, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, `profile`.image_url AS image_url FROM `friends` INNER JOIN `profile` ON `friends`.`guid2` = `profile`.`guid` WHERE `friends`.`guid1` = ? AND (`status` = ? OR `status` = ?) ORDER BY `username`";

        // if (lastFname)

        // if (lastFname && lastFname != null && lastFname.legnth > 0) {
        //     friendsSql = 'SELECT `guid2` AS guid, `status`, `blocked` FROM `friends` WHERE `guid1` = ? AND ( `status` = ? OR `status` = ? ) LIMIT 60';
        // }

        // var profileNameLike    = 'SELECT `username`, `fullname`, `guid` FROM `profile` WHERE `username` like ? ORDER BY `popularity` DESC LIMIT 60';

        // var searchType = 1;

        // var searchSql;

        // switch (searchType) {
        //     case 1:
        //         searchSql = usersearchPrefix;
        //         break;
        //     case 2:
        //         searchSql = usersearchNameLike;
        //         searchText = searchText + "%";
        //         break;
        
        //     case 4:
        //         searchSql = profileNameLike
        //         searchText = searchText + "%";
        //         break;                    
        // }

            
            
        printTimeForEvent("Starting to getting Friends");
         
         
            /**
             * Result contains friends info as ( guid, status, blocked, username, fullname
             */
        connection.query({
            sql: friendsSql,
            values: [ guid , Relationship.IsFollowing], 
        }, 
        function (error, results, fields) {

            printTimeForEvent("End getting Friends");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse( ErrorMessageGeneric))
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                
                var friends = []; 

                results.forEach((result) => {
                    console.log(result);
                    
                    var blockedUser = false;
                    if (result.blocked == BlockedStatus.BlockedUser ) {
                        blockedUser = true;
                    }

                    var friend = {};
                    friend[kGuid] = result.guid;
                    friend[kUserName] = result.username;
                    friend[kFullName] = result.fullname;
                    friend[kVerified] = (result.verified === 1) ? true : false ;
                    friend[kBlocked]  = blockedUser;
                    friend[kProfileUrl] = result.image_url;

                    friends.push(friend);
                });
                
                var response = listFriendsResponse(friends);
                
                printTimeForEvent("getFriends close to end of function");


                if (albumId !== undefined &&  albumId !== null ) {            
                     getFriendsForAlbum(guid, albumId, response);
                } else {
                    finalAppResponse( response);
                }


                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }



    function getFriendsForAlbum(guid, albumId, response) {

        printTimeForEvent("getFriendsForAlbum");


        //TODO: Confirm albumId of user


        var stmt = "SELECT guid FROM `friends_album` WHERE fguid = ? AND album_id = ? "

        var query = connection.query({
            sql: stmt, // 'INSERT INTO `friends_album` (guid, fguid, album_id) VALUES ?',
            values: [ guid, albumId ] , 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                finalAppResponse(errorResponse( ErrorMessageGeneric))
            } else {
                console.log('Result:', JSON.stringify(results, null, 2));

                var selectedFriends = [];

                results.forEach((result) => {
                    console.log("Result:  " + result);
                    
                    selectedFriends.push(result.guid);
                });

                response[kSelectedFriends] = selectedFriends;
                finalAppResponse( response);
            }
        });
    }



    // getFollowersList
    function getFollowersList(guid) {

        if (lastFname && lastFname !== null) {
            lastFname = lastFname.toLowerCase();
                    
            let errorMessage =  isInvalidUsername(lastFname);

            if (errorMessage && errorMessage.length > 0 ) {
                finalAppResponse( errorResponse( errorMessage));
            }
        } 
        getFollowers(guid);
    }

    function getFollowingList(guid) {

        if (lastFname && lastFname !== null) {
            lastFname = lastFname.toLowerCase();
                    
            let errorMessage =  isInvalidUsername(lastFname);

            if (errorMessage && errorMessage.length > 0 ) {
                finalAppResponse( errorResponse( errorMessage));
            }
        } 
        getFriends(guid);
    }

    

    function ourAccount(guid, fguid) {
        return guid.localeCompare(fguid) == 0;
    }

    function queryUser() {
        console.log("func finderUser");
        var query = connection.query({
            sql: 'SELECT `guid`, `active` FROM `users` WHERE `id` = ? AND `acctid` = ?', 
            values: [userId, acctId]
        }, 
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse(errorResponse( ErrorMessageGeneric))
            }

            if (results && results.length  > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));

                if ( results[0].active != ActiveValues.Active ) {
                    finalAppResponse( activeResponse( results[0].active, activeErrorMessage( results[0].active )));
                    return;
                }

                var guid = results[0].guid;
                console.log('User exists. Guid: ' +  guid);
            
                if ( pathParams.localeCompare("/friends/list/following") == 0 ) {
                    getFollowingList(guid);
               
                 } else if ( pathParams.localeCompare("/friends/list/follower") == 0 ) {
                    getFollowersList(guid);
               
                 } else if ( pathParams.localeCompare("/friends/action") == 0 ) {
                
                    if ( !ourAccount(guid, friendGuid) ) {
                        checkIfFollowRelationshipExists(guid, friendGuid, action);
                    } else {
                        finalAppResponse( activeResponse( results[0].active, activeErrorMessage( results[0].active )));
                    }
                } else {
                    finalAppResponse( activeResponse( results[0].active, activeErrorMessage( results[0].active )));
                }
                // Add new user to database         
            } else {
                finalAppResponse( activeResponse( ActiveValues.DoesNotExist, activeErrorMessage(ActiveValues.DoesNotExist)));
            }
        });
    }

    queryUser();

};