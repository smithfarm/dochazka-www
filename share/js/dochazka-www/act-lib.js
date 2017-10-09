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
// app/lib.js
//
// application-specific routines
//
"use strict";

define ([
    'jquery',
    'ajax',
    'current-user',
    'stack',
], function (
    $,
    ajax,
    currentUser,
    stack,
) {

    var cache = [],
        byAID = {},
        byCode = {},
        rest = {
            "method": 'GET',
            "path": 'activity/all'
        },
        // success callback
        sc = function (st) {
            console.log("AJAX: " + rest["method"] + " " + rest["path"] + " returned", st);
            stack.push('selectActivity', {
                'pos': 0,
                'set': st.payload,
            });
        },
        fc = function (st) {
            console.log("AJAX: " + rest["method"] + " " + rest["path"] + " failed", st);
            coreLib.displayError(st.payload.message);
        };

    return {

        populateActivitiesCaches: function () {
            // run upon successful login
            if (cache.length === 0) {
                ajax(rest, sc, fc);
            } else {
                console.log("populateActivitiesCaches(): noop, caches already populated");
            }
       },

       selectActivityAction: function (obj) {
           // start selectActivity drowselect target
           ajax(rest, sc, fc);
       },

       selectActivityGo: function (obj) {
           // called from selectActivity drowselect
       },

    };

});
