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

var Relationships = {
    SentFriendRequest       : "SFR",        //S
    ReceivedFriendRequest   : "RFR",//  - R 
    AcceptedFriendRequest   : "AFR",//  - A"
    FriendAcceptedRequest   : "RFRA", // FAR // - F      
    CanceledFriendRequest   : "CFR" //  - C
};


var BlockedStatus = {
    BlockedFriend   : 1, //   - B
    BlockedByFriend : 2 //  - Y
};

/* The following 6 are the only thing the user needs to know */

var PublicStatus = {    
    Unknown               : "U",
    NoneExist             : "NE",
    SentFriendRequest     : "SFR",
    ReceivedFriendRequest : "RFR",
    Friends               : "F",
    Blocking              : "B"
};
    

// ACTIONS - Used in DRFriendAction
var FriendAction = {
    Friends : "F",
    Accept  : "A",
	Block   : "B",
	Unblock : "U",
	Cancel  : "C"
};

// Notifications Type
var NotificationType = {
    SentFriendRequest     : "SFR",
    FriendAcceptedRequest : "RFRA", 

    ReceivedFriendRequest : "RFR",
    AcceptedFriendRequest   : "AFR",

    FriendRequestCanceled   : "FRC"
};

function printError(err) {

    console.log('Error is :', JSON.stringify(err, null, 2));
    console.log('Error is :', JSON.stringify(err.code, null, 2));
    console.log('Error Message :', err.errorMessage);
                                    
    console.error('Error Stack is: ' + err.stack);
    console.error('Error Stack stringify: ' + JSON.stringify(err.stack, null, 2));
    console.log(err);
}


// var ErrorCode = {

// };

/** 
 * 
 *  didUpdate: Bool
 *  status: PublicStatus
 *  error: Bool
 *  message: String
 * 
 */

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








    function sendNotifications(guid, friendGuid, action, overrideRequest) {

        printTimeForEvent("sendNotifications for Action: " + action );
        
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


        if (action == FriendAction.Friends) {

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
                    // Rollback on failure
                    connection.rollback(function() {
                        printError(err);
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
                                [guid, myLastId, friendGuid, NotificationType.SentFriendRequest],
                                [friendGuid, friendsLastId, guid, NotificationType.ReceivedFriendRequest]
                            ]
                        ]
                    },
                    function (err, results) {
                        
                        printTimeForEvent("Tried inserting 2 rows");

                        if (err) {
                            // Rollback on failure
                            connection.rollback(function() {
                                printError(err);
                                finalAppResponse(errorResponse( ErrorMessageGeneric))
                            });
                        } else {
                            // Commit queries
                            connection.commit(function(err) {

                                printTimeForEvent("sendNotifications Commit - for Action: " + action );

                                if (err) {
                                    // Failed to commit queries. Rollback on failure
                                    connection.rollback(function() {
                                        printError(err);
                                        finalAppResponse(errorResponse( ErrorMessageGeneric))
                                    });
                                } else  {
                                    console.log('successful commit!');

                                    finalAppResponse( friendActionResponse( 
                                        true, PublicStatus.SentFriendRequest));
                                }
                            });
                        }
                    });
                }
            });
        }
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


/** 
 *                 -> 1) Accept  -> Friend Accepted Request
 *               /
 *  Sent ->  RCV ->  2)  Blocks/Ignores
 *  Sent -> Canceled
 * 
 * 
 */

    function printToConsole(statement) {
        console.log(statement);
    }

    function cancelNotifications(guid, friendGuid) {
        printToConsole("cancelNotifications" );
        printToConsole("guid: " + guid );
        printToConsole("friendGuid: " + friendGuid );


        var notificationSql = "SELECT `id`, `guid` FROM `notifications` WHERE (`guid` = ? AND `fguid` = ? AND `type` = ?) OR (`guid` = ? AND `fguid` = ? AND `type` = ?)";
            
        connection.query({
            sql: notificationSql,
            values: [ guid, friendGuid, NotificationType.SentFriendRequest, friendGuid, guid, NotificationType.ReceivedFriendRequest ]
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



                var query = connection.query({

                    sql: "DELETE FROM `notifications` WHERE `guid` = ? AND `id` = ?",
                    values: [guid, myNotificationId]

                    // sql: "DELETE FROM `notifications` WHERE `guid` = ? AND `fguid` = ? AND `type` = ?",
                    // values: [guid, friendGuid, Relationships.SentFriendRequest]
                }, 
                function (err, results) {
                    if (err) {
                        // Rollback on failure
                        connection.rollback(function() {         
                            printError(err);
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    } else {

                        if (results.affectedRows == 1) {

                            var updateQuery = "UPDATE `notifications` SET `type` = ? WHERE `guid` = ? AND `id` = ?";
                            var values = [ Relationships.CanceledFriendRequest, friendGuid, friendNotificationId];

                            var query = connection.query({
                                sql: updateQuery,
                                values:  values
                                // values: [ guids, guids,  Relationships.SentFriendRequest, Relationships.ReceivedFriendRequest]
                            }, 
                            function (err, results) {
                                if (err) {
                                    // Rollback on failure
                                    connection.rollback(function() {         
                                        printError(err);
                                        finalAppResponse(errorResponse( ErrorMessageGeneric));
                                    });
                                } else {

                                    if (results.affectedRows == 1) {

                                        connection.commit(function(err) {
                                            if (err) {
                                                // Failed to commit queries. Rollback on failure
                                                connection.rollback(function() {
                                                    printError(err);
                                                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                                                });
                                            } else  {
                                                console.log('successful commit!');

                                                finalAppResponse( friendActionResponse( 
                                                    true, PublicStatus.NoneExist));
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
    


    function cancelFriendRequest(guid, friendGuid) {

        console.log("cancelFriendRequest");

        connection.beginTransaction(function(err) {
            if (err) { 
                printError(err);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {

                var sqlDelete = 'DELETE FROM `friends` WHERE `guid1` = ? AND `guid2` = ? AND `status` = ?';
                // See if there is a relationship already
                var query = connection.query({
                    sql: sqlDelete,
                    values: [ friendGuid, guid, Relationships.ReceivedFriendRequest]
                },
                function (err, results) {
                    if (err) {                        
                        // Rollback on failure
                        connection.rollback(function() {                                            
                            printError(err);
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });    
                    } else {
                        
                        console.log('Results:', JSON.stringify(results, null, 2));

                        // Deleted succesfully
                        if (results.affectedRows > 0) {
                            // Update our status to canceled and increase count

                            /**
                             * 'UPDATE `friends` \
                                 SET status = ?, cancelCount = cancelCount + 1 \
                                 WHERE guid1 = ? AND guid2 = ?'
                             */
                            var sqlUpdate = 'UPDATE `friends` SET `status` = ?, `cancel_count` = `cancel_count` + 1 WHERE `guid1` = ? AND `guid2` = ?';


                            // See if there is a relationship already
                            var query = connection.query({
                                sql: sqlUpdate,
                                values: [ Relationships.CanceledFriendRequest, guid, friendGuid ]
                            }, 
                            function (err, results) {
                                if (err) {
                                    // Rollback on failure
                                    connection.rollback(function() {                                            
                                        printError(err);
                                        finalAppResponse(errorResponse( ErrorMessageGeneric));
                                    });
                                } else {
                                    cancelNotifications(guid, friendGuid);
                                }
                            });

                        } else {
                            // No rows affected...
                            //TODO: Recheck why this is
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        }
                    }
                });
            }
        });

    }

    



    /**
     *  If user has auto accept enabled, then we make people friends automatically
     * 
     *  Else we send a friend request
     */

    function sendFriendRequest(guid, friendGuid, overrideRequest) {

        // If user has
        connection.query({
            sql: 'SELECT `auto_accept_friends` FROM `user_settings` WHERE guid = ?',
            values: [ guid ]
        }, 
        function (err, results) {
            if (err) {                                 
                printError(err);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else { 
                // If auto accept allowed
                if (results && results.length > 0 && results[0].auto_accept_friends == 1) {

                    connection.beginTransaction(function(err) {
                        if (err) { 
                            console.log('Error:', JSON.stringify(err, null, 2));
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        } else {
            
                            console.log("sendFriendRequest start", guid, friendGuid, overrideRequest);

                            var sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ?';


                            /*
                            * 'INSERT INTO `friends` (guid1, guid2, status) \
                                VALUES ? \
                                ON DUPLICATE KEY UPDATE status = VALUES(status)'
                            */

                            if (overrideRequest) {
                                sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)';
                            } 

                            console.log("sendFriendRequest start: sql statement: " + sql);

                            
                            // See if there is a relationship already
                            connection.query({
                                sql: sql,
                                values: [
                                    [
                                        [guid, friendGuid, Relationships.FriendAcceptedRequest], // SentFriendRequest
                                        [friendGuid, guid, Relationships.AcceptedFriendRequest] //ReceivedFriendRequest
                                    ]
                                ]
                            }, 
                            function (err, results) {
                                console.log("sendFriendRequest function");

                                if (err) {
                                    
                                    // Rollback on failure
                                    connection.rollback(function() {                                            
                                        printError(err);
                                        //TODO: figure out relationship
                                        if (err.code == "ER_DUP_ENTRY" && maxRetries > 0) {
                                            maxRetries -= 1;
                                            checkFriendRelationship(guid, friendGuid);
                                        } else {
                                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                                        }                                           
                                    });    
                                } else {
                                    console.log("will call sendNotifications");
                                    autoAcceptNotification(guid, friendGuid, PublicStatus.Friends, false);
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
            
                            console.log("sendFriendRequest start", guid, friendGuid, overrideRequest);


                            var sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ?';


                            /*
                            * 'INSERT INTO `friends` (guid1, guid2, status) \
                                VALUES ? \
                                ON DUPLICATE KEY UPDATE status = VALUES(status)'
                            */

                            if (overrideRequest) {
                                sql = 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)';
                            } 

                            console.log("sendFriendRequest start: sql statement: " + sql);

                            
                            // See if there is a relationship already
                            connection.query({
                                sql: sql,
                                values: [
                                    [
                                        [guid, friendGuid, Relationships.SentFriendRequest],
                                        [friendGuid, guid, Relationships.ReceivedFriendRequest]
                                    ]
                                ]
                            }, 
                            function (err, results) {
                                console.log("sendFriendRequest function");

                                if (err) {
                                    
                                    // Rollback on failure
                                    connection.rollback(function() {                                            
                                    
                                        printError(err);

                                        //TODO: figure out relationship

                                        if (err.code == "ER_DUP_ENTRY" && maxRetries > 0 ) {
                                            maxRetries -= 1;
                                            checkFriendRelationship(guid, friendGuid);
                                        } else {
                                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                                        }                                           
                                    });    
                                } else {
                                console.log("will call sendNotifications");

                                    sendNotifications(guid, friendGuid, PublicStatus.Friends, false);
                                }
                            });
                        }
                    });
                }
            }
        });
    }

    function insertNewFriendForAllPublicAlbums(guid, friendGuid) {

        1) select all public albums of friend and insert them for guid
        
        2) select all public albums of user and insert them into friendsGuid

    }


    function addAllFriendsForPublicAlbum(guid, albumId) {

        console.log("getAllFriends");

        connection.query({
            sql: 'INSERT INTO `friends_album` (guid, fguid, album_id) SELECT `guid2` as guid, ? , ? FROM `friends` WHERE `guid1` = ? AND (`status` = ? OR `status` = ? )',
            values: [ guid, albumId, guid, Relationships.AcceptedFriendRequest, Relationships.FriendAcceptedRequest ] 
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


    function autoAcceptNotification(guid, friendGuid) {

        console.log("autoAcceptNotification, guid: "  + guid + " friendGuid: "  + friendGuid);

        var sqlMaxId = "SELECT `guid`, MAX(`id`) as id FROM `notifications` WHERE `guid` = ? OR `guid` = ? GROUP BY `guid` DESC";
        
        // See if there is a relationship already
        connection.query({
            sql: sqlMaxId,
            values: [ guid, friendGuid ]
        }, 
        function (err, results) {
                
            if (err) {
                // Rollback on failure
                connection.rollback(function() {
                    printError(err);
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
                            [ guid, myLastId, friendGuid, NotificationType.FriendAcceptedRequest],
                            [ friendGuid, friendsLastId, guid, NotificationType.AcceptedFriendRequest]
                        ]
                    ]
                }, 
                function (err, results) {
        
                    console.log("updateNotification results results[0].id" + results[0].id);

                    if (err) {
                        // Rollback on failure
                        connection.rollback(function() {
                            printError(err);
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    } 
                    if (results) {

                        console.log("updateNotifications result.affectedRows > 0");

                        // Commit queries
                        connection.commit(function(err) {
                            if (err) {
                                // Failed to commit queries. Rollback on failure
                                connection.rollback(function() {
                                    printError(err);
                                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                                });
                            } else  {
                                console.log('successful commit!');


                                finalAppResponse( friendActionResponse( 
                                    true, PublicStatus.Friends)
                                );
                            }
                        });
                    } else {
                        console.log("No rows affected?");
                        connection.rollback(function() {
                            printError(err);
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        });
                    }
                });
            } else {
                connection.rollback(function() {
                    printError(err);
                    finalAppResponse(errorResponse( ErrorMessageGeneric));
                });
            }
        });
    }







    function acceptFriendRequest(guid, friendGuid) {
   
        // Confirm we received a request 
   
        connection.beginTransaction(function(err) {
            if (err) { 
                console.log('Error:', JSON.stringify(err, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {                
                connection.query({
                    sql: 'INSERT INTO `friends` (`guid1`, `guid2`, `status`) VALUES ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)',
                    values:  [
                        [
                            [ guid, friendGuid, Relationships.AcceptedFriendRequest],
                            [ friendGuid, guid, Relationships.FriendAcceptedRequest]
                        ]
                    ]
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
                        updateAcceptNotification(guid, friendGuid, FriendAction.Accept);
                    }
                }); 
            }
        }); 
    }



            // Get friends notification info: Id, either we keep it the same and update the status and timestamp
            // Or we delete the notification, and insert a new one with id = MAX(id) and NotifType = AcceptedFriendRequest
    
    //TODO: For when a user accepts or cances? 
    function updateAcceptNotification(guid, friendGuid, action) {

        console.log("updateNotification, guid: "  + guid + " friendGuid: "  + friendGuid);

        if (action == FriendAction.Accept) {
            

            var notificationSql = "SELECT `id`, `guid` FROM `notifications` WHERE (`guid` = ? AND `fguid` = ? AND `type` = ?) OR (`guid` = ? AND `fguid` = ? AND `type` = ?)";
             
            connection.query({
                sql: notificationSql,
                values: [ friendGuid, guid, NotificationType.SentFriendRequest, guid, friendGuid, NotificationType.ReceivedFriendRequest ]
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

                    var mynotificationId      = userIds.id;
                    var friendNotificationId = userIds.fId;

                    // What are we gonna do here????
        
                    // var updateNotification = 'INSERT INTO `notifications` (guid, id, fguid, type) VALUES ? ON DUPLICATE KEY UPDATE type = VALUES(type)';

                    var updateNotification = "UPDATE `notifications` SET type = ? WHERE guid = ? AND id = ?";
        
                    connection.query({
                        sql: updateNotification,
                        values: [ NotificationType.FriendAcceptedRequest, friendGuid, friendNotificationId ]
                        // [[
                        //     [ guid, myId, friendGuid, NotificationType.FriendAcceptedRequest ],
                        //     [friendGuid, myId, guid,  NotificationType.FriendAcceptedRequest ]
                        // ]]
                    }, 

                    function (err, results) {
                        if (err) {
                            // Rollback on failure
                            connection.rollback(function() {
                                printError(err);
                                finalAppResponse(errorResponse( ErrorMessageGeneric));
                            });
                        } 
                        if (results.affectedRows > 0) {

                            console.log("updateNotifications result.affectedRows > 0");

                            // Commit queries
                            connection.commit(function(err) {
                                if (err) {
                                    // Failed to commit queries. Rollback on failure
                                    connection.rollback(function() {
                                        printError(err);
                                        finalAppResponse(errorResponse( ErrorMessageGeneric));
                                    });
                                } else  {
                                    console.log('successful commit!');


                                    finalAppResponse( friendActionResponse( 
                                        true, PublicStatus.Friends)
                                    );
                                }
                            });
                        } else {
                            console.log("No rows affected?");
                            connection.rollback(function() {
                                printError(err);
                                finalAppResponse(errorResponse( ErrorMessageGeneric));
                            });
                        }
                    });
                } else {
                    connection.rollback(function() {
                        printError(err);
                        finalAppResponse(errorResponse( ErrorMessageGeneric));
                    });
                }
            });
        }
    }
    



    function checkFriendRelationship(guid, friendGuid, action) {
         // // See if there is a relationship already
         /**
          * 'SELECT * FROM `friends` \
                  WHERE (`guid1` = ? AND guid2 = ?) \
                  OR `guid1` = ? AND guid2 = ?',
          */

        console.log("checkFriendRelationship");

        var query = connection.query({
            sql: 'SELECT * FROM `friends` WHERE (`guid1` = ? AND `guid2` = ?) OR (`guid1` = ? AND `guid2` = ?)',
            values: [guid, friendGuid, friendGuid, guid]
        }, 
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }

            if (results) {
                console.log('Results:', JSON.stringify(results, null, 2));


                var myRelationship = null;
                var theirRelationship = null;
                var cancelInfo = [];

                if (results && results.length > 0) {
                    // If has Relationship

                    var guid1 = results[0].guid1;
                    var guid2 = results[0].guid2;

                    if (guid == guid1 ) {
                        myRelationship    = results[0].status;
                        cancelInfo[0]     = results[0].cancel_count;
                        cancelInfo[1]     = results[0].timestamp;
                    } else {
                        theirRelationship = results[0].status;
                    }

                    if (results.length == 2) {
                   
                        if (guid == guid1 ) {
                            theirRelationship = results[1].status;
                        } else {
                            myRelationship =  results[1].status;  
                        }
                    }
                }
                processRequest(guid, friendGuid, action, myRelationship, theirRelationship, cancelInfo);
            }
        });
    }



    /**
     *  ====================================================================
     *  ====================================================================
     *  
     *                   HERLPER FUNCTIONS
     * 
     *  ====================================================================
     *  ====================================================================
     */

  


    function processRequest(guid, friendGuid, action, myRelationship, theirRelationship, cancelInfo){

        console.log("processRequest: guid = " + guid);
        console.log("processRequest: friendGuid = " + friendGuid);
        console.log("processRequest: action = " + action);
        console.log("processRequest: myRelationship = " + myRelationship);
        console.log("processRequest: theirRelationship = " +theirRelationship);
        console.log("processRequest: cancelInfo = " + cancelInfo);

        /** Accepting a friend request */
        if (action == FriendAction.Accept) {
            if (myRelationship === null || theirRelationship === null) {
                finalAppResponse(errorResponse( ErrorMessageGeneric));
                return;
            } else if (myRelationship == Relationships.ReceivedFriendRequest &&
                    theirRelationship == Relationships.SentFriendRequest) {
           
                console.log("processRequest: Action = " + FriendAction.Accept + ", calling acceptFriendRequest");

                // Accept friend recommendation
                acceptFriendRequest(guid, friendGuid);

            } else if (myRelationship == Relationships.AcceptedFriendRequest || 
                    theirRelationship == Relationships.FriendAcceptedRequest) {
                console.log("processRequest: Action = " + FriendAction.Accept + ". Already friends");

                finalAppResponse( friendActionResponse( 
                    true, PublicStatus.Friends)
                ); 

            } else  {
                console.log("processRequest: Action = " + FriendAction.Accept + ". Error");
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }                     


        /** Sending a friend request */
        } else if (action == FriendAction.Friends) {
                
            console.log("processRequest: Action = " + FriendAction.Friends + ", calling sendFriendRequest");


            if (myRelationship === null) {

                console.log("myRelationship = " + myRelationship + " and theirRelationship = " + theirRelationship);

                sendFriendRequest(guid, friendGuid, false);

                // IF either one of us canceled, then how many times? and how long ago?
            } else if (myRelationship == Relationships.CanceledFriendRequest) {
                
                

                var cancelCount = cancelInfo[0];
                var cancelDate  = cancelInfo[1];
                var milliSeconds = getTime(cancelDate);
                var dateObj = dateToString(cancelDate);


                console.log("cancelCount: " + cancelCount);
                console.log("cancelDate: " + cancelDate);
                console.log("dateObj: " + dateObj);

                if ( cancelCount < 3) {
                    sendFriendRequest(guid, friendGuid, true);
                } else {
                    if ( !withIn24Hours(milliSeconds) ) {

                        sendFriendRequest(guid, friendGuid, true);

                    } else {

                    finalAppResponse(errorResponse( "You've sent and canceled too many times. Try again tomorrow."));

                        // finalAppResponse( friendActionResponse( 
                        //     false, PublicStatus.Friends, "You've sent and canceled too many times. Try again tomorrow.")
                        // );
                    }
                }
                // check how manytimes canceled
            }
            else if (myRelationship == Relationships.ReceivedFriendRequest && 
                    theirRelationship == Relationships.SentFriendRequest) {
                console.log("processRequest: Action = " + FriendAction.Friends + ", calling acceptFriendRequest");

                acceptFriendRequest(guid, friendGuid);

            // Already sent friend request
            } else if (myRelationship == Relationships.SentFriendRequest && 
                    theirRelationship == Relationships.ReceivedFriendRequest) {
                console.log("processRequest: Action = " + FriendAction.Friends + ". Already PublicStatus.SentFriendRequest");

                finalAppResponse( friendActionResponse( 
                    true, PublicStatus.SentFriendRequest)
                );

            // Already friends
            } else if (myRelationship == Relationships.AcceptedFriendRequest && theirRelationship == Relationships.FriendAcceptedRequest
            || myRelationship == Relationships.FriendAcceptedRequest && theirRelationship == Relationships.AcceptedFriendRequest) {
                console.log("processRequest: Action = " + FriendAction.Friends + ". Already friends");


                finalAppResponse( friendActionResponse( 
                    true, PublicStatus.Friends)
                );

            } else {
                console.log("processRequest: Action = " + FriendAction.Friends + ". Error");
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        }

        // Canceled Friend Request
        else if (action == FriendAction.Cancel) {
          
            if (myRelationship === null) {
                console.log("processRequest: Action = " + FriendAction.Cancel + ", calling sendFriendRequest");


                finalAppResponse( friendActionResponse( 
                    true, PublicStatus.NoneExist)
                );

                // IF either one of us canceled, then how many times? and how long ago?
            } else if ( myRelationship == Relationships.SentFriendRequest) {
                console.log("myRelationship == Relationships.SentFriendRequest");

                cancelFriendRequest(guid, friendGuid);

            } else if (myRelationship == Relationships.CanceledFriendRequest) {
                console.log("myRelationship == Relationships.CanceledFriendRequest");

                finalAppResponse( friendActionResponse( 
                    true, PublicStatus.NoneExist)
                );
            } else if (myRelationship == Relationships.FriendAcceptedRequest) {
                console.log("myRelationship == Relationships.FriendAcceptedRequest && theirRelationship == Relationships.AcceptedFriendRequest");

                    finalAppResponse(errorResponse( "Too late! You're friends"));


                // finalAppResponse( friendActionResponse( 
                //     false, PublicStatus.Friends, "Too late! You're friends")
                // );

            } else {
                
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        }
    }




	function friendAction(guid) {

        console.log("friend action");
        switch(action) {

            case FriendAction.Friends:
                checkFriendRelationship(guid, friendGuid, action);
                break;
            case FriendAction.Accept:
                checkFriendRelationship(guid, friendGuid, action);
                break;
            case FriendAction.Cancel:
                checkFriendRelationship(guid, friendGuid, action);
                break;
            default:
                finalAppResponse(errorResponse( ErrorMessageGeneric));
        }
    }




    function ourAccount(guid, fguid) {
        if ( guid == fguid) {
            return true;
        }
        return false;
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



    function getFriends(guid) {


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
        var query = connection.query({
            sql: friendsSql,
            values: [ guid , Relationships.AcceptedFriendRequest, Relationships.FriendAcceptedRequest], 
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
                    
                    var blockedFriend = false;
                    if (result.blocked == BlockedStatus.BlockedFriend ) {
                        blockedFriend = true;
                    }

                    var friend = {};
                    friend[kGuid] = result.guid;
                    friend[kUserName] = result.username;
                    friend[kFullName] = result.fullname;
                    friend[kVerified] = (result.verified === 1) ? true : false ;
                    friend[kBlocked]  = blockedFriend;
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



    function getFriendsList(guid) {

        if (lastFname && lastFname !== null) {
            lastFname = lastFname.toLowerCase();
                    
            let errorMessage =  isInvalidUsername(lastFname);

            if (errorMessage && errorMessage.length > 0 ) {
                finalAppResponse( errorResponse( errorMessage));
            }
        }
        
        getFriends(guid);
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
            
                if ( pathParams.localeCompare("/friends/list") == 0 ) {
                
                    getFriendsList(guid);
                }
                else if ( pathParams.localeCompare("/friends/action") == 0 ) {
                
                    if ( !ourAccount(guid, friendGuid) ) {
                        friendAction(guid);
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