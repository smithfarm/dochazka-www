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
// app/daction-start.js
//
// daction 'start' method definitions
//
// shorter daction functions can be included directly (see, e.g.,
// 'demoAction' below); longer ones should be placed in their own
// module and brought in as a dependency (see, e.g. 'logout' below)
//
"use strict";

define ([
    "jquery",
    "current-user",
    "app/emp-lib",
    "app/priv-lib",
    "app/sched-history-lib",
    "app/sched-lib",
    "app/rest-lib",
    "html",
    "loggout",
    "target",
    "start"
], function (
    $,
    currentUser,
    empLib,
    privLib,
    schedHistLib,
    schedLib,
    restLib,
    html,
    loggout,
    target,
    start
) {

    // note that action methods called from forms will be called with the form
    // object as the first and only argument

    var act = {

        // general actions
        "drowselectListen": function () {
            start.drowselectListen();
        },
        "returnToBrowser": function () {
            start.dbrowserListen();
        },

        // actions triggered from Employee menu
        "myProfileAction": empLib.myProfileAction,
        "empProfileEditSave": empLib.empProfileEditSave,
        "ldapLookupSubmit": empLib.ldapLookupSubmit,
        "ldapSync": empLib.ldapSync,
        "ldapSyncFromBrowser": empLib.ldapSyncFromBrowser,
        "actionEmplSearch": empLib.actionEmplSearch,
        "masqEmployee": empLib.masqEmployee,

        // actions triggered from Priv (status) menu
        "actionPrivHistory": privLib.actionPrivHistory,
        "actionPrivHistoryEdit": privLib.actionPrivHistoryEdit,
        "privHistorySaveAction": privLib.privHistorySaveAction,
        "privHistoryDeleteAction": privLib.privHistoryDeleteAction,
        "privHistoryAddRecordAction": privLib.privHistoryAddRecordAction,

        // actions triggered from Schedule menu
        "actionSchedHistory": schedHistLib.actionSchedHistory,
        "actionSchedHistoryEdit": schedHistLib.actionSchedHistoryEdit,
        "schedHistorySaveAction": schedHistLib.schedHistorySaveAction,
        "schedHistoryDeleteAction": schedHistLib.schedHistoryDeleteAction,
        "schedHistoryAddRecordAction": schedHistLib.schedHistoryAddRecordAction,
        "browseAllSchedules": schedLib.browseAllSchedules,
        "actionSchedLookup": schedLib.actionSchedLookup,
        "createSchedule": schedLib.createSchedule,
        "schedEditSave": schedLib.schedEditSave,
        "schedReallyDelete": schedLib.schedReallyDelete,

        // actions triggered from Adminitrivia menu
        "restServerDetailsAction": restLib.restServerDetailsAction,

        // return to (saved) browser state
        "returnToBrowser": function () {
            console.log("Now in returnToBrowser daction");
            start.dbrowser();
        },

        // logout action
        "logout": function () {
            console.log("Reached logout action");
            if (currentUser('flag1')) {
                empLib.endTheMasquerade();
            }
            loggout();
        } // logout

    }; // var act
   
    return function (a) {
        if (act.hasOwnProperty(a)) {
            return act[a];
        }
        return undefined;
    };

});
