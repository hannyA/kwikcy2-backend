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
 var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
 



 Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};



// var accessKey = process.env.ACCESS_KEY;       
// var secretKey = process.env.SECREY_KEY;

//  console.log('accessKey: ' + accessKey);
//  console.log('secretKey: ' + secretKey);
//  console.log('');
// console.log('');
// console.log('');


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

let kCount              = "count";
let kCommentCount       = "commentCount";
let kCommentTotalCount  = "commentTotalCount";



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


let kBookmarked  = "BookmarkAlbum";
let kUnbookmarked = "UnbookmarkAlbum";

let kAlbumOwnerGuid = "albumOwner";





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
    if (err !== null) {
        console.log(err);
        console.error('Error Stack is: ' + err.stack);
    }

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
let kNewSecion          = "newSection";




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


function albumIdResponse( albumId) {
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


function errorResponseGeneric(error) {
    return errorResponseCustom(error, ErrorMessageGeneric)
}

function errorResponseCustom(error, message) {
    if (error !== null) {
        printError(error);
    }
    return errorResponse(message);
}


function errorResponse(errorMessage) {
    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kErrorMessage] = errorMessage;
    return response;
}



let kOtherMessage = "otherMessage";
function otherResponse(message) {
    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kOtherMessage] = message;
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
cd albums; ./compress.sh api-albums Rail-PrivateAlbums-mobilehub-1247959479; cd ..

./compress.sh api-albums Rail-PrivateAlbums-mobilehub-1247959479


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
    console.log('Loading function 10');
    
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





    context.callbackWaitsForEmptyEventLoop = false;


//  console.log('accessKey: ' + accessKey);
//  console.log('secretKey: ' + secretKey);


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
    function rollbackErrorGenericMessage(error) {
        rollbackErrorMessage(error, ErrorMessageGeneric);
    }


    // Rollback on failure
    function rollbackErrorMessage(error, message) {
        printError(error);
        
        var response = {};
        response[kActive]       = ActiveValues.Active;
        response[kErrorMessage] = message;
        
        connection.rollback(function() { 
            finalAppResponse( response);
        }); 
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

    function commitAlbumTransaction(albumId) {

        // Commit queries
        connection.commit(function(err) {
            if (err) {
                rollbackErrorGenericMessage(err);
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



    // Parameters for gettings album media content
    var lastMediaUrl   = requestBody[kMediaURL];
    var lastMediaTime  = requestBody[kTimestamp];
    var MAX_MEDIA_RESULTS = requestBody[kNumberOfItems];

    // Delete media
    var mediaUrl    = requestBody[kMediaURL];

    var flagType    = requestBody[kType];


    
    var numberOfAlbums = requestBody[kCount];
    var lastAlbumId    = requestBody.lastAlbumId;
    var lastAlbumTitle = requestBody[kTitle];


    // Parameters for listing friends albums
    var isRefreshing    = requestBody[kIsRefreshing]; // Bool
    var lastTimestamp   = requestBody[kLastViewedMediaTimestamp];
    var lastAlbumWasNew = requestBody[kLastAlbumIsNew]; // Bool
    var pageIndex       = requestBody[kIndex]; // number


    var lastUsername    = requestBody[kUserName]; // string
    var MAX_ALBUM_RESULTS     = requestBody[kNumberOfItems];  // int


/**
 * 
    let kFollowersListAdd  = "followersToAdd";
    let kFollowersListRemove = "followersToRemove";

 */
    // For creating albums
    var title                = requestBody[kTitle];
    var followersAddList     = requestBody[kFollowersListAdd];
    var followersDeleteList  = requestBody[kFollowersListRemove];


    // var isSubmittingToAll   = requestBody[kInclusive];

    var isPrivate   = requestBody[kPrivate];

    var action      =  requestBody["action"];




    let kIsNew = "isNew";

    // Upload  Media
    var tmpS3Key      = requestBody[kTmpMediaKey];
    var tmpS3CoverKey = requestBody[kTmpCoverKey];
    
    var mediaContentType        = requestBody[kType]; // photo, video, gif ?

    var timelimit   = requestBody[kTimelimit]; // Video, Image, Gif ?

    // var albumList    = requestBody[kAlbums]; // array of albumId and isNew bit

    var albumIds = requestBody[kAlbumIds];
    

    // var albumIds    = requestBody[kAlbumIds];
    
    
    var daysTillExpire    = requestBody[kExpireDays];

    var startingWithNewMedia = requestBody[kStartWithUnseen];
    var getPreviousItems     = requestBody[kPreviousItems];









    if ( !isInt(MAX_MEDIA_RESULTS) ||  MAX_MEDIA_RESULTS > 40) {
        MAX_MEDIA_RESULTS = 40;
    }
    
    if ( !isInt(MAX_ALBUM_RESULTS) ||  MAX_ALBUM_RESULTS > 20) {
        MAX_ALBUM_RESULTS = 20;
    }

    console.log('UserId:', JSON.stringify(userId, null, 2));
    console.log("acctId: " + acctId);
    console.log("isRefreshing: " + isRefreshing);
    console.log("lastAlbumWasNew: " + lastAlbumWasNew);
    console.log("pageIndex: " + pageIndex);
    console.log("lastUsername: " + lastUsername);
    // console.log("MAX_MEDIA_RESULTS: " + MAX_MEDIA_RESULTS);
    // console.log("MAX_ALBUM_RESULTS: " + MAX_ALBUM_RESULTS);
    



    console.log("ClientID: " + userId);
    console.log("albumId: "  + albumId);

    console.log("lastMediaUrl: "  + lastMediaUrl);
    console.log("lastMediaTime: " + lastMediaTime);
 
    console.log("lastTimestamp: " + lastTimestamp);

 
    // Error checking user input
    if ( userId === undefined || userId === null || userId.length > 100) {
        console.error("userId is bad: " + userId);
        finalAppResponse( activeResponse( ActiveValues.Unknown, activeErrorMessage( ActiveValues.Unknown )));
        return;
    }
    if ( acctId === undefined || acctId === null || acctId.length > 10 ) {
        console.error("acctId is bad: " + acctId);
        finalAppResponse( activeResponse( ActiveValues.Unknown, activeErrorMessage( ActiveValues.Unknown )));
        return;
    }




        console.log("1");


    var maxDuplicateRetires = 3;
    


    /**
     * ======================================================================================================
     * ======================================================================================================
     * ======================================================================================================
     *  useralbums.js
     * 
     *                                 Listing My albums
     * 
     * ======================================================================================================
     * ======================================================================================================
     * ======================================================================================================
     * 
     * 
     * 
     * 
     * 
     *  SELECT `id`, first_url, `count`, `title`, `views`, `is_private`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` 
     *  FROM `bookmarked_album` 
     *  WHERE `guid` = ? 
     *  ORDER BY `timestamp` DESC 
     *  LIMIT ?';


     
     


        TODO: FIX all places where "INNER JOIN album_permissions AS ap " is used


        SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
        FROM `bookmarked_album` AS ba 
            INNER JOIN  `user_album` AS ua 
            ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id 
            LEFT JOIN `friends` 
            ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
                INNER JOIN album_permissions AS ap 
                ON ua.`is_private` = 0 OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
                    INNER JOIN `profile` 
                    ON ua.guid = profile.guid 
        WHERE ua.expire_date IS NULL OR ua.expire_date > NOW() AND ba.timestamp <= FROM_UNIXTIME(?) 
        ORDER BY ba.`timestamp` DESC LIMIT ?";

        


        
        SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
        FROM `bookmarked_album` AS ba 
            INNER JOIN `user_album` AS ua 
            ON ba.fguid = ua.guid AND ba.album_id = ua.id 
                LEFT JOIN `friends` 
                ON friends.guid1 = ba.guid AND friends.guid2 = ua.guid AND friends.`status` = ? 
                    INNER JOIN album_permissions AS ap 
                    ON ua.guid = ba.guid OR ua.`is_private` = 0 OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
                        INNER JOIN `profile` 
                        ON ua.guid = profile.guid 
        WHERE ba.guid = ? AND ua.expire_date IS NULL OR ua.expire_date > NOW() 
        ORDER BY ba.`timestamp` DESC 
        LIMIT ?";








        TODO: FIX all places where "INNER JOIN album_permissions AS ap " is used


        SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`-- , `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
        FROM `bookmarked_album` AS ba 
            INNER JOIN `user_album` AS ua 
            ON ba.fguid = ua.guid AND ba.album_id = ua.id 
				LEFT JOIN `friends` 
				ON friends.guid1 = ba.guid AND friends.guid2 = ua.guid AND friends.`status` = ?
                     LEFT JOIN album_permissions AS ap 
                     ON ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id
                         INNER JOIN `profile` 
                          ON ua.guid = profile.guid 
        WHERE ba.guid = ? AND (ua.guid = ba.guid OR ua.`is_private` = 0 OR ap.guid  IS NOT NULL) AND ua.expire_date IS NULL OR ua.expire_date > NOW() 
        ORDER BY ba.`timestamp` DESC 
        LIMIT ?";
     */


     

    // TODO: FIX all places where "INNER JOIN album_permissions AS ap " is used



    /**
     * 
     * 
     * first_timestamp
     * create_date
     * newest_media_timestamp
     * bookmarked_timestamp
     * 
     



    SELECT um.popularity, ual.`liked`, ba.album_id as bookmarked, ua.`guid`, ua.comments_on, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username, `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, `profile`.fullname, profile.domain, `profile`.`about`, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
    FROM album_timeline AS tl 
        INNER JOIN `user_album` AS ua 
        ON tl.fguid = ua.guid AND tl.album_id = ua.id 
            INNER JOIN `profile` 
            ON ua.guid = profile.guid 
                LEFT JOIN album_last_viewed_media AS alvm 
                ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id 
                    LEFT JOIN user_metrics AS um 
                    ON ua.guid = um.guid 
                        LEFT JOIN `user_album_likes` AS ual 
                        ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id 
                            LEFT JOIN bookmarked_album ba 
                            ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id 
    WHERE tl.guid = ? AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) 
    ORDER BY tl.date DESC 
    LIMIT ?";


     SELECT UNIX_TIMESTAMP(ba.timestamp) AS bookmark_timestamp, ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
     FROM `bookmarked_album` AS ba 
        INNER JOIN `user_album` AS ua 
        ON ba.fguid = ua.guid AND ba.album_id = ua.id 
            LEFT JOIN `friends` 
            ON friends.guid1 = ba.guid AND friends.guid2 = ua.guid AND friends.`status` = ? 
          
            LEFT JOIN user_metrics AS um 
                ON ua.guid = um.guid 
                    LEFT JOIN `user_album_likes` AS ual 
                        ON ual.guid = ba.guid AND ual.fguid = ua.guid AND ual.album_id = ua.id 
                       

                LEFT JOIN album_permissions AS ap 
                ON ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id 
                    INNER JOIN `profile` 
                    ON ua.guid = profile.guid 
    WHERE ba.guid = ? AND (ua.guid = ba.guid OR ua.`is_private` = 0 OR ap.guid  IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) 
    ORDER BY ba.`timestamp` DESC LIMIT ?";


    um.popularity, ual.`liked`, ba.album_id as bookmarked, ua.`guid`, ua.comments_on, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username, `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, `profile`.fullname, profile.domain, `profile`.`about`, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM album_timeline AS tl INNER JOIN `user_album` AS ua ON tl.fguid = ua.guid AND tl.album_id = ua.id INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id LEFT JOIN user_metrics AS um ON ua.guid = um.guid LEFT JOIN `user_album_likes` AS ual ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id WHERE tl.guid = ?                                AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) ORDER BY tl.date DESC LIMIT ?";


     */

    function listMyBookmarkedAlbums(guid) {
        console.log("listMyBookmarkedAlbums: " + lastTimestamp);
 
        var albumSqlQuery = "SELECT um.popularity, ual.`liked`, UNIX_TIMESTAMP(ba.timestamp) AS bookmark_timestamp, ua.`guid`, ua.comments_on, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `bookmarked_album` AS ba INNER JOIN `user_album` AS ua ON ba.fguid = ua.guid AND ba.album_id = ua.id LEFT JOIN `friends` ON friends.guid1 = ba.guid AND friends.guid2 = ua.guid AND friends.`status` = ? LEFT JOIN user_metrics AS um ON ua.guid = um.guid LEFT JOIN `user_album_likes` AS ual ON ual.guid = ba.guid AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id INNER JOIN `profile` ON ua.guid = profile.guid WHERE ba.guid = ? AND (ua.guid = ba.guid OR ua.`is_private` = 0 OR ap.guid  IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) ORDER BY ba.`timestamp` DESC LIMIT ?";
        // var albumSqlQuery = "SELECT UNIX_TIMESTAMP(ba.timestamp) AS bookmark_timestamp, ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `bookmarked_album` AS ba INNER JOIN `user_album` AS ua ON ba.fguid = ua.guid AND ba.album_id = ua.id LEFT JOIN `friends` ON friends.guid1 = ba.guid AND friends.guid2 = ua.guid AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id INNER JOIN `profile` ON ua.guid = profile.guid WHERE ba.guid = ? AND (ua.guid = ba.guid OR ua.`is_private` = 0 OR ap.guid  IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) ORDER BY ba.`timestamp` DESC LIMIT ?";
        // var albumSqlQuery = "SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `bookmarked_album` AS ba INNER JOIN `user_album` AS ua ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id LEFT JOIN `friends` ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? INNER JOIN album_permissions AS ap ON ua.guid = ? OR ua.`is_private` = 0 OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid WHERE ua.expire_date IS NULL OR ua.expire_date > NOW() ORDER BY ba.`timestamp` DESC LIMIT ?";
        var parameters = [ Relationship.IsFollowing, guid, numberOfAlbums ];

        
        // // var albumSqlQuery = 'SELECT `id`, `count`, `title`, `views`, `is_private`, `create_date`, `newest_media_timestamp`, `cover_album_url` FROM `user_album` WHERE `guid` = ? AND newest_media_timestamp > NOW() - INTERVAL 1 DAY AND count > 0 ORDER BY `title` LIMIT ?';
        // var albumSqlQuery = "SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `bookmarked_album` AS ba INNER JOIN  `user_album` AS ua ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id LEFT JOIN `friends` ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? INNER JOIN album_permissions AS ap ON ua.`is_private` = 0 OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid WHERE ua.expire_date IS NULL OR ua.expire_date > NOW() ORDER BY ba.`timestamp` DESC LIMIT ?";
        // var parameters = [ guid, Relationship.IsFollowing, guid, guid, numberOfAlbums ];

        if ( isStringWithLength(lastTimestamp )) {
            console.log("listMyBookmarkedAlbums not refreshing");

            
            // SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private
            // FROM `bookmarked_album` AS ba 
            //     INNER JOIN `user_album` AS ua ON ba.fguid = ua.guid AND ba.album_id = ua.id 
            //         LEFT JOIN `friends` ON friends.guid1 = ba.guid AND friends.guid2 = ua.guid AND friends.`status` = ? 
            //             LEFT JOIN album_permissions AS ap 
            //             ON ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id 
            //                 INNER JOIN `profile` ON ua.guid = profile.guid 
            // WHERE ba.guid = ? AND (ua.guid = ba.guid OR ua.`is_private` = 0 OR ap.guid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) AND ba.timestamp <= FROM_UNIXTIME(?) ORDER BY ba.`timestamp` DESC LIMIT ?";


            // FIX bookmarked_album, album_permissions, friends

            // 1) my album
            // 2) user is public and album is public
            // 3) user is public and I have Permission
            // 4) user is private and I'm follower and album is public
            // 5) public album  and I'm follower and album is private and I have permission

            albumSqlQuery = "SELECT UNIX_TIMESTAMP(ba.timestamp) AS bookmark_timestamp, ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `bookmarked_album` AS ba INNER JOIN `user_album` AS ua ON ba.fguid = ua.guid AND ba.album_id = ua.id LEFT JOIN `friends` ON friends.guid1 = ba.guid AND friends.guid2 = ua.guid AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id INNER JOIN `profile` ON ua.guid = profile.guid WHERE ba.guid = ? AND (ua.guid = ba.guid OR ua.`is_private` = 0 OR ap.guid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) AND ba.timestamp <= FROM_UNIXTIME(?) ORDER BY ba.`timestamp` DESC LIMIT ?";
            parameters = [ Relationship.IsFollowing, guid, lastTimestamp, numberOfAlbums ];


            // albumSqlQuery = "SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `bookmarked_album` AS ba INNER JOIN `user_album` AS ua ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id LEFT JOIN `friends` ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? INNER JOIN album_permissions AS ap ON ua.guid = ? OR ua.`is_private` = 0 OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid WHERE ua.expire_date IS NULL OR ua.expire_date > NOW() ORDER BY ba.`timestamp` DESC LIMIT ?";

            // // albumSqlQuery = "SELECT ua.`guid`, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `bookmarked_album` AS ba INNER JOIN  `user_album` AS ua ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id LEFT JOIN `friends` ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? INNER JOIN album_permissions AS ap ON ua.`is_private` = 0 OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid WHERE ua.expire_date IS NULL OR ua.expire_date > NOW() AND ba.timestamp <= FROM_UNIXTIME(?) ORDER BY ba.`timestamp` DESC LIMIT ?";
            // parameters = [ guid , guid, Relationship.IsFollowing, guid, lastTimestamp, numberOfAlbums ];
        } else {
            console.log("listMyBookmarkedAlbums is refreshing");
        }
        
        getNewAlbumResults(guid, albumSqlQuery, parameters);

    }

    function listMyOpenAlbums(guid) {
        console.log("listMyOpenAlbums");

        

/**
 * SELECT `id`, `count`, `title`, `views`, `is_private`, `create_date`, `newest_media_timestamp`, `cover_album_url` 
 *  FROM `user_album` WHERE `guid` = ? AND count > 0  AND create_date > NOW() - INTERVAL 1 DAY OR create_date > NOW() - INTERVAL 20 MINUTE )
 *  ORDER BY `newest_media_timestamp` 
 *  LIMIT ?';
 * 
 * 
 * 
 *      SELECT `id`, explicit, explicit_override, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, `title`, `views`, `is_private`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` 
        FROM `user_album` 
        WHERE `guid` = ? AND (create_date > NOW() - INTERVAL 1 DAY OR create_date > NOW() - INTERVAL 20 MINUTE )
        ORDER BY `create_date` DESC 
        LIMIT ?';


 */


        // var albumSqlQuery = 'SELECT `id`, `count`, `title`, `views`, `is_private`, `create_date`, `newest_media_timestamp`, `cover_album_url` FROM `user_album` WHERE `guid` = ? AND newest_media_timestamp > NOW() - INTERVAL 1 DAY AND count > 0 ORDER BY `title` LIMIT ?';
        var albumSqlQuery = 'SELECT `id`, comments_on, explicit, explicit_override, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, likes, dislikes, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` WHERE `guid` = ? AND (create_date > NOW() - INTERVAL 1 DAY AND count > 0) ORDER BY `create_date` DESC LIMIT ?';
        var parameters = [ guid, numberOfAlbums ];
       
        if ( isStringWithLength(lastTimestamp )) {
            albumSqlQuery = 'SELECT `id`, comments_on, explicit, explicit_override, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`,  likes, dislikes, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` WHERE `guid` = ? AND (create_date > NOW() - INTERVAL 1 DAY AND count > 0) AND newest_media_timestamp <= FROM_UNIXTIME(?) ORDER BY `create_date` DESC LIMIT ?';
            parameters = [ guid , lastTimestamp, numberOfAlbums ];
        }

        connection.query({ 
            sql: albumSqlQuery,
            values: parameters, 
        },
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                
                var albums = []; 

                results.forEach((result) => {
                    console.log(result);
                    
                    // if (result.is_private) {

                    //     var mediaKey = albumMediaKey(guid, mediaUrl);
                        
                    //     var params = {  Bucket  : ALBUM_BUCKET, 
                    //                     Key     : mediaKey,
                    //                     Expires : S3_EXPIRE_LIMIT
                    //                  };
                    //     var signedUrl = s3.getSignedUrl('getObject', params);
                    //     albumInfo[kSignedUrl] = signedUrl;
                    // } 


                    
                    var albumInfo = {};

                    // if ( validator.isBase64(result.title) ) {
                    //     albumInfo[kTitle]  = titleToUTF(result.title);
                    // } else {
                    //     albumInfo[kTitle] = result.title;
                    // }
                    albumInfo[kTitle] = result.title;


                    albumInfo[kAlbumId]              = result.id;                    
                    albumInfo[kCount]                = result.count;
                    albumInfo[kCreateDate]           = result.create_date.toString();
                    if (result.newest_media_timestamp !== null) {
                        albumInfo[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                    }
                    albumInfo[kAlbumCover]           = result.cover_album_url;

                    if (result.first_url !== null) {
                        albumInfo[kFirstUrl]             = result.first_url;
                        albumInfo[kTimestamp]            = result.first_timestamp.toString();
                    }
                    
                    albumInfo[kExplicit]             = intToBool(result.explicit);
                    albumInfo[kExplicitOverride]     = intToBool(result.explicit_override);

                    albumInfo[kSignedFirstUrl]  = s3.getSignedUrl('getObject', 
                                                {   Bucket  : ALBUM_BUCKET,  
                                                    Key     : albumFirstMediaKey(guid, result.first_url), 
                                                    Expires : S3_EXPIRE_LIMIT 
                                                });

                                            
                    albumInfo[kViews]                = result.views;
                     
                    albumInfo[kLikeCount]          = result.likes;
                    albumInfo[kDislikeCount]       = result.dislikes;
                    albumInfo[kCommentCount]       = result.number_of_replies; // number of total comments and replies
                    albumInfo[kCommentTotalCount]  = result.number_of_total_replies; // number of total comments and replies
                    albumInfo[kCommentsOn]          = intToBool(result.comments_on);

                    albumInfo[kPrivate]              = intToBool(result.is_private);

                    albums.push(albumInfo);     
                });
        
                console.log("listMyOpenAlbums getAlbumsList: Number of albums: " + albums.length);

                finalAppResponse( albumsResponse(albums));
                

                console.log("=============== Done ================");
            } else {
                console.log('listMyOpenAlbums getAlbumsList Error:', JSON.stringify(error, null, 2));
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            }
        });
    }




    /**
     * 
     * 
        SELECT ual.`liked`, ba.album_id as bookmarked, `id`, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, likes, dislikes, comments_on, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, `explicit`, `explicit_override`, UNIX_TIMESTAMP(`create_date`) as create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` AS ua LEFT JOIN `user_album_likes` AS ual ON ual.guid = ua.guid AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ual.guid AND ba.fguid = ual.fguid AND ba.album_id = ual.album_id WHERE ua.`guid` = ? AND ua.count > 0 ORDER BY ua.`create_date` DESC LIMIT ?';


        SELECT ual.`liked`, ba.album_id as bookmarked, `id`, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, likes, dislikes, comments_on, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, `explicit`, `explicit_override`, UNIX_TIMESTAMP(`create_date`) as create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` AS ua LEFT JOIN `user_album_likes` AS ual ON ual.guid = ua.guid AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ual.guid AND ba.fguid = ual.fguid AND ba.album_id = ual.album_id WHERE ua.`guid` = ? AND ua.count > 0 AND create_date <= FROM_UNIXTIME(?) ORDER BY ua.`create_date` DESC LIMIT ?';

      
        
        


     */
 
    function listMyAlbums(guid) {
        console.log("listMyAlbums");

//UNIX_TIMESTAMP() FROM_UNIXTIME(?)
// UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp
// explicit explicit_override
        // var albumSqlQuery = 'SELECT `id`, `count`, `title`, `views`, `is_private`, `create_date`, `newest_media_timestamp`, `cover_album_url` FROM `user_album` WHERE `guid` = ? AND newest_media_timestamp > NOW() - INTERVAL 1 DAY AND count > 0 ORDER BY `title` LIMIT ?';
        var albumSqlQuery = 'SELECT `id`, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, likes, dislikes, comments_on, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, `explicit`, `explicit_override`, UNIX_TIMESTAMP(`create_date`) as create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` WHERE `guid` = ? AND count > 0 ORDER BY `create_date` DESC LIMIT ?';
        var parameters = [ guid, numberOfAlbums ];
       
        albumSqlQuery = 'SELECT ual.`liked`, ba.album_id as bookmarked, `id`, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, likes, dislikes, comments_on, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, `explicit`, `explicit_override`, UNIX_TIMESTAMP(`create_date`) as create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` AS ua LEFT JOIN `user_album_likes` AS ual ON ual.guid = ua.guid AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ual.guid AND ba.fguid = ual.fguid AND ba.album_id = ual.album_id WHERE ua.`guid` = ? AND ua.count > 0 ORDER BY ua.`create_date` DESC LIMIT ?';

        console.log("listMyAlbums lastTimestamp ok? ");

        if ( isStringWithLength(lastTimestamp )) {
            console.log("listMyAlbums lastTimestamp: " + lastTimestamp);

            albumSqlQuery = 'SELECT `id`, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, likes, dislikes, comments_on, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, UNIX_TIMESTAMP(`create_date`) as create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` WHERE `guid` = ? AND count > 0 AND create_date <= FROM_UNIXTIME(?) ORDER BY `create_date` DESC LIMIT ?';
            albumSqlQuery = 'SELECT ual.`liked`, ba.album_id as bookmarked, `id`, first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, `count`, likes, dislikes, comments_on, number_of_replies, number_of_total_replies, `title`, `views`, `is_private`, `explicit`, `explicit_override`, UNIX_TIMESTAMP(`create_date`) as create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, `cover_album_url` FROM `user_album` AS ua LEFT JOIN `user_album_likes` AS ual ON ual.guid = ua.guid AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ual.guid AND ba.fguid = ual.fguid AND ba.album_id = ual.album_id WHERE ua.`guid` = ? AND ua.count > 0 AND create_date <= FROM_UNIXTIME(?) ORDER BY ua.`create_date` DESC LIMIT ?';

            parameters = [ guid , lastTimestamp, numberOfAlbums ];
        }

        connection.query({
            sql: albumSqlQuery,
            values: parameters, 
        },
        function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                
                var albums = []; 

                results.forEach((result) => {
                    console.log(result);
                    
                    // if (result.is_private) {

                    //     var mediaKey = albumMediaKey(guid, mediaUrl);
                        
                    //     var params = {  Bucket  : ALBUM_BUCKET, 
                    //                     Key     : mediaKey,
                    //                     Expires : S3_EXPIRE_LIMIT
                    //                  };
                    //     var signedUrl = s3.getSignedUrl('getObject', params);
                    //     albumInfo[kSignedUrl] = signedUrl;
                    // } 
                    
                    var albumInfo = {};


                    // if ( validator.isBase64(result.title) ) {
                    //     albumInfo[kTitle]  = titleToUTF(result.title);
                    // } else {
                    //     albumInfo[kTitle] = result.title;
                    // }
                    albumInfo[kTitle] = result.title;

                    albumInfo[kAlbumId]              = result.id;                    
                    albumInfo[kCount]                = result.count;
                    albumInfo[kCreateDate]           = result.create_date.toString();
                    albumInfo[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                    albumInfo[kAlbumCover]           = result.cover_album_url;
                    
                    albumInfo[kExplicit]             = intToBool(result.explicit);
                    albumInfo[kExplicitOverride]     = intToBool(result.explicit_override);


                    albumInfo[kFirstUrl]             = result.first_url;
                    albumInfo[kTimestamp]            = result.first_timestamp.toString();
                    albumInfo[kCommentsOn]           = intToBool(result.comments_on);

                            
                    
                    albumInfo[kLike]       = result.liked;
                    
                    albumInfo[kBookmarked] = result.bookmarked !== null ? true : false;
                    


                    // // if (result.album_is_private === IsPublic) {
                    // albumInfo[kViews]                = result.views;
                    // albumInfo[kLikeCount]            = result.likes;
                    // albumInfo[kDislikeCount]         = result.dislikes;
                    // // }




                    albumInfo[kSignedFirstUrl]      = s3.getSignedUrl('getObject', 
                                                    {   Bucket  : ALBUM_BUCKET,  
                                                        Key     : albumFirstMediaKey(guid, result.first_url), 
                                                        Expires : S3_EXPIRE_LIMIT 
                                                    });

                    albumInfo[kViews]                = result.views;
                      
                    albumInfo[kLikeCount]          = result.likes;
                    albumInfo[kDislikeCount]       = result.dislikes;
                    albumInfo[kCommentCount]       = result.number_of_replies; // number of total comments and replies
                    albumInfo[kCommentTotalCount]      = result.number_of_total_replies; // number of total comments and replies
                   
                    albumInfo[kPrivate]              = intToBool(result.is_private);

                    albums.push(albumInfo);     
                });
        
                console.log("listMyAlbums getAlbumsList: Number of albums: " + albums.length);

                finalAppResponse( albumsResponse(albums));
                

                console.log("=============== Done ================");
            } else {
                console.log('listMyAlbums getAlbumsList Error:', JSON.stringify(error, null, 2));
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            }
        });
    }




    /**
     * ======================================================================================================
     * ======================================================================================================
     * ======================================================================================================
     * 
     * 
     *                          GET FRIENDS ALBUMS
     * 
     * 
     * ======================================================================================================
     * ======================================================================================================
     * ======================================================================================================
     * 
     * 
     */











/**
 * 
 *  Friends Private album permissions
 * 
 *  guid, owner_guid, album_id
 * ================================= =============================== ===============================
 * 
 *  Friends albums view history to see last viewed media content
 * 
 *      album_last_viewed_media
 *  *  guid, owner_guid, album_id, last_viewed_media_url, last_viewed_timestamp

 ================================= =============================== ===============================
 *  public albums
 * 
 *  Just user albums 
 *  ================================= =============================== ===============================
 *      Query Test 1
 *  ================================= =============================== ===============================
 *  SELECT ua.`guid`, ua.`is_private`, ua.`title`, ua.`cover_album_url`, ua.`newest_media_timestamp`, ua.`count`, 
 *          flvm.album_id, flvm.last_viewed_media_url, flvm.last_viewed_timestamp
 *          `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified 
 *  FROM `user_album` AS ua
 *      INNER JOIN `friends` 
 *      ON friends.guid1 = ua.guid AND friends.`status` = ?
            INNER JOIN album_permissions AS ap 
            ON ua.`is_private` = ? OR (ap.guid = ? AND ap.owner_guid = friends.guid1 AND ap.album_id = ua.id)
                INNER JOIN `profile` 
 *              ON ua.guid = profile.guid 
 *                  LEFT JOIN album_last_viewed_media AS flvm 
 *                  ON flvm.guid = ? AND flvm.owner_guid = ua.guid AND flvm.album_id = ua.id
 * 
 *  WHERE friends.guid2 = ? AND (ua.newest_media_timestamp > NOW() - INTERVAL 1 DAY)
 * 
 * //  WHERE fa.guid = ? AND (newest_media_timestamp > NOW() - INTERVAL 1 DAY) AND (newest_media_timestamp > last_viewed_timestamp OR last_viewed_timestamp IS null) 
 *  ORDER BY newest_media_timestamp DESC 
 *  LIMIT ?, ?";
 * 
 * [Relationship.IsFollowing, false, guid, guid, guid  ]
 * 
 *  ================================= =============================== ===============================
 *      Query Test 2
 *  ================================= =============================== ===============================

 *  SELECT ua.`guid`, ua.`title`, ua.`cover_album_url`, ua.`newest_media_timestamp`, ua.`count`, 
 *          flvm.album_id, flvm.last_viewed_media_url, flvm.last_viewed_timestamp
 *          `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified 
 *  FROM `user_album` AS ua
 *      INNER JOIN `friends` 
 *      ON friends.guid1 = ua.guid AND friends.guid2 = ? AND friends.`status` = ?
            INNER JOIN album_permissions AS ap 
            ON ua.`is_private` = ? OR (ap.guid = ? AND ap.owner_guid = friends.guid1 AND ap.album_id = ua.id)
                INNER JOIN `profile` 
 *              ON ua.guid = profile.guid 
 *                  LEFT JOIN album_last_viewed_media AS flvm 
 *                  ON flvm.guid = ? AND flvm.owner_guid = ua.guid AND flvm.album_id = ua.id
 * 
 *  WHERE friends.guid2 = ? AND (ua.newest_media_timestamp > NOW() - INTERVAL 1 DAY)
 * 
 * //  WHERE fa.guid = ? AND (newest_media_timestamp > NOW() - INTERVAL 1 DAY) AND (newest_media_timestamp > last_viewed_timestamp OR last_viewed_timestamp IS null) 
 *  ORDER BY newest_media_timestamp DESC 
 *  LIMIT ?, ?";
 * 
 * 
 * 
 * 
 * 

 */

// change WHERE user_album.`count` > 0


/**
 * 
 * 
 *  Private 
 * 
 * SELECT   ua.`guid`, ua.`id` AS album_id, ua.`is_private`, ua.`title`, ua.`cover_album_url`, ua.`newest_media_timestamp`, ua.`count`, 
 *          flvm.last_viewed_media_url, flvm.last_viewed_timestamp, 
 *          `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified 
 *  FROM `user_album` AS ua 
 *      INNER JOIN `friends` 
 *      ON friends.guid2 = ua.guid AND friends.`status` = ? 
 *          INNER JOIN album_permissions AS ap 
 *          ON ua.`is_private` = ? OR (ap.guid = ? AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
 *              INNER JOIN `profile` 
 *              ON ua.guid = profile.guid 
 *                  LEFT JOIN album_last_viewed_media AS flvm 
 *                  ON flvm.guid = ? AND flvm.fguid = ua.guid AND flvm.album_id = ua.id 
 *  
 *  PUblic 
 * 
 * SELECT   ua.`guid`, ua.`id` AS album_id, ua.`is_private`, ua.`title`, ua.`cover_album_url`, ua.`newest_media_timestamp`, ua.`count`, 
 *          flvm.last_viewed_media_url, flvm.last_viewed_timestamp, 
 *          `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified 
 *  FROM `user_album` AS ua 
 *      INNER JOIN `friends` 
 *      ON friends.guid2 = ua.guid AND friends.`status` = ? 
*              INNER JOIN `profile` 
*              ON ua.guid = profile.guid 
*                  LEFT JOIN album_last_viewed_media AS flvm 
*                  ON flvm.guid = ? AND flvm.fguid = ua.guid AND flvm.album_id = ua.id 
 * 
 * WHERE ua.`is_private` = 0
 *                  
 * 
 * 
 * 
 * 
 * 
 *  
//  * Replace with the statement=
 * 
 * SELECT   ua.`guid`, ua.`id` AS album_id, ua.`is_private`, ua.`views`, ua.`likes`, ua.`dislikes`, ua.create_date, ua.expire, ua.expire_date, ua.`title`, ua.`cover_album_url`, ua.`newest_media_timestamp`, ua.`count`, 
 *          alvm.last_viewed_media_url, alvm.last_viewed_timestamp
 *          `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified , MAX(alvm.last_viewed_timestamp)
 *  FROM `user_album` AS ua 
 *      INNER JOIN `friends` 
 *      ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
 *          INNER JOIN album_permissions AS ap 
 *          ON ua.`is_private` = ? OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
 *              INNER JOIN `profile` 
 *              ON ua.guid = profile.guid 
 *                  LEFT JOIN album_last_viewed_media AS alvm 
 *                  ON alvm.guid = ap.guid AND alvm.fguid = ua.guid AND alvm.album_id = ua.id 
 *                  
 * WHERE (ua.expire_date IS NULL OR ua.expire_date > NOW())    // AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) 
 * ORDER BY alvm.last_viewed_media_url IS NULL DESC, newest_media_timestamp DESC LIMIT ?";
 * 
 * 
 * 
 *              Change album_last_viewed_media to (PRIMARY_KEY = guid, fguid, albumId, mediaUrl, timestamp, viewTimestamp)
 * 
 *              And delete album_view_history? 
 * 
 * 
 *   create_date > NOW() - INTERVAL expire DAY
 *  WHERE friends.guid1 = ? AND (ua.newest_media_timestamp > NOW() - INTERVAL 1 DAY) AND ua.newest_media_timestamp > ? 
 *  GROUP BY 
 * ORDER BY flvm.last_viewed_media_url IS NULL DESC,  newest_media_timestamp DESC 
 * 
 * 
 * 
 * 
 * 


    TODO:
    SELECT COUNT(*) as unseenCount
    FROM album_last_viewed_media AS alvm
	    INNER JOIN album_media
	    ON alvm.fguid = album_media.guid AND alvm.album_id = album_media.album_id
    WHERE alvm.guid = ? AND alvm.fguid = ? AND alvm.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR album_media.timestamp > alvm.last_viewed_timestamp)





    SELECT ua.`guid`, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, ua.create_date, ua.expire, ua.expire_date, 
        alvm.last_viewed_media_url, alvm.last_viewed_timestamp, 
        ua.`title`, ua.`is_private`, ua.`cover_album_url`, ua.`newest_media_timestamp`, ua.`count`, 
        `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified
    FROM `user_album` AS ua 
        INNER JOIN `friends` 
        ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
            INNER JOIN album_permissions AS ap 
            ON ua.`is_private` = ? OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
                INNER JOIN `profile` 
                ON ua.guid = profile.guid 
                    LEFT JOIN album_last_viewed_media AS alvm 
                    ON alvm.guid = ap.guid AND alvm.fguid = ua.guid AND alvm.album_id = ua.id 
    WHERE (ua.expire_date IS NULL OR ua.expire_date > NOW()) 
    ORDER BY ua.newest_media_timestamp AND (ua.newest_media_timestamp > alvm.last_viewed_timestamp OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC 
    LIMIT ?";


 * 
 */

/**
 * 
 *  Order by:
 * 
 *  * Popularity = followersCount + Views + Likes

 * 
 * 1) Best posts
 *      - Newest albums by your favorite users
 *          -Those that you have viewed the most and liked
 * 2) Newest albums
 * 
 * 
 *              If we store user history in album_last_viewed_media CHANGE to album_viewed_media
 * 
 *              Change album_last_viewed_media to (PRIMARY_KEY = guid, fguid, albumId, mediaUrl, timestamp, viewTimestamp)
 * 
 *              And delete album_view_history 
 *      
 *              And update function that updates album_last_viewed_media using "IF("

 *  
 * 18 446 744 073 709  551 615
 * 
 */


/**
 * 
 * ORDER BY 1)  newest unseen media, things you would enjoy more
 * 
 * ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp ) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?
 * 
 */

/**
 *  SELECT ua.`guid`, ua.first_url, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private  
 *  FROM `user_album` AS ua 
 *      INNER JOIN `friends` 
 *      ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
 *          INNER JOIN album_permissions AS ap 
 *          ON ua.`is_private` = ? OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
 *              INNER JOIN `profile` 
 *              ON ua.guid = profile.guid 
 *                  LEFT JOIN album_last_viewed_media AS alvm 
 *                  ON alvm.guid = ap.guid AND alvm.fguid = ua.guid AND alvm.album_id = ua.id 
 *  WHERE (ua.expire_date IS NULL OR ua.expire_date > NOW())                                    
 *  ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC 
 *  LIMIT ?";
 * 
 * 
 * 
 * Select 
 * FROM user_album
 *      LEFT JOIN shared_albums
 *      ON sha.user_guid = ? AND sha.album_id = user_album.album_id, user_album.is_private = 0  
 * 
 * too compliared
 * 
 * 
 * just do: 
 *  
 * 
 *      LEFT JOIN shared_albums
 *      ON sha.user_guid = ? 
 * 
 * 
 *  And where user clicks on the album: If the album has gone private and/or the user has gone private show. Error message: 
 * 
 *  SELECT... 
 * 
 *  Shared_album
 * 
 *  sharer_guid, owner_guid, album_id
 * 
 * 



 *  ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC 

    Order by: 

    New Albums
    Old albums with new content

        1) Unseen content
        3) Newest media Content
        2) What user is most interested in


    */



    /**
     * 
     * 

     

     



    Following page: 
    Followers, What You Missed, 

    
    
    WHERE  ua.newest_media_timestamp < FROM_UNIXTIME(?) 
    ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC 
    LIMIT ?"; 




    After user creates album, whenever user uploads new content, 
        1) get if album is public or private
        2) If public, get all followers. If private, get selected users
        3) INSERT INTO timeline SET guid = ?, fguid = ?, album_id = ? ON DUPLICATE KEY UPDATE date=VALUES(date)';
        

        
    ON delete content: update date to last media date,
    On delete album, delete from timeline


    
    insert into timeline 


    If usr is mentioned in album, user gets a notification
       
    
    SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
    FROM album_timeline AS tl 
        INNER JOIN `user_album` AS ua 
        ON tl.fguid = ua.guid AND tl.album_id = ua.id 
            INNER JOIN `profile` 
            ON ua.guid = profile.guid 
                LEFT JOIN album_last_viewed_media AS alvm 
                ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id
    WHERE tl.guid = ? AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) 
    ORDER BY album_timeline.date DESC 
    LIMIT ?";


    LEFT JOIN user_metrics AS um ON ua.guid = um.guid


    SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private
    FROM `user_album` AS ua 
        INNER JOIN `friends` 
        ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
            LEFT JOIN album_permissions AS ap 
            ON (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
                INNER JOIN `profile` 
                ON ua.guid = profile.guid 
                    LEFT JOIN album_last_viewed_media AS alvm 
                    ON alvm.guid = friends.guid1 AND alvm.fguid = ua.guid AND alvm.album_id = ua.id 
    WHERE (ua.`is_private` = ? OR ap.guid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())                                    
    ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?";


    SELECT um.popularity, ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
    FROM album_timeline AS tl 
        INNER JOIN `user_album` AS ua 
        ON tl.fguid = ua.guid AND tl.album_id = ua.id 
            INNER JOIN `profile` 
            ON ua.guid = profile.guid 
                LEFT JOIN album_last_viewed_media AS alvm 
                ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id 
                    LEFT JOIN user_metrics AS um 
                    ON ua.guid = um.guid 
    WHERE tl.guid = ? AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) 
    ORDER BY tl.date DESC 
    LIMIT ?";



    SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked 
    FROM user_album AS ua 
        LEFT JOIN `user_album_likes` AS ual 
        ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id 
            LEFT JOIN bookmarked_album ba 
            ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id 
    WHERE ua.guid = ? AND ua.id = ?";

    

    // We still need to make sure user has the correct permissions:
    // Maybe friend remove permission
    // Maybe friend turned account private?


    SELECT um.popularity, ual.`liked`, ba.album_id as bookmarked, ua.`guid`, ua.comments_on, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username, `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, `profile`.fullname, profile.domain, `profile`.`about`, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
    FROM album_timeline AS tl 
        INNER JOIN `user_album` AS ua 
        ON tl.fguid = ua.guid AND tl.album_id = ua.id 
            INNER JOIN `profile` 
            ON ua.guid = profile.guid 
                LEFT JOIN album_last_viewed_media AS alvm 
                ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id 
                    LEFT JOIN user_metrics AS um 
                    ON ua.guid = um.guid 
                        LEFT JOIN `user_album_likes` AS ual 
                        ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id 
                            LEFT JOIN bookmarked_album ba 
                            ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id 
    WHERE tl.guid = ? AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) 
    ORDER BY tl.date DESC 
    LIMIT ?";



     */ 


    var timelineQuery         = "SELECT um.popularity, ual.`liked`, ba.album_id as bookmarked, ua.`guid`, ua.comments_on, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username, `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, `profile`.fullname, profile.domain, `profile`.`about`, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM album_timeline AS tl INNER JOIN `user_album` AS ua ON tl.fguid = ua.guid AND tl.album_id = ua.id INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id LEFT JOIN user_metrics AS um ON ua.guid = um.guid LEFT JOIN `user_album_likes` AS ual ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id WHERE tl.guid = ?                                AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) ORDER BY tl.date DESC LIMIT ?";
    var loadMoreTimelineQuery = "SELECT um.popularity, ual.`liked`, ba.album_id as bookmarked, ua.`guid`, ua.comments_on, ua.number_of_replies, ua.number_of_total_replies, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username, `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, `profile`.fullname, profile.domain, `profile`.`about`, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM album_timeline AS tl INNER JOIN `user_album` AS ua ON tl.fguid = ua.guid AND tl.album_id = ua.id INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = tl.guid AND alvm.fguid = tl.fguid AND alvm.album_id = tl.album_id LEFT JOIN user_metrics AS um ON ua.guid = um.guid LEFT JOIN `user_album_likes` AS ual ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id WHERE tl.guid = ? AND tl.date < FROM_UNIXTIME(?) AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) ORDER BY tl.date DESC LIMIT ?";


    
    var refreshAlbumsSql = "SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private  FROM `user_album` AS ua INNER JOIN `friends` ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = friends.guid1 AND alvm.fguid = ua.guid AND alvm.album_id = ua.id WHERE (ua.`is_private` = ? OR ap.guid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())                                    ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?"; //ORDER BY ua.newest_media_timestamp AND (ua.newest_media_timestamp > alvm.last_viewed_timestamp OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?";
/// ORDER BY (ua.newest_media_timestamp > alvm.last_viewed_timestamp AND )  alvm.last_viewed_timestamp IS NULL DESC, ua.newest_media_timestamp > alvm.last_viewed_timestamp, newest_media_timestamp LIMIT ?"; // ua.newest_media_timestamp > alvm.last_viewed_timestamp
    var loadAlbumsSql    = "SELECT ua.`guid`, ua.explicit,  ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp,  ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers, `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `user_album` AS ua INNER JOIN `friends` ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ?  LEFT JOIN album_permissions AS ap ON (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = friends.guid1 AND alvm.fguid = ua.guid AND alvm.album_id = ua.id WHERE (ua.`is_private` = ? OR ap.guid IS NOT NULL)  AND (ua.expire_date IS NULL OR ua.expire_date > NOW()) AND ua.newest_media_timestamp < FROM_UNIXTIME(?) ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?";  //ORDER BY ua.newest_media_timestamp AND (ua.newest_media_timestamp > alvm.last_viewed_timestamp OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?';";
    // ORDER BY alvm.last_viewed_timestamp IS NULL DESC, ua.newest_media_timestamp > alvm.last_viewed_timestamp, newest_media_timestamp DESC LIMIT ?";




// var refreshAlbumsSqlOld = "SELECT ua.`guid`, ua.`id` AS album_id, ua.`is_private`, ua.`views`, ua.`likes`, ua.`dislikes`, ua.`title`, ua.`cover_album_url`, ua.create_date, ua.expire, ua.expire_date, ua.`newest_media_timestamp`, ua.`count`, flvm.last_viewed_media_url, flvm.last_viewed_timestamp, `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified FROM `user_album` AS ua INNER JOIN `friends` ON friends.guid2 = ua.guid AND friends.`status` = ? INNER JOIN album_permissions AS ap ON ua.`is_private` = ? OR (ap.guid = ? AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS flvm ON flvm.guid = ? AND flvm.fguid = ua.guid AND flvm.album_id = ua.id WHERE friends.guid1 = ? AND (ua.expire_date > NOW() OR ua.expire_date IS NULL)                               ORDER BY flvm.last_viewed_media_url IS NULL DESC, newest_media_timestamp DESC LIMIT ?";
            

// var loadAlbumsSqlOld = "SELECT ua.`guid`, ua.`id` AS album_id, ua.`is_private`, ua.`views`, ua.`likes`, ua.`dislikes`, ua.`title`, ua.`cover_album_url`, ua.create_date, ua.expire, ua.expire_date, ua.`newest_media_timestamp`, ua.`count`, flvm.last_viewed_media_url, flvm.last_viewed_timestamp, `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified FROM `user_album` AS ua INNER JOIN `friends` ON friends.guid2 = ua.guid AND friends.`status` = ? INNER JOIN album_permissions AS ap ON ua.`is_private` = ? OR (ap.guid = ? AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS flvm ON flvm.guid = ? AND flvm.fguid = ua.guid AND flvm.album_id = ua.id WHERE friends.guid1 = ? AND (ua.expire_date > NOW() OR ua.expire_date IS NULL) AND ua.newest_media_timestamp < ? ORDER BY flvm.last_viewed_media_url IS NULL DESC, newest_media_timestamp DESC LIMIT ?";
// var newAlbumsSql = "SELECT ua.`guid`, ua.`id` AS album_id, ua.`is_private`, ua.`views`, ua.`likes`, ua.`dislikes`, ua.`title`, ua.`cover_album_url`, ua.`newest_media_timestamp`, ua.`count`, flvm.last_viewed_media_url, flvm.last_viewed_timestamp, `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified FROM `user_album` AS ua INNER JOIN `friends` ON friends.guid2 = ua.guid AND friends.`status` = ? INNER JOIN album_permissions AS ap ON ua.`is_private` = ? OR (ap.guid = ? AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS flvm ON flvm.guid = ? AND flvm.fguid = ua.guid AND flvm.album_id = ua.id WHERE friends.guid1 = ? AND (ua.newest_media_timestamp > NOW() - INTERVAL 1 DAY) ORDER BY flvm.last_viewed_media_url IS NULL DESC, newest_media_timestamp DESC LIMIT ?, ?";


 //  * [Relationship.IsFollowing, false, guid, guid, guid , offest, number_of_items ]



    // var newAlbumsSql2 = "SELECT fa.`fguid`, fa.`album_id`, fa.`last_viewed_media_url`, fa.`last_viewed_timestamp`, user_album.`title`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count`, `profile`.username, `profile`.fullname, `profile`.image_url, `profile`.verified FROM `album_permissions` AS fa INNER JOIN `user_album` ON fa.fguid = user_album.guid AND fa.album_id = user_album.id INNER JOIN `profile` ON fa.fguid = profile.guid WHERE fa.guid = ? AND (newest_media_timestamp > NOW() - INTERVAL 1 DAY)  AND (newest_media_timestamp > last_viewed_timestamp OR last_viewed_timestamp IS null) ORDER BY newest_media_timestamp DESC LIMIT ?, ?";

    // var oldAlbumsSql = "SELECT fa.`fguid`, fa.`album_id`, fa.`last_viewed_media_url`, fa.`last_viewed_timestamp`, user_album.`title`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count`, `profile`.username, `profile`.fullname, `profile`.verified FROM `album_permissions` AS fa INNER JOIN `user_album` ON fa.fguid = user_album.guid AND fa.album_id = user_album.id INNER JOIN `profile` ON fa.fguid = profile.guid WHERE fa.guid = ? ORDER BY `profile`.username ASC LIMIT ?";

    // var oldAlbumsNextSql = "SELECT fa.`fguid`, fa.`album_id`, fa.`last_viewed_media_url`, fa.`last_viewed_timestamp`, user_album.`title`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, user_album.`count`, `profile`.username, `profile`.fullname, `profile`.verified FROM `album_permissions` AS fa INNER JOIN `user_album` ON fa.fguid = user_album.guid AND fa.album_id = user_album.id INNER JOIN `profile` ON fa.fguid = profile.guid WHERE fa.guid = ? AND `profile`.username > ? ORDER BY `profile`.username ASC LIMIT ?";



    /**
     *  Old albums that do not:    
     * 
     * 
     * timestamp < NOW() - INTERVAL 1 DAY
     */
// UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp
    // var oldAlbumsSql2 = "SELECT fa.`fguid`, fa.`album_id`, fa.`last_viewed_media_url`, fa.`last_viewed_timestamp`, user_album.`title`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count`, `profile`.username, `profile`.fullname, `profile`.verified, `profile`.image_url FROM `album_permissions` AS fa INNER JOIN `user_album` ON fa.fguid = user_album.guid AND fa.album_id = user_album.id INNER JOIN `profile` ON fa.fguid = profile.guid WHERE fa.guid = ? AND (newest_media_timestamp > NOW() - INTERVAL 1 DAY) AND last_viewed_timestamp IS NOT null ORDER BY `profile`.username ASC LIMIT ?";

    // var oldAlbumsNextSql2 = "SELECT fa.`fguid`, fa.`album_id`, fa.`last_viewed_media_url`, fa.`last_viewed_timestamp`, user_album.`title`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count`, `profile`.username, `profile`.fullname, `profile`.verified, `profile`.image_url FROM `album_permissions` AS fa INNER JOIN `user_album` ON fa.fguid = user_album.guid AND fa.album_id = user_album.id INNER JOIN `profile` ON fa.fguid = profile.guid WHERE fa.guid = ? AND (newest_media_timestamp > NOW() - INTERVAL 1 DAY) AND `profile`.username > ? AND last_viewed_timestamp IS NOT null ORDER BY `profile`.username ASC LIMIT ?";




/**
 *  Returns: An array
 * 
 * [ {album: x0, profile: y0},
 *   {album: x1, profile: y1}
 * ]
 * 
 * @param {*} myGuid 
 * @param {*} results 
 */

    let kLike = "like";


    let kFollowersCount = "followersCount";
    let kFollowingCount = "followingCount";
    let kScore          = "score";

    let kBookmarkTimestamp = "bookmarkTimestamp";

    function getAlbumsFromResults(myGuid, results) {
        
        console.log("getAlbumsFromResults called indeed");
        
        var albumsList = [];

        results.forEach((result) => {


            var album = {};

            // Get album cover
            // if (result.is_private) {
            // printTimeForEvent("Start SignedUrl for media url: " + result.cover_album_url);

            var params = {  Bucket  : ALBUM_BUCKET,  
                            Key     : albumCoverThumbnailKey(result.guid, result.cover_album_url), 
                            Expires : S3_EXPIRE_LIMIT 
                        };
            var signedUrl = s3.getSignedUrl('getObject', params);
            // printTimeForEvent("End SignedUrl for media url: " + result.cover_album_url);
            // printTimeForEvent("signedUrl: " + signedUrl);

            album[kSignedUrl]       = signedUrl;

            album[kFirstUrl]        = result.first_url;
            album[kTimestamp]       = result.first_timestamp.toString();

            
            album[kSignedFirstUrl]  = s3.getSignedUrl('getObject', 
                                        {   Bucket  : ALBUM_BUCKET,  
                                            Key     : albumFirstMediaKey(result.guid, result.first_url), 
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
                    
            album[kAlbumCover]           = result.cover_album_url;

            album[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
            album[kCount]                = result.count; // media count
            album[kCommentCount]         = result.number_of_replies; // number of total comments and replies
            album[kCommentTotalCount]    = result.number_of_total_replies; // number of total comments and replies
            
            album[kCommentsOn]          = intToBool(result.comments_on);


            album[kCreateDate]           = result.create_date.toString();

            album[kExpireDate]           = result.expire_date;
            album[kExpireDays]           = result.expire;



            
            
            album[kLike]       = result.liked;
            
            album[kBookmarked] = result.bookmarked !== null ? true : false;
            


            // if (result.album_is_private === IsPublic) {
            album[kViews]                = result.views;
            album[kLikeCount]            = result.likes;
            album[kDislikeCount]         = result.dislikes;
            // }


            if (result.last_viewed_timestamp !== undefined && result.last_viewed_timestamp !== null ) {
                album[kLastViewedMediaUrl]       = result.last_viewed_media_url;
                album[kLastViewedMediaTimestamp] = result.last_viewed_timestamp.toString();
            }


            if (result.bookmark_timestamp !== undefined && result.bookmark_timestamp !== null ) {
                album[kBookmarkTimestamp] = result.bookmark_timestamp.toString();
            }


            var profile = {};

            profile[kGuid]       = result.guid;   
            profile[kUserName]   = result.username;
            profile[kFullName]   = result.fullname;
            profile[kVerified]   = intToBool(result.verified);
            profile[kProfileUrl] = result.image_url;
            profile[kPrivate]    = result.profile_is_private;

            profile[kAllowFollowersView]  = intToBool(result.allow_view_followers);
            profile[kAllowFollowingsView] = intToBool(result.allow_view_followings);

            
            profile[kFollowersCount]  = result.followers;
            profile[kFollowingCount]  = result.following;
            profile[kScore]           = result.popularity === null ? 0 : result.popularity;

            
            var albumInfo = {};
            albumInfo[kAlbum]   = album;
            albumInfo[kProfile] = profile;
            // console.log("result.last_viewed_timestamp mediaContentType of = "  + typeof result.last_viewed_timestamp  );

            albumsList.push(albumInfo);
        });

        return albumsList;
    }

    function titleToBase64(title) {
       return new Buffer(title).toString('base64'); // Buffer.from(originalImage, 'base64');  
    }

    function titleToUTF(base64Title) {
        return new Buffer(base64Title, 'base64').toString('utf8');
    }


    function getNewAlbumResults(myGuid, querySql, parameters) {
        console.log("getNewAlbumResults");
        
        // Get new albums 
        connection.query({
            sql: querySql,
            values: parameters
        }, function (error, results) {
            if (error) {
                printError(error);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else if (results) {
                console.log('New album Results:', JSON.stringify(results, null, 2));

 
                let allAlbums = getAlbumsFromResults(myGuid, results);
                finalAppResponse( getAlbumsResponse( allAlbums)); 

                    // Get more albums from the old albums
                // if ( results.length < MAX_ALBUM_RESULTS ) {

                //     querySql   =  oldAlbumsSql2;
                //     parameters = [guid, MAX_ALBUM_RESULTS ];

                //     getOldAlbum(guid, querySql, parameters, allAlbums );
                // } else {
                //     // Return retults
                //     finalAppResponse( getAlbumsResponse( allAlbums));
                // }
            }
        });
    }



    function getOldAlbum(guid, querySql, parameters, allAlbums) {

        connection.query({
            sql: querySql,
            values: parameters
        },
        function (error, results) {
            if (error) {
                printError(error);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else if (results) {
                console.log('Results:', JSON.stringify(results, null, 2));

                //return results

                allAlbums.oldAlbums = getAlbumsFromResults(guid, results);
                
                finalAppResponse( getAlbumsResponse( allAlbums));
            }
        });
    }


    /**
     * 
     * 
     * 
        INSERT INTO album_timeline (guid, fguid, album_id, date)
        SELECT friends.guid1, ua.`guid`, ua.`id`, UNIX_TIMESTAMP(`newest_media_timestamp`)
        FROM `user_album` AS ua 
            INNER JOIN `friends` 
            ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
                LEFT JOIN album_permissions AS ap 
                ON (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
                INNER JOIN `profile` 
                ON ua.guid = profile.guid 
                    LEFT JOIN album_last_viewed_media AS alvm 
                    ON alvm.guid = friends.guid1 AND alvm.fguid = ua.guid AND alvm.album_id = ua.id 
        WHERE (ua.`is_private` = ? OR ap.guid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())    



        INSERT INTO album_timeline (guid, fguid, album_id, date) SELECT friends.guid1, ua.`guid`, ua.`id`, UNIX_TIMESTAMP(`newest_media_timestamp`) FROM `user_album` AS ua INNER JOIN `friends` ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = friends.guid1 AND alvm.fguid = ua.guid AND alvm.album_id = ua.id WHERE (ua.`is_private` = ? OR ap.guid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())    



     */


     
    function listFollowingAlbums( myGuid, numberOfAlbums) {
        console.log("listFollowingAlbums");

        // last viewed timestamp 
        
        // Refreshing
        if ( !isStringWithLength(lastTimestamp) ) { //(isRefreshing) {
            console.log("listFollowingAlbums refreshing");

            // console.log("refreshAlbumsSql: " + timelineQuery);

            // var parameters = [myGuid, Relationship.IsFollowing, 0, numberOfAlbums ];
            var parameters = [myGuid, myGuid, myGuid, numberOfAlbums ];

            getNewAlbumResults(myGuid, timelineQuery, parameters);

        // Load more
        } else {

            console.log("listFollowingAlbums not refreshing, loading more");
            
            // var parameters = [myGuid, Relationship.IsFollowing, 0, lastTimestamp, numberOfAlbums ];
            var parameters = [myGuid, myGuid, myGuid, lastTimestamp, numberOfAlbums ];

            getNewAlbumResults(myGuid, loadMoreTimelineQuery, parameters);
        }

        // var querySql = newAlbumsSql;
        // // var parameters = [Relationship.IsFollowing, 0, guid, guid, guid, pageIndex, MAX_ALBUM_RESULTS ];
        
        
        // // Get new albums
        // getNewAlbumResults(guid, newAlbumsSql, parameters2);
    }
 
 
    // function listFollowingAlbums1(guid) {

    //     var querySql;
    //     var parameters;

    //     // Get only new albums
    //     if ( isRefreshing || lastAlbumWasNew) {

    //         querySql =  newAlbumsSql;
    //         parameters = [guid, pageIndex, MAX_ALBUM_RESULTS ];

    //         // Get new albums
    //         getNewAlbumResults(guid, querySql, parameters);

    //     } else {
                
    //         var allAlbums = {};

    //         querySql =  oldAlbumsNextSql2;
    //         parameters = [guid, lastUsername, MAX_ALBUM_RESULTS ];

    //         getOldAlbum(guid, querySql, parameters, allAlbums);   
    //     }
    // }
 
    // console.log("4");



    /**
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     *  
     * 
     *                     Get media content in Albums
     * 
     * 
     * Since this will be in descending order: earliest to latest, we can use LIMIT offset, count
     * 
     * 
     * 
     * Public Album
     * 
     *  SELECT guid, album_id, `media_url`, `timestamp`, `type`, `timelimit` 
     *  FROM `album_media` 
     *      INNER JOIN user_album
     *      ON user_album.guid = album_media.guid 
     *  WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0
     *  ORDER BY timestamp 
     *  LIMIT ?';
     * 
     * 
     * var parameters = [ fguid, albumId, MAX_ALBUM_RESULTS];
     * 
     * 
     * 
     * 
     *  Private Album
     *
     *      Start from beginning
     * 
     *  SELECT guid, album_id, `media_url`, `timestamp`, `type`, `timelimit` 
     *  FROM `album_media` 
     *      INNER JOIN album_permissions AS ap
     *      ON ap.guid = ? , ap.fguid = album_media.guid ,  ap.album_id =  album_media.album_id
     *  WHERE album_media.guid = ? AND album_id = ?  
     *  ORDER BY timestamp 
     *  LIMIT ?';
     * 
     * 
     *      Continue from newest media in album: by timestamp
     * 
     *  SELECT guid, album_id, `media_url`, `timestamp`, `type`, `timelimit` 
     *  FROM `album_media` 
     *      INNER JOIN album_permissions AS ap
     *      ON ap.guid = ? , ap.fguid = album_media.guid ,  ap.album_id =  album_media.album_id
     *  WHERE album_media.guid = ? AND album_id = ? AND timestamp >= ?
     *  ORDER BY timestamp 
     *  LIMIT ?';
     * 
     * 
     * 
     *     Continue after last seen media in album: by timestamp
     * 
     *  SELECT guid, album_id, `media_url`, `timestamp`, `type`, `timelimit` 
     *  FROM `album_media` 
     *      INNER JOIN album_permissions AS ap
     *      ON ap.guid = ? , ap.fguid = album_media.guid ,  ap.album_id =  album_media.album_id
     *  WHERE album_media.guid = ? AND album_id = ? AND timestamp > ?
     *  ORDER BY timestamp 
     *  LIMIT ?';
     * 
     * 
     * ap.guid = ourGuid,  album_media.guid = friendsGuid, albumId, 



     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     */

    
    

/**
 * 
 */
     function mediaContentResults(sqlStmt, parameters, includeUnseenCount) {
        console.log("mediaContentResults ");

        connection.query({
            sql   : sqlStmt,
            values: parameters, 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else if (results) {

                // console.log('AffectedRows: ' + JSON.stringify(results.affectedRows, null, 2));


                console.log('Results:', JSON.stringify(results, null, 2));
                // console.log('fields:', JSON.stringify(fields, null, 2));

                if (results.length > 0) {

                    // console.log("FOUND_ROWS() is: ");

                    // console.log(rows[0]["FOUND_ROWS()"]);


                    var albums = [];

                    results.forEach((result) => {

                        var album = {};
                        album[kGuid]      = guid;
                        album[kAlbumId]   = albumId; 
                        album[kType]      = result.type; // video, gif, photo
                                    

                        var params = {  Bucket  : ALBUM_BUCKET,  
                                        Key     : albumMediaKey(result.guid, result.media_url, result.type), 
                                        Expires : S3_EXPIRE_LIMIT 
                                    };
                        var signedUrl = s3.getSignedUrl('getObject', params);
                        // printTimeForEvent("End SignedUrl for media url: " + result.media_url);
                        // printTimeForEvent("signedUrl: " + signedUrl);
                        album[kSignedUrl]  = signedUrl;


                        album[kMediaURL]  = result.media_url;
                        
                        album[kTimestamp] = result.timestamp.toString();
                        album[kTimelimit] = result.timelimit

                        console.log("mediaContentResults timestamp: " + result.timestamp);


                        albums.push(album);
                    });


                    if (!includeUnseenCount) {
                        
                        finalAppResponse( mediaResponse( albums));
                    
                    } else {

                        connection.query({
                            sql   : 'SELECT FOUND_ROWS()'                    
                        }, function (err, results) {
                            if (err) {
                                printError(err);
                                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            } else if (results) {

                                console.log('Results:', JSON.stringify(results, null, 2));



                                if (results.length > 0) {
                                    console.log("FOUND_ROWS() is: " + results[0]["FOUND_ROWS()"]);

                                    var response = {};
                                    response[kActive]  = ActiveValues.Active;
                                    response[kAlbum]   = albums; 
                                    response[kCount]   = results[0]["FOUND_ROWS()"]; 
                                        

                                    finalAppResponse( response );

                                } else {
                                    finalAppResponse( errorResponse( ErrorMessageGeneric));
                                }
                            } else {
                                finalAppResponse( errorResponse( ErrorMessageGeneric));
                            }
                        });
                    }
                } else {
                    // Nothing to downlaod
                    finalAppResponse( errorResponse( "Album does not exist"));
                }
            } else {
                finalAppResponse( errorResponse( ErrorMessageGeneric));
            }
        });         
     }
     



/**
 * 
 * 

 * @param {*} guid 
 * @param {*} fguid 
 * @param {*} albumId 
 * @param {*} lastMediaTime 
 * @param {*} lastMediaUrl 
 * @param {*} numberOfItems = 4
 * 
 * 
 *  SELECT COUNT(*) as unseenCount 
 *  FROM album_last_viewed_media AS flvm 
 *      RIGHT JOIN album_media 
 *      ON flvm.fguid = album_media.guid AND flvm.album_id = album_media.album_id AND flvm.guid = ? 
 *  WHERE album_media.guid = ? AND album_media.album_id = ? AND (flvm.last_viewed_timestamp IS NULL OR album_media.timestamp > flvm.last_viewed_timestamp)'

 * 
 * 
 *  Private unseen photos
 * 
 * 
 *  Also need to get unseenCount 
    SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`
    FROM `album_media` AS am 
        INNER JOIN album_permissions AS ap 
        ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id  
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
    WHERE am.guid = ? AND am.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) 
    ORDER BY am.timestamp 
    LIMIT ?';


    var parameters = [guid, fguid, albumId, numberOfItems ];


 */



/**
 * Popularity = followersCount + Views + Likes
 * 
 * 
 * 

Correct:  Add this to query
SELECT COUNT(*) as unseenCount
FROM album_media AS am
	LEFT JOIN album_last_viewed_media AS alvm
	ON alvm.guid = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd#928bc421' AND alvm.fguid = am.guid AND alvm.album_id = am.album_id
WHERE am.guid = 'd9efdfce-1c38-4ae5-89af-5dcca451b18e#f5bbfcdf' AND am.album_id = '3REr3oXBBJ5D' AND (am.timestamp > alvm.last_viewed_timestamp OR alvm.last_viewed_timestamp IS NULL )




    SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`, COUNT(*) as unseenCount
    FROM `album_media` AS am 
        INNER JOIN album_permissions AS ap 
        ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id  
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
    WHERE ap.guid = ? AND ap.fguid ? AND ap.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) 
    GROUP BY am.timestamp
    ORDER BY am.timestamp 
    LIMIT ?';
    

        Unchanged
        var sqlStmt = 'SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN album_permissions AS ap ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id  LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id WHERE am.guid = ? AND am.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY am.timestamp LIMIT ?';



    

    SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
    FROM `album_media` AS am 
        INNER JOIN album_permissions AS ap 
        ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
    WHERE am.guid = ? AND am.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) 
    ORDER BY am.timestamp 
    LIMIT ?";



    SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
    FROM `album_media` AS am 
        INNER JOIN album_permissions AS ap 
        ON ap.fguid = am.guid AND ap.album_id = am.album_id 
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
    WHERE ap.guid = ? AND am.guid = ? AND am.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) 
    ORDER BY am.timestamp LIMIT ?";


 */

    function getPrivateFolloweringUnseenMediaContent( guid, fguid, albumId, numberOfItems ) {
        console.log("getPrivateFolloweringUnseenMediaContent");

        var sqlStmt = "SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN album_permissions AS ap ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id WHERE am.guid = ? AND am.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY am.timestamp LIMIT ?";
        // var sqlStmt = 'SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN album_permissions AS ap ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id WHERE ap.fguid = ? AND ap.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY am.timestamp LIMIT ?';
 
        // SELECT FOUND_ROWS(); 


        // var sqlStmt = 'SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN album_permissions AS ap ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id  LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id WHERE am.guid = ? AND am.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY am.timestamp LIMIT ?';
        var parameters = [guid, fguid, albumId, numberOfItems];

        mediaContentResults(sqlStmt, parameters, true);
    }


/**
 * 
 *  SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`
 *  FROM `album_media` 
 *      INNER JOIN album_permissions AS ap 
 *      ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
 *  WHERE am.guid = ? AND am.album_id = ? 
 *  ORDER BY timestamp 
 *  LIMIT ?';
 * 
 * 
 * 
 *  SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`
 *  FROM `album_media` 
 *      INNER JOIN album_permissions AS ap 
 *      ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
 *  WHERE am.guid = ? AND am.album_id = ? AND timestamp > ? 
 *  ORDER BY timestamp 
 * LIMIT ?';


 * 
 */
      


    /**
     * This will get items from the start of an album or if lastMedia info is included starts from that item
     * 
     * 
     *  SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`
     *  FROM `album_media` AS am 
     *      INNER JOIN album_permissions AS ap 
     *      ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
     *  WHERE am.guid = ? AND am.album_id = ? 
     *  ORDER BY timestamp 
     *  LIMIT ?';

     
     */ 
// UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp
    function getPrivateFolloweringMediaContent( guid, fguid, albumId, lastMediaTime, lastMediaUrl, numberOfItems ) {
        console.log("getPrivateFolloweringMediaContent");

        var sqlStmt = 'SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN album_permissions AS ap ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id WHERE am.guid = ? AND am.album_id = ? ORDER BY timestamp LIMIT ?';
        var parameters = [guid, fguid, albumId, numberOfItems];

        if ( isStringWithLength(lastMediaUrl) && isStringWithLength(lastMediaTime) ) {

            console.log("getPrivateMediaContent lastMediaUrl: " + lastMediaUrl);

            sqlStmt = 'SELECT am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN album_permissions AS ap ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id WHERE am.guid = ? AND am.album_id = ? AND timestamp > FROM_UNIXTIME(?) ORDER BY timestamp LIMIT ?';
            parameters = [guid, fguid, albumId, lastMediaTime, numberOfItems];
           
        }
        mediaContentResults(sqlStmt, parameters, false);
    }


/**
 * 
 *  SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`
 *  FROM `album_media` 
 *      INNER JOIN album_permissions AS ap 
 *      ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
 *  WHERE am.guid = ? AND am.album_id = ? 
 *  ORDER BY timestamp DESC
 *  LIMIT ?';
 * 
 * 
 * 
 * SELECT am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`
 *  FROM `album_media` 
 *      INNER JOIN album_permissions AS ap
 *      ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
 *  WHERE am.guid = ? AND am.album_id = ? AND timestamp < ? 
 *  ORDER BY timestamp DESC
 * LIMIT ?';
 * 
 * 
 */

    function getPrivateFolloweringPreviousMediaContent( guid, fguid, albumId, lastMediaTime, lastMediaUrl, numberOfItems ) {
        console.log("getPrivateFolloweringPreviousMediaContent");

        var sqlStmt = 'SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` INNER JOIN album_permissions AS ap ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id WHERE am.guid = ? AND am.album_id = ? AND timestamp < FROM_UNIXTIME(?) ORDER BY timestamp DESC LIMIT ?';
        var parameters = [guid, fguid, albumId, lastMediaTime, numberOfItems];

        mediaContentResults(sqlStmt, parameters, false);
    }



/*

     * 
     *  SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, am.`timestamp`, am.`type`, am.`timelimit`
     *  FROM `album_media` AS am 
     *      INNER JOIN album_permissions AS ap 
     *      ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
     *  WHERE am.guid = ? AND am.album_id = ? 
     *  ORDER BY timestamp 
     *  LIMIT ?';



    SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
    FROM `album_media` AS am 
        INNER JOIN album_permissions AS ap 
        ON ap.guid = ? AND ap.fguid = am.guid AND ap.album_id = am.album_id 
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
    WHERE am.guid = ? AND am.album_id = ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) 
    ORDER BY am.timestamp 
    LIMIT ?";

    


        //Start from beginning

    SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, 
            UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit`
    FROM `album_media` AS am 
        INNER JOIN user_album 
        ON user_album.guid = am.guid AND user_album.id = am.album_id 
    WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 
    ORDER BY timestamp 
    LIMIT ?';


    // New Content

    SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, 
        UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
    FROM `album_media` AS am 
        INNER JOIN user_album 
        ON user_album.guid = am.guid AND user_album.id = am.album_id
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = ap.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
   

    WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) 
    ORDER BY timestamp
    LIMIT ?';

            var sqlStmt = 'SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN user_album ON user_album.guid = am.guid AND user_album.id = am.album_id LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = am.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND timestamp > FROM_UNIXTIME(?) AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY timestamp LIMIT ?';


    
    SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
    FROM `album_media` AS am 
        INNER JOIN user_album 
        ON user_album.guid = am.guid AND user_album.id = am.album_id 
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = am.guid AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
    WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY timestamp LIMIT ?';

    

    SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
    FROM `album_media` AS am 
        INNER JOIN user_album 
        ON user_album.guid = am.guid AND user_album.id = am.album_id
            LEFT JOIN album_last_viewed_media AS alvm 
            ON alvm.guid = ? AND alvm.fguid = am.guid AND alvm.album_id = am.album_id 
    WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp)
    ORDER BY timestamp LIMIT ?';



*/


    function getPublicMediaContentWithNewContent(guid, fguid, albumId, numberOfItems) {
        console.log("getPublicMediaContentWithNewContent");
        
        var sqlStmt = 'SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN user_album ON user_album.guid = am.guid AND user_album.id = am.album_id LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = ? AND alvm.fguid = am.guid AND alvm.album_id = am.album_id WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY timestamp LIMIT ?';
        
        var parameters = [ guid, fguid, albumId, numberOfItems];

        if ( isStringWithLength(lastMediaUrl) && isStringWithLength(lastMediaTime) ) {

            console.log("getPublicMediaContentWithNewContent loading more content");
            
            sqlStmt = 'SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN user_album ON user_album.guid = am.guid AND user_album.id = am.album_id LEFT JOIN album_last_viewed_media AS alvm ON alvm.guid = ? AND alvm.fguid = am.guid AND alvm.album_id = am.album_id WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND timestamp > ? AND (alvm.last_viewed_timestamp IS NULL OR am.timestamp > alvm.last_viewed_timestamp) ORDER BY timestamp LIMIT ?';
            parameters = [ guid, fguid, albumId, lastMediaTime, numberOfItems];
        }
        //     // This is for when we open an album the existed before and we're starting from where the new media starts
        //    if (typeof(startingWithNewMedia) === "boolean" && startingWithNewMedia) {
        //         sqlStmt = 'SELECT guid, album_id, `media_url`, `timestamp`, `type`, `timelimit` FROM `album_media` INNER JOIN user_album ON user_album.guid = album_media.guid WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND timestamp >= ? ORDER BY timestamp LIMIT ?';            
        //         parameters = [ fguid, albumId, lastMediaTime, 4];
        //    }
        // }
        mediaContentResults(sqlStmt, parameters, true);
    }


    /**
     * 
     * 
     
     SELECT am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
     FROM `album_media` AS am 
        INNER JOIN user_album 
        ON user_album.guid = am.guid AND user_album.id = am.album_id 
    WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND timestamp > FROM_UNIXTIME(?) 
    ORDER BY timestamp 
    LIMIT ?';            


    SELECT am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` 
    FROM `album_media` AS am 
        INNER JOIN user_album 
        ON user_album.guid = am.guid AND user_album.id = am.album_id 
    WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND timestamp > FROM_UNIXTIME(?)
    ORDER BY timestamp LIMIT ?';            



     */
    function getPublicMediaContent(fguid, albumId, numberOfItems) {
        console.log("getPublicMediaContent");
        
        var sqlStmt = 'SELECT SQL_CALC_FOUND_ROWS am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN user_album ON user_album.guid = am.guid AND user_album.id = am.album_id WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 ORDER BY timestamp LIMIT ?';
         
        var parameters = [ fguid, albumId, numberOfItems];

        if ( isStringWithLength(lastMediaUrl) && isStringWithLength(lastMediaTime) ) {
            console.log("getPublicMediaContent loading more content");
            console.log("getPublicMediaContent lastMediaTime: " + lastMediaTime);
            //AND id <> ? 
            sqlStmt = 'SELECT am.guid, am.album_id, am.`media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, am.`type`, am.`timelimit` FROM `album_media` AS am INNER JOIN user_album ON user_album.guid = am.guid AND user_album.id = am.album_id WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND timestamp > ? ORDER BY timestamp LIMIT ?';            
            parameters = [ fguid, albumId, lastMediaTime, numberOfItems];
        }

        //     // This is for when we open an album the existed before and we're starting from where the new media starts
        //    if (typeof(startingWithNewMedia) === "boolean" && startingWithNewMedia) {
        //         sqlStmt = 'SELECT guid, album_id, `media_url`, `timestamp`, `type`, `timelimit` FROM `album_media` INNER JOIN user_album ON user_album.guid = album_media.guid WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND timestamp >= ? ORDER BY timestamp LIMIT ?';            
        //         parameters = [ fguid, albumId, lastMediaTime, 4];
        //    }
        // }
        mediaContentResults(sqlStmt, parameters, false);
    }


    function getMyMediaContent( guid ) {

        console.log("getMyMediaContent");
        var mediaQuery = 'SELECT `media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, `type`, `timelimit` FROM `album_media` WHERE guid = ? AND album_id = ? ORDER BY timestamp LIMIT ?';

        // var mediaQuery = 'SELECT `media_url`, `timestamp`, `type`, `timelimit` FROM `album_media` WHERE guid = ? AND album_id = ? AND timestamp > NOW() - INTERVAL 1 DAY ORDER BY timestamp LIMIT ?';
        var inputValues = [ guid, albumId, MAX_MEDIA_RESULTS ];

        if (lastMediaUrl !== undefined && lastMediaUrl !== null && lastMediaTime !== undefined && lastMediaTime !== null ) {

            console.log("lastMediaUrl is not null and lastMediaTime is not null");

            mediaQuery = 'SELECT `media_url`, UNIX_TIMESTAMP(`timestamp`) AS timestamp, `type`, `timelimit` FROM `album_media` WHERE guid = ? AND album_id = ? AND timestamp > FROM_UNIXTIME(?) AND media_url <> ? ORDER BY timestamp LIMIT ?';
            // mediaQuery = 'SELECT `media_url`, `timestamp`, `type`, `timelimit` FROM `album_media` WHERE guid = ? AND album_id = ? AND timestamp > NOW() - INTERVAL 1 DAY AND timestamp > ? AND media_url <> ? ORDER BY timestamp LIMIT ?';
            inputValues = [ guid, albumId, lastMediaTime, lastMediaUrl, MAX_MEDIA_RESULTS ];
        }
        
        connection.query({
            sql   : mediaQuery,
            values: inputValues, 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else if (results) {

                console.log('Results:', JSON.stringify(results, null, 2));

                if (results.length > 0) {

                    var objects = [];

                    results.forEach((result) => {

                        var object = {};
                        // object.media = base64Data;
                        object[kGuid]      = guid;
                        object[kAlbumId]   = albumId; 
                        object[kType]      = result.type; // video, gif, photo

                        var params = {  Bucket  : ALBUM_BUCKET,  
                                        Key     : albumMediaKey(guid, result.media_url, result.type), 
                                        Expires : S3_EXPIRE_LIMIT 
                                    };

                                    // albumMediaKey(guid, mediaUrl, mediaType) 
        //                 Key     : albumMediaKey(guid, mediaUrl, mediaContentType), 

                        object[kSignedUrl] = s3.getSignedUrl('getObject', params);

                        object[kMediaURL]  = result.media_url;
                        object[kTimestamp] = result.timestamp.toString();
                        object[kTimelimit] = result.timelimit

                        objects.push(object);
                    });

                    finalAppResponse( mediaResponse( objects));

                } else {
                    // Nothing to downlaod
                    finalAppResponse( errorResponse( "Album does not exist"));
                }
            } else {
                finalAppResponse( errorResponse( ErrorMessageGeneric));
            }
        });
    }




    function getNumberOfUnseenItems() {

        var querySql = 'SELECT COUNT(*) as unseenCount FROM album_last_viewed_media AS flvm RIGHT JOIN album_media ON flvm.fguid = album_media.guid AND flvm.album_id = album_media.album_id AND flvm.guid = ? WHERE album_media.guid = ? AND album_media.album_id = ? AND (flvm.last_viewed_timestamp IS NULL OR album_media.timestamp > flvm.last_viewed_timestamp)'

        var parameters = [guid, fguid, albumId]
        
    }


    
    let NOT_PRIVATE = 0;
    let YES_PRIVATE  = 1;

    // function getPublicAlbum(guid, id) {
    //     /* Confirm Album is in fact public */
    //     connection.query({
    //         sql: 'SELECT is_private FROM `user_album` WHERE guid = ? AND id = ?',
    //         values: [ guid, id ], 
    //     },
    //     function (err, results) {
    //         if (err) {
    //             printError(err);
    //             finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
    //         } else if (results) {
    //             //We do in fact have permission to album
    //             //  Get mediaURls

    //             if (results.length > 0 && results[0].is_private === NOT_PRIVATE) {
            
    //                 getMyMediaContent( guid );

    //             } else {
    //                 // Album doesn't exist
    //                 appResponse(false, null, Messages.AlbumGone);
    //             }
    //         } else {
    //             console.log('Error:', JSON.stringify(err, null, 2));
    //             finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
    //         }
    //     });
    // }




    /**
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     *  
     * 
     *                     Update media content viewed
     * 
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     */

     /**
      * If lastMediaUrl is wrong we will get an error return
      */

    //TODO: Shall we place a condition so that  last_viewed_media_url and last_viewed_timestamp are correct and not error
    function didViewFriendMedia( guid, fguid, albumId, lastMediaUrl ) {
        console.log("didViewFriendMedia");

        // var parameters = [guid, fguid, albumId, lastMediaUrl, lastTimestamp];
        // var sqlStmt = "INSERT INTO `album_last_viewed_media` SET guid = ? , fguid = ?, album_id = ?, `last_viewed_media_url` = ?, last_viewed_timestamp = ? ON DUPLICATE KEY UPDATE last_viewed_media_url=VALUES(last_viewed_media_url), last_viewed_timestamp=VALUES(last_viewed_timestamp)",

/**
 * 
 * 
 * 
         *  'INSERT INTO `notifications` (guid, fguid, type) \
            VALUES ? \
            ON DUPLICATE KEY UPDATE type = VALUES(type)'

            INSERT INTO daily_events
            (created_on, last_event_id, last_event_created_at)
            VALUES
            ('2010-01-19', 23, '2010-01-19 10:23:11')
            ON DUPLICATE KEY UPDATE
            last_event_id = IF(last_event_created_at < VALUES(last_event_created_at), VALUES(last_event_id), last_event_id),
            last_event_created_at = IF(last_event_created_at < VALUES(last_event_created_at), VALUES(last_event_created_at), last_event_created_at);

            // Order here matters!!!

            1) last_viewed_media_url = IF(last_viewed_timestamp < VALUES(last_viewed_timestamp), VALUES(last_viewed_media_url), last_viewed_media_url),
            2) last_viewed_timestamp = IF(last_viewed_timestamp < VALUES(last_viewed_timestamp), VALUES(last_viewed_timestamp), last_viewed_timestamp) 
            
            
            

        INSERT INTO `album_last_viewed_media` (guid, fguid, album_id, `last_viewed_media_url`, last_viewed_timestamp) 
        VALUES ? ON DUPLICATE KEY UPDATE last_viewed_media_url = IF(last_viewed_timestamp < VALUES(last_viewed_timestamp), VALUES(last_viewed_media_url), last_viewed_media_url), last_viewed_timestamp = IF(last_viewed_timestamp < VALUES(last_viewed_timestamp), VALUES(last_viewed_timestamp), last_viewed_timestamp) ", //last_viewed_media_url=VALUES(last_viewed_media_url), last_viewed_timestamp=VALUES(last_viewed_timestamp)",


            (SELECT timestamp FROM album_media AS am WHERE am.guid = ? AND am.media_url = ? AND am.album_id = ?)

        


 */
            // Need to get the timestamp from server

        connection.query({
            // sql: "UPDATE `album_last_viewed_media` SET `last_viewed_media_url` = ?, last_viewed_timestamp = ? WHERE `guid` = ? AND `fguid` = ? AND album_id = ?",
            sql: "INSERT INTO `album_last_viewed_media` (guid, fguid, album_id, `last_viewed_media_url`, last_viewed_timestamp) VALUES (?, ?, ?, ?, (SELECT timestamp FROM album_media AS am WHERE am.guid = ? AND am.media_url = ? AND am.album_id = ? LIMIT 1 ) ) ON DUPLICATE KEY UPDATE last_viewed_media_url = IF(last_viewed_timestamp < VALUES(last_viewed_timestamp), VALUES(last_viewed_media_url), last_viewed_media_url), last_viewed_timestamp = IF(last_viewed_timestamp < VALUES(last_viewed_timestamp), VALUES(last_viewed_timestamp), last_viewed_timestamp) ", //last_viewed_media_url=VALUES(last_viewed_media_url), last_viewed_timestamp=VALUES(last_viewed_timestamp)",
            // sql: "INSERT INTO `album_last_viewed_media` SET guid = ? , fguid = ?, album_id = ?, `last_viewed_media_url` = ?, last_viewed_timestamp = ? ON DUPLICATE KEY UPDATE last_viewed_media_url=VALUES(last_viewed_media_url), last_viewed_timestamp=VALUES(last_viewed_timestamp)",
            values: [ guid, fguid, albumId, lastMediaUrl, fguid, lastMediaUrl, albumId ]
        }, function (err, results) {
 
            var didUpdate = false;
            if (err) {
                printError(err);
            } else {
                console.log("didViewFriendMedia ok");
                didUpdate = true;
            }

            // Insert users view history.  (Can be unlimited number of times)
            connection.query({
                sql: 'INSERT INTO media_view_history SET `guid` = ?, `fguid` = ?, `album_id` = ?, media_url = ?',
                values: [guid, fguid, albumId, lastMediaUrl ]
            }, function (err, results) {
                if (err) {
                    printError(err);
                } else {
                    console.log("Insert media_view_history ok");
                }
                finalAppResponse( updateViewResponse(didUpdate));
            });
        });
    } 


    function checkAccessPermissions(guid) {
        console.log("checkAccessPermissions");

        connection.query({
            sql: 'SELECT COUNT(*) as count FROM `album_permissions` WHERE guid = ? AND fguid = ? AND album_id = ?',
            values: [ guid, fguid, albumId ], 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
           
            } else if (results) {
                //We do in fact have permission to album
                //  Get mediaURls

                console.log("checkAccessPermissions results:"  + results);

                if (results.length > 0) {
         
                     if ( action.localeCompare(kDidViewMedia ) === 0) {
                        
                        didViewFriendMedia(guid, fguid, albumId, lastMediaUrl );

                    } else {   

                        finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
                    }

                } else {
                    // Album doesn't exist
                    appResponse(false, null, Messages.AlbumGone);
                }
            } else {
                printError(error);
                finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
            }
        });
    }
    



/**
 * ==========================================================================================
 * ==========================================================================================
 * ==========================================================================================
 *  
 * 
 *                             Create album 
 * 
 * 
 * ==========================================================================================
 * ==========================================================================================
 * ==========================================================================================
 * ==========================================================================================
 */






















 /** 
  * Insert hashtag into `tag` table in background

    This will split the word into substrings for search
  **/

  
    /**
     * 
     *  SOrt hastags either by number of album mentions, or trending
     * 
     *  substring,  word,       count, rank
     *  a ,         apple,      +1,
     *  ap,         apple,      +1,
     *  app,        apple,      +1,
     *  .
     *  .
     *  .
     * apple,       apple,      +1
     *  .
     *  .
     *  .
     *  ppl,        apple,      +1
     * 
     * 
     * 
     *  Search hashtag by trends and most popular
     * 
     *  Table: hashtags
     *  substring,  word,       count, rank
     *  ap,         apple,      2,331,
     *  ap,         apples,       191,
     *  ap,         applegate,    939,
     * 
     * 
        SELECT word, count, 
        FROM hashtags
        WHERE substring = ?
        ORDER BY count LIMIT 100


        how to rank albums when user selects search for 

        Table: tagged_albums
           * PRIMARY KEY =  (tag, guid, album_id)
     *  tag,   guid,    album_id,   rank
     * 
     *  apple, ec#5j,   393f93f,    813
     *  apple, ec#5j,   nf90onf,    329
     *  apple, os#ff,   e90habv,    9,838
     *  apple, 6n#f5,   093h8f3,    1,202
     *  apple, pb#eb,   93nid0w,    790
     *  apple, pb#eb,   nf0ab83,    318
     * tagged_albums
     * 
     * 
     * 
        ====   Insert album  =====

        INSERT INTO tagged_albums
        SET tag = ?, guid = ?, album_id = ?

        [hashtag, guid, albumId ]



        // ONly recent albums? Or best albums with tag?
        ===     Search for  Album for hashtag ========

         SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
         FROM `user_album` 
            INNER JOIN tagged_albums ta
            ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id
                INNER JOIN `profile` 
                ON `user_album`.`guid` = `profile`.`guid` 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ?
        AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE
        ORDER BY 
            LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC
        LIMIT ?, ?';


            LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes)
            + (UNIX_TIMESTAMP(create_date) / 300000) DESC



        var last23HoursAnd50Minutes = (23*60 + 50) * NUMBER_OF_DAYS_GOOD;
        var maxAlbums = 60;
        var offSet =  currentPage * maxAlbums
       
        [hashtag, interval, offSet, maxAlbums ]


        SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, user_album.number_of_replies, user_album.number_of_total_replies, `id` AS album_id, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
        FROM `user_album` 
            INNER JOIN tagged_albums ta 
            ON `user_album`.`guid` = ta.`guid` AND user_album.id = ta.album_id 
                INNER JOIN `profile` 
                ON `user_album`.`guid` = `profile`.`guid` 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0 AND count > 0  AND tag = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE 
        ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC 
        LIMIT ?, ?';

    */



    // function searchAlbumsForTag(hashtag) {


        
    //     var last23HoursAnd50Minutes = (23*60 + 50) * NUMBER_OF_DAYS_GOOD;
    //     var maxAlbums = 60;
    //     var offSet =  currentPage * maxAlbums
    //     // var topTrendingAlbums = 'SELECT `guid`, `id`, `count`, `title`, `create_date`, `newest_media_timestamp`, `cover_album_url` FROM `user_album` WHERE `is_private` = 1 AND score = ? AND views = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 ORDER BY score DESC LIMIT ?,?';
    //     var topTrendingAlbums = 'SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, user_album.number_of_replies, user_album.number_of_total_replies, `id` AS album_id, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `user_album` INNER JOIN tagged_albums ta ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id INNER JOIN `profile` ON `user_album`.`guid` = `profile`.`guid` WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC LIMIT ?, ?';
    //     var parameters = [hashtag, last23HoursAnd50Minutes , offSet, maxAlbums];

        
    //     connection.query({
    //         sql: topTrendingAlbums,
    //         values: parameters
    //     }, 
    //     function (error, results, fields) {
    //         if (error) {
    //             printError(error);
    //             finalAppResponse( errorResonse(ErrorMessageGeneric) );
    //         } else { 
    //             if (results) {
    //                 console.log(results.length);
    //                 console.log("results: " + JSON.stringify(results));


    //                 let allAlbums = getAlbumsFromResults(results);
    //                 finalAppResponse( getAlbumsResponse( allAlbums)); 

    //             }
    //         }
    //     });
    // }
 

    /** When to insert this */

    // usernames can change, 
    // hashtags cannot

    // hastags in album are part of the search and are clickable
    // hashtags in comments are only clickable, not part of search

    // hashtags 

    function insertAlbumHashtags(tags, guid, albumId, callback) {
        
        if (tags.length === 0) {
            callback(true);
            return;
        }

        var aclList = [];
        tags.forEach((tag) => {
            aclList.push([tag, guid, albumId]);
        });
        

        console.log('insertAlbumHashtags albums:', JSON.stringify(aclList, null, 2));


        connection.query({
            sql: 'INSERT INTO `tagged_albums` (tag, guid, album_id) VALUES ?',
            values: [aclList] , 
        }, 
        function (err, results, fields) {
            console.log("results: " + JSON.stringify(results));

            if (err) {
                // Rollback on failure
                callback(false);
                
            } else {
                // Continue
                insertHashtag(tags, callback);
                
                //     function(succes) {
                    
                // });
                // callback(true);
            }
        });
    }



    function insertHashtag(allHashtags, callback) {

        console.log("insertHashtag: ");

        var aclList = [];
        allHashtags.forEach((tag) => {
            console.log("insertHashtag tag: " + tag);

            aclList.push([tag, tag, 1]);
        });
    
        connection.query({
            sql: 'INSERT INTO `hashtags` (substring, tag, count) VALUES ? ON DUPLICATE KEY UPDATE count=count+1 ',
            values: [aclList] , 
        },
        function (err, results, fields) {
            console.log("results: " + JSON.stringify(results));

            if (err) {

                console.log("insertHashtag false");

                printError(err);     
                callback(false);
            
            } else {
                console.log("insertHashtag success");

                // Continue
                callback(true);
            }
        });
    }
    
     

    /** Called when we delete album, maybe change title */
    function deleteTaggedAlbum(guid, albumId) {

        console.log('deleteTaggedAlbum albums:');
        
        connection.query({
            sql: 'DELETE FROM `tagged_albums` guid = ? AND album_id = ?',
            values: [guid, albumId] , 
        }, 
        function (err, results, fields) {

            console.log("results: " + JSON.stringify(results));

            if (err) {
                // Rollback on failure
                
                 
            } else {

                // Continue

            }
        });
    }
    


    /** Splits tags into substrings */
    function getSubstringsFor(terms) {
        
        var list = [];

        for (var index = 0; index < terms.length; index++) { 
            let term = terms[index];

            for (var startingIndex = 0; startingIndex < term.length; startingIndex++) {
                for (var stringLength = 1; stringLength <= term.length - startingIndex; stringLength++) {
                    let subString = term.substr(startingIndex, stringLength);
                    list.push(subString);
                }
            }
        }
        let filteredKeywords = Array.from(new Set(list));
        return filteredKeywords;
    }

            
    function insertHashTagForBackgroundWork(tag) {
        
    }        

    // On background server
    function updateHashTag(tag) {





 /** 
  * Insert hashtag into `tag` table in background

    This will split the word into substrings for search
  **/

  
    /**
     * 
     *  SOrt hastags either by number of album mentions, or trending
     * 
     * a, apple
     * ap, apple
     * app, apple
     * appl, apple
     * apple, apple
     * 
     *  substring,  word,       count, rank
     *  a ,         apple,      +1,
     *  ap,         apple,      +1,
     *  app,        apple,      +1,
     *  .
     *  .
     *  .
     * apple,       apple,      +1
     *  .
     *  .
     *  .
     *  ppl,        apple,      +1
     * 
     * 
     * 
     *  Search ap: -> Returns list of words
     *  Search hashtag by trends and most popular
     * 
     *  Table: hashtags
     *  substring,  word,       count, rank
     *  ap,         apple,      2,331,
     *  ap,         apples,       191,
     *  ap,         applegate,    939,
     * 
     * 
        SELECT word, count, 
        FROM hashtags
        WHERE substring = ?
        ORDER BY count LIMIT 100

        
     */
        /*
        Nack


        1) After we insert (hashtag, guid, album_id) into tagged_albums

        2) In Background, we insert
            For each substring:
                (substring, word, guid, album_id, date)

        SELECT word, count, 
        FROM hashtags
        WHERE substring = ?
        ORDER BY count LIMIT 100




        INSERT INTO tagged_albums
        SET tag = ?, guid = ?, album_id = ?

        [hashtag, guid, albumId ]

        
            INSERT INTO tags SET word = ?, count = count+1

            var param = [tag];
        */
        
        var sqlQuery = "SELECT word, count, FROM tags WHERE substring = ? ORDER BY count LIMIT 100";
        
    }





    


    /**
     * =========================================================================================
     * 
     *                             Create Public album 
     * 
     * ==========================================================================================
     */
    
     

     /**
      * 

      View my comments:
        SELECT commenter_guid, commenting_to_guid, commenting_on, object_id, comment, date, 
        FROM comments
            INNER JOIN albums
            ON
        WHERE guid = 'commenter_guid'
     

        


      Get Comments for album for viwers and user.
      
        comments_table

        
        commenter_guid, owner_id, album_id, commenting_to_guid, comment, date, 


        SELECT commenter_guid, commenting_to_guid, object_id, comment, date, 
        FROM comments
            INNER JOIN on friends and  permissions 
            
        WHERE owner_id = 'album_owner' AND album_id = 'album_id'



        Select comments with a 4 replies? Show 3 and then show to uesr "View more"


        SELECT commenter_guid, owner_id, album_id, commenting_to_guid, comment, date, 
        FROM comments c1
            LEFT JOIN comments c2
            ON c1.owner_id = c2.owner_id AND c1.album_id = c2.'album_id' AND 

        WHERE owner_id = 'album_owner' AND album_id = 'album_id'



        1) When user changes their username, update all references to username
        
        2) If another user, edits their comment or album title and removes name, remove mention immediately

        after updating username,

        add to cron_background_job, update_username

        SELECT all mentions:

        SELECT each mention replace @username and UPDATE
        m
        mentions table
        
        guid_mentioned,
        mentioned_by_guid,
        mention_type (type: album_title, profile, comment, etc)
        mentioned_in_id, (album_id, comment_id, profile=null)

        

        hashtag table

      */


      
    var MentionType = {
        AlbumTitle               : 0,
        Comment             : 1
    };




    function getNotificationId(results, guid) {
        
        results.forEach((result) => {
            console.log(result);

            if (result.guid.localeCompare( guid ) === 0 ) {
                return result.id;
            } 
        });
        return null;
    }

    function nextMaxNotificationId( id ) {

        if (id === null ) {
            return 0;
        } 
        return id += 1;        
    }

    // Notifications Type
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



    function rollbackErrorResponse(err) {
        printError(err);        
        connection.rollback(function() {
           finalAppResponse(errorResponse( ErrorMessageGeneric));
       });
   }

    function rollbackErrorResponseWithMessage(err, message) {
        printError(err);        
        connection.rollback(function() {
           finalAppResponse(errorResponse( message));
       });
   }

   
   

    function createAlbumCommit(albumId) {
        
        connection.commit(function(err) {    
            if (err) {
                rollbackErrorResponse(err);
            } else  {
                console.log('successful commit!');

                console.log('successful commit!');
                finalAppResponse( createAlbumResponse( albumId));
                // finalAppResponse( friendActionResponse( 
                //     true, Relationship.FollowRequested));
            }
        });
    }


    function notificationCommit(albumId) {
        
        connection.commit(function(err) {    
            if (err) {
                rollbackErrorResponse(err);
            } else  {
                console.log('successful commit!');

                console.log('successful commit!');
                finalAppResponse( createAlbumResponse( albumId));
                // finalAppResponse( friendActionResponse( 
                //     true, Relationship.FollowRequested));
            }
        });
    }



    // TODO: Change the get MAX(id) to  
    // => coalesce(MAX(`comment_id`) + 1, 0)


    // Send a Follow Request with a private account

    // NotificationType.MentionedInAlbum or MentionedInComment
    function sendMentionNotifications(fguid, albumOwner, albumId, commentId, mentionedGuids, mentionedIn, callback) {
        
        printTimeForEvent("sendMentionNotifications" );
    
        if (mentionedGuids.length == 0) {
            callback(null);            
            return;
        };

        
        // INSERT INTO album_comments (guid, album_id, parent_id, comment_id, commenter_guid, comment) SELECT ?, ?, ?, coalesce(MAX(`comment_id`) + 1, 0), ?, ? 
        // FROM `album_comments` 
        // WHERE guid = ? AND album_id  = ?",



        // INSERT INTO `notifications` (guid, id, fguid, type, album_owner, album_id, comment_id) VALUES ?',


        
        // See if there is a relationship already
        connection.query({
            sql: "SELECT `guid`, MAX(`id`) as id FROM `notifications` WHERE `guid` in (?)",
            values: [ mentionedGuids ]
        }, 
        function (err, results) {
           
            console.log('Results:', JSON.stringify(results, null, 2));

            
            if (err) { 
                printError(err);                
                callback(err);
            } else if (results && results.length > 0) {
                
                var rows = [];
                results.forEach((result) => {
                    rows.push([ result.guid, nextMaxNotificationId(result.id), fguid, mentionedIn, albumOwner, albumId, commentId]);
                }); 
                
                // See if there is a relationship already
                var query = connection.query({
                    sql: 'INSERT INTO `notifications` (guid, id, fguid, type, album_owner, album_id, comment_id) VALUES ?',
                    values: [rows]
                },
                function (err, results) {
                    console.log('Results:', JSON.stringify(results, null, 2));                    
                    if (err) { 
                        printError(err);                                        
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            } else {
                callback(null);                
            }
        });
    }
        
      
            // get guid of username,
            
            // insert into mentions table
                
            //  Insert into notifications, for each user mentioned, that a user mentioned them

    function insertMentionsForCreatedAlbum(albumOwnerGuid, albumId, title ) {

        console.log("insertMentionsForCreatedAlbum");
        
        // var possibleMentinos = title.split(" ");

        // find all mentions of any users 
        var allMentions = getAllMentionedUsers(title);
         
        getGuidsOfUsernames(allMentions, function(results) {

            var mentionRows    = [];
            var mentionedGuids = [];            

            if (results !== null && results.length > 0 ) {


                results.forEach((result) => {
                    mentionedGuids.push([ result.guid ]);
                    mentionRows.push([ result.guid, albumOwnerGuid, albumOwnerGuid, albumId, MentionType.AlbumTitle]);
                }); 
            }

            insertNewMentionedUsers(mentionedGuids, albumOwnerGuid, albumOwnerGuid, albumId, function (mentionSuccess) {
                
                // Insert into notiifications
                // sendMentionNotifications(guid, albumId, mentionedGuids);
        
                if (!mentionSuccess) {
                    
                    console.log("insertNewMentionedUsers not success");
                    rollbackErrorResponse(err);

                } else {

                    // // find all hashtags
                    var allHashtags = getAllHashtagsFromText(title);
                    
                    console.log("allHashtags " + allHashtags);

                    insertAlbumHashtags(allHashtags, albumOwnerGuid, albumId, function(hashtagSuccess) {

                        console.log("insertAlbumHashtags value is: " + hashtagSuccess);

                        if (!hashtagSuccess) {
                            console.log("insertNewMentionedUsers not success");
                            rollbackErrorResponse(err);
        
                        } else {
        
                            console.log("insertNewMentionedUsers success");
                            createAlbumCommit(albumId);
                        }
                    });
                }
            });
        });
    
        //             // INSERT INTO `mentions` ( guid_mentioned, mentioned_by , mentioned_in, mention_type) 
        //             //     (SELECT guid, ?, ?, ?
        //             //     FROM profile 
        //             //     WHERE username in (?)
        //             //     )

        //             //     param = guid, albumId, MentionType.AlbumTitle
                    

        //             // guid_mentioned : guid mentioned
        //             // mentioned_by   :  person who mentioned other user
        //             // album_owner    :
        //             // album_id       : album_id mentioned in comment_id
        //             // mention_type   : album, comment, reply



        // if any hashtags, insert into background Worker
        // if any mentions of a username, get guid of username, and insert into mentions table


        // Insert into notifications, for each user mentioned, that a user mentioned them


    }

    

    
     
    var createAlbumErrorMessage = APP_NAME +  " cannot create your album. Try against shortly.";
     
    function insertLikeForUsersCreateAlbum(guid, albumId, title, callback) {
        console.log("insertLikeForUsersCreateAlbum");

        connection.query({
            sql: 'INSERT INTO user_album_likes SET `guid` = ?, `fguid` = ?, `album_id` = ?, `liked` = ?',
            values: [guid, guid, albumId, AlbumLike.liked ], 
        },
        function (err, results, fields) {
            if (err) {
                rollbackErrorResponseWithMessage(err, createAlbumErrorMessage);
                
            } else {

                callback();
                
                // // addAllFollowersForPublicAlbum(guid, albumId); 
                // connection.commit(function(err) {
                //     if (err) {
                //         // Failed to commit queries. Rollback on failure
                //         rollbackErrorResponseWithMessage(err, createAlbumErrorMessage);
                        
                //     } else  {
                //         insertMentionsForCreatedAlbum(guid, albumId, title);
                //     }
                // });
            }
        });
    }





    
    // TODO: setup groupDictionary
    function createPublicAlbum(guid, daysTillExpire, groupPostersDict) {
        console.log("createAlbum");
        
        var newAlbumId = generateRandomString();
        console.log("guid: " + guid + ", newAlbumId: " +  newAlbumId);

        connection.beginTransaction(function(err) {
            if (err) { 
                rollbackErrorResponse(err);
            } else {

                var sqlStmt = 'INSERT INTO `user_album` SET guid = ' + connection.escape(guid) + ', id = ' + connection.escape(newAlbumId) + ', title = ' + connection.escape(title) + ', is_private = ' + IsPublic + ', likes =' + 1;


                // var sqlStmt = 'INSERT INTO `user_album` SET ?';

            //     var paramsAlbum = {
            //         guid        : guid,
            //         id          : newAlbumId,
            //         title       : title,
            //         is_private  : IsPublic,
            //         likes       : 1
            //    };

                if (daysTillExpire !== null) {
                    sqlStmt = 'INSERT INTO `user_album` SET guid = ' + connection.escape(guid) + ', id = ' + connection.escape(newAlbumId) + ', title = ' + connection.escape(title) + ', is_private = ' + IsPublic + ', likes =' + 1 + ', expire = ' + connection.escape(daysTillExpire) + ', expire_date = DATE_ADD(NOW(), INTERVAL ' + connection.escape(daysTillExpire) + ' DAY)';
                }
 
                connection.query({
                    sql     : sqlStmt
                    // values  : paramsAlbum 
                },
                function (err, results, fields) {

                    if (err) {
                        if (err.code == "ER_DUP_ENTRY" && maxDuplicateRetires > 0) {
                            console.log("Album Id already exists. That's why I'm here to catch it!");
                            
                            maxDuplicateRetires -= 1;

                            createPublicAlbum(guid, daysTillExpire, groupPostersDict);
                            
                        } else {
                            
                            rollbackErrorResponseWithMessage(err, createAlbumErrorMessage);
                                              
                        }   
                    } else {
                        console.log("Results: " + results);
                        insertLikeForUsersCreateAlbum(guid, newAlbumId, title, function() {
                            insertMentionsForCreatedAlbum(guid, newAlbumId, title);
                        });            
                    }
                });
            }
        });
    }


//  *      How to get random 40 items
//  *        
//  *          Trending/Popular
//  * 
//  *      SELECT *
//  *      FROM popular_albums
//  *      WHERE likes = ?  AND views = ? 
//  *      
//  * 


// 'INSERT INTO `album_permissions` (guid, fguid, album_id) 
// SELECT `guid2` as guid, ? , ?
// FROM `friends` 
// WHERE `guid1` = ? AND (`status` = ? OR `status` = ? )',
            // [ guid, albumId, guid, Relationships.AcceptedFriendRequest, Relationships.FriendAcceptedRequest ]

// INSERT INTO Results ( People, names )
// VALUES
//     (
//      (SELECT d.id
//        FROM Names f
//        JOIN People d ON (d.id  = f.id) limit 1
//      ),
//      ("Henry"),
//     );



    function addAllFollowersForPublicAlbum(guid, albumId) {
        console.log("getAllFriends");
        connection.query({
            sql: 'INSERT INTO `album_permissions` (guid, fguid, album_id) SELECT `guid1` as guid, ? , ? FROM `friends` WHERE `guid2` = ? AND `status` = ?',
            values: [ guid, albumId, guid, Relationship.IsFollowing] 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, createAlbumErrorMessage ));
            } else {
                 connection.commit(function(err) {
                    if (err) {
                        // Failed to commit queries. Rollback on failure
                        rollbackErrorResponseWithMessage(err, createAlbumErrorMessage);
                        
                    } else  {
                        console.log('successful commit!');
                        finalAppResponse( createAlbumResponse( albumId));
                    }
                 });   
            }
        });
    }





    function addUsersToACL(guid, albumId, followersGuids) {

        console.log("addUsersToACL");

        var aclList = [];

        followersGuids.forEach((followerGuid) => {
            aclList.push([ followerGuid, guid, albumId ]);
        });

        console.log('aclList:', JSON.stringify(aclList, null, 2));


        var query = connection.query({
            sql: 'INSERT INTO `album_permissions` (guid, fguid, album_id) VALUES ?',
            values: [aclList] , 
        }, 
        function (err, results) {

            console.log("results: " + JSON.stringify(results));

            if (err) {
                // Rollback on failure
                rollbackErrorResponse(err);                
                
            } else {
                 // Commit queries
                connection.commit(function(err) {
                    if (err) {
                        // Failed to commit queries. Rollback on failure
                        rollbackErrorResponse(err);                                        
                         
                    } else  {
                        console.log('successful commit!');

                        finalAppResponse( createAlbumResponse( albumId));
                    }
                });
            }
        });
    }




    
    var IsPrivate = 1;
    var IsPublic  = 0;

    /**
     * Change this later: daysTillExpire can be null if it is to never expire. 
     * @param {*} guid 
     * @param {*} followersGuids 
     * @param {*} daysTillExpire 
     */
    function createPrivateAlbum(guid, followersGuids, daysTillExpire) {
    
        console.log("createAlbum");

        var newAlbumId = generateRandomString();

        console.log("guid: " + guid + ", newAlbumId: " +  newAlbumId);

        connection.beginTransaction(function(err) {
            if (err) {
                printError(err);                
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else {


                var sqlStmt = 'INSERT INTO `user_album` SET guid = ' + connection.escape(guid) + ', id = ' + connection.escape(newAlbumId) + ', title = ' + connection.escape(title) + ', is_private = ' + IsPrivate + ', likes =' + 1;
                if (daysTillExpire !== null) {
                    sqlStmt = 'INSERT INTO `user_album` SET guid = ' + connection.escape(guid) + ', id = ' + connection.escape(newAlbumId) + ', title = ' + connection.escape(title) + ', is_private = ' + IsPrivate + ', likes =' + 1 + ', expire = ' + connection.escape(daysTillExpire) + ', expire_date = DATE_ADD(NOW(), INTERVAL ' + connection.escape(daysTillExpire) + ' DAY)';
                }

                connection.query({
                    sql : sqlStmt
                }, 
                function (err, results, fields) {

                    if (err) {
                        if (err.code == "ER_DUP_ENTRY" && maxDuplicateRetires > 0) {
                            maxDuplicateRetires -= 1;

                            console.log("Media url already exists. That's why I'm here to catch it!");
                            createPrivateAlbum(guid, followersGuids, daysTillExpire);
                        
                        } else {
                            rollbackErrorResponseWithMessage(err, createAlbumErrorMessage);
                                        
                        }   
                    } else {
                        console.log("Results: " + results);
                        
                        addUsersToACL(guid, newAlbumId, followersGuids);            
                    }
                });
            }
        });
    }





    // function getFriendsNotIncluded(guid, daysTillExpire) {

    //     console.log("getFriendsNotExcluded");

    //     var queryFriendsSql = 'SELECT `guid1` as guid FROM `friends` WHERE `guid2` = ? AND `guid1` NOT IN (?) AND `status` = ?';
    //     var parameters = [ guid, followersAddList, Relationship.IsFollowing ];
      
    //     if ( followersAddList === undefined || followersAddList === null || followersAddList.length === 0) {
    //         queryFriendsSql = 'SELECT `guid1` as guid FROM `friends` WHERE `guid2` = ? AND `status` = ?';
    //         parameters      = [ guid, Relationship.IsFollowing ];
    //     }

    //     connection.query({
    //         sql: queryFriendsSql,
    //         values: parameters, 
    //     }, 
    //     function (err, results) {
    //         if (err) {
    //             printError(err);
    //             finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
    //         } else {

    //             if (results && results.length > 0) {

    //                 var guids = [];
    //                 results.forEach((result) => {
    //                     guids.push(result.guid);
    //                 });

    //                 createPrivateAlbum(guid, guids, daysTillExpire );
    //             } else {
    //                 console.log('Error:', JSON.stringify(err, null, 2));
    //                 finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
    //             }
    //         }
    //     });
    // }




    /**
     * 
     * guid1 is the person following
     * guid2 is the person being followed
     * 
     * guid1 is following guid2
     * If not SubmittingToAll, so only add people I've seleclted
     */


    function prepareFollowersForCreatePrivateAlbum(guid, daysTillExpire, followersAddList, groupPostersDict) {

        console.log("prepareFollowersForCreatePrivateAlbum");
        
        getConfirmedFollowerGuids(guid, followersAddList, function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else {

                if (results && results.length > 0) {

                    var followerGuids = [];
                    results.forEach((result) => {
                        followerGuids.push(result.guid);
                    }); 

                    createPrivateAlbum(guid, followerGuids, daysTillExpire);
                } else {
                    printError(error);
                    finalAppResponse( activeResponse(ActiveValues.Active, "Couldn't find any of your selected followers" ));
                }
            }
        });
    }

    function getIncludedFriends(guid, daysTillExpire, followersAddList) {

        console.log("getIncludedFriends");

        var queryFriendsSql = 'SELECT `guid1` as guid FROM `friends` WHERE `guid2` = ? AND `guid1` IN (?) AND `status` = ?';

        connection.query({
            sql: queryFriendsSql,
            values: [ guid, followersAddList, Relationship.IsFollowing ], 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else {

                if (results && results.length > 0) {

                    var followerGuids = [];
                    results.forEach((result) => {
                        followerGuids.push(result.guid);
                    }); 

                    createPrivateAlbum(guid, followerGuids , daysTillExpire);
                } else {
                    printError(error);
                    finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                }
            }
        });
    }




    /**
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     *  
     * 
     *                                   Delete album 
     * 
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     */



    function deleteAllS3Media(guid, mediaUrlResults, albumId) {

        // Get array of Key: string for delteing

        // Maximum keys we can delete is 1,000
        let third = 333;
        let first500Results = mediaUrlResults.splice(0, third);

        var keys = [];
        
        first500Results.forEach((result) => {
            var mediaUrl = result.media_url;
            var mediaType = result.type;
            keys.push({ Key : albumMediaKey(guid, mediaUrl, mediaType)  });
            keys.push({ Key : albumCoverKey(guid, mediaUrl)  });
            keys.push({ Key : albumCoverThumbnailKey(guid, mediaUrl)  });
        });

        console.log('deleteAllS3Media keys:', JSON.stringify(keys, null, 2));


        var paramsDeleteMedia = {
            Bucket: ALBUM_BUCKET,
            Delete: { 
                Objects: keys,
                Quiet: true
            }
        };
        
        s3.deleteObjects(paramsDeleteMedia, function(err, data) {
            if (err) {
                rollbackErrorMessage(err, errorMessageDeleteAlbum);
            } else {
                console.log(data);           // successful response

                // If anymore results left over, delete more content
                if (mediaUrlResults.length > 0) {
                    deleteAllS3Media(guid, mediaUrlResults, albumId);
                } else {
                    commitAlbumTransaction(albumId);
                }
            }
        });
    }

    function updateAlbumCount(guid, deleteResults, albumId) {
        
        console.log("updateAlbumCount - guid: " + guid + "from albumId: " +  albumId);

        connection.query({
            sql: 'UPDATE user_album SET `count` = 0 WHERE `guid` = ? AND `id` = ?',
            values: [guid, albumId], 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } else if (results && results.affectedRows > 0 && deleteResults != null) {

                console.log('Results:', JSON.stringify(results, null, 2));
                deleteAllS3Media(guid, deleteResults, albumId);

            } else {
                // doesn't exist? So we're good
                commitAlbumTransaction(albumId);
            }
        });
    }

    function deleteAllMedia( guid, deleteResults, albumId ) {
        
        console.log("DeleteAllMedia - guid: " + guid + "from albumId: " +  albumId);

        connection.query({
            sql: 'DELETE FROM `album_media` WHERE `guid` = ? AND `album_id` = ?',
            values: [guid, albumId], 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } else if (results && results.affectedRows > 0) {

                console.log('Results:', JSON.stringify(results, null, 2));
                updateAlbumCount(guid, deleteResults, albumId);

            } else {
                // doesn't exist? So we're good
                updateAlbumCount(albumId);
            }
        });
    }


 
    // THis has to be a transaction, delete all media content then delete album


    // function deleteAlbum(guid, albumId) {
    
    //     console.log("deleteAlbum");
    //     console.log("guid: " + guid + ", Deleteing albumId: " +  albumId);

    //     connection.query({
    //         sql: 'DELETE FROM `user_album` WHERE `guid` = ? AND `id` = ?',
    //         values: [guid, albumId], 
    //     }, 
    //     function (err, results, fields) {

    //         if (err) {
    //             printError(err);
                // finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
    //         } else if (results && results.affectedRows > 0) {

    //             console.log("Results: " + results);                    
    //             callback(null, appResponse(true, albumId));
    //         } else {
                
    //             callback(null, appResponse(true, albumId));
    //         }
    //     });
    // }


    function selectAllMediaToDeleteFromAlbum( guid, albumId ) {
        
        console.log("selectAllMediaToDeleteFromAlbum - guid: " + guid + "from albumId: " +  albumId);

        connection.query({
            sql: 'SELECT media_url, type FROM `album_media` WHERE `guid` = ? AND `album_id` = ?',
            values: [guid, albumId], 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } else if (results && results.length > 0) {

                console.log('selectAllMediaToDeleteFromAlbum: Results:', JSON.stringify(results, null, 2));

                deleteAllMedia(guid, results, albumId);
            } else {
                // doesn't exist? So we're goo
                console.log('selectAllMediaToDeleteFromAlbum results.length == 0');
                updateAlbumCount(guid, null, albumId);
            }
        });
    }
    


    /**
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * 
     * 
     *                              	    DELETE MEDIA
     * 
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * 
     */


     // Call this only after confirming album_medial does not contain links to other albums
     //  image/video exists somewhere else
    // Here do callback for succes after commit
    function deleteFromS3(guid, albumId, mediaInfo) {

        var mediaObjectsToDelete = [];

        mediaInfo.forEach((result) => {

            let mediaUrl  = result[kMediaURL];
            let mediaType = result[kType];

            mediaObjectsToDelete.push({ Key : albumMediaKey(guid, mediaUrl, mediaType)  });
            mediaObjectsToDelete.push({ Key : albumCoverKey(guid, mediaUrl)  });
            mediaObjectsToDelete.push({ Key : albumCoverThumbnailKey(guid, mediaUrl)  });
        });

        // console.log('deleteAllS3Media keys:', JSON.stringify(keys, null, 2));


        var paramsDeleteMedia = {
            Bucket: ALBUM_BUCKET,
            Delete: { 
                Objects: mediaObjectsToDelete,
                Quiet: true
            }
        };


        s3.deleteObjects(paramsDeleteMedia, function(err, data) {
            if (err) {
                printError(err);     
                // rollbackAppError(errorMessageDeleteAlbum);
            } else {
                console.log(data);           // successful response
            }
        });
    }


/**
 * 
 * Table: user_album

count
newest_media_timestamp
cover_album_url



1   2   3


If we delete 1,
Then update 2 as the first

If we delete 2, then nothing

If we delete 3, then update 2 as the newest_Media



TODO: Fix cover_album, isn't the first, last, or can it change with user selection

 *  UPDATE user_album ua 
 *      INNER JOIN (
 *          SELECT  guid,  album_id,  media_url as second_url, `timestamp`
 *          FROM album_media 
 *          WHERE guid = ? AND album_id = ? 
 *          ORDER BY timestamp 
 *          LIMIT 1
 *      ) am 
 *      ON ua.guid = am.guid AND ua.id = am.album_id 
     SET ua.`first_url` = am.second_url, 
 *      ua.`newest_media_timestamp` = am.timestamp, 
 *      ua.count = ua.count-1"
 * WHERE ua.guid = ? AND ua.id = ?
 */
 
    
 

    // If we delete secornd or ler media, then no need to update.
    // Only if we delete first media, do we update second media to first
    function updateUserAlbumForFirstMediaAfterDeletingMedia(guid, albumId, mediaInfo, callbackCommitAndDeleteS3) { //} type, deletedTimestamp) {

        console.log("updateUserAlbumForFirstMediaAfterDeletingMedia");
        var firstRow = mediaInfo[0];
        var lastRow  = mediaInfo[mediaInfo.length - 1];
        
        console.log("firstRow " + firstRow);
        console.log("lastRow  " + lastRow);
      
        let mediaUrl         = lastRow[kMediaURL];
        let type             = lastRow[kType];
        let deletedTimestamp = lastRow[kTimestamp];
        
        // this checks if anymore media in album
        connection.query({
            sql: "SELECT guid, album_id, media_url as second_url, `type`, UNIX_TIMESTAMP(`timestamp`) AS timestamp FROM album_media WHERE guid = ? AND album_id = ? ORDER BY timestamp DESC LIMIT 2",
            values: [guid, albumId], 
        },
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } 

            if (results) {

                // If no items left in album
                //Delete media from s3, then delete album
                if (results.length == 0) { 
                    // 1) Delete album
                    // 2) Delete media froms3
                    
                    deleteAlbum(guid, albumId, function() {
                        callbackCommitAndDeleteS3();
                                                // commitDeleteMedia(albumId);
                    });


                    // check_if_any_other_albums_have_a_link_to_media_content( guid, albumId, mediaList, mediaInfo );
               
                // Regardless if 1 or two items are returned
                } else if ( deletedTimestamp < results[0].timestamp) {

                    // It is the first and last, update however

                    // There are at least two items
                    // If deleted timestamp is before the current first item, then it's the second and we neeed to update
            

                    let firstResult = results[0];

                    var second_url =  mediaKeyWithExtension(firstResult.second_url, firstResult.type);
                    
                    connection.query({
                        sql: "UPDATE user_album ua SET ua.`first_url` = ?, ua.first_timestamp = ?, ua.count = ua.count-1 WHERE ua.guid = ? AND ua.id = ?",
                        values: [second_url, firstResult.timestamp, guid, albumId], 
                    },
                    function (err, results, fields) {

                        if (err) {
                            printError(err);
                            rollbackAppError(ErrorMessageGeneric);
                        } else {
                            
                            // We're done, wo don't care about hte length, because we know we deleted teh first item
                            callbackCommitAndDeleteS3();
                            // commitDeleteMedia(albumId);
                        }
                    });
                } else {
                    updateUserAlbumToLastMedia(guid, albumId, function() {
                        callbackCommitAndDeleteS3();
                    });
                }
            } else {

                rollbackAppError(ErrorMessageGeneric);

            }
        });
    }
    
    function commitDeleteMedia(albumId) {
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


    /**
     * Updates the url is we deleted the last media item
     *  
     *  If not, then at least we update the media count
     * 
     * 
     * 
     *  UPDATE user_album ua 
     *      INNER JOIN (
     *          SELECT guid, album_id, media_url as newest_url, `timestamp` AS newest_ts 
     *          FROM album_media WHERE guid = ? AND album_id = ? 
     *          ORDER BY newest_ts DESC 
     *          LIMIT 1 
     *      ) am 
     *      ON ua.guid = am.guid AND ua.id = am.album_id 
     *  SET ua.`cover_album_url` = am.newest_url, ua.`newest_media_timestamp` = am.newest_ts, ua.count = ua.count-1 
     *  WHERE ua.guid = ? AND ua.id = ?",
     */

    function updateUserAlbumToLastMedia(guid, albumId, callback) {
        
        console.log("updateUserAlbumToLastMedia");
        // console.log("guid: " + guid + ", Deleteing mediaUrl: " +  mediaUrl + "from albumId: " +  albumId);

        connection.query({
            sql: "UPDATE user_album ua INNER JOIN (SELECT  guid,  album_id,  media_url as newest_url, `timestamp` AS newest_ts FROM album_media WHERE guid = ? AND album_id = ? ORDER BY newest_ts DESC LIMIT 1 ) am ON ua.guid = am.guid AND ua.id = am.album_id SET ua.`cover_album_url` = am.newest_url, ua.`newest_media_timestamp` = am.newest_ts, ua.count = ua.count-1 WHERE ua.guid = ? AND ua.id = ?",
            values: [guid, albumId, guid, albumId], 
        },
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);

            } else if (results && (result.changedRows > 0 || result.affectedRows > 0)) {

                console.log('changed ' + result.changedRows + ' rows');
                console.log('deleted ' + result.affectedRows + ' rows');

                callback();

                // check_if_any_other_albums_have_a_link_to_media_content( guid, albumId, mediaList, mediaInfo );

                /**
                 * 1) check_if_any_other_albums_have_a_link_to_media_content
                 * 2) If done, commit
                 * 3) Else delete album then
                 *      3a) Delete s3 
                 */
            

                // deleteFromS3(guid, albumId, mediaUrl, type);


                // If we were NOT able to update the album, then delete album
                // No reason to keep the album around, if no media exists
                // if (result.changedRows == 0) {
                //     // Check if count = 0 and we should delete album 
                //     //  deleteAlbum(guid, albumId);

                // } else {
                //     //Keep album around
                //     check_if_any_other_albums_have_a_link_to_media_content( guid, albumId );
                // }

            } else {
                
                rollbackAppError(ErrorMessageGeneric);
            }
        });
    }


            // checkIfMediaUrlHasLinksToOtherAlbums
    function check_if_any_other_albums_have_a_link_to_media_content( guid, mediaList, callback ) {


        connection.query({
            sql: 'SELECT media_url, type, timestamp, COUNT(*) as count FROM album_media WHERE `guid` = ? AND `media_url` in (?) GROUP BY media_url',
            // sql: 'SELECT media_url, COUNT(*) as count FROM `album_media` WHERE `guid` = ? AND `media_url` in (?)',
            values: [ guid, mediaList ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } else if (results) {


                // mediaId, 3
                // media, 0

                // Every media is still connected to antoher album
                if (results.length > 0) { // Other albums connected

                    console.log('Results:', JSON.stringify(results, null, 2));

                    // Don't delete image/video because it exists somewhere else

                    var mediaInfo = [];
            
                    
                    var mediaListToDelete = [];

                    results.forEach((result) => {
                        if (result.count === 0) {
                            var dic = {};
                            dic[kMediaURL]  = result.media_url;
                            dic[kType]      = result.type;
                            dic[kTimestamp] = result.timestamp;
                            mediaListToDelete.push(dic);

                            // mediaListToDelete.push(result.media_url);
                        }
                    });
                    
                    callback(mediaListToDelete);

                    // deleteAlbum(guid, albumId);

                } else { // No other album has connection to media, Delete it
                    callback([]);

                    // deleteAlbumAndS3(guid, albumId, mediaUrl, type);
                }
            } else {
                rollbackAppError(ErrorMessageGeneric);
            }
        });
    }
        

        //             if any other albums contains the mediaUrl:
        //                 DO NOT DELETE FROM S3
        //             ELSE: 
        //                 Delete from S3

        // If other albums have a link to S3 media, return successful callback

        // If no album links to media, then continue to delete from S3  -> deleteFromS3();
    
    
    /**
     * 
     * @param {String} guid 
     * @param {String} albumId 
     * @param {String} mediaUrl 
     * @param {String} type 
     */

    function deleteAlbumAndS3(guid, albumId, mediaUrl, type) {
    
        console.log("deleteAlbum");
        console.log("guid: " + guid + ", Deleteing albumId: " +  albumId);

        connection.query({
            sql: 'DELETE FROM `user_album` WHERE `guid` = ? AND `id` = ?',
            values: [guid, albumId], 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } else if (results && results.affectedRows > 0) {

                console.log("Results: " + results);       

                deleteFromS3(guid, albumId, mediaUrl, type);
            } else {
                rollbackAppError(ErrorMessageGeneric);
            }
        });
    }





    // TODO: Go back to updatetitle() and test that it works

    // Then fix table `mentions`

    // guid_mentioned, mentioned_by (guid), album_owner, album_id, mention_type, comment_id(optional)

    // sql: 'INSERT INTO `mentions` ( guid_mentioned, mentioned_by , mentioned_in, mention_type) VALUES ?',


    //TODO: Delete all mentions of users in title. Leave comments alone.
    //  If album is deleted and somehow user can access it and has comment, show message "Album deleted"
    function deleteAlbum(guid, albumId, callback) {
    
        console.log("deleteAlbum");
        console.log("guid: " + guid + ", Deleteing albumId: " +  albumId);

        deleteMentionedUsersInAlbum(guid, albumId, function(success) {
            if (success) {
                connection.query({
                    sql: 'DELETE FROM `user_album` WHERE `guid` = ? AND `id` = ?',
                    values: [guid, albumId], 
                }, 
                function (err, results, fields) {

                    if (err) {
                        printError(err);
                        rollbackAppError(ErrorMessageGeneric);
                    } else {
                        callback();
                        // commitDeleteMedia(albumId);
                    }
                });
            } else {
                rollbackAppError(ErrorMessageGeneric);
            }
        });  
    }



    // Delete all mentinoed users in album title, without having to search their usernames or guids.
    function deleteMentionedUsersInAlbum(albumOwnerGuid, albumId, callbackSuccess ) {
        console.log("deleteMentionedUsersInAlbum");

        // if (userGuids.length === 0) {
        //     callbackSuccess(true);
        //     return;
        // }
        
        connection.query({
            sql: "DELETE FROM `mentions` WHERE album_owner = ? AND album_id = ? AND mention_type = ?",
            values: [ albumOwnerGuid, albumId, MentionType.AlbumTitle]
        }, function (error, results) {
            if (error) {
                printError(error);
                callbackSuccess(false);
            } else {
                // if (results > 0) {
                console.log('Results: Changed ' + results.changedRows + " rows");
                callbackSuccess(true);
            }
        });        
     }



    /**
     * Deletes a media item for given albumId, but other albums will still have access to it.
     * 
     * @param {*} guid 
     * @param {*} albumId 
     * @param {*} mediaUrl 
     * @param {*} type 
     */
    function deleteAlbumMedia(guid, albumId, mediaList, callbackSucess) {    
        console.log("DeleteAlbumMedia - guid: " + guid + ", Deleteing mediaUrl: " +  mediaList + "from albumId: " +  albumId);

        connection.query({
            sql: 'DELETE FROM `album_media` WHERE `guid` = ? AND `album_id` = ? AND `media_url` in (?)',
            values: [guid, albumId, mediaList], 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(ErrorMessageGeneric);
            } else if (results && results.affectedRows > 0) {

                console.log("Results: " + results);
                callbackSucess(true);

            } else {
                // doesn't exist? So we're good
                // commitAlbumTransaction(albumId);
                rollbackAppError(ErrorMessageGeneric);
            }
        });
    }



    // Get type, timestamp for each media that will be deleted
    function getMediaInfo(guid, albumId, mediaList, callback) {
        
        connection.query({
            sql: 'SELECT media_url, type, timestamp FROM `album_media` WHERE `guid` = ? AND `album_id` = ? AND `media_url` in (?)',
            values: [guid, albumId, mediaList], 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
            } else if (results && results.length > 0) {

                var mediaInfo = [];
                
                results.forEach((result) => {
                    console.log("timestamp: " + result.timestamp);

                    var dic = {};
                    dic[kMediaURL]  = result.media_url;
                    dic[kType]      = result.type;
                    dic[kTimestamp] = result.timestamp;
                    mediaInfo.push(dic);

                    // mediaInfo.push({
                    //     mediaUrl : result.media_url,
                    //     type     : result.type,
                    //     timestamp: result.timestamp
                    // });
                    // mediaInfo.push([result.media_url, result.type, result.timestamp]);
                });

                callback(mediaInfo);
                
            } else {
                // finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                var response = {};
                response[kActive]  = ActiveValues.Active;
                response[kAlbumId] = albumId;
                finalAppResponse( response);
            }
        });

    }

    /**
     * 
     *  Deleting media_url is a bit complicated because we may have one media item in multiple albums 
     * @param {*} guid 
     * @param {*} albumId 
     * @param {*} mediaUrl Is just the mediaId without .jpg
     */

    function startDeleteMediaTransaction(guid, albumId, mediaList) {
        
        console.log("startDeleteMediaTransaction");

        beginTransaction( function () {

            getMediaInfo(guid, albumId, mediaList, function(mediaInfo) {

                deleteAlbumMedia(guid, albumId, mediaList, function(sucess) {
 
                    check_if_any_other_albums_have_a_link_to_media_content( guid, mediaList, function(s3LinksToDelete) {

                        updateUserAlbumForFirstMediaAfterDeletingMedia(guid, albumId, mediaInfo, function() {
                            // Commit all work
                            // commitDeleteMedia(albumId);
 
                            commitTransaction(function() {
                                deleteFromS3(guid, albumId, s3LinksToDelete);
                                finalAppResponse( albumIdResponse(albumId));
                            });
                        });
                    });
                    // if (sucess) {}
                });
            });
        }) 


        // connection.query({
        //     sql: 'SELECT type, timestamp FROM `album_media` WHERE `guid` = ? AND `album_id` = ? AND `media_url` = ?',
        //     values: [guid, albumId, mediaUrl], 
        // }, 
        // function (err, results, fields) {

        //     if (err) {
        //         printError(err);
        //         finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
        //     } else if (results && results.length > 0) {

        //         let type      = results[0].type;
        //         let timestamp = results[0].timestamp;

        //         connection.beginTransaction(function(err) {
        //             if (err) { 
        //                 printError(error);
        //                 rollbackAppError(ErrorMessageGeneric);
        //             } else { 
        //                 deleteAlbumMedia(guid, albumId, mediaUrl, type, timestamp);
        //             }
        //         });
        //     } else {
        //         // finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
        //         var response = {};
        //         response[kActive]  = ActiveValues.Active;
        //         response[kAlbumId] = albumId;
        //         finalAppResponse( response);
        //     }
        // });
    }





    /**
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * 
     * 
     *                                  UPDATE  ALBUM
     * 
     *                                   title or ACL
     * 
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * 
     */



     
     function getAllMentionedUsersInAlbumTitle(guid, albumId, callback ) {
         console.log("getAllMentionedUsersInAlbumTitle");

        connection.query({
            sql: 'SELECT guid_mentioned FROM `mentions` WHERE album_owner = ? AND album_id = ? AND mention_type = ?',
            values: [guid, albumId, MentionType.AlbumTitle ] , 
        }, 
        function (err, results) {

            console.log("results: " + JSON.stringify(results));

            if (err) {

                callback(null);
                
            } else {
                
                var allUsers = [];
                
                results.forEach((result) => {
                    followersGuids.push(result.guid_mentioned);
                });
              
                callback();
            }
        });
     }


     function getAlbumTitle(guid, albumId, callback) {
        console.log("getAlbumTitle guid: " + guid);
        console.log("getAlbumTitle albumId: " + albumId);

        connection.query({
            sql: "SELECT title FROM `user_album` WHERE `guid` = ? AND `id` = ?",
            values: [ guid, albumId], 
        }, 
        function (error, results, fields) {

            console.log("results: " + JSON.stringify(results));

            if (error) {
                printError(error);
                callback(null);
            } else {

                if (results && results.length > 0) {
                    callback(results[0].title);
                } else {
                    callback(null);
                }
            }
        });
     }
     
     

     function deleteOldMentionedUsers(userGuids, albumOwnerGuid, albumId, callbackSuccess ) {
        console.log("deleteOldMentionedUsers: "  + userGuids);

        if (userGuids.length === 0) {
            callbackSuccess(true);
            return;
        }
        
        connection.query({
            sql: "DELETE FROM `mentions` WHERE guid_mentioned IN (?) AND album_owner = ? AND album_id = ? AND mention_type = ?",
            values: [ userGuids, albumOwnerGuid, albumId, MentionType.AlbumTitle ]
        }, function (error, results) {
            if (error) {
                printError(error);

                callbackSuccess(false);
            } else {
                // if (results > 0) {
                console.log('Results: Changed ' + results.changedRows + "rows");
                callbackSuccess(true);
            }
        });        
    }


    function insertNewMentionedUsers(userGuids, mentionedBy, albumOwnerGuid, albumId, callbackSuccess ) {
        console.log("insertNewMentionedUsers: " + userGuids);

        if (userGuids.length === 0) {
            console.log("insertNewMentionedUsers: empty" );

            callbackSuccess(true);
            return;
        }
        
        var mentionRows = [];
        userGuids.forEach((mentionedUser) => {
            mentionRows.push([ mentionedUser, mentionedBy, albumOwnerGuid, albumId, MentionType.AlbumTitle]);
        }); 

        connection.query({
            sql: 'INSERT INTO `mentions` (guid_mentioned, mentioned_by, album_owner, album_id, mention_type) VALUES ?',
            values: [mentionRows] , 
        }, 
        function (err, results) {
            console.log(" insertNewMentionedUsers results: " + JSON.stringify(results));

            if (err) {
                printError(err);
                callbackSuccess(false);

            } else {
                
                callbackSuccess(true);
            }
        }); 
    }


    function insertNewHashtags(userGuids, mentionedBy, albumOwnerGuid, albumId, callbackSuccess ) {
        console.log("insertNewHashtags: " + userGuids);

        if (userGuids.length === 0) {
            console.log("insertNewHashtags: empty" );

            callbackSuccess(true);
            return;
        }
        
        var mentionRows = [];
        userGuids.forEach((mentionedUser) => {
            mentionRows.push([ mentionedUser, mentionedBy, albumOwnerGuid, albumId, MentionType.AlbumTitle]);
        }); 

        connection.query({
            sql: 'INSERT INTO `mentions` (guid_mentioned, mentioned_by, album_owner, album_id, mention_type) VALUES ?',
            values: [mentionRows] , 
        }, 
        function (err, results) {
            console.log(" insertNewMentionedUsers results: " + JSON.stringify(results));

            if (err) {
                printError(err);
                callbackSuccess(false);

            } else {
                
                callbackSuccess(true);
            }
        }); 
    }

    function getGuidsOfUsernames(usernames, callback) {

        console.log("getGuidsOfUsernames: " + usernames);

        if (usernames.length === 0 ){
            callback([]);
            return;
        }

        // Get all people mentioned in album title
        connection.query({  
            sql: "SELECT guid, username FROM profile WHERE username IN (?)",
            values: [ usernames ]
        }, function (err, results) {
            console.log("results: " + JSON.stringify(results));

            if (err) {
                printError(err);
                callback(null);
            } else {

                var guids = [];
                results.forEach((result) => {
                    guids.push({guid: result.guid,
                                username: result.username});
                });

                callback(guids);
            }
        });
    }




    //TODO: Delete notifications that were sent to previous users? ANd Insert new notifications?




     // Get title: to get all mentioned users
     // get all mentioned users? 
    function updateTitle(albumOwnerGuid, albumId, newTitle) {
        
        console.log("updateTitle");

        getAlbumTitle(albumOwnerGuid, albumId, function (oldTitle) {

            if (oldTitle === null) {
                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));

            } else {
                

                let oldMetionedUsers = getAllMentionedUsers(oldTitle);
                let newMetionedUsers = getAllMentionedUsers(newTitle);

                // Filter usernames that will be deleted
                var mentionDeletes = oldMetionedUsers.filter(function(word){
                    if (!newMetionedUsers.contains(word)) {
                        return true;
                    }
                });

                // Filter usernames that will be inserted
                var mentionInserts = newMetionedUsers.filter(function(word){
                    if (!oldMetionedUsers.contains(word)) {
                        return true;
                    }
                });

                console.log("mentionInserts: " + mentionInserts);
                console.log("mentionDeletes: " + mentionDeletes);

                // 1) Get guids of all usernames from mentionInserts and  mentionDeletes
                
                let allUsernames = mentionInserts.concat(mentionDeletes);
                console.log("allUsernames: " + allUsernames);


                // returns arrays of username and 
                getGuidsOfUsernames(allUsernames, function (results) {

                    if (results === null) {
                        finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                        return;
                    }

                    console.log("all results: " + results);


                    var deleteGuids = [];
                    results.forEach((result) => {
                        if (mentionDeletes.contains(result.username)) {
                            deleteGuids.push(result.guid);
                        }
                    });
                    console.log("deleteGuids: " + deleteGuids);
                    
                    var insertGuids = [];
                    results.forEach((result) => {

                        if (mentionInserts.contains(result.username)) {
                            insertGuids.push(result.guid);
                        }
                    });

                    console.log("insertGuids: " + insertGuids);

                    beginTransaction( function () {

                    deleteOldMentionedUsers(deleteGuids, albumOwnerGuid, albumId, function (success) {

                        if (!success) {
                            finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            return;
                        }

                        insertNewMentionedUsers(insertGuids, albumOwnerGuid, albumOwnerGuid, albumId, function (success) {
                            

                            if (!success) {
                                console.log("insertNewMentionedUsers not success");

                                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                                return;
                            } else {
                                console.log("insertNewMentionedUsers success");
                            }

                            connection.query({
                                sql: "UPDATE `user_album` SET `title` = ? WHERE `guid` = ? AND `id` = ?",
                                values: [ newTitle , albumOwnerGuid, albumId], 
                            }, 
                            function (error, results, fields) {
                                console.log("results: " + JSON.stringify(results));

                                if (error) {
                                    
                                    printError(error);
                                    rollbackAppError(ErrorMessageGeneric);

                                    // finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                                } else {

                                    commitTransaction( function(success) {

                                        if (success) {
                                            console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                                            finalAppResponse( createAlbumResponse( albumId ));
                                        } else {
                                            rollbackAppError(ErrorMessageGeneric);
                                        }
                                        
                                    });
                                }

                                // if (results) {

                                //     commitTransaction( function(success) {

                                        
                                //     });

                                //     console.log('==== Printing out Results for ' + results.length +  ' rows ====');

                                //     finalAppResponse( createAlbumResponse( albumId ));
                                // }
                            });
                        });
                    });
                    });
                });
            }
        });
    }


    function confirmFollowings(guid, friendsToAdd, friendsToDelete, updateFollowersAddingAndDeleting) {

        console.log("confirmFollowings");

        var queryFriendsSql = 'SELECT `guid1` as guid FROM `friends` WHERE `guid2` = ? AND `guid1` in (?) AND `status` = ?';

        connection.query({
            sql: queryFriendsSql,
            values: [ guid, friendsToAdd, Relationship.IsFollowing ], 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(updateFollowersErrorMessage);
            } else {

                var followersGuids = [];

                if (results && results.length > 0) {

                    results.forEach((result) => {
                        followersGuids.push(result.guid);
                    });

                    if ( updateFollowersAddingAndDeleting ) { // Delete first

                        connection.beginTransaction(function(err) {
                            if (err) { 
                                printError(err);
                                rollbackAppError(updateFollowersErrorMessage);
                            } else { 
                                updateDeleteFriendsFromPrivateAlbum(guid, friendsToDelete, followersGuids, updateFollowersAddingAndDeleting);
                            }
                        });
                    } else {
                        
                        updateAddFriendsToPrivateAlbum(guid, followersGuids, updateFollowersAddingAndDeleting);
                    }

                // No friends to add, move on to delteing them
                } else {
                    updateAddFriendsToPrivateAlbum(guid, followersGuids, false);
                }
            }
        });
    }



    
    function updateAddFriendsToPrivateAlbum(guid, followersGuids, updateFollowersAddingAndDeleting) {

        var aclList = [];

        followersGuids.forEach((followerGuid) => {
            aclList.push([ followerGuid, guid, albumId ]);
        });

        var query = connection.query({
            sql: 'INSERT INTO `album_permissions` (guid, fguid, album_id) VALUES ?',
            values: [aclList] , 
        }, 
        function (err, results, fields) {

            if (err) {
                printError(err);
                rollbackAppError(updateFollowersErrorMessage);
            } else {

                if (updateFollowersAddingAndDeleting) {
                    // Commit queries
                    
                    connection.commit(function(err) {
                        if (err) {
                            printError(err);
                            rollbackAppError(updateFollowersErrorMessage);
                        } else  {
                            console.log('successful commit!');

                            finalAppResponse( createAlbumResponse( albumId));
                        }
                    });
                } else {
                    finalAppResponse( createAlbumResponse( albumId));                    
                }
            }
        });
    }


    function updateDeleteFriendsFromPrivateAlbum(guid, followersToDelete, followersGuids, updateFollowersAddingAndDeleting) {           

        connection.query({
            sql: "DELETE FROM `album_permissions` WHERE guid IN (?) AND fguid = ? AND album_id = ?",
            values: [ followersToDelete, guid, albumId ]
        }, function (error, results) {
            if (error) {
                printError(error);
                rollbackAppError(updateFollowersErrorMessage);
            } else {
                // if (results > 0) {
                console.log('Results: Changed ' + results.changedRows + "rows");

                if (updateFollowersAddingAndDeleting) {
                    updateAddFriendsToPrivateAlbum(guid, followersGuids, updateFollowersAddingAndDeleting);
                } else {
                    finalAppResponse( createAlbumResponse( albumId));                    
                }
            }
        });        
    }




    let updateFollowersErrorMessage = APP_NAME + " cannot update followers at this time. Try again soon";

    function updateACL(guid, followersToAdd, followersToDelete) {
        console.log("UpdateAction.Friends");

        if (followersToDelete !== null && followersToAdd !== null) {
            
            confirmFollowings(guid, followersToAdd, followersToDelete, true );
             
        } else if (followersToDelete !== null ) {

            updateDeleteFriendsFromPrivateAlbum(guid, followersToDelete, null, false);

        } else {
            confirmFollowings(guid, followersToAdd, null, false );
        }
    }


    let ChangePrivacyErrorMessage = APP_NAME + " cannot make album private at this time. Try again soon"
    
    function changeAlbumToPrivateWithACL(guid, albumId, followersAddList ) {
        
        connection.query({
            sql: 'SELECT `guid1` as guid FROM `friends` WHERE `guid2` = ? AND `guid1` in (?) AND `status` = ?',
            values: [ guid, followersAddList, Relationship.IsFollowing ], 
        }, 
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse(ActiveValues.Active, ChangePrivacyErrorMessage ));
            } else {

                if (results && results.length > 0) {
                    
                    var aclList = [];

                    results.forEach((result) => {
                        aclList.push([ result.guid, guid, albumId ]);
                    });


                    connection.beginTransaction(function(err) {
                        if (err) { 
                            printError(error);
                            rollbackAppError(ChangePrivacyErrorMessage);
                        } else { 
                            connection.query({
                                sql: 'INSERT INTO `album_permissions` (guid, fguid, album_id) VALUES ?',
                                values: [aclList] , 
                            }, 
                            function (err, results, fields) {

                                if (err) {
                                    printError(err);
                                    rollbackAppError(ChangePrivacyErrorMessage);
                                } else {
                                    connection.query({
                                        sql: 'UPDATE user_album SET `is_private` = 1 WHERE `guid` = ? AND `id` = ?',
                                        values: [guid, albumId]
                                    }, 
                                    function (err, results, fields) {

                                        if (err) {
                                            printError(err);
                                            rollbackAppError(ChangePrivacyErrorMessage);
                                        } else {
                                            commitAlbumTransaction(albumId);
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                }
            }
        });    
    }

    

    function changeAlbumToPublic(guid, albumId ) {

        connection.beginTransaction(function(err) {
            if (err) { 
                printError(error);
                rollbackAppError(ErrorMessageGeneric);
            } else { 
                connection.query({
                    sql: "DELETE FROM `album_permissions` WHERE fguid = ? AND album_id = ?",
                    values: [ guid, albumId ]
                }, function (err, results) {
                    if (err) {
                        printError(err);
                        finalAppResponse( updateViewResponse(false));
                    } else {
                        connection.query({
                            sql: 'UPDATE user_album SET `is_private` = 0 WHERE `guid` = ? AND `id` = ?',
                            values: [guid, albumId]
                        },
                        function (err, results, fields) {

                            if (err) {
                                printError(err);
                                rollbackAppError(ErrorMessageGeneric);
                            } else {
                                commitAlbumTransaction(albumId);
                            }
                        });
                    }
                });
            }
        });
    }

    // function updateAlbum(guid) {

    //     console.log("updateAlbum");

    //     if (action === UpdateAction.Title) {
    //         console.log("UpdateAction.Title");
    //         updateTitle(guid);
    //     } else if (action === UpdateAction.Friends) {
    //         console.log("UpdateAction.Friends");

    //         if (friendsToDelete.length > 0 && friendsToAdd.length > 0) {
                
    //             usingTransaction = true;
    //             confirmFollowings(guid);
                
    //         } else if (friendsToDelete.length > 0 ) {
            
    //             updateDeleteFriendsFromPrivateAlbum(guid);
            
    //         } else if (friendsToAdd.length > 0) {
            
    //             confirmFollowings(guid);
            
    //         } else {
    //             console.log("UpdateAction.nothing to change");
    //             finalAppResponse( createAlbumResponse( albumId));                    
    //         }
    //     } else {
    //         finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
    //     }
    // }








    /**
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * 
     * 
     *                                  UPDATE  ALBUM
     *              Add new media content
     * 
     * 
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * 
     */




    /**
     * 
     *  Used per user, so that each photo or video will have a unique url. 
     *  2 users can have the same URL, but no 2 albums of the same user can have the same URL.
     *  This will prevent that.
     *
     *  This will never happen
     * AlbumId: 1, mediaURL 39fn0sn3
     * AlbumId: 2, mediaURL 39fn0sn3
     * 
     *  
     * */
    
    /**
     * 
            After user creates album, whenever user uploads new content, 
            1) get if album is public or private
            2) If public, get all followers. If private, get selected users
            3) INSERT INTO timeline SET guid = ?, fguid = ?, album_id = ? ON DUPLICATE KEY UPDATE date=VALUES(date)';           

     */


    function beginMediaUpload(guid) {

        beginTransaction(function() {

            getUniqueRandomMediaUrl(guid, function(newMediaUrl) {

                if (newMediaUrl === null) {
                    rollbackAppError(uploadErrorMessage());
                } else {
                    insertMediaIntoS3(guid, newMediaUrl);
                }
            });
        });
    }


    function getUniqueRandomMediaUrl(guid, callback) {

        console.log("start getUniqueRandomMediaUrl");

        var newMediaUrl = generateRandomURL();

        console.log("guid: " + guid + ", newMediaUrl: " +  newMediaUrl);

        connection.query({
            sql: 'INSERT INTO `media_unique_url` SET guid = ?, url = ?',
            values: [ guid, newMediaUrl ]
        }, function (err, results) {
            if (err) {
                printError(err)
                if (err.code == "ER_DUP_ENTRY" && maxDuplicateRetires > 0 ) {
                    
                    maxDuplicateRetires -= 1;
                    console.log("Media url already exists. That's why I'm here to catch it!");
                    getUniqueRandomMediaUrl(guid, callback);
                 
                } else {
                    callback(null);
                } 
            } else {
                callback(newMediaUrl);
            }
        });
    }



        // 1) We upload data from phone to temp s3 file location
        // 2) We Get it here, check it for ValidityState
        // 3) Then move it to permanant location




    function insertNewCoverAlbum(guid, albumId, mediaUrl, mediaContentType, timelimit) {

        printTimeForEvent("insertNewCoverAlbum");


        // var thumbnailData = [kThumbnail]
        let thumbnailData = requestBody[kThumbnail];
        printTimeForEvent("insertNewCoverAlbum: thumbnailData length: " + thumbnailData.length);

        var thumbnailImage = new Buffer(thumbnailData, 'base64');
  
        let coverlData = requestBody[kAlbumCover];
        printTimeForEvent("insertNewCoverAlbum: coverlData length: " + coverlData.length);

        var coverImage = new Buffer(coverlData, 'base64');


        if (thumbnailImage === undefined || thumbnailImage === null || coverImage === undefined || coverImage === null) {
            rollbackAppError(uploadErrorMessage());
            return;
        }

        var mediaSize = bytesToMb(thumbnailImage.length);
        
        console.log("insertNewCoverAlbum imageSize: " +  mediaSize  + "MB");

        if ( mediaContentType == MediaType.Photo && !isImageBelowSizeThreshold(mediaSize) ) {
            console.log("Error: Image is too large. Size:" + mediaSize + "Mb");
            rollbackAppError("Photo seems to be too large to upload");
            return;
        } else {
            console.log("insertNewCoverAlbum: will try to upload" );
        }


        s3.putObject({
            Bucket          : ALBUM_BUCKET,
            Key             : albumCoverThumbnailKey(guid, mediaUrl),
            Body            : thumbnailImage,
            ContentEncoding : 'base64',
            ContentType     : 'image/jpeg'
        }, function(err, data) {
            
            if (err) {
                printError(err);
                rollbackAppError(uploadErrorMessage());
            } else {

                s3.putObject({
                    Bucket          : ALBUM_BUCKET,
                    Key             : albumCoverKey(guid, mediaUrl),
                    Body            : coverImage,
                    ContentEncoding : 'base64',
                    ContentType     : 'image/jpeg'
                }, function(err, data) {
                    
                    if (err) {
                        printError(err);
                        rollbackAppError(uploadErrorMessage());
                    } else {
                        console.log("insertNewCoverAlbum: Successfully Put users photo");
                        console.log("insertNewCoverAlbum: data: " + JSON.stringify(data, null, 2));   
                        

                        // Deletes the temporary files after we commit.
                        var paramsDeleteTmp = {
                            Bucket: PRIVATE_TEMP_BUCKET,
                            Delete: { 
                                Objects: [
                                    { Key: tmpS3Key }
                                ],
                                Quiet: true
                            }
                        };
                        
                        insertDataIntoMediaContentTable(guid, albumIds, mediaUrl, mediaContentType, timelimit, paramsDeleteTmp );
                    }
                });
            }
        });







        // s3.getObject({
        //     Bucket: PRIVATE_TEMP_BUCKET, 
        //     Key: tmpS3CoverKey
        // }, function(err, data) {


        //     printTimeForEvent("insertNewCoverAlbum done");

        //     if (err) {
        //         printError(err);

        //         finalAppResponse( activeResponse( ActiveValues.Active, "Cannot not upload media"));

        //     } else {
        //         console.log(data);           // successful response
          
        //         var dataBody = data.Body;  // already base64  encoded

        //         var mediaSize = bytesToMb(dataBody.length);
                
        //         console.log("insertNewCoverAlbum imageSize: " +  mediaSize );

        //         if ( mediaContentType == MediaType.Photo && !isImageBelowSizeThreshold(mediaSize) ) {
        //             console.log("Error: Image is too large. Size:" + mediaSize + "Mb");
        //             rollbackAppError("Photo seems to be too large to upload");
        //             return;
        //         } else {
        //             console.log("insertNewCoverAlbum: will try to upload" );
        //         }


        //         var paramsUpload = {
        //             Bucket  : ALBUM_BUCKET,
        //             Key     : albumCoverKey(guid, mediaUrl),
        //             Body    : dataBody,
        //             ContentEncoding : 'base64',
        //             ContentType     : 'image/jpeg'
        //         }; 

        //         s3.putObject(paramsUpload, function(err, data) {
                    
        //             if (err) {
        //                 printError(err);
        //                 rollbackAppError(uploadErrorMessage());
        //             } else {
        //                 console.log("insertNewCoverAlbum: Successfully Put users photo");
        //                 console.log("insertNewCoverAlbum: data: " + JSON.stringify(data, null, 2));   
                        
        //                 insertDataIntoMediaContentTable(guid, mediaUrl);



        //                 // Deletes the temporary files.
        //                 var paramsDeleteTmp = {
        //                     Bucket: PRIVATE_TEMP_BUCKET,
        //                     Delete: { 
        //                         Objects: [
        //                             // { Key: tmpS3CoverKey },
        //                             { Key: tmpS3Key }
        //                         ],
        //                         Quiet: true
        //                     }
        //                 };
                        
        //                 s3.deleteObjects(paramsDeleteTmp, function(err, data) {
        //                     if (err) {
        //                         printError(err);
        //                     } else {
        //                         console.log(data);           // successful response
        //                     }
        //                 });
        //             }
        //         });
        //     }
        // });
    }

    // yes 

    function insertMediaIntoS3(guid, mediaUrl) {

        printTimeForEvent("insertMediaIntoS3 getObject");

        // Get data from temp s3 bucket

        s3.getObject({
            Bucket: PRIVATE_TEMP_BUCKET, 
            Key: tmpS3Key 
        }, function(err, data) {
                   
             printTimeForEvent("insertMediaIntoS3 getObject complete");

            if (err) {
                printError(err);
                // finalAppResponse(responseCode, createAlbumResponse(true, albumId));

                finalAppResponse( activeResponse( ActiveValues.Active, APP_NAME + " cannot upload media at this time. Try again soon."));
            } else {
                printTimeForEvent("insertMediaIntoS3 getObject okay");
                // console.log(data);           // successful response

                // Validate media content

                // console.log("mediaUrl: " + mediaUrl);
                // if ( !validator.isBase64(media) ) { 
                //     console.log("!validator.isBase64(media)");
                //     // rollbackAppError("Media content corrupted. Try resending the " + mediaContentType + ".");
                //     // return;
                // } else {

                //     console.log("validator.isBase64(media) - true");
                // }

                var dataBody = data.Body;  // already base64  encoded


                gm(dataBody).format(function(err, value){
                // note : value may be undefined
                    console.log("1 What is this value:" + value );

                    var imageBuffer = new Buffer(dataBody, 'base64'); // Buffer.from(originalImage, 'base64');  


                    gm(imageBuffer).format(function(err, value){
                    // note : value may be undefined
                        console.log("2 What is this value:" + value );


                        var mediaSize = bytesToMb(dataBody.length);
                        
                        console.log("insertMediaIntoS3: imageSize: " +  mediaSize );

                        if ( mediaContentType == MediaType.Photo && !isImageBelowSizeThreshold(mediaSize) ) {
                            console.log("insertMediaIntoS3 Error: Image is too large. Size:" + mediaSize + "Mb");
                            rollbackAppError("Photo seems to be too large to upload");
                            return;
                        }

                        if ( mediaContentType == MediaType.Video && !isVideoBelowSizeThreshold(mediaSize) ) {
                            console.log("Error: Video is too large. Size:" + mediaSize + "Mb");
                            rollbackAppError("Video seems to be too large to upload");
                            return;
                        } else {
                            printTimeForEvent("insertMediaIntoS3: will try to upload");
                        }

                        s3.putObject({ 
                            Bucket          : ALBUM_BUCKET,
                            Key             : albumMediaKey(guid, mediaUrl, mediaContentType),
                            Body            : dataBody,
                            ContentEncoding : 'base64',
                            ContentType     : contentType(mediaContentType)
                        }, function(err, data) {
                            printTimeForEvent("insertMediaIntoS3: putObject complete");

                            if (err) {
                                printError(err);
                                rollbackAppError(uploadErrorMessage());
                            } else {
                                console.log("insertMediaIntoS3: Successfully Put users photo");
                                console.log("insertMediaIntoS3 data: " + JSON.stringify(data, null, 2));   

                                insertNewCoverAlbum(guid, albumId, mediaUrl, mediaContentType, timelimit);

                            }
                        });
                    });
                });
            }
        });
    }






    function printTimeForEvent(event) {
        console.log("Event: " + event + ", Time left: " + context.getRemainingTimeInMillis());
    }



    function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    function toSeconds(milliseconds) {
        return  Math.round(milliseconds / 1000.0);
    }

    function inHours(seconds) {

        let minutes = seconds / 60
        let hours = minutes / 60
        return hours
    }
        

    /**
     * This function inserts media data into the database for each album 
     * the user uploads to. 
     * 
     * @param {*} guid 
     * @param {*} mediaUrl 
     * @param {*} tmpDeleteParam 
     */

    function insertDataIntoMediaContentTable(guid, albumIds, mediaUrl, mediaContentType, timelimit, tmpDeleteParam ) {

        console.log("insertDataIntoMediaContentTable guid: " + guid);
        console.log("insertDataIntoMediaContentTable mediaUrl: " + mediaUrl);


        // Sign the url and store it in server
        // 24 hours + 2 minute
        // var params = {  Bucket  : ALBUM_BUCKET, 
        //                 Key     : albumMediaKey(guid, mediaUrl, mediaContentType), 
        //                 Expires : S3_EXPIRE_LIMIT };
        // var signedUrl = s3.getSignedUrl('getObject', params);

        // console.log('The URL expires in ' + S3_EXPIRE_LIMIT + " seconds");

        // var date = new Date();  // Return string formatted date
        // console.log('This date is: ' + date);

        // var time = date.getTime(); // Return milliseconds
        // console.log('This date in time: ' + time);

        // var nowDate = Date.now(); // Return milliseconds
        // console.log('This current date in millisconds: ' + nowDate);

        // var seconds = toSeconds(nowDate);
        // console.log('This Seconds is: ' + seconds);

        // var expirationDateInSeconds = seconds + S3_EXPIRE_LIMIT;
        // console.log('Seconds to add to new expiration: ' + expirationDateInSeconds);


        // let newExpireMilliseconds = expirationDateInSeconds * 1000;
        // console.log('New Epiration date in milliseconds: ' + newExpireMilliseconds);

        // var newDate = new Date(newExpireMilliseconds);
        // console.log('New Epiration date: ' + newDate);


        // var mediaRows = [];
        
        // for (var index = 0; index < albumList.length; index++) { 
        //     let albumDict   = albumList[index];
        //     let albumId     = albumDict[kAlbumId];
        //     // let isNew       = albumDict[kIsNew];

        //     mediaRows.push([ guid, albumId, mediaUrl, mediaContentType, timelimit ]);  
        // }



        var mediaRows = [];
        
        print(albumIds);

        for (var index = 0; index < albumIds.length; index++) {         
            let albumId = albumIds[index];
            print("albumId: " + albumId);

            mediaRows.push([ guid, albumId, mediaUrl, mediaContentType, timelimit ]);  
        }

        print(mediaRows);

        connection.query({
            sql: 'INSERT INTO `album_media` (guid, album_id, media_url, type, timelimit ) VALUES ?',
            values: [ mediaRows ]
        }, function (err, results) {
            if (err) {

                printError(err);
                rollbackAppError(uploadErrorMessage());

            } else {

                console.log("insertDataIntoMediaContentTable continue ");

                connection.query({
                    sql: 'SELECT timestamp, UNIX_TIMESTAMP(`timestamp`) AS unix_timestamp FROM album_media WHERE guid = ? AND media_url = ? ORDER BY timestamp DESC LIMIT 1 ',
                    values: [ guid, mediaUrl ] 
                }, function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackAppError(uploadErrorMessage());
                    } else {
                        if (results && results.length > 0) {
                            let ts = results[0].timestamp;
                            let response_ts = results[0].unix_timestamp;

                            updateMyAlbumTable(guid, albumIds, mediaUrl, ts, response_ts, mediaContentType, tmpDeleteParam);
                        } else {
                            rollbackAppError(uploadErrorMessage());
                        }               
                    }
                });
            }
        });
    }




    
    

    /**
    * 
        After user creates album, whenever user uploads new content, 
        1) get if album is public or private
        2) If public, get all followers. If private, get selected users
        3) INSERT INTO timeline SET guid = ?, fguid = ?, album_id = ? ON DUPLICATE KEY UPDATE date=VALUES(date)';



        SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
        FROM `user_album` AS ua 
            INNER JOIN `friends` 
            ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
                LEFT JOIN album_permissions AS ap 
                ON (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
                    INNER JOIN `profile` 
                    ON ua.guid = profile.guid
                        LEFT JOIN album_last_viewed_media AS alvm 
                        ON alvm.guid = friends.guid1 AND alvm.fguid = ua.guid AND alvm.album_id = ua.id 
        WHERE (ua.`is_private` = ? OR ap.guid IS NOT NULL) AND (ua.expire_date IS NULL OR ua.expire_date > NOW())                                    ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?"; //ORDER BY ua.newest_media_timestamp AND (ua.newest_media_timestamp > alvm.last_viewed_timestamp OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC LIMIT ?";


     */


    /**
     *  Inserts the (albumOwner, albumId) into the table "cron_timeline". In another background lambda
     *  
     *  function, all followers will be updated of the newest media insert.
     * 
     * In getGuidsOfUsernames
     * 
     * 
     */


     // 
     // ============== Utility Functions =====
     // 

    function commitMediaInsert(mediaKey, signedUrl, response_timestamp, paramsDeleteTmp) {

        console.log("commitMediaInsert");

        connection.commit( function(err) {
            if (err) {
                rollbackErrorResponseWithMessage(err, uploadErrorMessage());                                            

            } else  {

                console.log('successful commit!: obj'); 

                s3.deleteObjects(paramsDeleteTmp, function(err, data) {
                    if (err) {
                        printError(err);
                    } else {
                        console.log(data);           // successful response
                    }
                });

                finalAppResponse( uploadMediaResponse( mediaKey, signedUrl, response_timestamp ) );
                // finalAppResponse( uploadMediaResponse( mediaKeyWithExtension( mediaKey, mediaContentType), signedUrl, reponse_timestamp.toString() ) );
            }
        });
    }

    function insertMedtionGuids() {

        // Get all people mentioned in album title, and notify them they were mentioned
        connection.query({  
            sql: "SELECT guid_mentioned AS guid FROM user_album AS ua INNER JOIN mentions AS m ON ua.guid = m.album_owner AND ua.`id` = m.album_id AND mention_type = ? WHERE ua.guid = ? AND ua.id IN (?) AND ua.count = 1",
            values: [ MentionType.AlbumTitle, guid, albumIds  ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(uploadErrorMessage());
            } else {

                console.log("updateTimelineForAllUsers continue 2");

                if (resultsIsDefined(results) && results.length > 0) {
                    
                    var mentionedGuids = [];
                    results.forEach((result) => {
                        mentionedGuids.push(result.guid);
                    });
                }
            }
        });
    }
    

    function insertInfoIntoTimelineCronTable( guid, albumIds, callbackSuccess) {
        console.log("insertInfoIntoTimelineCronTable ");

        var mediaRows = [];
        for (var index = 0; index < albumIds.length; index++) {         
            let albumId = albumIds[index];            
            mediaRows.push([ guid, albumId ]);  
        }
        
        
        // too do update table timeline and on duplicate update key

        connection.query({
            sql: "INSERT INTO cron_timeline (guid, album_id) VALUES ?",
            values: [ mediaRows ]
        }, function (err, results) {
            if (err) {
                
                if (err.code === "ER_DUP_ENTRY") {  
                    callbackSuccess(true)
                    
                } else {
                    printError(err);
                    callbackSuccess(false)
                }
                
            } else {
                console.log("updateTimelineForAllUsers continue 1");
                callbackSuccess(true)
            }
        });
    }

    function needToSendMentionNotification(guid, albumIds, callbackResults) {


        // SELECT guid_mentioned AS guid, id
        // FROM user_album AS ua 
        //     INNER JOIN mentions AS m 
        //     ON ua.guid = m.album_owner AND ua.`id` = m.album_id AND mention_type = ? 
        // WHERE ua.guid = ? AND ua.id IN (?) AND ua.count = 1",

        connection.query({  
            sql: "SELECT id AS album_id FROM user_album WHERE `guid` = ? AND id IN (?) AND count = 1",
            values: [ guid, albumIds ]
        }, function (err, results) {
            if (err) {
                printError(err);
                callbackResults(null);
            } else {

                var list = []; 
                if (resultsIsDefined(results) && results.length > 0) {
                    results.forEach((result) => {
                        list.push(result.album_id);
                    });
                }

                callbackResults(list);
            }
        });
    }
     
    // We may need to update multiple albums for different set of users.
    function updateTimelineForAllUsers(guid, albumIds, lastMediaDate, mediaKey, signedUrl, response_timestamp, paramsDeleteTmp) {
        // var sqlQurey = "INSERT INTO cron_timeline (guid, album_id) VALUES ?";  
        // var parameters = [guid, albumId ];
        
        console.log("updateTimelineForAllUsers ");

        insertInfoIntoTimelineCronTable(guid, albumIds, function(success) {

            if (!success) {
                rollbackAppError(uploadErrorMessage());
            } else {
                
                commitMediaInsert(mediaKey, signedUrl, response_timestamp, paramsDeleteTmp);

                return;
                // SELECT guid_mentioned AS guid 
                // FROM user_album AS ua 
                //     INNER JOIN mentions AS m 
                //     ON ua.guid = m.album_owner AND ua.`id` = m.album_id AND mention_type = ? 
                // WHERE ua.guid = ? AND ua.id IN (?) AND ua.count = 1",

                // Get all people mentioned in album title, and notify them they were mentioned
                connection.query({  
                    sql: "SELECT guid_mentioned AS guid FROM user_album AS ua INNER JOIN mentions AS m ON ua.guid = m.album_owner AND ua.`id` = m.album_id AND mention_type = ? WHERE ua.guid = ? AND ua.id IN (?) AND ua.count = 1",
                    values: [ MentionType.AlbumTitle, guid, albumIds  ]
                }, function (err, results) {
                    if (err) {
                        printError(err);
                        rollbackAppError(uploadErrorMessage());
                    } else {

                        console.log("updateTimelineForAllUsers continue 2");

                        if (resultsIsDefined(results) && results.length > 0) {
                            
                            var mentionedGuids = [];
                            results.forEach((result) => {
                                mentionedGuids.push(result.guid);
                            });

                            console.log("updateTimelineForAllUsers continue 3");

                            // Send notifications to all people mentioned in album title
                            sendMentionNotifications(guid, guid, albumId, null, mentionedGuids, NotificationType.MentionedInAlbum, function (err, results) {  
                                
                                if (err && err.code !== "ER_DUP_ENTRY") {                        
                                    
                                    rollbackErrorResponseWithMessage(err, uploadErrorMessage());
                                    
                                } else {

                                    commitMediaInsert(mediaKey, signedUrl, response_timestamp, paramsDeleteTmp);

                                }
                            });
                        } else {
                            
                            commitMediaInsert(mediaKey, signedUrl, response_timestamp, paramsDeleteTmp);
                        }
                    }
                });
            }
        });
        
        
        
/*
        In background file

        1) 

        SELECT primarykey_id, guid, album_id, date
        FROM cron_timeline

        

        2) 

        SELECT ua.is_private, friends.guid1
        FROM `user_album` AS ua 
        INNER JOIN `friends` 
        ON ua.guid = friends.guid2 AND friends.`status` = ? 
            LEFT JOIN album_permissions AS ap 
            ON (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
               
        WHERE ua.guid = ? AND album_id = ?

        3) 


        if ua.is_private {

            upload to people with album permission
        } else {

            upload to all followers

            INSERT INTO album_timeline (guid, fguid, album_id, date) VALUES ?
            
        }

        */

    
        

        // guid, fguid, album_id, date

        // timeline

        // sql = 'INSERT INTO user_album_likes SET `guid` = ?, `fguid` = ?, `album_id` = ?, `liked` = ? ON DUPLICATE KEY UPDATE liked=VALUES(liked)';
        
        // insert cron_timeline

        
        // 'SELECT timestamp, UNIX_TIMESTAMP(`timestamp`) AS unix_timestamp FROM album_media WHERE guid = ? AND media_url = ? ORDER BY timestamp DESC LIMIT 1 ',
        
        //     sql: 'INSERT INTO `album_media` (guid, album_id, media_url, type, timelimit ) VALUES ?',
        //     values: [ mediaRows ]
            
            


    }


    
    function getTitleAndCountOfAlbums(guid, albumIds, callback) {
    
    //  function getTitleAndCountOfAlbums(guid, albumIds) {

        connection.query({  
            sql: "SELECT id, title, count FROM user_album  AS ua INNER JOIN mentions AS m ON ua.guid = m.mentioned_by AND  ua.`id` = m.mentioned_in AND mention_type = ? WHERE ua.guid = ? AND ua.id IN (?) AND ua.count = 1",
            values: [ MentionType.AlbumTitle, guid, albumIds  ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(uploadErrorMessage());
            } else {

                callback();

            /**
             * 
             * Insert mentions here
             * 
             * Then send notifications
             * 
             * then continue as usual
             * 
             */

                
            }
        });

     }

    
    /**
     * 
     * Update all user albums that have new content
     * @param {*} guid 
     * @param {*} mediaKey 
     * @param {*} timestamp 
     * @param {*} response_timestamp 
     * @param {*} mediaContentType 
     * @param {*} paramsDeleteTmp 
     
     */
    function updateMyAlbumTable(guid, albumIds, mediaKey, timestamp, response_timestamp, mediaContentType, paramsDeleteTmp) {

        console.log("updateMyAlbumTable ");

        // Update cover album
        // // 24 hours
        // var params = {  Bucket  : ALBUM_BUCKET, 
        //                 Key     : albumCoverKey(guid, mediaUrl), 
        //                 Expires : S3_EXPIRE_LIMIT 
        //              };
        // var signedUrl = s3.getSignedUrl('getObject', params);
        
        // console.log('The URL expires in ' + S3_EXPIRE_LIMIT + " seconds");
        // console.log('The URL expires in ' + inHours(S3_EXPIRE_LIMIT) + " hours");


        // console.log('signedUrl', signedUrl);
        // console.log('mediaUrl', mediaUrl);
        // console.log('guid', guid);
        // console.log('albumIds', albumIds);


    /**
     * UPDATE `user_album` 
     * SET `newest_media_timestamp` = ?, `cover_album_url` = ?, count = count + 1 
     *     field3 = IF(field3 < '2011-00-00 00:00:00' OR field3 IS NULL, NOW(), field3)

    first_url =  IF( first_url IS NOT NULL, ? , ?)

    * WHERE `guid` = ? AND create_date > NOW() - INTERVAL 1 DAY AND `id` IN (?)",
    */


        
        // var albumIds = [];

        // for (var index = 0; index < albumIds.length; index++) {         
            //     let albumDict   = albumList[index];
        //     let albumId     = albumDict[kAlbumId];
        //     // let isNew       = albumDict[kIsNew];
        //     albumIds.push(albumId);
        //     // mediaRows.push([ guid, albumId, mediaUrl, mediaContentType, timelimit ]);  
        // }
        
        connection.query({  
            sql: "UPDATE `user_album` SET `newest_media_timestamp` = ?, `cover_album_url` = ?, first_timestamp = IF(first_timestamp IS NULL, ? , first_timestamp), first_url = IF( first_url IS NULL, ? , first_url), count = count + 1 WHERE `guid` = ? AND create_date > NOW() - INTERVAL 1 DAY AND `id` IN (?)",
            values: [ timestamp, mediaKey, timestamp, mediaKeyWithExtension(mediaKey, mediaContentType), guid, albumIds ]
        }, function (err, results) {
            if (err) {
                printError(err);
                rollbackAppError(uploadErrorMessage());
            } else {

                console.log("updateMyAlbumTable  continue");

                var params = {  Bucket  : ALBUM_BUCKET, 
                    Key     : albumMediaKey(guid, mediaKey, mediaContentType), 
                    Expires : S3_EXPIRE_LIMIT };
                var signedUrl = s3.getSignedUrl('getObject', params);

                updateTimelineForAllUsers(guid, albumIds, timestamp, mediaKey, signedUrl, response_timestamp.toString(), paramsDeleteTmp);

                // // Commit both queries
                // connection.commit(function(err) {
                //     if (err) {
                //         // Failed to commit queries. Rollback on failure
                //         printError(err);
                //         rollbackAppError(uploadErrorMessage());

                //     } else  {
                //         console.log('successful commit!: obj'); 

                //         s3.deleteObjects(paramsDeleteTmp, function(err, data) {
                //             if (err) {
                //                 printError(err);
                //             } else {
                //                 console.log(data);           // successful response
                //             }
                //         });

                //         console.log('timestamp: ' + timestamp); 
                //         console.log('response_timestamp: ' + response_timestamp); 


                        
                //         var params = {  Bucket  : ALBUM_BUCKET, 
                //                         Key     : albumMediaKey(guid, mediaKey, mediaContentType), 
                //                         Expires : S3_EXPIRE_LIMIT };
                //         var signedUrl = s3.getSignedUrl('getObject', params);
 
                //         finalAppResponse( uploadMediaResponse( mediaKey, signedUrl, response_timestamp.toString() ) );
                //         // finalAppResponse( uploadMediaResponse( mediaKeyWithExtension( mediaKey, mediaContentType), signedUrl, reponse_timestamp.toString() ) );
                //     }
                // });
            }
        });
    }



    /**
     * Returns the content from opening a single album
     */


//      func getComments() {

// SELECT *, COUNT(replies.replyToId)
// FROM album_comments c
// 	LEFT JOIN album_comments replies
// 	ON c.ownerGuid = replies.ownerGuid AND albumID = replies.albumID AND c.commentId = replies.replyToId

// 		INNER JOIN profile
// 		ON profile .guid = c.commenterId
// WHERE ownerId = ? AND albumID = ? AND c.replyToId IS NULL
// GROUP BY commentId




// SELECT c.guid, c.album_id, c.comment_id, c.commenter_guid, c.comment, c.timestamp, 
// r.comment_id as reply_id, r.parent_id, r.commenter_guid AS reply_commenter, r.comment AS reply, r.timestamp AS reply_timestame
// FROM album_comments c
// 	LEFT JOIN album_comments AS r
// 	ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id
	
// 			-- 	LEFT JOIN album_comments AS r2
// -- 				ON c.guid = r2.guid AND c.album_id = r2.album_id AND r2.parent_id = c.comment_id
//          WHERE c.guid = 'bob' AND c.album_id = '1' AND c.parent_id IS NULL
// 		--  GROUP BY c.comment_id
//          ORDER BY c.timestamp DESC, r.timestamp DESC


// // Retuen all comments with number of replies
// SELECT c.guid, c.album_id, c.comment_id, c.commenter_guid, c.comment, c.timestamp, c.number_of_replies
// FROM album_comments c
// WHERE c.guid = 'bob' AND c.album_id = '1' AND c.parent_id IS NULL
// ORDER BY c.timestamp
         

// /**
//  * Steps: New Comment
//  * 
//  * 1) Insert comment
//  * 2) Update album's number_of_comments, number_of_responses
//  * 3) Send notification to user of album

//  * Steps: New Reply
//  * 
//  * 1) Insert reply
//  * 2) Update comment's number_of_replies
//  * 3) Update album's number_of_comments, number_of_responses
//  * 4) Send notification to user of comment



//  */


// SELECT c.guid, c.album_id, c.comment_id, c.commenter_guid, c.comment, c.timestamp, c.number_of_replies, c.last_reply_id
// FROM album_comments c
//     LEFT JOIN album_comment_reply AS r
//     ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id
// WHERE c.guid = 'bob' AND c.album_id = '1'
// ORDER BY c.timestamp
         


//      }
  


            


    /*
    
    
    SELECT profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap
    FROM profile 
        INNER JOIN user_album AS ua 
        ON profile.guid = ua.guid 
            LEFT JOIN friends 
            ON friends.guid2 = ua.guid 
                LEFT JOIN album_permissions AS ap 
                ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id 
    WHERE user_album.guid = ? AND ua.id = ? AND friends.guid1 = ? AND friends.`status` = ?",
    
    
    
    */
    
    // has access to album
    // Can post is a different thing

    // gettting comments that have not been blocked
    /*
    Difference in album access along with comments
    and communication
    User is blocked: 
        - If acct is public and album is public,
            let them post, but no one can see comment, but them
        
        - If acct is public, album is private and user is follower, has access permission, is not blocked

        acct(public), album(public)  - user(follower & blocked) - can view albums still, but not comment
        acct(public), album(private) - user(follower & permission & blocked) can view albums still, but not comment


        acct(private), album(public)  - user(follower & blocked) - can not view albums
        acct(private), album(private) - user(follower & permission & blocked) - can view albums still, but not comment            
    */

    function resultsIsDefined(results) {
        return results !== undefined && results !== null;
    }

    function hasPermissionToAlbum(ownerGuid, albumId, guid, callbackWithPermission) {
        
        console.log('hasPermissionToAlbum:');
        console.log('hasPermissionToAlbum: ownerGuid: ' + ownerGuid);
        console.log('hasPermissionToAlbum: albumId:   ' + albumId);
        console.log('hasPermissionToAlbum: guid:      ' + guid);
        
        
        connection.query({
            sql     : "SELECT profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap FROM profile INNER JOIN user_album AS ua ON profile.guid = ua.guid LEFT JOIN friends ON friends.guid2 = ua.guid AND friends.guid1 = ? AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id WHERE ua.guid = ? AND ua.id = ?",
            values  : [ guid, Relationship.IsFollowing, ownerGuid, albumId]
        }, 
        // connection.query({
        //     sql     : "SELECT profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap FROM profile INNER JOIN user_album AS ua ON profile.guid = ua.guid LEFT JOIN friends ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id WHERE ua.guid = ? AND ua.id = ?",
        //     values  : [ guid, Relationship.IsFollowing, ownerGuid, albumId, guid]
        // }, 
        function (err, results, fields) {

            console.log('results:', JSON.stringify(results, null, 2));
            
            if (err) {
                console.log('results:  error');
                

                finalAppResponse(errorResponseGeneric(err));
                
            } else if (resultsIsDefined(results) && results.length > 0) {
                console.log('results:  resultsIsDefined');
                
                let userIsPrivate       = intToBool(results[0].user_is_private);
                let albumIsPrivate      = intToBool(results[0].album_is_private);
                let followStatus        = results[0].follow_status
                
                let isBlocked           = intToBool(results[0].is_blocked);
                
                let hasAlbumPermission  = intToBool(results[0].has_ap)
                let commentsOn          = intToBool(results[0].comments_on);

                // public account - public album or private album, but user has permission
                if (!userIsPrivate && ( !albumIsPrivate || hasAlbumPermission )) {

                    // okay
                    callbackWithPermission(true, commentsOn);              
                    
                // following privata acctount
                } else if (userIsPrivate && followStatus === Relationship.IsFollowing) {

                        // private user
                        // public album, user is follower and not blocked
                    if ( (!albumIsPrivate && !isBlocked) || (albumIsPrivate && hasAlbumPermission)) {
    
                        callbackWithPermission(true, commentsOn);         
                  
                    } else {
                        callbackWithPermission(false, commentsOn);             
                    }
                } else {
                    callbackWithPermission(false, commentsOn);             
                }
            } else {
                console.log('results:  resultsIsDefined');
                
                finalAppResponse(errorResponseGeneric(null));
            }
        });
    }



    // I.e. acces to album
    function hasPermissionToComment(ownerGuid, albumId, guid, callbackPermissionToComment) {
        console.log('hasPermissionToComment:');

        // if (ownerGuid.localeCompare(guid) == 0) {
        //     callbackPermissionToComment();       
        // }
        
        
        connection.query({
            sql     : "SELECT profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap FROM profile INNER JOIN user_album AS ua ON profile.guid = ua.guid LEFT JOIN friends ON friends.guid2 = ua.guid AND friends.guid1 = ? AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id WHERE ua.guid = ? AND ua.id = ?",
            values  : [guid, Relationship.IsFollowing, ownerGuid, albumId]
        }, 
        function (err, results, fields) {

            console.log('results:', JSON.stringify(results, null, 2));
            
            if (err) {

                finalAppResponse(errorResponseGeneric(err));
                
            } else if (results && results.length > 0) {

                let userIsPrivate       = intToBool(results[0].user_is_private);
                let albumIsPrivate      = intToBool(results[0].album_is_private);
                let followStatus        = results[0].follow_status
                
                let isBlocked           = intToBool(results[0].is_blocked);
                
                let hasAlbumPermission  = intToBool(results[0].has_ap)
                let commentsOn          = intToBool(results[0].comments_on);
              
                if (!commentsOn) {
                    finalAppResponse( otherResponse( "Comments are turned off"));                
                    return;
                }

                // public account - public album or private album, but user has permission
                if (!userIsPrivate ) {

                    // public album and not blocked, or private and has permission
                    if  ( (!albumIsPrivate && !isBlocked) || hasAlbumPermission ) {

                        callbackPermissionToComment();              
                    } else {
                        finalAppResponse( otherResponse( "You dont't have access to this album"));
                    }
                    
                // following privata acctount
                } else if (userIsPrivate && followStatus === Relationship.IsFollowing) {

                        // public album, user is follower and not blocked
                    if ( (!albumIsPrivate && !isBlocked) || hasAlbumPermission) {
    
                        callbackPermissionToComment();              
                        
                    } else {
                        finalAppResponse( otherResponse( "You dont't have access to this album"));
                    }
                } else {
                    finalAppResponse( otherResponse( "You dont't have access to this album"));
                }
            } else {
                finalAppResponse(errorResponseGeneric(null));
            }
        });
    }
    


    // guid
    // album_id
    // comment_id
    // commenter_guid

    // albumOwnerGuid, albumId, parentCommentId,

    // callback( parentCommentGuid, parentFollowStatus, sendNotificationToParent);

    function hasReplyPermission(sql, parameters, callback) {
        console.log('hasReplyPermission:');
        
        connection.query({
            sql     : sql,
            values  : parameters
        }, 
        function (err, results, fields) {

            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {

                finalAppResponse(errorResponseGeneric(err));
                
            } else if (results && results.length > 0) {
                    
                let result = results[0];
                
                let parentCommentGuid     = result.guid;
                let parentFollowStatus    = result.follow_status;
                let userIsBlockedByParent = intToBool(result.is_blocked);
                
                
                callback(parentCommentGuid, parentFollowStatus, userIsBlockedByParent);
                
            } else {
                finalAppResponse( errorResponse( ErrorMessageGeneric));
            }
        });
    }
    
    function hasPermissionToReplyToUserOfReply(albumOwnerGuid, albumId, parentCommentId, commentId, replierGuid, callbackSendNotification) {
        console.log('hasPermissionToReplyToUserOfReply:');
        
        var sqlQuery = "SELECT ac.commenter_guid as guid, friends.status AS follow_status, friends.blocked AS is_blocked FROM album_comment_reply AS ac LEFT JOIN friends ON friends.guid2 = ua.guid WHERE ac.guid = ? AND ac.album_id = ? AND ac.parent_id = ? AND ac.comment_id = ? AND friends.guid1 = ?";
        var param = [albumOwnerGuid, albumId, parentCommentId, commentId, replierGuid];

        hasReplyPermission(sqlQuery, param, function(parentCommentGuid, parentFollowStatus, userIsBlockedByParent) {
            if (userIsBlockedByParent) {
                callbackSendNotification(parentCommentGuid, false);
            } else {
                callbackSendNotification(parentCommentGuid, true);                
            }
        });
    }
        
    /*
    Insert later
    SELECT ns.comments, ns.reply_to_comment, ns.reply_to_my_comments
        LEFT JOIN notification_settings AS ns
        ON ns.guid = ac.commenter_guid
                
        
    SELECT ac.commenter_guid as guid, friends.status AS follow_status, friends.blocked AS is_blocked 
    FROM album_comments AS ac 
        LEFT JOIN friends 
        ON friends.guid2 = ac.commenter_guid 
    WHERE ac.guid = ? AND ac.album_id = ? AND ac.comment_id = ? AND friends.guid1 = ?";

    SELECT ac.commenter_guid as guid, friends.status AS follow_status, friends.blocked AS is_blocked 
    FROM album_comments AS ac 
        LEFT JOIN friends 
        ON friends.guid1 = ? AND friends.guid2 = ac.commenter_guid 
    WHERE ac.guid = ? AND ac.album_id = ? AND ac.comment_id = ?";

                        {
                            "albumId": "uySJkVj7OasL",
                            "action": "PostReply",
                            "fguid": "us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd-2a2e929e",
                            "commentId": "13",
                            "comment": "Another reply",
                            "acctId": "2a2e929e",
                            "albumOwner": "c8a66a2b-c26d-4d3c-97ea-da1228dbc91c-bf83af68"
                        }
                        
                        
    */
    function hasPermissionToReplyToUserOfComment(albumOwnerGuid, albumId, commentId, replierGuid, callbackSendNotification) {
        console.log('hasPermissionToReplyToUserOfComment:');
        
        var sqlQuery = "SELECT ac.commenter_guid as guid, friends.status AS follow_status, friends.blocked AS is_blocked FROM album_comments AS ac LEFT JOIN friends ON friends.guid1 = ? AND friends.guid2 = ac.commenter_guid WHERE ac.guid = ? AND ac.album_id = ? AND ac.comment_id = ?";
        var param    = [replierGuid, albumOwnerGuid, albumId, commentId];

        hasReplyPermission(sqlQuery, param, function(parentCommentGuid, parentFollowStatus, userIsBlockedByParent) {
            // callback(parentCommentGuid, parentFollowStatus, userIsBlockedByParent);
            if (userIsBlockedByParent) {
                callbackSendNotification(parentCommentGuid, false);
            } else {
                callbackSendNotification(parentCommentGuid, true);                
            }    
        });
    }

    



    function getComments(sql, parameters, guid, albumId, fguid) {
        console.log("getComments");
        
        
        hasPermissionToAlbum(guid, albumId, fguid, function (accessAllowed, commentsOn) {    

            console.log('accessAllowed: ' + accessAllowed);
            console.log('commentsOn   : ' + commentsOn);
            

            if (accessAllowed === true && commentsOn === true) {

                connection.query({
                    sql     : sql,
                    values  : parameters
                }, 
                function (err, results, fields) {
        
                    console.log('Results:', JSON.stringify(results, null, 2));
                    
                    if (err) {
        
                        finalAppResponse(errorResponseGeneric(err));
                        
                    } else if (resultsIsDefined(results)) {
                            
                        let comments = getCommentsFromResults(results)
                        finalAppResponse( listCommentsResponse( comments ));
                        
                    } else {
                        finalAppResponse( errorResponse( ErrorMessageGeneric));
                    }
                });
                
            } else if (commentsOn === false) {
                finalAppResponse( otherResponse( "Comments are turned off"));                
            } else {
                finalAppResponse( otherResponse( "You dont't have access to view these comments"));
            }
        });
    }

    

    function getNotificationComment(sql, parameters, guid, albumId, fguid) {
        console.log("getComments");

        hasPermissionToAlbum(guid, albumId, fguid, function (accessAllowed, commentsOn) {    

            console.log('accessAllowed: ' + accessAllowed);
            console.log('commentsOn   : ' + commentsOn);
            

            if (accessAllowed === true && commentsOn === true) {

                connection.query({
                    sql     : sql,
                    values  : parameters
                }, 
                function (err, results, fields) {
        
                    console.log('Results:', JSON.stringify(results, null, 2));
                    
                    if (err) {
        
                        finalAppResponse(errorResponseGeneric(err));
                        
                    } else if (resultsIsDefined(results)) {
                            
                        let comments = getNotificationCommentsFromResults(results)
                        finalAppResponse( listCommentsResponse( comments ));
                        
                    } else {
                        finalAppResponse( errorResponse( ErrorMessageGeneric));
                    }
                });
                
            } else if (commentsOn === false) {
                finalAppResponse( otherResponse( "Comments are turned off"));                
            } else {
                finalAppResponse( otherResponse( "You dont't have access to view these comments"));
            }
        });
    }

    

    // Returns comment that mentions user
    function getCommentMentioningUser(ownerGuid, albumId, commentId, fguid) {
        console.log("getCommentMentioningUser");        
        var sqlQuery = "SELECT c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id FROM album_comments c WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";
        var parameters = [ownerGuid, albumId, commentId];
        getNotificationComment(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }



    
    // Same as above?
    // Returns comment on album by a user from notification
    function getCommentOnUserAlbum(ownerGuid, albumId, commentId, fguid) {
        console.log("getCommentOnUserAlbum ownerGuid: " + ownerGuid);   
        console.log("getCommentOnUserAlbum albumId: " + albumId);        
        console.log("getCommentOnUserAlbum commentId: " + commentId);        
        console.log("getCommentOnUserAlbum fguid: " + fguid);        
        

        var sqlQuery = "SELECT c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id FROM album_comments c WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";
        var parameters = [ownerGuid, albumId, commentId];
        getNotificationComment(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }

    
    // SELECT c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, 
    //       p.parent_id AS p_parent_id, p.comment_id AS p_comment_id, p.commenter_guid AS p_commenter_guid, p.comment AS p_comment, UNIX_TIMESTAMP(p.timestamp) AS p_timestamp, p.number_of_replies AS p_number_of_replies 
    // FROM album_comments c 
    //     LEFT JOIN album_comments AS p 
    //     ON c.guid = p.guid AND c.album_id = p.album_id AND c.parent_id  = p.comment_id 
    // WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";

    
    // Get our comment and the reply
    // by getting their comment and the parent
    // Returns reply to a our comment
    // Get the parentId, and get that comment     
    function getReplyToComment(ownerGuid, albumId, commentId, fguid) {
        console.log("getReplyToComment");        
        var sqlQuery = "SELECT c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, p.parent_id AS p_parent_id, p.comment_id AS p_comment_id, p.commenter_guid AS p_commenter_guid, p.comment AS p_comment, UNIX_TIMESTAMP(p.timestamp) AS p_timestamp, p.number_of_replies AS p_number_of_replies FROM album_comments c LEFT JOIN album_comments AS p ON c.guid = p.guid AND c.album_id = p.album_id AND c.parent_id = p.comment_id WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";
        var parameters = [ownerGuid, albumId, commentId];
        getNotificationComment(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }
        
    




        // Get comments that have not been blocked by ownerGuid of album

        
    // SELECT profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, ap.guid AS has_ap 
    // FROM profile
    //     INNER JOIN user_album AS ua 
    //     ON profile.guid = ua.guid 
    //         LEFT JOIN friends 
    //         ON friends.guid2 = ua.guid 
    //             LEFT JOIN album_permissions AS ap 
    //             ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id 
    // WHERE user_album.guid = ? AND ua.id = ? AND friends.guid1 = ? AND friends.`status` = ?",
        


    // SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, r.comment_id AS r_comment_id, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following, r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN friends AS c_friends ON friends.guid1 = c.commenter_guid AND friends.guid2 = c.guid
            
                // LEFT JOIN album_comment_reply AS r 
                // ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id 
                
                //     LEFT JOIN profile AS r_profile 
                //     ON r.commenter_guid = r_profile.guid 

                //         LEFT JOIN friends AS r_friends
                //         ON friends.guid1 = r.commenter_guid AND friends.guid2 = r.guid AND (c_friends.blocked = 0 OR friends.guid1 <> me)
                        


    // SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following 
    // FROM album_comments c 
    //     INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid 
    //         LEFT JOIN friends AS c_friends 
            //    ON c_friends.guid1 = c.commenter_guid AND c_friends.guid2 = c.guid 
    // WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NOT NULL AND (c_friends.blocked = 0 OR c_friends.guid1 = ?) ORDER BY c.timestamp DESC";
                

    // Not sure about  LEFT JOIN friends AS c_friends, who are we blocking? 

                
    
    // SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following 
    // FROM album_comments c 
    //     INNER JOIN profile AS c_profile 
    //     ON c.commenter_guid = c_profile.guid 
    //         LEFT JOIN friends AS c_friends 
    //         ON c_friends.guid1 = c.commenter_guid AND c_friends.guid2 = c.guid 
    // WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND ( c_friends.guid1 IS NULL OR c_friends.blocked = 0 OR c_friends.guid1 = ?) ORDER BY c.timestamp DESC";

    // SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following 
    // FROM album_comments c 
    //     INNER JOIN profile AS c_profile 
    //     ON c.commenter_guid = c_profile.guid 
          
    // WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL ORDER BY c.timestamp DESC";

    /*
    SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following 
    FROM album_comments c 
        LEFT JOIN profile AS c_profile 
        ON c.commenter_guid = c_profile.guid AND deleted = 0
    WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND (deleted = 0 OR number_of_replies >  0) 
    ORDER BY c.timestamp DESC";


    */


    // Removed c.guid, c_commenter_guid, r_commenter_guid
    //TODO: Check permissions of user
    function loadComments(ownerGuid, albumId, fguid) {        
        console.log("loadComments");        
        var sqlQuery   = "SELECT c.album_id AS c_album_id, c.deleted AS c_deleted, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following FROM album_comments c LEFT JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid AND deleted = 0 WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND (deleted = 0 OR number_of_replies >  0) ORDER BY c.timestamp DESC";
        var parameters = [ownerGuid, albumId, fguid];
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }
        
    

    // "SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id,  c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following 
    // FROM album_comments c 
    //     INNER JOIN profile AS c_profile 
    //     ON c.commenter_guid = c_profile.guid 
    //         LEFT JOIN friends AS c_friends 
    //         ON c_friends.guid1 = c.commenter_guid AND c_friends.guid2 = c.guid 
    // WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND (c_friends.blocked = 0 OR c_friends.guid1 = ?) AND c.timestamp <= FROM_UNIXTIME(?) ORDER BY c.timestamp DESC";
    
        
    function loadMoreComments(ownerGuid, albumId, fguid, commentId, lastTimestamp) {
        
        console.log("loadMoreComments ownerGuid     : " + ownerGuid);
        console.log("loadMoreComments albumId       : " + albumId);
        console.log("loadMoreComments fguid         : " + fguid);
        console.log("loadMoreComments lastTimestamp : " + lastTimestamp);
        
        
        var sqlQuery   = "SELECT c.album_id AS c_album_id, c.deleted AS c_deleted, c.comment_id AS c_comment_ided, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id,  c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following FROM album_comments c LEFT JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid AND deleted = 0 WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND c.comment_id <> ? AND c.timestamp <= FROM_UNIXTIME(?) AND (deleted = 0 OR number_of_replies >  0) ORDER BY c.timestamp DESC";
        // var sqlQuery   = "SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, r.comment_id AS r_comment_id, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following, r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN album_comment_reply AS r ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id LEFT JOIN profile AS r_profile ON r.commenter_guid = r_profile.guid WHERE c.guid = ? AND c.album_id = ? AND c.timestamp <= FROM_UNIXTIME(?) ORDER BY c.timestamp"; 
        var parameters = [ownerGuid, albumId, commentId, lastTimestamp]
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }
     

    // "SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid, c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following 
    // FROM album_comments c 
    //     LEFT JOIN profile AS c_profile 
    //     ON c.commenter_guid = c_profile.guid AND deleted = 0 
    // WHERE c.guid = ? AND c.album_id = ? AND c.parent_id = ? AND (deleted = 0 OR number_of_replies >  0) 
    // ORDER BY c.timestamp DESC";

    /**
     
        SELECT c.album_id AS c_album_id, c.deleted AS c_deleted, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid, c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following 
        FROM album_comments c 
            LEFT JOIN profile AS c_profile 
            ON c.commenter_guid = c_profile.guid AND deleted = 0 
        WHERE c.guid = ? AND c.album_id = ? AND c.parent_id = ? AND (deleted = 0 OR number_of_replies >  0) 
        ORDER BY c.timestamp DESC";


     */
    
     function loadReplies(ownerGuid, albumId, commentId, fguid) {
        console.log("loadReplies");        
        console.log("loadReplies ownerGuid : " + ownerGuid);
        console.log("loadReplies albumId   : " + albumId);
        console.log("loadReplies commentId : " + commentId);
        console.log("loadReplies fguid     : " + fguid);

        var sqlQuery   = "SELECT c.album_id AS c_album_id, c.deleted AS c_deleted, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid, c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following FROM album_comments c LEFT JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid AND deleted = 0 WHERE c.guid = ? AND c.album_id = ? AND c.parent_id = ? AND (deleted = 0 OR number_of_replies >  0) ORDER BY c.timestamp DESC";
        var parameters = [ownerGuid, albumId, commentId];
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);
     }


     function loadMoreReplies(ownerGuid, albumId, commentId, lastTimestamp, fguid) {
        console.log("loadMoreReplies");
        var sqlQuery   = "SELECT c.album_id AS c_album_id, c.deleted AS c_deleted, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, c_profile.guid AS c_guid, c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following FROM album_comments c LEFT JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid AND deleted = 0 WHERE c.guid = ? AND c.album_id = ? AND c.parent_id = ? AND c.timestamp <= FROM_UNIXTIME(?) AND (deleted = 0 OR number_of_replies >  0) ORDER BY c.timestamp DESC";
        // var sqlQuery = "SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, r.comment_id AS r_comment_id, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following, r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN friends AS c_friends ON friends.guid1 = c.commenter_guid AND friends.guid2 = c.guid WHERE c.guid = ? AND c.album_id = ? AND c.parent_id IS NULL AND (c_friends.blocked = 0 OR friends.guid1 = ?) AND c.timestamp <= FROM_UNIXTIME(?) ORDER BY c.timestamp DESC";
        // var sqlQuery   = "SELECT c.album_id AS c_album_id, c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, r.comment_id AS r_comment_id, r.comment AS r_comment, UNIX_TIMESTAMP(r.timestamp) AS r_timestamp, r.number_of_replies AS r_number_of_replies, c_profile.guid AS c_guid,  c_profile.username AS  c_username, c_profile.fullname AS c_fullname, c_profile.verified AS c_verified, c_profile.image_url AS c_image_url, c_profile.is_private AS c_is_private, c_profile.allow_view_followers AS c_allow_view_followers, c_profile.allow_view_followings AS c_allow_view_followings, c_profile.popularity AS c_popularity, c_profile.followers AS c_followers, c_profile.following AS c_following, r_profile.guid AS r_guid,  r_profile.username AS  r_username, r_profile.fullname AS r_fullname, r_profile.verified AS r_verified, r_profile.image_url AS r_image_url, r_profile.is_private AS r_is_private, r_profile.allow_view_followers AS r_allow_view_followers, r_profile.allow_view_followings AS r_allow_view_followings, r_profile.popularity AS r_popularity, r_profile.followers AS r_followers, r_profile.following AS r_following FROM album_comments c INNER JOIN profile AS c_profile ON c.commenter_guid = c_profile.guid LEFT JOIN album_comment_reply AS r ON c.guid = r.guid AND c.album_id = r.album_id AND r.parent_id = c.comment_id AND r.comment_id = c.last_reply_id LEFT JOIN profile AS r_profile ON r.commenter_guid = r_profile.guid WHERE c.guid = ? AND c.album_id = ? AND c.timestamp <= FROM_UNIXTIME(?) ORDER BY c.timestamp"; 
        var parameters = [ownerGuid, albumId, commentId, lastTimestamp]
        getComments(sqlQuery, parameters, ownerGuid, albumId, fguid);
    }



    // Returns the comment parentId (if it has one) and number of replies 
    function getDeleteCommentInfo(albumOwnerGuid, albumId, commentId,  callback) {
        console.log("getDeleteCommentInfo");

        console.log("getDeleteCommentInfo albumOwnerGuid: " + albumOwnerGuid);
        console.log("getDeleteCommentInfo albumId       : " + albumId);
        console.log("getDeleteCommentInfo commentId     : " + commentId);


        connection.query({
            sql     : "SELECT parent_id, number_of_replies, deleted FROM album_comments WHERE `guid` = ? AND `album_id` = ? AND comment_id = ?",
            values  : [  albumOwnerGuid, albumId, commentId]
        },
        function (err, results) {
            
            console.log('Results:', JSON.stringify(results, null, 2));

            if (err) {
    
                callback(null, null, false);
                
            } else if ( resultsIsDefined(results) && results.length > 0 ) {

                let result = results[0];

                // console.log(' Results commentId: ' + result.commentId);

                if (result.deleted === 1) {
                    callback(null, null, true);

                } else {
                    callback(result.parent_id, result.number_of_replies, false)
                }
                 
            } else {
                // Comment was already deleted
                callback(null, null, false);
            }
        });
    }



    function print(text) {
        console.log(text);
        console.log('Json', JSON.stringify(text, null, 2));
    }



    function deleteReply(myGuid , albumOwnerGuid, albumId, commenterGuid, commentId ) {

    }

    // Update number of comments 
    // TODO: also delete notification?
    function deleteComment(myGuid , albumOwnerGuid, albumId, commenterGuid, commentId ) {

        console.log("deleteComment");
        if ( myGuid.localeCompare( commenterGuid ) !== 0 && myGuid.localeCompare( albumOwnerGuid ) !== 0) {
            console.log("deleteComment no");
            finalAppResponse(errorResponseGeneric(null));
        } else {
            console.log("deleteComment ok");

            getDeleteCommentInfo(albumOwnerGuid, albumId, commentId, function(parentID, numberOfCommentReplies, commentAlreadyDeleted) {


                if (commentAlreadyDeleted === true) {
                    finalAppResponse(successfulResponse());
                    return;
                }

                
                if (numberOfCommentReplies === null) {
                    finalAppResponse(errorResponseGeneric(null));
                    return;
                }


                beginTransaction( function () {
                    console.log('beginTransaction');

                    // Update comment as deleted
                    
                    connection.query({
                        sql     : "UPDATE `album_comments` SET `deleted` = 1 WHERE `guid` = ? AND `album_id` = ? AND `commenter_guid` = ? AND comment_id = ?",
                        values  : [  albumOwnerGuid, albumId, commenterGuid, commentId]
                    },
                    function (err, results) {
                        console.log('Results:', JSON.stringify(results, null, 2));
                        if (err) {
            
                            rollbackErrorGenericMessage(err);
                            // finalAppResponse(errorResponseGeneric(err));
                            
                        } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                            print("resultsIsDefined")


                            /* If the comment has no replies, we update the parent number_of_replies as one less
                                If comment has replies, then we still count it? 

                                TODO: What is the child is later deleted and hence forth. Just leave the count?
                                // Let users see the one reply and when they try to download it, nothing happens
                            */


                            // if comment was deleted no on can reply to it.

                            if (parentID === null && numberOfCommentReplies === 0) {
                                //  This is a comment and has no responses
                                //  Mark it as deleted
                                //  Update album.number_of_responses -= 1 

                               decrementAlbumNumberorReplies(albumOwnerGuid, albumId, function(success) {
                                    print("decrementAlbumNumberorReplies success: " + success)

                                    if (success) {
                                        commitTransactionWithResponse();
                                    } else {
                                        rollbackErrorGenericMessage(null);
                                    }
                                });
                            } else if (parentID === null && numberOfCommentReplies > 0) {
                                //  This is a comment and has one or more responses
                                //  Mark it as deleted
                                //  Do not update album.number_of_responses
                                //  Because we will need the parent to request to see it's children

                                commitTransactionWithResponse();

                            } else if (parentID !== null && numberOfCommentReplies === 0) {
                                //  This is a reply to a comment and has no responses
                                //  Mark it as deleted
                                //  Update parent_comment.number_of_responses -= 1 
                                
                                // // Recursive function
                                // if parent_comment.deleted == true && parent_comment.number_of_responses == 0 {
                                //     update parent_comment or album num_reply
                                // }

                                decrementCommentNumberorReplies(albumOwnerGuid, albumId, parentID, function(success) {
                                    print("decrementCommentNumberorReplies success: " + success)

                                    if (success) {
                                        commitTransactionWithResponse();
                                    } else {
                                        rollbackErrorGenericMessage(null);
                                    }
                                });
                            } else { //if (parentID !== null && numberOfCommentReplies > 0) {
                                
                                //  This is a reply to a comment and has one or more responses
                                //  Mark it as deleted
                                //  Do not update comment.number_of_responses

                                commitTransactionWithResponse();
                            }

                            /*
                        ===== Album =====  num_replies = 2

                            Comment_1       0   deleted -> no updates
                                Reply_1     0   deleted 
                                Reply_2     0   deleted

                            Comment_2        1 
                                Reply_1      0 deleted
                                    Reply_1  0 deleted
                                Reply_2      0

                            Comment_3        2
                                Reply_1      0
                                Reply_2      0


                            if (numberOfCommentReplies === 0 ) {

                                // A reply
                                if (parentID !== null) {
                                    // This has a parent comment, that we need to decrease
                                    decrementCommentNumberorReplies(albumOwnerGuid, albumId, parentID, function(success) {
                                        print("updateNumberOfReplies success: " + success)

                                        if (success) {

                                            commitTransactionWithResponse();

                                        } else {
                                            rollbackErrorGenericMessage(null);
                                        }
                                    });
                                } else {
                                    print("resultsIsDefined not ")
                                    // A comment
                                    decrementAlbumNumberorReplies(albumOwnerGuid, albumId, function(success) {
                                        print("updateNumberOfReplies success: " + success)

                                        if (success) {
                                            commitTransactionWithResponse();
                                        } else {
                                            rollbackErrorGenericMessage(null);
                                        }
                                            
                                    });
                                }
                            } else {

                                // If comment has children comments, we don't decrease the number of replies for the parent
                                commitTransactionWithResponse();

                            }
                        } else {

                            print("some error here")

                            commitTransactionWithResponse();
                            
                        }
                        */
                        } else {
                            rollbackErrorGenericMessage(null);
                        }
                    });
                });
            });
        }


    
        // SELECT parent_id, number_of_replies FROM album_comments WHERE `guid` = ? AND `album_id` = ? AND comment_id = ?",
        // if number_of_replies === 0 {
        //     Mark delete_bit = 1 // just delete row?  

        //     If has parent comment {
        //         update it's number_of_replies -= 1
        //     } else {
        //         // This is main comment, update number_of_replies for album
        //         update it's number_of_replies -= 1
        //     }

        // } else {
        //     delete guid ? or just use a bit
        // }


        // Delete notification 


            // connection.query({
            //     sql     : "DELETE FROM album_comments WHERE `guid` = ? AND `album_id` = ? AND `commenter_guid` = ? AND comment_id = ?",
            //     values  : [  albumOwnerGuid, albumId, commenterGuid, commenterId]
            // },
            // function (err, results) {
    
            //     console.log('Results:', JSON.stringify(results, null, 2));
                
            //     if (err) {
    
            //         finalAppResponse(errorResponseGeneric(err));
                    
            //     } else if (resultsIsDefined(results)) {
                        
            //         if (results.affectedRows === 1) {
                        
            //             finalAppResponse(successfulResponse());
                    
            //         } else {
                        
            //             finalAppResponse(errorResponseGeneric(err));

            //         }
            //     } else {
            //         finalAppResponse( errorResponse( ErrorMessageGeneric));
            //     }
            // });
            
    }


    

    function toggleCommentsOnForAlbum(guid, albumId, turnOn) {
        console.log("turnCommentsOnForAlbum guid: " + guid );
        console.log("turnCommentsOnForAlbum albumId: " + albumId );
        console.log("turnCommentsOnForAlbum turnOn: " + turnOn );
        
        connection.query({
            sql     : "UPDATE user_album SET `comments_on` = ? WHERE `guid` = ? AND `id` = ?",
            values  : [turnOn, guid, albumId]
        },
        function (err, results, fields) {

            console.log('results:', JSON.stringify(results, null, 2));
            
            if (err) {

                finalAppResponse(errorResponseGeneric(err));
                
            } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                
                var _turnOn = turnOn === 1 ? true: false;

                finalAppResponse(commentsOnResponse(_turnOn));

            } else {
                finalAppResponse(errorResponseGeneric(err));

            }
        });
    }


    
    
    
    
    // blocked user can post comments and replies, but no one gets them?
    //TODO: Create section in settings, where user can update notifications settings.
    /**
     * 
     Activity Notifications: 

     Comments
     -------------
     My albums:
     Comments | Comments and replies
     comments on my albums
     replies to comments on my albums

     My comments:
     Replies to my comments

     Blocked users can not respond to any of my followers
     * 
     */
    // Receive notification for comments on my albums
    // Receive notifications to replies to comments on albums
    // Receive notificatinos to replies I've made on other albums
    // Receive notifications only from people I'm following or people I haven't blocked?
    
    function postComment(albumOwnerGuid, albumId, commenterGuid, comment) {
        // INSERT INTO album_comments SET guid = ?, album_id = ?, comment_id = ?, commenter_guid = ?, comment = ?, 
        console.log('postComment');
         
        hasPermissionToComment(albumOwnerGuid, albumId, commenterGuid, function () {

            beginTransaction( function() {
                
                incrementAlbumNumberorReplies(albumOwnerGuid, albumId, function(success) {

                    if (!success) {
                        rollbackErrorGenericMessage(null);
                    } else {

                        insertComment( albumOwnerGuid, albumId, commenterGuid, comment, function(sucess) {

                            if (!success) {
                                rollbackErrorGenericMessage(null);
                            } else {
                    
                                console.log('inserted? rows');

                                let allUserNames = getAllMentionedUsers(comment);
                                
                                console.log("allUserNames: " + allUserNames);
                                console.log('allUserNames:', JSON.stringify(allUserNames, null, 2));
                                
                                lastCommentId(albumOwnerGuid, albumId, commenterGuid, function(lastCommentId) {
                                    
                                    havePermissionToNotifyMentionedUser(albumOwnerGuid, albumId, allUserNames, function (mentionedGuids) {

                                        sendMentionNotifications(commenterGuid, albumOwnerGuid, albumId, lastCommentId, mentionedGuids, NotificationType.MentionedInComment, function (error) {
                                            
                                            if (error && error !== null) {
                                                rollbackErrorGenericMessage(null);
                                            } else {

                                                commitTransaction( function(success) {
                                                    if (success) {
                                                        if (lastCommentId !== null) {
                                                            
                                                            sendNotification(albumOwnerGuid, commenterGuid, NotificationType.ReceivedComment, albumOwnerGuid, albumId, lastCommentId, function() {
                                                                finalAppResponse( insertCommentResponse( lastCommentId.toString() ));                        
                                                            });    
                
                                                            // finalAppResponse( insertCommentResponse( lastCommentId.toString() ));                        
                                                        } else {
                                                            finalAppResponse( insertCommentResponse( null ));                                                
                                                        }
                                                    } else {
                                                        rollbackAppError(ErrorMessageGeneric);
                                                    }
                                                });
                                            }
                                        });                                 
                                        
                                            

                                        //   if (lastCommentId !== null) {

                                        //     sendNotification(albumOwnerGuid, commenterGuid, NotificationType.ReceivedComment, albumOwnerGuid, albumId, lastCommentId, function() {
                                        //         finalAppResponse( insertCommentResponse( lastCommentId.toString() ));                        
                                        //     });    

                                        //     // finalAppResponse( insertCommentResponse( lastCommentId.toString() ));                        
                                        // } else {
                                        //     finalAppResponse( insertCommentResponse( null ));                                                
                                        // }

                                        // sendNotification(albumOwnerGuid, commenterGuid, NotificationType.ReceivedComment, albumOwnerGuid, albumId, lastCommentId, function() {
                                        //     returnLastCommentId(albumOwnerGuid, albumId, commenterGuid);
                                        // });    

                                    });                                 
                                });
                            }
                        });
                    }
                });
            });
        });
    }

    

    function insertReply( albumOwnerGuid, albumId, commenterGuid, comment, commentId, callbackSuccess) {

        connection.query({
            sql     : "INSERT INTO album_comments (guid, album_id, parent_id, comment_id, commenter_guid, comment) SELECT ?, ?, ?, coalesce(MAX(`comment_id`) + 1, 0), ?, ? FROM `album_comments` WHERE guid = ? AND album_id  = ?",
            values  : [ albumOwnerGuid, albumId, commentId, commenterGuid, comment, albumOwnerGuid, albumId]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                callbackSuccess(false);
            } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                callbackSuccess(true);
            } else {
                callbackSuccess(false);
            }
        });
    }

    function insertComment( albumOwnerGuid, albumId, commenterGuid, comment, callbackSuccess) {

        connection.query({
            sql     : "INSERT INTO album_comments (guid, album_id, comment_id, commenter_guid, comment) SELECT ?, ?, coalesce(MAX(`comment_id`) + 1, 0), ?, ? FROM `album_comments` WHERE guid = ? AND album_id  = ?",
            values  : [ albumOwnerGuid, albumId, commenterGuid, comment, albumOwnerGuid, albumId]
        },
        function (err, results, fields) {

            console.log('Results:', JSON.stringify(results, null, 2));
            

            if (err) {
                callbackSuccess(false);
            } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                callbackSuccess(true);
            } else {
                callbackSuccess(false);
            }
        });
    }




    // function insertMentionsForCreatedAlbum(guid, albumId, title ) {
        
    //     console.log("insertMentionsForCreatedAlbum");
        
    //     var possibleMentinos = title.split(" ");

    //     // find all mentions of any users        
    //     var allMentions = possibleMentinos.filter(function(word){            
    //         if (word.startsWith("@")) {
    //             return word.substring(1);
    //         }
    //     });

    //     // find all hashtags
    //     var allHashtags = possibleMentinos.filter(function(word){            
    //         if (word.startsWith("#")) {
    //             return word.substring(1);
    //         }
    //     });


    //     if ( allMentions.length > 0 ) {
            
    //         connection.query({
    //             sql: "SELECT guid FROM profile WHERE username in (?)",
    //             values: [allMentions] , 
    //         }, 
    //         function (err, results, fields) {
    
    //             console.log("results: " + results);
    
    //             if (err) {

    //                 rollbackErrorResponse(err);

    //             } else if (results && results.length > 0) {
                        
    //                 var mentionRows = [];
    //                 var mentionedGuids = [];
                    
    //                 results.forEach((result) => {
    //                     mentionedGuids.push([ result.guid ]);
    //                     mentionRows.push([ result.guid, guid, albumId, MentionType.AlbumTitle]);
    //                 }); 

    //                 // INSERT INTO `mentions` ( guid_mentioned, mentioned_by , mentioned_in, mention_type) 
    //                 //     (SELECT guid, ?, ?, ?
    //                 //     FROM profile 
    //                 //     WHERE username in (?)
    //                 //     )

    //                 //     param = guid, albumId, MentionType.AlbumTitle
                    

    //                 connection.query({
    //                     sql: 'INSERT INTO `mentions` ( guid_mentioned, mentioned_by , mentioned_in, mention_type) VALUES ?',
    //                     values: [mentionRows] , 
    //                 }, 
    //                 function (err, results, fields) {

    //                     console.log("query: " + query);

    //                     if (err) {

    //                         rollbackErrorResponse(err);
                            
    //                     } else {
                            
    //                         createAlbumCommit(albumId)            
                            
    //                         // Insert into notiifications
    //                         // sendMentionNotifications(guid, albumId, mentionedGuids);
    //                     }
    //                 });
    //             } else {
    //                 createAlbumCommit(albumId)            
    //             }
    //         });
    //     } else {
    //         createAlbumCommit(albumId)            
    //     }

    //     // if any hashtags, insert into background Worker
    //     // if any mentions of a username, get guid of username, and insert into mentions table


    //     // Insert into notifications, for each user mentioned, that a user mentioned them


    // }

    function updateAllHashTaggedWords(text) {

        


    }


    

        

    function isValidCharacters(txtTitle) {   
        return !invalidCharacters(txtTitle);
    }


    function getAllHashtagsFromText(text) {
        
        var filteredHashtags = [];
        var possibleHashtags = text.split(" ");

        possibleHashtags.forEach(function(word) {
            if (word.startsWith("#")) {
                let _word = word.substring(1);
                filteredHashtags.push(_word);                
                // if ( isValidCharacters(_word) ) {
                //     console.log('_word: ' + _word);
                //     filteredHashtags.push(_word);
                // }
            }
        });
        console.log('filteredHashtags: ' + filteredHashtags);
        
        return filteredHashtags;
        



    }


    function getAllMentionedUsers(text) {

        console.log('getAllMentionedUsers:');
        
        var filteredMentions = [];
        var possibleMentions = text.split(" ");

        possibleMentions.forEach(function(word) {
            if (word.startsWith("@")) {
                let _word = word.substring(1);
                if ( isValidCharacters(_word) ) {
                    console.log('_word: ' + _word);
                    filteredMentions.push(_word);
                } else {
                    console.log(' not valid word: ' + _word);
                }
            }
        });
        console.log('filteredMentions: ' + filteredMentions);
        
        return filteredMentions;
        

        // // find all mentions of any users        
        // var allMentions = possibleMentinos.filter(function(word){            
        //     if (word.startsWith("@")) {
        //         let _word = word.substring(1);
        //         if ( isValidCharacters(_word) ) {
        //             console.log('_word: ' + _word);
        //             return true;
        //         }
        //     }
        // });
        // console.log('allMentions: ' + allMentions);
        
        // return allMentions;
    }


    /**
     * 
     *  If user mentions someone. Do we have permission to notify them?
     *  1) Does user want notifications when they're mentioned?
     *  2) Does mentioned user have access to album? i.e.
     
     *      Get list a people mentioned
     *      
     *      See if they can see the comment, i.e. have access to the album
     * 
     *      If the user public and album public?  yes
     *      If user is public, but album private, does mentioned user have access? yes
     *      If  user is private and album public, is user follower? 
     *      If  user is private and album is private, does user have access?
     * 
     * 
     *      The ones that do, notify that they were mentioned
     * 
     *      
     
     *  3) 
     * 
     
        hasPermissionToComment
        ========================

        SELECT profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap 
        FROM profile 
            INNER JOIN user_album AS ua 
            ON profile.guid = ua.guid 
                LEFT JOIN friends 
                ON friends.guid2 = ua.guid AND friends.guid1 = ? AND friends.`status` = ? 
                    LEFT JOIN album_permissions AS ap 
                    ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id 
        WHERE ua.guid = ? AND ua.id = ?",




        hasPermissionToReplyToUserOfComment
        ========================

        SELECT ac.commenter_guid as guid, friends.status AS follow_status, friends.blocked AS is_blocked 
        FROM album_comments AS ac 
            LEFT JOIN friends 
            ON friends.guid1 = ? AND friends.guid2 = ac.commenter_guid 
        WHERE ac.guid = ? AND ac.album_id = ? AND ac.comment_id = ?";

        
             
        SELECT mentioned_profile.guid AS mentioned_profile_guid, profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap 
        FROM profile 
            INNER JOIN profile AS mentioned_profile 
            ON mentioned_profile.username in (?)
                INNER JOIN user_album AS ua 
                ON profile.guid = ua.guid 
                    LEFT JOIN friends 
                    ON friends.guid2 = ua.guid AND friends.guid1 = mentioned_profile.guid AND friends.`status` = ? 
                        LEFT JOIN album_permissions AS ap 
                        ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id 
        WHERE ua.guid = ? AND ua.id = ?",


        




    // does user have permission to mention
     * 
     */


    //  function insertMentionedUsernames() {

                
    //     var mentionRows = [];
    //     var mentionedGuids = [];
        
    //     results.forEach((result) => {
    //         mentionedGuids.push([ result.guid ]);
    //         mentionRows.push([ result.guid, guid, albumId, MentionType.AlbumTitle]);
    //     }); 

    //     // INSERT INTO `mentions` ( guid_mentioned, mentioned_by , mentioned_in, mention_type) 
    //     //     (SELECT guid, ?, ?, ?
    //     //     FROM profile 
    //     //     WHERE username in (?)
    //     //     )

    //     //     param = guid, albumId, MentionType.AlbumTitle
        

    //     connection.query({
    //         sql: 'INSERT INTO `mentions` ( guid_mentioned, mentioned_by , mentioned_in, mention_type) VALUES ?',
    //         values: [mentionRows] , 
    //     }, 
    //     function (err, results, fields) {

    //         console.log("query: " + query);

    //         if (err) {

    //             rollbackErrorResponse(err);
                
    //         } else {
                
    //             createAlbumCommit(albumId)            
                
    //             // Insert into notiifications
    //             // sendMentionNotifications(guid, albumId, mentionedGuids);
    //         }
    //     });

    // }



    
    function havePermissionToNotifyMentionedUser(ownerGuid, albumId, mentionerUsernameList, callbackPermissionToComment) {
        console.log('havePermissionToNotifyMentionedUser:');
        
        if (mentionerUsernameList.length == 0) {
            callbackPermissionToComment([]);                              
            return;
        }

 
        console.log('havePermissionToNotifyMentionedUser: ' + mentionerUsernameList);
        
    
    
        // SELECT mentioned_profile.guid AS mp_guid, profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap 
        // FROM profile 
        //     INNER JOIN profile AS mentioned_profile 
        //     ON mentioned_profile.username in (?) 
        //         INNER JOIN user_album AS ua 
        //         ON profile.guid = ua.guid 
        //             LEFT JOIN friends 
        //             ON friends.guid2 = ua.guid AND friends.guid1 = mentioned_profile.guid AND friends.`status` = ? 
        //                 LEFT JOIN album_permissions AS ap 
        //                 ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id 
        // WHERE ua.guid = ? AND ua.id = ?",

        
        connection.query({
            sql     : "SELECT mentioned_profile.guid AS mp_guid, profile.is_private AS user_is_private, ua.is_private AS album_is_private, ua.comments_on AS comments_on, friends.status AS follow_status, friends.blocked AS is_blocked, ap.guid AS has_ap FROM profile INNER JOIN profile AS mentioned_profile ON mentioned_profile.username in (?) INNER JOIN user_album AS ua ON profile.guid = ua.guid LEFT JOIN friends ON friends.guid2 = ua.guid AND friends.guid1 = mentioned_profile.guid AND friends.`status` = ? LEFT JOIN album_permissions AS ap ON ap.guid = friends.guid1 AND ap.fguid = profile.guid AND ap.album_id = ua.id WHERE ua.guid = ? AND ua.id = ?",
            values  : [mentionerUsernameList, Relationship.IsFollowing, ownerGuid, albumId]
        }, 
        function (err, results, fields) {

            console.log('results:', JSON.stringify(results, null, 2));
            
            if (err) {

                finalAppResponse(errorResponseGeneric(err));
                
            } else if (results && results.length > 0) {
                
                var users = [];

                results.forEach((result) => {
                

                    let guid                = result.mp_guid
                    let userIsPrivate       = intToBool(result.user_is_private);
                    let albumIsPrivate      = intToBool(result.album_is_private);
                    let followStatus        = result.follow_status
                    
                    let isBlocked           = intToBool(result.is_blocked);
                    
                    let hasAlbumPermission  = intToBool(result.has_ap)
                    let commentsOn          = intToBool(result.comments_on);
                    
                    

                    // public account - public album or private album, but user has permission
                    if (!userIsPrivate ) {

                        // public album and not blocked, or private and has permission
                        if  ( (!albumIsPrivate && !isBlocked) || hasAlbumPermission ) {

                            users.push(guid);
                        }
                        
                    // following privata acctount
                    } else if (userIsPrivate && followStatus === Relationship.IsFollowing) {

                            // public album, user is follower and not blocked
                        if ( (!albumIsPrivate && !isBlocked) || hasAlbumPermission) {

                            users.push(guid);                            
                            
                        } 
                    }
                });

                callbackPermissionToComment(users);                              
                
            }            
        });
    }
    
        

    

    //Replying to a comment
    function postReplyToComment(albumOwnerGuid, albumId, commentId, commenterGuid, comment ) {
        hasPermissionToComment(albumOwnerGuid, albumId, commenterGuid, function () {
            hasPermissionToReplyToUserOfComment(albumOwnerGuid, albumId, commentId, commenterGuid, function (commentOwnerGuid, wantsNotification) {
                console.log("hasPermissionToReplyToUserOfComment return: ");
                
                beginTransaction(function() { 
                    console.log("beginTransaction return: ");
                    
                    incrementCommentNumberorReplies(albumOwnerGuid, albumId, commentId, function(success) {

                    // updateNumberOfReplies('album_comments', albumOwnerGuid, albumId, null, commentId, function(success) {
                        
                        if (!success) {
                                rollbackErrorGenericMessage(null);
                        } else {
                            
                            insertReply( albumOwnerGuid, albumId, commenterGuid, comment, commentId, function(sucess) {

                                if (!success) {
                                    rollbackErrorGenericMessage(null);
                                } else {
                                 
                                    let allUserNames = getAllMentionedUsers(comment);
                                    
                                    console.log("allUserNames: " + allUserNames);
                                    console.log('allUserNames:', JSON.stringify(allUserNames, null, 2));
                                    
                                    lastCommentId(albumOwnerGuid, albumId, commenterGuid, function(lastCommentId) {
                                            
                                        havePermissionToNotifyMentionedUser(albumOwnerGuid, albumId, allUserNames, function (mentionedGuids) {
        
                                            sendMentionNotifications(commenterGuid, albumOwnerGuid, albumId, lastCommentId, mentionedGuids, NotificationType.MentionedInComment, function (error) {
                                                
                                                if (error && error !== null) {
                                                    rollbackErrorGenericMessage(null);
                                                }

                                                commitTransaction( function(success) {
                                                    if (success) {
                                                        if (wantsNotification && lastCommentId !== null) {
                                                            
                                                            sendNotification(commentOwnerGuid, commenterGuid, NotificationType.ReceivedReplyToComment, albumOwnerGuid, albumId, lastCommentId, function() {
                                                                
                                                                finalAppResponse( insertCommentResponse( lastCommentId.toString() ));                                                                       
                                                            });  

                                                        } else {
                                                            finalAppResponse( insertCommentResponse( null ));                                                
                                                            
                                                            // returnLastReplyId(albumOwnerGuid, albumId, commentId, commenterGuid);
                                                        }
                                                    } else {
                                                        rollbackAppError(ErrorMessageGeneric);
                                                    }
                                                });
                                            });
                                        });
                                    });

                                }
                            });
                        }
                    });
                });
            });
        });
    }

        //Replying to a reply
    // function postReplyToReply(albumOwnerGuid, albumId, parentId, replyId, commenterGuid, comment ) {
    //     hasPermissionToComment(albumOwnerGuid, albumId, commenterGuid, function () {
    //         hasPermissionToReplyToUserOfReply(albumOwnerGuid, albumId, parentId, replyId, commenterGuid, function (sentNotificationToGuid, wantsNotification) {
    //             beginTransaction(function() {
    //                 updateNumberOfReplies('album_comment_reply', albumOwnerGuid, albumId, parentId, replyId, function() {
    //                     connection.query({
    //                         sql     : "INSERT INTO album_comment_reply (guid, album_id, parent_id, comment_id, commenter_guid, comment) SELECT ?, ?, ?, coalesce(MAX(`comment_id`) + 1, 0), ?, ? FROM `album_comments` WHERE guid = ? AND album_id  = ?",
    //                         values  : [ albumOwnerGuid, albumId, parentId, commenterGuid, comment, albumOwnerGuid, albumId]
    //                     },
    //                     function (err, results, fields) {
    //                         console.log('Results:', JSON.stringify(results, null, 2));
                            
    //                         if (err) {
    //                             rollbackErrorGenericMessage(err);
    //                         } else if (results && results.affectedRows == 1) {

    //                             commitTransaction( function() {
    //                                 if (wantsNotification) {
    //                                     sendNotification(sentNotificationToGuid, commenterGuid, NotificationType.ReceivedReplyToComment, albumOwnerGuid, albumId, function() {
    //                                         returnLastReplyId(albumOwnerGuid, albumId, parentId, commenterGuid);
    //                                     });                                        
    //                                 } else {
    //                                     returnLastReplyId(albumOwnerGuid, albumId, parentId, commenterGuid);                                        
    //                                 }
    //                             });
    //                         } else {
    //                             rollbackErrorGenericMessage(null);
    //                         }
    //                     });
    //                 });
    //             });
    //         });
    //     });
    // }
    


    

    let kCommentId  = "commentId";
    let kComments   = "comments";
    let kComment    = "comment";
    let kParentId   = "parentId";
    let kReply      = "reply";


    
    function listCommentsResponse( comments) {
        var response = {};
        response[kActive]    = ActiveValues.Active;
        response[kComments]  = comments; 
        return response;
    }

    
    function insertCommentResponse( commentId) {
        var response = {};
        response[kActive]    = ActiveValues.Active;
        response[kCommentId]  = commentId; 
        return response;
    }


    function successfulResponse() {
        var response = {};
        response[kActive]   = ActiveValues.Active;
        response[kSuccess]  = true; 
        return response;
    }


    let kCommentsOn = "commentsOn";
    function commentsOnResponse(on) {
        var response = {};
        response[kActive]   = ActiveValues.Active;
        response[kCommentsOn]  = on; 
        return response;
    }


    /**
     * 
     * guid = person getting notification
     * fguid = person sending notification
     * albumOwner is the person that owns the album, uh duh!
     * 
     */

     
        // sendNotification(commentOwnerGuid, commenterGuid, NotificationType.ReceivedReplyToComment, albumOwnerGuid, albumId, function() {


        
            

            
    function sendNotification( notifiedGuid, friendGuid, notificationType, albumOwner, albumId, lastCommentId, callback) {
        console.log('sendNotification');
        console.log('sendNotification notifiedGuid: '  + notifiedGuid);
        console.log('sendNotification friendGuid: '  + friendGuid);
        console.log('sendNotification notificationType: '  + notificationType);
        console.log('sendNotification albumOwner: '  + albumOwner);
        console.log('sendNotification albumId: '  + albumId);
        console.log('sendNotification lastCommentId: '  + lastCommentId);
        

        connection.query({
            sql: "INSERT INTO `notifications`(`guid`, `id`, `fguid`, `type`, album_owner, `album_id`, `comment_id`) SELECT ?, coalesce(MAX(`id`) + 1, 0), ?, ?, ?, ?, ? FROM `notifications` WHERE guid = ?",
            values:  [ notifiedGuid, friendGuid, notificationType, albumOwner, albumId, lastCommentId, notifiedGuid]
        },
        function (err, results) {
            console.log('sendNotification Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                printError(err);
            }
            callback();
            
        });     
    }
    
    function beginTransaction(callbackBegin) {
        
        connection.beginTransaction(function(err) {
            if (err) {  
                rollbackErrorGenericMessage(err);
            } else {
                callbackBegin();
            }
        });
    }

    function commitTransaction( callback ) {
        console.log('commitTransaction');
        
        // Commit queries
        connection.commit(function(err) {
            if (err) {
                callback(false);
            } else  {
                console.log('successful commit!');
                callback(true);
            }
        });
    }


    function commitTransactionWithResponse() {
        console.log('commitTransaction');
        
        // Commit queries
        connection.commit(function(err) {
            if (err) {
                rollbackErrorGenericMessage(err);
            } else  {
                console.log('successful commit!');
                finalAppResponse(successfulResponse());
            }
        });
    }


    // tableName:  album_comments, user_album

    // updateNumberOfReplies('album_comments', albumOwnerGuid, albumId, parentId, commentId callback )
    function updateNumberOfReplies(tableName, albumOwnerGuid, albumId, parentId, commentId, callback) {
        console.log('updateNumberOfReplies');
        // rollbackErrorGenericMessage(err);  
        var sqlQuery = null;
        var parameters = null;
        
        var commentSql = "UPDATE ?? SET `number_of_replies` = `number_of_replies` + 1 WHERE `guid` = ? AND album_id = ? AND comment_id = ?";
        var replySql   = "UPDATE ?? SET `number_of_replies` = `number_of_replies` + 1 WHERE `guid` = ? AND album_id = ? AND parent_id = ? AND comment_id = ?";
        var albumSql   = "UPDATE ?? SET `number_of_replies` = `number_of_replies` + 1 WHERE `guid` = ? AND id = ?";


        if (tableName === 'album_comments') {
            sqlQuery = commentSql;
            parameters = [ 'album_comments', albumOwnerGuid, albumId, commentId ];
        } else if (tableName === 'user_album') {
            sqlQuery = albumSql;
            parameters = [ 'user_album', albumOwnerGuid, albumId ];
        } else { // for reply
            sqlQuery = replySql;            
            parameters = [ tableName, albumOwnerGuid, albumId, parentId, commentId ];
        }
        
        console.log('updateNumberOfReplies emm');
        
        connection.query({
            sql     : sqlQuery,
            values  : parameters,
            timeout: 3000, // 3s
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                callback(false);
            } else if (resultsIsDefined(results) && results.affectedRows == 1) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }




    function incrementAlbumNumberorReplies(albumOwnerGuid, albumId, callbackSuccess) {
        connection.query({
            sql     : "UPDATE `user_album` SET `number_of_replies` = `number_of_replies` + 1 WHERE `guid` = ? AND id = ?",
            values  : [  albumOwnerGuid, albumId ]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                callbackSuccess(false);
            } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                callbackSuccess(true);
            } else {
                callbackSuccess(false);
            }
        });
    }

    function decrementAlbumNumberorReplies(albumOwnerGuid, albumId, callbackSuccess) {
        connection.query({
            sql     : "UPDATE `user_album` SET `number_of_replies` = `number_of_replies` - 1 WHERE `guid` = ? AND id = ?",
            values  : [  albumOwnerGuid, albumId ]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                printError(err);

                // If number_of_replies == 0 and decrementing it to -1
                // if (err.code == "ER_DATA_OUT_OF_RANGE" ) {
                //     callbackSuccess(true);
                // } else {
                //     callbackSuccess(false);
                // }

                callbackSuccess(false);
            } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                callbackSuccess(true);
            } else {
                callbackSuccess(false);
            }
        });
    }




    function incrementCommentNumberorReplies(albumOwnerGuid, albumId, commentId,  callbackSuccess) {
        console.log('incrementCommentNumberorReplies albumOwnerGuid: ' + albumOwnerGuid);
        console.log('incrementCommentNumberorReplies albumId: ' + albumId);
        console.log('incrementCommentNumberorReplies commentId: ' + commentId);

        connection.query({
            sql     : "UPDATE `album_comments` SET `number_of_replies` = `number_of_replies` + 1 WHERE `guid` = ? AND album_id = ? AND comment_id = ? AND deleted = 0",
            values  : [  albumOwnerGuid, albumId, commentId ]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                callbackSuccess(false);
            } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                callbackSuccess(true);
            } else {
                callbackSuccess(false);
            }
        });
    }

    function decrementCommentNumberorReplies(albumOwnerGuid, albumId, commentId,  callbackSuccess) {

        connection.query({
            sql     : "UPDATE `album_comments` SET `number_of_replies` = `number_of_replies` - 1 WHERE `guid` = ? AND album_id = ? AND comment_id = ?",
            values  : [  albumOwnerGuid, albumId, commentId ]
        },
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (err) {
                callbackSuccess(false);
            } else if (resultsIsDefined(results) && results.affectedRows === 1) {
                callbackSuccess(true);
            } else {
                callbackSuccess(false);
            }
        });
    }





    function lastCommentId(guid, albumId, commenterGuid, callback ) {
        console.log('lastCommentId');
        
        connection.query({
            sql     : "SELECT comment_id FROM album_comments WHERE guid = ? AND album_id = ? AND commenter_guid = ? ORDER BY timestamp DESC LIMIT 1",
            values  : [ guid, albumId, commenterGuid]
        }, 
        function (err, results, fields) {
            console.log('Results:', JSON.stringify(results, null, 2));
            
            if (results !== undefined && results.length > 0) {
                callback( results[0].comment_id );
            } else {
                callback( null );
            }
        });
    }


    function returnLastCommentId(guid, albumId, commenterGuid ) {
        console.log('returnLastCommentId');
        
        lastCommentId(guid, albumId, commenterGuid, function(lastCommentId) {
            if (lastCommentId !== null) {
                finalAppResponse( insertCommentResponse( lastCommentId.toString() ));                        
            } else {
                finalAppResponse( insertCommentResponse( null ));                                                
            }
        });

        //     connection.query({
        //         sql     : "SELECT comment_id FROM album_comments WHERE guid = ? AND album_id = ? AND commenter_guid = ? ORDER BY timestamp DESC LIMIT 1",
        //         values  : [ guid, albumId, commenterGuid]
        //     }, 
        // function (err, results, fields) {
        //     console.log('Results:', JSON.stringify(results, null, 2));
            
        //     if (results !== undefined && results.length > 0) {
        //         finalAppResponse( insertCommentResponse( results[0].comment_id.toString() ));                        
        //     } else {
        //         finalAppResponse( insertCommentResponse( null ));                                                
        //     }
        // });
    }


    // function returnLastReplyId(albumOwnerGuid, albumId, parentId, commenterGuid ) {
    //     console.log('returnLastReplyId');
        
    //     connection.query({
    //         sql     : "SELECT comment_id FROM album_comments WHERE guid = ? AND album_id = ? AND parent_id  = ? AND commenter_guid = ? ORDER BY timestamp DESC LIMIT 1",
    //         values  : [ albumOwnerGuid, albumId, parentId, commenterGuid]
    //     }, 
    //     function (err, results, fields) {
    //         console.log('Results:', JSON.stringify(results, null, 2));
            
    //         if (results !== undefined && results.length > 0) {
    //             finalAppResponse( insertCommentResponse( results[0].comment_id.toString() ));                        
    //         } else {
    //             finalAppResponse( insertCommentResponse( null ));                                                
    //         }
    //     });
    // }
    

    
            
    
    function getNotificationCommentsFromResults(results) {
        
        console.log("getCommentsFromResults called indeed");
        
        var commentList = [];

        results.forEach((result) => {

            var comment = {};
            // comment[kOwnerGuid] = result.c_guid;
            // comment[kGuid]      = result.c_commenter_guid;


            console.log("getCommentsFromResults c_comment_id: " + result.c_comment_id);
            
            // This is the reply
            comment[kCommentId] = result.c_comment_id.toString();
            comment[kAlbumId]   = result.c_album_id;
            comment[kComment]   = result.c_comment;
            comment[kDate]      = result.c_timestamp.toString();
            comment[kCount]     = result.c_number_of_replies;
            
            
            if (result.c_guid !== undefined && result.c_guid !== null) {
                var profile = {};
                profile[kGuid]       = result.c_guid;   
                profile[kUserName]   = result.c_username;
                profile[kFullName]   = result.c_fullname;
                profile[kVerified]   = intToBool(result.c_verified);
                profile[kProfileUrl] = result.c_image_url;
                profile[kPrivate]    = result.c_is_private;
                profile[kAllowFollowersView]  = intToBool(result.c_allow_view_followers);
                profile[kAllowFollowingsView] = intToBool(result.c_allow_view_followings);
                
                var popularity            = result.c_popularity;
                profile[kFollowersCount]  = result.c_followers;
                profile[kFollowingCount]  = result.c_following;
                profile[kScore]           = popularity === null ? 0 : popularity;
                
                comment[kProfile] = profile;
            }
            
            

    
    // SELECT c.comment_id AS c_comment_id, c.comment AS c_comment, UNIX_TIMESTAMP(c.timestamp) AS c_timestamp, c.number_of_replies AS c_number_of_replies, c.last_reply_id AS c_last_reply_id, 
    //       p.parent_id AS p_parent_id, p.comment_id AS p_comment_id, p.commenter_guid AS p_commenter_guid, p.comment AS p_comment, UNIX_TIMESTAMP(p.timestamp) AS p_timestamp, p.number_of_replies AS p_number_of_replies 
    // FROM album_comments c 
    //     LEFT JOIN album_comments AS p 
    //     ON c.guid = p.guid AND c.album_id = p.album_id AND c.parent_id  = p.comment_id 
    // WHERE c.guid = ? AND c.album_id = ? AND c.comment_id = ?";


            // This is the main comment
            if ( result.p_comment_id !== undefined && result.p_comment_id !== null) {
                
                var parent = {};
                // reply[kParentId]  = result.r_parent_id;
                console.log("getCommentsFromResults r_parent_id: " + result.r_parent_id);
                
                parent[kCommentId] = result.p_comment_id.toString();
                parent[kGuid]      = result.p_commenter_guid;
                parent[kComment]   = result.p_comment;
                parent[kDate]      = result.p_timestamp.toString();
                parent[kCount]     = result.p_number_of_replies;
                
                comment[kParent] = parent;
            }
               
            commentList.push(comment);
        });
    
        return commentList;
    }



    let kParent = "parent";


    
    function getCommentsFromResults(results) {
        
        console.log("getCommentsFromResults called indeed");
        
        var commentList = [];

        results.forEach((result) => {

            var comment = {};
            // comment[kOwnerGuid] = result.c_guid;
            // comment[kGuid]      = result.c_commenter_guid;


            console.log("getCommentsFromResults c_comment_id: " + result.c_comment_id);
            
            comment[kCommentId] = result.c_comment_id.toString();
            comment[kAlbumId]   = result.c_album_id;
            comment[kComment]   = result.c_deleted === 0 ? result.c_comment: null;
            comment[kDate]      = result.c_timestamp.toString();
            comment[kCount]     = result.c_number_of_replies;
            
            
            if (result.c_guid !== undefined && result.c_guid !== null) {
                var profile = {};
                profile[kGuid]       = result.c_guid;   
                profile[kUserName]   = result.c_username;
                profile[kFullName]   = result.c_fullname;
                profile[kVerified]   = intToBool(result.c_verified);
                profile[kProfileUrl] = result.c_image_url;
                profile[kPrivate]    = result.c_is_private;
                profile[kAllowFollowersView]  = intToBool(result.c_allow_view_followers);
                profile[kAllowFollowingsView] = intToBool(result.c_allow_view_followings);
                
                var popularity            = result.c_popularity;
                profile[kFollowersCount]  = result.c_followers;
                profile[kFollowingCount]  = result.c_following;
                profile[kScore]           = popularity === null ? 0 : popularity;
                
                comment[kProfile] = profile;
            }
            
            if ( result.c_last_reply_id !== undefined && result.c_last_reply_id !== null) {
                

                

                var reply = {};
                // reply[kParentId]  = result.r_parent_id;
                console.log("getCommentsFromResults r_comment_id: " + result.r_comment_id);
                
                reply[kCommentId] = result.r_comment_id.toString();
                // reply[kGuid]      = result.r_commenter_guid;
                reply[kComment]   = result.r_comment;
                reply[kDate]      = result.r_timestamp.toString();
                reply[kCount]     = result.r_number_of_replies;
                

                var profile = {};
                profile[kGuid]       = result.r_guid;   
                profile[kUserName]   = result.r_username;
                profile[kFullName]   = result.r_fullname;
                profile[kVerified]   = intToBool(result.r_verified);
                profile[kProfileUrl] = result.r_image_url;
                profile[kPrivate]    = result.r_is_private;

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






    /**
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     *  
     *                      Album Utility functions
     *                           - getAlbumOpinion
     *                           - updateAlbumLikes
     *                           - flagMediaInAlbum
     *                                   Flag album 
     * 
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     */



    var AlbumLike = {
        none           : 0,
        liked          : 1,
        disliked       : 2
    };

    function getAlbumOpinion(guid, fguid, albumId, newOpinion) {
        console.log("getAlbumOpinion");

        // var sqlStmt;
        // if (newOpinion === AlbumLike.liked ) {
            
        //     sqlStmt = "UPDATE `user_album` AS ua LEFT JOIN user_album_likes AS ual ON ual.guid = ? AND ual.fguid = ? AND ual.album_id = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id SET `likes` = if(liked is NULL OR liked = 2, `likes` + 1, `likes` ), `dislikes` = if(liked = 2, `dislikes` - 1, `dislikes` )";
            
        // } else if (newOpinion === AlbumLike.disliked ) {
            
        //     sqlStmt = "UPDATE `user_album` AS ua LEFT JOIN user_album_likes AS ual ON ual.guid = ? AND ual.fguid = ? AND ual.album_id = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id SET `dislikes` = if(liked is NULL OR liked = 1, `dislikes` + 1, `dislikes` ), `likes` = if(liked = 1, `likes` - 1, `likes` )";
        
        // } else if (newOpinion === AlbumLike.none ) {
            
        //     sqlStmt = "UPDATE `user_album` AS ua LEFT JOIN user_album_likes AS ual ON ual.guid = ? AND ual.fguid = ? AND ual.album_id = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id SET `dislikes` = if(liked = 2, `dislikes` - 1, `dislikes` ), `likes` = if(liked = 1, `likes` - 1, `likes` )";
        // } else {
        //     finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
        //     return;
        // }

        // updateAlbumLikes(guid, fguid, albumId, newOpinion, sqlStmt);
        // return;


        // Get any previous opinion I have of this album
        connection.query({
            sql: 'SELECT `liked` FROM `user_album_likes` WHERE guid = ? AND fguid = ? AND album_id = ?',
            values: [ guid, fguid, albumId ], 
        },
        function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
            } else if (results) {
                
                
                // If I have an opinion
                if (results.length > 0) {
                    console.log("getAlbumOpinion results.length > 0");

                    let previousOpinion = results[0].liked;
                    
                    console.log("getAlbumOpinion previousOpinion: " + previousOpinion);
                    

                    // If we liked before
                    if ( previousOpinion === AlbumLike.liked ) {
                        
                        // If we before liked, but now don't
                        if (newOpinion === AlbumLike.none ){

                            var sqlStmt = "UPDATE `user_album` SET `likes` = `likes` - 1 WHERE `guid` = ? AND id = ?";
                            updateAlbumLikes(guid, fguid, albumId, previousOpinion, newOpinion, sqlStmt);

                        // If we before liked, but now dislike
                        } else if (newOpinion === AlbumLike.disliked ) {

                            var sqlStmt = "UPDATE `user_album` SET `likes` = `likes` - 1, `dislikes` = `dislikes` + 1 WHERE `guid` = ? AND id = ?";
                            updateAlbumLikes(guid, fguid, albumId, previousOpinion, newOpinion, sqlStmt);

                        // Do nothing
                        } else if (newOpinion === AlbumLike.liked ) { 
                            finalAppResponse( updateViewResponse(true));
                        } else {
                            finalAppResponse( updateViewResponse(true));
                        }

                        // If we before disliked
                    } else if ( previousOpinion === AlbumLike.disliked ) {

                        // If we before disliked, but now don't
                        if (newOpinion === AlbumLike.none ){

                            var sqlStmt = "UPDATE `user_album` SET `dislikes` = `dislikes` - 1 WHERE `guid` = ? AND id = ?";
                            updateAlbumLikes(guid, fguid, albumId, previousOpinion, newOpinion, sqlStmt);

                            // If we before disliked, but now like
                        } else if (newOpinion === AlbumLike.liked ) {
                            
                            var sqlStmt = "UPDATE `user_album` SET `likes` = `likes` + 1, `dislikes` = `dislikes` - 1 WHERE `guid` = ? AND id = ?";
                            updateAlbumLikes(guid, fguid, albumId, previousOpinion, newOpinion, sqlStmt);

                        } else if (newOpinion === AlbumLike.disliked ) {
                            finalAppResponse( updateViewResponse(true));
                        // Do nothing
                        } else {
                            finalAppResponse( updateViewResponse(true));
                        }

                    } else {
                        finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
                    }
                } else {
                    console.log("getAlbumOpinion no results");

                    // Previous opinion doesn't exist
                    // We like                        
                    if (newOpinion === AlbumLike.liked ) {
                        var sqlStmt = "UPDATE `user_album` SET `likes` = `likes` + 1 WHERE `guid` = ? AND id = ?";
                        updateAlbumLikes(guid, fguid, albumId, null, newOpinion, sqlStmt);

                    // We dislike
                    } else if (newOpinion === AlbumLike.disliked ) {
                        var sqlStmt = "UPDATE `user_album` SET `dislikes` = `dislikes` + 1 WHERE `guid` = ? AND id = ?";
                        updateAlbumLikes(guid, fguid, albumId, null, newOpinion, sqlStmt);

                    } else {
                        //Do nothing
                        finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
                    }
                }
            } else {
                printError(error);
                finalAppResponse( activeResponse( ActiveValues.Active, ErrorMessageGeneric));
            }
        });
    }



    /**
     * 
     * 
     * @param {*} guid 
     * @param {*} fguid 
     * @param {*} albumId 
     * @param {AlbumLike} newOpinion 
     * @param {*} sqlStmt 
     * 
     * 
     *  1) Update user_album.likes/dislikes. sqlStmt from getAlbumOpinion()
     *  2) Update user_album_likes
     *  3) Update user_metrics.total_likes
     * 
     */
    
    function updateAlbumLikes(guid, fguid, albumId, previousOpinion, newOpinion, sqlStmt) {
        console.log("updateAlbumLikes");
        connection.beginTransaction(function(err) {
            if (err) { 
                printError(error);
                rollbackAppError(ErrorMessageGeneric);
            } else { 
                connection.query({
                    sql   : sqlStmt,
                    values: [ fguid, albumId ]
                }, function (err, results) {
                    if (err) {
                        printError(err);
                        finalAppResponse( updateViewResponse(false));
                    } else {

                        console.log("updateAlbumLikes next");

                        var sql;
                        var parameters;

                        // User save their like/dislike of an album
                        if ( newOpinion === AlbumLike.liked || newOpinion === AlbumLike.disliked ) {
                            sql = 'INSERT INTO user_album_likes SET `guid` = ?, `fguid` = ?, `album_id` = ?, `liked` = ? ON DUPLICATE KEY UPDATE liked=VALUES(liked)';
                            parameters = [guid, fguid, albumId, newOpinion ];
                        } else {
                            sql = 'DELETE FROM user_album_likes WHERE `guid` = ? AND `fguid` = ? AND `album_id` = ?';
                            parameters = [guid, fguid, albumId ];
                        }

                        connection.query({
                            sql   : sql,
                            values: parameters, 
                        }, function (err, results) {
                            if (err) {
                                printError(err);
                                rollbackAppError(ErrorMessageGeneric);
                            } else {
                                // Commit queries
                                console.log("updateAlbumLikes commit");
                                connection.commit(function(err) {
                                    var didUpdate = false;
                                    if (err) {
                                        printError(err);
                                        rollbackAppError(ErrorMessageGeneric);
                                    } else  {
                                        console.log('successful commit!');
                                        didUpdate = true;
                                    }
                                    // update user_metrics likes or dislikes


                                    var sql;
                                    
                                    if (previousOpinion === AlbumLike.none) {
                                        if (newOpinion === AlbumLike.liked) {
                                            sql = 'INSERT INTO `user_metrics` (guid, total_likes) VALUES (?, 1) ON DUPLICATE KEY UPDATE total_likes=total_likes + 1';
                                        // newOpinion = disliked
                                        } else {
                                            sql = 'INSERT INTO `user_metrics` (guid, total_dislikes) VALUES (?, 1) ON DUPLICATE KEY UPDATE total_dislikes=total_dislikes + 1';
                                        }

                                    } else if (previousOpinion === AlbumLike.liked) {
                                    
                                        if (newOpinion === AlbumLike.none) {
                                        
                                            sql = 'INSERT INTO `user_metrics` (guid, total_likes) VALUES (?, -1) ON DUPLICATE KEY UPDATE total_likes=total_likes - 1';

                                        // inc disliked, dec liked
                                        } else {
                                            sql = 'INSERT INTO `user_metrics` (guid, total_likes, total_dislikes) VALUES (?, -1, 1) ON DUPLICATE KEY UPDATE total_likes=total_likes - 1, total_dislikes=total_dislikes + 1';
                                        }
                                    // previousOpinion === disliked
                                    } else {
                                        if (newOpinion === AlbumLike.none) {
                                            sql = 'INSERT INTO `user_metrics` (guid, total_dislikes) VALUES (?, -1) ON DUPLICATE KEY UPDATE total_dislikes=total_dislikes - 1';
                                        // inc liked, dec disliked
                                        } else {
                                            sql = 'INSERT INTO `user_metrics` (guid, total_likes, total_dislikes) VALUES (?, 1, -1) ON DUPLICATE KEY UPDATE total_likes=total_likes + 1, total_dislikes=total_dislikes - 1';
                                        }
                                    }
    
                                    connection.query({
                                        sql: sql,
                                        values: [ fguid ]
                                    }, function (err, results) {
                                        if (err) {
                                            printError(err);
                                        } else {
                                            console.log('successful insert user_metrics');
                                        }

                                        finalAppResponse( updateViewResponse(didUpdate));
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }



/**
 * 
 * 
 * album_view_history - Records every time a user opens an album
 * guid, fguid, albumId, dateViewed
 * 
 * Idx: (fguid, albumId, dateViewed) -> Creater gets total number of views for album, or breaks down views by albumId
//  *      - This is equivalent to user_album.views
//  * Idx: (fguid, dateViewed, albumId) -> Creater gets total number of views for album
 * 
 *  1) album_view_history
 *  2) user_album.views
 *  3) user_metrics.total_album_views
 * 
 * 
 * 
 * 
 * // Update this for every last_album_viewed inserted
 * media_view_history - Records all media content watched, 
 * guid, fguid, albumId, mediaUrl dateViewed
 * 
 * 
 * 
 *  user_album - Stores the number of views and likes of this album
 *  views, likes, dislikes
 * 
 *  1) user_album_likes
 *  1) user_album.likes
 *  2) user_metrics.total_likes
 * 
 * 
 * 
 *  user_album_likes         -  Stores albums the user likes 
 *  guid, fguid, album_id, liked  -> liked or disliked
 * 
 * 
 *  IDX: user_album.likes ==  COUNT(user_album_likes.fguid, user_album_likes.album_id, user_album_likes.liked = liked)
 * 
 * 
 *  //TODO did not do yet
 *  user_media_loves         -  Stores media the user likes 
 *  guid, fguid, album_id, media_url  -> Can only be hearted or not
 * 
 * 
 * 
 * profile -
 * 
 * popularity refers  ->  user_metrics.popularity
 * followers refers  ->  user_metrics.followers_count
 * followings refers ->  user_metrics.followings_count
 * 
 * 
 * 
 * At some point we need to: 
 *                                     
 * SELECT popularity, total_album_views
 * FROM `user_metrics` 
 * WHERE guid = ?
 * 
 * var threshold = 100;
 * 
 * if total_album_views === threshold {
 *   insert into cron_job
 * }
 * IF POPularity = 1000  {
 * insert into cron_job
 * }
 *  total_album_views=total_album_views + 1",

 * 
 * 
 * 
 * 
 *  user_metrics
 *                              popularity (sum of all),  
 *                              followers_count -> , 
 *                              followings_count -> , 
  
 *                              total_profile_views -> , 
 *                              total_album_views   -> (sum of user_album.views) or (sum of COUNT(album_view_history(fguid, albumId))
 *                              total_likes         -> (sum of user_album.likes + sum of user_album.dislikes), 
 *                              total_dislikes         -> (sum of user_album.likes + sum of user_album.dislikes), 
 *                              total_loves         -> (sum of user_media_loves)
 * 
 * 
 * usersearch - 
 * popularity -> refers to  user_metrics.popularity
 * 
 * 
 * 
 * 

    INSERT INTO `user_metrics` (guid, total_album_views) VALUES (?, ?) 
    ON DUPLICATE KEY 
    UPDATE total_album_views=total_album_views + 1",
    
    values: [[ guid, 1 ]]

 */


    
    let INTERVAL_USER_HISTORY_LIMIT = 1;

    /**
     *  Insert what album the user has viewed into their history
     * 
     *  1) Insert info into album view history
     *  2) Increase album view count
     *  3) Increase user's total view count
     * 
     *  Transaction not rally needed
     * 
     */
    function updateAlbumViewCount(guid, fguid, albumId) {
        
        console.log("updateAlbumViewCount");
        
        // Insert users view history.  (Can be unlimited number of times)
        connection.query({
            sql: 'INSERT INTO album_view_history SET `guid` = ?, `fguid` = ?, `album_id` = ?',
            values: [guid, fguid, albumId ]
        }, function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( updateViewResponse(false));
            } else {
                // Get total uesr views in past 24 hours
                connection.query({
                    sql: 'SELECT COUNT(*) AS user_views FROM `album_view_history` WHERE `guid` = ? AND `fguid` = ? AND `album_id` = ? AND date > NOW() - INTERVAL 1 HOUR', 
                    values: [guid, fguid, albumId ],
                    timeout: 200 // 0.2s
                }, function (err, results) {
                    if (err) {
                        printError(err);
                        finalAppResponse( updateViewResponse(false));
                    } else if (results && results.length > 0) {

                        console.log("updateAlbumViewCount count = " + results[0].user_views);
                        if (results[0].user_views > 5) {

                            console.log("updateAlbumViewCount: View count not updated");

                            //TODO: Notify engineers about potential view manipulater
                            finalAppResponse( updateViewResponse(false));

                        }  else {
                            console.log("updateAlbumViewCount: View count will be updated");

                            var didUpdate = false;

                            connection.query({
                                sql: "UPDATE `user_album` SET `views` = `views` + 1 WHERE `guid` = ? AND id = ?",
                                values: [ fguid, albumId ],
                                timeout: 200 // 0.2s
                            }, function (err, results) {
                                if (err) {
                                    printError(err);
                                    didUpdate = false;
                                    // finalAppResponse( updateViewResponse(false));
                                } else {
                                    console.log("updateAlbumViewCount updating user view count");
                                    didUpdate = true;
                                    // finalAppResponse( updateViewResponse(true));
                                }

                                connection.query({
                                    // sql = 'INSERT INTO user_album_likes SET `guid` = ?, `fguid` = ?, `album_id` = ?, `liked` = ? ON DUPLICATE KEY UPDATE liked=VALUES(liked)';
                                    sql: "INSERT INTO `user_metrics` SET guid = ?, total_album_views = ? ON DUPLICATE KEY UPDATE total_album_views=total_album_views + 1",
                                    values: [guid, 1 ], 
                                    timeout: 200 // 0.2s
                                }, function (err, results) {
                                    if (err) {
                                        printError(err);
                                    } else {
                                        console.log("updateAlbumViewCount updating user view count");
                                    }
                                    finalAppResponse( updateViewResponse(didUpdate));
                                }); 
                            });
                            
                        }
                    } else {
                        // Something went wrong
                        console.log("updateAlbumViewCount: Something went wrong");
                        finalAppResponse( updateViewResponse(false));
                    }
                });
            }
        });
    }


    /**
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     *  
     * 
     *                              Album Utility functions
     * 
     * 
     *                                   Flag media/album 
     * 
     * 
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     * ==========================================================================================
     */



    var MediaFlag = {
        Spam        : 0,
        Abuse       : 1,
        Other       : 2    
    };

// Do we want to unflag? 
    // type:  0
    function flagMediaInAlbum(guid, fGuid, albumId, mediaId, type) {
         connection.query({
            sql: "INSERT INTO `flagged_media` SET guid=?, flagger_guid=?, album_id=?, media_id=?, type=?",
            values: [ guid, fguid, albumId, mediaId, type ]
        }, function (err, results) {
            if (err) {
                printError(err);

                if (err.code == "ER_DUP_ENTRY" ) {
                    finalAppResponse( bookmarkResponse(true));
                } else {
                    finalAppResponse( errorResponse( ErrorMessageGeneric));
                }
            } else {
                console.log("updateAlbumViewCount updating user view count");
                finalAppResponse( bookmarkResponse(true));
            }
        }); 
    }



    function bookmarkAlbum(guid, fguid, albumId) {
        console.log("bookmarkAlbum");

        connection.query({
            sql: "INSERT INTO `bookmarked_album` SET guid=?, fguid=?, album_id=? ",
            values: [ guid, fguid, albumId ]
        }, function (err, results) {
            if (err) {
                printError(err);

                if (err.code == "ER_DUP_ENTRY" ) {
                    finalAppResponse( bookmarkResponse(true));
                } else {
                    finalAppResponse( errorResponse( ErrorMessageGeneric));
                }
            } else {
                console.log("updateAlbumViewCount updating user view count");
                finalAppResponse( bookmarkResponse(true));
            }
        }); 
    }



    function unbookmarkAlbum(guid, fguid, albumId) {
        console.log("unbookmarkAlbum");
        connection.query({
            sql: "DELETE FROM `bookmarked_album` WHERE guid=? AND fguid=? AND album_id=? ",
            values: [ guid, fguid, albumId ]
        }, function (err, results) {
            if (err) {
                printError(err);
                finalAppResponse( errorResponse( ErrorMessageGeneric));
            } else {
                console.log("updateAlbumViewCount updating user view count");
                finalAppResponse( bookmarkResponse(false));
            }
        }); 
    }












    function intToBool(val) {
        if (!isInt(val) ) return false;
        return val === 0 ? false : true;
    }
         
    function isBoolean(val) {
        return typeof(val) === "boolean";
    }


    function isArrayWithObjects(val) {
                                        // if ( followersAddList === undefined || followersAddList === null || followersAddList.length === 0) {
        return  Object.prototype.toString.call( val ) === '[object Array]' && val.length > 0
    }

    function isArray(val) {
                                        // if ( followersAddList === undefined || followersAddList === null || followersAddList.length === 0) {
        return  Object.prototype.toString.call( val ) === '[object Array]'
    }


    function sanitizeStringArray(list) {

        if ( isArrayWithObjects(list) ) {
            
            var sanitizedList = [];
        
            list.forEach((item) => {
                if (isStringWithLength(item)) {
                    sanitizedList.push(item);
                }
            });

            if (sanitizedList.length > 0) {
                return sanitizedList;
            } else {
                return null;
            }
        }
        
        return null;
    }


    function getConfirmedFollowerGuids(guid, followersAddList, callback) {
    
        console.log("getConfirmedFollowerGuids");

        var queryFriendsSql = 'SELECT `guid1` as guid FROM `friends` WHERE `guid2` = ? AND `guid1` IN (?) AND `status` = ?';

        connection.query({
            sql: queryFriendsSql,
            values: [ guid, followersAddList, Relationship.IsFollowing ], 
        }, 
        function (err, results) {
            callback(err, results);
        });
    }

    function getQualifiedFollowerGuids(guid, followersAddList, callback) {
        
            console.log("getQualifiedFollowerGuids");
    
            var queryFriendsSql = 'SELECT `guid1` as guid FROM `friends` WHERE `guid2` = ? AND `guid1` IN (?) AND `status` = ?';
    
            connection.query({
                sql: queryFriendsSql,
                values: [ guid, followersAddList, Relationship.IsFollowing ], 
            }, 
            function (err, results) {
                callback(err, results);
            });
        }



    function queryLoggedInUser() {
        console.log("queryLoggedInUser");
        
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

                // list my albums // AWSLambdaOpenAlbum
                if ( pathParams.localeCompare("/albums/private/me" ) === 0 ) {
                    

                    if ( isInt(numberOfAlbums) ) {
                        if (numberOfAlbums < 0 || numberOfAlbums > MAX_NUM_OF_ALBUMS ) {
                            numberOfAlbums = MAX_NUM_OF_ALBUMS;
                        }
                    } else {
                        numberOfAlbums = MAX_NUM_OF_ALBUMS;
                    }

                    if ( action.localeCompare("ListMyAlbum" ) == 0 ) {

                        listMyAlbums( guid );
                    }

                    else if ( action.localeCompare("ListMyOpenAlbum" ) == 0 ) {

                        listMyOpenAlbums( guid );
                    }

                    else if ( action.localeCompare("ListMyBookmarkedAlbum" ) == 0 ) {

                        listMyBookmarkedAlbums( guid );
                    }


                // open my album/ Get media content
                // } else if ( pathParams.localeCompare("/albums/private/me/album" ) == 0 ) {

                    else if ( action.localeCompare("OpenMyAlbum" ) == 0 ) {
                        getMyMediaContent(guid);
                    }     


                    // create new album
                    else if ( action.localeCompare("CreateNewAlbum" ) == 0) {




                        if ( !isStringWithLength(title)) {
                            finalAppResponse( activeResponse( ActiveValues.Active, "Need a title for this album"));
                            return;
                        }
                        

                        console.log("title: " + title  );
                        console.log("Titke length: " +  stringz.length(title)  ); 

                        if ( stringz.length(title) > 100) {
                        // if ( title.length > 100) {
                            finalAppResponse( activeResponse( ActiveValues.Active, "Title needs to be less than 100 characters"));
                            return;
                        }


                        // if ( !validator.isBase64(title) ) { 
                        //     console.log("Title is not base64: " + title);
                            
                        
                        //     title = newTitle;
                        //     // finalAppResponse( activeResponse( ActiveValues.Active, "Title is not base64 encoded"));
                        //     // return;
                        // }


                        // Requestbody parameters
                        var isGroupAlbumParam                = requestBody[kIsGroupAlbum];
                        var isAllSelectedForGroupAlbumParam  = requestBody[kIsAllSelectedForGroupAlbum];
                        
                        // Either empty or array of guids
                        var groupSelectedFollowersParam      = requestBody[kGroupSelectedFollowers];
                        

                        
                        var isGroupAlbum                = false;
                        var isAllSelectedForGroupAlbum  = false;
                        var sanitizedGroupPosters       = null;


                        if ( isBoolean(isGroupAlbumParam) && isGroupAlbumParam) {
                            
                            isGroupAlbum = true;
                            if ( isBoolean(isAllSelectedForGroupAlbumParam) && isAllSelectedForGroupAlbumParam) {
                                isAllSelectedForGroupAlbum = true;

                            } else {

                                sanitizedGroupPosters = sanitizeStringArray(groupSelectedFollowersParam);

                                if (sanitizedGroupPosters === null ) {
                                    isGroupAlbum = false;

                                //   finalAppResponse( activeResponse(ActiveValues.Active, "Select followers to view album" ));
                                }
                            }
                        }


                        var groupPostersDict = {};
                        groupPostersDict[kIsGroupAlbum]               = isGroupAlbum;
                        groupPostersDict[kIsAllSelectedForGroupAlbum] = isAllSelectedForGroupAlbum;
                        groupPostersDict[kGroupSelectedFollowers]     = sanitizedGroupPosters;

                        // TODO: Finish setting up groupPostersDict

                        /**
                         *  1) Add the values to tables
                         *  2) Add all group posters to group_poster table
                         * 
                         * For all other posters
                         *  3) Add new query for user to get all albums he can post to for group
                         *  4) When a user posts to album, we need to check he has permission and then  
                         */


                        if (isPrivate) { 

                            if ( !isInt(daysTillExpire) ) {
                                daysTillExpire = null;
                                // finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            } else if (daysTillExpire < 2 || daysTillExpire > 7) {
                                daysTillExpire = 7 ; // finalAppResponse( activeResponse(ActiveValues.Active, "Days to" ));
                            }


                            var sanitizedFollowersAddList    = sanitizeStringArray(followersAddList);

                            if (sanitizedFollowersAddList === null ) {
                                finalAppResponse( activeResponse(ActiveValues.Active, "Select followers to view album" ));
                            } else {
                                prepareFollowersForCreatePrivateAlbum(guid, daysTillExpire, sanitizedFollowersAddList, groupPostersDict );
                                // getIncludedFriends(guid, daysTillExpire, sanitizedFollowersAddList);
                            }


                            // if ( isSubmittingToAll ) {
                            //     getFriendsNotIncluded(guid);
                            // } else {
                            //     getIncludedFriends(guid);
                            // }     

                        // Public album
                        } else {

                            if ( !isInt(daysTillExpire) ) {
                                daysTillExpire = null;
                                // finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            } else if (daysTillExpire < 2 || daysTillExpire > 7) {
                                daysTillExpire = 7 ; // finalAppResponse( activeResponse(ActiveValues.Active, "Days to" ));
                            }
                            
                            createPublicAlbum(guid, daysTillExpire, groupPostersDict);
                        }              
                    }
                    // delete album
                    else if ( action.localeCompare("DeleteAlbum" )  == 0) {
                        
                        console.log("will Delete album");
                        connection.beginTransaction(function(err) {
                            if (err) { 
                                printError(error);
                                rollbackAppError(ErrorMessageGeneric);
                            } else { 
                                selectAllMediaToDeleteFromAlbum(guid, albumId);
                            }
                        });
                    }
                    // update album
                    else if ( action.localeCompare("UpdateTitle" ) == 0) {
                        console.log("UpdateAction.Title");
                        updateTitle(guid, albumId, title);        
                    }  
                    else if ( action.localeCompare("UpdateACL" ) == 0) {
                        console.log("UpdateAction.UpdateACL");
                         
                        if ( isBoolean(isPrivate) && isPrivate && isStringWithLength(albumId) ) {

                            var sanitizedFollowersAddList    = sanitizeStringArray(followersAddList);

                            var sanitizedfollowersDeleteList = sanitizeStringArray(followersDeleteList);


                            if (sanitizedFollowersAddList === null && sanitizedfollowersDeleteList === null) {
                                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            } else {
                                updateACL(guid, sanitizedFollowersAddList, sanitizedfollowersDeleteList);        
                            }
                        } else {
                            finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                        }
                    } 

                    else if ( action.localeCompare("ChangeAlbumPrivacy" ) == 0) {
                        console.log("UpdateAction.UpdatePrivacy");
                        
                        if ( isBoolean(isPrivate) && isStringWithLength(albumId) ) {
                         
                            if (isPrivate) {
                                         
                                var sanitizedFollowersAddList = sanitizeStringArray(followersAddList);
                                
                                if (sanitizedFollowersAddList === null) {
                                    finalAppResponse( activeResponse(ActiveValues.Active, "Select followers to add" ));
                                } else {
                                    changeAlbumToPrivateWithACL(guid, albumId, followersAddList );
                                }
                                

                            } else {

                                changeAlbumToPublic(guid, albumId );
                            }
                        } else {
                            finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                        }
                    } 

                    // list my album ACL
                    else if ( action.localeCompare("ListACL" ) == 0) {
                        
                        getACLList(guid);
                    } 

 
                    // Upload media to my album
                    else if ( action.localeCompare("UploadMedia") == 0) {

                    /*
                        After user creates album, whenever user uploads new content, 
                        1) get if album is public or private
                        2) If public, get all followers. If private, get selected users
                        3) INSERT INTO timeline SET guid = ?, fguid = ?, album_id = ? ON DUPLICATE KEY UPDATE date=VALUES(date)';
                        
                    ON delete content: update date to last media date,
                    On delete album, delete from timeline
                
                    */ 

                        beginMediaUpload(guid);

                    } 

                    // Delete Media from my album
                    else if ( action.localeCompare("DeleteMedia" ) == 0) {
                        
                        var mediaUrl    = requestBody[kMediaURL];

                        
                        startDeleteMediaTransaction(guid, albumId, mediaUrl);

                    } // Delete Media from my album

                    // // Delete Media from my album
                    // else if ( action.localeCompare("DeleteMultipleMedia" ) == 0) {
                        
                    //     // array of links to delete
                    //     var mediaUrl    = requestBody[kMediaURL];


                    //     startDeleteMediaTransaction(guid, albumId, mediaUrl);

                    // } // Delete Media from my album

                    else if ( action.localeCompare("EnableComments" ) === 0) {
                        
                        var turnOn = requestBody[kCommentsOn];

                        if (!isBoolean(turnOn)) {
                            finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            return;
                        }
                        
                        if ( guid.localeCompare(requestBody[kGuid] ) !== 0) {
                            finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            return;
                        }

                        turnOn = turnOn ? 1 : 0;
                        toggleCommentsOnForAlbum(guid, albumId, turnOn)


                    } else {
                        finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                    } 

                // Friends functions

                } else if ( pathParams.localeCompare("/albums/private/friends" ) == 0 ) {

                    console.log('User exists, in /albums/private/friends');


                  // list friends albums
                    if ( action.localeCompare("ListFriendsAlbums" ) == 0) {
                        if ( isInt(numberOfAlbums) ) {
                            if (numberOfAlbums < 0 || numberOfAlbums > MAX_NUM_OF_ALBUMS ) {
                                numberOfAlbums = MAX_NUM_OF_ALBUMS;
                            }
                        } else {
                            numberOfAlbums = MAX_NUM_OF_ALBUMS;
                        }
                        listFollowingAlbums( guid , numberOfAlbums);
                    
                    // Get media content for public album
                    } else if ( action.localeCompare(kOpenPublicAlbum ) == 0) {

                        console.log("kOpenPublicAlbum");


                        if ( isInt(numberOfAlbums) ) {
                            if (numberOfAlbums < 0 || numberOfAlbums > MAX_NUM_OF_CONTENT ) {
                                numberOfAlbums = MAX_NUM_OF_CONTENT;
                            }
                        } else {
                            numberOfAlbums = MAX_NUM_OF_CONTENT;
                        }

                        if (typeof(startingWithNewMedia) === "boolean" && startingWithNewMedia === true) { 
                            getPublicMediaContentWithNewContent(guid, fguid, albumId, numberOfAlbums);
                            
                        } else {
                            getPublicMediaContent(fguid, albumId, numberOfAlbums);                            
                        }
                    
                    // Updates the last content viewed of friend's album
                    } else if ( action.localeCompare(kOpenPrivateAlbum) == 0) {

                        if ( isInt(numberOfAlbums) ) {
                            if (numberOfAlbums < 0 || numberOfAlbums > MAX_NUM_OF_ALBUMS ) {
                                numberOfAlbums = MAX_NUM_OF_ALBUMS;
                            }
                        } else {
                            numberOfAlbums = MAX_NUM_OF_ALBUMS;
                        }
                            // Get private album start from newestItems

                        if (typeof(startingWithNewMedia) === "boolean" && startingWithNewMedia === true) { 
                                      
                            getPrivateFolloweringUnseenMediaContent(guid, fguid, albumId, numberOfAlbums );
                            
                        } else if (typeof(getPreviousItems) === "boolean" && getPreviousItems === true) { 
                       
                            // Get private album get older media content

                            if ( !isStringWithLength(lastMediaUrl) || !isStringWithLength(lastMediaTime) ) {
                                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));    
                                return;
                            }

                            getPrivateFolloweringPreviousMediaContent(guid, fguid, albumId, lastMediaTime, lastMediaUrl, numberOfAlbums );

                        } else {
                            // Get private album start from beginning

                            getPrivateFolloweringMediaContent(guid, fguid, albumId, lastMediaTime, lastMediaUrl, numberOfAlbums );
                        }



                    } else if ( action.localeCompare(kDidViewMedia ) == 0) {
                        console.log('User exists, kDidViewMedia');
                        
                        checkAccessPermissions(guid);
                   
                    } else if ( action.localeCompare(kBookmarked ) == 0) {
                        console.log(action);
                         bookmarkAlbum(guid, fguid, albumId);
                    } else if ( action.localeCompare(kUnbookmarked ) == 0) {
                        console.log(action);
                        unbookmarkAlbum(guid, fguid, albumId);
                    } else if ( action.localeCompare("FlagMediaInAlbum" ) == 0) {
                        
                        console.log(action);
                        
                        if ( isInt(flagType ) && flagType >= 0 && flagType < 4) {
                            flagMediaInAlbum(guid, fguid, albumId, mediaUrl, flagType);
                        } else {
                            finalAppResponse( errorResponse( ErrorMessageGeneric));
                        }
                    }  
                    

                                     



                // // open friends album // 
                // } else if (pathParams.localeCompare("/albums/private/friends/album") == 0 ) {
                    
                //     checkAccessPermissions(guid);

                // // Update friend album new media viewed
                // } else if (pathParams.localeCompare("/albums/private/friend/album/media") == 0 ) {
                    
                //     checkAccessPermissions(guid);

                // } 
                    else {
                        finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                    }
                } else if ( pathParams.localeCompare("/albums/private/opinion" ) == 0 ) {
                    

                    var kOpinion     = "liked";
                    var opinionValue = requestBody[kOpinion];

                    getAlbumOpinion(guid, fguid, albumId, opinionValue) 


                    // if ( action.localeCompare("Liked" ) == 0) {
                    //     likeAlbum(guid);
                    // } else if ( action.localeCompare("Disliked" ) == 0) {
                    //     dislikeAlbum(guid);
                    // } else {
                    //     neutralAlbum(guid);
                    // }

                } else if ( pathParams.localeCompare("/albums/private/viewedAlbum" ) === 0 ) {
                    
                    
                    updateAlbumViewCount(guid, fguid, albumId);

                } else if ( pathParams.localeCompare("/albums/private/comments" ) === 0 ) {
               
                    console.log("/comments");
                    if ( action.localeCompare("PostComment" ) === 0) {
    
                        console.log("/comments PostComment");
                        
                        let ownerGuid = requestBody[kAlbumOwnerGuid];
                        let albumId   = requestBody[kAlbumId];
                        let comment   = requestBody[kComment];
                        
                        postComment(ownerGuid, albumId, guid, comment);
                                                
                    } 
                    
                    else if ( action.localeCompare("DeleteComment" ) === 0) {
                        console.log("/comments DeleteComment");
                        
                        let ownerGuid     = requestBody[kAlbumOwnerGuid];                        
                        let albumId       = requestBody[kAlbumId];
                        let commentId     = requestBody[kCommentId];
                        let commenterGuid = requestBody[kGuid];
                        
                        deleteComment(guid , ownerGuid, albumId, commenterGuid, commentId );
                    }

                    
                    // else if ( action.localeCompare("DeleteReply" ) === 0) {
                    //     console.log("/comments DeleteComment");
                        
                    //     let ownerGuid     = requestBody[kAlbumOwnerGuid];                        
                    //     let albumId       = requestBody[kAlbumId];
                    //     let commentId     = requestBody[kCommentId];
                    //     let commenterGuid = requestBody[kGuid];
                        
                    //     deleteReply(guid , ownerGuid, albumId, commenterGuid, commentId );
                    // }
                    
                    
                    else if ( action.localeCompare("LoadComments" ) === 0) {
                        console.log("/comments LoadComments");
                        
                        let ownerGuid = requestBody[kAlbumOwnerGuid];                        
                        let albumId   = requestBody[kAlbumId];
                        
                        loadComments(ownerGuid, albumId, guid);

                    } else if ( action.localeCompare("LoadMoreComments" ) === 0) {
                        console.log("/comments LoadMoreComments");
                        
                        let ownerGuid     = requestBody[kAlbumOwnerGuid];                        
                        let albumId       = requestBody[kAlbumId];
                        let lastTimestamp = requestBody[kTimestamp];
                        
                        let commentId = requestBody[kCommentId];
                        
                        console.log("loadMoreComments");

                        if ( !isStringWithLength(lastTimestamp )) {
                            finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            return;
                        }

                        loadMoreComments(ownerGuid, albumId, guid, commentId, lastTimestamp);

                    } 

                    else if ( action.localeCompare("GetCommentMentioningUser" ) === 0) {
                        console.log("/comments GetCommentMentioningUser");
                        
                        let ownerGuid     = requestBody[kAlbumOwnerGuid];                        
                        let albumId       = requestBody[kAlbumId];                        
                        let commentId = requestBody[kCommentId];
                    
                        getCommentMentioningUser(ownerGuid, albumId, commentId, fguid);
                    }
                    

                    else if ( action.localeCompare("GetCommentOnUserAlbum" ) === 0) {
                        console.log("/comments GetCommentOnUserAlbum");
                        
                        let ownerGuid     = requestBody[kAlbumOwnerGuid];                        
                        let albumId       = requestBody[kAlbumId];                        
                        let commentId     = requestBody[kCommentId];
                    
                        getCommentOnUserAlbum(ownerGuid, albumId, commentId, fguid);
                    }
                    
                    else if ( action.localeCompare("GetReplyToComment" ) === 0) {
                        console.log("/comments GetReplyToComment");
                        
                        let ownerGuid     = requestBody[kAlbumOwnerGuid];                        
                        let albumId       = requestBody[kAlbumId];                        
                        let commentId     = requestBody[kCommentId];
                    
                        getReplyToComment(ownerGuid, albumId, commentId, fguid);
                    }
                    
                
                    else {
                        finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));                            
                    }
                    
                   
                } else if ( pathParams.localeCompare("/albums/private/replies" ) === 0 ) {
                        
                    if ( action.localeCompare("PostReply" ) === 0) {
                        
                        console.log("/comments PostReply");
                    
                        let ownerGuid = requestBody[kAlbumOwnerGuid];
                        let albumId   = requestBody[kAlbumId];
                        
                        // let commentingOnGuid = requestBody[kFGuid];                        
                        let comment          = requestBody[kComment];
                        let commentId        = requestBody[kCommentId];
                        
                        if ( !isStringWithLength(ownerGuid) || !isStringWithLength(albumId) 
                            || !isStringWithLength(comment) || !isStringWithLength(commentId)) {
                                finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                                return;                                
                        }

                        postReplyToComment(ownerGuid, albumId, commentId, guid, comment);
                        

                    } else if ( action.localeCompare("LoadReplies" ) === 0) {
                        console.log("/comments LoadReplys");
                        
                        let ownerGuid = requestBody[kAlbumOwnerGuid];                        
                        let albumId   = requestBody[kAlbumId];
                        let parentId  = requestBody[kCommentId];
                        
                        loadReplies(ownerGuid, albumId, parentId, guid);

                    } else if ( action.localeCompare("LoadMoreReplies" ) === 0) {
                        console.log("/comments LoadMoreReplys");
                        
                        let ownerGuid     = requestBody[kAlbumOwnerGuid];                        
                        let albumId       = requestBody[kAlbumId];
                        let parentId      = requestBody[kCommentId];                        
                        let lastTimestamp = requestBody[kTimestamp];
                        
                        console.log("loadMoreComments");
                        if ( !isStringWithLength(lastTimestamp )) {
                            finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));
                            return;
                        }

                        loadMoreReplies(ownerGuid, albumId, parentId, lastTimestamp, guid);
                        
                    } else {
                        finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));                            
                    }
                    
                
                } else {
                    finalAppResponse( activeResponse(ActiveValues.Active, ErrorMessageGeneric ));    
                }
            } else {
                finalAppResponse( activeResponse(ActiveValues.DoesNotExist, activeErrorMessage(ActiveValues.DoesNotExist) ));
            } 
        });
    }
    
    // /albums/me              list my albums
    // /albums/me/album        open my album
    // /albums/me/album        Create album
    // /albums/me/album/acl    list album ACL

    // /albums/friends               list friends albums
    // /albums/friends/album         open friends album
    // /albums/friends/album/media   Viewed new media / DromoViewedMedia
    // /albums/friends/friend  list friend albums

    // /albums/friends/friend  list friend albums

    console.log("will queryLoggedInUser");
    
    queryLoggedInUser();
};