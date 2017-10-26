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
// app/int-lib.js
//
"use strict";

define ([
    'jquery',
    'ajax',
    'app/caches',
    'current-user',
    'datetime',
    'lib',
    'stack',
], function (
    $,
    ajax,
    appCaches,
    currentUser,
    datetime,
    coreLib,
    stack,
) {

    var
        emptyObj = {
            "iNdate": "",
            "iNtimerange": "",
            "iNact": "",
            "iNdesc": ""
        },

        genIntvl = function (date, timerange) {
            var ctr = datetime.canonicalizeTimeRange(timerange),
                m;
            if (ctr === null) {
                m = 'Time range ->' + timerange + '<- is invalid';
                console.log(m);
                stack.restart(undefined, {
                    "resultLine": m
                });
            } else {
                return '[ "' +
                       date +
                       ' ' +
                       ctr[0] +
                       '", "' +
                       date +
                       ' ' +
                       ctr[1] +
                       '" )';
            }
        },

        intervalNewREST = {
            "method": 'POST',
            "path": 'interval/new'
        };

    // here is where we define methods implementing the various
    // interval-related actions (see daction-start.js)
    return {

        createSingleIntSave: function (obj) {
            var caller = stack.getTarget().name,
                cu = currentUser('obj'),
                m,
                sc = function (st) {
                    stack.unwindToTarget(
                        'createSingleInt',
                        emptyObj,
                        {
                            "resultLine": "Interval " + st.payload.iid + " created",
                            "inputId": "iNdate",
                        }
                    );
                },
                fc = function (st) {
                    // stack.restart(undefined, {
                    //     "resultLine": st.payload.message,
                    // });
                    coreLib.displayError(st.payload.message);
                };
            if (caller === 'createSingleInt') {
                // obj is scraped by start.js from the form inputs and will look
                // like this:
                // {
                //     iNdate: "foo bar in a box",
                //     iNtimerange: "25:00-27:00",
                //     iNact: "LOITERING",
                //     iNdesc: "none",
                //     mm: true
                // }
                // any of the above properties may be present or missing
                // also, there may or may not be an acTaid property with the AID of
                // the chosen activity
            } else if (caller === 'createLastPlusOffset' || caller === 'createNextScheduled') {
                // Scrape time range from form
                // (The "createLastPlusOffset" dform has no inputs (writable
                // entries); instead, it has spans (read-only entries) that are
                // populated asynchronously and obj does not contain any of
                // the new values. In this case, the time range is residing
                // in one of the spans.)
                // Scrape time range from form
                obj.iNdate = $('input[id="iNdate"]').val();
                obj.iNtimerange = $('input[id="iNtimerange"]').val();
                obj.iNact = $('input[id="iNact"]').val();
                obj.iNdesc = $('input[id="iNdesc"]').val();
            } else {
                console.log("CRITICAL ERROR: unexpected caller", caller);
                return null;
            }
            console.log("Entering createSingleIntSave() with obj", obj);

            // check that all mandatory properties are present
            if (! obj.iNdate) {
                stack.restart(undefined, {
                    "resultLine": "Interval date missing"
                });
                return null;
            }
            if (! obj.iNact) {
                stack.restart(undefined, {
                    "resultLine": "Interval activity code missing"
                });
                return null;
            }
            if (! obj.acTaid) {
                console.log("Looking up activity " + obj.iNact + " in cache");
                m = appCaches.getActivityByCode(obj.iNact);
                if (! m) {
                    stack.restart(undefined, {
                        "resultLine": 'Activity ' + obj.iNact + ' not found'
                    });
                    return null;
                }
                obj.acTaid = m.aid;
            }
            if (! obj.iNtimerange) {
                stack.restart(undefined, {
                    "resultLine": "Interval time range missing"
                });
                return null;
            }

            intervalNewREST.body = {
                "eid": cu.eid,
                "aid": obj.acTaid,
                "long_desc": obj.iNdesc,
                "remark": null,
            }
            if (obj.iNtimerange === '+') {
                stack.push('createNextScheduled', obj);
                return null;
            } else if (obj.iNtimerange.match(/\+/)) {
                obj.iNoffset = obj.iNtimerange;
                stack.push('createLastPlusOffset', obj);
                return null;
            } else if (obj.iNtimerange) {
                intervalNewREST.body["intvl"] = genIntvl(obj.iNdate, obj.iNtimerange);
                if (! intervalNewREST.body["intvl"]) {
                    return null;
                }
            } else {
                console.log("CRITICAL ERROR in createSingleIntSave: nothing to save!"); 
                return null;
            }
            ajax(intervalNewREST, sc, fc);
        },

    };

});
