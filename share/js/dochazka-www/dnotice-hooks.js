// ************************************************************************* 
// Copyright (c) 2014-2015, SUSE LLC
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
// app/dnotice-hooks.js
//
// Hooks for dnotices
//
"use strict";

define ([
    'jquery',
    'ajax',
    'current-user',
    'lib',
    'target'
], function (
    $,
    ajax,
    currentUser,
    lib,
    target
) {

    // return an object the property names of which correspond to the
    // dnotice names and the values of which are hook functions called
    // from start.js
    return {

        // demo dnotice from App::MFILE::WWW
        'demoNotice': function () {
            return 'This could be anything, e.g. a random number';
        },

        // display full privhistory of current user
        'privHistory': function () {
            var eid = currentUser().obj.eid,
                rest = {
                    "method": 'GET',
                    "path": 'privhistory/eid/' + eid
                },
                // success callback
                sc = function (st) {
                    var i, nt = '';
                    if (st.code === 'DISPATCH_RECORDS_FOUND') {
                        // when records are found, this call always returns them in an array
                        var ph = st.payload.privhistory;
                        console.log("Search found " + ph.length + " privhistory records");
                        for (i = 0; i < ph.length; i += 1) {
                            nt += ph[i].effective + '&nbsp;&nbsp;&nbsp;' + ph[i].priv + '<br>';
                        }
                        console.log("Generated notice text (" + nt.length + " chars");
                        lib.clearResult();
                    } else {
                        var nt = '<br>' + st.code;
                        console.log("Generated notice text (" + nt.length + " chars");
                        $('#result').html(st.text);
                    }
                    $('#noticeText').html(nt);
                },
                // failure callback
                fc = null;
            ajax(rest, sc, fc);
        }

    };

});
