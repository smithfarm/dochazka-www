// *************************************************************************
// Copyright (c) 2014-2017, SUSE LLC
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice,
// this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the distribution.
//
// 3. Neither the name of SUSE LLC nor the names of its contributors may be
// used to endorse or promote products derived from this software without
// specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
// *************************************************************************
//
// app/caches.js
//
// application-specific caches
//
"use strict";

define ([
    'jquery',
    'app/lib',
    'ajax',
    'current-user',
    'datetime',
    'lib',
    'populate',
    'stack',
], function (
    $,
    appLib,
    ajax,
    currentUser,
    datetime,
    coreLib,
    populate,
    stack,
) {

    var
        backgroundColorStashed = null,
        currentEmployeeStashed = null,
        currentEmplPrivStashed = null,

        activityCache = [],
        activityByAID = {},
        activityByCode = {},

        profileCache = [],
        profileByEID = {},
        profileByNick = {},

        scheduleCache = [],
        scheduleBySID = {},
        scheduleByScode = {},

        endTheMasquerade = function () {
            currentUser('flag1', 0); // turn off masquerade flag
            console.log('flag1 === ', currentUser('flag1'));
            currentUser('obj', currentEmployeeStashed);
            currentEmployeeStashed = null;
            $('#userbox').html(appLib.fillUserBox()); // reset userbox
            $('#mainarea').css("background-color", backgroundColorStashed);
            coreLib.displayResult('Masquerade is finished');
            $('input[name="sel"]').val('');
        },

        getActivityByAID = function (aid) {
            if (activityCache.length > 0) {
                return activityByAID[aid];
            }
            console.log('CRITICAL ERROR: activity cache not populated');
            return null;
        },

        getActivityByCode = function (code) {
            console.log("Entering getActByCode() with code " + code);
            if (activityCache.length > 0) {
                return activityByCode[code];
            }
            console.log('CRITICAL ERROR: activity cache not populated');
            return null;
        },

        getProfileByEID = function (eid) {
            console.log("Entering getProfileByEID() with eid " + eid);
            if (profileCache.length > 0) {
                return profileByEID[parseInt(eid, 10)];
            }
            console.log('Employee profile cache not populated yet');
            return null;
        },

        getProfileByNick = function (nick) {
            console.log("Entering getProfileByNick() with nick " + nick);
            if (profileCache.length > 0) {
                return profileByNick[nick];
            }
            console.log('Employee profile cache not populated yet');
            return null;
        },

        getScheduleByScode = function (scode) {
            console.log("Entering getScheduleByScode() with scode " + scode);
            if (scheduleCache.length > 0) {
                return scheduleByScode[scode];
            }
            console.log('Schedule cache not populated yet');
            return null;
        },

        getScheduleBySID = function (sid) {
            console.log("Entering getScheduleBySID() with SID " + sid);
            if (scheduleCache.length > 0) {
                return scheduleBySID[sid];
            }
            console.log('Schedule cache not populated yet');
            return null;
        },

        masqEmployee = function (obj) {
            console.log("Entering masqEmployee() with object", obj);
            // if obj is empty, dA was selected from menu
            // if obj is full, it contains the employee to masquerade as
        
            if (currentEmployeeStashed) {
                endTheMasquerade();
                return;
            }

            var cu = currentUser('obj');

            if (! coreLib.isObjEmpty(obj)) {
                if (obj.nick === cu.nick) {
                    coreLib.displayResult('Request to masquerade as self makes no sense');
                    return;
                }
                // let the masquerade begin
                currentEmployeeStashed = $.extend({}, cu);
                backgroundColorStashed = $('#mainarea').css("background-color");
                currentUser('obj', obj);
                currentUser('flag1', 1); // turn on masquerade flag
                populate([
                    populateFullEmployeeProfileCache,
                    populateScheduleBySID,
                ]);
                $('#userbox').html(appLib.fillUserBox()); // reset userbox
                $('#mainarea').css("background-color", "red");
                stack.unwindToType('dmenu'); // return to most recent dmenu
                return;
            }
        
            // let the admin pick which user to masquerade as
            stack.push('searchEmployee', {}, {
                "xtarget": "mainEmpl"
            });
        },

        populateActivityCache = function (populateArray) {
            var rest, sc, fc, fnToCall;
            console.log("Entering populateActivityCache()");
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            if (activityCache.length === 0) {
                rest = {
                    "method": 'GET',
                    "path": 'activity/all'
                };
                sc = function (st) {
                    var i;
                    console.log("AJAX: " + rest["method"] + " " + rest["path"] + " returned", st);
                    for (i = 0; i < st.payload.length; i += 1) {
                        activityCache.push(st.payload[i]);
                        activityByAID[st.payload[i].aid] = st.payload[i];
                        activityByCode[st.payload[i].code] = st.payload[i];
                    }
                    coreLib.displayResult(i + 1 + " activity objects loaded into cache");
                    fnToCall();
                };
                fc = function (st) {
                    console.log("AJAX: " + rest["method"] + " " + rest["path"] + " failed", st);
                    coreLib.displayError(st.payload.message);
                    fnToCall();
                };
                ajax(rest, sc, fc);
            } else {
                console.log("populateActivityCache(): noop, cache already populated");
                fnToCall();
            }
        },

        populateAIDfromCode = function (populateArray) {
            var aid, code, fnToCall;
            console.log("Entering populateAIDfromCode()");
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            // assume there is a form with the code in it
            code = $('#iNact').text();
            console.log("Activity code is " + code);
            aid = getActivityByCode(code).aid;
            $('#acTaid').html(String(aid));
            fnToCall(populateArray);
        },

        populateFullEmployeeProfileCache = function (populateArray) {
            var cu = currentUser('obj'),
                eid = cu.eid,
                profileObj,
                fnToCall,
                rest, sc, fc, m;
            console.log("Entering populateFullEmployeeProfileCache(); EID is", cu.eid);
            console.log("populateArray.length is " + populateArray.length);
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            profileObj = getProfileByEID(parseInt(cu.eid, 10));
            if (profileObj) {
                fnToCall(populateArray);
            } else {
                rest = {
                    "method": 'GET',
                };
                if (currentUser('flag1') === 1) {
                    // masquerade active; we are admin
                    rest["path"] = 'employee/eid/' + eid + '/full';
                } else {
                    rest["path"] = 'employee/self/full';
                }
                sc = function (st) {
                    console.log("AJAX GET " + rest.path + " succeeded", st);
                    if (st.code === 'DISPATCH_EMPLOYEE_PROFILE_FULL') {
                        profileObj = $.extend({}, st.payload);
                        profileCache.push(profileObj);
                        profileByEID[parseInt(st.payload.emp.eid, 10)] = $.extend({}, profileObj);
                        profileByNick[String(st.payload.emp.nick)] = $.extend({}, profileObj);
                        coreLib.displayResult("Profile of employee " + st.payload.emp.nick + " loaded into cache");
                    } else {
                        m = "Unexpected status code " + st.code;
                        console.log("CRITICAL ERROR: " + m);
                        coreLib.displayError(m);
                    }
                    fnToCall(populateArray);
                };
                fc = function (st) {
                    console.log("AJAX: " + rest["path"] + " failed", st);
                    coreLib.displayError(st.payload.message);
                    fnToCall(populateArray);
                };
                ajax(rest, sc, fc);
            }
        },

        populateLastExisting = function (populateArray) {
            var cu = currentUser('obj'),
                eid = cu.eid,
                date, tsr,
                rest, sc, fc, fnToCall;
            date = $("#iNdate").text();
            console.log("Entering populateLastExisting() with date " + date);
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            tsr = "[ \"" + date + " 00:00\", \"" + date + " 24:00\" )";
            rest = {
                "method": "GET",
                "path": "interval/eid/" + eid + "/" + tsr,
            };
            sc = function (st) {
                console.log("AJAX: POST " + rest["path"] + " succeeded", st);
                if (st.code === "DISPATCH_RECORDS_FOUND") {
                    // payload is an array of interval objects
                    appLib.displayIntervals(
                        st.payload,
                        $('#iNlastexistintvl')
                    );
                }
                coreLib.clearResult();
                fnToCall(populateArray);
            };
            fc = function (st) {
                console.log("AJAX: POST " + rest["path"] + " failed", st);
                if (st.code === "DISPATCH_NOTHING_IN_TSRANGE") {
                    // form field is pre-populated with "(none)"
                    coreLib.clearResult();
                } else {
                    coreLib.displayError(st.payload.message);
                }
                fnToCall(populateArray);
            };
            ajax(rest, sc, fc);
        },

        populateSchedIntvlsForDate = function (populateArray) {
            var cu = currentUser('obj'),
                eid = cu.eid,
                sid, date, tsr, rest, sc, fc, fnToCall;
            date = $("#iNdate").text();
            console.log("Entering populateSchedIntvlsForDate() with date " + date);
            console.log(populateArray);
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            sid = parseInt($("#iNsid").text(), 10);
            if (coreLib.isInteger(sid) && sid > 0) {
                console.log("SID: " + sid);
            } else {
                console.log("The user has no schedule for this date");
                $("#iNschedintvls").html("(none)");
                fnToCall(populateArray);
                return null;
            }
            tsr = "[ \"" + date + " 00:00\", \"" + date + " 24:00\" )";
            rest = {
                "method": "POST",
                "path": "interval/fillup",
                "body": {
                    'clobber': '1',
                    'tsrange': tsr,
                    'dry_run': '1',
                    'eid': String(eid),
                },
            };
            sc = function (st) {
                console.log("AJAX: POST " + rest["path"] + " succeeded", st);
                if (st.code === "DISPATCH_FILLUP_INTERVALS_CREATED") {
                    appLib.displayIntervals(
                        st.payload.success.intervals,
                        $('#iNschedintvls')
                    );
                }
                coreLib.clearResult();
                fnToCall(populateArray);
            };
            fc = function (st) {
                console.log("AJAX: POST " + rest["path"] + " failed", st);
                coreLib.displayError(st.payload.message);
                fnToCall(populateArray);
            };
            ajax(rest, sc, fc);
        },

        populateScheduleBySID = function (populateArray) {
            var cu = currentUser('obj'),
                fullProfile = getProfileByEID(parseInt(cu.eid, 10)),
                sid = fullProfile.schedule,
                fnToCall, rest, sc, fc, schedObj, m;
            console.log("populateArray.length is " + populateArray.length);
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            if (! sid) {
                fnToCall(populateArray);
                return null;
            }
            schedObj = getScheduleBySID(sid);
            if (schedObj) {
                fnToCall(populateArray);
                return null;
            }
            rest = {
                "method": "GET",
                "path": 'schedule/sid/' + sid,
            };
            sc = function (st) {
                console.log("AJAX GET " + rest.path + " succeeded", st);
                scheduleCache.push(st.payload);
                scheduleBySID[st.payload.sid] = $.extend({}, st.payload);
                if (st.payload.scode && st.payload.scode.length > 0) {
                    scheduleByScode[st.payload.scode] = $.extend({}, st.payload);
                }
                m = "Schedule ID " + sid + " loaded into cache";
                console.log(m);
                coreLib.displayResult(m);
                fnToCall(populateArray);
            };
            fc = function (st) {
                console.log("AJAX: " + rest["path"] + " failed", st);
                coreLib.displayError(st.payload.message);
                fnToCall(populateArray);
            };
            ajax(rest, sc, fc);
            coreLib.clearResult();
        },

        populateSIDByDate = function (populateArray) {
            var cu = currentUser('obj'),
                date = $('#iNdate').text(),
                eid = parseInt(cu.eid, 10),
                schedObj,
                sid,
                fnToCall,
                rest, sc, fc;
            console.log("Entering populateSIDByDate(); EID is " + eid + " and date " + date);
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            // the date can be anything - there's no point in caching anything
            rest = {
                "method": 'GET',
                "path": 'schedule/eid/' + eid + '/',
            };
            sc = function (st) {
                console.log("GET " + rest.path + " returned", st);
                sid = st.payload.schedule.sid;
                $('#iNsid').html(sid);
                schedObj = getScheduleBySID(sid);
                if (! schedObj) {
                    scheduleBySID[st.payload.sid] = $.extend({}, st.payload);
                    if (st.payload.scode && st.payload.scode.length > 0) {
                        scheduleByScode[st.payload.scode] = $.extend({}, st.payload);
                    }
                }
                fnToCall(populateArray);
            };
            fc = function (st) {
                console.log("GET " + rest.path + " returned", st);
                coreLib.displayError(st.payload.message);
                fnToCall(populateArray);
            };
            rest.path += '"' + date + ' 12:00"';
            ajax(rest, sc, fc);
        },

        populateSupervisorNick = function (populateArray) {
            var cu = currentUser('obj'),
                eid = cu.supervisor,
                nick,
                fnToCall,
                rest, sc, fc;
            console.log("Entering populateSupervisorNick(), supervisor EID is", eid);
            if (populateArray.length === 0) {
                fnToCall = function (populateArray) {};
            } else {
                fnToCall = populateArray.shift();
            }
            // we assume the supervisor EID is in the current user object
            // which was populated when we logged in or started masquerade
            rest = {
                "method": 'GET',
                "path": 'employee/eid/' + eid + "/minimal"
            };
            sc = function (st) {
                nick = st.payload.nick,
                $('#ePsuperNick').html(nick);
                coreLib.clearResult();
                fnToCall(populateArray);
            },
            fc = function (st) {
                console.log("AJAX: GET " + rest["path"] + " failed with", st);
                coreLib.displayError(st.payload.message);
                $('#ePsuperNick').html('(ERR)');
                fnToCall(populateArray);
            };
            if (eid) {
                ajax(rest, sc, fc);
            };
        },

        selectActivityAction = function (obj) {
            if (activityCache.length > 0) {
                stack.push('selectActivity', {
                    'pos': 0,
                    'set': activityCache,
                });
            } else {
                coreLib.displayError("CRITICAL ERROR: activity cache is empty");
            }
        };

    return {
        activityCache: activityCache,
        getActivityByAID: getActivityByAID,
        getActivityByCode: getActivityByCode,
        getProfileByEID: getProfileByEID,
        getProfileByNick: getProfileByNick,
        getScheduleByScode: getScheduleByScode,
        getScheduleBySID: getScheduleBySID,
        masqEmployee: masqEmployee,
        populateActivityCache: populateActivityCache,
        populateAIDfromCode: populateAIDfromCode,
        populateFullEmployeeProfileCache: populateFullEmployeeProfileCache,
        populateLastExisting: populateLastExisting,
        populateSchedIntvlsForDate: populateSchedIntvlsForDate,
        populateScheduleBySID: populateScheduleBySID,
        populateSIDByDate: populateSIDByDate,
        populateSupervisorNick: populateSupervisorNick,
        profileCacheLength: function () {
            return profileCache.length
        },
        scheduleCacheLength: function () {
            return scheduleCache.length
        },
        selectActivityAction: selectActivityAction,
    };

});
