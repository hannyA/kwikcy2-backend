'use strict';
console.log('Loading function');

/* Import Libraries */
var mysql = require('mysql');
var uuid  = require('uuid');


var AWS = require("aws-sdk");
console.log('Loading function AWS');

var s3 = new AWS.S3({ apiVersion: '2006-03-01' });



var APP_NAME  = "Fifo";
var MAX_CHARACTER_LENGTH = 25;
var ALLOW_MORE_THAN_ONE_ACCOUNT = false;


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
    if (username.length > MAX_CHARACTER_LENGTH) {
        return "Username is too long. It can be at most " + MAX_CHARACTER_LENGTH + " characters long.";  
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
    database : 'dromotestmysqldb',
    charset  : 'utf8mb4_unicode_ci' 
});



function printError(err) {
    console.log(err);
    console.error('Error Stack is: ' + err.stack);


    // console.log('Error is :', JSON.stringify(err, null, 2));
    // console.log('Error is :', JSON.stringify(err.code, null, 2));
    // console.log('Error Message :', err.errorMessage);
                                    
    // console.error('Error Stack stringify: ' + JSON.stringify(err.stack, null, 2));
}





/**
 * 
 * TO fix update notification types 
 * 
 * For BeingFollowed
 * UPDATE `notifications` AS n
	INNER JOIN friends f
    ON n.guid = f.guid2 AND n.fguid = f.guid1 AND f.status = 3 AND type = 3
    SET type = 1
 * 
 * 
 */
/**
 *  IsFollowing
 *  SentFollowRequest -> is updated to IsFollowing
 *  ReceivedFollowRequest -> is updated to BeingFollowed? 
 */
var NotificationType = {
    SentFollowRequest     : 0,
    ReceivedFollowRequest : 1,
    IsFollowing           : 2,   // You are following JOhn232
    BeingFollowed         : 3,   // JOhn232 is following you
    BlockedUser           : 4,
    MentionedInAlbum      : 5,
    MentionedInComment    : 6,
    ReceivedComment       : 7,
    ReceivedReplyToComment: 8
};



/* The following are the stored values in database */
var Relationship = {
    Unknown               : 0,
    NoneExist             : 1,
    FollowRequested       : 2,        
    IsFollowing           : 3,   
    CanceledFollowRequest : 5
};

function notificationValue(type) {
    switch (type) {
        case 0: return "SentFollowRequest";
        case 1: return "ReceivedFollowRequest";
        case 2: return "IsFollowing";
        case 3: return "BeingFollowed";
        default: return "Error";
    }
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



    // The status of us following them
    function followingStatus(status) {

        if (status !== null) {
            if (status === Relationship.CanceledFollowRequest) {
                return Relationship.NoneExist;
            } else {
                return status;
            }
        } 
        return  Relationship.NoneExist;
    }
            
    // The status of them following us
    function followedStatus(status) {

        if (status !== null) {
            if (status === Relationship.CanceledFollowRequest) {
                return Relationship.NoneExist;
            } else {
                return status;
            }
        } 
        return  Relationship.NoneExist;
    }



// var Relationships = {
//     SentFriendRequest       : "SFR",        //S
//     ReceivedFriendRequest   : "RFR",//  - R 
//     AcceptedFriendRequest   : "AFR",//  - A"
//     FriendAcceptedRequest   : "RFRA", // FAR // - F      
//     CanceledFriendRequest   : "CFR" //  - C
// };



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
let kUserPhoto      = "userPhoto";

let kScore          = "score";
let kFollowersCount = "followersCount";
let kFollowingCount = "followingCount";

let kFriendStatus   = "friendStatus";


let kNotificationId = "notificationId";
let kType       = "type";

let kTimestamp  = "timestamp";
let kUnixTimestamp  = "unixTimestamp";
let kDate       = "date";



var ActiveValues = {
    Active            : 0,
    Unknown           : 1,   
    DoesNotExist      : 2,   // Company suspended
    Deleted           : 3,   // User deleted 
    Disabled          : 4,   // User disbaled??
    DisabledConfirmed : 5,   // Company suspended
};






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





// finalAppResponse( activeResponse( ActiveValues.DoesNotExist, activeErrorMessage(ActiveValues.DoesNotExist)));


function activeResponse(activeStatus, errorMessage) {
    var response = {};
    response[kActive]       = activeStatus;
    response[kErrorMessage] = errorMessage;
    console.log(response);
    return response;
}

function appResponse( bodyResponse ) {
    var response = {};    
    response[kActive]       = ActiveValues.Active;
    response[kResults]      = bodyResponse;
    console.log(response);
    return response;
}

function errorResponse(errorMessage) {

    var response = {};    
    response[kActive]       = ActiveValues.Active;
    response[kErrorMessage] = errorMessage;
    console.log(response);
    return response;
}

let kResults = "results";
let kActive   = "active";
let kErrorMessage   = "errorMessage";

let kProfileUrl = "profileUrl";
let kProfile = "profile";

let kPrivate = "private";


let kAllowFollowersView     =  "allowFollowersView";
let kAllowFollowingsView    =  "allowFollowingsView";


// errorMessage = "Unable to accept \(self.notificationModel.otherUser.userName)'s friend request. Try again shortly")


/*

Intro
Beat
Board
sequence
opening
title
Cold Open
teaser

After showing  profile albums, when we select album to upload to, change to only open albums

Trending albums

Peoples profile albusm


Fun stuff: 
Edititng tool and music for 10 second opening credits
Don't publish yet options. Create day and launch 12 hours later or so. 


Remove highlighting of buttons


Create a users



    Shell command:
cd notifications; ./compress.sh api-notifications Rail-Notifications-mobilehub-1247959479; cd ..

./compress.sh api-notifications Rail-Notifications-mobilehub-1247959479

*/


let kRefreshNotifications = "refreshNotifications";

let kCount = "count";
let kCommentCount       = "commentCount";
let kCommentTotalCount  = "commentTotalCount";

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
        console.log("Winning");
        console.log("responseBody: " + JSON.stringify(responseBody));

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



    context.callbackWaitsForEmptyEventLoop = false;
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    var userId = cognitoIdentityId;
    var acctId = requestBody[kAcctId];

    console.log("ClientID: " + userId);
 
    // Error checking user input
    if ( userId.length > 100 ) {
        finalAppResponse( activeResponse( ActiveValues.Unknown, activeErrorMessage( ActiveValues.Unknown )));
        return;
    }

    var refreshNotifications  = requestBody[kRefreshNotifications];  // Bool 

    var notificationId        = requestBody[kNotificationId];     // id 
    var notificationTimestamp = requestBody[kTimestamp];    


    var MAX_LIMIT = requestBody[kCount];

    if (MAX_LIMIT === undefined || MAX_LIMIT === null || MAX_LIMIT > 20) {
        MAX_LIMIT = 20;
    } else if (MAX_LIMIT < 4) {
        MAX_LIMIT = 4;
    }

     // Create some date variables
    var date = new Date();
    // var time = date.getTime();
    
    


    function getTime(timestamp) {
        var d = new Date(timestamp);
        var time = d.getTime().toString();
        console.log("Time: " + time);
        return time;
    }



    function dateToString(date) {

        if (date != null) {
            return date.toString();
        } 
        return null;
    }



    function isBoolean(val) {
        return typeof(val) === "boolean";
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







     
    
    let kFollowedStatus  = "followedStatus";
    let kFollowingStatus = "followingStatus";

    var ALBUM_BUCKET = "dromo-albums";
    

let SECONDS_IN_MINUTE = 60; 
let MINUTES_IN_HOUR = 60;   // 3,600
let HOURS_IN_DAY = 24;      // 86,400
let NUMBER_OF_DAYS = 7;
let S3_EXPIRE_LIMIT =  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * NUMBER_OF_DAYS;
    
    

// Multiple albums may have access to this content
function albumCoverThumbnailKey(guid, mediaUrl) {
    return guid + "/thumb/" + mediaKeyWithExtension(mediaUrl, MediaType.Photo);
}
    


// Multiple albums may have access to this content
function albumFirstMediaKey(guid, mediaUrl) {
    return guid + "/media/" + mediaUrl;
}


function mediaKeyWithExtension(mediaKey, mediaContentType) {
    return mediaKey + mediaExtension(mediaContentType);
}


var MediaType = {
    Video: "video",
    Photo: "photo",
    Gif: "gif"
}

function mediaExtension(type) {
    
    switch (type) {
        case MediaType.Photo:
            return ".jpg";
        case MediaType.Video:
            return ".mp4";
        case MediaType.Gif:
            return ".gif";
    }
}

let kSignedUrl =  "signedUrl";
let kFirstUrl = "firstUrl";
let kSignedFirstUrl = "signedFirstUrl";
let kAlbumId    = "albumId";
let kTitle           = "title";

let kExplicit = "explicit";

let kAlbumCover             = "albumCover";

let kNewestMediaTimestamp   = "newestTimestamp";

let kCreateDate      = "createDate";

let kExpireDate      = "expireDate";
let kExpireDays = "expire";
let kViews = "views";
let kLikeCount = "likeCount";
let kDislikeCount = "dislikeCount";


    function getAlbumFromResult(result) {
        console.log("getAlbumsFromResults called indeed");
        
        var album = {};

        let guid          = result.album_owner;
        let firstUrl      = result.first_url;
        let coverAlbumUrl = result.cover_album_url;
        
        var params = {  Bucket  : ALBUM_BUCKET,  
                        Key     : albumCoverThumbnailKey(guid, coverAlbumUrl), 
                        Expires : S3_EXPIRE_LIMIT 
                    };
        var signedUrl = s3.getSignedUrl('getObject', params);

        album[kSignedUrl]       = signedUrl;
        album[kFirstUrl]        = firstUrl;
        album[kTimestamp]       = result.first_timestamp.toString();

        
        album[kSignedFirstUrl]  = s3.getSignedUrl('getObject', 
                                    {   Bucket  : ALBUM_BUCKET,  
                                        Key     : albumFirstMediaKey(guid, firstUrl), 
                                        Expires : S3_EXPIRE_LIMIT 
                                    });

        console.log("getAlbumsFromResults result.album_id: " + result.album_id);

                                    
        album[kAlbumId]              = result.album_id;
        album[kPrivate]              = result.album_is_private;
        album[kTitle]                = result.title;

        album[kExplicit]             = intToBool(result.explicit);

        // if ( validator.isBase64(result.title) ) {
        //     album[kTitle]  = titleToUTF(result.title);
        // } else {
        //     album[kTitle] = result.title; 
        // }
        
                
        album[kAlbumCover]           = coverAlbumUrl;

        album[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
        album[kCount]                = result.count; // media count
        
        album[kCreateDate]           = result.create_date.toString();

        album[kExpireDate]           = result.expire_date;
        album[kExpireDays]           = result.expire;



        // if (result.album_is_private === IsPublic) {
        album[kViews]                = result.views;
        album[kLikeCount]            = result.likes;
        album[kDislikeCount]         = result.dislikes;
        // }

        album[kCommentCount]         = result.number_of_replies; // number of total comments and replies
        album[kCommentTotalCount]    = result.number_of_total_replies; // number of total comments and replies
        album[kCommentsOn]          = intToBool(result.comments_on);
       
        
        // var albumInfo = {};
        // albumInfo[kAlbum]   = album;
        // albumInfo[kProfile] = profile;
        // // console.log("result.last_viewed_timestamp mediaContentType of = "  + typeof result.last_viewed_timestamp  );

        // albumsList.push(albumInfo);

    return album;
}

    let kCommentsOn = "commentsOn";

    let kNotification = "notification";
    let kAlbum         = "album";
    let kCommentId  = "commentId";
    
    function notificationResults(error, results) {
    
        var response = [];
    
        if (error) {
            printError(error);
            finalAppResponse( errorResponse(ErrorMessageGeneric) );
        }

        else if (results) {
            console.log('Result count: ' + results.length);

            results.forEach((result) => {
                console.log('Result:', JSON.stringify(result, null, 2));

                var notification = {};
                notification[kNotificationId]   = result.id;
                notification[kGuid]             = result.guid;
                notification[kType]             = result.type;
                notification[kTimestamp]        = result.n_timestamp.toString();
                
                if (result.n_comment_id !== null) {
                    notification[kCommentId]    = result.n_comment_id.toString();                    
                }

                var n_profile = {};

                // Profile of user who sent this
                n_profile[kGuid]             = result.guid;
                n_profile[kUserName]         = result.n_username;
                n_profile[kFullName]         = result.n_fullname;
                n_profile[kAbout]            = result.n_about;
                n_profile[kDomain]           = result.n_domain;
                n_profile[kVerified]         = intToBool(result.n_verified);
                n_profile[kProfileUrl]       = result.n_image_url;
                n_profile[kPrivate]          = result.n_profile_is_private;

                n_profile[kAllowFollowersView]  = intToBool(result.n_allow_view_followers);
                n_profile[kAllowFollowingsView] = intToBool(result.n_allow_view_followings);

                let popularity = result.n_popularity;                
                n_profile[kFollowersCount]  = result.n_followers;
                n_profile[kFollowingCount]  = result.n_following;
                n_profile[kScore]           = popularity === null ? 0 : popularity;

                notification[kProfile] = n_profile;

                if (result.album_owner !== undefined && result.album_owner !== null) {

                    var album = getAlbumFromResult(result)
                    

                    var a_profile = {};
                    
                    // Profile of user who sent this
                    a_profile[kGuid]             = result.album_owner;
                    a_profile[kUserName]         = result.a_username;
                    a_profile[kFullName]         = result.a_fullname;
                    a_profile[kAbout]            = result.a_about;
                    a_profile[kDomain]           = result.a_domain;
                    a_profile[kVerified]         = intToBool(result.a_verified);
                    a_profile[kProfileUrl]       = result.a_image_url;
                    a_profile[kPrivate]          = result.a_profile_is_private;
    
                    a_profile[kAllowFollowersView]  = intToBool(result.a_allow_view_followers);
                    a_profile[kAllowFollowingsView] = intToBool(result.a_allow_view_followings);
    

                    let popularity = result.a_popularity;
                    a_profile[kFollowersCount]  = result.a_followers;
                    a_profile[kFollowingCount]  = result.a_following;
                    a_profile[kScore]           = popularity === null ? 0 : popularity;
    
                    album[kProfile]   = a_profile
                    notification[kAlbum] = album;
                }
                

                // var followedStat     = result.followed_status;
                // var followingStat    = result.following_status;
                // console.log("Followed status: " + followedStat);
                // console.log("Following status: " + followingStat);
                
                // notification[kFollowedStatus ]   = followedStatus( result.followed_status);
                // notification[kFollowingStatus]   = followingStatus( result.following_status);
                


                
                

                // console.log("Public status: "  + result.status);

                // notification[kFollowersCount]    = result.follower_count
                // notification[kPrivate]          = intToBool(result.is_private);
                response.push(notification)
            });


            finalAppResponse( appResponse(response));

        } else {
            console.log('Error:', JSON.stringify(error, null, 2));
            finalAppResponse( errorResponse(ErrorMessageGeneric) );
    
        }
    }




    /*
     *  Query database and make sure the user only has one username for now.
     *  If we find it return it
     */

// TODO: If we save the user friends count in profile table, then we can remove one join function
    function getNotifications(guid) {

//    "SELECT `notifications`.`id`, `notifications`.`fguid`, `notifications`.`type`,  `notifications`.`timestamp`, `profile`.`username`, `profile`.`fullname`, `profile`.image_url , `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`followers` AS follower_count, f2.`status` as `status` 
//    FROM `notifications` 
//         INNER JOIN `profile` 
//         ON `notifications`.`fguid` = `profile`.`guid` 
//                LEFT JOIN `friends` f2 
//                 ON f2.`guid1` = `notifications`.`guid` AND f2.`guid2` = `notifications`.`fguid` 
//     WHERE `notifications`.`guid` = ? 
//     GROUP BY `notifications`.`id` 
//     ORDER BY `notifications`.`timestamp` 
//     DESC LIMIT ?"


/**
 * 
 * Account is Private
 * 
 * You received Follow Rquest
 * 
 * You accepteed Follow request. THey get " You are following user"
 * 
 * 
 * 
 * Account is public
 * 
 * You follow Someone / Someone is following you. 
 * 
 * You unfollow someone / Someone unfollowed you
 * 
 
 */
        
        var sqlQuery;
        var sqlParams;

        

        /**
         * 
         * 


    // We don't need friend status whether we're following or their following

    // We need if we're blocking them only.
    // Also if we update stuff

    


    SELECT f1.`status` as `followed_status` , f2.`status` as `followingstatus`, `notifications`.`id`, `notifications`.`fguid`, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS unix_timestamp, `notifications`.`timestamp`, `profile`.`username`, `profile`.`fullname`, `profile`.image_url , `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`, profile.allow_view_followers, profile.allow_view_followings, profile.followers, profile.following, user_metrics.popularity 
    FROM `notifications` 
        INNER JOIN `profile` 
        ON `profile`.`guid` = `notifications`.`fguid` 
            LEFT JOIN user_metrics
             ON user_metrics.guid = profile.guid 
                LEFT JOIN `friends` f1 
                ON f1.`guid1` = profile.guid AND f1.`guid2` = notifications.guid 
                    LEFT JOIN `friends` f2 
                    ON f2.`guid1` = notifications.guid AND profile.guid = f2.`guid2` 
    WHERE `notifications`.`guid` = ? 
    ORDER BY `notifications`.`timestamp` DESC 
    LIMIT ?"



    SELECT `notifications`.`id`, `notifications`.`fguid`, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS unix_timestamp, `notifications`.`timestamp`, `profile`.`username`, `profile`.`fullname`, `profile`.image_url , `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`, profile.allow_view_followers, profile.allow_view_followings, profile.followers, profile.following, user_metrics.popularity FROM `notifications` INNER JOIN `profile` ON `profile`.`guid` = `notifications`.`fguid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `notifications`.`guid` = ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"


    SELECT `notifications`.`id`, `notifications`.`fguid`, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS unix_timestamp, `notifications`.`timestamp`, `profile`.`username`, `profile`.`fullname`, `profile`.image_url , `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`, profile.allow_view_followers, profile.allow_view_followings, profile.followers, profile.following, user_metrics.popularity 
    FROM `notifications` 
        INNER JOIN `profile` 
        ON `profile`.`guid` = `notifications`.`fguid`  
            LEFT JOIN user_metrics
             ON user_metrics.guid = profile.guid 
    WHERE `notifications`.`guid` = ? 
    ORDER BY `notifications`.`timestamp` DESC 
    LIMIT ?"

            
    
     WHERE `notifications`.`guid` = ? 
     ORDER BY `notifications`.`timestamp` DESC 
     LIMIT ?"

        SELECT `notifications`.`id`, `notifications`.`fguid`, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS unix_timestamp, `notifications`.`timestamp`, `profile`.`username`, `profile`.`fullname`, `profile`.image_url , `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`, profile.allow_view_followers, profile.allow_view_followings, profile.followers, profile.following, user_metrics.popularity 
        FROM `notifications` 
            INNER JOIN `profile` 
            ON `profile`.`guid` = `notifications`.`fguid` 
                LEFT JOIN user_metrics 
                ON user_metrics.guid = profile.guid 
        WHERE `notifications`.`guid` = ?  AND `notifications`.timestamp < ? AND `notifications`.id <> ? 
        ORDER BY `notifications`.`timestamp` DESC 
        LIMIT ?"


        
        SELECT um.popularity, ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, 
        alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , 
        
        ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, 
                
        FROM album_timeline AS tl INNER JOIN `user_album` AS ua ON tl.fguid = ua.guid AND tl.album_id = ua.id INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id LEFT JOIN user_metrics AS um ON ua.guid = um.guid WHERE tl.guid = ? AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) ORDER BY tl.date DESC LIMIT ?";





        



        

        SELECT `notifications`.`id`, `notifications`.`fguid` AS guid, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS unix_timestamp, `notifications`.`timestamp`, `notifications`.`album_owner`, `notifications`.`album_id`,
        n_profile.`username`, n_profile.`fullname`, n_profile.image_url , n_profile.`about`, n_profile.`domain`, n_profile.`verified`, n_profile.`is_private` AS n_profile_is_private, n_profile.allow_view_followers, n_profile.allow_view_followings, n_profile.followers, n_profile.following, 
        a_profile.`username`, a_profile.`fullname`, a_profile.image_url , a_profile.`about`, a_profile.`domain`, a_profile.`verified`, a_profile.`is_private` AS a_profile_is_private, a_profile.allow_view_followers, a_profile.allow_view_followings, a_profile.followers, a_profile.following, 

                 ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`
         
        user_metrics.popularity,
        uma.popularity,

        SELECT `notifications`.`id`, `notifications`.`fguid` AS guid, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS n_timestamp, n_profile.`username` AS n_username, n_profile.`fullname` AS n_fullname, n_profile.image_url AS n_image_url , n_profile.`about` AS n_about, n_profile.`domain` AS n_domain, n_profile.`verified` AS n_verified, n_profile.`is_private` AS n_profile_is_private, n_profile.allow_view_followers AS n_allow_view_followers, n_profile.allow_view_followings AS n_allow_view_followings, n_profile.followers AS n_followers, n_profile.following AS n_following, n_user_metrics.popularity AS n_popularity, ua.guid AS album_owner, ua.id AS album_id, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, a_profile.`username` AS a_username, a_profile.`fullname` AS a_fullname, a_profile.image_url AS a_image_url , a_profile.`about` AS a_about, a_profile.`domain` AS a_domain, a_profile.`verified` AS a_verified, a_profile.`is_private` AS a_profile_is_private, a_profile.allow_view_followers AS a_allow_view_followers, a_profile.allow_view_followings AS a_allow_view_followings, a_profile.followers AS a_followers, a_profile.following AS a_following, a_user_metrics.popularity AS a_popularity
        FROM `notifications` 
            INNER JOIN `profile` AS n_profile
            ON n_profile.`guid` = `notifications`.`fguid` 
                LEFT JOIN user_metrics AS n_user_metrics
                ON n_user_metrics.guid = n_profile.guid
                    LEFT JOIN user_album AS ua 
                    ON notifications.album_owner = ua.guid AND notifications.album_id = ua.id
                        LEFT JOIN `profile` AS a_profile
                        ON a_profile.`guid` = `notifications`.`album_owner` 
                            LEFT JOIN user_metrics as a_user_metrics
                            ON a_user_metrics.guid = a_profile.guid
        WHERE `notifications`.`guid` = ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"

        


        SELECT `notifications`.`id`, `notifications`.`fguid` AS guid, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS n_timestamp, n_profile.`username` AS n_username, n_profile.`fullname` AS n_fullname, n_profile.image_url AS n_image_url , n_profile.`about` AS n_about, n_profile.`domain` AS n_domain, n_profile.`verified` AS n_verified, n_profile.`is_private` AS n_profile_is_private, n_profile.allow_view_followers AS n_allow_view_followers, n_profile.allow_view_followings AS n_allow_view_followings, n_profile.followers AS n_followers, n_profile.following AS n_following, n_user_metrics.popularity AS n_popularity, ua.guid AS album_owner, ua.id AS album_id, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, a_profile.`username` AS a_username, a_profile.`fullname` AS a_fullname, a_profile.image_url AS a_image_url , a_profile.`about` AS a_about, a_profile.`domain` AS a_domain, a_profile.`verified` AS a_verified, a_profile.`is_private` AS a_profile_is_private, a_profile.allow_view_followers AS a_allow_view_followers, a_profile.allow_view_followings AS a_allow_view_followings, a_profile.followers AS a_followers, a_profile.following AS a_following, a_user_metrics.popularity AS a_popularity FROM `notifications` INNER JOIN `profile` AS n_profile ON n_profile.`guid` = `notifications`.`fguid` LEFT JOIN user_metrics AS n_user_metrics ON n_user_metrics.guid = n_profile.guid LEFT JOIN user_album AS ua ON notifications.album_owner = ua.guid AND notifications.album_id = ua.id LEFT JOIN `profile` AS a_profile ON a_profile.`guid` = `notifications`.`album_owner` LEFT JOIN user_metrics as a_user_metrics ON a_user_metrics.guid = a_profile.guid WHERE `notifications`.`guid` = ? AND `notifications`.timestamp <= ? AND `notifications`.id <> ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"



        
        
         
        SELECT `notifications`.`id`, `notifications`.`fguid` AS guid, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS n_timestamp, 
        n_profile.`username` AS n_username, n_profile.`fullname` AS n_fullname, n_profile.image_url AS n_image_url , n_profile.`about` AS n_about, n_profile.`domain` AS n_domain, n_profile.`verified` AS n_verified, n_profile.`is_private` AS n_profile_is_private, n_profile.allow_view_followers AS n_allow_view_followers, n_profile.allow_view_followings AS n_allow_view_followings, n_profile.followers AS n_followers, n_profile.following AS n_following, n_user_metrics.popularity AS n_popularity, 
        ua.guid AS album_owner, ua.id AS album_id, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, ua.number_of_replies, ua.number_of_total_replies, 
        a_profile.`username` AS a_username, a_profile.`fullname` AS a_fullname, a_profile.image_url AS a_image_url , a_profile.`about` AS a_about, a_profile.`domain` AS a_domain, a_profile.`verified` AS a_verified, a_profile.`is_private` AS a_profile_is_private, a_profile.allow_view_followers AS a_allow_view_followers, a_profile.allow_view_followings AS a_allow_view_followings, a_profile.followers AS a_followers, a_profile.following AS a_following, a_user_metrics.popularity AS a_popularity 
        FROM `notifications` 
            INNER JOIN `profile` AS n_profile 
            ON n_profile.`guid` = `notifications`.`fguid` 
                LEFT JOIN user_metrics AS n_user_metrics 
                ON n_user_metrics.guid = n_profile.guid 
                    LEFT JOIN user_album AS ua
                    ON notifications.album_owner = ua.guid AND notifications.album_id = ua.id 
                        LEFT JOIN `profile` AS a_profile 
                        ON a_profile.`guid` = `notifications`.`album_owner` 
                            LEFT JOIN user_metrics as a_user_metrics 
                            ON a_user_metrics.guid = a_profile.guid WHERE `notifications`.`guid` = ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"
        
         */    
        if ( refreshNotifications ) {
            console.log("refreshNotifications first time loading table" );
            
            sqlQuery = "SELECT `notifications`.`id`, `notifications`.`fguid` AS guid, notifications.comment_id AS n_comment_id, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS n_timestamp, n_profile.`username` AS n_username, n_profile.`fullname` AS n_fullname, n_profile.image_url AS n_image_url , n_profile.`about` AS n_about, n_profile.`domain` AS n_domain, n_profile.`verified` AS n_verified, n_profile.`is_private` AS n_profile_is_private, n_profile.allow_view_followers AS n_allow_view_followers, n_profile.allow_view_followings AS n_allow_view_followings, n_profile.followers AS n_followers, n_profile.following AS n_following, n_user_metrics.popularity AS n_popularity, ua.guid AS album_owner, ua.id AS album_id, comments_on,  ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, ua.number_of_replies, ua.number_of_total_replies, a_profile.`username` AS a_username, a_profile.`fullname` AS a_fullname, a_profile.image_url AS a_image_url , a_profile.`about` AS a_about, a_profile.`domain` AS a_domain, a_profile.`verified` AS a_verified, a_profile.`is_private` AS a_profile_is_private, a_profile.allow_view_followers AS a_allow_view_followers, a_profile.allow_view_followings AS a_allow_view_followings, a_profile.followers AS a_followers, a_profile.following AS a_following, a_user_metrics.popularity AS a_popularity FROM `notifications` INNER JOIN `profile` AS n_profile ON n_profile.`guid` = `notifications`.`fguid` LEFT JOIN user_metrics AS n_user_metrics ON n_user_metrics.guid = n_profile.guid LEFT JOIN user_album AS ua ON notifications.album_owner = ua.guid AND notifications.album_id = ua.id LEFT JOIN `profile` AS a_profile ON a_profile.`guid` = `notifications`.`album_owner` LEFT JOIN user_metrics as a_user_metrics ON a_user_metrics.guid = a_profile.guid WHERE `notifications`.`guid` = ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"
            // sqlQuery = "SELECT `notifications`.`id`, `notifications`.`fguid`, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS unix_timestamp, `notifications`.`timestamp`, `profile`.`username`, `profile`.`fullname`, `profile`.image_url , `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`, profile.allow_view_followers, profile.allow_view_followings, profile.followers, profile.following, user_metrics.popularity FROM `notifications` INNER JOIN `profile` ON `profile`.`guid` = `notifications`.`fguid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `notifications`.`guid` = ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"
            sqlParams = [ guid, MAX_LIMIT ];
        } else {
            console.log(" Get notifications from the tail end" );
            // Sort by timestamp < time - Older notificaitons
            sqlQuery = "SELECT `notifications`.`id`, `notifications`.`fguid` AS guid, notifications.comment_id AS n_comment_id, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS n_timestamp, n_profile.`username` AS n_username, n_profile.`fullname` AS n_fullname, n_profile.image_url AS n_image_url , n_profile.`about` AS n_about, n_profile.`domain` AS n_domain, n_profile.`verified` AS n_verified, n_profile.`is_private` AS n_profile_is_private, n_profile.allow_view_followers AS n_allow_view_followers, n_profile.allow_view_followings AS n_allow_view_followings, n_profile.followers AS n_followers, n_profile.following AS n_following, n_user_metrics.popularity AS n_popularity, ua.guid AS album_owner, ua.id AS album_id, comments_on, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, ua.number_of_replies, ua.number_of_total_replies, a_profile.`username` AS a_username, a_profile.`fullname` AS a_fullname, a_profile.image_url AS a_image_url , a_profile.`about` AS a_about, a_profile.`domain` AS a_domain, a_profile.`verified` AS a_verified, a_profile.`is_private` AS a_profile_is_private, a_profile.allow_view_followers AS a_allow_view_followers, a_profile.allow_view_followings AS a_allow_view_followings, a_profile.followers AS a_followers, a_profile.following AS a_following, a_user_metrics.popularity AS a_popularity FROM `notifications` INNER JOIN `profile` AS n_profile ON n_profile.`guid` = `notifications`.`fguid` LEFT JOIN user_metrics AS n_user_metrics ON n_user_metrics.guid = n_profile.guid LEFT JOIN user_album AS ua ON notifications.album_owner = ua.guid AND notifications.album_id = ua.id LEFT JOIN `profile` AS a_profile ON a_profile.`guid` = `notifications`.`album_owner` LEFT JOIN user_metrics as a_user_metrics ON a_user_metrics.guid = a_profile.guid WHERE `notifications`.`guid` = ? AND `notifications`.timestamp <= ? AND `notifications`.id <> ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"
            
            // sqlQuery = "SELECT `notifications`.`id`, `notifications`.`fguid`, `notifications`.`type`, UNIX_TIMESTAMP(notifications.timestamp) AS unix_timestamp, `notifications`.`timestamp`, `profile`.`username`, `profile`.`fullname`, `profile`.image_url , `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`, profile.allow_view_followers, profile.allow_view_followings, profile.followers, profile.following, user_metrics.popularity FROM `notifications` INNER JOIN `profile` ON `profile`.`guid` = `notifications`.`fguid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `notifications`.`guid` = ?  AND `notifications`.timestamp <= ? AND `notifications`.id <> ? ORDER BY `notifications`.`timestamp` DESC LIMIT ?"
            sqlParams = [ guid, notificationTimestamp, notificationId,  MAX_LIMIT ];
        }

        connection.query({
            sql    : sqlQuery,
            values : sqlParams
        }, notificationResults);
    }
 



    function main() {
        
        /*
        *  Query database and make sure the user only has one username for now.
        *  If we find it return it
        */
        var query = connection.query({
            sql: 'SELECT `guid`, `active` FROM `users` WHERE `id` = ? AND acctid = ?' ,
            values: [userId, acctId]
        }, 
        function (error, results, fields) {


            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            } 

            if (results) {  
                console.log('Results:', JSON.stringify(results, null, 2));

                if (results.length  > 0) {  // I guess assume 1 for now
                    console.log('User already exists, returning current info');
                    
                    if ( results[0].active != ActiveValues.Active ) {
                        finalAppResponse( activeResponse( results[0].active, activeErrorMessage( results[0].active )));
                        return;
                    }

                    var guid = results[0].guid;
                    console.log("guid: " + guid)

                    getNotifications(guid);

                    // Add new user to database         
                } else { // results.length == 0
                    
                    // Should not happen
                    finalAppResponse( activeResponse( ActiveValues.DoesNotExist, activeErrorMessage(ActiveValues.DoesNotExist)));
                }
            }
        });
    }
    main();
};