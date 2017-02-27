// ************************************************************************* 
// Copyright (c) 2014-2016, SUSE LLC
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
// app/sched-lib.js
//
"use strict";

define ([
    'jquery',
    'ajax',
    'current-user',
    'lib',
    'app/lib',
    'app/prototypes',
    'start',
    'target'
], function (
    $,
    ajax,
    currentUser,
    lib,
    appLib,
    prototypes,
    start,
    target
) {

    var 
        scheduleObject = Object.create(prototypes.schedObject),
        scheduleForDisplay = Object.create(prototypes.schedObject),

        getScheduleForDisplay = function () { return scheduleForDisplay; },

        browseAllSchedules = function () {
            console.log("Entering target 'browseAllSchedules'");
            var rest = {
                    "method": 'GET',
                    "path": 'schedule/all'
                },
                // success callback
                sc = function (st) {
                    if (st.code === 'DISPATCH_RECORDS_FOUND') {

                        // if only one record is returned, it might be in a result_set
                        // or it might be alone in the payload
                        var rs = st.payload.result_set || st.payload,
                            count = rs.length,
                            mungedRS = [];

                        console.log("Found " + count + " schedules");
                        for (var i = 0; i < count; i++) {
                            mungedRS.push(mungeObjectForDisplay(rs[i]));
                        }
                        lib.holdObject(mungedRS);
                        target.pull('simpleScheduleBrowser').start();

                    }
                },
                // failure callback
                fc = function (st) {
                    console.log("AJAX: schedule/all failed with", st);
                    lib.displayError(st.payload.message);
                };
            ajax(rest, sc, fc);
        },

        mungeObjectForDisplay = function (obj) {
            var schedule = JSON.parse(obj.schedule),
                slen = schedule.length,
                daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                mungedObj = Object.create(prototypes.schedObject);
            console.log("mungeObjectForDisplay: schedule has " + slen + " intervals");
            mungedObj['sid'] = obj.sid;
            mungedObj['scode'] = obj.scode;
            mungedObj['remark'] = obj.remark;
            mungedObj['disabled'] = obj.disabled;
            mungedObj['mon'] = null;
            mungedObj['tue'] = null;
            mungedObj['wed'] = null;
            mungedObj['thu'] = null;
            mungedObj['fri'] = null;
            mungedObj['sat'] = null;
            mungedObj['sun'] = null;
            for (var i = 0; i < slen; i++) {  // loop over schedule intervals
                var dow = schedule[i]['low_dow'].toLowerCase();
                // console.log("Schedule interval #" + i + " starts on " + dow);
                if (mungedObj[dow] === null) {
                    mungedObj[dow] = '';
                } else {
                    mungedObj[dow] += '; ';
                }
                mungedObj[dow] += schedule[i]['low_time'] + '-' + schedule[i]['high_time'];
            }
            // console.log("mungemungedObjectForDisplay: mungedObj", mungedObj);
            return mungedObj;
        },

        actionSchedLookup = function (obj) {
            console.log("Entering target 'actionSchedLookup' with argument", obj);
            var rest = {
                    "method": 'GET',
                },
                // success callback
                sc = function (st) {
                    if (st.code === 'DISPATCH_SCHEDULE_FOUND') {
                        console.log("Payload is", st.payload);
                        scheduleObject = $.extend(
                            Object.create(prototypes.schedObject), {
                                'sid': st.payload.sid,
                                'scode': st.payload.scode,
                                'schedule': st.payload.schedule,
                                'disabled': st.payload.disabled,
                                'remark': st.payload.remark
                            }
                        );
                        scheduleForDisplay = mungeObjectForDisplay(scheduleObject);
                        target.pull('schedDisplay').start();
                    }
                },
                // failure callback
                fc = function (st) {
                    console.log("AJAX: " + rest["path"] + " failed with", st);
                    lib.displayError(st.payload.message);
                };
            if (obj.searchKeySchedID) {
                rest["path"] = 'schedule/sid/' + encodeURIComponent(obj.searchKeySchedID);
            } else if (obj.searchKeySchedCode) {
                rest["path"] = 'schedule/scode/' + encodeURIComponent(obj.searchKeySchedCode);
            } else {
                lib.displayError("Please enter a schedule code or ID to search for");
            }
            ajax(rest, sc, fc);
        };

    // here is where we define methods implementing the various
    // schedule-related actions (see daction-start.js)
    return {
        getScheduleForDisplay: getScheduleForDisplay,
        browseAllSchedules: browseAllSchedules,
        actionSchedLookup: actionSchedLookup
    };

});

