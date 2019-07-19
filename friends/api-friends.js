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
let kPrivate    = "private";


let kAllowFollowersView     =  "allowFollowersView";
let kAllowFollowingsView    =  "allowFollowingsView";


let kScore          = "score";
let kFollowersCount = "followersCount";
let kFollowingCount = "followingCount";


function splitGuid(guid) {
    return guid.split("-");
}

function convertToGuid(userId, acctId) {
    return userId + "-" + acctId;
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
    if (username === undefined || username === null ||  username.length < 1 || username === "") {
        return "Please enter a username";
    }
    if (username.length > MAX_CHARACTER_LENGTH) {
        return "Username is too long. It can be at most " + MAX_CHARACTER_LENGTH + " characters long.";  
    }
    
    if ( invalidCharacters(username) ){
        return "Username can only have letters, numbers, and ._-";  
    }        
    return null;
}


console.log('creating connection');

var connection = mysql.createConnection({
    host     : 'mysqldromotest.cyoa59avdmjr.us-east-1.rds.amazonaws.com',
    user     : 'hannyalybear',
    password : 'SummerIsNearAndYellow1',
    database : 'dromotestmysqldb',
    charset  : 'utf8mb4_unicode_ci' 
});

/* The following are the stored values in database */

var Relationship = {
    Unknown               : 0,
    NoneExist             : 1,
    FollowRequested       : 2,        
    IsFollowing           : 3,   
    CanceledFollowRequest : 5
};

var BlockedStatus = {
    None    : 0,
    Blocked : 1
}


// Notifications Type
var NotificationType = {
    SentFollowRequest     : 0,
    ReceivedFollowRequest : 1,
    IsFollowing           : 2,   // You are following JOhn232
    BeingFollowed         : 3,   // JOhn232 is following you
    BlockedUser           : 4,    
    MentionedInAlbum      : 5,
    MentionedInComment    : 6
};



// ACTIONS - Used in DRFriendAction
var FriendAction = {
    Follow    : 0,
    Unfollow  : 1,
    Accept    : 2,
    Block     : 3,
    Unblock   : 4
};


function printError(err) {
    console.log(err);
    console.error('Error Stack is: ' + err.stack);
}



let kDidUpdate      = "didUpdate";
let kErrorMessage   = "errorMessage";
// let kFriendStatus   = "friendStatus";
let kSuccess        = "success";
let kActive         = "active";


let kProfile        = "profile";
let kUpdatedValue   = "updatedValue";

let kOtherMessage   = "message";


let kFollowers        = "followers";
let kFollowedStatus  = "followedStatus";
let kFollowingStatus = "followingStatus";




// People following me
function followedActionResponse(didUpdate, status, isBlocked) { 
    var response = {};
    response[kActive]         = ActiveValues.Active;
    response[kDidUpdate]      = didUpdate;
    response[kFollowedStatus] = status;
    response[kBlocked]        = isBlocked;
    return response;
}
// People I'm following
function followingActionResponse(didUpdate, status, isBlocked) { 
    var response = {};
    response[kActive]         = ActiveValues.Active;
    response[kDidUpdate]      = didUpdate;
    response[kFollowingStatus] = status;
    return response;
}


function friendActionResponse(didUpdate, status, isBlocked) { 
    var response = {};
    response[kActive]         = ActiveValues.Active;
    response[kDidUpdate]      = didUpdate;
    response[kFollowingStatus] = status;
    response[kBlocked]        = isBlocked;
    return response;
}



function followingStatusResponse( status ) { 
    var response = {};
    response[kActive]         = ActiveValues.Active;
    response[kFollowingStatus] = status;
    return response;
}


function followerStatusResponse( status, isBlocked) { 
    var response = {};
    response[kActive]          = ActiveValues.Active;
    response[kFollowingStatus] = status;
    response[kBlocked]         = isBlocked;
    return response;
}



function listFriendsResponse( friends ) {
    var response = {};
    response[kActive]    = ActiveValues.Active;
    response[kFollowers] = friends;
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


let kAlbumId    = "albumId";
let kType       = "type";

let kTimestamp  = "timestamp";
let kDate       = "date";
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
    

    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    

    var userId          = cognitoIdentityId;
    var acctId          = requestBody[kAcctId];
    var action          = requestBody[kAction];
    var friendGuid      = requestBody[kFriendGuid];
    
    var notificationId  = requestBody[kNotificationId];
    // var userName        = "TODO-Addusername"; //event.username.toLowerCase();
    // var friendUserName  = event.FriendUsername.toLowerCase();
    // var friendUserId    = event.friendUserId;
    
    
    var kLastFriendName = "lastFriend";

    var lastFname           = requestBody[kLastName];
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

// album_permissions
    // function addAllFriendsForPublicAlbum(guid, albumId) {

    //     console.log("getAllFriends");

    //     connection.query({
    //         sql: 'INSERT INTO `friends_album` (guid, fguid, album_id) SELECT `guid2` as guid, ? , ? FROM `friends` WHERE `guid1` = ? AND (`status` = ? OR `status` = ? )',
    //         values: [ guid, albumId, guid, Relationship.IsFollowing ] 
    //     }, 
    //     function (err, results) {
    //         if (err) {
    //             printError(err);
    //             finalAppResponse( activeResponse(ActiveValues.Active, "Uh oh. " + APP_NAME +  " couldn't create your album. Try against shortly." ));
    //         } else {
    //              afedcofnnection.commit(function(err) {
    //                 if (err) {
    //                     // Failed to commit queries. Rollback on failure
    //                     rollbackErrorResponse();
    //                 } else  {
    //                     console.log('successful commit!');
    //                     finalAppResponse( createAlbumResponse( albumId));
    //                 }
    //              });   
    //         }
    //     });
    // }




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

    function rollbackErrorResponse() {
         connection.rollback(function() {
            finalAppResponse(errorResponse( ErrorMessageGeneric));
        });
    }

    function printToConsole(statement) {
        console.log(statement);
    }


    // Helper Func: Returns the max id of both users notifications


    function getNotificationIdsList(results, guid, friendGuid) {

        var info = {};

        info.id = [];
        info.fId = [];

        results.forEach((result) => {
            console.log(result);

            if (result.guid.localeCompare( guid ) === 0 ) {
                info.id.push(result.id);
            } else if (result.guid.localeCompare( friendGuid ) === 0) {
                // info.fId = result.id;
                info.fId.push(result.id);

            }
        });
        return info;
    }



    function getUserNotificationIds(results, guid, friendGuid) {

        var info = {};

        results.forEach((result) => {
            console.log(result);

            if (result.guid.localeCompare( guid ) === 0 ) {
                info.id = result.id;
            } else if (result.guid.localeCompare( friendGuid ) === 0) {
                info.fId = result.id;
            }
        });
        return info;
    }

    function nextMaxNotificationIds( info ) {


        if (info.id === undefined || info.id === null ) {
            info.id = 0;
        } else {
            info.id += 1;
        }
        
        if (info.fId === undefined || info.fId === null ) {
            info.fId = 0;
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

        connection.query({
            sql: "INSERT INTO `notifications`(`guid`, `id`, `fguid`, `type`) SELECT ?, coalesce(MAX(`id`) + 1, 0), ?, ? FROM `notifications` WHERE guid = ?",
            values:  [ guid, friendGuid, NotificationType.SentFollowRequest, guid]
        },
        function (err, results) {
            
            console.log("sendFollowRequestNotifications results results[0].id");

            if (err) {
                printError(err);
                rollbackErrorResponse();
            } else if (results && results.affectedRows === 1) {
                
                connection.query({
                    sql: "INSERT INTO `notifications`(`guid`, `id`, `fguid`, `type`) SELECT ?,  coalesce(MAX(`id`) + 1, 0), ?, ? FROM `notifications` WHERE guid = ?",
                    values:  [ friendGuid, guid, NotificationType.ReceivedFollowRequest, friendGuid]
                },
                function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    } else if (results && results.affectedRows === 1) {
                        
                        // We don't update follower/folling count numbers
                        // We don't insert into timeline anything
                        connection.commit(function(err) {
                        
                            printTimeForEvent("sendFollowRequestNotifications Commit" );
        
                            if (err) {
                                printError(err);
                                rollbackErrorResponse();
                            } else  {
                                console.log('successful commit!');
                                finalAppResponse( friendActionResponse( 
                                    true, Relationship.FollowRequested));
                            }
                        });
                    } else {
                        rollbackErrorResponse();                        
                    }
                });
            } else {
                rollbackErrorResponse();
            }
        });
                    

        // connection.query({
        //     sql: 'INSERT INTO `notifications` (guid, fguid, type) VALUES ?',
        //     values: [
        //         [
        //             [guid, friendGuid, NotificationType.SentFollowRequest],
        //             [friendGuid, guid, NotificationType.ReceivedFollowRequest]
        //         ]
        //     ]
        // },
        // function (err, results) {
            
        //     printTimeForEvent("Tried inserting 2 rows");

        //     if (err) {
        //         printError(err);
        //         rollbackErrorResponse();

        //     } else if (results && results.affectedRows === 2) {
        //         // Commit queries

        //         // We don't update follower/folling count numbers
        //         connection.commit(function(err) {

        //             printTimeForEvent("sendFollowRequestNotifications Commit" );

        //             if (err) {
        //                 printError(err);
        //                 rollbackErrorResponse();
        //             } else  {
        //                 console.log('successful commit!');
        //                 finalAppResponse( friendActionResponse( 
        //                     true, Relationship.FollowRequested));
        //             }
        //         });
        //     } else {
        //         rollbackErrorResponse();
        //     }
        // });
    }


    // function sendFollowRequestNotifications(guid, friendGuid, overrideRequest) {

    //     printTimeForEvent("sendFollowRequestNotifications" );
        
    //     var sql = 'INSERT INTO `notifications` (guid, id,  fguid, type) VALUES ?';
        
    //     if (overrideRequest) {
    //         sql = 'INSERT INTO `notifications` (guid, id, fguid, type) VALUES ? ON DUPLICATE KEY UPDATE type = VALUES(type)';
    //     }


    //     console.log("lastNotificationId");
    //     // See if there is a relationship already        

    //     var sqlMaxId = "SELECT `guid`, MAX(`id`) as id FROM `notifications` WHERE `guid` = ? OR `guid` = ? GROUP BY `guid` DESC";
        

    //     // See if there is a relationship already
    //     connection.query({
    //         sql: sqlMaxId,
    //         values: [ guid, friendGuid ]
    //     }, 
    //     function (err, results) {
                
    //         if (err) {
    //             printError(err);
    //             rollbackErrorResponse();               
    //         } else if (results) {
                

    //             var lastNotificationIds   = getUserNotificationIds(results, guid, friendGuid);

    //             var newMaxIds = nextMaxNotificationIds(lastNotificationIds);

    //             var myLastId      = newMaxIds.id;
    //             var friendsLastId = newMaxIds.fId;

    //             console.log("sendFollowRequestNotifications -  myLastId    : " + myLastId);
    //             console.log("sendFollowRequestNotifications - friendsLastId: " + friendsLastId);

    //             // See if there is a relationship already
                
    //             connection.query({
    //                 sql: sql,
    //                 values: [
    //                     [
    //                         [guid, myLastId, friendGuid, NotificationType.SentFollowRequest],
    //                         [friendGuid, friendsLastId, guid, NotificationType.ReceivedFollowRequest]
    //                     ]
    //                 ]
    //             },
    //             function (err, results) {
                    
    //                 printTimeForEvent("Tried inserting 2 rows");

    //                 if (err) {
    //                     printError(err);
                        
    //                     if (err.code == "ER_DUP_ENTRY" && maxRetries > 0) {
    //                         maxRetries -= 1;
    //                         sendFollowRequestNotifications(guid, friendGuid);
    //                     } else {
    //                         rollbackErrorResponse();
    //                     }
    //                 }
    //                 else if (results && results.affectedRows === 2) {
    //                     // Commit queries

    //                     // We don't update follower/folling count numbers
    //                     connection.commit(function(err) {

    //                         printTimeForEvent("sendFollowRequestNotifications Commit" );

    //                         if (err) {
    //                             printError(err);
    //                             rollbackErrorResponse();
    //                         } else  {
    //                             console.log('successful commit!');
    //                             finalAppResponse( friendActionResponse( 
    //                                 true, Relationship.FollowRequested));
    //                         }
    //                     });
    //                 } else {
    //                     rollbackErrorResponse();
    //                 }
    //             });
    //         }
    //     });
    // }


        // Update an acceptance of a Follow Request with a private account


    // Get friends notification info: Id, either we keep it the same and update the status and timestamp
    // Or we delete the notification, and insert a new one with id = MAX(id) and NotifType = 

    //TODO: For when a user accepts or cances? 

    /**
     * guid is allowing followerGuid to follow
     */
    function updateAcceptFollowNotification(guid, followerGuid) {
        
        console.log("updateNotification, guid: "  + guid + " followerGuid: "  + followerGuid);
                    
        connection.query({
            sql: "UPDATE `notifications` SET timestamp = NOW(), type = ? WHERE guid = ? AND fguid = ? AND type = ?",
            values: [ NotificationType.IsFollowing, followerGuid, guid, NotificationType.SentFollowRequest ]
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                rollbackErrorResponse();
            }
            if (results.affectedRows == 1) {
                console.log("updateNotifications result.affectedRows > 0");

                connection.query({
                    sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND fguid = ? AND type = ?",
                    values: [ NotificationType.BeingFollowed, guid, followerGuid, NotificationType.ReceivedFollowRequest ]
                }, 
                function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    }
                    if (results.affectedRows == 1) {
                        console.log("updateNotifications result.affectedRows > 0");
        
                        updateCountsToFollow(followerGuid, guid); 
        
                    } else {
                        rollbackErrorResponse();
                    }
                });

            } else {
                rollbackErrorResponse();
            }
        });
    }
            



    // function updateAcceptFollowNotification(guid, followerGuid) {

    //     console.log("updateNotification, guid: "  + guid + " followerGuid: "  + followerGuid);
            
    //     connection.query({
    //         sql: "SELECT `id`, `guid` FROM `notifications` WHERE (`guid` = ? AND `fguid` = ? AND `type` = ?) OR (`guid` = ? AND `fguid` = ? AND `type` = ?)",
    //         values: [ followerGuid, guid, NotificationType.SentFollowRequest, guid, followerGuid, NotificationType.ReceivedFollowRequest ]
    //     }, 
    //     function (err, results) { 
    //         if (err) {
    //             printError(err);
    //             rollbackErrorResponse();
    //         } 
    //         if (results && results.length == 2) {

    //             console.log("updateNotification results results[0].id");

    //             var userIds =  getUserNotificationIds(results, guid, followerGuid);
 
    //             var mynotificationId     = userIds.id;
    //             var friendNotificationId = userIds.fId;

    //             // What are we gonna do here????
    
    //             // var updateNotification = 'INSERT INTO `notifications` (guid, id, fguid, type) VALUES ? ON DUPLICATE KEY UPDATE type = VALUES(type)';

    //             connection.query({
    //                 sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND id = ?",
    //                 values: [ NotificationType.IsFollowing, followerGuid, friendNotificationId ]
    //             }, 
    //             function (err, results) {
    //                 if (err) {
    //                     printError(err);
    //                     rollbackErrorResponse();
    //                 }
    //                 if (results.affectedRows == 1) {
    //                     console.log("updateNotifications result.affectedRows > 0");

    //                     connection.query({
    //                         sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND id = ?",
    //                         values: [ NotificationType.BeingFollowed, guid, mynotificationId ]
    //                     }, 
    //                     function (err, results) {
    //                         if (err) {
    //                             printError(err);
    //                             rollbackErrorResponse();
    //                         } else if (results && results.affectedRows == 1) {

    //                             updateCountsToFollow(followerGuid, guid); 

    //                         } else {
    //                             rollbackErrorResponse();
    //                         }
    //                     });
    //                 } else {
    //                     console.log("No rows affected?");
    //                     rollbackErrorResponse();
    //                 }
    //             });
    //         } else {
    //             rollbackErrorResponse();
    //         }
    //     });
    // }
    
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

     
    /* Unfollow and cancel 
     *
     * guid is unfollowing/revoking follow request
     * 
    */
    function unfollowNotifications(guid, friendGuid, relationship) {

        connection.query({
            sql: "DELETE FROM `notifications` WHERE (`guid` = ? AND fguid = ? AND (`type` = ? OR `type` = ?)) OR (`guid` = ? AND fguid = ? AND (`type` = ? OR `type` = ?))",
            values: [guid, friendGuid, NotificationType.SentFollowRequest, NotificationType.IsFollowing, friendGuid, guid , NotificationType.ReceivedFollowRequest, NotificationType.BeingFollowed]
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                rollbackErrorResponse();
            } else {

                // 
                if  (relationship === Relationship.FollowRequested) {
                    commitUnfollowRequest();
                } else { 
                    updateUnfollowCount(guid, friendGuid);
                }
            }
        });

    }

    // function unfollowNotifications(guid, friendGuid, relationship) {
    //     printToConsole("unfollowNotifications" );
    
    //     var notificationSql = "SELECT `id`, `guid` FROM `notifications` WHERE (`guid` = ? AND `fguid` = ? AND `type` = ?) OR (`guid` = ? AND `fguid` = ? AND `type` = ?)";
        
    //     var parameters =  [ guid, friendGuid, NotificationType.IsFollowing, friendGuid, guid , NotificationType.BeingFollowed];

    //     if  (relationship === Relationship.FollowRequested) {
    //         printToConsole("unfollowNotifications FollowRequested" );
    //         parameters =  [ guid, friendGuid, NotificationType.SentFollowRequest, friendGuid, guid , NotificationType.ReceivedFollowRequest];
    //     }
    //     else {
    //         printToConsole("unfollowNotifications IsFollowing" );
    //     }
    //     connection.query({
    //         sql: notificationSql,
    //         values: parameters
    //     },
    //     function (err, results) {
    //         if (err) {
    //             printError(err);
    //             rollbackErrorResponse();
    //         }
    //         if (results && results.length > 0) {

    //             console.log("updateNotification results length: " + results.length);

    //             var userIds =  getNotificationIdsList(results, guid, friendGuid);

    //             var myNotificationId     = userIds.id;
    //             var friendNotificationId = userIds.fId;


    //             var deleteList = [];
    //             myNotificationId.forEach((notificationId) => {
    //                 deleteList.push([guid, notificationId ]);
    //             });
                
    //             friendNotificationId.forEach((notificationId) => {
    //                 deleteList.push([friendGuid, notificationId ]);
    //             });

    //             console.log("Delete from notifications: " + deleteList);

        
    //             // DELETE FROM table WHERE (col1,col2) IN ((1,2),(3,4),(5,6))

    //             connection.query({
    //                 sql: "DELETE FROM `notifications` WHERE (`guid`, `id`) IN (?)",
    //                 values: [deleteList]

    //                 // sql: "DELETE FROM `notifications` WHERE `guid` = ? AND `fguid` = ? AND `type` = ?",
    //                 // values: [guid, friendGuid, Relationship.FollowRequested]
    //             }, 
    //             function (err, results) {
    //                 if (err) {
    //                     printError(err);
    //                     rollbackErrorResponse();
    //                 } else {

    //                     console.log("results.affectedRows === " + results.affectedRows);

    //                     if (results.affectedRows === 2) {

    //                         if  (relationship === Relationship.FollowRequested) {
    //                             commitUnfollowRequest();
    //                         } else {
    //                             updateUnfollowCount(guid, friendGuid);
    //                         }

    //                         // connection.commit(function(err) {
    //                         //     if (err) {
    //                         //         printError(err);
    //                         //         rollbackErrorResponse();
    //                         //     } else  {
    //                         //         console.log('successful commit!');
    //                         //         finalAppResponse( friendActionResponse( 
    //                         //             true, Relationship.NoneExist));
    //                         //     }
    //                         // });

    //                         // connection.query({
    //                         //     sql: "UPDATE `notifications` SET `type` = ? WHERE `guid` = ? AND `id` = ?",
    //                         //     values:  [ Relationship.CanceledFollowRequest, friendGuid, friendNotificationId]
    //                         // }, 
    //                         // function (err, results) {
    //                         //     if (err) {
    //                         //         printError(err);
    //                         //         rollbackErrorResponse();
    //                         //     } else {
    //                         //         if (results && results.affectedRows == 1) {

    //                         //             connection.commit(function(err) {
    //                         //                 if (err) {
    //                         //                     printError(err);
    //                         //                     rollbackErrorResponse();
    //                         //                 } else  {
    //                         //                     console.log('successful commit!');
    //                         //                     finalAppResponse( friendActionResponse( 
    //                         //                         true, Relationship.NoneExist));
    //                         //                 }
    //                         //             });
    //                         //         } else {
    //                         //             rollbackErrorResponse();
    //                         //         }
    //                         //     }
    //                         // });
    //                     } else {
    //                         rollbackErrorResponse();
    //                     }
    //                 }
    //             });
    //         } else {
    //             console.log("Results count = : " + results.length + ", Results: " + results);
    //             rollbackErrorResponse();
    //         }
    //     });
    // }

    


    /**
     * 
     * @param {string} guid 
     * @param {string} friendGuid 
     * 
     */


     /**
      *     Updates the count for the person who is being followed

      We're following them. So incease our following and their followers
      */


    function updateCountsToFollow( followerGuid, beingFollowedGuid) {
        console.log("updateCountsToFollow");

        connection.query({
            sql: 'UPDATE `profile` SET `followers` = `followers` + 1 WHERE `guid` = ?',
            values: [ beingFollowedGuid ]
        }, 
        function (err, results) {
            console.log("updateCountsToFollow - Update followers Rows affected: " + results.affectedRows);

            if (err) {                 
                printError(err);
                rollbackErrorResponse();   
            } else if (results && results.affectedRows === 1) {
                connection.query({
                    sql: 'UPDATE `profile` SET `following` = following + 1 WHERE `guid` = ?',
                    values: [ followerGuid ]
                }, 
                function (err, results) {
                    console.log("updateCountsToFollow - Update following Rows affected: " + results.affectedRows);
                    if (err) {                 
                        printError(err);
                        rollbackErrorResponse();    
                    } else if (results && results.affectedRows === 1) {
                        console.log("will update notification");
                        
                        addAlbumsToTimelineByUser(followerGuid, beingFollowedGuid);                            
                                   
                    } else {     
                        rollbackErrorResponse();
                    }
                }); 
            } else {     
                rollbackErrorResponse();
            }
        }); 
    }

    function commitFollowRequest() {
        connection.commit(function(err) {
            if (err) {
                printError(err);
                rollbackErrorResponse();
            } else  {
                console.log('successful commit!');
                finalAppResponse( friendActionResponse( 
                    true, Relationship.IsFollowing)
                );
            }
        });
    }

    function commitUnfollowRequest() {
        connection.commit(function(err) {
            if (err) {
                printError(err);
                rollbackErrorResponse();
            } else  {
                console.log('successful commit!');
                finalAppResponse( friendActionResponse( 
                    true, Relationship.NoneExist)
                );
            }
        });   
    }

    /**
     * 
     *  I'm unfollowing a user
     * @param {*} guid 
     * @param {*} friendGuid 
     */


    function updateUnfollowCount(followerGuid, beingFollowedGuid) {
        console.log("updateUnfollowCount");

        connection.query({
            sql: 'UPDATE `profile` SET `followers` = `followers` - 1 WHERE `guid` = ?',
            values: [ beingFollowedGuid ]
        }, 
        function (err, results) {
            console.log("updateUnfollowCount - Update followers Rows affected: " + results.affectedRows);

            if (err) {                 
                printError(err);
                rollbackErrorResponse();   
            } else if (results && results.affectedRows === 1) {

                connection.query({
                    sql: 'UPDATE `profile` SET `following` = following - 1 WHERE `guid` = ?',
                    values: [ followerGuid ]
                }, 
                function (err, results) {
                    if (err) {                 
                        printError(err);
                        rollbackErrorResponse();    
                    } else if (results && results.affectedRows === 1) {       
                        console.log("updateUnfollowCount - Update following Rows affected: " + results.affectedRows);     
                        removeAlbumsFromTimelineByUser(followerGuid, beingFollowedGuid);
                        
                    } else {     
                        rollbackErrorResponse();
                    }
                }); 
            } else {     
                rollbackErrorResponse();
            }
        }); 
    }



        




    // Only need to insert public albums.

    /**
     * 
     * 
        SELECT um.popularity, ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
            FROM album_timeline AS tl 
            INNER JOIN `user_album` AS ua
            ON tl.fguid = ua.guid AND tl.album_id = ua.id 
                INNER JOIN `profile` 
                ON ua.guid = profile.guid 
                    LEFT JOIN album_last_viewed_media AS alvm 
                    ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id 
                        LEFT JOIN user_metrics AS um ON ua.guid = um.guid 
        WHERE tl.guid = ? AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) ORDER BY tl.date DESC LIMIT ?";


        
        INSERT INTO album_timeline (guid, fguid, album_id) 
        SELECT ?, ?, id 
        FROM user_album AS ua 
        WHERE ua.guid = ? AND is_private = 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW())",


        INSERT INTO album_timeline (guid, fguid, album_id) 
        SELECT ?, ?, id 
        FROM user_album AS ua 
            LEFT JOIN album_permissions AS ap
            ON  ap.guid = ? AND ap.fguid = ua.guid AND ap.album_id = ua.id
        WHERE ua.guid = ? AND (is_private = 0 OR ap.fguid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())",


       

        values: [guid, beingFollowedGuid, guid, beingFollowedGuid ] 


     */

    // album_last_viewed_media we can keep around
    // album_permissions isn't used in getting list of albums, but still used in checking permission when 
    // we get the media content


    //  When we unfollow do we delete album permissions? 
    //  If not, when we refollow we have to add these private albums to users timeline

    function addAlbumsToTimelineByUser(guid, beingFollowedGuid) {
        
        //  sql: "INSERT INTO album_timeline (guid, fguid, album_id) SELECT ?, ?, id FROM user_album AS ua WHERE ua.guid = ? AND is_private = 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW())",

        /**
         * 
         INSERT INTO album_timeline (guid, fguid, album_id) 
         SELECT ?, ?, id 
         FROM user_album AS ua 
            LEFT JOIN album_permissions AS ap 
            ON  ap.guid = ? AND ap.fguid = ua.guid AND ap.album_id = ua.id 
        WHERE ua.guid = ? AND (is_private = 0 OR ap.fguid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())",

         */

        connection.query({
            sql: "INSERT INTO album_timeline (guid, fguid, album_id, date) SELECT ?, ?, id, newest_media_timestamp FROM user_album AS ua LEFT JOIN album_permissions AS ap ON  ap.guid = ? AND ap.fguid = ua.guid AND ap.album_id = ua.id WHERE ua.guid = ? AND ua.count > 0 AND (is_private = 0 OR ap.fguid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())",
            values: [guid, beingFollowedGuid, guid, beingFollowedGuid ] 
        }, function(err, result) {
            if (err) {
                printError(err);                
                rollbackErrorResponse();
            } else {
                commitFollowRequest();
            }   
        });
    }

    function removeAlbumsFromTimelineByUser(guid, beingFollowedGuid) {

        console.log("removeAlbumsFromTimelineByUser");
        connection.query({
            sql: "DELETE FROM `album_timeline` WHERE `guid` = ? AND fguid = ?",
            values: [guid, beingFollowedGuid ] 
        }, function(err, result) {
            
            if (err) {
                printError(err);                
                rollbackErrorResponse();
            } else {
                commitUnfollowRequest();
            }   
        });

    }


     /**
      *     Updates the count for the person who is following

        We're accepting a friend request so increase our followers, and their followings
      */
    // function updateCountsForAcceptingFollowRequest(beingFollowedGuid, followerGuid) {
    //     connection.query({
    //         sql: 'UPDATE `profile` SET `following` = following + 1 WHERE `guid` = ?',
    //         values: [ followerGuid ]
    //     }, 
    //     function (err, results) {
    //         if (err) {                 
    //             printError(err);
    //             rollbackErrorResponse();   
    //         } else {
    //             console.log("will update notification");
    
    //             connection.commit(function(err) {
    //                 if (err) {
    //                     printError(err);
    //                     rollbackErrorResponse();
    //                 } else  {
    //                     console.log('successful commit!');
    //                     finalAppResponse( friendActionResponse( 
    //                         true, Relationship.IsFollowing)
    //                     );
    //                 }
    //             });           
    //         }
    //     }); 
    // }

    /**
     * 
     * 
     * 
     * 
     *  guid, fguid, sent
     * guid, fguid, sent
     * 
     *  guid is following friendGuid
     */


    function followNotification(guid, friendGuid) {

        connection.query({
            sql: "INSERT INTO `notifications`(`guid`, `id`, `fguid`, `type`) SELECT ?, coalesce(MAX(`id`) + 1, 0), ?, ? FROM `notifications` WHERE guid = ?",
            values:  [ guid, friendGuid, NotificationType.IsFollowing, guid]
        },
        function (err, results) {
            
            console.log("followNotification insert first");

            if (err) {
                printError(err);
                rollbackErrorResponse();
            } else if (results && results.affectedRows === 1) {
                
                connection.query({
                    sql: "INSERT INTO `notifications`(`guid`, `id`, `fguid`, `type`) SELECT ?,  coalesce(MAX(`id`) + 1, 0), ?, ? FROM `notifications` WHERE guid = ?",
                    values:  [ friendGuid, guid, NotificationType.BeingFollowed, friendGuid]
                },
                function (err, results) {
                    
                    console.log("followNotification insert second");
        
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    } else if (results && results.affectedRows === 1) {
                
                        console.log("updateNotifications result.affectedRows > 0");

                        updateCountsToFollow(guid, friendGuid);

                    } else {
                        console.log("No rows affected?");
                        rollbackErrorResponse();
                    }
                });
            } else {
                rollbackErrorResponse();                
            }
        });


        // //TODO: Check this
        // connection.query({
        //     sql: 'INSERT INTO `notifications` (`guid`, `id`, `fguid`, `type`) VALUES ?',
        //     values:  [
        //         [
        //             [ guid, myLastId, friendGuid, NotificationType.IsFollowing],
        //             [ friendGuid, friendsLastId, guid, NotificationType.BeingFollowed]
        //         ]
        //     ]
        // },
        // function (err, results) {
            
        //     console.log("followNotification results results[0].id");

        //     if (err) {
        //         printError(err);
        //         rollbackErrorResponse();
        //     } else if (results && results.affectedRows === 2) {
                
        //         console.log("updateNotifications result.affectedRows > 0");

        //         updateCountsToFollow(guid, friendGuid);

        //     } else {
        //         console.log("No rows affected?");
        //         rollbackErrorResponse();
        //     }
        // });
    }


    // function followNotification(guid, friendGuid) {

    //     console.log("followNotification, guid: "  + guid + " friendGuid: "  + friendGuid);
    
    //     // See if there is a relationship already
    //     connection.query({
    //         sql: "SELECT `guid`, MAX(`id`) as id FROM `notifications` WHERE `guid` = ? OR `guid` = ? GROUP BY `guid` DESC",
    //         values: [ guid, friendGuid ]
    //     }, 
    //     function (err, results) {
                
    //         if (err) {
    //             printError(err);
    //             rollbackErrorResponse();
    //         } else if (results) {
                
    //             var lastNotificationIds   = getUserNotificationIds(results, guid, friendGuid);
    //             var newMaxIds = nextMaxNotificationIds(lastNotificationIds);

    //             var myLastId      = newMaxIds.id;
    //             var friendsLastId = newMaxIds.fId;

    //             console.log("followNotification -  myLastId    : " + myLastId);
    //             console.log("followNotification - friendsLastId: " + friendsLastId);

    //             //TODO: Check this
    //             connection.query({
    //                 sql: 'INSERT INTO `notifications` (`guid`, `id`, `fguid`, `type`) VALUES ?',
    //                 values:  [
    //                     [
    //                         [ guid, myLastId, friendGuid, NotificationType.IsFollowing],
    //                         [ friendGuid, friendsLastId, guid, NotificationType.BeingFollowed]
    //                     ]
    //                 ]
    //             },
    //             function (err, results) {
        
    //                 console.log("updateNotification results results[0].id");

    //                 if (err) {
    //                     printError(err);
                        
    //                     if (err.code == "ER_DUP_ENTRY" && maxRetries > 0) {
    //                         maxRetries -= 1;
    //                         followNotification(guid, friendGuid);
    //                     } else {
    //                         rollbackErrorResponse();
    //                     }
    //                 }
    //                 if (results && results.affectedRows === 2) {

    //                     console.log("updateNotifications result.affectedRows > 0");


    //                     updateCountsToFollow(guid, friendGuid);

    //                 } else {
    //                     console.log("No rows affected?");
    //                     rollbackErrorResponse();
    //                 }
    //             });
    //         } else {
    //             rollbackErrorResponse();
    //         }
    //     });
    // }






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
     *  If user has privacy enabled, then we make people friends automatically
     * 
     *  Else we send a friend request
     * 
     * guid is following followGuid
     * 
     * 
     *  The relationship is either null or canceled
     */

    function sendFollowRequest(guid, followGuid, overrideRequest) {

        // If user has
        connection.query({
            sql: 'SELECT `is_private` FROM `profile` WHERE guid = ?',
            values: [ followGuid ]
        }, 
        function (err, results) {
            if (err) {                                 
                printError(err);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else if (results && results.length > 0 ) {
                // If auto accept allowed, public account
                if (results[0].is_private === 0) {

                    connection.beginTransaction(function(err) {
                        if (err) { 
                            console.log('Error:', JSON.stringify(err, null, 2));
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        } else {
            
                            console.log("sendFollowRequest public account, ", guid, followGuid, overrideRequest);

                            // See if there is a relationship already
                            // var ab = Relationship.IsFollowing;
                            // console.log("sendFollowRequest Relationship.isfoloing value: " + ab);

                            connection.query({
                                sql: 'INSERT INTO `friends` SET `guid1` = ?, `guid2` = ?, `status` = ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)', 
                                values:  [guid, followGuid, Relationship.IsFollowing]
                            }, 
                            function (err, results) {
                                console.log("sendFollowRequest public function");

                                if (err) {
                                    printError(err);
                                    rollbackErrorResponse();    
                                } else {
                                    console.log("will call sendFollowRequestNotifications");
                                    followNotification(guid, followGuid); 
                                }
                            });
                        }
                    });
                } else {
                    // Send a request for private account
                    connection.beginTransaction(function(err) {
                        if (err) { 
                            console.log('Error:', JSON.stringify(err, null, 2));
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        } else {
                            console.log("sendFollowRequest private accoun start", guid, followGuid, overrideRequest);

                            connection.query({
                                sql: 'INSERT INTO `friends` SET `guid1` = ?, `guid2` = ?, `status` = ? ON DUPLICATE KEY UPDATE `status` = VALUES(status)', 
                                values: [guid, followGuid, Relationship.FollowRequested]
                            }, 
                            function (err, results) {
                                console.log("sendFollowRequest private function");

                                if (err) {
                                    printError(err);                                    
                                    console.log("sendFollowRequest maxretires used up?");
                                    rollbackErrorResponse();
                                  
                                } else {
                                    console.log("will call sendFollowRequestNotifications");
                                    sendFollowRequestNotifications(guid, followGuid, false);
                                }
                            });
                        }
                    });
                }
            } else {
                finalAppResponse(errorResponse( ErrorMessageGeneric));                
            }
        });
    }





    /**
     * guid is allowing followerGuid to follow
     * i.e.  followerGuid is following guid
     */

    function acceptFollowRequest(guid, followerGuid) {
   
        // Confirm we received a request 
   
        connection.beginTransaction(function(err) {
            if (err) { 
                console.log('Error:', JSON.stringify(err, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {                
                connection.query({
                    sql: 'UPDATE `friends` set `status` = ? WHERE `guid1` = ? AND `guid2` = ?',
                    values: [ Relationship.IsFollowing, followerGuid, guid]
                }, 
                function (err, results) {
                    if (err) {                 
                        printError(err);
                        rollbackErrorResponse();  
                    } else {
                        console.log("will update notification");
                        updateAcceptFollowNotification(guid, followerGuid);
                    }
                }); 
            }
        }); 
    }






    // guid is unfollowing friendGuid
    function unfollowRequest(guid, friendGuid, relationship) {

        console.log("unfollowRequest");

        connection.beginTransaction(function(err) {
            if (err) { 
                printError(err);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {
                connection.query({
                    sql: 'UPDATE `friends` SET `status` = ?, `cancel_count` = `cancel_count` + 1 WHERE `guid1` = ? AND `guid2` = ?',
                    values: [ Relationship.CanceledFollowRequest, guid, friendGuid ]
                }, 
                function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    } 
                    
                    if (results !== null && results.affectedRows === 1) {
                        unfollowNotifications(guid, friendGuid, relationship);
                    } else {
                        rollbackErrorResponse();
                    }
                });
            }
        });
    }

    


    function checkIfFollowRelationshipExists(guid, fguid, action) {
         
        console.log("checkFollowRelationship");

        // If we are FriendAction.Follow or Unfollow
        var beingFollowedGuid = fguid;
        var followerGuid      = guid;

        if ( action === FriendAction.Accept || action === FriendAction.Block ||  action === FriendAction.Unblock) {
            beingFollowedGuid = guid;
            followerGuid      = fguid;
        }
        

        var query = connection.query({          // follower    // being followed
            sql: 'SELECT * FROM `friends` WHERE `guid1` = ? AND `guid2` = ?',
            values: [followerGuid, beingFollowedGuid]
        }, 
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }

            // If has Relationship
            if (results) {

                var status     = null;
                var blocked    = false;
                var cancelInfo = [];
                

                if ( results.length > 0) {
                    console.log('Results:', JSON.stringify(results, null, 2));

                    status        = results[0].status;
                    blocked       = results[0].blocked;
                    cancelInfo[0] = results[0].cancel_count;
                    cancelInfo[1] = results[0].timestamp;
                }


                if ( action === FriendAction.Accept) {
                  
                    processAcceptFollowRequest(guid, fguid, status);
                
                } else if ( action === FriendAction.Follow ) {
                   
                    processFollowUserRequest(guid, fguid, status, cancelInfo);
                    
                } else if ( action === FriendAction.Unfollow ) {
                    
                    processUnfollowRequest(guid, fguid, status);

                } else if ( action === FriendAction.Block ) {
                     

                    processBlockRequest(guid, fguid, status, blocked);

                } else if ( action === FriendAction.Unblock ) {
                    
                    processUnblockRequest(guid, fguid, status, blocked);


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
     *                  UN/BLOCKING   ACTIONS
     * 
     *  ====================================================================
     *  ====================================================================
     */

  

    function processUnblockRequest(guid, friendGuid, relationship, isBlocked){
            console.log("processUnblockRequest");
       
        if ( relationship === null) {
            finalAppResponse( friendActionResponse( 
                false, Relationship.NoneExist, false)
            );
        } else if (relationship === Relationship.IsFollowing && isBlocked === BlockedStatus.Blocked) {
         
            unblockRequest(guid, friendGuid );       

        } else {
            finalAppResponse( friendActionResponse( 
                true, relationship, isBlocked)
            );
        }
    }


    function unblockRequest(guid, friendGuidToUnblock) {
        console.log("unblockRequest");
        connection.beginTransaction(function(err) {
            if (err) { 
                console.log('Error:', JSON.stringify(err, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {
                connection.query({
                    sql: 'UPDATE `friends` SET `blocked` = ? WHERE `guid1` = ? AND `guid2` = ?',
                    values: [ BlockedStatus.None, friendGuidToUnblock, guid ]
                },
                function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    } else if (results && results.affectedRows == 1) {
                        updateUnblockedUserNotification(guid, friendGuidToUnblock);
                    } else {
                        rollbackErrorResponse();                    
                    }
                });
            }
        });
    }


    // Only update the user that blocked follower
    function updateUnblockedUserNotification(guid, followerGuid) {
        console.log("updateUnblockedUserNotification, guid: "  + guid + " followerGuid: "  + followerGuid);

        connection.query({
            sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND fguid = ? AND type = ?",
            values: [ NotificationType.BeingFollowed, guid, followerGuid, NotificationType.BlockedUser ]
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                rollbackErrorResponse();
            }
            if (results.affectedRows == 1) {
                console.log("updateNotifications result.affectedRows > 0");
                connection.commit(function(err) {
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    } else  {
                        console.log('successful commit!');        
                        finalAppResponse( friendActionResponse( 
                            true, Relationship.IsFollowing, false)
                        );
                    }
                });
            } else {
                rollbackErrorResponse();
            }
        });
    }


    function relationshipValue(type) {
        switch (type) {
            case 0: return "Unknown";
            case 1: return "NoneExist";
            case 2: return "FollowRequested";
            case 3: return "IsFollowing";
            case 4: return "BlockedUser";
            case 5: return "CanceledFollowRequest";
            default: return "Error";
        }
    }


    // Block user, 
    function processBlockRequest(guid, friendGuid, relationship, isBlocked) {
            console.log("processBlockRequest - Relationship is: " + relationshipValue(relationship));
       
        if ( relationship === null) {
            finalAppResponse( friendActionResponse( 
                false, Relationship.NoneExist)
            );
        } else if (relationship === Relationship.IsFollowing && isBlocked === BlockedStatus.None) {

            blockRequest(guid, friendGuid );       

        } else {

            finalAppResponse( friendActionResponse( 
                false, relationship, isBlocked)
            );
        }
    }

    function blockRequest(guid, friendGuidToBlock) {
        console.log("blockRequest");
 
        connection.beginTransaction(function(err) {
            if (err) { 
                console.log('Error:', JSON.stringify(err, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            } else {
                connection.query({ 
                    sql: 'UPDATE `friends` SET `blocked` = ? WHERE `guid1` = ? AND `guid2` = ?',
                    values: [ BlockedStatus.Blocked, friendGuidToBlock, guid ]
                },
                function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    } else if (results && results.affectedRows == 1) {
                            updateBlockedUserNotification(guid, friendGuidToBlock);
                    } else {
                        rollbackErrorResponse();                    
                    }
                });
            }
        });
    }

    // Only update the user that blocked follower
    function updateBlockedUserNotification(guid, followerGuid) {
        
        console.log("updateNotification, guid: "  + guid + " followerGuid: "  + followerGuid);
                    
        connection.query({
            sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND fguid = ? AND type = ?",
            values: [ NotificationType.BlockedUser, guid, followerGuid, NotificationType.BeingFollowed ]
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                rollbackErrorResponse();
            }
            if (results.affectedRows == 1) {
                console.log("updateNotifications result.affectedRows > 0");
                connection.commit(function(err) {
                    if (err) {
                        printError(err);
                        rollbackErrorResponse();
                    } else  {
                        console.log('successful commit!');        
                        finalAppResponse( friendActionResponse( 
                            true, Relationship.IsFollowing, BlockedStatus.Blocked)
                        );
                    }
                });
            } else {
                rollbackErrorResponse();
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
                finalAppResponse(errorResponse( "You like playing games? So do we. Try again tomorrow."));
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
        
        } else if (relationship === Relationship.FollowRequested) {
        
            console.log("processRequest: Action = " + FriendAction.Accept + ", calling acceptFollowRequest");
            // Accept friend recommendation
            acceptFollowRequest(guid, friendGuid);

        } else if (relationship === Relationship.IsFollowing ) {
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
       
        if ( relationship === null || relationship === Relationship.CanceledFollowRequest) {
            console.log("processRequest: Action =  FriendAction.Unfollow, calling ");

            finalAppResponse( friendActionResponse( 
                true, Relationship.NoneExist)
            );
            // IF either one of us canceled, then how many times? and how long ago?
        } else if ( relationship === Relationship.FollowRequested || relationship == Relationship.IsFollowing) {
            console.log("myRelationship == Relationship.FollowRequested");
            console.log("myRelationship == Relationship.IsFollowing");
            
            unfollowRequest(guid, friendGuid, relationship);

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

    /**
     *  guid1 is following guid2
     */
    //  guid1 = follower, guid2 = beingFollowed
    // I can add people to send to who are following me. 
    // People I follow, I can only view, but not send anything.


    /** Get people following me */

    function getFollowers(guid, lastUsername) {
        printTimeForEvent("getFollowers: Get people following me");
        
        /**
         * 
         *  SELECT `friends`.`guid1` AS guid, `friends`.`status` AS status, `friends`.`blocked` AS blocked, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
         *  FROM `friends` 
         *      INNER JOIN `profile` 
         *      ON `friends`.`guid1` = `profile`.`guid` 
         *  WHERE `friends`.`guid2` = ? AND `status` = ?
         *  ORDER BY `username` 
         *  LIMIT 60";
         */

/*

    SELECT `usersearch`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings 
    FROM `usersearch` 
        INNER JOIN `profile` 
        ON `usersearch`.`guid` = `profile`.`guid` 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
    WHERE usersearch.`keyword` = ? ORDER BY user_metrics.`popularity` DESC LIMIT 60';


    
    

SELECT username, friends.`status`,  f2.`status`
FROM `friends` 
	INNER JOIN `profile` 
	ON `friends`.`guid1` = `profile`.`guid` 
    
        * If I'm following them *
    
        LEFT JOIN friends AS f2
        ON f2.`guid1` = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd-2a2e929e' AND  f2.`guid2`= `profile`.`guid` 

WHERE `friends`.`guid2` = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd-2a2e929e' AND (friends.`status` = 3 OR friends.`status` = 2) 



    SELECT `profile`.guid, f2.`status` AS followed_status, f2.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings 
    FROM `friends` 
        INNER JOIN `profile` 
        ON `friends`.`guid1` = `profile`.`guid` 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
                LEFT JOIN `friends` as f2
                ON f2.guid1 = ? AND f2.guid2 = profile.guid 
    WHERE `friends`.`guid2` = ?
    ORDER BY `username` ASC 
    LIMIT 60";

    */

    
        var friendsSql = "SELECT `profile`.guid, f2.status AS followed_status, f2.blocked AS blocked_status, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid1` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` as f2 ON f2.guid1 = ? AND f2.guid2 = profile.guid WHERE `friends`.`guid2` = ? ORDER BY `username` ASC LIMIT 60";

        // var friendsSql = "SELECT `profile`.guid, `friends`.`status` AS followed_status, `friends`.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid1` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid2` = ? AND `status` = ? ORDER BY `username` ASC LIMIT 60";
        var parameters = [ guid , guid];

        if (isStringWithLength(lastUsername)) {
        
            friendsSql = "SELECT `profile`.guid, `friends`.`status` AS followed_status, `friends`.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid1` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid2` = ? AND `status` = ? AND username > ? ORDER BY `username` LIMIT 60";            
            parameters = [ guid , Relationship.IsFollowing, lastUsername];
        }
            
        
        /**
         * Result contains friends info as ( guid, status, blocked, username, fullname
         */
        connection.query({
            sql   : friendsSql,
            values: parameters,
        }, 
        function (error, results, fields) {

            printTimeForEvent("End getting Friends");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse( ErrorMessageGeneric))
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                
                var friends  = followerResults(results);

                var response = listFriendsResponse(friends);
                
                printTimeForEvent("getFriends close to end of function");

                finalAppResponse( response);

                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }

    

/**
 * 
 *  People can block  PMs, and people viewing their public albums if they follower
 *  If we be followed 
 */


    /**
     * 

    SELECT `friends`.`status` AS following_status, `friends`.`guid1` AS guid, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings,
    FROM `friends` 
        INNER JOIN `profile` 
        ON `friends`.`guid2` = `profile`.`guid` 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
    WHERE `friends`.`guid1` = ? AND (`status` = ? OR `status` = ?) 
    ORDER BY `username` 
    LIMIT 60";


    SELECT `friends`.`status` AS following_status, `friends`.`guid1` AS guid, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid2` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid1` = ? AND (`status` = ? OR `status` = ?) ORDER BY `username` LIMIT 60";



    SELECT `friends`.`status` AS followed_status, f2.blocked AS blocked_status,`friends`.`guid2` AS guid, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings 
    FROM `friends` 
        INNER JOIN `profile` 
        ON `friends`.`guid2` = `profile`.`guid` 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 

                LEFT JOIN `friends` AS f2 ON f2.guid1 = `profile`.`guid` AND f2.guid2 = ? AND status = ?
        

    WHERE `friends`.`guid1` = ? AND (`status` = ? OR `status` = ?) 
    ORDER BY `username` LIMIT 60";



    f2.status AS followed_status, f2.blocked AS blocked_status,


    SELECT `friends`.`status` AS followed_status, f2.blocked AS blocked_status, `friends`.`guid2` AS guid, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings 
    FROM `friends` 
        INNER JOIN `profile` 
        ON `friends`.`guid2` = `profile`.`guid` 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
                LEFT JOIN `friends` AS f2 
                ON f2.guid1 = `profile`.`guid` AND f2.guid2 = ? AND status = ?
    WHERE `friends`.`guid1` = ? AND (`status` = ? OR `status` = ?) 
    ORDER BY `username` 
    LIMIT 60



    
    
    
    Userface - name Following

    * If they are following me *
    
SELECT username, friends.`status`,  f2.`status`
FROM `friends` 
	INNER JOIN `profile` 
	ON `friends`.`guid1` = `profile`.`guid` 
    
        * If I'm following them *
    
        LEFT JOIN friends AS f2
        ON f2.`guid1` = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd-2a2e929e' AND  f2.`guid2`= `profile`.`guid` 
WHERE `friends`.`guid2` = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd-2a2e929e' AND (friends.`status` = 3 OR friends.`status` = 2) 


        * 
        */

    /**
     *  Get the people I'm following
     */
    function getFollowings(guid, lastUsername) {
        console.log("getFollowings");
        
        var friendsSql = "SELECT `friends`.`status` AS followed_status, f2.blocked AS blocked_status, `friends`.`guid2` AS guid, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid2` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` AS f2 ON f2.guid1 = `profile`.`guid` AND f2.guid2 = ? AND f2.`status` = ? WHERE `friends`.`guid1` = ? AND (friends.`status` = ? OR friends.`status` = ?) ORDER BY `username` LIMIT 60";
        var parameters = [ guid , Relationship.IsFollowing, guid , Relationship.IsFollowing, Relationship.FollowRequested];

        if (isStringWithLength(lastUsername)) {
            friendsSql = "SELECT `friends`.`status` AS followed_status,  f2.blocked AS blocked_status,`friends`.`guid2` AS guid, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid2` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid1` = ? AND (`status` = ? OR `status` = ?) AND username > ? ORDER BY `username` LIMIT 60";
            parameters = [ guid , Relationship.IsFollowing, Relationship.FollowRequested, lastUsername];
        }
        
        connection.query({
            sql   : friendsSql,
            values: parameters,
        }, 
        function (error, results, fields) {

            printTimeForEvent("End getting followings");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse( ErrorMessageGeneric))
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                

                var friends  = followerResults(results);

                // var friends = []; 

                // results.forEach((result) => {
                //     console.log(result);
                
                    
                //     var userInfo = {};
                    
                //     var friend = {};
                //     friend[kGuid]            = result.guid;
                //     friend[kUserName]        = result.username;
                //     friend[kFullName]        = result.fullname;
                //     friend[kFollowingStatus] = result.following_status;

                //     friend[kAbout]      = result.about;
                //     friend[kDomain]     = result.domain;


                //     friend[kPrivate]        = intToBool(result.is_private);
                //     friend[kVerified]       = intToBool(result.verified);

                //     friend[kProfileUrl]     = result.image_url;

                //     friend[kAllowFollowersView]  = intToBool(result.allow_view_followers);
                //     friend[kAllowFollowingsView] = intToBool(result.allow_view_followings);

                //     friend[kFollowersCount] = result.followers;
                //     friend[kFollowingCount] = result.following;
                //     friend[kScore]          = result.popularity === null ? 0 : result.popularity;



                //     friends.push(friend);
                // });
                
                var response = listFriendsResponse(friends);
                
                printTimeForEvent("getFriends close to end of function");

                finalAppResponse( response);

                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }



      /** Get people following me */

    // lastFname: is the last name we have in our table list
    function getFollowersList(guid) {

        getFollowers(guid, lastFname);
    }

    /** Get people I'm following */
    function getFollowingList(guid) {
        
        getFollowings(guid, lastFname);
    }
    




    function followerResults(results) {

        var friends = []; 

        results.forEach((result) => {
            console.log(result);
        

            var friend = {};
            

            friend[kGuid]            = result.guid;
            friend[kUserName]        = result.username;
            friend[kFullName]        = result.fullname;

            friend[kAbout]           = result.about;
            friend[kDomain]          = result.domain;
            
            friend[kPrivate]        = intToBool(result.is_private);
            friend[kVerified]       = intToBool(result.verified);


            // f2.status AS followed_status, 
            // f2.blocked AS blocked_status,


            let followStatus = result.followed_status;

            // friend[kFollowedStatus]   = result.followed_status;
            // friend[kFollowingStatus]  = result.followed_status;


            if (followStatus === undefined || followStatus === null) {
                friend[kFollowingStatus]  = Relationship.NoneExist
          
            } else if ( followStatus ===  Relationship.IsFollowing || followStatus ===  Relationship.FollowRequested) {
            
                friend[kFollowingStatus]  = followStatus
            
            } else {
                friend[kFollowingStatus]  = Relationship.NoneExist

            }
            
            var blockedUser = false;
            if (result.blocked_status === BlockedStatus.Blocked) {
                blockedUser = true;
            }
            friend[kBlocked]        = blockedUser;


            friend[kProfileUrl]     = result.image_url;

            friend[kAllowFollowersView]  = intToBool(result.allow_view_followers);
            friend[kAllowFollowingsView] = intToBool(result.allow_view_followings);


            friend[kFollowersCount] = result.followers;
            friend[kFollowingCount] = result.following;
            friend[kScore]          = result.popularity === null ? 0 : result.popularity;

            friends.push(friend);
        });
        
        return friends;
    }



    function isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
    }


    function intToBool(val) {
        if (!isInt(val) ) return false;
        return val === 0 ? false : true;
    }

    function isBoolean(val) {
        return typeof(val) === "boolean";
    }

    function isStringWithLength(word) {
        return typeof word === 'string' && word.length > 0;
    }





    /**
     * 
    ****** FOLLOWERS *****

    First check if we have access

    `profile`.allow_view_followings


    SELECT profile.is_private, `profile`.allow_view_followers, friends.`status`, friends.blocked
    FROM `profile` 
        LEFT JOIN `friends` 
        ON guid1 = ? AND friends.guid2 = profile.guid
    WHERE guid = ?



    SELECT profile.is_private, `profile`.allow_view_followers, friends.`status`, friends.blocked
    FROM `profile` 
        LEFT JOIN `friends` 
        ON friends.guid2 = profile.guid -- AND friends.`status` = 3
    WHERE guid = 'c8a66a2b-c26d-4d3c-97ea-da1228dbc91c-bf83af68' AND guid1 = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd-2a2e929e'



    if profile.is_private {

        if profile`.allow_view_followers == true && is friends and notBlocked? {
            show followers
        }


     // public and allows
    } else if !profile.is_private && profile`.allow_view_followers == true {
        
        show followers
    } else {
        user does not have access
    }

    

    SELECT profile.is_private AS user_is_private , friends.status AS follow_status, friends.blocked AS is_blocked
    FROM profile
        LEFT JOIN friends 
        ON friends.guid2 = ua.guid AND friends.guid1 = ? AND friends.`status` = ? 
         
    WHERE ua.guid = ? AND ua.id = ?",











    SELECT `profile`.guid, `friends`.`status` AS followed_status, `friends`.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings 
    FROM `profile`
        INNER JOIN `friends` 
        ON `friends`.`guid1` = `profile`.`guid` AND `status` = ? 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
    WHERE `friends`.`guid2` = ?
    ORDER BY `username` ASC 
    LIMIT 60";

    param = [status, fguid, ]

    
    
    SELECT `profile`.guid, `friends`.`status` AS followed_status, `friends`.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings
    FROM `friends` 
        INNER JOIN `profile` 
        ON `friends`.`guid1` = `profile`.`guid` 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
    WHERE `friends`.`guid2` = ? AND `status` = ? AND username > ? ORDER BY `username` LIMIT 60";            


    SELECT `profile`.guid, `friends`.`status` AS followed_status, `friends`.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings 
    FROM `friends` 
        INNER JOIN `profile` 
        ON `friends`.`guid1` = `profile`.`guid` 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 

    WHERE `friends`.`guid2` = ? AND profile.is_private =  `status` = ? 
    ORDER BY `username` ASC 
    LIMIT 60";


     */




    let kAccess = "access";

    function accessDeniedResponse() {
       var response = {};
       response[kActive] = ActiveValues.Active;
       response[kAccess] = false;
       return response;
   }

    function checkUserAccessPermissionFriendsList(sqlQuery, parameters, followers, callback) {
        console.log("checkUserAccessPermissionFriendsList");

        connection.query({
            sql   : sqlQuery,
            values: parameters,
        }, 
        function (error, results, fields) {

            printTimeForEvent("End getting Friends");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse( ErrorMessageGeneric))
            } 

            console.log('Results:', JSON.stringify(results, null, 2));

            // If has Relationship
            if (results &&  results.length > 0) {
                
                var status     = results[0].status;
                var blocked    = intToBool(results[0].blocked);
                var isPrivate  = intToBool(results[0].is_private);
                var allowView  = followers ? intToBool(results[0].allow_view_followers) : intToBool(results[0].allow_view_followings) ;
               
                
                if (isPrivate && allowView && status === Relationship.IsFollowing && !blocked  ) {
                    
                    // show followers 
                    callback(true);
                    // getUsersFollowers(fguid, guid);
                    
                } else if (!isPrivate && allowView) {
                    
                    // show followers 
                    callback(true);
                    // getUsersFollowers(fguid, guid);
                
                } else {
                    // access denied
                    callback(false);
                    // finalAppResponse( accessDeniedResponse() );
                }
            } else {
                printTimeForEvent("No resutls");

                callback(false);
            }
        });
    }


    
    /**
     * 
     
    SELECT profile.is_private, `profile`.allow_view_followings, friends.`status`, friends.blocked 
    FROM `profile` 
        LEFT JOIN `friends` 
        ON guid1 = ? AND friends.guid2 = profile.guid 
    WHERE guid = ?";



     */
    function checkUserAccessPermissionToViewUsersFollowings(fguid, guid) {
        console.log("checkUserAccessPermissionToViewUsersFollowings");

       
        

        // if (guid === fguid) {

        // }
        

       
        
        var sqlQuery = "SELECT profile.is_private, `profile`.allow_view_followings, friends.`status`, friends.blocked FROM `profile` LEFT JOIN `friends` ON guid1 = ? AND friends.guid2 = profile.guid WHERE guid = ?";
        var parameters = [guid , fguid];

        checkUserAccessPermissionFriendsList(sqlQuery, parameters, false, function(hasPermission) {
            
            if (hasPermission) { 
                // show followers 

                getUsersFollowings(fguid, guid, lastFname);
            } else {
                // access denied
                finalAppResponse( accessDeniedResponse() );
            }
        });
    }

     
    // SELECT profile.is_private, `profile`.allow_view_followers, friends.`status`, friends.blocked
    //  FROM `profile` 
    //  LEFT JOIN `friends` ON guid1 = ? AND friends.guid2 = profile.guid 
    //  WHERE guid = ?";


    function checkUserAccessPermissionToViewUsersFollowers(fguid, guid) {
        console.log("checkUserAccessPermissionToViewUsersFollowers");

        var sqlQuery = "SELECT profile.is_private, `profile`.allow_view_followers, friends.`status`, friends.blocked FROM `profile` LEFT JOIN `friends` ON guid1 = ? AND friends.guid2 = profile.guid WHERE guid = ?";
        var parameters = [guid , fguid];

        checkUserAccessPermissionFriendsList(sqlQuery, parameters, true, function(hasPermission) {
            
            console.log("checkUserAccessPermissionToViewUsersFollowers ok");

            if (hasPermission) { 
                // show followers 
                getUsersFollowers(fguid, guid, lastFname);
            } else {
                // access denied
                finalAppResponse( accessDeniedResponse() );
            }
        });
     }



     /**
      * 
    SELECT `profile`.guid, f2.status AS followed_status, f2.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings
    FROM `profile` 
        INNER JOIN `friends`
        ON `friends`.`guid2` = `profile`.`guid` AND `status` = ? AND profile.allow_view_me_followings_list = 1
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
                LEFT JOIN `friends` as f2
                ON f2.guid1 = ? AND f2.guid2 = profile.guid 
    
    WHERE `friends`.`guid1` = ? 
    ORDER BY `username` ASC 
    LIMIT 60";


     
     
      */

      /** Get people user is following */
    function getUsersFollowings(fguid, guid, lastUsername) {

        var query = "SELECT `profile`.guid ,  f2.`status` AS followed_status, f2.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `profile` INNER JOIN `friends` ON `friends`.`guid2` = `profile`.`guid` AND `status` = ? AND profile.allow_view_me_followings_list = 1 LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` as f2 ON f2.guid1 = ? AND f2.guid2 = profile.guid WHERE `friends`.`guid1` = ? ORDER BY `username` ASC LIMIT 60";
        var parameters = [ Relationship.IsFollowing, guid, fguid];

        if (isStringWithLength(lastUsername)) {
        
            query = "SELECT `profile`.guid, f2.`status` AS followed_status, f2.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `profile` INNER JOIN `friends` ON `friends`.`guid2` = `profile`.`guid` AND `status` = ? AND profile.allow_view_me_followings_list = 1 LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` as f2 ON f2.guid1 = ? AND f2.guid2 = profile.guid WHERE `friends`.`guid1` = ? AND username > ? ORDER BY `username` ASC LIMIT 60";
            parameters = [ Relationship.IsFollowing, guid, fguid, lastUsername];
        }

        /**
         * Result contains friends info as ( guid, status, blocked, username, fullname
         */
        connection.query({
            sql   : query,
            values: parameters,
        }, 
        function (error, results, fields) {

            printTimeForEvent("End getting Friends");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse( ErrorMessageGeneric))
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                
                var friends  = followerResults(results);

                var response = listFriendsResponse(friends);
                
                printTimeForEvent("getFriends close to end of function");

                finalAppResponse( response);

                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }




    /**
    SELECT `profile`.guid, f2.`status` AS followed_status, f2.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings 
    FROM `profile` 
        INNER JOIN `friends` 
        ON `friends`.`guid1` = `profile`.`guid` AND `status` = ? AND profile.allow_view_me_followers_list = 1
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
                LEFT JOIN `friends` as f2 
                ON f2.guid1 = ? AND f2.guid2 = profile.guid 
    WHERE `friends`.`guid2` = ? 
    ORDER BY `username` ASC LIMIT 60";


     */

    /** Get followers of other person */
    function getUsersFollowers(fguid, guid, lastUsername) {

        var query = "SELECT `profile`.guid, f2.`status` AS followed_status, f2.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `profile` INNER JOIN `friends` ON `friends`.`guid1` = `profile`.`guid` AND `status` = ? profile.allow_view_me_followers_list = 1 LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` as f2 ON f2.guid1 = ? AND f2.guid2 = profile.guid WHERE `friends`.`guid2` = ? ORDER BY `username` ASC LIMIT 60";
        var parameters = [ Relationship.IsFollowing, guid, fguid];

        if (isStringWithLength(lastUsername)) {
        
            query = "SELECT `profile`.guid, f2.`status` AS followed_status, f2.blocked, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `profile` INNER JOIN `friends` ON `friends`.`guid1` = `profile`.`guid` AND `status` = ? profile.allow_view_me_followers_list = 1 LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` as f2 ON f2.guid1 = ? AND f2.guid2 = profile.guid WHERE `friends`.`guid2` = ? AND username > ? ORDER BY `username` ASC LIMIT 60";
            parameters = [ Relationship.IsFollowing, guid, fguid, lastUsername];
        }

        /**
         * Result contains friends info as ( guid, status, blocked, username, fullname
         */
        connection.query({
            sql   : query,
            values: parameters,
        }, 
        function (error, results, fields) {

            printTimeForEvent("End getting Friends");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse( ErrorMessageGeneric))
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                
                var friends  = followerResults(results);

                var response = listFriendsResponse(friends);
                
                printTimeForEvent("getFriends close to end of function");

                finalAppResponse( response);

                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }

    

                    

    function getFollowersForAlbum(guid, albumId) {

        
        if (!isStringWithLength(albumId) ) {
            finalAppResponse( errorResponse( errorMessage));
            return;
        }

        getFollowersForAlbum(guid, albumId, lastFname);
    }

/**
 * 
 *  SELECT `friends`.`guid1` AS guid, `friends`.`status` AS status, `friends`.`blocked` AS blocked, 
 *          `profile`.`username` AS username, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, `profile`.image_url AS image_url,
 *          ap.guid IS NOT NULL AS is_follower
 *  FROM `friends` 
 *      INNER JOIN `profile` 
 *      ON `friends`.`guid1` = `profile`.`guid` 
 *          LEFT JOIN album_permissions as ap 
 *          ON ap.guid = `friends`.`guid1`AND ap.fguid = ? AND album_id = ?
 *  WHERE `friends`.`guid2` = ? AND `status` = ? 
 *  ORDER BY `username`";
 * 
 * 
 * 
 * 

     SELECT `friends`.`guid1` AS guid, `friends`.`status` AS status, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified,  profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, ap.guid IS NOT NULL AS is_selected 


     SELECT `friends`.`status` AS followed_status, `friends`.`guid1` AS guid, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings,
    FROM `friends` 
        INNER JOIN `profile` 
        ON `friends`.`guid1` = `profile`.`guid` 
            INNER JOIN album_permissions AS ap 
            ON ap.guid = `friends`.`guid1`AND ap.fguid = `friends`.`guid2` AND album_id = ?
                LEFT JOIN user_metrics 
                ON user_metrics.guid = profile.guid 
    WHERE `friends`.`guid2` = ? AND  `status` = ? 
    ORDER BY `username` ASC 
    LIMIT 60";


    
    

 */


    // Thi should only be for private albums:

        //TODO: Confirm albumId of user
        function getFollowersForAlbum(guid, albumId, lastUsername) {

            printTimeForEvent("getFriendsForAlbum");
    
            var friendsSql = "SELECT `friends`.`guid1` AS guid, `friends`.`status` AS followed_status, `friends`.`blocked`, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid1` = `profile`.`guid` INNER JOIN album_permissions AS ap ON ap.guid = `friends`.`guid1`AND ap.fguid = `friends`.`guid2` AND album_id = ? LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid2` = ? AND  `status` = ? ORDER BY `username` ASC LIMIT 60";
            var parameters = [ guid , albumId, guid, Relationship.IsFollowing];
    
            if (isStringWithLength(lastUsername)) {
                friendsSql = "SELECT `friends`.`guid1` AS guid, `friends`.`status` AS followed_status, `friends`.`blocked`, `profile`.`username`,  profile.`fullname`, profile.followers, profile.following, user_metrics.popularity,  `profile`.`verified`, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url, `profile`.allow_view_followers, `profile`.allow_view_followings FROM `friends` INNER JOIN `profile` ON `friends`.`guid1` = `profile`.`guid` INNER JOIN album_permissions AS ap ON ap.guid = `friends`.`guid1`AND ap.fguid = `friends`.`guid2` AND album_id = ? LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid2` = ? AND  `status` = ?  AND username > ? ORDER BY `username` ASC LIMIT 60";
                parameters = [ guid , albumId, guid, Relationship.IsFollowing, lastUsername];
            }
            
            var query = connection.query({
                sql   : friendsSql,
                values: parameters
            }, 
            function (err, results, fields) {
    
                if (err) {
                    printError(err);
                    finalAppResponse(errorResponse( ErrorMessageGeneric))
                } else {
                    console.log('Result:', JSON.stringify(results, null, 2));
    
                    var friends = [];
                    results.forEach((result) => {
                        console.log(result);
                      
    
                        var friend = {};
                        friend[kGuid]              = result.guid;
                        friend[kUserName]          = result.username;
                        friend[kFullName]          = result.fullname;
                        friend[kFollowedStatus]    = result.followed_status;
                        friend[kSelectedFriends]   = intToBool(result.is_selected);
                        
    
                        friend[kAbout]             = result.about;
                        friend[kDomain]            = result.domain;
    
                        friend[kPrivate]         = intToBool(result.is_private);
                        friend[kVerified]        = intToBool(result.verified);
    
                        var blockedUser = false;
                        if (result.blocked == BlockedStatus.Blocked) {
                            blockedUser = true;
                        }
                        friend[kBlocked]         = blockedUser;
    
                        friend[kProfileUrl]      = result.image_url;
    
                        friend[kAllowFollowersView]  = intToBool(result.allow_view_followers);
                        friend[kAllowFollowingsView] = intToBool(result.allow_view_followings);
    
                        friend[kFollowersCount] = result.followers;
                        friend[kFollowingCount] = result.following;
                        friend[kScore]          = result.popularity === null ? 0 : result.popularity;
    
                        friends.push(friend);
                    });
                    
                    var response = listFriendsResponse(friends);
                    
                    printTimeForEvent("getFriends close to end of function");
    
                    finalAppResponse( response);
                }
            });
        }
    


    

    // If I'm following them
    function followStatus(myGuid, beingFollowedGuid) {

        connection.query({          // follower    // being followed
            sql: 'SELECT status, cancel_count, timestamp FROM `friends` WHERE `guid1` = ? AND `guid2` = ?',
            values: [myGuid, beingFollowedGuid]
        }, 
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }

            // If has Relationship
            if (results &&  results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));

                var status     = results[0].status;
                // var blocked    = results[0].blocked;
                var cancelInfo = [];
                
                cancelInfo[0] = results[0].cancel_count;
                cancelInfo[1] = results[0].timestamp;


                finalAppResponse(followingStatusResponse(status));
            

            } else {
                finalAppResponse(followingStatusResponse(Relationship.NoneExist));
            }
        });
    }


    // If they're following me
    function followerStatus(followerGuid, myGuid) {

        connection.query({          // follower    // being followed
            sql: 'SELECT * FROM `friends` WHERE `guid1` = ? AND `guid2` = ?',
            values: [followerGuid, myGuid]
        }, 
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }

            // If has Relationship
            if (results &&  results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));

                var status     = results[0].status;
                var blocked    = results[0].blocked;
                var cancelInfo = [];
                
                cancelInfo[0] = results[0].cancel_count;
                cancelInfo[1] = results[0].timestamp;


                finalAppResponse(followerStatusResponse(status, blocked));
            

            } else {
                finalAppResponse(followerStatusResponse(Relationship.NoneExist));
            }
        });
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
                console.log('pathParams: ' +  pathParams);
            

                if ( pathParams.startsWith("/friends/list") ) {

                    if (isStringWithLength(lastFname) ) {
                        lastFname = lastFname.toLowerCase();
                        let errorMessage =  isInvalidUsername(lastFname);
                        if (errorMessage !== null ) {
                            finalAppResponse( errorResponse( errorMessage));
                            return;
                        }
                    }

                    if ( pathParams.startsWith("/friends/list/user") ) {

                        if (!isStringWithLength(friendGuid) ) {
                           
                            finalAppResponse(errorResponse( ErrorMessageGeneric));
                        
                        } else {
                           
                            if ( pathParams.localeCompare("/friends/list/user/followings") == 0 ) {
                          
                                checkUserAccessPermissionToViewUsersFollowings(friendGuid, guid);
                          
                            } else if ( pathParams.localeCompare("/friends/list/user/followers") == 0 ) {
                          
                                // Get followers of our album
                                checkUserAccessPermissionToViewUsersFollowers(friendGuid, guid);
                     
                            }
                        } 
                        
                        // album/list/followers
                    } else if ( pathParams.startsWith("/friends/list/album/followers") ) {

                        getFollowersForAlbum(guid, albumId);
               

                    } else { // out follow list

                        if ( pathParams.localeCompare("/friends/list/followings") == 0 ) {
                    
                            getFollowingList(guid);
                            
                        } else if ( pathParams.localeCompare("/friends/list/followers") == 0 ) {
                            
                            getFollowersList(guid);
                        }
                    }

                } else if ( pathParams.localeCompare("/friends/user/followstatus") == 0 ) {
                    
                    followStatus(guid, friendGuid);
               
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