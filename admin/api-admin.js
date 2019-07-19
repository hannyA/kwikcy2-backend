'use strict';
console.log('Loading function');
console.log('Loading function continue');

/* Import Libraries */
var mysql = require('mysql');
var uuid  = require('uuid');
var randomstring = require("randomstring");
var validator = require('validator');

var stringz = require('stringz');


 console.log('Loaded main functions');

var AWS = require("aws-sdk");

 console.log('Loaded function aws sdk');




var accessKey = process.env.ACCESS_KEY;       
var secretKey = process.env.SECREY_KEY;

 console.log('accessKey: ' + accessKey);
 console.log('secretKey: ' + secretKey);
 console.log('');
console.log('');
console.log('');

var s3 = new AWS.S3({ apiVersion: '2006-03-01',
                     accessKeyId: 'AKIAJHK65DH7FA25B4VA',    
                     secretAccessKey: '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'    
                     });

 console.log('Loaded function AWS S3');

var gm = require('gm')            
    .subClass({ imageMagick: true }); // Enable ImageMagick integration.



 console.log('Loaded function imageMagick');


var APP_NAME  = "Dromo";
var MAX_CHARACTER_LENGTH = 30;
var ALLOW_MORE_THAN_ONE_ACCOUNT = false;

var ALBUM_BUCKET = "dromo-albums";
var ALBUM_BUCKET_PRIVATE = "dromo-albums-private";
var ALBUM_BUCKET_PUBLIC  = "dromo-albums-public";

// var ALBUM_COVER_BUCKET = "dromo-albums-cover";
var PRIVATE_TEMP_BUCKET = "dromo-albums-tmp";


let kOpenPublicAlbum       = "OpenPublicAlbum";
let kOpenPrivateAlbum      = "OpenPrivateAlbum";
let kDidViewMedia          = "DidViewMedia";




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


let kErrorMessage   = "errorMessage";
let kSuccess        = "success";
let kActive         = "active";

let kTitle           = "title";
let kCreateDate      = "createDate";
let kExpireDate      = "expireDate";


let kThumbnail              = "thumbnail";
let kAlbumCover             = "albumCover";
let kNewestMediaTimestamp   = "newestTimestamp";
// let kNewestMediaUrl         = "newestUrl";

let kCount = "count";




let kIsGroupAlbum               = "isGroupAlbum";
let kGroupSelectedFollowers     = "groupSelectedFollowers";
let kIsAllSelectedForGroupAlbum = "isAllSelectedForGroupAlbum";



console.log('Loading function 3');
//TODO: Get OpenUserAlbums
        // 2) Insert into only open albums

let kLastViewedMediaUrl         = "lastUrl";
let kLastViewedMediaTimestamp   = "lastTimestamp";

let kProfileUrl = "profileUrl";


       

let kLikeCount = "likeCount";
let kDislikeCount = "dislikeCount";
       

let kViews = "views";
let kExplicit = "explicit";

let kExplicitOverride = "explicitOverride"; // Administration overrides the explicit nature of content


let kAllowFollowersView     =  "allowFollowersView";
let kAllowFollowingsView    =  "allowFollowingsView";


let kBookmarked  = "BookmarkAlbum"
let kUnbookmarked = "UnbookmarkAlbum"




var ErrorMessageGeneric = APP_NAME + " is having some problems. Try again shortly.";
//APP_NAME + " is experiencing problems. Try again shortly";



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


 console.log('Loading function 4');


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


var Relationship = {
    Unknown               : 0,
    NoneExist             : 1,
    FollowRequested       : 2,        
    IsFollowing           : 3,   
    // BlockedUser           : 4,
    CanceledFollowRequest : 5
};

// var Relationships = {
//     SentFriendRequest       : "SFR",        //S
//     ReceivedFriendRequest   : "RFR",//  - R 
//     AcceptedFriendRequest   : "AFR",//  - A"
//     FriendAcceptedRequest   : "RFRA", // FAR // - F      
//     CanceledFriendRequest   : "CFR" //  - C
// };

var UpdateAction = {
    Friends  : "Friends",
    Title    : "Title"
};

var MediaType = {
    Video: "video",
    Photo: "photo",
    Gif: "gif"
}


var ActiveValues = {
    Active            : 0,
    Unknown           : 1,   
    DoesNotExist      : 2,   // Company suspended
    Deleted           : 3,   // User deleted 
    Disabled          : 4,   // User disbaled??
    DisabledConfirmed : 5,   // Company suspended
};
 console.log('Loading function 5');


let SECONDS_IN_MINUTE = 60; 
let MINUTES_IN_HOUR = 60;   // 3,600
let HOURS_IN_DAY = 24;      // 86,400
let NUMBER_OF_DAYS = 7;     // 172,800

let S3_EXPIRE_LIMIT =  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * NUMBER_OF_DAYS;
 // 1 day = 86400
 // 172 800 = 48 hours
// let S3_EXPIRE_LIMIT                 = 6*86400;  // 24 hours  1440 minutes, 8640 = 6 days, 10080, 7 days



function generateRandomString() {
    return randomstring.generate({
        length: 12,
        charset: 'alphanumeric'
    });
}

function generateRandomURL() {
    return generateRandomString() ; // + mediaExtension(type);
}

function bytesToMb(bytes) {
    return bytes/ (1024 * 1024);
}

function isImageBelowSizeThreshold(mbSize) {

    if (mbSize < 10) {
        return true;
    }
    return false;
}


function isVideoBelowSizeThreshold(mbSize) {
    // Be on the safe side
    if (mbSize < 200) { // == 30 seconds @ 60 fps 1080 HD ~ 100 MB
        return true;
    }
    return false;
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

function contentType(type) {
    
    switch (type) {
        case MediaType.Photo:
            return 'image/jpeg';
        case MediaType.Video:
            return "video/mp4";
        case MediaType.Gif:
            return "image/gif";
    }
}



 console.log('Loading function 6');


// Multiple albums may have access to this content
function albumMediaKey(guid, mediaUrl, mediaContentType) {
    return guid + "/media/" + mediaKeyWithExtension(mediaUrl, mediaContentType);
}


// Multiple albums may have access to this content
function albumCoverKey(guid, mediaUrl) {
    return guid + "/cover/" + mediaKeyWithExtension(mediaUrl, MediaType.Photo);
}


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



var Messages = {
    AlbumGone: "This album seems to have disappeared"
}



let kIsRefreshing       = "isRefreshing";
let kLastAlbumIsNew     = "isNew";
let kIndex              = "index";
let kNewSecion      = "newSection"




let kMedia      = "media";
let kMediaURL   = "mediaUrl";
let kFGuid      = "fguid"
let kTimelimit  = "timelimit";

let kSignedUrl =  "signedUrl";


let kNumberOfItems = "numberOfItems";


// let kFriends = "friends";
 let kInclusive = "isInclusive"


let kAlbumIds   = "albumIds";

let kTmpMediaKey = "tmpMediaKey";
let kTmpCoverKey = "tmpCoverKey"





let MAX_NUM_OF_ALBUMS = 5;
let MAX_NUM_OF_CONTENT = 10;


/***
 * 
 *      App response code
 * 
 */

let kProfile = "profile";
let kAlbum = "album";
let kAlbums = "albums";

console.log('Loading function 7');

function albumsResponse( albums) {
    var response = {};
    response[kActive] = ActiveValues.Active;
    response[kAlbums] = albums; 
    return response
}


function mediaResponse( album) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kAlbum]   = album; 
    return response
}


// dont need error message for this
function updateViewResponse(success) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kSuccess] = success; 
    return response;
}



function bookmarkResponse(bookMarked) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kSuccess] = bookMarked ? 1 : 0; 
    return response;
}



function getAlbumsResponse( albums) {
    var response = {}
    response[kActive]  = ActiveValues.Active;
    response[kAlbums]  = albums;
    return response;
}

function createAlbumResponse( albumId) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kAlbumId] = albumId;
    response[kSuccess] = true; 
    return response;
}


function uploadMediaResponse( mediaKey, signedUrl, timestamp) {
    var response = {};
    response[kTimestamp] = timestamp;
    response[kActive]    = ActiveValues.Active;
    response[kMediaURL]  = mediaKey; 
    response[kSignedUrl] = signedUrl; 
    return response;
}


function activeResponse(activeStatus, errorMessage) {
    var response = {};
    response[kActive]       = activeStatus;
    response[kErrorMessage] = errorMessage;
    return response;
}

function errorResponse(errorMessage) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kErrorMessage] = errorMessage;
    return response;
}
 console.log('Loading function 8');


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


// var GatewayPaths = {
//     // ListMyAlbums: "/albums/private/me",
//     // UserAlbums : "/albums/private/friend/album"
//     // OpenUserAlbums : "/albums/private/friend/album"
//     // FriendsAlbums : "/albums/private/friend/album"
//     // FriendsAlbums : "/albums/private/friend/album"
//     // FriendsAlbums : "/albums/private/friend/album"
// };


let kPrivate = "private";



/*

    Shell Command: 
cd admin; ./compress.sh api-admin Rail-Admin-mobilehub-1247959479; cd ..

./compress.sh api-admin Rail-Admin-mobilehub-1247959479


*/


/**
 * 
 * 
 *  Under search screen
 * 
 *      Search by:  
*                  Username, 
*                  Album Title, 
*                  events, 
*                  location: (town, city) New Brunswick, NJ or  Rutgers University (New Brunswick)
*                  place: Rutgers University (New Brunswick), Times Square, Tieman Square
 * 
 *      
 *          Disovery
 *              Trending/Popular
 *              Local
 *              Events
 *              
 * 
 * 
 *      Query parameters: popularity as clicked per search term
 * 
 *          Username, location, place : By popularity
 *          Album title and events: By likes 
 * 
 * 
 *          Disovery parameters: : By likes and paid sponsorships
 * 
 *          Local: Local businesses
 *          Events: Global event like star wars premier
 * 
 * 
 * 
 *      How to get random 40 items
 *        
 *          Trending/Popular
 * 
 *      SELECT *
 *      FROM popular_albums
 *      WHERE likes = ?  AND views = ? 
 *      
 * 
 * 
 * 
 * 
 */


let kExpireDays = "expire";
var DEFAULT_DAYS_TO_EXPIRE = 2;

let kStartWithUnseen       = "StartWithNew";
let kPreviousItems          = "PreviousItems"

let kFirstUrl = "firstUrl";
let kSignedFirstUrl = "signedFirstUrl";




    function isStringWithLength(word) {
        return typeof word === 'string' && word.length > 0;
    }

    // function isNumber(number) {
    //     return typeof number === 'number';
    // }
    function isNumber (o) {
        return ! isNaN (o-0) && o !== null && o !== "" && o !== false;
    }

    function isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
    }




let kFollowersListAdd  = "followersToAdd";
let kFollowersListRemove = "followersToRemove";

        /**
         * 
         *  Used when the app is in Low Celluar/ Use less Data Mode
         * 
         *  This function will be called by the user when they click on an album.
         * 
         */

console.log('Loading function 9');

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
    //     // responseCode = JSON.parse(requestBody)['test-status'];
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

    context.callbackWaitsForEmptyEventLoop = false;

    


    function finalAppResponse( responseBody) {
        console.log("responseBody: " + JSON.stringify(responseBody));

        var response = {
            statusCode: responseCode,
            headers: {
                "x-custom-header" : "custom header value"
            },
            body: JSON.stringify(responseBody)
        };
        console.log("response: " + JSON.stringify(response));
        callback( null, response);
    } 




 
    let errorMessageDeleteAlbum = APP_NAME + " cannot delete album this album at this time. Try again shortly.";

    function uploadErrorMessage() {

        if (isStringWithLength(mediaContentType) && (mediaContentType === MediaType.Photo || mediaContentType === MediaType.Video)) {
            return APP_NAME + " cannot upload your " + mediaContentType + " at this time. Try again shortly.";
        } else {
            return APP_NAME + " cannot upload your content at this time. Try again shortly.";
        }
    }

    


    // Rollback on failure
    function rollbackAppError(message) {
        var response = {};
        response[kActive]       = ActiveValues.Active;
        response[kErrorMessage] = message;
        
        connection.rollback(function() { 
            finalAppResponse( response);
        }); 
    }

    function commitTransaction(albumId) {

        // Commit queries
        connection.commit(function(err) {
            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } else  {
                console.log('successful commit!');
                
                var response = {};
                response[kActive]  = ActiveValues.Active;
                response[kAlbumId] = albumId;
                response[kSuccess] = true;
                finalAppResponse( response);
            }
        });
    }







    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    

    // Parameters

    var userId      = cognitoIdentityId;    
    var acctId      = requestBody[kAcctId];
    


    var guid        = requestBody[kGuid];
    var albumId     = requestBody[kAlbumId];
    var fguid       = requestBody[kFGuid];





    /**
     

        SELECT *, COUNT(replies.replyToId)
        FROM album_comments c
            LEFT JOIN album_comments replies
            ON c.ownerGuid = replies.ownerGuid AND albumID = replies.albumID AND c.commentId = replies.replyToId
        
                INNER JOIN profile
                ON profile .guid = c.commenterId
        WHERE ownerId = ? AND albumID = ? AND c.replyToId IS NULL
        GROUP BY commentId
        
        
        
        
        SELECT c.guid, c.album_id, c.comment_id, c.commenter_guid, c.comment, c.timestamp, 
        r.comment_id as reply_id, r.parent_id, r.commenter_guid AS reply_commenter, r.comment AS reply, r.timestamp AS reply_timestame
        FROM album_comments c
            LEFT JOIN album_comments AS r
            ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id
            
                    -- 	LEFT JOIN album_comments AS r2
        -- 				ON c.guid = r2.guid AND c.album_id = r2.album_id AND r2.parent_id = c.comment_id
                 WHERE c.guid = 'bob' AND c.album_id = '1' AND c.parent_id IS NULL
                --  GROUP BY c.comment_id
                 ORDER BY c.timestamp DESC, r.timestamp DESC
        
        
        // Retuen all comments with number of replies
        SELECT c.guid, c.album_id, c.comment_id, c.commenter_guid, c.comment, c.timestamp, c.number_of_replies
        FROM album_comments c
        WHERE c.guid = 'bob' AND c.album_id = '1' AND c.parent_id IS NULL
        ORDER BY c.timestamp
                 
        
        SELECT c.guid, c.album_id, c.comment_id, c.commenter_guid, c.comment, c.timestamp, c.number_of_replies, c.last_reply_id
        FROM album_comments c
            LEFT JOIN album_comment_reply AS r
            ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id
        WHERE c.guid = 'bob' AND c.album_id = '1'
        ORDER BY c.timestamp
                 
        

     */

        /**
         * Steps: New Comment
         * 
         * 1) Insert comment
         * 2) Update album's number_of_comments, number_of_responses
         * 3) Send notification to user of album
        
         * Steps: New Reply
         * 
         * 1) Insert reply
         * 2) Update comment's number_of_replies
         * 3) Update album's number_of_comments, number_of_responses
         * 4) Send notification to user of comment
        
        
        
         */
        
         
         
        //  guid = ?, album_id = ?, comment_id = ?, commenter_guid = ?, comment = ?, 

        

    function deleteComment() {


    }


    function deleteComments() {
        

    }

  // Inserts a comment with the cmoment ID already existing
  function reinsertOldComment(albumOwnerGuid, albumId, commenterGuid, comment, commentID) {
    
            connection.query({
                sql     : "INSERT INTO album_comments (guid, album_id, comment_id, commenter_guid, comment) SELECT ?, ?, ?, 0), ?, ? FROM `album_comments` WHERE guid = ? AND album_id  = ?",
                values  : [ albumOwnerGuid, albumId, commentID, commenterGuid, comment, albumOwnerGuid, albumId]
            },
            function (err, results, fields) {
    
                console.log('Results:', JSON.stringify(results, null, 2));
                
                if (err) {
                    rollbackErrorGenericMessage(err);
                } else if (results && results.affectedRows == 1) {
    
    
    
        }
    // Inserts a new comment. So it sets a comment id
    function insertComment(albumOwnerGuid, albumId, commenterGuid, comment) {

        connection.query({
            sql     : "INSERT INTO album_comments (guid, album_id, comment_id, commenter_guid, comment) SELECT ?, ?, coalesce(MAX(`comment_id`) + 1, 0), ?, ? FROM `album_comments` WHERE guid = ? AND album_id  = ?",
            values  : [ albumOwnerGuid, albumId, commenterGuid, comment, albumOwnerGuid, albumId]
        },
        function (err, results, fields) {

            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                rollbackErrorGenericMessage(err);
            } else if (results && results.affectedRows == 1) {



    }

    function inesrtComments() {

    }


    function incrementAlbumCommentCount(albumOwnerGuid, albumId, callback) {

        connection.query({
            sql     : "UPDATE `user_album` SET `number_of_replies` = `number_of_replies` + 1 WHERE `guid` = ? AND id = ?",
            values  : [ albumOwnerGuid, albumId ]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            callback(err, results);
        });      
    }


    function decrementAlbumCommentCount(albumOwnerGuid, albumId, callback) {
        
        connection.query({
            sql     : "UPDATE `user_album` SET `number_of_replies` = `number_of_replies` - 1 WHERE `guid` = ? AND id = ?",
            values  : [ albumOwnerGuid, albumId ]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            callback(err, results);
        });      
    }



    function resetAlbumCommentCount(albumOwnerGuid, albumId, callback) {
        
        connection.query({
            sql     : "UPDATE `user_album` SET `number_of_replies` = 0 WHERE `guid` = ? AND id = ?",
            values  : [ albumOwnerGuid, albumId ]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            callback(err, results);
        });      
    }









    function getCommentsFromResults(results) {
        
        console.log("getCommentsFromResults called indeed");
        
        var commentList = [];

        results.forEach((result) => {

            var comment = {};
            comment[kCommentId] = result.c_comment_id;
            comment[kGuid]      = result.c_commenter_guid;
            comment[kComment]   = result.c_comment;
            comment[kTimestamp] = result.c_timestamp;
            comment[kCount]     = result.c_number_of_replies;
            
            
            var profile = {};
            profile[kGuid]       = result.c_guid;   
            profile[kUserName]   = result.c_username;
            profile[kFullName]   = result.c_fullname;
            profile[kVerified]   = intToBool(result.c_verified);
            profile[kProfileUrl] = result.c_image_url;
            profile[kPrivate]    = result.c_profile_is_private;
            profile[kAllowFollowersView]  = intToBool(result.c_allow_view_followers);
            profile[kAllowFollowingsView] = intToBool(result.c_allow_view_followings);
            
            var popularity            = result.c_popularity;
            profile[kFollowersCount]  = result.c_followers;
            profile[kFollowingCount]  = result.c_following;
            profile[kScore]           = popularity === null ? 0 : popularity;
            
            comment[kProfile] = profile;
            
            // result.last_reply_id !== undefined
            if ( result.last_reply_id !== null) {
                
                var replyObject = {};
                

                var reply = {};
                reply[kParentId]  = result.r_parent_id;
                reply[kCommentId] = result.r_comment_id;
                reply[kGuid]      = result.r_commenter_guid;
                reply[kComment]   = result.r_comment;
                reply[kTimestamp] = result.r_timestamp;
                reply[kCount]     = result.r_number_of_replies;
                

                var profile = {};
                profile[kGuid]       = result.r_guid;   
                profile[kUserName]   = result.r_username;
                profile[kFullName]   = result.r_fullname;
                profile[kVerified]   = intToBool(result.r_verified);
                profile[kProfileUrl] = result.r_image_url;
                profile[kPrivate]    = result.r_profile_is_private;

                profile[kAllowFollowersView]  = intToBool(result.r_allow_view_followers);
                profile[kAllowFollowingsView] = intToBool(result.r_allow_view_followings);
                
                var popularity            = result.r_popularity;
                profile[kFollowersCount]  = result.r_followers;
                profile[kFollowingCount]  = result.r_following;
                profile[kScore]           = popularity === null ? 0 : popularity; 

                reply[kProfile] = profile;

                comment[kReply] = reply;
            }

               
            commentList.push(comment);
        });
    
        return commentList;
    }


    // UNIX_TIMESTAMP(`create_date`)

    // SELECT c.guid AS c_guid, c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.commenter_guid AS c_commenter_guid, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id,
    //     r.parent_id AS r_parent_id, r.comment_id AS r_comment_id, r.commenter_guid AS r_commenter_guid, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies,    
    //     c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following,
    //     r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following
    // FROM album_comments c
    // INNER JOIN profile AS c_profile
    // ON c.commenter_guid = c_profile.guid
    //     LEFT JOIN album_comment_reply AS r 
    //     ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id 
    //         LEFT JOIN profile AS r_profile
    //         ON r.commenter_guid = r_profile.guid 
    // WHERE c.guid = ? AND c.album_id = ? AND c.timestamp <= FROM_UNIXTIME(?)
    // ORDER BY c.timestamp

    


        
    function loadComments(ownerGuid, albumId, guid) {
    
        hasPermissionToAlbum(ownerGuid, albumId, guid, function (permissionAllowed) {
            
            if (permissionAllowed) {
                
                connection.query({
                    sql     : "SELECT c.guid AS c_guid, c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.commenter_guid AS c_commenter_guid, c.comment AS c_comment, c.timestamp AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, r.parent_id AS r_parent_id, r.comment_id AS r_comment_id, r.commenter_guid AS r_commenter_guid, r.comment AS r_comment, r.timestamp AS r_timestamp, r.number_of_replies AS r_number_of_replies, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following, r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN album_comment_reply AS r ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id LEFT JOIN profile AS r_profile ON r.commenter_guid = r_profile.guid WHERE c.guid = ? AND c.album_id = ? ORDER BY c.timestamp",
                    values  : [guid, albumId]
                }, 
                function (err, results, fields) {

                    console.log("results: " + results);

                    if (err) {

                        rollbackErrorResponse(err);

                    } else if (results) {
                        
                        getCommentsFromResults(results)

                    } else {
                        
                    }
                });
            } else {

            }
        });
    }
        
                 

        
    function loadMoreComments(guid, albumId, lastTimestamp) {

        connection.query({
            sql     : "SELECT c.guid AS c_guid, c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.commenter_guid AS c_commenter_guid, c.comment AS c_comment, c.timestamp AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, r.parent_id AS r_parent_id, r.comment_id AS r_comment_id, r.commenter_guid AS r_commenter_guid, r.comment AS r_comment, r.timestamp AS r_timestamp, r.number_of_replies AS r_number_of_replies, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following, r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN album_comment_reply AS r ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id LEFT JOIN profile AS r_profile ON r.commenter_guid = r_profile.guid WHERE c.guid = ? AND c.album_id = ? AND c.timestamp <= FROM_UNIXTIME(?) ORDER BY c.timestamp",
            values  : [guid, albumId, lastTimestamp]
        }, 
        function (err, results, fields) {

            console.log("results: " + results);

            if (err) {

                rollbackErrorResponse(err);

            } else if (results) {
                    
                getCommentsFromResults(results)

            } else {
                
            }
        });
    }
    /**
    
        SELECT profile.is_private AS userIsPrivate, ua.is_private AS album_is_private, friends.status AS follow_status, ap.guid AS has_ap
        FROM profile
            INNER JOIN user_album AS ua
            ON profile.guid = ua.guid

                LEFT JOIN friends
                ON friends.guid2 = ua.guid
            
                    LEFT JOIN album_permissions AS ap
                    ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id
        WHERE user_album.guid = ? AND ua.id = ? AND friends.guid1 = ? AND friends.`status` = ?      
     */
    


    // 1) If userprofile is public and album is public  
    // 2) If userprofile is public and album is private and user is friend and has permission  
    
    //             OR
                
    // 3) userprofile is private and album is public and user is friend 
    // 4) userprofile is private and album is private and user has permission

    // has access to album
    function hasPermissionToAlbum(ownerGuid, albumId, guid, callbackWithPermission) {

        connection.query({
            sql     : "SELECT profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, ap.guid AS has_ap FROM profile INNER JOIN user_album AS ua ON profile.guid = ua.guid LEFT JOIN friends ON friends.guid2 = ua.guid LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id WHERE user_album.guid = ? AND ua.id = ? AND friends.guid1 = ? AND friends.`status` = ?",
            values  : [ ownerGuid, albumId, guid, Relationship.IsFollowing]
        }, 
        function (err, results, fields) {

            console.log('results:', JSON.stringify(results, null, 2));
            
            if (err) {

                callbackWithPermission(false, commentsOn);
                
            } else if (results && results.length === 1) {

                let userIsPrivate       = results[0].user_is_private
                let albumIsPrivate      = results[0].album_is_private
                let followStatus        = results[0].follow_status
                let hasAlbumPermission  = results[0].has_ap
                let commentsOn          = results[0].comments_on
                

                if (!userIsPrivate && ( !albumIsPrivate || hasAlbumPermission )) {

                    // okay
                    callbackWithPermission(true, commentsOn);              
                    
                } else if ( !albumIsPrivate && followStatus === Relationship.IsFollowing || hasAlbumPermission ) {
                                            
                    // okay
                    callbackWithPermission(true, commentsOn);            
                    
                } else {

                    callbackWithPermission(false, commentsOn);             
                }
            } else {
                
                callbackWithPermission(false, commentsOn);             
            }
        });
    }


    function loadRepliesToComment(ownerGuid, albumId, commentId ) {

        // SELECT r.parent_id, r.comment_id AS r_comment_id, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies, r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following 
        // FROM album_comment_reply r
        //     INNER JOIN profile 
        //     ON r.commenter_guid = profile.guid 
        // WHERE r.guid = ? AND r.album_id = ? AND r.parent_id = ?
        // ORDER BY c.timestamp",

    }


    function loadMoreReplies() {
    
    }

    // Check if user has permission to post comments
    // user is friend
    // album alllows comments
    function postComment(guid, albumId, commenterGuid, comment) {
        // INSERT INTO album_comments SET guid = ?, album_id = ?, comment_id = ?, commenter_guid = ?, comment = ?, 
        
        connection.query({
            sql     : "INSERT INTO album_comments (guid, album_id, comment_id, commenter_guid, comment) SELECT ?, ?, coalesce(MAX(`comment_id`) + 1, 0), ?, ? FROM `album_comments` WHERE guid = ? AND album_id  = ?",
            values  : [ guid, albumId, commenter_guid, comment, guid, albumId]
        }, 
        function (err, results, fields) {

            console.log("results: " + results);

            if (err) {

                rollbackErrorResponse(err);

            } else if (results) {
                    
                getCommentsFromResults(results)

            } else {
                
            }
        });
    }




    function editComment() {
        
    }

    function deleteComment() {

    }

    function flagComment() {

    }

    function ownerDeleteComment() {

    }



    function postReply() {

        "INSERT INTO album_comment_reply (guid, album_id, parent_id, comment_id, commenter_guid, comment) SELECT ?, ?, ?, coalesce(MAX(`comment_id`) + 1, 0), ?, ? FROM `album_comment_reply` WHERE guid = ? AND album_id  = ? AND parent_id  = ?"

        
        INSERT INTO album_comment_reply
        SET guid = ?, album_id = ?, comment_id = ?, commenter_guid = ?, comment = ?, 
        sql = 'INSERT INTO user_album_likes SET `guid` = ?, `fguid` = ?, `album_id` = ?, `liked` = ? ON DUPLICATE KEY UPDATE liked=VALUES(liked)';
        
    }


    function editReply() {

    }

    function deleteReply() {

    }

    function flagReply() {

    }

    function ownerDeleteReply() {

    }


         
    // MentionedInAlbum      : 5,
    // MentionedInComment    : 6,
    // ReceivedComment       : 7,
    // ReceivedReplyToComment: 8


    /*
    
    SELECT c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id
    FROM album_comments c 
    WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?
        INNER JOIN profile AS c_profile 
        ON c.commenter_guid = c_profile.guid 
            LEFT JOIN friends AS c_friends 
            ON c_friends.guid1 = c.commenter_guid AND c_friends.guid2 = c.guid 
    WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND (c_friends.blocked = 0 OR c_friends.guid1 = ?) 
    ORDER BY c.timestamp DESC";

    */
    function loadComments(ownerGuid, albumId, fguid) {        
        console.log("loadComments");        
        var sqlQuery   = "SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN friends AS c_friends ON c_friends.guid1 = c.commenter_guid AND c_friends.guid2 = c.guid WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND (c_friends.blocked = 0 OR c_friends.guid1 = ?) ORDER BY c.timestamp DESC";
        var parameters = [ownerGuid, albumId, fguid];
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }
        
    



    // Returns comment that mentions user
    function getCommentMentioningUser(ownerGuid, albumId, commentId, fguid) {
        console.log("getCommentMentioningUser");        
        
        var sqlQuery = "SELECT c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id FROM album_comments c WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";
        var parameters = [ownerGuid, albumId, commentId];
        
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }


    // Same as above?
    // Returns comment on album by a user from notification
    function getCommentOnUserAlbum(ownerGuid, albumId, commentId, fguid) {
        console.log("getCommentOnUserAlbum");        
        
        var sqlQuery = "SELECT c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id FROM album_comments c WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";
        var parameters = [ownerGuid, albumId, commentId];
        
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);

        // SELECT * 
        // FROM comments 
        // WHERE guid = ? AND album_id = ? AND comment_id = ?


    }
    
    // Returns reply to a our comment
    // Get the parentId, and get that comment 

    // var sqlQuery   = "SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN friends AS c_friends ON c_friends.guid1 = c.commenter_guid AND c_friends.guid2 = c.guid WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND (c_friends.blocked = 0 OR c_friends.guid1 = ?) ORDER BY c.timestamp DESC";
    //     r.parent_id AS r_parent_id, r.comment_id AS r_comment_id, r.commenter_guid AS r_commenter_guid, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies,    

    
    function getReplyToComment(ownerGuid, albumId, commentId, fguid) {
        console.log("getReplyToComment");        
        
        var sqlQuery = "SELECT c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, r.parent_id AS r_parent_id, r.comment_id AS r_comment_id, r.commenter_guid AS r_commenter_guid, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies FROM album_comments c LEFT JOIN comments AS r ON c.guid = r.guid AND c.album_id = r.album_id AND c.parent_d  = r.comment_id WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";
        var parameters = [ownerGuid, albumId, commentId];
        
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }
        
    

    function queryLoggedInUser() {
        
        connection.query({
            sql: 'SELECT `guid`, `active` FROM `users` WHERE `id` = ? AND `acctid` = ?', 
            values: [userId, acctId]
        }, function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else if (results && results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));

                console.log('User exists, returning current info');

                if ( results[0].active != ActiveValues.Active ) {
                    finalAppResponse( activeResponse( results[0].active, activeErrorMessage( results[0].active )));
                    return;
                }
                
                var guid = results[0].guid;

                
                var response = {};
                response[kActive]  = ActiveValues.Active;
                response[kErrorMessage] = errorMessage;
                response[kGuid] = guid;

                finalAppResponse( response ); 
                
            } else {
                finalAppResponse( activeResponse(ActiveValues.DoesNotExist, activeErrorMessage(ActiveValues.DoesNotExist) ));
            }
         });
    }

    queryLoggedInUser();
}