'use strict';
console.log('Loading function');

/* Import Libraries */
var mysql = require('mysql');
var uuid  = require('uuid');
console.log('Loading function mysql');

// Using require Facebook Graph API
var FB = require('fb');
console.log('Loading function facebook');

var AWS = require("aws-sdk");
console.log('Loading function AWS');

var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

console.log('Loading function S3');


var randomstring = require("randomstring");

console.log('Loading function 2');

var APP_NAME  = "Dromo";
var MAX_CHARACTER_LENGTH = 25;
var ALLOW_MORE_THAN_ONE_ACCOUNT = false;


var ErrorMessageGeneric = APP_NAME + " is experiencing problems. Try again shortly";

var SaveImageError      = APP_NAME + " could not save your photo. Try again shortly";
var ImageMissingError      =  "Submit a photo to continue";
var ImageTooBigError      = APP_NAME + " could not save your photo. Image is too big.";




let kGuid       = "guid";
let kAcctId     = "acctId";
let kGender     = "gender";
let kUserName   = "userName";
let kFirstName  = "firstName";
let kLastName   = "lastName";
let kFullName   = "fullName";
let kCity       = "city";
let kState      = "state";
let kCountry    = "country";
let kAbout      = "about";
let kDomain     = "domain";
let kUserPhoto  = "userPhoto";


let kVerified       = "verified";

let kActive         = "active";
let kErrorMessage   = "errorMessage";
let kSuccess        = "success";

let kProfiles       = "profiles";

let kScore          = "score";
let kFollowersCount = "followersCount";
let kFollowingCount = "followingCount";

let kPrivate  = "private";
let kFeedBack = "feedback";
let kType           = "type"
let kPermission    =  "permission";


    /*   S3 CONSTANTS   */

var PRIVATE_PROFILE_BUCKET  = "dromo-profile-private";


let kAllowFollowersView     =  "allowFollowersView";
let kAllowFollowingsView    =  "allowFollowingsView";



// var PRIVATE_ORIGINAL_BUCKET = "dromo-profile-private-original";
// var PRIVATE_CROPPED_BUCKET  = "dromo-profile-private-crop"; 
var PUBLIC_CROP_BUCKET      = "dromo-profile-public-crop";
var PUBLIC_THUMB_BUCKET     = "dromo-profile-public-thumb";
                
console.log('Loading function 3');



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

let FACEBOOK_SECRET = "d1e8c40d5703fca18cc5ff5db6bbc5ed";

var connection = mysql.createConnection({
    host     : 'mysqldromotest.cyoa59avdmjr.us-east-1.rds.amazonaws.com',
    user     : 'hannyalybear',
    password : 'SummerIsNearAndYellow1',
    database : 'dromotestmysqldb',
    charset  : 'utf8mb4_unicode_ci' 
});


function bytesToMb(bytes) {

    return bytes/ (1024 * 1024);
}

function isImageBelowSizeThreshold(mbSize) {

    if (mbSize < 10) {
        return true;
    }
    return false;
}

function printError(err) {
    console.log(err);
    console.error('Error Stack is: ' + err.stack);
}




var httpResponseCode = {
    OK: 200,
    Unauthorized: 401
};


function loginResponse(profiles ) {
    var response = {}
    response[kActive]       = ActiveValues.Active; 
    response[kProfiles]     = profiles;
    response[kErrorMessage] = null;
    console.log("loginResponse response: " + JSON.stringify(response));

    return response;
}


// Currently only one profile
function registerResponse(profile, errorMessage, didSaveProfile, didSavePhoto) {
    var response = {};



    response[kActive]       = ActiveValues.Active; 
    response[kProfiles]  =  [ profile ];
    response[kErrorMessage] = errorMessage;

    console.log("registerResponse response: " + JSON.stringify(response));
    return response;
} 


/** Special verificition from faebook  */
function verifyResponse( activeStatus, verified, errorMessage) {
    var response = {}
    response[kActive]       = activeStatus; 
    response[kVerified]     = verified; 
    response[kErrorMessage] = errorMessage;
    console.log("verifyResponse response: " + JSON.stringify(response));
    return response;
}

function isPrivateResponse( activeStatus, privacy, errorMessage) {
    var response = {}
    response[kActive]       = activeStatus; 
    response[kPrivate]      = privacy; 
    response[kErrorMessage] = errorMessage;
    console.log("privacy response: " + JSON.stringify(response));
    return response;
}

function permissionResponse( activeStatus, permission, errorMessage) {
    var response = {}
    response[kActive]              = activeStatus; 
    response[kPermission]          = permission; 
    response[kErrorMessage]        = errorMessage;
    console.log("privacy response: " + JSON.stringify(response));
    return response;
}



function deleteResponse( activeStatus, errorMessage ) {

    var response = {};

    response[kActive]       = activeStatus; 
    response[kErrorMessage] = errorMessage; 

    console.log(response);
    return response;
}


function defaultErrorResponse( activeStatus, errorMessage ) {

    var response = {};
    response[kActive]       = activeStatus; 
    response[kErrorMessage] = errorMessage; 

    console.log(response);
    return response;
}

function errorResponse(error) {

    var response = {};
    response[kErrorMessage] = error;
    return response;
}










var ErrorType = {
    Unknown: "",
    Generic: ""
};


function errorType(type) {
    switch (type) {
        case ErrorType.Unknown: return "";
        case ErrorType.Generic: return "";
        default: return "";
    }
}


function exists(obj) {
    return !(!obj || obj == null)
}

let kFacebookToken = "facebookToken";



let kSecretAdminCode   = "secretAdminCode";
let THE_SECRET_ADMIN_CODE = "MUHAHAHAHAHA-In-yo-face";



var ActiveValues = {
    Active            : 0,
    Unknown           : 1,   
    DoesNotExist      : 2,   // Company suspended
    Deleted           : 3,   // User deleted 
    Disabled          : 4,   // User disbaled??
    DisabledConfirmed : 5,   // Company suspended
};
let kProfileUrl = "profileUrl";


function isStringWithLength(word) {
    return typeof word === 'string' && word.length > 0;
}

    function isBoolean(val) {
        return typeof(val) === "boolean";
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

/*
    Shell command:
cd accounts; ./compress.sh api-account Rail-Accounts-mobilehub-1247959479; cd ..

./compress.sh api-account Rail-Accounts-mobilehub-1247959479
*/


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
    

    function finalAppResponse(responseBody) {
        console.log("finalAppResponse responseBody: " + JSON.stringify(responseBody));

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


    function saveImageError(errorMessage) {
        console.log("saveImageError " );

        if ( didSaveProfile ) {
            finalAppResponse( registerResponse(userProfile, errorMessage, didSaveProfile, didSavePhoto));
        } else {      
            // insertUserIntoUserTable(userProfile, null);
            finalAppResponse( registerResponse(null, errorMessage, didSaveProfile, didSavePhoto));
        }
    }





    context.callbackWaitsForEmptyEventLoop = false;
    console.log('Received event:', JSON.stringify(event, null, 2));
  

  
    var userId  = cognitoIdentityId;    
    var acctId  = requestBody[kAcctId];
    console.log("userId: " + userId);
    console.log("acctId: " + acctId);

    
    // Register variables
    var username         = requestBody[kUserName];
    var secretAdminCode  = requestBody[kSecretAdminCode];
    
    /* User photos */
    var originalImage  = requestBody.originalImage;
    var croppedImage   = requestBody.cropImage;
    



              



/**
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 * 
 *                                               Login User
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 * 
 *  SELECT `users`.acctid, `users`.guid, `users`.active, 
 *         `profile`.username, `profile`.image_url, `profile`.fullname, `profile`.about, `profile`.domain, `profile`.verified, `profile`.gender, profile.followers, profile.following, profile.popularity 
 *  FROM `users` 
 *      INNER JOIN `profile` 
 *      ON `users`.guid = `profile`.guid 
 *  WHERE `users`.`id` = ?', 


    SELECT `users`.acctid, `users`.guid, `users`.active, 
            `profile`.username, `profile`.image_url, `profile`.fullname, `profile`.about, `profile`.domain, `profile`.verified, `profile`.gender, profile.followers, profile.following, 
            user_metrics.popularity 
    FROM `users` 
        INNER JOIN `profile` 
        ON `users`.guid = `profile`.guid 
            LEFT JOIN user_metrics 
            ON user_metrics.guid = profile.guid 
    WHERE `users`.`id` = ?', 


 */





    function queryLoggedInUser() {
    
        connection.query({

            sql: 'SELECT `users`.acctid, `users`.guid, `users`.active, `profile`.username, `profile`.image_url, `profile`.fullname, `profile`.about, `profile`.domain, `profile`.verified, `profile`.is_private, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.gender, profile.followers, profile.following, user_metrics.popularity FROM `users` INNER JOIN `profile` ON `users`.guid = `profile`.guid LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `users`.`id` = ?', 

            //  sql: 'SELECT `users`.acctid, `users`.guid, `users`.active, `profile`.username, `profile`.image_url, `profile`.fullname, `profile`.about, `profile`.domain, `profile`.verified, `profile`.gender, profile.followers, profile.following, profile.popularity FROM `users` INNER JOIN `profile` ON `users`.guid = `profile`.guid WHERE `users`.`id` = ?', 
            values: [userId]
            // values: [userId, ActiveValues.Active]
        }, function (error, results) {

            if (error) {
                printError(error);
                finalAppResponse( defaultErrorResponse(ActiveValues.Unknown, ErrorMessageGeneric) );
            } else {

                var profiles = [];

                if (results.length > 0) {
                    
                    console.log('Results:', JSON.stringify(results, null, 2));

                    console.log('User exists, returning current info');

                    // We don't return this info, used for updating table
                    var disabledAccount  = [];

                    // I guess assume 1 for now
                    results.forEach((result) => {

                        var dict = {};
                        dict[kAcctId]     = result.acctid;
                        dict[kGuid]       = result.guid;
                        dict[kActive]     = result.active;

                        if (result.active == ActiveValues.Disabled) {
                            disabledAccount.push(result.guid);
                        }

                        dict[kUserName]   = result.username;
                        dict[kFullName]   = result.fullname;
                        dict[kAbout]      = result.about;
                        dict[kDomain]     = result.domain;
                        dict[kVerified]   = intToBool(result.verified);
                        dict[kPrivate]    = intToBool(result.is_private);

                        dict[kGender]     = result.gender;
                        dict[kProfileUrl] = result.image_url;

                        dict[kScore]          = result.popularity === null ? 0 : result.popularity;
                        dict[kFollowersCount] = result.followers;
                        dict[kFollowingCount] = result.following;

                        dict[kAllowFollowersView]  = result.allow_view_followers;
                        dict[kAllowFollowingsView] = result.allow_view_followings;



                        profiles.push(dict);
                    });


                    // Update table if any accounts are disabled. 
                    if (disabledAccount.length > 0) {

                        connection.query({
                            sql: 'UPDATE `users` SET `active` = ? WHERE guid in (?)', 
                            values: [ ActiveValues.DisabledConfirmed, disabledAccount]
                        }, function (error, results) {

                            // Don't care
                            if (error) {
                                printError(error);
                            }
                        }); 
                    }
                }
                console.log("Profile has " + profiles.length + " profiles");
                finalAppResponse( loginResponse( profiles ));
            }
        });
    }




/**
 *  =============================================================================================================
 *  =============================================================================================================
 * 
 *                                               Register User
 *  =============================================================================================================
 *  =============================================================================================================
 */

    function generateRandomString() {
        return randomstring.generate({
            length: 7,
            charset: 'hex'
        });
    }

             
    function originalProfileKey(guid, randomString) {
        // return "original/"  + guid + randomString + "/original.jpg"
        return guid + "/original/" + randomString + ".jpg"
    }
    function croppedProfileKey(guid, randomString) {
        // return "crop/" + guid + randomString +  "/crop.jpg"
        return guid + "/crop/" + randomString +  ".jpg"
    }


    // Used For registration, but when user updates for profile use "api-profile"" file
    function saveImage(userProfile, newProfileUrl) {
        console.log("saveImage");

        //Store images in S3
        var orginalImageBuffer = new Buffer(originalImage, 'base64'); // Buffer.from(originalImage, 'base64');  
        var originalImageSize = bytesToMb(orginalImageBuffer.length);
        console.log("orginalImageBuffer imageSize: " + originalImageSize);
        
        var croppedImageBuffer = new Buffer(croppedImage, 'base64'); // Buffer.from(croppedImage, 'base64');  
        var croppedImageSize = bytesToMb(croppedImageBuffer.length);
        console.log("croppedImageBuffer imageSize: " + croppedImageSize);

        if ( !isImageBelowSizeThreshold(originalImageSize) ||  !isImageBelowSizeThreshold(croppedImageSize) ) {
            console.log("Error: Image is too big. Original Image Size:" + originalImageSize + "Mb"); 
            console.log("Error: Image is too big. Cropped Image Size:" + croppedImageSize + "Mb"); 
            
            if ( didSaveProfile ) {
                finalAppResponse( registerResponse(userProfile, ImageTooBigError, didSaveProfile, didSavePhoto));
            } else {      
                // insertUserIntoUserTable(userProfile, null);
                finalAppResponse( registerResponse(null, ImageTooBigError, didSaveProfile, didSavePhoto));
            }
            return;
        }

        var paramsOriginal = { 
            Bucket: PRIVATE_PROFILE_BUCKET,
            Key: originalProfileKey(userProfile[kGuid],  newProfileUrl ), 
            Body: orginalImageBuffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        }; 

        var paramsCropped = {
            Bucket: PRIVATE_PROFILE_BUCKET,
            Key: croppedProfileKey(userProfile[kGuid],  newProfileUrl), 
            Body: croppedImageBuffer,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg'
        }; 
        
        uploadPhoto(paramsCropped, paramsOriginal, userProfile, newProfileUrl);  
    }


    function uploadPhoto(paramsCropped, paramsOriginal, userProfile, newProfileUrl) {
       // Insert original first
        s3.putObject(paramsOriginal, function(err, data) {
            
            if (err) {
                console.log("Error: " + JSON.stringify(err, null, 2));
                if (didSaveProfile) {
                    finalAppResponse( registerResponse(userProfile, SaveImageError, didSaveProfile, didSavePhoto));
                } else {      
                    // insertUserIntoUserTable(userProfile, null);
                    finalAppResponse( registerResponse(null, SaveImageError, didSaveProfile, didSavePhoto));
                }
                return;
            } else {
                console.log("Successfully Put users original photo");
                console.log("data: " + JSON.stringify(data, null, 2));
           
                s3.putObject(paramsCropped, function(err, data) {

                    if (err) {
                        console.log("Error: " + JSON.stringify(err, null, 2));

                        if (didSaveProfile) {
                            finalAppResponse( registerResponse(userProfile, SaveImageError, didSaveProfile, didSavePhoto));
                        } else {
                            // insertUserIntoUserTable(userProfile, null);
                            finalAppResponse( registerResponse(null, SaveImageError, didSaveProfile, didSavePhoto));
                        }
                        return;
                    } else {
                        console.log("Successfully Put users cropped photo");
                        console.log("data: " + JSON.stringify(data, null, 2));
                      
                        didSavePhoto = true;
                        
                        if (didSaveProfile) {
                            // update profile
                            connection.query({
                                sql:'UPDATE `profile` SET image_url = ? WHERE `guid` = ?', 
                                values: [ newProfileUrl, guid]
                            },
                            function (error, results, fields) {
                                if (error) {
                                    printError(error);
                                    finalAppResponse(registerResponse(userProfile, SaveImageError, didSaveProfile, didSavePhoto) );
                                } else {
                                    userProfile[kProfileUrl] = newProfileUrl;
                                    finalAppResponse(registerResponse(userProfile, null, didSaveProfile, didSavePhoto) );
                                }
                            });
                        } else {
                            insertUserIntoUserTable(userProfile, newProfileUrl);
                        }
                    }
                });
            }
        });
    }

 
    // var acctId;
    // Add uesr to users table
    // Insert user into Users table

    function insertUserIntoUserTable(userProfile, profileUrl) {
        console.log("insertUserIntoUserTable");
        connection.beginTransaction(function(err) {
            if (err) { 
                printError(err);
                finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
            } else {
           
                connection.query({
                    sql:'INSERT INTO `users` SET id = ?, acctid = ?, active = ?', 
                    values: [userId, userProfile[kAcctId], ActiveValues.Active] 
                }, function(err, result) {
                    if (err) {

                        // TODO: if DUP key then retry insertUserIntoUserTable

                        printError(err);
                        connection.rollback(function() {                            
                            finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
                        });   
                    } else {
                        insertUserIntoProfileTable(userProfile, profileUrl);
                        //insertUserIntoUserSegmentTable(userProfile);
                    }
                });
            }
        });
    }

    function getValue(object) {
        return ( object === undefined || object === null) ? null : object;
    }


    //TODO:  THis should be done in background???
    // Gets and saves user facebook details
    function insertUserIntoUserSegmentTable(userProfile) {
            
        console.log("insertUserIntoUserSegmentTable");

        FB.options({appSecret: FACEBOOK_SECRET});
       

        FB.api('me', { fields: [ 'id', 'name', 'first_name', 'last_name', 'is_verified', 'gender', 'email', 'age_range'], access_token: facebookToken }, function (res) {
            
            console.log(res);


            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                console.log("Too bad");
                                
                userProfile[kVerified] = false;
                insertUserIntoProfileTable(userProfile, profileUrl);

            } else {


                console.log(res.id);
                console.log(res.is_verified);

                var is_verified = getValue(res.is_verified) === null ? false : true;

                userProfile[kVerified] = is_verified;

                var facebookId  = getValue(res.id);
                var name        = getValue(res.name);
                var first_name  = getValue(res.first_name);
                var last_name   = getValue(res.last_name);

                var email       = getValue(res.email);
                var gender      = getValue(res.gender);
                var age_range   = getValue(res.age_range);
                var min_age     = getValue(age_range['min']);
                var max_age     = getValue(age_range['max']);


                // console.log("facebookId Typeof: " + typeof facebookId);
                // console.log("is_verified Typeof: " + typeof is_verified);
                // console.log("name Typeof: " + typeof name);
                // console.log("first_name Typeof: " + typeof first_name);
                // console.log("last_name Typeof: " + typeof last_name);
                // console.log("email Typeof: " + typeof email);
                // console.log("gender Typeof: " + typeof gender);
                // console.log("age_range Typeof: " + typeof age_range);
                // console.log("min_age Typeof: " + typeof min_age);
                // console.log("max_age Typeof: " + typeof max_age);

                connection.query({
                    sql:'INSERT INTO `user_feature_segment` SET guid = ?, facebook_id = ?, last_name = ?, first_name = ?, name = ?, min_age = ?, max_age = ?, email = ?, gender = ?, is_verified = ?', 
                    values: [ userProfile[kGuid], facebookId, last_name, first_name, name, min_age, max_age, email, gender, is_verified] 
                }, function(err, result) {
                    if (err) {
                        console.log("Error putting user data into user-feature-special")
                    } else {
                        console.log("Inserted user into user-feature-special")
                    }
                });
            }
        });
        console.log("FB.api out");
    }



    // Add uesr to profile table
    function insertUserIntoProfileTable(userProfile, profileUrl) {
                                
        console.log("insertUserIntoProfileTable");

        connection.query({
            sql:'INSERT INTO `profile` SET guid = ?, username = ?, image_url = ?, verified = ?', 
            values: [ userProfile[kGuid], userProfile[kUserName], profileUrl, userProfile[kVerified] ] 
        }, function(err, result) {
            if (err) {
                printError(err);
                connection.rollback(function() {

                    if (err.code == "ER_DUP_ENTRY") {
                        finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, "Username already exists"));
                    } else {
                        finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
                    }                                 
                });      
            } else {
    
                console.log("Inserted row id:" + result.insertId);
                console.log('Result:', JSON.stringify(result, null, 2));

                userProfile[kScore]          = 0;
                userProfile[kFollowersCount] = 0;
                userProfile[kFollowingCount] = 0;


                insertUserIntoSearchTable(userProfile, profileUrl);
            }
        });
    }

    // Add search to users table
    function insertUserIntoSearchTable(userProfile, profileUrl) {

        connection.query({
            sql:'INSERT INTO `usersearch` SET keyword = ?, guid = ?', 
            values: [ userProfile[kUserName], userProfile[kGuid] ] 
        }, function(err, result) {
            
            if (err) {
                printError(err);
                connection.rollback(function() {
                    finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
                });    
            } else {

                if ( secretAdminCode.localeCompare(THE_SECRET_ADMIN_CODE) == 0 ) {
                    console.log('Inserting a new admin user');
            	    var insertUser = 'INSERT INTO `a_me` SET guid = ?';

                    connection.query({
                        sql: insertUser, 
                        values: [ userProfile[kGuid] ] 
                    }, function(err, result) {
                        
                        if (err) {
                            printError(err);
                            connection.rollback(function() {
                                finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
                            });    
                        } else {
                            commitAndInsertIntoBackgroundTable(userProfile, profileUrl)
                        }
                    });
                } else {
                    commitAndInsertIntoBackgroundTable(userProfile, profileUrl)
                }
            }
        });
    }


    function commitAndInsertIntoBackgroundTable(userProfile, profileUrl) {
  
        connection.commit(function(err) {
            if (err) {
                printError(err);
                connection.rollback(function() {
                    finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
                });
            } else  {
                console.log('successful commit!');

                didSaveProfile = true; 
                userProfile[kProfileUrl] = profileUrl
                insertDataIntoBackgroundTable(userProfile);
            }
        });
    }


    // Update user search 
    // var cronjobNewUserAction = "NewUser";
    // var cronjobClickAction = "Clicked";
    // var cronjobFriendAction = "Friended";

    function insertDataIntoBackgroundTable(userProfile) {

        connection.query({
            // sql:'INSERT INTO cronjobs SET action = ?, guid = ?, popularity', 
            sql:'INSERT INTO `cron_register_usersearch` SET guid = ?', 
            values: [ userProfile[kGuid] ] 
        }, function(err, result) {
            
            finalAppResponse(registerResponse(userProfile, null, didSaveProfile, didSavePhoto) );
        });    
    }





    function intToBool(val) {
        if (!isInt(val) ) return false;
        return val === 0 ? false : true;
    }
     
     

// Oh maybe we're doing this just in case, we did a successful register before? 
// DOnt do SELECT, just do an insert based on username. WIll return Duplicate if error

/**
 *  
 * 
SELECT `users`.acctid, `users`.guid, `users`.active, `profile`.username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.image_url, profile.popularity, profile.followers, profile.following, `profile`.fullname, `profile`.about, `profile`.domain, `profile`.verified, profile.is_private, `profile`.gender
FROM `users` 
    INNER JOIN `profile` 
    ON `users`.guid = `profile`.guid 
WHERE `users`.`id` = ? AND `profile`.`username` = ? AND `users`.active = ?' 

 */

    function checkIfUserRegisteredBefore() {
 
        var query = 'SELECT `users`.acctid, `users`.guid, `users`.active, `profile`.username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.image_url, profile.popularity, profile.followers, profile.following, `profile`.fullname, `profile`.about, `profile`.domain, `profile`.verified, profile.is_private,  `profile`.gender FROM `users` INNER JOIN `profile` ON `users`.guid = `profile`.guid WHERE `users`.`id` = ? AND `profile`.`username` = ? AND `users`.active = ?' 
        // values: [userId, ActiveValues.Active, ActiveValues.Disabled]
    
        // TODO: make this a join on profile to get users info 
        connection.query({
            sql: query,
            values: [userId, username, ActiveValues.Active]
        }, function (error, results, fields) {

            if (error) {
                printError(error);
                finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
                return;
            }

            if (results) {

                console.log('Results:', JSON.stringify(results, null, 2));

                // If user has registered before, let's return that profile
                // For example they registered successfully and something goes wrong and they try to register again
                if (results.length  > 0) {  // I guess assume 1 for 
                    
                    var result = results[0];

                    console.log('User created account before, returning current info');
                    var acctId = result.acctid;
                    console.log("acctId: " + acctId)
                    
                    var guid = result.guid;
                    console.log("guid: " + guid) 

                    var userProfile = {};
                    userProfile[kAcctId]     = result.acctid;
                    userProfile[kGuid]       = result.guid;
                    userProfile[kActive]     = result.active;

                    userProfile[kUserName]   = result.username;
                    userProfile[kFullName]   = result.fullname;
                    userProfile[kAbout]      = result.about;
                    userProfile[kDomain]     = result.domain;

                    userProfile[kVerified]   = intToBool(result.verified);
                    userProfile[kPrivate]    = intToBool(result.is_private);
                    userProfile[kGender]     = result.gender;
                    userProfile[kProfileUrl] = result.image_url;

                    userProfile[kScore]          = result.popularity;
                    userProfile[kFollowersCount] = result.followers;
                    userProfile[kFollowingCount] = result.following;

                    userProfile[kAllowFollowersView]  = result.allow_view_followers;
                    userProfile[kAllowFollowingsView] = result.allow_view_followings;


                    didSaveProfile = true;

                    // If never saved Image
                    if (result.image_url == null) {

                        // userProfile[kProfileUrl] = null;
                        if (originalImage === null || croppedImage === null) {
                            finalAppResponse( registerResponse(userProfile, ImageMissingError, didSaveProfile, didSavePhoto));
                        } else {
                            saveImage(userProfile, generateRandomString() );                            
                        }
                    } else {
                        didSavePhoto = true;
                        finalAppResponse( registerResponse( userProfile, null, didSaveProfile, didSavePhoto));
                    }

                    // Add new user to database         
                } else {
                    console.log('Creating new User');

                    var acctId = uuid.v4().substring(0, 8); // TODO: Change this to use NPM random string

                    var userProfile = {};
                    userProfile[kAcctId]   = acctId;
                    userProfile[kUserName] = username;
                    userProfile[kGuid]     = convertToGuid(userId, acctId);
                    userProfile[kActive]   = ActiveValues.Active;
                    userProfile[kVerified] =  false;
                    userProfile[kProfileUrl] = null;

                    if (originalImage === null || croppedImage === null) {
                        // insertUserIntoUserTable(userProfile, null);
                        finalAppResponse( registerResponse(null, ImageMissingError, didSaveProfile, didSavePhoto));
                    } else {
                        saveImage(userProfile, generateRandomString());            
                    }
                }
            }
        });
    }


    function doSomeRegistrationErrorChecking() {

        console.log("ClientID: " + userId);
        console.log("Username: " + username);
            
        let errorMessage =  isInvalidUsername(username);

        if (errorMessage !== null ) {
            finalAppResponse( defaultErrorResponse( ActiveValues.DoesNotExist, errorMessage));
            return;
        }
        username = username.toLowerCase();

        checkIfUserRegisteredBefore();
    }


/**
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 * 
 * 
 *                                     Verify user through facebook
 * 
 * 
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 */


    // Add uesr to profile table
    function verifyFacebookUser(guid, facebookToken) {
            
        console.log("verifyFacebookUser");

        FB.options({appSecret: FACEBOOK_SECRET});
       
        FB.api('me', { fields: [ 'id', 'is_verified'], access_token: facebookToken }, function (res) {
            
            console.log(res);

            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                finalAppResponse( verifyResponse( ActiveValues.Active, "Could not get verication from Facebook. Try again shortly." ));

            } else {
                console.log(res.id);
                console.log(res.is_verified);
                var is_verified = getValue(res.is_verified) == null ? 0 : 1;
                var facebookId  = getValue(res.id);
                
                verifyUser(guid, is_verified);
            }
        });
    }



    function verifyUser(guid, is_verified) {
        console.log("verifyUser");

        connection.query({
            sql:'UPDATE `profile` SET verified = ? WHERE `guid` = ?', 
            values: [ is_verified, guid ] 
        }, function(err, result) {
            if (err) {
                console.log("Error");
                finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
            } else {

                is_verified = is_verified === 0 ? false : true;
            
                finalAppResponse( verifyResponse( 
                    ActiveValues.Active, is_verified, null 
                ));

                // if ( result.affectedRows > 0 ) {

                //     finalAppResponse( verifyResponse( 
                //         ActiveValues.Active, is_verified, null 
                //     ));
                // } else {
                //     finalAppResponse( verifyResponse( 
                //         ActiveValues.Active, is_verified, null ));
                // }
            }
        });
    }

    function giveUsFeedback(guid, info) {

        let feedback =  info[kFeedBack];
        let type     =  info[kType];

        console.log("giveUsFeedback: feedback: " + feedback);
        console.log("giveUsFeedback: type: " + type);

        connection.query({
            sql:'INSERT INTO `feedback` SET guid = ?, message = ?, type = ?', 
            values: [guid, feedback, type] 
        }, function(err, result) {
            if (err) {
                printError(err);
                finalAppResponse( defaultErrorResponse( ActiveValues.Active, ErrorMessageGeneric));

            } else {
                finalAppResponse( defaultErrorResponse( ActiveValues.Active, null)); 
            }
        });
    }


    function updateViewFollowingsPermission(guid, permission) {

        console.log("updateViewFollowingsPermission: guid: " + guid );
        console.log("updateViewFollowingsPermission: privacy: " + permission );
        
        connection.query({
            sql:'UPDATE `profile` SET `allow_view_followings` = ? WHERE `guid` = ?', 
            values: [ permission, guid ] 
        }, function(err, result) {
            if (err) {
                console.log("Error updateViewFollowingsPermission");
                finalAppResponse( defaultErrorResponse( ActiveValues.Active, ErrorMessageGeneric));
            } else {
                
                if ( result.affectedRows > 0 ) {

                    finalAppResponse( permissionResponse( 
                        ActiveValues.Active, permission, null 
                    ));
                } else {
                    finalAppResponse( defaultErrorResponse( ActiveValues.Active, ErrorMessageGeneric));
                }
            }
        });
    }


    function updateViewFollowersPermission(guid, permission) {

        console.log("updateViewFollowersPermission: guid: " + guid );
        console.log("updateViewFollowersPermission: privacy: " + permission );

        
        connection.query({
            sql:'UPDATE `profile` SET `allow_view_followers` = ? WHERE `guid` = ?', 
            values: [ permission, guid ] 
        }, function(err, result) {
            if (err) {
                console.log("Error updateViewFollowingsPermission");
                finalAppResponse( defaultErrorResponse( ActiveValues.Active, ErrorMessageGeneric));
            } else {
                
                if ( result.affectedRows > 0 ) {

                    finalAppResponse( permissionResponse( 
                        ActiveValues.Active, permission, null 
                    ));
                } else {
                    finalAppResponse( defaultErrorResponse( ActiveValues.Active, ErrorMessageGeneric));
                }
            }
        });
    }



    function updateUserPrivacy(guid, privacy) {
        console.log("updateUserPrivacy: guid: " + guid );
        console.log("updateUserPrivacy: privacy: " + privacy );

        var isPrivate =  privacy ? 1 : 0;
        
        connection.query({
            sql:'UPDATE `profile` SET `is_private` = ? WHERE `guid` = ?', 
            values: [ isPrivate, guid ] 
        }, function(err, result) {
            if (err) {
                console.log("Error updateUserPrivacy");
                finalAppResponse( defaultErrorResponse( ActiveValues.Active, ErrorMessageGeneric));
            } else {
                
                if ( result.affectedRows > 0 ) {

                    finalAppResponse( isPrivateResponse( 
                        ActiveValues.Active, privacy, null 
                    ));
                } else {
                    finalAppResponse( defaultErrorResponse( ActiveValues.Active, ErrorMessageGeneric));
                }
            }
        });
    }



/**
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 * 
 * 
 *                                     Delete account
 * 
 * 
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 */

    function commitDeleteTransaction() {
        connection.commit(function(err) {
            if (err) {
                // Failed to commit queries. Rollback on failure
                connection.rollback(function() {
                    printError(err);
                    finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );                
                });
            } else  {
                console.log('successful commit!');
                finalAppResponse( deleteResponse( 
                    ActiveValues.Deleted, null));
            }
        });
    }

    function updateDeleteUserTable(guid) {

        connection.query({
            sql:'UPDATE `users` SET active = ? WHERE `guid` = ?', 
            values: [ActiveValues.Deleted, guid]
        }, function (err, results) {
            if (err) {
                // Rollback on failure
                connection.rollback(function() {
                    printError(err);
                    finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );
                });    
            } else {
                connection.commit(function(err) {
                    if (err) {
                        // Failed to commit queries. Rollback on failure
                        connection.rollback(function() {
                            printError(err);
                            finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );
                        });
                    } else  {
                        console.log('successful commit!');

                        commitDeleteTransaction();
                    }
                });
            }
        });
    }

    function deleteProfile(guid) {

        connection.query({
            sql: 'DELETE FROM `profile` WHERE guid = ?',   
            values: [guid]
        }, function (err, result) {

            if (err) {
                printError(err);
                connection.rollback(function() {
                    finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );                
                });    
            }
            if (result && result.affectedRows  > 0 ) {

                console.log('deleted ' + result.affectedRows + ' rows');
                updateDeleteUserTable(guid);

            } else {
                commitDeleteTransaction();
            }
        });
    }
    


    // Add user to Users and Search table
    function beginTransactionToDeleteUser(guid) {
        connection.beginTransaction(function(err) {
            if (err) { 
                printError(err);
                finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );                
            } else {
                deleteProfile(guid);
            }
        });
    }



    var didSavePhoto   = false;
    var didSaveProfile = false;

    let kAction = "action";

    function queryActiveAccount(parameter) {
        console.log("queryActiveAccount: " + parameter);

        connection.query({
            sql: 'SELECT `guid`, `active` FROM `users` WHERE `id` = ? AND `acctid` = ?', 
            values: [userId, acctId]
        }, function (error, results) {

            if (error) {
                printError(error); 
                finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, ErrorMessageGeneric));
            }
            else if (results && results.length > 0) {
                console.log('User exists, returning current info');
                console.log('Results:', JSON.stringify(results, null, 2));

                if ( results[0].active == ActiveValues.Active ) {

                    let guid = results[0].guid;

                    if ( pathParams.localeCompare("/accounts/verify" ) == 0 ) {
                            

                        if (parameter[kVerified] === true) {
                            verifyFacebookUser(guid, parameter[kFacebookToken]); 
                        } else { 
                            verifyUser(guid, 0); 
                        }
                    
                    } else if ( pathParams.localeCompare("/accounts/privacy" ) == 0 ) {
                            
                        updateUserPrivacy(guid, parameter ); 

                    } else if ( pathParams.localeCompare("/accounts/permissions" ) == 0 ) {
                            
                        
                        let allowViewFollowingsAction         = "allowViewFollowings";
                        let allowViewFollowersAction          = "allowViewFollowers";
                     
                        var action     = requestBody[kAction];

                        if (isStringWithLength(action) && isInt(parameter) && parameter >= 0 && parameter < 3) {

                            if (action === allowViewFollowingsAction ) {
                            
                                updateViewFollowingsPermission(guid, parameter ); 
                           
                            } else if (action === allowViewFollowersAction ) {
                            
                                updateViewFollowersPermission(guid, parameter ); 
            
                            } else {
                                finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );            
                            }

                        } else {
                            finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );            
                        }


                        // let allowViewMeInFollowingsListAction = "allowViewMeInFollowingsList";
                        // let allowViewMeInFollowersListAction  = "allowViewMeInFollowersList";



                        // if (!isStringWithLength(action)) {
                        //     finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );            
                        
                        // } else if (action === allowViewFollowingsAction ) {
                            
                        //     updateViewFollowingsPermission(guid, parameter ); 

                        // } else if (action === allowViewFollowersAction ) {
                            
                        //     updateViewFollowersPermission(guid, parameter ); 

                        // } else if (action === allowViewMeInFollowingsListAction ) {
                            
                        //     updateViewMeInFollowersListPermission(guid, parameter ); 

                        // } else if (action === allowViewMeInFollowersListAction ) {
                        //     updateViewMeInFollowersListPermission(guid, parameter ); 

                        // } else {
                        //     finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );            
                        // }

                    } else if ( pathParams.localeCompare("/accounts/delete" ) == 0 ) {
                            
                        beginTransactionToDeleteUser(guid);

                    } else { /// Feedback
                        giveUsFeedback(guid, parameter ); 
                    }
                    
                } else {

                    finalAppResponse( verifyResponse( 
                        ActiveValues.DoesNotExist, null, null,  null));                             
                }
            
            } else {
                finalAppResponse( verifyResponse( 
                    ActiveValues.DoesNotExist, null, null,  null
                ));
            }
        });
    }




/**
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 * 
 * 
 *                                  Start Here
 * 
 * 
 *  =============================================================================================================
 *  =============================================================================================================
 *  =============================================================================================================
 */
    
 
    // Error checking user input
    if ( !isStringWithLength(userId) || userId.length > 100 ) {
        // responseCode = httpResponseCode.Unauthorized;
        finalAppResponse( defaultErrorResponse( ActiveValues.Unknown, activeErrorMessage( ActiveValues.Unknown )));
    
    } else if ( pathParams.localeCompare("/accounts/register") == 0 ) {

        doSomeRegistrationErrorChecking();
    
    } else if ( pathParams.localeCompare("/accounts/login") == 0 ) {

            queryLoggedInUser();
        
    } else {
       
        // Error checking acctId input
        if ( !isStringWithLength(acctId) || acctId.length > 10 ) {
            
            // responseCode = httpResponseCode.Unauthorized;
            finalAppResponse( defaultErrorResponse(ActiveValues.Unknown, ErrorMessageGeneric) );

        } else if (pathParams === "/accounts/verify" ) {

            var facebookToken = requestBody[kFacebookToken];
            var isVerified    = requestBody[kVerified];


            console.log("facebookToken: " + facebookToken);
            console.log("isVerified: " + isVerified);

            if ( isStringWithLength(facebookToken)  && isBoolean(isVerified)) {

                var dic = {};
                dic[kFacebookToken]  = facebookToken;
                dic[kVerified]       = isVerified;

                console.log("queryActiveAccount dict: " + dic);

                queryActiveAccount(dic);

            } else {
                console.log("Some error facebook ")
                finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );
            }

        } else if ( pathParams ===  "/accounts/privacy") {

            var privacy = requestBody[kPrivate];
            console.log("privacy: " + privacy);

            if (isBoolean(privacy)) {
                queryActiveAccount(privacy);
            } else {
                finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );            
            } 




        } else if (pathParams.startsWith("/accounts/permission")) {

            console.log("/accounts/permission: ");

            var permission = requestBody[kPermission];
           
            if (!isInt(permission)) {
                finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );            
            } else {
                queryActiveAccount(permission);
            }

        } else if ( pathParams ===  "/accounts/permissions") {

            var permission = requestBody[kAllowFollowingsView];
            console.log("Following permission: " + permission);

            if (isBoolean(permission)) {
                queryActiveAccount(permission);
            } else {
                finalAppResponse( defaultErrorResponse(ActiveValues.Active, ErrorMessageGeneric) );            
            } 

        } else if ( pathParams == "/accounts/delete" ) {
                            
            beginTransactionToDeleteUser(results[0].guid);

        } else if ( pathParams == "/accounts/feedback" ) {

            var feedback = requestBody[kFeedBack];

            var type = requestBody[kType];
            console.log("feedback: " + feedback);
            console.log("type: " + type);

   
            if (isStringWithLength(feedback) && isStringWithLength(type)) {
                var dic = {};
                dic[kFeedBack]  = feedback;
                dic[kType]      = type;
                queryActiveAccount(dic);
            } else {
                finalAppResponse( defaultErrorResponse(ActiveValues.Unknown, ErrorMessageGeneric) );            
            }                 
        } else {
            finalAppResponse( defaultErrorResponse(ActiveValues.Unknown, ErrorMessageGeneric) );
        }
    }
};
