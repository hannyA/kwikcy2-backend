'use strict';
console.log('Loading function');

/* Import Libraries */
var mysql = require('mysql');
var uuid  = require('uuid');
var validator = require('validator');

 console.log('Required all');



var APP_NAME  = "Dromo";
var MAX_CHARACTER_LENGTH = 30;
var ALLOW_MORE_THAN_ONE_ACCOUNT = false;




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


let kAlbumId    = "albumId";
let kType       = "type";

let kTimestamp  = "timestamp";
let kDate       = "date";

let kTitle      = "title";
let kMedia      = "media";
let kTimelimit  = "timelimit";
let kAlbumIds   = "albumIds";

let kTmpMediaKey = "tmpMediaKey";
let kTmpCoverKey = "tmpCoverKey";

let kActive         = "active";
let kSuccess        = "success";
let kErrorMessage   = "errorMessage";

var ErrorMessageGeneric = APP_NAME + " is experiencing problems. Try again shortly";


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
    if (username.length > MaxLength.Username) {
        return "Username is too long. It can be at most " + MaxLength.Username + " characters long.";  
    }
    
    if ( invalidCharacters(username) ){
        return "Username can only have letters, numbers, and ._-";  
    }        
}


function printError(err) {
    console.log(err);
    console.error('Error Stack is: ' + err.stack);


    // console.log('Error is :', JSON.stringify(err, null, 2));
    // console.log('Error is :', JSON.stringify(err.code, null, 2));
    // console.log('Error Message :', err.errorMessage);
                                    
    // console.error('Error Stack stringify: ' + JSON.stringify(err.stack, null, 2));
}



console.log('creating connection');

var connection = mysql.createConnection({
    host     : 'mysqldromotest.cyoa59avdmjr.us-east-1.rds.amazonaws.com',
    user     : 'hannyalybear',
    password : 'SummerIsNearAndYellow1',
    database : 'dromotestmysqldb',
    charset  : 'utf8mb4_unicode_ci' 
});



// var Relationships = {
//     SentFriendRequest       : "SFR",        //S
//     ReceivedFriendRequest   : "RFR",//  - R 
//     AcceptedFriendRequest   : "AFR",//  - A"
//     FriendAcceptedRequest   : "RFRA", // FAR // - F      
//     CanceledFriendRequest   : "CFR" //  - C
// };


var Relationship = {
    Unknown               : 0,
    NoneExist             : 1,
    FollowRequested       : 2,        
    IsFollowing           : 3,   
    BlockedUser           : 4,
    CanceledFollowRequest : 5
};



let kMediaURL   = "mediaUrl"



function autoAcceptResponse(success) {
    var response = {};
    response.Success = success;
    return response;
}


function errorResponse(message) {
    var response = {};
    response.Success = false; 
    response[kErrorMessage] = message;
    return response;
}




var NotificationType = {
    SentFollowRequest     : 0,
    ReceivedFollowRequest : 1,
    IsFollowing           : 2,   // You are following JOhn232
    BeingFollowed         : 3   // JOhn232 is following you
};



// var NotificationType = {
//     SentFriendRequest     : "SFR",
//     FriendAcceptedRequest : "RFRA", 

//     ReceivedFriendRequest : "RFR",
//     AcceptedFriendRequest   : "AFR",

//     FriendRequestCanceled   : "FRC"
// };


let kAccept = "accept";


let kUpdatedValue = "updatedValue";

function pushNotificationsResponse( activeStatus, value, errorMessage ) {
    
    var response = {};
    response[kActive]       = activeStatus; 
    response[kUpdatedValue] = value; 
    response[kErrorMessage] = errorMessage; 

    console.log(response);
    return response;
}



    var kPushNotificationType  = "PushNotificationType";
    var kPushNotificationValue = "PushNotificationValue";

    
    var PushNotificationType = {
        NewFriends      : "newFriends",
        NewMedia        : "newMedia",
        AcceptedFriends : "acceptedFriends"
    };


    function autoAcceptresponse(isAutoAcceptOn) {
        var response = {};
        response.setting = isAutoAcceptOn;
        return response;
    }

    function errorResponse(message) {        
        var response = {};
        response[kErrorMessage] = message;
        return response;
    }



function activeResponse( errorMessage) {
    var response = {};
    response[kActive]       = activeStatus;
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
cd settings; ./compress.sh api-settings Rail-UserSettings-mobilehub-1247959479; cd ..

./compress.sh api-settings Rail-UserSettings-mobilehub-1247959479

*/


exports.handler = (event, context, callback) => {

    var responseCode = 200;
    var requestBody, pathParams, queryStringParams, headerParams, stage,
    stageVariables, cognitoIdentityId, httpMethod, sourceIp, userAgent,
    requestId, resourcePath;
    console.log("request: " + JSON.stringify(event));

    // Request Body
    requestBody = JSON.parse(event.body);

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


    console.log('Received event:', JSON.stringify(event, null, 2));


    function finalAppResponse( responseBody) {
        console.log("responseBody: " + responseBody);
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




    // Rollback on failure
    function rollbackAppError(message) {        
        connection.rollback(function() {
            finalAppResponse( errorResponse(message) );
        }); 
    }



    context.callbackWaitsForEmptyEventLoop = false;

    

    var userId      = cognitoIdentityId;    
    var acctId      = requestBody[kAcctId];


    var doesAutoAccept = requestBody[kAccept]; // bool, chnage to Int



    console.log("ClientID: " + userId);
    console.log("albumId: " + albumIds);
 
    // Error checking user input
    if ( userId.length > 100 ) {
        finalAppResponse( errorResponse(ErrorMessageGeneric) );
        return;
    }


    function printTimeForEvent(event) {
        console.log("Event: " + event + ", Time left: " + context.getRemainingTimeInMillis());
    }




/**
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 * 
 *                          Auto Accept Settings
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 * 
 * 
 */

    function updateNotifications() {

        // Commit both queries
        connection.commit(function(err) {
            if (err) {
                // Failed to commit queries. Rollback on failure
                printError(err);
                rollbackAppError(uploadApology);

            } else  {
                console.log('successful commit!: obj');

                finalAppResponse( autoAcceptResponse(true));
            }
        });
    }



    function updateMyAcceptNotifications(guid) {
    
    }

    function getUserNotificationIds(results, guid, friendGuid) {
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
    

    function updateFriendAcceptNotifications(guid, friendGuids) {
        // For each row where I received friend request, update it to "I accepted""
        connection.query({
            sql: "UPDATE `notifications` SET type = ? WHERE guid = ? AND `fguid` IN (?)",
            values: [ NotificationType.AcceptedFriendRequest, guid, friendGuids ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(uploadApology);
            } else if (results) {
                // For each row where friend sent 'friend request', update it to "friend accepted"
                connection.query({
                    sql: "UPDATE `notifications` SET type = ? WHERE guid IN (?) AND `guid` = ?",
                    values: [ NotificationType.FriendAcceptedRequest, friendGuids, guid ]
                }, function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackAppError(uploadApology);
                    } else if (results) {
                        // Commit both queries
                        connection.commit(function(err) {
                            if (err) {
                                // Failed to commit queries. Rollback on failure
                                printError(err);
                                rollbackAppError(uploadApology);

                            } else  {
                                console.log('successful commit!: obj');

                                finalAppResponse( autoAcceptResponse(true));
                            }
                        });

                    } else {
                        rollbackAppError(uploadApology);
                    }
                });
            } else {
                rollbackAppError(uploadApology);
            }
        });
    }

    function updateOutStandingRequests(guid, friendGuids) {

        // For each row where I received friend request, update it to "I accepted""
        connection.query({
            sql: "UPDATE `friends` SET `status` = ? WHERE guid2 = ? AND guid1 IN (?)",
            values: [ Relationship.IsFollowing, guid, friendGuids ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(uploadApology);
            } else if (results) {
                
                //  Update notifications
                updateFriendAcceptNotifications(guid, friendGuids);
                
                
            } else {
                rollbackAppError(uploadApology);
            }
        });
    }

    function updateUserSettings(guid, friendGuids ) {

        var accept = doesAutoAccept ? 1 : 0;

         // auto_accept = tinyint 0, 1
        connection.query({
            sql: "INSERT INTO `user_settings` (`guid`, `auto_accept`) VALUES ? ON DUPLICATE KEY UPDATE `auto_accept` = VALUES(auto_accept)",
            // sql: "UPDATE `user_settings` SET `auto_accept` = ?", // bool 0, 1
            values: [ guid, accept ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(uploadApology);
            } else {

                if (friendGuids.length > 0) {
                    updateOutStandingRequests(guid, friendGuids);
                } else {
                    // Return success
                    console.log('No friends to update, returning Success');
                    finalAppResponse( autoAcceptResponse(true));
                }
            }
        });
    }





    function startTransaction(guid, friendGuids) {

         connection.beginTransaction(function(err) {
            if (err) { 
                console.log('Error:', JSON.stringify(err, null, 2));
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            } else {
                updateUserSettings(guid, friendGuids);
            }
        });
    }

    // Get a list of friends, If none, continue to updateUserSettings
    function friendsList(guid) {

         connection.query({
            sql: "SELECT `guid2` as guid FROM `friends` WHERE guid1 = ? AND `status` = ?",
            values: [ guid, Relationship.FollowRequested ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(uploadApology);
            } else if (results) {

                if (results.length > 0) {

                    var friendGuids = [];
                    results.forEach((result) => {
                        friendGuids.push(result.guid);
                    });

                    startTransaction(guid, friendGuids);

                } else {
                    updateUserSettings(guid,  friendGuids);
                }
            } else {
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            }
        }); 
    }



    function currentAutoAcceptSettings(guid) {

        connection.query({
            sql: 'SELECT `auto_accept` FROM `user_settings` WHERE `guid` = ?', 
            values: [guid]
        }, function (error, results) {

            if (error) {
                    printError(error);
                    finalAppResponse( errorResponse(ErrorMessageGeneric) );
            }
            else if (results && results.length > 0) {
                console.log('User exists, returning current info');
                console.log('Results:', JSON.stringify(results, null, 2));

                var isAutoAcceptOn =  results[0].auto_accept ? true : false;
                finalAppResponse( autoAcceptresponse(isAutoAcceptOn));

            } else {
                finalAppResponse( autoAcceptresponse(false));
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
 *                          Push Notifications settings
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 * 
 * 
 */

    if ( hasNoValue( acctId )  ) {
        finalAppResponse( errorResponse(ErrorMessageGeneric));
        return;
    }


    var pushType  = event[kPushNotificationType];
    var pushValue = event[kPushNotificationValue];

    console.log("pushType: " + pushType);
    console.log("pushValue: " + pushValue);


    if ( pushValue != true && pushValue != false ) {
        finalAppResponse( errorResponse(ErrorMessageGeneric) );
        return;
    }

    var notificationValue = pushValue == true ? 1 : 0;

    var notificationType;

    if (pushType ===  PushNotificationType.NewFriends) {
        notificationType = "new_friend";
    } else if (pushType ===  PushNotificationType.NewMedia) {
        notificationType = "new_media";
    } else if (pushType ===  PushNotificationType.AcceptedFriends) {
        notificationType = "accepted_friend";
    } else {
        finalAppResponse( errorResponse(ErrorMessageGeneric) );
        return;
    }
    

    

    function updatePushNotificationsTable(guid) {

        var fieldColumns = [ 'guid', notificationType];
        var valueColumns = [  [guid,  notificationValue] ] ;
        
        var sql     = 'INSERT INTO `push_notification_settings` ( ?? ) VALUES ? ON DUPLICATE KEY UPDATE ?? = VALUES(??)';
        var inserts = [ fieldColumns, valueColumns,  notificationType, notificationType  ] ;

        connection.query (
            sql, 
            inserts
        , function(err, result) {
            if (err) {
                printError(err);
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            } else if (result &&  result.affectedRows > 0) {

                finalAppResponse( pushNotificationsResponse( ActiveValues.Active, pushValue, null));

            } else {
                console.log('deleted ' + result.affectedRows + ' rows');
                finalAppResponse( pushNotificationsResponse( ActiveValues.Active, null, "Could not update push notifications at this time. Try again shortly"));
            }
        });
    }

    




    //TODO: 
    // If any uploaded albums have no id,  then we create it here, no albums will exost without content
    //  we include the new title in upload

    function queryActiveAccount() {
    
        connection.query({
            sql: 'SELECT `guid`, `active` FROM `users` WHERE `id` = ? AND `acctid` = ?', 
            values: [userId, acctId]
        }, 
        function (error, results) {
            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            }
            else if (results && results.length > 0) {
                console.log('User exists, returning current info');
                console.log('Results:', JSON.stringify(results, null, 2));

                if ( results[0].active != ActiveValues.Active ) {
                    finalAppResponse( activeResponse( results[0].active, activeErrorMessage( results[0].active )));
                    return;
                }

                if (pathParams.localeCompare("/settings/notifications/update") == 0 ) {
                    
                    updatePushNotificationsTable(results[0].guid);

                } else if (pathParams.localeCompare("/accounts/privacy/update") == 0 ) {
                    
                    friendsList(results[0].guid);

                } else if (pathParams.localeCompare("/accounts/privacy") == 0 ) {
                    
                    currentAutoAcceptSettings(results[0].guid);

                } else {
                    finalAppResponse( errorResponse(ErrorMessageGeneric) );
                }
            } else {
                finalAppResponse( pushNotificationsResponse( ActiveValues.DoesNotExist, null,  "This account does not exists"));
            }
        });
    }
    queryActiveAccount();
};