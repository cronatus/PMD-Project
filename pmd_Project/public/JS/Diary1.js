/**
 * Created by b00265222 on 15/03/2016.
 */

/**
 * TODO:
 *      - 1 : check for username -- Completed
 *      - 2 : upload details(intake variables properly) & Download details -- Completed
 *      - 3 : sync service -- in progress(possibly completed testing impossible atm)
 *
 * Optional TODO:
 *      - 1 : Integrate search capability
 *      - 2 :
 */

/*globals $ */

var username, subject, description, date, time, datetime;       //declaration of the variables that will be linked to the objects on the page.

/**
 * a function to create a new diary entry
 * @param user - an html field to store the username related to the diary entry
 * @param subject - an html field to store the subject of the diary entry
 * @param description - an html field to store the description of the diary entry
 * @param date - an html file to store the date of the diary entry
 * @param time - an html file to store the time of the diary entry
 */

var entry = function (user, subject, description, date, time ){     //constructor for the entries that will be in the diary.

    this.user = user;
    this.subject = subject;
    this.desc = description;
    this.datetime = new Date(date + " " + time);
    this.complete = false;

}

var entries = [] ;

/**
 * loading and saving the username to the devices localstorage
 *
 * if there is no name found prompt the user to enter a username.
 */

var setuser2 = function(){                      //this is for entering a new username using change username page.

    var u = String($("#userreset").val());
    if(u != undefined)
    username = u;
    saveUser();
    $("body").pagecontainer("change","#home");
    $("#userpresent").text(username);
}

var saveUser = function(){

    var usr = JSON.stringify(username);
    if (usr !== ""){
        localStorage.diaryuser = usr
    } else {
        window.alert("you have not entered a username");
        loadUser();
    }
}

var loadUser = function(){
    var usr;
    if (localStorage.diaryuser != undefined) {
        usr = localStorage.diaryuser;
        username = JSON.parse(usr);
        $("#userpresent").text(username);
    } else if(localStorage.diaryuser == undefined) {
        $("body").pagecontainer("change","#userchange")
    }



};
/**
 *  get the users diary list ready for display
 *
 *  @studdiaryapp added quietly to avoid usernames from other webapps affecting this app.
 */

var loaddiary = function(){

    $.ajax({
        method: 'get',
        url: "http://auws-to-do.appspot.com/users/" + username + "@studdiaryapp.com",
        dataType: "jsonp",
        success:function(json){
            //var i;
            for(i=0; i>= json.length; i++){
                $("<li>").html("<a href='#placeholder' id='" + json[i].key + "' onclick='loadsubject(id)' >" + json[i].item + "</a>").appendTo("#subjectlist");
            }
            //onclick='loadsubject(id)' -- for the end of the <a> html tag to load the subject page.

        }
    })

};

/**
 *  load the data of the chosen data;
 */

var loadsubject = function(key){

    $.ajax({
        method: 'get',
        url: "http://auws-to-do.appspot.com/items/" + key,
        dataType: "jsonp",
        success:function(json){
            var string = json[i].item;
            $("#subjectheader").text(string);
            string = json[i].description;
            $("#itemdescript").text(string);
            string = getdate(json[i].due);
            $("#itemdate").text(string);
            string = gettime(json[i].due);
            $("#itemtime").text(string);

            $("<li>").html("<a href='#display' id='" + key + "' onclick='setcomplete(id)' >set complete</a>").appendTo("#completebar");

        }
    })

}

/**
 *
 * set the chosen datapiece to complete so that it can be deleted when the user clicks delete
 *
 * @param key   passed the key of the json that it is linked to in order to ensure the correct item is deleted.
 */


var setcomplete = function (key){

    $.ajax({
        method: 'delete',
        url: "http://auws-to-do.appspot.com/items/" + key,
        dataType: "jsonp"
    })

}

var deletecomplete = function (){

    $.ajax({
        method: 'delete',
        url: "http://auws-to-do.appspot.com/users/" + username,
        dataType: "jsonp"
    })

}

/**
 *  add the new diary entry to the users list
 *
 *  @studdiaryapp added quietly to avoid usernames from other webapps affecting this app.
 *
 */

var addnew = function(){
    //addentry(username, subject, description, date, time);

    var dte, tme, dtetme;

    dte = $("#adddate").val();
    tme = $("#addtime").val();
    dtetme = dte + "T" + tme + ":00.000Z";

    var a, b;
    a = $("#addsubject").val();
    b = $("#adddescript").val();

    $("#welcome").text(a + b + dtetme);

    $.ajax({
        method: 'post',
        url: "http://auws-to-do.appspot.com/users/" + username + "@studdiaryapp.com",
        data: {
            description: $("#adddescript").val(),
            completed: false,
            due: dtetme,
            item: $("#addsubject").val(),
            priority: 2
        }
    })
    loaddiary();

    $("#addsubject").val("");
    $("#adddescript").val("");
    $("#adddate").val("");
    $("#addtime").val("");

    $("body").pagecontainer("change","#home");
};

/**
 * get time and date from the date variable from the JSON
 */

var gettime = function(dtetme){

    var time = dtetme.getHours() + ":" + dtetme.getMinutes();
    return time

}

var getdate = function(dtetme){

    return dtetme.toDateString();

}


/**
 *  Standard initialisation routine
 */

$(document).ready(function(){

    subject = $("#addsubject");
    description = $("#adddescript");
    date = $("#adddate");
    time = $("#addtime");
    datetime = date + " " + time;


    loadUser();
    loaddiary();
});

