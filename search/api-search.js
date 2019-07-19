'use strict';
console.log('Loading function');

/* Import Libraries */
var mysql = require('mysql');
var uuid  = require('uuid');

var AWS = require("aws-sdk");


var s3 = new AWS.S3({ apiVersion: '2006-03-01'});



var APP_NAME  = "Fifo";
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

let kSignedUrl =  "signedUrl";


let kProfileUrl = "profileUrl";

let kPrivate = "private";

let kCount = "count";
let kTitle = "title";
let kCreateDate = "createDate"

let kNewestMediaTimestamp   = "newestTimestamp";
let kAlbumCover             = "albumCover";

let kAlbums = "albums";


let kViews = "views";

let kFriendGuid =    "fguid";

                


let kFollowers        = "followers";
let kFollowedStatus  = "followedStatus";
let kFollowingStatus = "followingStatus";
let kBlocked        = "blocked"



let kScore          = "score";
let kFollowersCount = "followersCount";
let kFollowingCount = "followingCount";


let kProfiles       = "profiles";
let kActive         = "active";
let kErrorMessage   = "errorMessage";


let kLikeCount = "likeCount";
let kDislikeCount = "dislikeCount";


var ErrorMessageGeneric = APP_NAME + " is experiencing problems. Try again shortly";



// Helper function used to validate input
function invalidCharacters(username) {
    var regexp = /^[a-zA-Z0-9-_.]+$/;
    if ( regexp.test(username) ) { 
        return false;
    }
    return true;
}

function isStringWithLength(word) {
    return typeof word === 'string' && word.length > 0;
}

function isValidGuid(guid) {

    return isStringWithLength(guid) && guid.length > 45 && guid.length < 100; 
}

function isValidUsername(username) {

    return isStringWithLength(username) && username.length < MAX_CHARACTER_LENGTH + 1; 
}
     
function isInvalidUsername(username) {
    if (!isStringWithLength(username)) {
        return "Please enter a username";
    }
    if (username.length > MAX_CHARACTER_LENGTH) {
        return "Username is too long. It can be at most "  + MAX_CHARACTER_LENGTH;  
    }
    
    if ( invalidCharacters(username) ){
        return "Username can only have letters, numbers, and ._-";  
    }        
}


function isInt(value) {
    if (isNaN(value)) {
        return false;
    }
    var x = parseFloat(value);
    return (x | 0) === x;
}



function isBoolean(val) {
    return typeof(val) === "boolean";
}

function intToBool(val) {
    if (!isInt(val) ) return false;
    return val === 0 ? false : true;
}



function printError(err) {
    console.log(err);
    console.error('Error Stack is: ' + err.stack);
}


console.log('creating connection');

var connection = mysql.createConnection({
    host     : 'mysqldromotest.cyoa59avdmjr.us-east-1.rds.amazonaws.com',
    user     : 'hannyalybear',
    password : 'SummerIsNearAndYellow1',
    database : 'dromotestmysqldb',
    charset  : 'utf8mb4_unicode_ci' 
});



var ActiveValues = {
    Active            : 0,
    Unknown           : 1,   
    DoesNotExist      : 2,   // Company suspended
    Deleted           : 3,   // User deleted 
    Disabled          : 4,   // User disbaled??
    DisabledConfirmed : 5,   // Company suspended
};


let kCurrentPage = "currentPage";


let kAllowFollowersView     =  "allowFollowersView";
let kAllowFollowingsView    =  "allowFollowingsView";

var Relationship = {
    Unknown               : 0,
    NoneExist             : 1,
    FollowRequested       : 2,        
    IsFollowing           : 3,   
    // BlockedUser           : 4,
    CanceledFollowRequest : 5
};

function errorResponse( errorMessage) {
    var response = {};
    response[kActive]  = ActiveValues.Active;
    response[kErrorMessage] = errorMessage;
    return response;
}

function listFriendsResponse( friends ) {
    var response = {};
    response[kActive]    = ActiveValues.Active;
    response[kFollowers] = friends;
    return response;
}




/*
    Shell command:
cd search; ./compress.sh api-search Rail-Search-mobilehub-1247959479; cd ..
./compress.sh api-search Rail-Search-mobilehub-1247959479

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






    function validateResponse( username, valid ) {
        var response = {
            username : username,
            isValid  :  valid
        };
        response[kActive] = ActiveValues.Active;

        return response;
    }


    function errorResonse(errorMessage) {
        var response = {};
        response[kActive]       = ActiveValues.Active;
        response[kErrorMessage] = errorMessage;
        return response;
    }


    context.callbackWaitsForEmptyEventLoop = false;

    console.log('Received event:', JSON.stringify(event, null, 2));
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    function printTimeForEvent(event) {
        console.log("Event: " + event + ", Time left: " + context.getRemainingTimeInMillis());
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


    var userId      = cognitoIdentityId;
    var currentPage = requestBody[kCurrentPage];


    console.log("ClientID: " + userId);
 
    // Error checking user input
    if ( !isStringWithLength(userId) || userId.length > 100 ) {
        finalAppResponse( errorResonse(ErrorMessageGeneric) );
        return;
    }



    /**
     * 
     * 
     *  Search users : "ap"
     * 
     * table: usersearch         table: profile
     *  (stores top 60)  
     *  keyword, guid         guid, username, 
     *  ap       , 1            1,      apple
     *  ap       , 3            3,      apaul1
     *  ap       , 4            4,      rapack0
     * 
     *  app       , 1            1,      apple
     *  app       , 5            5,      appolo
     *  app       , 7            7,      appature
     * 
     * 
     * 
     *  SELECT `usersearch`.`guid`, friends.status AS following_status, friends.blocked AS blocked, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings
     *  FROM `usersearch` 
     *      INNER JOIN `profile`
     *      ON `usersearch`.`guid` = `profile`.`guid` 
     *          LEFT JOIN user_metrics 
     *          ON user_metrics.guid = profile.guid
     *              LEFT JOIN friends 
     *              ON friends.guid1 = ? AND friends.guid2 = profile.guid
     * 
     *  WHERE usersearch.`keyword` = ?
     * ORDER BY user_metrics.`popularity` DESC 
     * LIMIT 60';
     * 
     */

    
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
        

    function searchForUsernameForKeyword(username) {

        //TODO: Do a join on profile and get username, fullname, verified, about, domain, etc
    

        var usersearchJoinKeyword = 'SELECT `usersearch`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings FROM `usersearch` INNER JOIN `profile` ON `usersearch`.`guid` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE usersearch.`keyword` = ? ORDER BY user_metrics.`popularity` DESC LIMIT 60';

        

        var query = connection.query({
            sql: usersearchJoinKeyword,
            values: [ username ], 
        }, 
        function (error, results, fields) {

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            } 

            if (results) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
                
                var profiles = []; 

                results.forEach((result) => {
                    console.log(result);

                    var userInfo = {};
                    userInfo[kUserName]   = result.username;
                    userInfo[kGuid]       = result.guid;
                    userInfo[kFullName]   = result.fullname;
                    userInfo[kAbout]      = result.about;
                    userInfo[kDomain]     = result.domain;

                    userInfo[kAllowFollowersView]  = intToBool(result.allow_view_followers);
                    userInfo[kAllowFollowingsView] = intToBool(result.allow_view_followings);



                    userInfo[kFollowersCount] = result.followers;
                    userInfo[kFollowingCount] = result.following;
                    userInfo[kScore]          = result.popularity === null ? 0 : result.popularity;


                    userInfo[kFollowingStatus] = followingStatus(result.following_status);
                    userInfo[kBlocked]         = result.blocked;

                    userInfo[kPrivate]    = result.is_private;
                    
                    userInfo[kVerified]   = (result.verified === 1) ? true : false;
                    userInfo[kProfileUrl] = result.image_url;

                    profiles.push(userInfo);  
                });
                
                var response = {};
                response[kActive]   = ActiveValues.Active;// Dont care
                response[kProfiles] = profiles

                
                finalAppResponse( response  );

                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            }
        });
    }


    
    
// "SELECT * 
// FROM user_album 
// WHERE MATCH(title) 
// AGAINST('arm pump +heav*' IN BOOLEAN MODE) 
// LIMIT ?"


/*
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
    ORDER BY ((alvm.last_viewed_timestamp IS NOT NULL AND newest_media_timestamp > alvm.last_viewed_timestamp) OR alvm.last_viewed_timestamp IS NULL) DESC, newest_media_timestamp DESC 
    LIMIT ?";



    SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private  
    FROM `user_album` AS ua 
        INNER JOIN `profile` 
        ON ua.guid = profile.guid 
    WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND profile.is_private = 0 AND ua.`is_private` = 0 AND explicit = 0 AND count > 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW() ) ORDER BY likes DESC LIMIT ?, ?";


*/


    /**
     * 
     *  Search bar
     * 
     * Treanding terms
     * #apple  #kardashian
     * 
     *  Trending albums
     * 
     * 
     * 
     * @apple is the user 
     * #apple is a search helper
     * 
     * 
     *           Search bar
     * 
     *  Users   |   Albums  |   Channels
     * 
     * 
     * 1) User posts to channel by including "#word"
     * 
     * 2) User can follow search and follow channels (Add later)
     * 
     * 3) When user searchs for albums: can search for both 'title' and 'tags'?
     * 
     * 
     * 
     * 
     * 
     * 
     *  How are hastags used?
     * 
     *  Subscribe/post to channels
     * 
     *  /apple
     *  /macintosh
     *  /google
     * 
     * Hashtags can help search for album descriptions
     * 
     * 
     * 
     * 
     * To sort username and albums, we rank each object
     * 
     * Change search users to : usersname, userrealname, bio
     * 
     * user ranked by followers + likes => popularity
     * 
     * 
     * Change search albums to : title, hashtags
     * 
     * abums ranked by liked
     * 
     * 
     * 
     * 
     */


    function searchTitle(text, startIndex, numberOfItems) {

        console.log("searchTitle");
        
        let list = text.split(" ");
        
        var searchList = [];
        list.forEach((word) => {

            console.log("word: " + word);
        
            var newWord = word + "*";

            searchList.push(newWord);

        });
        var searchParameter =  searchList.join(" ");

        // SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, alvm.last_viewed_media_url, UNIX_TIMESTAMP(last_viewed_timestamp) AS last_viewed_timestamp, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM `user_album` AS ua INNER JOIN `profile` ON ua.guid = profile.guid WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND ua.`is_private` = 0 AND count > 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW() ) ORDER BY likes DESC
        
        
        // var usersearchJoinKeyword = 'SELECT `usersearch`.`guid`, profile.`username`, profile.`fullname`, profile.followers, profile.following, user_metrics.popularity, `profile`.`about`, `profile`.`domain`, `profile`.`is_private`, `profile`.`image_url`, `profile`.`verified`, profile.allow_view_followers, profile.allow_view_followings FROM `usersearch` INNER JOIN `profile` ON `usersearch`.`guid` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE usersearch.`keyword` = ? ORDER BY usersearch.`popularity` DESC LIMIT 60';

        
        // SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username, `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, user_metrics.popularity, `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
        // FROM `user_album` AS ua 
        //     INNER JOIN `profile` 
        //     ON ua.guid = profile.guid 
        //         LEFT JOIN user_metrics 
        //         ON user_metrics.guid = profile.guid
        // WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND profile.is_private = 0 AND ua.`is_private` = 0 AND explicit = 0 AND count > 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW() ) 
        // ORDER BY likes DESC LIMIT ?, ?";

        



        var publicAlbumsquery = "SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, number_of_replies, comments_on, number_of_total_replies, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers, profile.followers, profile.following, user_metrics.popularity, `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private  FROM `user_album` AS ua INNER JOIN `profile` ON ua.guid = profile.guid LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND profile.is_private = 0 AND ua.`is_private` = 0 AND explicit = 0 AND count > 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW() ) ORDER BY likes DESC LIMIT ?, ?";
        
        
        // var searchAlbumsQuery = 'SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private  FROM `user_album` WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) AND `is_private` = 0 AND count > 0 ORDER BY likes DESC LIMIT ?, ?';
        
        connection.query({
            sql: publicAlbumsquery,
            values: [searchParameter, startIndex, numberOfItems]
        }, 
        function (error, results, fields) {
            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    console.log(results.length);
                    console.log("results: " + JSON.stringify(results));


                    let allAlbums = getAlbumsFromResults(results);
                    finalAppResponse( getAlbumsResponse( allAlbums)); 



                    // var trendingAlbums = []; 

                    // results.forEach((result) => {
                    //     console.log(result);

                    //     var albumInfo = {};
                    //     albumInfo[kGuid]                 = result.guid;
                    //     albumInfo[kAlbumId]              = result.id;
                    //     albumInfo[kCount]                = result.count;
                    //     albumInfo[kLikeCount]            = result.likes;
                    //     albumInfo[kDislikeCount]         = result.dislikes;

                    //     albumInfo[kTitle]  = titleToUTF(result.title);

                    //     // if ( validator.isBase64(result.title) ) {
                    //     //     albumInfo[kTitle]  = titleToUTF(result.title);
                    //     // } else {
                    //     //     albumInfo[kTitle] = result.title;
                    //     // }

                    //     albumInfo[kCreateDate]           = result.create_date.toString();
                    //     albumInfo[kNewestMediaTimestamp] = result.newest_media_timestamp.toString();
                    //     albumInfo[kAlbumCover]           = result.cover_album_url;
                    //     albumInfo[kPrivate]              = false;
                    //     albumInfo[kSignedUrl]            = result.signed_url;
                    //     albumInfo[kViews]                = result.views

                    //     // albumInfo[kVerified]   = (result.verified === 1) ? true : false;
                    //     // albumInfo[kProfileUrl] = result.image_url;

                    //     trendingAlbums.push(albumInfo);  
                    // });
                    
                    // var response = {};
                    // response[kActive]  = ActiveValues.Active;// Dont care
                    // response[kAlbums] = trendingAlbums

                    
                    // finalAppResponse( response  );

                } else {
                    console.log("Unknown error in results for Select query");
                    finalAppResponse( errorResonse(ErrorMessageGeneric) );
                }
            }
        });
    }


    // Searchs for a list of words with substring text 

    /**
     * 
     *  substring,  word,       count, rank
     *  ap,         apple,      2,331,
     *  ap,         apples,       191,
     *  ap,         applegate,    939,
     * 
        SELECT word, count, 
        FROM hashtags
        WHERE substring = ?
        ORDER BY count LIMIT 100
    */



   
    /**
     * Gets a list of tags and the number of albums that have said tag
     */
    function searchTags(text) {

        console.log("searchTags" + text);
        
        if (text === null) {
            finalAppResponse( gethashtagResponse([])); 
        }

        var sqlQuery = "SELECT tag, count FROM hashtags WHERE substring = ? ORDER BY count LIMIT 20";
        
        connection.query({
            sql: sqlQuery,
            values: [text]
        }, 
        function (error, results, fields) {
            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    console.log(results.length);
                    console.log("results: " + JSON.stringify(results));

                    

                    let hashtagList = [];

                    results.forEach((result) => {
                        let hashtagDict = {};
                        hashtagDict[kHashtag] = result.tag;
                        hashtagDict[kCount]   = result.count;
                        hashtagList.push(hashtagDict);
                    });



                    // let hashtagDict = {};

                    // results.forEach((result) => {
                    //     hashtagDict[result.tag] = result.count;

                    //     // let hashtagObject = {};
                    //     // hashtagObject[result.tag] = result.count;

                    //     // hashtagObject[kHashtag] = result.word;
                    //     // hashtagObject[kCount]   = result.count;
                        
                    //     // hashtagList.push(hashtagObject);
                    // });

                     
                    finalAppResponse( gethashtagResponse(hashtagList)); 
                    
                } else {
                    console.log("Unknown error in results for Select query");
                    finalAppResponse( gethashtagResponse([])); 
                }
            }
        });
    }

        /**
     * 
     *  
     * 
     *  Assume "apple" selected
     * 
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
     
        SELECT guid, album_id
        FROM tagged_albums
            INNER JOIN user_albums 
            ON 
        WHERE tag = ?
        ORDER BY rank
        LIMIT 100

        var text = "apple";

        
    SELECT ua.`guid`, ua.explicit, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
    FROM tagged_albums AS ta
        INNER JOIN `user_album` AS ua 
        ON ta.guid = ua.guid AND ta.album_id = ua.`id`
            INNER JOIN `profile` 
            ON ua.guid = profile.guid 
    WHERE tag = ? AND profile.is_private = 0 AND ua.`is_private` = 0 AND explicit = 0 AND count > 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW() ) 
    ORDER BY ta.rank DESC 
    LIMIT ?, ?";
    
    WHERE MATCH(title) AGAINST(? IN BOOLEAN MODE) 
    or ORDER BY likes

    */    


    /**
     * 
     
     SELECT ua.`guid`, ua.explicit, ua.comments_on, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, number_of_replies, number_of_total_replies, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private 
     FROM tagged_albums AS ta 
        INNER JOIN `user_album` AS ua 
        ON ta.guid = ua.guid AND ta.album_id = ua.`id` 
            INNER JOIN `profile` 
            ON ua.guid = profile.guid 
    WHERE tag = ? AND profile.is_private = 0 AND ua.`is_private` = 0 AND explicit = 0 AND count > 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW() ) 
    ORDER BY ta.rank DESC LIMIT ?, ?";

     * Gets a list of albums having "hashtag". Sorts by top posts
     */

    function searchAlbumsWithTag(tag, startIndex, numberOfItems) {

        console.log("searchAlbumsWithTag");
        
        if (tag === null) {
            /// Return empty list
            let allAlbums = getAlbumsFromResults([]);
            finalAppResponse( getAlbumsResponse( allAlbums)); 
            return;
        }

        var sqlQuery = "SELECT ua.`guid`, ua.explicit, ua.comments_on, ua.first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, ua.`id` AS album_id, ua.`views`, ua.`likes`, ua.`dislikes`, number_of_replies, number_of_total_replies, UNIX_TIMESTAMP(`create_date`) AS create_date, ua.expire, ua.expire_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS newest_media_timestamp , ua.`title`, ua.`is_private` AS album_is_private, ua.`cover_album_url`, ua.`count`, `profile`.username,  `profile`.allow_view_followings, profile.allow_view_followers,  `profile`.fullname, `profile`.image_url, `profile`.verified, `profile`.is_private AS profile_is_private FROM tagged_albums AS ta INNER JOIN `user_album` AS ua ON ta.guid = ua.guid AND ta.album_id = ua.`id` INNER JOIN `profile` ON ua.guid = profile.guid WHERE tag = ? AND profile.is_private = 0 AND ua.`is_private` = 0 AND explicit = 0 AND count > 0 AND (ua.expire_date IS NULL OR ua.expire_date > NOW() ) ORDER BY ta.rank DESC LIMIT ?, ?";
        
        connection.query({
            sql: sqlQuery,
            values: [tag, startIndex, numberOfItems ]
        }, 
        function (error, results, fields) {
            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    console.log(results.length);
                    console.log("results: " + JSON.stringify(results));


                    let allAlbums = getAlbumsFromResults(results);
                    finalAppResponse( getAlbumsResponse( allAlbums)); 

                } else {
                    console.log("Unknown error in results for Select query");
                    finalAppResponse( errorResonse(ErrorMessageGeneric) );
                }
            }
        });
    }


/*

        SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
        FROM `user_album` 
            INNER JOIN tagged_albums ta 
            ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id 
                INNER JOIN `profile` 
                ON `user_album`.`guid` = `profile`.`guid` 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE 
        ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC LIMIT ?, ?';
  

        SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, number_of_replies, number_of_total_replies, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
        FROM `user_album` 
            INNER JOIN tagged_albums ta 
            ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id 
                INNER JOIN `profile` 
                ON `user_album`.`guid` = `profile`.`guid` 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE 
        ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC LIMIT ?, ?';

        Sorts by rank? 


        SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, `guid`, `id`, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, number_of_replies, number_of_total_replies 
        FROM `user_album` 
        WHERE `is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 
        ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(newest_media_timestamp) / 300000) DESC 
        LIMIT ?, ?';


        var topTrendingAlbums = 'SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, number_of_replies, number_of_total_replies, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
        FROM `user_album` 
            INNER JOIN tagged_albums ta 
            ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id 
                
            INNER JOIN `profile` 
                ON `user_album`.`guid` = `profile`.`guid` 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE 
        
        //ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC 
        
        LIMIT ?, ?';





        SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, number_of_replies, number_of_total_replies, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
        FROM `user_album` 
            INNER JOIN tagged_albums ta 
            ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ?
        

    */

    function searchAlbumsForTag(hashtag) {

        var last23HoursAnd50Minutes = (23*60 + 50) * NUMBER_OF_DAYS_GOOD;
        var maxAlbums = 60;
        var offSet =  currentPage * maxAlbums
        // var topTrendingAlbums = 'SELECT `guid`, `id`, `count`, `title`, `create_date`, `newest_media_timestamp`, `cover_album_url` FROM `user_album` WHERE `is_private` = 1 AND score = ? AND views = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 ORDER BY score DESC LIMIT ?,?';
        
        var topTrendingAlbums = 'SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, number_of_replies, number_of_total_replies, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `user_album` INNER JOIN tagged_albums ta ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id INNER JOIN `profile` ON `user_album`.`guid` = `profile`.`guid` WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC LIMIT ?, ?';


        var topTrendingAlbums = 'SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, number_of_replies, number_of_total_replies, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `user_album` INNER JOIN tagged_albums ta ON `user_album`.`guid` = ta.`guid` AND  user_album.id = ta.album_id INNER JOIN `profile` ON `user_album`.`guid` = `profile`.`guid` WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0  AND count > 0  AND tag = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC LIMIT ?, ?';



        var parameters = [hashtag, last23HoursAnd50Minutes , offSet, maxAlbums];

        
        connection.query({
            sql: topTrendingAlbums,
            values: parameters
        }, 
        function (error, results, fields) {
            if (error) {
                printError(error);
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    console.log(results.length);
                    console.log("results: " + JSON.stringify(results));

                    let allAlbums = getAlbumsFromResults(results);
                    finalAppResponse( getAlbumsResponse( allAlbums)); 
                }
            }
        });
    }

    



    let kHashtags = "hashtags"
    let kHashtag  = "hashtag"
    
    
    function gethashtagResponse( list) {
        var response = {}
        response[kActive]   = ActiveValues.Active;
        response[kHashtags] = list;
        return response;
    }


    function getAlbumsResponse( albums) {
        var response = {}
        response[kActive]  = ActiveValues.Active;
        response[kAlbums]  = albums;
        return response;
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



    
    let kFirstUrl       = "firstUrl";
    let kSignedFirstUrl = "signedFirstUrl";
    let kExplicit       = "explicit";
    
    let kAlbum      = "album";
    let kExpireDate = "expireDate";
    let kExpireDays = "expire";
    let kProfile    = "profile";
    var IsPublic  = 0;
    
    

    // Multiple albums may have access to this content
    function albumCoverThumbnailKey(guid, mediaUrl) {
        return guid + "/thumb/" + mediaKeyWithExtension(mediaUrl, MediaType.Photo);
    }

    // Multiple albums may have access to this content
    function albumFirstMediaKey(guid, mediaUrl) {
        return guid + "/media/" + mediaUrl;
    }
    
    var ALBUM_BUCKET = "dromo-albums";
    let SECONDS_IN_MINUTE = 60; 
    let MINUTES_IN_HOUR = 60;   // 3,600
    let HOURS_IN_DAY = 24;      // 86,400
    let NUMBER_OF_DAYS = 7;     // 172,800
    
    let S3_EXPIRE_LIMIT =  SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * NUMBER_OF_DAYS;
    


    function getAlbumsFromResults( results) {
        
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

            // console.log("getAlbumsFromResults result.album_id: " + result.album_id);

                                        
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

            

            if (result.album_is_private === IsPublic) {
                album[kViews]                = result.views;
                album[kLikeCount]            = result.likes;
                album[kDislikeCount]         = result.dislikes;
            }


            // if (result.last_viewed_timestamp !== undefined && result.last_viewed_timestamp !== null ) {
            //     album[kLastViewedMediaUrl]       = result.last_viewed_media_url;
            //     album[kLastViewedMediaTimestamp] = result.last_viewed_timestamp.toString();
            // }
            var profile = {};


            profile[kGuid]       = result.guid;   
            profile[kUserName]   = result.username;
            profile[kFullName]   = result.fullname;
            profile[kVerified]   = intToBool(result.verified);
            profile[kAbout]      = result.about;
            profile[kDomain]     = result.domain;
            
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
            console.log("kProfile: " + JSON.stringify(profile))
            
            // console.log("result.last_viewed_timestamp mediaContentType of = "  + typeof result.last_viewed_timestamp  );

            albumsList.push(albumInfo);
        });

        return albumsList;
    }
    let kCommentsOn = "commentsOn";



    /*
     *  Query database and make sure the user only has one username for now.
     *  If we find it return it
     */
   

    /** min: inclusive, max: inclusisive */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

 
    let kCommentCount       = "commentCount";
    let kCommentTotalCount  = "commentTotalCount";
    

        //TODO: Remove this
        var NUMBER_OF_DAYS_GOOD = 200;

    /**
     * This function will select past 24 albums, 
     */
    function trendingAlbums() {
        console.log("trendingAlbums start" );
        
        // if ( !(currentPage !== undefined && currentPage !== null && !Number.isInteger(currentPage.length)) ) {
        //     finalAppResponse( errorResonse(ErrorMessageGeneric) );
        //     return;
        // }





        /**
         * 
         
         
         SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
         FROM `user_album` 
            INNER JOIN `profile` 
            ON `user_album`.`guid` = `profile`.`guid` 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 
        ORDER BY 
            LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC
        LIMIT ?, ?';
                

            LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes)
            + (UNIX_TIMESTAMP(create_date) / 300000) DESC

        create_date


        SELECT 
            id, url, title, thumbs_up, thumbs_down, created
        FROM 
            videos
        ORDER BY 
            LOG10(ABS(thumbs_up - thumbs_down) + 1) * SIGN(thumbs_up - thumbs_down)
            + (UNIX_TIMESTAMP(created) / 300000) DESC
        LIMIT 100



        
        SELECT 
            hashtag, mentioned, byGuid
        FROM 
            hashtags
        ORDER BY 
            LOG10(ABS(thumbs_up - thumbs_down) + 1) * SIGN(thumbs_up - thumbs_down)
            + (UNIX_TIMESTAMP(created) / 300000) DESC
        LIMIT 100

        2000 - 1000 = 1000 + 1  = 1001 * (+1) = 1001
        1000 - 2000 = -1000 + 1 = -999 * (-1) = 999

        100 - 2000 = -1900 + 1 = -1899 * (-1) = 1899

        1000     -1000 
        1001      -999 * 


        
        SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
        FROM `user_album` 
            INNER JOIN `profile` 
            ON `user_album`.`guid` = `profile`.`guid` 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC LIMIT ?, ?';


        
        SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, profile.followers, profile.following, user_metrics.popularity, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
        FROM `user_album` 
            INNER JOIN `profile` 
            ON `user_album`.`guid` = `profile`.`guid` 
                LEFT JOIN user_metrics 
                ON user_metrics.guid = profile.guid 
        WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(create_date) / 300000) DESC LIMIT ?, ?';


        SELECT first_url, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, `guid`, `id`, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views` 
        FROM `user_album` 
        WHERE `is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 
        ORDER BY likes DESC 

         LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes)
            + (UNIX_TIMESTAMP(create_date) / 300000) DESC

        LIMIT ?, ?';

                topTrendingAlbums = 'SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, number_of_replies, number_of_total_replies, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, profile.followers, profile.following, user_metrics.popularity, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
                FROM `user_album` 
                    INNER JOIN `profile` 
                    ON `user_album`.`guid` = `profile`.`guid` 
                        LEFT JOIN user_metrics 
                        ON user_metrics.guid = profile.guid 
                WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 
                ORDER BY LOG10( ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(newest_media_timestamp) / 300000) DESC LIMIT ?, ?';


                ORDER BY 
                
                LOG10( MAX(ABS(likes - dislikes), 1)) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(newest_media_timestamp) / 300000) DESC LIMIT ?, ?';


                ORDER BY LOG10( GREATEST(ABS(CAST(likes AS SIGNED) - CAST(dislikes AS SIGNED)), 1)) * SIGN(CAST(likes AS SIGNED) - CAST(dislikes AS SIGNED)) + ((UNIX_TIMESTAMP(newest_media_timestamp) - 1502018111) / 45000) DESC




                1000 - 1 = 999              LOG10(1000) * 

                1 - 1000 = -999


                1134028003 - 1134028003 = 0


                1,134,028,003 + 2000 - 1134028003 = 2000


                1524224444
                
                
                
            SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, number_of_replies, number_of_total_replies, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, profile.followers, profile.following, user_metrics.popularity, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url 
            FROM `user_album`
                INNER JOIN `profile`    
                ON `user_album`.`guid` = `profile`.`guid` 
                    LEFT JOIN user_metrics  
                    ON user_metrics.guid = profile.guid 
            WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 
            ORDER BY LOG10( GREATEST(ABS(CAST(likes AS SIGNED) - CAST(dislikes AS SIGNED)), 1)) * SIGN(CAST(likes AS SIGNED) - CAST(dislikes AS SIGNED)) + ((UNIX_TIMESTAMP(newest_media_timestamp) - 1502018111) / 45000) DESC LIMIT ?, ?';


            Instead of being called millions of times by users,

            Create table every finve minutes: trending_table_n
            Select and Insert x rows

            Insert into to "trending_table_names" the last created table name


            Then from here: Get the last inserted tablename
            and query for that tablename


            func 
            


            1) Get tablename:
            SELECT MAX(id), name
            FROM trending_table_names
            ORDER BY DESC

            SELECT album info
            FROM table_name


         */
       
         
        // number_of_replies, number_of_total_replies

        var last23HoursAnd50Minutes = (23*60 + 50) * NUMBER_OF_DAYS_GOOD;
        var maxAlbums = 60;
        var offSet =  currentPage * maxAlbums
        // var topTrendingAlbums = 'SELECT `guid`, `id`, `count`, `title`, `create_date`, `newest_media_timestamp`, `cover_album_url` FROM `user_album` WHERE `is_private` = 1 AND score = ? AND views = ? AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 ORDER BY score DESC LIMIT ?,?';
        var topTrendingAlbums = 'SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, `guid`, `id`, `count`, `likes`, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, number_of_replies, number_of_total_replies FROM `user_album` WHERE `is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(newest_media_timestamp) / 300000) DESC LIMIT ?, ?';
        var parameters = [last23HoursAnd50Minutes , offSet, maxAlbums];


        topTrendingAlbums = 'SELECT first_url, comments_on, UNIX_TIMESTAMP(`first_timestamp`) AS first_timestamp, explicit, user_album.`guid`, `id` AS album_id, `count`, `likes`, number_of_replies, number_of_total_replies, `dislikes`, `title`, UNIX_TIMESTAMP(`create_date`) AS create_date, UNIX_TIMESTAMP(`newest_media_timestamp`) AS `newest_media_timestamp`, `cover_album_url`, `views`, user_album.`is_private` AS album_is_private, `profile`.`username` AS username, `profile`.allow_view_followers, `profile`.allow_view_followings, profile.followers, profile.following, user_metrics.popularity, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private as profile_is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `user_album` INNER JOIN `profile` ON `user_album`.`guid` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE profile.`is_private` = 0 AND user_album.`is_private` = 0 AND explicit = 0 AND newest_media_timestamp > NOW() - INTERVAL ? MINUTE AND count > 0 ORDER BY LOG10( GREATEST(ABS(CAST(likes AS SIGNED) - CAST(dislikes AS SIGNED)), 1)) * SIGN(CAST(likes AS SIGNED) - CAST(dislikes AS SIGNED)) + ((UNIX_TIMESTAMP(newest_media_timestamp) - 1502018111) / 45000) DESC LIMIT ?, ?';
        // ORDER BY LOG10(ABS(likes - dislikes) + 1) * SIGN(likes - dislikes) + (UNIX_TIMESTAMP(newest_media_timestamp) / 300000) DESC LIMIT ?, ?';
        
        // var randomTrendingAlbums =  'SELECT `guid`, `id`, `count`, `title`, `is_private`, `create_date`, `newest_media_timestamp`, `cover_album_url` FROM `user_album` WHERE `is_private` = 1 AND score = ? AND views = ?';
        
        connection.query({
            sql: topTrendingAlbums,
            values: parameters
        }, 
        function (error, results, fields) {
            if (error) {
                printError(error);
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    console.log(results.length);
                    console.log("results: " + JSON.stringify(results));


                    let allAlbums = getAlbumsFromResults(results);
                    finalAppResponse( getAlbumsResponse( allAlbums)); 


                } else {
                    console.log("Unknown error in results for Select query");
                    finalAppResponse( errorResonse(ErrorMessageGeneric) );
                }
            }
        });
   }


    // function titleToUTF(base64Title) {
    //     return new Buffer(base64Title, 'base64').toString('utf8');
    // }

    function validateUsername( username ) {
        var query = connection.query({
            sql: 'SELECT * FROM `profile` WHERE `username` = ?',
            values: [username]
        }, 
        function (error, results, fields) {
            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            } else { 
                if (results) {
                    if (results.length > 0) {
                        finalAppResponse( validateResponse(username, false) );
                    } else {
                        finalAppResponse( validateResponse(username, true) );
                    }
                } else {
                    console.log("Unknown error in results for Select query");
                    finalAppResponse( errorResonse(ErrorMessageGeneric) );
                }
            }
        });
    }






    var AccessFollowList = {
        Followers : 0,
        Followings: 1
    };

    
    
     /**
     * guid = guid of person requesting followings list
     * fguid = guid of person's following we want
     * 
     * 
     */

    function hasAccessToUsersFollowersList(guid, profileGuid, lastUsername, listType) {
        
        connection.query({
            sql: "SELECT `friends`.`guid2` AS guid, `friends`.`status` AS following_status, `profile`.allow_view_followings, profile.is_private FROM profile LEFT JOIN `friends` ON `friends`.`guid1` = ? AND `friends`.`guid2` = `profile`.`guid` AND `status` = ? WHERE profile.guid = ? LIMIT 1",
            values: [ guid , Relationship.IsFollowing, profileGuid],
        }, 
        function (error, results, fields) {
            printTimeForEvent("End getting followings");

            if (error) {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse( errorResponse( ErrorMessageGeneric))
            } 

            if (results && results.length > 0) {
                console.log('==== Printing out Results for ' + results.length +  ' rows ====');
              
                let isPrivate           = results[0].is_private;
                let status              = results[0].following_status;
                let allowViewFollowings = results[0].allow_view_followings;
                let allowViewFollowers  = results[0].allow_view_followers;
                
                if ( listType === AccessFollowList.Followers  && allowViewFollowers ) {
                    if (!isPrivate || (isPrivate && status !== null && status === Relationship.IsFollowing) ) {
                        
                        // SHow stuff
                        getFollowersOfUser(profileGuid, lastUsername);
                    
                    } else {
                        finalAppResponse(errorResponse( ErrorMessageGeneric))
                    
                    }
                } else if ( listType === AccessFollowList.Followings && allowViewFollowings ) {
                    if (!isPrivate || (isPrivate && status !== null && status === Relationship.IsFollowing) ) {
                        
                        // SHow stuff
                        getFollowingsOfUser(profileGuid, lastUsername);
                    
                    } else {
                        finalAppResponse(errorResponse( ErrorMessageGeneric))
                    
                    }
                }
                
                else {
                    finalAppResponse(errorResponse( ErrorMessageGeneric))
                }
            }
        });
    }


    

     /**
      *     Get the people that are followign the user: i.e. guid1
      */


      function getFollowersOfUser(guid, lastUsername) {
        
        var sqlStmt = "SELECT `friends`.`guid1` AS guid, `profile`.`username` AS username,  profile.followers, profile.following, user_metrics.popularity, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `friends` INNER JOIN `profile` ON `friends`.`guid1` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid2` = ? AND `status` = ? ORDER BY `username` LIMIT 60";
        var parameters = [ guid , Relationship.IsFollowing];

        if (isStringWithLength(lastUsername)) {
            var sqlStmt = "SELECT `friends`.`guid1` AS guid, `profile`.`username` AS username,  profile.followers, profile.following, user_metrics.popularity, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `friends` INNER JOIN `profile` ON `friends`.`guid1` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid2` = ? AND `status` = ? AND username > ? ORDER BY `username` LIMIT 60";            
            parameters = [ guid , Relationship.IsFollowing, lastUsername];
        }
        
        connection.query({
            sql   : sqlStmt,
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
                
                var friends = []; 

                results.forEach((result) => {
                    console.log(result);
                
                    var userInfo = {};
                    
                    var friend = {};
                    friend[kGuid]           = result.guid;
                    friend[kUserName]       = result.username;
                    friend[kFullName]       = result.fullname;

                    friend[kAbout]      = result.about;
                    friend[kDomain]     = result.domain;


                    friend[kPrivate]        = intToBool(result.is_private);
                    friend[kVerified]       = intToBool(result.verified);
                    friend[kProfileUrl]     = result.image_url;

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

                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }



     /**
      *     Get the people the user is following: i.e.  guid2
      */

      function getFollowingsOfUser(guid, lastUsername) {
        
        var sqlStmt = "SELECT `friends`.`guid2` AS guid, `profile`.`username` AS username,  profile.followers, profile.following, user_metrics.popularity, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `friends` INNER JOIN `profile` ON `friends`.`guid2` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid1` = ? AND `status` = ? ORDER BY `username` LIMIT 60";
        var parameters = [ guid , Relationship.IsFollowing];

        if (isStringWithLength(lastUsername)) {
            sqlStmt = "SELECT `friends`.`guid2` AS guid, `profile`.`username` AS username,  profile.followers, profile.following, user_metrics.popularity, `profile`.allow_view_followers, `profile`.allow_view_followings, `profile`.`fullname` AS fullname, `profile`.`verified` AS verified, profile.is_private, profile.about, profile.domain, `profile`.image_url AS image_url FROM `friends` INNER JOIN `profile` ON `friends`.`guid2` = `profile`.`guid` LEFT JOIN user_metrics ON user_metrics.guid = profile.guid WHERE `friends`.`guid1` = ? AND `status` = ? AND username > ? ORDER BY `username` LIMIT 60";
            parameters = [ guid , Relationship.IsFollowing, lastUsername];
        }
        
        connection.query({
            sql   : sqlStmt,
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
                
                var friends = []; 

                results.forEach((result) => {
                    console.log(result);
                
                    var userInfo = {};
                    
                    var friend = {};
                    friend[kGuid]           = result.guid;
                    friend[kUserName]       = result.username;
                    friend[kFullName]       = result.fullname;

                    friend[kAbout]      = result.about;
                    friend[kDomain]     = result.domain;


                    friend[kPrivate]        = intToBool(result.is_private);
                    friend[kVerified]       = intToBool(result.verified);
                    friend[kProfileUrl]     = result.image_url;

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

                // if (albumId !== undefined &&  albumId !== null ) {            
                //      getFriendsForAlbum(guid, albumId, response);
                // } else {
                //     finalAppResponse( response);
                // }


                console.log("=============== Done ================");
            } else {
                console.log('Error:', JSON.stringify(error, null, 2));
                finalAppResponse(errorResponse( ErrorMessageGeneric));
            }
        });
    }








    // validate
    if (pathParams.localeCompare("/search/trending") === 0) {
        console.log("trendingAlbums");
        trendingAlbums();
    }

    
    
    
    else if (pathParams.localeCompare("/search/validate") === 0) {
        console.log("search username");

        var username    = requestBody[kUserName]
        if ( isStringWithLength(username) ) {
            username = username.toLowerCase();
        } else {
            username = null;
        }
        console.log("username: " + username);
 

        let errorMessage =  isInvalidUsername(username);

        if (errorMessage && errorMessage.length > 0 ) {
            finalAppResponse( errorResonse(errorMessage) );
            return;
        }

        validateUsername(username);

    } else if (pathParams.localeCompare("/search/users") === 0) {
        console.log("search for users");

        var keyword  = requestBody[kUserName]
        if ( isStringWithLength(keyword) ) {
            keyword = keyword.toLowerCase();
        } else {
            keyword = null;
        }
        console.log("username: " + keyword);
 
        let errorMessage =  isInvalidUsername(keyword);

        if (errorMessage && errorMessage.length > 0 ) {
            finalAppResponse( errorResonse(errorMessage) );
            return;
        }
        searchForUsernameForKeyword( keyword );

    } else if (pathParams.localeCompare("/search/users") === 0) {
        console.log("search for users");

        var username  = requestBody[kUserName]
        if ( isStringWithLength(username) ) {
            username = username.toLowerCase();
        } else {
            username = null;
        }
        console.log("username: " + username);
 
        let errorMessage =  isInvalidUsername(username);

        if (errorMessage && errorMessage.length > 0 ) {
            finalAppResponse( errorResonse(errorMessage) );
            return;
        }
        getUsersProfile( username );

    } else if (pathParams.localeCompare("/search/title") === 0) {
        console.log("search title");

        var text  = requestBody[kTitle]
        if ( isStringWithLength(text) ) {
            text = text.toLowerCase();
        } else {
            text = null;
        }
        console.log("text: " + text);
    
        // let errorMessage =  isInvalidUsername(text);

        // if (errorMessage && errorMessage.length > 0 ) {
        //     finalAppResponse( errorResonse(errorMessage) );
        //     return;
        // }

        searchTitle( text, 0, 10 );


    } else if (pathParams.localeCompare("/search/tags") === 0) {
        console.log("search tags");

        var text  = requestBody[kHashtag];
        if ( isStringWithLength(text) ) {
            text = text.toLowerCase();
        } else {

            text = null;
        }
        console.log("Tag: " + text);
    
        // let errorMessage =  isInvalidUsername(text);

        // if (errorMessage && errorMessage.length > 0 ) {
        //     finalAppResponse( errorResonse(errorMessage) );
        //     return;
        // }

        searchTags( text );


    } else if (pathParams.localeCompare("/search/albumfortag") === 0) {
        
        console.log("search albumfortag");

        var tag  = requestBody[kTitle]
        if ( isStringWithLength(tag) ) {
            tag = tag.toLowerCase();
        } else {
             
            tag = null;
        }
        console.log("Tag: " + tag);
    
        // let errorMessage =  isInvalidUsername(text);

        // if (errorMessage && errorMessage.length > 0 ) {
        //     finalAppResponse( errorResonse(errorMessage) );
        //     return;
        // }

        searchAlbumsForTag( tag );


     } else if (pathParams.localeCompare("/search/list/followings") === 0) {
        printTimeForEvent("list/followings");

        var guid    = requestBody[kGuid];
        var fguid   = requestBody[kFriendGuid];

        if ( isValidGuid(guid) && isValidGuid(fGuid) ) {

            var username    = requestBody[kLastName]
            if ( !isValidUsername(username) ) {
                username = null;
            } else {
                username = username.toLowerCase();
            }

            console.log("username: " + username);
 
            hasAccessToUsersFollowersList(guid, fGuid, username, AccessFollowList.Followings);
        
        } else if (pathParams.localeCompare("/search/list/followers") === 0) {
            printTimeForEvent("list/followings");
    
            var guid    = requestBody[kGuid];
            var fguid   = requestBody[kFriendGuid];
    
            if ( isValidGuid(guid) && isValidGuid(fGuid) ) {
    
                var username    = requestBody[kLastName]
                if ( !isValidUsername(username) ) {
                    username = null;
                } else {
                    username = username.toLowerCase();
                }
    
                console.log("username: " + username);
     
                hasAccessToUsersFollowersList(guid, fGuid, username, AccessFollowList.Followers);
            
            } else {
                finalAppResponse( errorResonse(ErrorMessageGeneric) );
            }
        }
       
    } else {
        console.log("PathParams error");
        finalAppResponse( errorResonse(ErrorMessageGeneric) );
    }
};
