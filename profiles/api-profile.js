'use strict';
console.log('Loading function');

/* Import Libraries */
var mysql = require('mysql');
var uuid  = require('uuid');
var validator = require('validator');

var randomstring = require("randomstring");

console.log('Loading function 1');

var AWS = require("aws-sdk");
console.log('Loading function AWS');

var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

console.log('Loading function S3');

var APP_NAME  = "Fifo";

var MaxLength = {
    Username: 30,
    Fullname: 45,
    Domain  : 100,
    About   : 500,
    Email   : 80,
    Mobile  : 20,
    // Gender  : 4
};

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


let kEmail      = "email";
let kMobile     = "mobile";


let kTimestamp = "timestamp";

let kErrorMessage   = "errorMessage";
let kDidUpdate      = "didUpdate";
let kProfile        = "profile";
// let kFriendStatus   = "friendStatus";

let kUpdatedValue   = "updatedValue";

let kSuccess        = "success";
let kOtherMessage   = "message";


let kFriendsCount   = "friendsCount";


var ErrorMessageGeneric = "Something went wrong. Try again shortly.";
//APP_NAME + " is experiencing problems. Try again shortly";


let kActive = "active";


let kProfileUrl = "profileUrl";

let kAlbums = "albums";

let kAlbumId    = "albumId";
let kTitle           = "title";

let kCount = "count";
let kCommentCount       = "commentCount";
let kCommentTotalCount  = "commentTotalCount";


let kCreateDate      = "createDate";

let kAlbumCover             = "albumCover";
let kNewestMediaTimestamp   = "newestTimestamp";
let kSignedUrl =  "signedUrl";

let kPrivate = "private";


let kLikeCount      = "likeCount";
let kDislikeCount   = "dislikeCount";
let kViews          = "views";



let kScore          = "score";
let kFollowersCount = "followersCount";
let kFollowingCount = "followingCount";


let kExplicit = "explicit";

let kExplicitOverride = "explicitOverride"; // Administration overrides the explicit nature of content


let kAllowFollowersView     =  "allowFollowersView";
let kAllowFollowingsView    =  "allowFollowingsView";


var ALBUM_BUCKET = "dromo-albums";


let kFirstUrl = "firstUrl";
let kSignedFirstUrl = "signedFirstUrl";


let kLike = "like";



let SECONDS_IN_MINUTE = 60; 
let MINUTES_IN_HOUR = 60;   // 3,600
let HOURS_IN_DAY = 24;      // 86,400
let NUMBER_OF_DAYS = 7;     // 172,800

let S3_EXPIRE_LIMIT =  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * NUMBER_OF_DAYS;


var ActiveValues = {
    Active            : 0,
    Unknown           : 1,   
    DoesNotExist      : 2,   // Company suspended
    Deleted           : 3,   // User deleted 
    Disabled          : 4,   // User disbaled??
    DisabledConfirmed : 5,   // Company suspended
};


let kAction = "action";

    /*   S3 CONSTANTS   */

var PRIVATE_PROFILE_TMP_BUCKET = "dromo-profile-private-tmp";

// Used I think in thumbnail edits
var PRIVATE_PROFILE_BUCKET  = "dromo-profile-private";


// var PRIVATE_ORIGINAL_BUCKET = "dromo-profile-private-original";
//var PRIVATE_CROPPED_BUCKET  = "dromo-profile-private-crop"; 
var PUBLIC_CROP_BUCKET      = "dromo-profile-public-crop";
var PUBLIC_THUMB_BUCKET     = "dromo-profile-public-thumb";
                


let PRIVATE_TMP_RAIL_BUCKET = "rail-userfiles-mobilehub-1247959479";


function temporaryProfileKeyPrefix() {
    return "tmp/profile/";
}

function temporaryAlbumKeyPrefix() {
    return "tmp/album/";
}




                // "arn:aws:s3:::rail-userfiles-mobilehub-1247959479/tmp/profile/${cognito-identity.amazonaws.com:sub}/*",
                // "arn:aws:s3:::rail-userfiles-mobilehub-1247959479/tmp/album/${cognito-identity.amazonaws.com:sub}/*",





// Helper function used to validate input
function invalidCharacters(username) {
    var regexp = /^[a-zA-Z0-9-_.]+$/;
    return !regexp.test(username);
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


function isStringWithLength(word) {
    return typeof word === 'string' && word.length > 0;
}

function stringHasLength(str) {
    if (str === undefined || str === null || str.length < 1) {
        console.log("String has no length");
        return false;
    }
    return true;
}
function stringIsTooLong(kValue, maxLength) {
    if (kValue.length > maxLength) {
        console.log("kValue.length > maxLength");
        return true;
    }
    return false;  
}

function isValidStringAndLength(kValue, maxLength) {
    if (kValue === undefined || kValue === null ||  typeof kValue !==  "string" ) {
        console.log("No value");
        return false;
    }
    if (kValue.length > maxLength) {
        console.log("kValue.length > maxLength");

        return false;
    }
    return true;
}



function isValidString(kValue) {
    return !(kValue === undefined || kValue === null ||  typeof kValue !==  "string" )
}



function isInt(value) {
    if (isNaN(value)) {
        return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
}


function printError(err) {
    console.log(err);
    console.error('Error Stack is: ' + err.stack);


    // console.log('Error is :', JSON.stringify(err, null, 2));
    // console.log('Error is :', JSON.stringify(err.code, null, 2));
    // console.log('Error Message :', err.errorMessage);
                                    
    // console.error('Error Stack stringify: ' + JSON.stringify(err.stack, null, 2));
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
    response[kFollowedStatus]  = status;
    response[kBlocked]         = isBlocked;
    return response;
}





// Update our profile response
function updateProfileResponse(didUpdate, profile) {

    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kDidUpdate]    = didUpdate;
    response[kProfile]      = profile;  
    return response;
}

let kAlbumInfo = "albumInfo";

//  Get profile response
function fetchAlbumsResponse( albumInfo) {

    var response = {};
    response[kActive] = ActiveValues.Active;
    response[kAlbumInfo] = albumInfo;
    return response;
}


function trendingProfileResponse(userInfo) {
    var response = {};
    response[kActive]   = ActiveValues.Active;
    response[kProfile] = userInfo;
    return response;
}


    
let kFollowedStatus  = "followedStatus";
let kFollowingStatus = "followingStatus";


function userProfileResponse( profileInfo, followerStatus) {

    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kProfile]      = profileInfo;

    console.log("followerStatus: " + followerStatus);

    if (followerStatus && followerStatus !== null) {
        if (followerStatus === Relationship.CanceledFollowRequest) {
            response[kFollowingStatus] = Relationship.NoneExist;
        } else {
            response[kFollowingStatus] = followerStatus;
        }
        
        // if (followerStatus == Relationships.AcceptedFriendRequest || followerStatus == Relationships.FriendAcceptedRequest) {
        //     response[kFollowingStatus] = Relationships.Friends;
        // }

        // if (followerStatus == Relationships.CanceledFriendRequest ) {
        //     response[kFollowingStatus] = Relationships.NoneExists;
        // }

    } else {
        response[kFollowingStatus] = Relationship.NoneExist;
    }
    return response;
}



function saveImageResponse( imageUrl, errorMessage) {
    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kProfileUrl]   = imageUrl;
    response[kErrorMessage] = errorMessage;
    return response;
}



var ErrorType  = {
    UserNotFound : 1
};

function errorTypeMessage(type) {
    switch (type) {
        case ErrorType.UserNotFound: return "User not found";
        default: break;
    }
}

let kErrorType = "errorType";

function newErrorResponse(type) {
    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kErrorType]    = type;
    response[kErrorMessage] = errorTypeMessage(type);
    return response;
}

function errorResponse( errorMessage) {
    
        var response = {};
        response[kActive]       = ActiveValues.Active;
        response[kErrorMessage] = errorMessage;
        return response;
    }

function errorResponse( errorMessage) {

    var response = {};
    response[kActive]       = ActiveValues.Active;
    response[kErrorMessage] = errorMessage;
    return response;
}


function activeResponse( activeStatus, errorMessage) {
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



console.log("2");

// Multiple albums may have access to this content
function albumFirstMediaKey(guid, mediaUrl) {
    return guid + "/media/" + mediaUrl;
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
// Multiple albums may have access to this content
function albumCoverThumbnailKey(guid, mediaUrl) {
    return guid + "/thumb/" + mediaKeyWithExtension(mediaUrl, MediaType.Photo);
}


 function mediaKeyWithExtension(mediaKey, mediaContentType) {
     return mediaKey + mediaExtension(mediaContentType);
 }



var Relationship = {
    Unknown               : 0,
    NoneExist             : 1,
    FollowRequested       : 2,        
    IsFollowing           : 3,   
    CanceledFollowRequest : 5
};


// var Relationships = {
//     Unknown                 : "U",
//     NoneExists              : "NE",
//     Friends                 : "F",

//     SentFriendRequest       : "SFR",        //S
//     ReceivedFriendRequest   : "RFR",//  - R 
//     AcceptedFriendRequest   : "AFR",//  - A"
//     FriendAcceptedRequest   : "RFRA", // FAR // - F      
//     CanceledFriendRequest   : "CFR" //  - C
// };



function isVerified(verified) {

    return verified > 0;
}


console.log('creating connection');

var connection = mysql.createConnection({
    host     : 'mysqldromotest.cyoa59avdmjr.us-east-1.rds.amazonaws.com',
    user     : 'hannyalybear',
    password : 'SummerIsNearAndYellow1',
    database : 'dromotestmysqldb',
    charset  : 'utf8mb4_unicode_ci' 
});


let kFriendGuid =    "fguid";



/*
    Shell command:
cd profiles; ./compress.sh api-profile Rail-Profiles-mobilehub-1247959479; cd ..

./compress.sh api-profile Rail-Profiles-mobilehub-1247959479

*/


let kCroppedImage  = "cropImage"
let kOriginalImage = "originalImage"




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


    context.callbackWaitsForEmptyEventLoop = false;

    //  2,412, 2,381 2,356
    console.log('Received event:', JSON.stringify(event, null, 2));
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    var userId = cognitoIdentityId;
    var acctId = requestBody.acctId;  

    var fguid  = requestBody[kFriendGuid];


    var action  = requestBody[kAction];



 
    console.log("ClientID: " + userId);
    console.log("AcctId: " + acctId);
    console.log("Friend Guid: " + fguid);


    var updatingProfileInfo = false;
    var updatingPrivateInfo = false;
   

    var profile = {};
    profile[kUserName] = requestBody[kUserName];
    profile[kFullName] = requestBody[kFullName];
    profile[kDomain]   = requestBody[kDomain];
    profile[kAbout]    = requestBody[kAbout];
   
    // profile[kEmail]    = requestBody[kEmail];
    // profile[kMobile]   = requestBody[kMobile];
    // profile.gender   = event[kGender];

    console.log("username: \"" + profile[kUserName]  + "\"");
    console.log("fullname: \"" + profile[kFullName] + "\"");
    console.log("domain: \"" + profile[kDomain] + "\"");
    console.log("about: \"" + profile[kAbout] + "\"");
  
    // console.log("email: \"" + profile[kEmail] + "\"");
    // console.log("mobile: \"" + profile[kMobile] + "\"");
    // console.log("gender: \"" + profile.gender + "\"");

    if ( userId.length > 100 ) {
        finalAppResponse( activeResponse( ActiveValues.Unknown, activeErrorMessage( ActiveValues.Unknown )));
        return;
    }


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
       



/**
 *  =============================================================================================================
 *  =============================================================================================================
 * 
 * 
 * 
 *                                Update user profile image
 * 
 * 
 * 
 *  =============================================================================================================
 *  =============================================================================================================
 */


    /* User photos */
    var originalImagePathKey = requestBody[kOriginalImage];
    var croppedImagePathKey  = requestBody[kCroppedImage];
    
    // var originalImageData = requestBody[kOriginalImage];
    // var croppedImageData  = requestBody[kCroppedImage];
    


    function bytesToMb(bytes) {

        return bytes/ (1024 * 1024);
    }

    function isImageBelowSizeThreshold(mbSize) {
        return mbSize < 10
    }


    function generateRandomString() {
        return randomstring.generate({
            length: 7,
            charset: 'hex'
        });
    }

    //TODO: Change  orginalProfileKey ->  guid + randomMediaUel()  + "/original.jpg"

    function orginalProfileKey(guid, mediaUrl) {
        // return "original/"  + guid + mediaUrl + "/original.jpg"
        return guid + "/original/" + mediaUrl + ".jpg"
    }
    function croppedProfileKey(guid, mediaUrl) {
        // return "crop/" + guid + mediaUrl +  "/crop.jpg"
        return guid + "/crop/" + mediaUrl +  ".jpg"
    }


    function saveNewCropImage(guid) {
       
        // last uploaded imageurl for cropped photo
        connection.query({
            sql: 'SELECT `image_url` FROM `profile` WHERE `guid` = ?',
            values: [guid]
        }, function (error, results, fields) {

            console.log("Called query saveNewCropImage");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            
            } else if ( results.length > 0 ){

                let currentImageUrl = results[0].image_url;

                /**
                 * 
                 * Get iamge from temp RAIL bucket using key croppedImagePathKey
                 */
                

                s3.getObject({
                    Bucket: PRIVATE_TMP_RAIL_BUCKET,
                    Key   : croppedImagePathKey
                }, function(err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        finalAppResponse( errorResponse(ErrorMessageGeneric));
                    }  else {
                        console.log("Received croppedImageData body" );

                        var croppedImageData = data.Body;
                        console.log("croppedImageData: " + croppedImageData );

                        // if ( validator.isBase64(originalImageData) ) {
                        //     console.log("This image is base64 encoded" );
                        // } else {
                        //     console.log("This image is not base64 encoded" );
                        // }

                        var croppedImageBuffer = new Buffer(croppedImageData, 'base64'); // Buffer.from(croppedImage, 'base64');  
                        console.log("croppedImageBuffer");

                        var imageSize = bytesToMb(croppedImageBuffer.length);
                        console.log("saveNewCropImage imageSize: " + imageSize + "Mb");

                        if ( !isImageBelowSizeThreshold(imageSize) ) {
                            console.log("Error: Image is too big. Size:" + imageSize + "Mb");
                            finalAppResponse( saveImageResponse(null, "File size exceeds limits."));
                            return;
                        }

                        var paramsCropped = {
                            Bucket: PRIVATE_PROFILE_BUCKET,
                            Key:    croppedProfileKey(guid, currentImageUrl),  
                            Body:   croppedImageBuffer,
                            ContentEncoding: 'base64',
                            ContentType: 'image/jpeg'
                        }; 

                        s3.putObject(paramsCropped, function(err, data) {

                            if (err) {
                                console.log("Error: " + JSON.stringify(err, null, 2));
                                finalAppResponse( saveImageResponse(null, "Could not save your photo. Try again soon"));
                            } else {
                                console.log("Successfully Put users photo");
                                    // update profile
                                finalAppResponse( saveImageResponse(currentImageUrl, null));
                            }
                        });

                    }
                });

                // uploadCroppedPhoto(guid, paramsCropped, currentImageUrl, null);
            } else {
                console.log('Look this error up Error:');
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
        });
    }


    function saveNewImage(guid) {
        console.log("saveImage 22");

        // last uploaded imageurl for cropped photo
        connection.query({
            sql: 'SELECT `image_url` FROM `profile` WHERE `guid` = ?',
            values: [guid]
        }, function (error, results, fields) {

            console.log("Called query saveNewImage one");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            } else if ( results) {
                console.log("Called query saveNewImage results received");

                let oldImageUrl = null;
                if (results.length > 0 ) {
                    oldImageUrl  = results[0].image_url;
                }
                var retryCount = 5;
                let imageUrl;
                do {
                    imageUrl = generateRandomString();
                    if (imageUrl !==  oldImageUrl) {
                        break;
                    }
                    retryCount--;
                }
                while (retryCount > 0);
                if (imageUrl ===  oldImageUrl) {
                    finalAppResponse( errorResponse(ErrorMessageGeneric));
                    return;
                }


                /**
                 * 
                 * Get original
                 * Get cropped
                 * 
                 * If they're legal, put them into new Bucket
                 * 
                 * 
                 */


                console.log("getParamsOriginal: " + originalImagePathKey);
                
                var getParamsOriginal = {
                    Bucket: PRIVATE_TMP_RAIL_BUCKET,
                    Key   : originalImagePathKey
                }; 

                var getParamsCrop = {
                    Bucket: PRIVATE_TMP_RAIL_BUCKET,
                    Key   : croppedImagePathKey
                }; 

                s3.headObject(getParamsOriginal, function(err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        finalAppResponse( errorResponse(ErrorMessageGeneric));  

                    }  else {
                        console.log("Head data: " + JSON.stringify(data, null, 2));

                        s3.getObject(getParamsOriginal, function(err, data) {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                                finalAppResponse( errorResponse(ErrorMessageGeneric));
                            }  else {
                                console.log("Received originalImageData body" );

                                var originalImageData = data.Body;


                                // if ( validator.isBase64(originalImageData) ) {
                                //     console.log("This originalImageData is base64 encoded" );
                                // } else {
                                //     console.log("This originalImageData is not base64 encoded" );
                                // }

                                s3.getObject(getParamsCrop, function(err, data) {
                                    if (err) {
                                        console.log(err, err.stack); // an error occurred
                                        finalAppResponse( errorResponse(ErrorMessageGeneric));
                                    }  else {
                                        console.log("Received croppedImageData body" );

                                        var croppedImageData = data.Body;
                                        console.log("croppedImageData: " + croppedImageData );

                                        // Setup original Image Buffer
                                        var orginalImageBuffer = new Buffer(originalImageData, 'base64'); // Buffer.from(originalImage, 'base64');  
                                        console.log("orginalImageBuffer");

                                        var imageSize = bytesToMb(orginalImageBuffer.length);
                                        console.log("saveNewImage orginalImageBuffer imageSize");


                                        // if ( validator.isBase64(originalImageData) ) {
                                        //     console.log("This image is base64 encoded" );
                                        // } else {
                                        //     console.log("This image is not base64 encoded" );
                                        // }


                                        if ( !isImageBelowSizeThreshold(imageSize) ) {
                                            console.log("Error: Image is too big. Size:" + imageSize + "Mb"); 
                                            finalAppResponse( saveImageResponse(null, "File size exceeds limits."));
                                            return;
                                        }
                                        
                                        var paramsOriginal = {
                                            Bucket: PRIVATE_PROFILE_BUCKET,
                                            Key: orginalProfileKey(guid, imageUrl), 
                                            Body: orginalImageBuffer,
                                            ContentEncoding: 'base64',
                                            ContentType: 'image/jpeg'
                                        }; 

                                        // Setup crop Image Buffer

                                        var croppedImageBuffer = new Buffer(croppedImageData, 'base64'); // Buffer.from(croppedImage, 'base64');  
                                        console.log("croppedImageBuffer");

                                        var imageSize = bytesToMb(croppedImageBuffer.length);
                                        console.log("saveNewImage: croppedImageBuffer imageSize");

                                        if ( !isImageBelowSizeThreshold(imageSize) ) {
                                            console.log("Error: Image is too big. Size:" + imageSize + "Mb");
                                            finalAppResponse( saveImageResponse(null, "File size exceeds limits."));
                                            return;
                                        }

                                        var paramsCropped = {
                                            Bucket: PRIVATE_PROFILE_BUCKET,
                                            Key: croppedProfileKey(guid, imageUrl), 
                                            Body: croppedImageBuffer,
                                            ContentEncoding: 'base64',
                                            ContentType: 'image/jpeg'
                                        }; 
                                        
                                        uploadOriginalPhoto(guid, paramsCropped, paramsOriginal, imageUrl, oldImageUrl);  
                                    }
                                });
                            }
                        });
                    }
                 });
            } else {
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
        });
    }




    function saveNewImage1(guid) {
        console.log("saveImage");

        // last uploaded imageurl for cropped photo
        connection.query({
            sql: 'SELECT `image_url` FROM `profile` WHERE `guid` = ?',
            values: [guid]
        }, function (error, results, fields) {

            console.log("Called query saveNewImage");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            
            } else if ( results) {


                let oldImageUrl = null;
                if (results.length > 0 ) {
                    oldImageUrl  = results[0].image_url;
                }

                var retryCount = 5;
                let imageUrl;
                do {
                    imageUrl = generateRandomString();
                    if (imageUrl !==  oldImageUrl) {
                        break;
                    }
                    retryCount--;
                }
                while (retryCount > 0);
                if (imageUrl ===  oldImageUrl) {
                    finalAppResponse( errorResponse(ErrorMessageGeneric));
                    return;
                }

                
                var orginalImageBuffer = new Buffer(originalImageData, 'base64'); // Buffer.from(originalImageData, 'base64');  
                console.log("orginalImageBuffer");

                var imageSize = bytesToMb(orginalImageBuffer.length);
                console.log("imageSize");

                if ( !isImageBelowSizeThreshold(imageSize) ) {
                    console.log("Error: Image is too big. Size:" + imageSize + "Mb"); 
                    finalAppResponse( saveImageResponse(null, "File size exceeds limits."));
                    return;
                }
                


                var paramsOriginal = {
                    Bucket: PRIVATE_PROFILE_BUCKET,
                    Key: orginalProfileKey(guid, imageUrl), 
                    Body: orginalImageBuffer,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg'
                }; 


                var croppedImageBuffer = new Buffer(croppedImage, 'base64'); // Buffer.from(croppedImage, 'base64');  
                console.log("croppedImageBuffer");

                var imageSize = bytesToMb(croppedImageBuffer.length);
                console.log("imageSize");

                if ( !isImageBelowSizeThreshold(imageSize) ) {
                    console.log("Error: Image is too big. Size:" + imageSize + "Mb");
                    finalAppResponse( saveImageResponse(null, "File size exceeds limits."));
                    return;
                }

                var paramsCropped = {
                    Bucket: PRIVATE_PROFILE_BUCKET,
                    Key: croppedProfileKey(guid, imageUrl), 
                    Body: croppedImageBuffer,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg'
                }; 
                
                uploadOriginalPhoto(guid, paramsCropped, paramsOriginal, imageUrl, oldImageUrl);      
            } else {
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
        });
    }


// S3dromo-profile-private

    function uploadOriginalPhoto(guid, paramsCropped, paramsOriginal, imageUrl, oldImageUrl) {
       // Insert original first


    //     s3.headObject(params, function(err, data) {
    //         if (err) {
    //             console.log(err, err.stack); // an error occurred
    //         }  else {
    //             console.log(data);           // successful response
    //         }
    //     });
    
    //    s3.copyObject(params, function(err, data) {
    //         if (err) console.log(err, err.stack); // an error occurred
    //         else     console.log(data);           // successful response
    //         });


        s3.putObject(paramsOriginal, function(err, data) {
            
            if (err) {
                console.log("Error: " + JSON.stringify(err, null, 2));

                finalAppResponse( saveImageResponse(null, "Uh oh. Could not upload your photo. Try again later"));
            } else {
                console.log("Successfully Put users photo");
                console.log("data: " + JSON.stringify(data, null, 2));
           
                uploadCroppedPhoto(guid, paramsCropped, imageUrl, oldImageUrl);
            }
        });
    }


    function uploadCroppedPhoto(guid, paramsCropped, imageUrl, oldImageUrl) {
       // Insert original first
        s3.putObject(paramsCropped, function(err, data) {

            if (err) {
                console.log("Error: " + JSON.stringify(err, null, 2));
                finalAppResponse( saveImageResponse(null, "Uh oh. Could not upload your photo. Try again later"));
            } else {
                console.log("Successfully Put users photo");
                    // update profile
                connection.query({
                    sql:'UPDATE `profile` SET image_url = ? WHERE `guid` = ?', 
                    values: [ imageUrl, guid]
                }, 
                function (error, results, fields) {
                    if (error) {
                        console.log('Error:', JSON.stringify(error, null, 2));
                        finalAppResponse( saveImageResponse(null, "Uh oh. Could not upload your photo. Try again later"));
                    } else {
                        deleteOldProfileImage(guid, imageUrl, oldImageUrl );
                    }
                });

                // connection.beginTransaction(function(err) {
                //     if (err) { 
                //         printError(error);
                //         rollbackAppError(errorMessage);
                //     } else { 

                //         // update profile
                //         connection.query({
                //             sql:'UPDATE `profile` SET image_url = ? WHERE `guid` = ?', 
                //             values: [ imageUrl, guid]
                //         }, 
                //         function (error, results, fields) {

                //             if (error) {
                //                 console.log('Error:', JSON.stringify(error, null, 2));
                //                 finalAppResponse( saveImageResponse(null, "Uh oh. Could not upload your photo. Try again later"));
                //             } else {

                //                 // update profile
                //                 connection.query({
                //                     sql:'UPDATE `usersearch` SET image_url = ? WHERE `guid` = ?', 
                //                     values: [ imageUrl, guid]
                //                 }, 
                //                 function (error, results, fields) {

                //                     if (error) {
                //                         console.log('Error:', JSON.stringify(error, null, 2));
                //                         finalAppResponse( saveImageResponse(null, "Uh oh. Could not upload your photo. Try again later"));
                //                     } else {

                //                         deleteOldProfileImage(guid, imageUrl, oldImageUrl );
                //                     }
                //                 });
                //             }
                //         });
                //     }
                // });
            }
        });
    }


    function deleteOldProfileImage(guid, imageUrl, oldImageUrl) {
        
        if (oldImageUrl === null) {
            finalAppResponse( saveImageResponse(imageUrl, null));
        } else {

            var deleteParams = {
                Bucket: PRIVATE_PROFILE_BUCKET, /* required */
                Delete: { /* required */
                    Objects: [ /* required */
                        { Key: croppedProfileKey(guid, oldImageUrl) },
                        { Key: orginalProfileKey(guid, oldImageUrl) }
                    /* more items */
                    ],
                    Quiet: true
                }
            };
            console.log('keys:', JSON.stringify(deleteParams, null, 2));

            s3.deleteObjects(deleteParams, function(err, data) {
                if (err) { printError(err); } 
                else { console.log(data); }
                finalAppResponse( saveImageResponse(imageUrl, null));
            });
        } 
    }


/**
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 * 
 *                          Update user profile
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 */





    function callbackError() {

        if (isUpdatingPublicAndPrivateInfo) {
            // Rollback on failure
            connection.rollback(function() {                            
                finalAppResponse( errorResponse(
                    "Could not save profile info at this time. Try again shortly."
                ));
            });  
        } else {
            finalAppResponse( errorResponse(
                "Could not save profile info at this time. Try again shortly."
            ));
        }
    }

    


    /**
     * 
     * If fullname or username changes then we have to update usersearch table
     * 
     *      For username update
     * 1) We have to delete all rows of (keyword, username) 
     * 
     * 2) Insert one row of (username, username) 
     * 
     * 3)  add the item to cron background job, to update for all prefixes
     * 
     *  
     *  For fullname update.
     * 
     *  We have to know if we changed the username or fullname
     *  If we change the username or fullname 
     * 
     * 
     * 
     * 
     * 
     * 
     * 
     */

     
    function getSubstringsThatDontOverlapWithSecondList(list1, list2) {
        
        list1 = list1.filter( function( el ) {
            return !list2.includes( el );  
        } );
        
        return list1;
    }


    function getKeywordsFor(names) {

        var list = [];
        
        for (var index in names) {
            let username = names[index];

            for (var startingIndex = 0; startingIndex < username.length; startingIndex++) {
                for (var stringLength = 1; stringLength <= username.length - startingIndex; stringLength++) {
                    let subString = username.substr(startingIndex, stringLength);
                    list.push(subString);
                }
            }
        }
        let filteredKeywords = Array.from(new Set(list));
        return filteredKeywords;
    }

    /**
     *  Delete from user from usersearch
     */


     function usernameSubstrings(username) {
        return getKeywordsFor([username]);
     }

     function fullnameList(fullname) {

        if (fullname !== null) {
            var names = [];            
            var fullnameKeywords  = fullname.split(/[ ,]+/);

            for (var index in fullnameKeywords) {
                let term =  fullnameKeywords[index];
                names.push(term);
            }
            return names;            
        }
        return [];
     }

     

    function deleteUserFromUsersearchTable(oldUsername, substrings, guid) {

        connection.query({
            sql: 'DELETE FROM `usersearch` WHERE keyword in (?) AND guid = ?', 
            values: [substrings, guid] 
        }, function(err, results) {
            if (err) {
                printError(err);
                callbackError();                               
            } else {
                insertUserIntoUsersearch(oldUsername, guid);
            }
        });
    }


    function insertUserIntoUsersearch(oldUsername, guid) {

        console.log("insertUserIntoUsersearch");

        var newUsername   = profile[kUserName];

        connection.query({
            sql:'INSERT INTO usersearch SET keyword = ?, guid = ?', 
            // sql:'INSERT INTO usersearch (keyword, username, fullname, guid, popularity, image_url) VALUES ? ON DUPLICATE KEY UPDATE popularity = VALUES(popularity)', 
            values: [newUsername, guid ] 
        }, function(err, result) {
            
            if (err) {
                printError(err);
                callbackError();                               
            } else {
                insertUserIntoUserSearchBackgroundTable(oldUsername, guid);
            }            
        });
    }


    function insertUserIntoUserSearchBackgroundTable(oldUsername, guid) {

        console.log("insertUserIntoUserSearchBackgroundTable");

        // cron_update_mentions

        connection.query({
            // sql:'INSERT INTO cronjobs SET action = ?, guid = ?, popularity', 
            sql:'INSERT INTO `cron_change_usersearch` SET guid = ?', 
            values: [ guid ] 
        }, function(err, result) {
            if (err) {
                printError(err);
                callbackError();                               
            } else {

                insertUserInMentionsBackgroundTable(oldUsername, guid);
            }    
        });    
    }

    function insertUserInMentionsBackgroundTable(oldUsername, guid) {

        console.log("insertUserInMentionsBackgroundTable");

        connection.query({
            sql:'INSERT INTO cron_update_mentions SET username = ?, guid = ?', 
            values: [oldUsername, guid ] 
        }, function(err, result) {
            
            if (err) {
                printError(err);
                callbackError();                               
            } else {

                if (isUpdatingPublicAndPrivateInfo) {
                    
                    console.log("updatePrivateInfo");

                    updatePrivateInfo(guid);

                } else {

                    // Commit both queries
                    connection.commit(function(err) {
                        if (err) {
                            // Failed to commit queries. Rollback on failure
                            callbackError();
                        } else  {
                            console.log('successful commit!');
                            finalAppResponse( updateProfileResponse(true, profile));         
                        }
                    });
                }
            }
        });
    }
                

    // function updateFullnameInUsersearchTable(guid) {
    //     console.log("updateFullnameInUsersearchTable");

    //     var fullname   = profile[kFullName];

    //     // update profile
    //     connection.query({
    //         sql:'UPDATE `usersearch` SET fullname = ? WHERE `guid` = ?', 
    //         values: [ fullname, guid]
    //     }, 
    //     function (error, results, fields) {
 
    //         if (error) {
    //             printError(error);
    //             callbackError();                               
    //         } else {

    //             if (isUpdatingPublicAndPrivateInfo) {

    //                 console.log("updatePrivateInfo");

    //                 updatePrivateInfo(guid);

    //             } else {
    //                 finalAppResponse( updateProfileResponse(
    //                     true, profile
    //                 ));
    //             }
    //         }    
    //     });
    // }




    function updateProfileInfo(guid) {
        
        console.log("Called updateProfileInfo");
        
        profile[kGuid]   = guid;

        /**
         * 
            SELECT `username`, fullname, about, domain, user_metrics.popularity, image_url
            FROM `profile`
                 LEFT JOIN user_metrics 
                 ON user_metrics.guid = profile.guid 
            WHERE profile.guid = ?',
         */

        connection.query({
            sql: 'SELECT `username`, fullname, about, domain, image_url FROM `profile` WHERE profile.guid = ?',
            // sql: 'SELECT `username`, fullname, about, domain, popularity, image_url FROM `profile` WHERE `guid` = ?',

            values: [ guid ] 
        }, function (err, results, fields) {

            if (err) {
                printError(err);
                callbackError();
            } else {
                   
                if ( results.length > 0 ) {
                    console.log("updateProfileInfo: results > 0");

                    var oldUsername = results[0].username
                    var oldFullname = results[0].fullname
                    var oldAbout    = results[0].about
                    var oldDomain   = results[0].domain

                    // var oldPopularity   = results[0].popularity
                    // var oldImage_url    = results[0].image_url


                    var usernameNeedsUpdating = false;
                    if (oldUsername !== profile[kUserName]) {
                        usernameNeedsUpdating = true;
                    }

                    var fullnameNeedsUpdating = false;
                    if (oldFullname !== profile[kFullName] && isStringWithLength(oldFullname)) {
                        fullnameNeedsUpdating = true;
                    }

                    console.log("Called updateProfileInfo end");
                    
                    connection.query({
                        sql: 'UPDATE `profile` SET `username` = ?, `fullname` = ?, `about` = ? , `domain` = ? WHERE `guid` = ?',
                        values: [ profile[kUserName], profile[kFullName], profile[kAbout], profile[kDomain], guid]
                    }, function (err, result) {

                        if (err) {
                            printError(err);
                            callbackError();
                        } else {

                            console.log("updateProfileInfo: ok");

                            if ( result.affectedRows > 0) {

                                console.log("updateProfileInfo: affectedRows " + result.affectedRows);

                                if ( usernameNeedsUpdating && fullnameNeedsUpdating ) {

                                    let listOfNames = fullnameList( oldFullname);
                                    listOfNames.push(oldUsername);
                                    var substrings = getKeywordsFor(listOfNames);

                                    deleteUserFromUsersearchTable(oldUsername, substrings, guid);
                             
                               } else if ( usernameNeedsUpdating ) {
                                
                                    let usernameList = [oldUsername];
                                    var usernameSubstrings = getKeywordsFor(usernameList);
                                    
                                    if (oldFullname === null) {
                                        deleteUserFromUsersearchTable(oldUsername, usernameSubstrings, guid);
                                        
                                    } else {
                                            
                                        let fullnameList = fullnameList( oldFullname );
                                        var fullnameSubstrings = getKeywordsFor(fullnameList);
                                    
                                        let substrings = getSubstringsThatDontOverlapWithSecondList(usernameSubstrings, fullnameSubstrings );
                                    
                                        deleteUserFromUsersearchTable(oldUsername, substrings, guid);
                                    }


                                } else if ( fullnameNeedsUpdating ) {
                                    

                                    let usernameList = [oldUsername];
                                    var usernameSubstrings = getKeywordsFor(usernameList);
                                    
                                    let fullnameList = fullnameList( oldFullname );
                                    var fullnameSubstrings = getKeywordsFor(fullnameList);
                                
                                    let substrings = getSubstringsThatDontOverlapWithSecondList(fullnameSubstrings, usernameSubstrings );
                                    
                                    deleteUserFromUsersearchTable(oldUsername, substrings, guid);
                                    
                                } else if (isUpdatingPublicAndPrivateInfo) {

                                    console.log("updatePrivateInfo");

                                    updatePrivateInfo(guid);

                                } else {
                                    
                                    finalAppResponse( updateProfileResponse(
                                        true, profile
                                    ));
                                }
                            } else {
                                console.log("updatePrivateInfo err 1");
                                callbackError();
                            }
                        }
                    });
                } else {
                    callbackError();
                }
            }

        });
    }


    function updatePrivateInfo(guid) {

        console.log("updatePrivateInfo");
   
        // connection.query('INSERT INTO `lastPosition` SET ? ON DUPLICATE KEY UPDATE Lat=VALUES(Lat), Lon=VALUES(Lon), Time=VALUES(Time)', result);

        connection.query({

            sql: 'INSERT INTO `user_private` SET guid = ?, email = ?, mobile = ? ON DUPLICATE KEY UPDATE email=VALUES(email), mobile=VALUES(mobile)',  
            // sql: 'INSERT INTO `user_private` (guid, email, mobile) VALUES ? ON DUPLICATE KEY UPDATE email = VALUES(email) mobile = VALUES(mobile)',  
            values: [ guid, profile[kEmail], profile[kMobile] ], 
        }, function(err, result) {
            if (err) {
                console.log("updatePrivateInfo err");
                callbackError();
            } else {

                if ( result && result.affectedRows > 0) {

                console.log("updatePrivateInfo affectedRows");

                    if (isUpdatingPublicAndPrivateInfo) {
                        console.log("updatePrivateInfo isUpdatingPublicAndPrivateInfo");

                        // Commit both queries
                        connection.commit(function(err) {
                            if (err) {
                                // Failed to commit queries. Rollback on failure
                                callbackError();
                            } else  {
                                console.log('successful commit!');
                                finalAppResponse( updateProfileResponse(true, profile));         
                            }
                        });

                    } else {
                        finalAppResponse( updateProfileResponse(true, profile));      
                    }

                } else {
                    console.log("updatePrivateInfo err 1");
                    callbackError();
                }
            }
        });
    }




    // Add user to Users and Search table
    function beginTransactionToInsertUser(guid) {
        connection.beginTransaction(function(err) {
            if (err) { 
                console.log('Error:', JSON.stringify(err, null, 2));
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            } else {
                updateProfileInfo(guid);
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
 *                          Get a user profile
 * 
 * 
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * ====================================================================================================
 * 
 */



 
    function updateProfileViewStats(guid, fguid, callbackResponse) {
	                
        printTimeForEvent("Updating profile view stats:" +  guid, fguid, callbackResponse);


        var sql = "INSERT INTO `profile_view_history` SET `guid` = ?, `fguid` = ?"; 

        connection.query({
            sql: sql,
            values: [guid, fguid],
            timeout: 200 // 0.2s
        }, 
        function (error, results, fields) {

            printTimeForEvent("Done inserting cheat prevention stats");

            if (error) {
                printError(error);
            } else {
                console.log("updateProfileViewStats: Updated click stats and done");
            }
            finalAppResponse( callbackResponse);
        });


        // Get this user's guid click stats, make sure he's not cheating and clicking too much

        // If click for specific userId NOT GUID more than a day ago, then +1
        // ELse ignore
        /** Get data where user hasn't clicked in past 24 hours */
        /** If this is not true, then we have to update profile clicks and do insert */
    
        // connection.query({
        //     sql: 'SELECT * FROM `profile_view_history` WHERE `user_id` = ? AND `guid` = ? and `timestamp` >= now() - INTERVAL 7 DAY',
        //     values: [userId, fguid]
        // }, 
        // function (error, results, fields) {
                   
        //     printTimeForEvent("Select cheat prevention stats");

        //     if (error) {
        //         printError(error);
        //         finalAppResponse( callbackResponse);

        //     } else {
        //         console.log("updateProfileViewStats: Got click stats");

        //         // If user recently clicked update stalked info
        //         // Update clicks, but not timestamp
        //         if ( results.length > 0 ) {
        //             console.log("updateProfileViewStats: results.length > 0");

        //             // Do nothing maybe monitor stalking???
                    
        //             var sql = "INSERT INTO `profile_view_history` SET `user_id` = ?, `guid` = ? ON DUPLICATE KEY UPDATE `clicks`=`clicks`+1"; 

        //             connection.query({
        //                 sql: sql,
        //                 values: [userId, fguid]
        //             }, 
        //             function (error, results, fields) {

        //                 printTimeForEvent("Done inserting cheat prevention stats");

        //                 if (error) {
        //                     printError(error);
        //                 } else {
        //                     console.log("updateProfileViewStats: Updated click stats and done");
        //                 }
        //                 finalAppResponse( callbackResponse);
        //             }); 
        //         } else {
        //             console.log("updateProfileViewStats: results.length == 0");

        //             //  If no stats exists, they clicked more than a day ago or never at all,
        //             //  Update user profile                
        //             console.log(userId + " " + fguid+ " " + 1);
        //             console.log("fguid length " + fguid.length);
                    
        //             var updateTimestampSql = "INSERT INTO `profile_view_history` SET `user_id` = ?, `guid` = ? ON DUPLICATE KEY UPDATE `clicks`=`clicks`+1, `timestamp` = now()"; // Lat=VALUES(Lat), Lon=VALUES(Lon), Time=VALUES(Time)'"
                    
        //             connection.query({
        //                 sql: updateTimestampSql,
        //                 values: [ userId, fguid ]
        //             }, 
        //             function (error, results, fields) {

        //                 console.log("not called");

        //                 if (error) {
        //                     console.log("Some error called");
        //                     printError(error);
        //                     finalAppResponse( callbackResponse);
        //                 } else {
        //                     console.log("Inserted click stats for cheat prevention");
        //                 // Update profile

        //                     var updateProfile = 'UPDATE `profile` SET `clicks` = `clicks` + 1 WHERE `guid` = ?';

        //                     connection.query({
        //                         sql: updateProfile,
        //                         values: [ fguid ]
        //                     }, 
        //                     function (error, results, fields) {

        //                         if (error) {
        //                                 printError(error);
        //                         } else {
        //                             console.log("UPDATE click stats for cheat prevention and done 2");
        //                         }
        //                         finalAppResponse( callbackResponse);
        //                     });
        //                 }
        //             });
        //         }
        //     }
        // });
    }
    
    

    function ourAccount(guid, fguid) {
        return ( guid == fguid);
    }



    function isBoolean(val) {
        return typeof(val) === "boolean";
    }

    function intToBool(val) {
        if (!isInt(val) ) return false;
        return val === 0 ? false : true;
    }
         

    function isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
    }




/**
 * 
 * SELECT `guid`, `username`, `fullname`, `verified`, `is_private`, `domain`, `about`, followers, following, popularity FROM `profile` WHERE profile.`guid` = ?'
 * 
 * 
 *  SELECT profile.`guid`, `username`, `fullname`, `verified`, `is_private`, `domain`, `about`, followers, following, allow_view_followings, allow_view_followers, 
 *          user_metrics.popularity, user_metrics.total_profile_views, user_metrics.total_album_views, user_metrics.total_likes 
 *  FROM `profile` 
 *      LEFT JOIN user_metrics 
 *      ON user_metrics.guid = profile.guid 
 *  WHERE profile.`guid` = ?',

 */

    function queryMyPersonalProfile( guid ) {
        console.log("queryUsersPrivateInfo");

        connection.query({
            sql: 'SELECT profile.`guid`, `username`, `fullname`, `verified`, `is_private`, `domain`, `about`, followers, following, allow_view_followings, allow_view_followers, user_metrics.popularity, user_metrics.total_profile_views, user_metrics.total_album_views, user_metrics.total_likes FROM `profile` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE profile.`guid` = ?',
            // sql: 'SELECT `guid`, `username`, `fullname`, `verified`, `is_private`, `domain`, `about`, followers, following, popularity FROM `profile` WHERE profile.`guid` = ?',
            values: [ guid ]
        }, 
        function (error, results, fields) {
            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            } else if (results && results.length > 0) {
                    
                let result = results[0];

                var userInfo = {};
                userInfo[kGuid]         = result.guid;
                userInfo[kUserName]     = result.username;
                userInfo[kFullName]     = result.fullname;
                userInfo[kVerified]     = intToBool(result.verified);

                userInfo[kDomain]       = result.domain;
                userInfo[kAbout]        = result.about;
                userInfo[kPrivate]      = intToBool(result.is_private);

                userInfo[kAllowFollowersView]  = intToBool(result.allow_view_followers);
                userInfo[kAllowFollowingsView] = intToBool(result.allow_view_followings);


                userInfo[kFollowersCount] = result.followers;
                userInfo[kFollowingCount] = result.following;
                userInfo[kScore]          = result.popularity === null ? 0 : result.popularity;

                // if (result.total_profile_views === threshold) {
                    
                // }
                // .popularity, user_metrics.total_profile_views, user_metrics.total_album_views, user_metrics.total_likes,


                finalAppResponse( trendingProfileResponse(userInfo) );
            } else {
                console.log("queryUsersPrivateInfo: results.length < 0");

                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            }
        });
    }



    /**
     *  Returns users private info
     */

    function queryUsersPrivateInfo( guid ) {
        console.log("queryUsersPrivateInfo");

        var query = connection.query({
            sql: 'SELECT PRO.`guid`, PRO.`username`, PRO.`fullname`, PRO.`verified`, PRO.`is_private`, PRO.`domain` , PRO.`about`, UP.dob, UP.email, UP.mobile FROM `profile` AS PRO LEFT JOIN user_private as UP ON PRO.guid = UP.guid WHERE PRO.`guid` = ?',
            values: [guid]
        }, 
        function (error, results, fields) {
            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    if (results.length > 0) {
                        
                        let result = results[0];

                        var userInfo = {};
                        userInfo[kGuid]         = result.guid;
                        userInfo[kUserName]     = result.username;
                        userInfo[kFullName]     = result.fullname;
                        userInfo[kVerified]     = intToBool(result.verified);

                        userInfo[kDomain]    = result.domain;
                        userInfo[kAbout]     = result.about;
                        userInfo[kPrivate]   = intToBool(result.is_private);

                        let kDOB = "dob";
                        userInfo[kEmail]   = result.email;
                        userInfo[kMobile]  = result.mobile;
                        userInfo[kDOB]     = result.dob;


                        finalAppResponse( trendingProfileResponse(userInfo) );
                    } else {
                        console.log("queryUsersPrivateInfo: results.length < 0");

                        finalAppResponse( errorResponse(ErrorMessageGeneric) );
                    }
                } else {
                    console.log("Unknown error in results for Select query");
                    finalAppResponse( errorResponse(ErrorMessageGeneric) );
                }
            }
        });
    }




    /**
     *  Returns users profile only
     */

    function queryUsersPublicProfile( fguid ) {
        var query = connection.query({
            sql: 'SELECT `guid`, `username`, `fullname`, `verified`, `is_private`, `image_url`, `domain` , `about`, allow_view_followers, allow_view_followings  FROM `profile` WHERE `guid` = ?',
            values: [fguid]
        }, 
        function (error, results, fields) {
            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    if (results.length > 0) {
                        
                        let result = results[0];

                        var userInfo = {};
                        userInfo[kGuid]         = result.guid;
                        userInfo[kUserName]     = result.username;
                        userInfo[kFullName]     = result.fullname;
                        userInfo[kVerified]     = intToBool(result.verified);
                        userInfo[kProfileUrl]   = result.image_url;

                        userInfo[kDomain]       = result.domain;
                        userInfo[kAbout]        = result.about;
                        userInfo[kPrivate]      = intToBool(result.is_private);


                        userInfo[kAllowFollowersView]  = intToBool(result.allow_view_followers);
                        userInfo[kAllowFollowingsView] = intToBool(result.allow_view_followings);


                        finalAppResponse( trendingProfileResponse(userInfo) );
                    } else {
                        finalAppResponse( errorResponse(ErrorMessageGeneric) );
                    }
                } else {
                    console.log("Unknown error in results for Select query");
                    finalAppResponse( errorResponse(ErrorMessageGeneric) );
                }
            }
        });
    }


/**
 * 
 *  SELECT `profile`.`guid`, `profile`.image_url, `profile`.`username`, `profile`.`fullname`, `profile`.`about`, `profile`.`domain`, `profile`.`verified`,  COUNT(f1.`status`) as friend_count  
 *  FROM `profile` 
 *      LEFT JOIN `friends` f1 
 *      ON `profile`.`guid` = f1.`guid1` AND (f1.`status` = ? OR f1.`status` = ?) 
 *  WHERE `profile`.`guid` = ?";


 */


    /**
     *  Returns users profile and friend status
     */
    function queryUsersProfile(guid) {

            //sql: 'SELECT `guid`, `username`, `fullname`, `verified`, `is_private`, `image_url`, `domain` , `about`  FROM `profile` WHERE `guid` = ?',


        var friendCountProfileSql  = "SELECT `profile`.`guid`, allow_view_followers, allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count FROM `profile` WHERE `profile`.`guid` = ?";

        var friendCountProfileSqlParams = [ guid ];
                        

        var fullTripleSql = "SELECT `profile`.`guid`, allow_view_followers, allow_view_followings, `profile`.image_url, `profile`.`username`, `profile`.`fullname`, `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`followers` AS follower_count, f2.`status` as `status` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND f2.`guid2` = ? WHERE `profile`.`guid` = ?"; 

        var fullTripleSqlParams = [guid, fguid, fguid];


        var sqlQuery   = fullTripleSql;
        var parameters = fullTripleSqlParams;

        var isOurAccount =  ourAccount(guid, fguid);

       if ( isOurAccount ) {
           console.log("this is our account");
           sqlQuery   = friendCountProfileSql;
           parameters = friendCountProfileSqlParams;
       }

       
       
       
        console.log("SQL: " + sqlQuery);
        console.log("parameters: " + parameters);

        var query = connection.query({
            sql: sqlQuery,
            values: parameters
        },
        function (error, results, fields) {

            printTimeForEvent("Got user info");

            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
            else if (results && results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));


                var profileInfo = {};
                
                profileInfo[kGuid]      = results[0].guid;
                profileInfo[kUserName]  = results[0].username;
                profileInfo[kVerified]  = isVerified(results[0].verified);
                
                profileInfo[kProfileUrl]  = results[0].image_url;
                    
                profileInfo[kAllowFollowersView]  = intToBool(result.allow_view_followers);
                profileInfo[kAllowFollowingsView] = intToBool(result.allow_view_followings);

               

                if (results[0].fullname) {
                    profileInfo[kFullName] = results[0].fullname;
                }
                if (results[0].about) {
                    profileInfo[kAbout] = results[0].about;
                }
                if (results[0].domain) {
                    profileInfo[kDomain] = results[0].domain;
                }


                var followerStatus = results[0].status;
                
                console.log("Friend status: " + followerStatus);
                
                profileInfo[kFollowersCount]     = results[0].follower_count;



                 if ( !isOurAccount ) {
         
                    updateProfileViewStats(guid, fguid,  userProfileResponse(
                        profileInfo, followerStatus
                    ));

                 } else {
                    finalAppResponse( userProfileResponse(
                        profileInfo, followerStatus
                    ));
                 }
            } else {
                console.log("No results found");

                finalAppResponse( userProfileResponse(
                    null, Relationship.Unknown
                ));                
            }
        });
    }

/**
 * 
 *  Get profile info, friend count? 
 *  public albums
 * 
 * 
 *  SELECT `profile`.`guid`, `profile`.image_url, `profile`.`username`, `profile`.`fullname`, `profile`.`about`, `profile`.`domain`, `profile`.`verified`, f2.`status` as `status` 
 *  user_album.`title`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count`, 

 *  FROM `profile` 
*       INNER JOIN `friends` f2 
*       ON f2.`guid1` = ? AND f2.`guid2` = profile.guid
 *          INNER JOIN `user_album`
 *          ON profile.guid = user_album.guid AND is_private = 0 

 *  WHERE `profile`.`guid` = ?"; 





 *  FROM `profile` 
 *      LEFT JOIN `friends` f1 
 *      ON `profile`.`guid` = f1.`guid1` AND (f1.`status` = ? OR f1.`status` = ?) 
 *          LEFT JOIN `friends` f2 
 *          ON f2.`guid1` = ? AND f2.`guid2` = ? 
 *  WHERE `profile`.`guid` = ?"; 

 * 
 *  user_album.`title`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count`, 

 `profile`.`about`, `profile`.`domain`, `profile`.`verified`,  COUNT(f1.`status`) as friend_count, f2.`status` as `status` FROM `profile` LEFT JOIN `friends` f1 ON `profile`
 *  FROM `profile`
 *      INNER JOIN `user_album` 
 *      ON fa.fguid = user_album.guid AND fa.album_id = user_album.id 
 *          INNER JOIN `profile` 
 *          ON fa.fguid = profile.guid 
 *              LEFT JOIN user_metrics
 *              ON user_metrics.guid = profile.guid
 *  WHERE fa.guid = ? AND (newest_media_timestamp > NOW() - INTERVAL 1 DAY)  AND (newest_media_timestamp > last_viewed_timestamp OR last_viewed_timestamp IS null) ORDER BY newest_media_timestamp DESC LIMIT ?, ?";


 
    SELECT `profile`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
    FROM `profile` 
        LEFT JOIN `friends` f2 
        ON f2.`guid1` = ? AND profile.guid = f2.`guid2` 
            LEFT JOIN `user_album`
            ON profile.guid = user_album.guid 
                LEFT JOIN `album_permissions` AS ap 
                ON f2.`guid1` = ap.guid AND `profile`.guid = ap.fguid AND user_album.id = ap.album_id 
                    LEFT JOIN user_metrics
                    ON user_metrics.guid = profile.guid
    WHERE `profile`.`username` = ? AND count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) )
    ORDER BY user_album.newest_media_timestamp DESC 
    LIMIT ?";




    SELECT `profile`.`guid`, profile.`username` FROM profile;



 */


    function lowercaseAllUsernames() {

        connection.query({
            sql: "SELECT `profile`.`guid`, profile.`username` FROM profile"
        },
        function (error, results, fields) {

            printTimeForEvent("Got user info");

            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
            else if (results && results.length > 0) {
                
                console.log('Results:', JSON.stringify(results, null, 2));

                var list = [];

                results.forEach((result) => {

                    list.push([ result.guid, result.username.toLowerCase()]);
                        
                });                

                connection.query({
                    sql: 'INSERT INTO `profile` (guid, username) VALUES ? ON DUPLICATE KEY UPDATE username=VALUES(username)',
                    values: [list]
                }, 
                function (error, results, fields) {
                    if (error) {
                        printError(error);
                        finalAppResponse( errorResponse(ErrorMessageGeneric));  
                        
                    } else {
                        console.log('Error:', JSON.stringify(error, null, 2));
                        finalAppResponse( errorResponse("Done okay"));  
                        
                    }
                });
            }
        });
    }
    
    

    /**
     * 
     * 
     * 
     SELECT `profile`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
     FROM `profile` 
        LEFT JOIN user_metrics 
        ON user_metrics.guid = profile.guid 
            LEFT JOIN `friends` f2 
            ON f2.`guid1` = ? AND profile.guid = f2.`guid2` 
                LEFT JOIN `user_album` 
                ON profile.guid = user_album.guid 
                    LEFT JOIN `album_permissions` AS ap 
                    ON f2.`guid1` = ap.guid AND `profile`.guid = ap.fguid AND user_album.id = ap.album_id 
                    
    WHERE `profile`.`username` = ? AND (count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) )
    ORDER BY user_album.newest_media_timestamp DESC 
    LIMIT ?";




     SELECT `profile`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND profile.guid = f2.`guid2` LEFT JOIN (`user_album` LEFT JOIN `album_permissions` AS ap ON ap.guid = ? AND ap.fguid = user_album.guid AND user_album.id = ap.album_id) ON profile.guid = user_album.guid AND user_album.count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ?)) WHERE `profile`.`username` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?


var parameters = [guid, guid, Relationship.IsFollowing, Relationship.IsFollowing, username, numberOfItems ];



     */
    function getUserProfile(guid, username, numberOfItems) {
        console.log("getUserProfile: " + username);
            
        var sqlQuery = "SELECT `profile`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings, f2.`status` as `status` , user_album.`id`, number_of_replies, comments_on, number_of_total_replies, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND profile.guid = f2.`guid2` LEFT JOIN (`user_album` LEFT JOIN `album_permissions` AS ap ON ap.guid = ? AND ap.fguid = user_album.guid AND user_album.id = ap.album_id) ON profile.guid = user_album.guid AND user_album.count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ?)) WHERE `profile`.`username` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var sqlQuery = "SELECT `profile`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND profile.guid = f2.`guid2` LEFT JOIN `user_album` ON profile.guid = user_album.guid LEFT JOIN `album_permissions` AS ap ON f2.`guid1` = ap.guid AND `profile`.guid = ap.fguid AND user_album.id = ap.album_id LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `profile`.`username` = ? AND count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters = [guid, username, Relationship.IsFollowing, Relationship.IsFollowing, numberOfItems ];
        var parameters = [guid, guid, Relationship.IsFollowing, Relationship.IsFollowing, username, numberOfItems ];
        
        
        connection.query({
            sql: sqlQuery,
            values: parameters
        },
        function (error, results, fields) {

            printTimeForEvent("Got user info");

            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
            else if (results && results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));


                
                var profileInfo = {};
                
                profileInfo[kGuid]      = results[0].guid;
                profileInfo[kUserName]  = results[0].username;
                profileInfo[kVerified]  = isVerified(results[0].verified);
                
                profileInfo[kProfileUrl]  = results[0].image_url;
                profileInfo[kPrivate]     = intToBool(results[0].is_private);
            
                if (results[0].fullname) {
                    profileInfo[kFullName] = results[0].fullname;
                }
                if (results[0].about) {
                    profileInfo[kAbout] = results[0].about;
                }
                if (results[0].domain) {
                    profileInfo[kDomain] = results[0].domain;
                }

                
                profileInfo[kAllowFollowersView]  = intToBool(results[0].allow_view_followers);
                profileInfo[kAllowFollowingsView] = intToBool(results[0].allow_view_followings);


                profileInfo[kFollowersCount] = results[0].followers;
                profileInfo[kFollowingCount] = results[0].following;
                profileInfo[kScore]          = results[0].popularity === null ? 0 : results[0].popularity;



                
                var followerStatus            = results[0].status;
                console.log("Follower status: " + followerStatus);
                
                

                var albums = [];


                results.forEach((result) => {
                
                    if ( isInt(result.count) && result.count > 0 ) {
                        
                        var album = {};
                    
                        album[kAlbumId]              = result.id;
                        album[kTitle]                = result.title;

                        album[kCount]                = result.count;
                        console.log("result.create_date.toString(): " + result.create_date.toString());
                        album[kCreateDate]           = result.create_date.toString();
                        album[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                        
                        album[kExplicit]             = intToBool(result.explicit);

                        

                        var params = {  Bucket  : ALBUM_BUCKET,  
                                        Key     : albumCoverThumbnailKey(result.guid, result.cover_album_url), 
                                        Expires : S3_EXPIRE_LIMIT 
                                    };
                        var signedUrl = s3.getSignedUrl('getObject', params);
                        printTimeForEvent("End SignedUrl for media url: " + result.cover_album_url);
                        printTimeForEvent("signedUrl: " + signedUrl);
                        
                        album[kAlbumCover]      = result.cover_album_url;
                        album[kSignedUrl]       = signedUrl; //result.signed_url;



                        album[kFirstUrl]          = result.first_url;
                        album[kTimestamp]         = result.first_timestamp.toString();

                        album[kSignedFirstUrl]    = s3.getSignedUrl('getObject', 
                                                    {   Bucket  : ALBUM_BUCKET,  
                                                        Key     : albumFirstMediaKey(result.guid, result.first_url), 
                                                        Expires : S3_EXPIRE_LIMIT 
                                                    });


                        album[kLikeCount]             = result.likes;
                        album[kDislikeCount]          = result.dislikes;
                        album[kViews]                 = result.views;
                        album[kPrivate]               = result.album_privacy
                        
                        album[kCommentCount]         = result.number_of_replies; // number of total comments and replies
                        album[kCommentTotalCount]    = result.number_of_total_replies; // number of total comments and replies
                        album[kCommentsOn]          = intToBool(result.comments_on);


                        
                        albums.push(album);
                        
                    }
                });

                var response = userProfileResponse(
                    profileInfo, followerStatus
                );

                var albumInfo = {};
                albumInfo[kAlbums] = albums;
                albumInfo[kCount] = albums.length;

                response[kAlbumInfo] =  albumInfo;

                var isOurAccount =  ourAccount(guid, fguid);
                
                if ( !isOurAccount ) {
                    updateProfileViewStats(guid, profileInfo[kGuid], response);
                } else {
                    finalAppResponse(response);
                }
            } else {
                console.log("No results found");

                finalAppResponse( newErrorResponse(ErrorType.UserNotFound));  
                
                
                // finalAppResponse( userProfileResponse(
                //     null, Relationship.Unknown
                // ));                
            }
        });
    }


        
        

    /**
     *  Returns only public albums 
     */
    
 
    function loadMoreAlbums(guid, mediaTimestamp, albumId, numberOfItems) {

        console.log("loadMoreAlbums");

// queryUsersProfileAndAlbums



        // var parameters = [guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, mediaTimestamp, albumId, numberOfItems ];
        

        // var sqlQuery2 = "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.explicit, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND f2.`guid2` = ? LEFT JOIN `album_permissions` AS ap ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid LEFT JOIN `user_album` ON user_album.guid = profile.guid AND ( (profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) WHERE `profile`.`guid` = ? AND user_album.`newest_media_timestamp` <= FROM_UNIXTIME(?) AND user_album.`id` <> ?  ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters2 = [guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, mediaTimestamp, albumId, fguid, numberOfItems ];

        var sqlQuery = "SELECT `profile`.guid, comments_on, `profile`.`is_private`, f2.`status` as `status` , user_album.`id`, user_album.number_of_replies, user_album.number_of_total_replies, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND profile.guid = f2.`guid2` LEFT JOIN `user_album` ON profile.guid = user_album.guid LEFT JOIN `album_permissions` AS ap ON f2.`guid1` = ap.guid AND `profile`.guid = ap.fguid AND user_album.id = ap.album_id WHERE `profile`.`guid` = ? AND count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) AND user_album.`newest_media_timestamp` <= FROM_UNIXTIME(?) AND user_album.`id` <> ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        var parameters = [guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, mediaTimestamp, albumId, numberOfItems ];

        

        if ( ourAccount(guid, fguid) ) {
            console.log("this is our account");

            // `profile`.image_url, `profile`.`username`, `profile`.`fullname`, `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`
            // sqlQuery   =  "SELECT `profile`.`guid`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views,  user_album.`create_date`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count` FROM `profile` LEFT JOIN `user_album` ON profile.guid = user_album.guid AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?"; 

            sqlQuery   =  "SELECT `profile`.`guid`, comments_on, user_album.`id`, user_album.number_of_replies,  user_album.number_of_total_replies, user_album.explicit,  user_album.explicit_override, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views,  UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `user_album` ON profile.guid = user_album.guid WHERE `profile`.`guid` = ? AND count > 0 AND user_album.`newest_media_timestamp` <= FROM_UNIXTIME(?) AND user_album.`id` <> ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?"; 

            parameters = [ guid, mediaTimestamp, albumId, numberOfItems ];
       }
       


        // var sqlQuery = "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, user_album.`create_date`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND f2.`guid2` = profile.guid LEFT JOIN `user_album` ON profile.guid = user_album.guid AND (profile.is_private = 0 AND user_album.is_private = 0 ) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) LEFT JOIN `album_permissions` AS ap ON profile.guid = user_album.guid AND ( user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = ? AND ap.fguid  = ? ) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters = [guid, Relationship.IsFollowing, Relationship.IsFollowing, guid, fguid, fguid, numberOfItems ];



        // var sqlQuery = "SELECT user_album.`id`, user_album.`title`, user_album.first_url, user_album.is_private, user_album.likes, user_album.dislikes, user_album.views, user_album.`create_date`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count` FROM `user_album` WHERE `user_album`.`guid` = ? AND is_private = 0 AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) AND user_album.`newest_media_timestamp` <= ? AND user_album.`id` <> ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        //  var parameters = [guid, mediaTimestamp, albumId, numberOfItems ];


        console.log("SQL: " + sqlQuery);
        console.log("parameters: " + parameters);

        
        connection.query({
            sql: sqlQuery,
            values: parameters
        },
        function (error, results, fields) {

            printTimeForEvent("Got user info");

            var albumInfo = {};
            albumInfo[kCount] = 0;
            albumInfo[kAlbums] = null;

            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
            else if (results && results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));

                var albums = [];

                results.forEach((result) => {
                   
                    if (result.count !== undefined && result.count !== null && result.count > 0 ) {
                        
                        var album = {};
                       
                        album[kAlbumId]              = result.id;
                        album[kTitle]                = result.title;

                        album[kCount]                = result.count;
                        console.log("result.create_date.toString(): " + result.create_date.toString());
                        album[kCreateDate]           = result.create_date.toString();


                        album[kExplicit]             = intToBool(result.explicit);
                        // if ( ourAccount(guid, fguid) ) {
                        //     album[kExplicitOverride]     = intToBool(result.explicit_override);
                        // }


                        var params = {  Bucket  : ALBUM_BUCKET,  
                                        Key     : albumCoverThumbnailKey(result.guid, result.cover_album_url), 
                                        Expires : S3_EXPIRE_LIMIT 
                                    };
                        var signedUrl = s3.getSignedUrl('getObject', params);
                        printTimeForEvent("End SignedUrl for media url: " + result.cover_album_url);
                        printTimeForEvent("signedUrl: " + signedUrl);
                        
                        album[kAlbumCover]      = result.cover_album_url;
                        album[kSignedUrl]       = signedUrl;

                        album[kFirstUrl]             = result.first_url;
                        album[kTimestamp]            = result.first_timestamp.toString();
                        album[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                        
                        album[kSignedFirstUrl]    = s3.getSignedUrl('getObject', 
                                                    {   Bucket  : ALBUM_BUCKET,  
                                                        Key     : albumFirstMediaKey(result.guid, result.first_url), 
                                                        Expires : S3_EXPIRE_LIMIT 
                                                    });

                        album[kPrivate]              = intToBool(result.is_private);
                       
                        album[kLikeCount]             = result.likes;
                        album[kDislikeCount]          = result.dislikes;
                        album[kViews]                 = result.views;
                       
                        album[kCommentCount]         = result.number_of_replies; // number of total comments and replies
                        album[kCommentTotalCount]    = result.number_of_total_replies; // number of total comments and replies
                        album[kCommentsOn]          = intToBool(result.comments_on);

                        albums.push(album);
                    }
                });

                albumInfo[kAlbums] = albums;
                albumInfo[kCount] = albums.length;
            }

            finalAppResponse( fetchAlbumsResponse( albumInfo ));
        });
    }

    


/**
 * 
 *  SELECT f2.`status` as `status`, user_album.`id`, user_album.`title`, user_album.`create_date`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, user_album.`count` 
 *  FROM `friends` f2
*       LEFT JOIN `user_album` 
*       ON profile.is_private = 0 AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) 
 *  WHERE f2.`guid1` = ? AND f2.`guid2` = ?
 *  ORDER BY user_album.newest_media_timestamp 
 *  DESC LIMIT ?";
 * 
 * 
 * 
 * SELECT profile.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`, user_album.`create_date`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, user_album.`count` 
 * FROM `profile` 
 *      LEFT JOIN `friends` f2 
 *      ON f2.`guid1` = profile.guid AND f2.`guid2` = ? 
 *          LEFT JOIN `user_album` 
 *          ON user_album.guid = profile.guid AND (profile.is_private = 0 OR `status` == ?) AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) 
 * WHERE `profile`.`guid` = ? 
 * ORDER BY user_album.newest_media_timestamp 
 * DESC LIMIT ?";
 * 
 * 
 * status = following
 */





    /**
    * Used in user clicks a trending album. We get full profile and other albums
    */
    

/**
 * 
 *  SELECT `profile`.guid, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, f2.`status` as `status`, user_album.`id`, user_album.`title`,        user_album.`create_date`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, `user_album`.`count`, user_album.likes, user_album.dislikes  
 * 
 *  FROM `profile` 
 *      LEFT JOIN `friends` f2 
 *      ON f2.`guid1` = profile.guid AND f2.`guid2` = ? 
 *          LEFT JOIN `user_album` 
 *          ON profile.guid = user_album.guid AND (profile.is_private = 0 OR f2.`status` = ?) AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) 
 *  WHERE `profile`.`guid` = ? 
 *  ORDER BY user_album.newest_media_timestamp 
 *  DESC LIMIT ?";


 *  SELECT `profile`.guid, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, f2.`status` as `status`, user_likes.`album_id`, user_likes.`liked`  
 * 
 *  FROM `profile` 
 *      LEFT JOIN `friends` f2 
 *      ON f2.`guid1` = profile.guid AND f2.`guid2` = ? 
 *          LEFT JOIN `user_likes` 
 *          ON user_likes.guid = ? AND profile.guid = user_likes.fguid AND user_likes.album_id = ? AND (profile.is_private = 0 OR f2.`status` = ?) AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) 
 *  WHERE `profile`.`guid` = ? 
 *  ORDER BY user_album.newest_media_timestamp 
 *  DESC LIMIT ?";


        var parameters = [guid, guid, albumId, Relationship.IsFollowing, fguid, numberOfItems ];


Trening album
albun_id, title, private = false, image_url

Click album:



    SELECT `profile`.guid, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, f2.`status` as `status`, user_likes.`album_id`, user_likes.`liked` 
    
    FROM `profile` 
        LEFT JOIN `friends` f2 
        ON f2.`guid1` = profile.guid AND f2.`guid2` = ? 
            LEFT JOIN `user_likes` 
            ON user_likes.guid = ? AND profile.guid = user_likes.fguid AND user_likes.album_id = ? AND (profile.is_private = 0 OR f2.`status` = ?) 
        WHERE `profile`.`guid` = ? 
        DESC LIMIT ?";
       

        user_profile private, album private, 



       Trending albums

       Friends Albums
       
       SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, 
       f2.`status` as `status`, 
       user_album_likes.`album_id`, user_album_likes.`liked` 
        FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = profile.guid AND f2.`guid2` = ? LEFT JOIN `user_album_likes` ON user_album_likes.guid = ? AND profile.guid = user_album_likes.fguid AND user_album_likes.album_id = ? AND (profile.is_private = 0 OR f2.`status` = ?) WHERE `profile`.`guid` = ?";




        // PUBLIC

        SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, user_album_likes.`album_id`, user_album_likes.`liked` 
        FROM `user_album` 
            INNER JOIN profile
            ON `profile`.guid = user_album.guid
                    LEFT JOIN `user_album_likes` 
                    ON user_album_likes.guid = ? AND profile.guid = user_album_likes.fguid AND user_album_likes.album_id = ?
        WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND profile.is_private = 0




        // PRIVATE

        SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, f2.`status` as `status`, user_album_likes.`album_id`, user_album_likes.`liked` 
        FROM `user_album` 
            INNER JOIN profile
            ON `profile`.guid = user_album.guid
                LEFT JOIN `friends` f2 
                ON profile.guid = f2.`guid2` AND f2.`guid1` = ? 
                    LEFT JOIN `user_album_likes` 
                    ON user_album_likes.guid = ? AND profile.guid = user_album_likes.fguid AND user_album_likes.album_id = ? AND (profile.is_private = 0 OR f2.`status` = ?) 
        WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0




        

 */

    // Get album details
    // Two functions: One for public album (faster search) and private album
 

    /**
     * 
     * 
        SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) as create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
        FROM `bookmarked_album` AS ba 
            INNER JOIN  `user_album` AS ua 
            ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id 
                LEFT JOIN `friends` 
                ON friends.guid1 = ? AND friends.guid2 = ua.guid AND friends.`status` = ? 
                    INNER JOIN album_permissions AS ap 
                    ON ua.`is_private` = 0 OR (ap.guid = friends.guid1 AND ap.fguid = friends.guid2 AND ap.album_id = ua.id) 
                        INNER JOIN `profile` 
                        ON ua.guid = profile.guid 
        WHERE ua.expire_date IS NULL OR ua.expire_date > NOW() 
        ORDER BY ba.`timestamp` DESC LIMIT ?";


        bookmarked_album

        
        FROM `user_album` 
            INNER JOIN profile 
            ON `profile`.guid = user_album.guid 
                OUTER JOIN `user_album_likes` AS ual
                ON ual.guid = ? AND profile.guid = ual.fguid AND ual.album_id = ? 
        WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND profile.is_private = 0";

        (SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked 
        FROM `user_album_likes` AS ual
             LEFT JOIN bookmarked_album ba 
             ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id 
        WHERE ual.guid = ? AND ual.fguid =  ? AND ual.album_id = ? ) UNION 
        (SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked 
        FROM bookmarked_album ba 
            LEFT JOIN `user_album_likes` AS ual 
            ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id
            
        WHERE ba.guid = ? AND ba.fguid  = ? AND ba.album_id = ?)";



     */


let kBookmarked  = "BookmarkAlbum"
let kUnbookmarked = "UnbookmarkAlbum"



// SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked 
// FROM user_album AS ua
//     LEFT JOIN `user_album_likes` AS ual 
//     ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.album_id 
//     LEFT JOIN bookmarked_album ba 
//         ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id 
//  WHERE ua.guid = ? AND ua.id = ?
    


// SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked 
// FROM `user_album_likes` AS ual 
//     LEFT JOIN bookmarked_album ba 
//     ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id 
//     WHERE ual.guid = ? AND ual.fguid =  ? AND ual.album_id = ?
    

// SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked 
// FROM `user_album_likes` AS ual 
//     LEFT JOIN bookmarked_album ba 
//     ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id 
//     WHERE ual.guid = ? AND ual.fguid =  ? AND ual.album_id = ? ) 
    
// UNION (
// SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked     
// FROM bookmarked_album ba 
//     LEFT JOIN `user_album_likes` AS ual 
//     ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id 
//     WHERE ba.guid = ? AND ba.fguid  = ? AND ba.album_id = ?)";


    function albumDetails(guid, fguid, albumId) {
    
        console.log("albumDetails");

        
        // SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked 
        // FROM user_album AS ua 
        //     LEFT JOIN `user_album_likes` AS ual 
        //     ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id 
        //         LEFT JOIN bookmarked_album ba 
        //         ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id
        // WHERE ua.guid = ? AND ua.id = ?";
        
// SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked FROM user_album AS ua LEFT JOIN `user_album_likes` AS ual ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.album_id LEFT JOIN bookmarked_album ba ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id WHERE ua.guid = ? AND ua.id = ?

        var sqlQuery = "SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked FROM user_album AS ua LEFT JOIN `user_album_likes` AS ual ON ual.guid = ? AND ual.fguid = ua.guid AND ual.album_id = ua.id LEFT JOIN bookmarked_album ba ON ba.guid = ? AND ba.fguid = ua.guid AND ba.album_id = ua.id WHERE ua.guid = ? AND ua.id = ?";
        var parameters = [guid, guid, fguid, albumId ];
        
        // var sqlQuery = "(SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked FROM `user_album_likes` AS ual LEFT JOIN bookmarked_album ba ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id WHERE ual.guid = ? AND ual.fguid =  ? AND ual.album_id = ? ) UNION (SELECT ual.`album_id`, ual.`liked`, ba.album_id as bookmarked FROM bookmarked_album ba LEFT JOIN `user_album_likes` AS ual ON ual.guid = ba.guid AND ual.fguid = ba.fguid AND ual.album_id = ba.album_id WHERE ba.guid = ? AND ba.fguid  = ? AND ba.album_id = ?)";
        // var parameters = [guid, fguid, albumId, guid, fguid, albumId ];

        // var isOurAccount =  ourAccount(guid, fguid);

        // if ( isOurAccount ) {
        //     console.log("this is our account");

        //     sqlQuery = "SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, user_likes.`album_id`, user_likes.`liked` FROM `profile` LEFT JOIN `user_likes` ON user_likes.guid = ? AND profile.guid = user_likes.fguid AND user_likes.album_id = ? WHERE `profile`.`guid` = ?";
        //     parameters = [ guid, albumId, guid ];
        // }
        
        
        // console.log("SQL: " + sqlQuery);
        // console.log("parameters: " + parameters);

        var query = connection.query({
            sql   : sqlQuery,
            values: parameters
        },
        function (error, results, fields) {

            printTimeForEvent("Got user info");

            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
            else if (results && results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));


                var response = {};
                response[kActive]     = ActiveValues.Active;
                response[kLike]       = results[0].liked;
                response[kBookmarked] = results[0].bookmarked !== null ? true : false;
                
                if ( !ourAccount(guid, fguid) ) {
                    updateProfileViewStats(guid, fguid, response);
                } else {
                    finalAppResponse(response);
                }

                

                
                
                // var profileInfo = {};
                
                

                // profileInfo[kGuid]      = results[0].guid;
                // profileInfo[kUserName]  = results[0].username;
                // profileInfo[kVerified]  = isVerified(results[0].verified);
                
                // profileInfo[kProfileUrl]  = results[0].image_url;
                // profileInfo[kPrivate]     = results[0].is_private;
                
                
                // profileInfo[kAllowFollowersView]  = intToBool(results[0].allow_view_followers);
                // profileInfo[kAllowFollowingsView] = intToBool(results[0].allow_view_followings);


                // profileInfo[kFollowersCount]     = results[0].follower_count;
                // profileInfo[kLike]               = results[0].liked;


                // if (results[0].fullname) {
                //     profileInfo[kFullName] = results[0].fullname;
                // }
                // if (results[0].about) {
                //     profileInfo[kAbout] = results[0].about;
                // }
                // if (results[0].domain) {
                //     profileInfo[kDomain] = results[0].domain;
                // }

                // profileInfo[kFollowersCount]     = results[0].follower_count;

                // var followerStatus = results[0].status;
                
                // console.log("Friend status: " + followerStatus);
                
                

                // var albums = [];


                // results.forEach((result) => {
                    
                //     if (result.count !== undefined && result.count !== null && result.count > 0 ) {
                        
                //         var album = {};
                        
                //         album[kAlbumId]              = result.id;
                //         album[kTitle]                = result.title;

                //         album[kCount]                = result.count;
                //         album[kLikeCount]            = result.likes;
                //         album[kDislikeCount]         = result.dislikes;

                //         console.log("result.create_date.toString(): " + result.create_date.toString());

                //         album[kCreateDate]           = result.create_date.toString();
                //         album[kAlbumCover]           = result.cover_album_url;
                //         album[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                        
                        
                        
                //         albums.push(album);
                //     }
                // });

                // var response = userProfileResponse(
                //     profileInfo, followerStatus
                // );

                // var albumInfo = {};
                // albumInfo[kAlbums] = albums;
                // albumInfo[kCount] = albums.length;

                // response[kAlbumInfo] =  albumInfo;

                // if ( !isOurAccount ) {
                //     updateProfileViewStats(guid, fguid, response);
                // } else {
                //     finalAppResponse(response);
                // }
            } else {
                console.log("No results found");

            // case 0: return .none
            // case 1: return .liked
            // case 2: return .disliked
            // default: return .none


                var response = {};
                response[kActive]     = ActiveValues.Active;
                response[kLike]       = 0;
                response[kBookmarked] = false;
                
                if ( !ourAccount(guid, fguid) ) {
                    updateProfileViewStats(guid, fguid, response);
                } else {
                    finalAppResponse(response);
                }          
            }
        });
    }


    function queryUsersFullProfileAndAlbums(guid, albumId, numberOfItems) {

        console.log("queryUsersFullProfileAndAlbums");

        var sqlQuery = "SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, user_album_likes.`album_id`, user_album_likes.`liked` FROM `user_album` INNER JOIN profile ON `profile`.guid = user_album.guid LEFT JOIN `user_album_likes` ON user_album_likes.guid = ? AND profile.guid = user_album_likes.fguid AND user_album_likes.album_id = ? WHERE user_album.guid = ? AND user_album.id = ? AND user_album.is_private = 0 AND profile.is_private = 0";

    // user_album.likes, user_album.dislikes, user_album.views, 
        // var sqlQuery = "SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, f2.`status` as `status`, user_album_likes.`album_id`, user_album_likes.`liked` FROM `profile` LEFT JOIN `friends` f2 ON profile.guid = f2.`guid2` AND f2.`guid1` = ? LEFT JOIN `user_album_likes` ON user_album_likes.guid = ? AND profile.guid = user_album_likes.fguid AND user_album_likes.album_id = ? AND (profile.is_private = 0 OR f2.`status` = ?) WHERE `profile`.`guid` = ?";
       
       // var sqlQuery = "SELECT `profile`.guid, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, f2.`status` as `status`, user_album.`id`, user_album.`title`, user_album.`create_date`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, `user_album`.`count`, user_album.likes, user_album.dislikes  FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = profile.guid AND f2.`guid2` = ? LEFT JOIN `user_album` ON profile.guid = user_album.guid AND (profile.is_private = 0 OR f2.`status` = ?) AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";

        var parameters = [guid, guid, albumId, fguid ];

        var isOurAccount =  ourAccount(guid, fguid);

        if ( isOurAccount ) {
            console.log("this is our account");

            /**
             
            SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, user_likes.`album_id`, user_likes.`liked` 
            FROM `profile` 
                LEFT JOIN `user_likes` 
                ON user_likes.guid = ? AND profile.guid = user_likes.fguid AND user_likes.album_id = ? 
            WHERE `profile`.`guid` = ?";

             */
            sqlQuery = "SELECT `profile`.guid, profile.allow_view_followers, profile.allow_view_followings, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, user_likes.`album_id`, user_likes.`liked` FROM `profile` LEFT JOIN `user_likes` ON user_likes.guid = ? AND profile.guid = user_likes.fguid AND user_likes.album_id = ? WHERE `profile`.`guid` = ?";

            // `profile`.image_url, `profile`.`username`, `profile`.`fullname`, `profile`.`about`, `profile`.`domain`, `profile`.`verified`, `profile`.`is_private`
            
            //sqlQuery   =  "SELECT `profile`.`guid`, `profile`.`username`, `profile`.`fullname`, `profile`.`verified`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`about`, `profile`.`domain`, `profile`.`followers` AS follower_count, user_album.`id`, user_album.`title`, user_album.`create_date`, user_album.`cover_album_url`, user_album.`newest_media_timestamp`, user_album.`count`, user_album.likes, user_album.dislikes FROM `profile` LEFT JOIN `user_album` ON profile.guid = user_album.guid AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?"; 
          
            parameters = [ guid, albumId, guid ];
       }
       
       
        console.log("SQL: " + sqlQuery);
        console.log("parameters: " + parameters);

        var query = connection.query({
            sql: sqlQuery,
            values: parameters
        },
        function (error, results, fields) {

            printTimeForEvent("Got user info");

            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
            else if (results && results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));


                var profileInfo = {};
                
                

                profileInfo[kGuid]      = results[0].guid;
                profileInfo[kUserName]  = results[0].username;
                profileInfo[kVerified]  = isVerified(results[0].verified);
                
                profileInfo[kProfileUrl]  = results[0].image_url;
                profileInfo[kPrivate]     = results[0].is_private;
                
                
                profileInfo[kAllowFollowersView]  = intToBool(results[0].allow_view_followers);
                profileInfo[kAllowFollowingsView] = intToBool(results[0].allow_view_followings);


                profileInfo[kFollowersCount]     = results[0].follower_count;
                profileInfo[kLike]               = results[0].liked;


                if (results[0].fullname) {
                    profileInfo[kFullName] = results[0].fullname;
                }
                if (results[0].about) {
                    profileInfo[kAbout] = results[0].about;
                }
                if (results[0].domain) {
                    profileInfo[kDomain] = results[0].domain;
                }

                profileInfo[kFollowersCount]     = results[0].follower_count;

                var followerStatus = results[0].status;
                
                console.log("Friend status: " + followerStatus);
                
                

                var albums = [];


                results.forEach((result) => {
                   
                    if (result.count !== undefined && result.count !== null && result.count > 0 ) {
                        
                        var album = {};
                       
                        album[kAlbumId]              = result.id;
                        album[kTitle]                = result.title;

                        album[kCount]                = result.count;
                        album[kLikeCount]            = result.likes;
                        album[kDislikeCount]         = result.dislikes;

                        console.log("result.create_date.toString(): " + result.create_date.toString());

                        album[kCreateDate]           = result.create_date.toString();
                        album[kAlbumCover]           = result.cover_album_url;
                        album[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                        
                        
                       
                        albums.push(album);
                    }
                });

                var response = userProfileResponse(
                    profileInfo, followerStatus
                );

                var albumInfo = {};
                albumInfo[kAlbums] = albums;
                albumInfo[kCount] = albums.length;

                response[kAlbumInfo] =  albumInfo;

                if ( !isOurAccount ) {
                    updateProfileViewStats(guid, fguid, response);
                } else {
                    finalAppResponse(response);
                }
            } else {
                console.log("No results found");

                finalAppResponse( userProfileResponse(
                    null, Relationship.Unknown
                ));                
            }
        });
    }



    /**
     * 
     * 
     * 
     * 
     * 
     SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
     FROM `profile` 
        LEFT JOIN `friends` f2 
        ON f2.`guid1` = ? AND f2.`guid2` = profile.guid 
            LEFT JOIN `user_album` 
            ON user_album.guid = profile.guid 
                LEFT JOIN `album_permissions` AS ap 
                ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND ap.album_id = user_album.id 
    WHERE `profile`.`guid` = ? AND ( (profile.is_private = 0 AND user_album.is_private = 0 ) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = ? AND  ap.fguid = ?) ) 
    ORDER BY user_album.newest_media_timestamp DESC 
    LIMIT ?";


SELECT `profile`.guid, `profile`.`is_private`-- , f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
FROM `profile` 
	LEFT JOIN `friends` f2 
    ON f2.`guid1` = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd' AND f2.`guid2` = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357'
		LEFT JOIN `user_album` 
		ON user_album.guid = profile.guid 
			LEFT JOIN `album_permissions` AS ap 
			ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND ap.album_id = user_album.id 
WHERE `profile`.`guid` = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357' AND ( (profile.is_private = 0 AND user_album.is_private = 0 ) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = 3) OR (user_album.is_private = 1 AND f2.`status` = 3 AND ap.guid = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357' AND  ap.fguid = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357') ) 
-- ORDER BY user_album.newest_media_timestamp DESC 
LIMIT 4;




SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
FROM `profile` 
	LEFT JOIN `friends` f2 
    ON f2.`guid1` = 'us-east-1:614dfefb-191c-4935-8cea-e53af6f320cd' AND f2.`guid2` = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357'
		LEFT JOIN `user_album`
		ON user_album.guid = profile.guid AND ( (profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = 3) ) 
			LEFT JOIN `album_permissions` AS ap 
			ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND ap.album_id = user_album.id AND user_album.guid = profile.guid AND user_album.is_private = 1 AND f2.`status` = 3 
WHERE `profile`.`guid` = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357' -- AND ( OR (user_album.is_private = 1 AND f2.`status` = 3 AND ap.guid = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357' AND ap.fguid = 'd09a7285-0c1d-4b34-b634-fd55ee7cc94a-0acaf357') ) 
ORDER BY user_album.newest_media_timestamp DESC 
LIMIT 4;





SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid2` = profile.guid LEFT JOIN `user_album` ON user_album.guid = profile.guid LEFT JOIN `album_permissions` AS ap ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND ap.album_id = user_album.id WHERE `profile`.`guid` = ? AND (f2.`guid1` = ? AND f2.`guid2` = ?) AND ( (profile.is_private = 0 AND user_album.is_private = 0 ) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = ? AND  ap.fguid = ?) ) ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";


Profile and albums are public                       ==   profile.is_private = 0 AND user_album.is_private = 0

Profile is private and album is for all followers   ==   profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?

Album is private and user is follower w/ permission ==   user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = ? AND  ap.fguid = ?

     */



        // var parameters = [guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, fguid, numberOfItems ];



// Select users profile and albums

/*






SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
FROM `profile` 
    LEFT JOIN `friends` f2 
    ON profile.guid = f2.`guid2`
        LEFT JOIN `user_album` 
        ON profile.guid = user_album.guid 
            LEFT JOIN `album_permissions` AS ap
            ON f2.`guid1` = ap.guid AND profile.guid = ap.fguid AND user_album.id = ap.album_id
WHERE `profile`.`guid` = ? AND f2.`guid1` = ? 




SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
FROM `profile` 
    LEFT JOIN `friends` f2 
    ON profile.guid = f2.`guid2`
        LEFT JOIN `album_permissions` AS ap
        ON f2.`guid1` = ap.guid AND profile.guid = ap.fguid
            LEFT JOIN `user_album` 
            ON profile.guid = user_album.guid 
WHERE `profile`.`guid` = ? AND f2.`guid1` = ? 

    AND ( 
        (profile.is_private = 0 AND user_album.is_private = 0) 
        OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) 
        OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) 

ORDER BY user_album.newest_media_timestamp DESC 
LIMIT ?";



SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND profile.guid = f2.`guid2` LEFT JOIN `user_album` ON profile.guid = user_album.guid LEFT JOIN `album_permissions` AS ap ON f2.`guid1` = ap.guid AND `profile`.guid = ap.fguid AND user_album.id = ap.album_id WHERE `profile`.`guid` = ? AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";

    var parameters = [guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, numberOfItems ];



    SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
    FROM `profile` 
        LEFT JOIN `friends` f2 
        ON f2.`guid1` = ? AND profile.guid = f2.`guid2` 
            LEFT JOIN `user_album` 
            ON profile.guid = user_album.guid 
                LEFT JOIN `album_permissions` AS ap 
                ON f2.`guid1` = ap.guid AND `profile`.guid = ap.fguid AND user_album.id = ap.album_id 
    WHERE `profile`.`guid` = ? AND count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) 
    ORDER BY user_album.newest_media_timestamp DESC 
    LIMIT ?";
*/


let kCommentsOn = "commentsOn";

    function queryFriendStatusAndAlbums(guid, numberOfItems) {

        console.log("queryFriendStatusAndAlbums");


        console.log("guid: " + guid);
        console.log("fguid: " + fguid);
        

        // var sqlQuery = "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, user_album.`create_date`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND f2.`guid2` = profile.guid LEFT JOIN `user_album` ON profile.guid = user_album.guid AND (profile.is_private = 0 OR f2.`status` = ?) AND (user_album.newest_media_timestamp > NOW() - INTERVAL 7 DAY) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters = [guid, Relationship.IsFollowing, fguid, numberOfItems ];


        // LAST ONE
        // var sqlQuery = "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid2` = profile.guid LEFT JOIN `user_album` ON user_album.guid = profile.guid LEFT JOIN `album_permissions` AS ap ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND ap.album_id = user_album.id WHERE `profile`.`guid` = ? AND (f2.`guid1` = ? AND f2.`guid2` = ?) AND ( (profile.is_private = 0 AND user_album.is_private = 0 ) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = ? AND  ap.fguid = ?) ) ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters = [fguid, guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, guid, fguid, numberOfItems ];


        // var sqlQuery2 =  "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND f2.`guid2` = ? LEFT JOIN `album_permissions` AS ap ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid LEFT JOIN `user_album` ON user_album.guid = profile.guid AND ( (profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND user_album.id = ap.album_id) ) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters2 = [guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, fguid, numberOfItems ];


    /*
    
    
    SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
    FROM `profile` 
        LEFT JOIN user_metrics 
        ON user_metrics.guid = profile.guid
            LEFT JOIN `friends` f2 
            ON f2.`guid1` = ? AND profile.guid = f2.`guid2` 
                LEFT JOIN (`user_album`
                 LEFT JOIN `album_permissions` AS ap ON ap.guid = ?` AND ap.fguid = user_album.guid AND user_album.id = ap.album_id) ON profile.guid = user_album.guid AND user_album.count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ?)) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";



    SELECT `profile`.guid, `profile`.`is_private`, f1.`status` as `followed_status` , f2.`status` as `followingstatus` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
    FROM `profile` 

        LEFT JOIN `friends` f1
        ON f1.`guid1` = profile.guid AND f1.`guid2` = ?  // They're following us

            LEFT JOIN `friends` f2 
            ON f2.`guid1` = ? AND profile.guid = f2.`guid2` 
                LEFT JOIN (`user_album` 
                            LEFT JOIN `album_permissions` AS ap 
                            ON ap.guid = ? AND ap.fguid = user_album.guid AND user_album.id = ap.album_id
                          ) 
            ON profile.guid = user_album.guid AND user_album.count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ?)) 
    WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";


    */
    
        // var sqlQuery = "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status` , user_album.`id`, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND profile.guid = f2.`guid2` LEFT JOIN (`user_album` LEFT JOIN `album_permissions` AS ap ON ap.guid = ? AND ap.fguid = user_album.guid AND user_album.id = ap.album_id) ON profile.guid = user_album.guid AND user_album.count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ?)) WHERE `profile`.`username` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";


        var sqlQuery = "SELECT `profile`.guid, comments_on, `profile`.`is_private`,  f1.`status` as `followed_status`, f2.`status` as `following_status` , user_album.`id`, user_album.number_of_replies, user_album.number_of_total_replies, user_album.`explicit`, user_album.`title`, user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f1 ON f1.`guid1` = profile.guid AND f1.`guid2` = ? LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND profile.guid = f2.`guid2` LEFT JOIN (`user_album` LEFT JOIN `album_permissions` AS ap ON ap.guid = ? AND ap.fguid = user_album.guid AND user_album.id = ap.album_id) ON profile.guid = user_album.guid AND user_album.count > 0 AND ((profile.is_private = 0 AND user_album.is_private = 0) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ?)) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        var parameters = [guid,guid, guid, Relationship.IsFollowing, Relationship.IsFollowing, fguid, numberOfItems ];
        
        // var sqlQuery2 = "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid2` = profile.guid LEFT JOIN `user_album` ON user_album.guid  = profile.guid LEFT JOIN `album_permissions` AS ap ON ap.guid = f2.`guid1` AND ap.fguid = profile.guid AND ap.album_id = user_album.guid WHERE `profile`.`guid` = ? AND f2.`guid1` = ? AND ( (profile.is_private = 0 AND user_album.is_private = 0 ) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) OR (user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = ? AND  ap.fguid = ?) ) ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters = [fguid, guid, fguid, Relationship.IsFollowing, Relationship.IsFollowing, guid, fguid, numberOfItems ];

        // var sqlQuery = "SELECT `profile`.guid, `profile`.`is_private`, f2.`status` as `status`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views, user_album.`create_date`, user_album.`cover_album_url`,  user_album.`newest_media_timestamp`, user_album.`count` FROM `profile` LEFT JOIN `friends` f2 ON f2.`guid1` = ? AND f2.`guid2` = profile.guid LEFT JOIN `user_album` ON profile.guid = user_album.guid AND (profile.is_private = 0 AND user_album.is_private = 0 ) OR (profile.is_private = 1 AND user_album.is_private = 0 AND f2.`status` = ?) LEFT JOIN `album_permissions` AS ap ON profile.guid = user_album.guid AND ( user_album.is_private = 1 AND f2.`status` = ? AND ap.guid = ? AND ap.fguid  = ? ) WHERE `profile`.`guid` = ? ORDER BY user_album.newest_media_timestamp DESC LIMIT ?";
        // var parameters = [guid, Relationship.IsFollowing, Relationship.IsFollowing, guid, fguid, fguid, numberOfItems ];

        var isOurAccount =  ourAccount(guid, fguid);

        if ( isOurAccount ) {
            console.log("this is our account");
            /**
             * 
             * SELECT `profile`.`guid`, user_album.`id`, user_album.`title`,  user_album.first_url, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views,  UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
             * FROM `profile` 
             *      LEFT JOIN `user_album` 
             *      ON profile.guid = user_album.guid 
             *  WHERE `profile`.`guid` = ? 
             *  ORDER BY user_album.newest_media_timestamp DESC LIMIT ?"; 
             */

             /*
             SELECT `profile`.`guid`, user_album.`id`,  user_album.`explicit`, user_album.`title`,  user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views,  UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` 
             FROM `profile` 
                LEFT JOIN `user_album` 
                ON profile.guid = user_album.guid 
            WHERE `profile`.`guid` = ? AND count > 0
            ORDER BY user_album.newest_media_timestamp DESC 
            LIMIT ?"; 
            
             */
            sqlQuery   =  "SELECT `profile`.`guid`, comments_on, user_album.`id`, user_album.number_of_replies, user_album.number_of_total_replies, user_album.`explicit`, user_album.`title`,  user_album.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, user_album.`is_private` AS album_privacy, user_album.likes, user_album.dislikes, user_album.views,  UNIX_TIMESTAMP(`create_date`) AS create_date, user_album.`cover_album_url`, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp, user_album.`count` FROM `profile` LEFT JOIN `user_album` ON profile.guid = user_album.guid WHERE `profile`.`guid` = ? AND count > 0 ORDER BY user_album.newest_media_timestamp DESC LIMIT ?"; 
            parameters = [ guid, numberOfItems ];
       }
       
       
       connection.query({
            sql: sqlQuery,
            values: parameters
        },
        function (error, results, fields) {

            printTimeForEvent("Got user info");

            if (error) {
                printError(error);
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }
            else if (results && results.length > 0) {
                console.log('Results:', JSON.stringify(results, null, 2));


                var profileInfo = {};
                
                profileInfo[kGuid]      = results[0].guid;
                // profileInfo[kUserName]  = results[0].username;
                // profileInfo[kVerified]  = isVerified(results[0].verified);
                
                // profileInfo[kProfileUrl]  = results[0].image_url;
                // profileInfo[kPrivate]     = results[0].is_private;
               
                // if (results[0].fullname) {
                //     profileInfo[kFullName] = results[0].fullname;
                // }
                // if (results[0].about) {
                //     profileInfo[kAbout] = results[0].about;
                // }
                // if (results[0].domain) {
                //     profileInfo[kDomain] = results[0].domain;
                // }

                // profileInfo[kFollowersCount]  = results[0].follower_count;
                
                

                var albums = [];


                results.forEach((result) => {
                   
                    if ( isInt(result.count) && result.count > 0 ) {
                        
                        var album = {};
                       
                        album[kAlbumId]              = result.id;
                        album[kTitle]                = result.title;

                        album[kCount]                = result.count;
                        console.log("result.create_date.toString(): " + result.create_date.toString());
                        album[kCreateDate]           = result.create_date.toString();
                        album[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                        
                        album[kExplicit]             = intToBool(result.explicit);

                        

                        var params = {  Bucket  : ALBUM_BUCKET,  
                                        Key     : albumCoverThumbnailKey(result.guid, result.cover_album_url), 
                                        Expires : S3_EXPIRE_LIMIT 
                                    };
                        var signedUrl = s3.getSignedUrl('getObject', params);
                        printTimeForEvent("End SignedUrl for media url: " + result.cover_album_url);
                        printTimeForEvent("signedUrl: " + signedUrl);
                        
                        album[kAlbumCover]      = result.cover_album_url;
                        album[kSignedUrl]       = signedUrl; //result.signed_url;



                        album[kFirstUrl]          = result.first_url;
                        album[kTimestamp]         = result.first_timestamp.toString();

                        album[kSignedFirstUrl]    = s3.getSignedUrl('getObject', 
                                                    {   Bucket  : ALBUM_BUCKET,  
                                                        Key     : albumFirstMediaKey(result.guid, result.first_url), 
                                                        Expires : S3_EXPIRE_LIMIT 
                                                    });


                       album[kLikeCount]             = result.likes;
                       album[kDislikeCount]          = result.dislikes;
                       album[kViews]                 = result.views;
                       album[kPrivate]               = result.album_privacy
                       
                       album[kCommentCount]         = result.number_of_replies; // number of total comments and replies
                       album[kCommentTotalCount]    = result.number_of_total_replies; // number of total comments and replies
                       album[kCommentsOn]          = intToBool(result.comments_on);

                       
                        albums.push(album);
                    }
                });

                var followedStat     = results[0].followed_status;
                var followingStat     = results[0].following_status;
                console.log("Followed status: " + followedStat);
                console.log("Following status: " + followingStat);
                

                var response = userProfileResponse(
                    profileInfo, followingStat
                );

                response[kFollowingStatus] = followingStatus(followingStat);
                response[kFollowedStatus]  = followedStatus(followedStat);
                
                var albumInfo = {};
                albumInfo[kAlbums] = albums;
                albumInfo[kCount] = albums.length;

                response[kAlbumInfo] =  albumInfo;

                if ( !isOurAccount ) {
                    updateProfileViewStats(guid, fguid, response);
                } else {
                    finalAppResponse(response);
                }
            } else {
                console.log("No results found");

                finalAppResponse( userProfileResponse(
                    null, Relationship.Unknown
                ));                
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


                // let status = followingStatus(status);
                // response[kFollowingStatus] = followingStatus(followingStat);
                // response[kFollowedStatus]  = followedStatus(followedStat);
                

                finalAppResponse(followingStatusResponse(followingStatus(status)));
            

            } else {
                finalAppResponse(followingStatusResponse(Relationship.NoneExist));
            }
        });
    }


    

    // If they're following me
    function followerStatus(myGuid, followerGuid) {

        connection.query({          // follower    // being followed
            sql: 'SELECT status, blocked FROM `friends` WHERE `guid1` = ? AND `guid2` = ?',
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
                // var cancelInfo = [];
                
                // cancelInfo[0] = results[0].cancel_count;
                // cancelInfo[1] = results[0].timestamp;


                finalAppResponse(followerStatusResponse(followedStatus(status), blocked));
            

            } else {
                finalAppResponse(followerStatusResponse(Relationship.NoneExist));
            }
        });
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


    var isUpdatingPublicAndPrivateInfo = false;

    function queryLoggedInUser() {
    
        console.log("Called queryLoggedInUser");
        connection.query({
            sql: 'SELECT `guid`, `active` FROM `users` WHERE `id` = ? AND `acctid` = ?',
            values: [userId, acctId]
        }, function (error, results) {

            console.log("Called query queryLoggedInUser");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse(ErrorMessageGeneric));  
            }

            else if (results && results.length > 0) {
                console.log("Results = " + results.length);

                if ( results[0].active != ActiveValues.Active ) {
                    finalAppResponse( activeResponse( results[0].active, activeErrorMessage( results[0].active )));
                    return;
                }

                var guid = results[0].guid;
                console.log("Found my Guid: " + guid);
                
                console.log("pathParams: " + pathParams);
                console.log("requestBody: " + requestBody);
                

                if ( pathParams === "/profiles/user" ) {
                    console.log("pathParams /profiles/user: ok");
                    
                    var numberOfItems =  requestBody[kCount];

                    if ( typeof numberOfItems !==  "number" || numberOfItems > 40) {
                        numberOfItems = 40;
                    }


                    if ( isValidString(action) ) {
                        console.log("action: ok");
                        
                        if ( action === "AlbumDetailsInfo") {
                            
                            var albumId = requestBody[kAlbumId];
                            albumDetails(guid, fguid, albumId);
 
                        } else if (action === "LoadAlbums") {
                            
                            loadMoreAlbums(guid, requestBody[kNewestMediaTimestamp], requestBody[kAlbumId], numberOfItems );
 
                        } else if (action === "UserInfoAndAlbum") {
                            
                            queryFriendStatusAndAlbums(guid, numberOfItems);
                    
                        } else if (action === "followstatus" ) {
                
                            followStatus(guid, fguid);
                    
                        } else if (action === "followerstatus" ) {
                
                            followerStatus(guid, fguid);
                    
                        } else if (action === "UserProfile") {
                            
                            var username = requestBody[kUserName];
                            
                            console.log("action: ok");
                            
                            if ( !stringHasLength(username)) {
                                console.log("Username is is too short");
                                finalAppResponse( errorResponse(ErrorMessageGeneric));  
                            }
                            // lowercaseAllUsernames();
                            username = username.toLowerCase();
                            getUserProfile(guid, username, numberOfItems);

                        } else {
                            finalAppResponse( errorResponse( errorMessage ));
                            return;
                        }
                        
                    } else {
                        finalAppResponse( errorResponse( errorMessage ));
                        return;
                    }

                    
                    // update profile
                } else if (pathParams === "/profiles/me" ) {

                    if (action === "myProfile") {
                        console.log("Getting personal info");
                        queryMyPersonalProfile(guid);
                    }
                    else if (action === "privateInfo") {
                        console.log("Getting profile info");
                        queryUsersPrivateInfo(guid);
                    }
                    else if (action === "photo") {
                        console.log("Save new image");
                        saveNewImage(guid);

                    } else if (action  === "updateCrop") {
                        console.log("Save new crop image");
                        saveNewCropImage(guid);

                    } else if (action  === "updateInfo"){
                        console.log("Updating profile");



                
                        /**
                         *  ===========================================================
                         *  ===========================================================
                         * 
                         *      Editing our profile info 
                         *                       ERROR CHECKING
                         * 
                         *  ===========================================================
                         *  =========================================================== 
                         */

                        console.log("Checking variables");

                        console.log("Checking username: " + profile[kUserName]);

                        // Is valid username
                        if ( !stringHasLength(profile[kUserName])) { // Changeing username

                            console.log("Username is is too short");

                            finalAppResponse( errorResponse(
                                "Username is missing"
                            ));
                        } else if (stringIsTooLong(profile[kUserName], MaxLength.Username)) {
                            console.log("Username is is too long");

                            finalAppResponse( errorResponse(
                                "Username has to be shorter than " + MaxLength.Username + " characters" 
                            ));         
                        } else {
                            console.log("Username is valid");
                            profile[kUserName] = profile[kUserName].toLowerCase();

                            let errorMessage =  isInvalidUsername(profile[kUserName]);

                            if ( errorMessage && errorMessage.length > 0 ) {
                                finalAppResponse( errorResponse( errorMessage ));
                                return;
                            } 
                        }


                        // Checking fullname
                        console.log("Checking fullname");

                        if ( stringIsTooLong(profile[kFullName], MaxLength.Fullname) ) { // Changeing username
                            console.log("3");

                            finalAppResponse( errorResponse(
                                "Name has to be shorter than " + MaxLength.Fullname + " characters" 
                            ));
                            return;
                        } else {
                            console.log("Fullname ok: " + profile[kFullName]);
                            updatingProfileInfo = true;
                        }

                        console.log("Checking Domain");

                        if ( stringIsTooLong(profile[kDomain], MaxLength.Domain) ) { // Changeing username
                            console.log("Domain length not Okay");

                            finalAppResponse( errorResponse(
                                "Website has to be shorter than " + MaxLength.Domain + " characters" 
                            ));
                            return;
                        } else {
                            console.log("Domain length Okay: " + profile[kDomain]);
                            updatingProfileInfo = true;
                        }

                        console.log("Checking About");

                        if ( stringIsTooLong(profile[kAbout], MaxLength.About)) { // Changeing username
                            console.log("About length not okay");

                            finalAppResponse( errorResponse(
                                "Bio has to be shorter than " + MaxLength.Domain + " characters" 
                            ));
                            return;
                        } else {
                            console.log("About length Okay: " + profile[kAbout]);
                            updatingProfileInfo = true;
                        }



                        // let email = profile[kEmail];

                        // isStringWithLength(email)
                        // if (  stringIsTooLong(profile[kEmail], MaxLength.Email) ) { // Changeing username

                        //     finalAppResponse( errorResponse(
                        //         "Email has to be shorter than " + MaxLength.Email + " characters" 
                        //     ));
                        //     return;
                        // } else {
                        //     updatingPrivateInfo = true;
                        // }

                        // if (stringIsTooLong(profile[kMobile], MaxLength.Mobile)) { // Changeing username
                        //     finalAppResponse( errorResponse(
                        //         "Phone number has to be shorter than " + MaxLength.Mobile + " characters" 
                        //     ));
                        //     return;
                        // } else {
                        //     updatingPrivateInfo = true;
                        // }


                        console.log("In the clear");

                        if (  !updatingProfileInfo && !updatingPrivateInfo) {
                            finalAppResponse( updateProfileResponse(false, null ));
                            return;
                        }

                        if (updatingProfileInfo && updatingPrivateInfo) {
                            //isUpdatingPublicAndPrivateInfo
                            isUpdatingPublicAndPrivateInfo = true;
                        }

                        /**
                         *  ===========================================================
                         *  ===========================================================
                         * 
                         *                 FINISHED   ERROR   CHECKING
                         * 
                         *  ===========================================================
                         *  =========================================================== 
                         */



                        beginTransactionToInsertUser(guid);

                        // if (isUpdatingPublicAndPrivateInfo) {
                        //     beginTransactionToInsertUser(guid);
                        // } else if (updatingProfileInfo) {
                        //     updateProfileInfo(guid);
                        // } else {
                        //     updatePrivateInfo(guid);
                        // }


                    } else {
                        finalAppResponse( updateProfileResponse(false, null ));
                    }
                } else {
                    finalAppResponse( updateProfileResponse(false, null ));
                }

            } else {  // No results   
                console.log("No results found");
     
                finalAppResponse( activeResponse( ActiveValues.DoesNotExist, activeErrorMessage(ActiveValues.DoesNotExist)));
            }
        });
    }

    queryLoggedInUser();
};