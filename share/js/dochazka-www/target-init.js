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
// app/target-init.js
//
// Initialization of targets (round one)
//
"use strict";

define ([
    'app/act-lib',
    'app/caches',
    'app/emp-lib',
    'app/daction-init',
    'app/dcallback-init',
    'app/dform-init',
    'app/dmenu-init',
    'app/dbrowser-init',
    'app/dnotice-init',
    'app/dtable-init',
    'app/drowselect-init',
    'init2',
    'populate',
    'stack',
], function (
    actLib,
    appCaches,
    empLib,
    dactionInitRoundOne,
    dcallbackInitRoundOne,
    dformInitRoundOne,
    dmenuInitRoundOne,
    dbrowserInitRoundOne,
    dnoticeInitRoundOne,
    dtableInitRoundOne,
    drowselectInitRoundOne,
    initRoundTwo,
    populate,
    stack,
) {

    var populateTargetsAndStart = function (populateArray) {
            var populateContinue;
            console.log("Entering populateTargetsAndStart()");
            populateContinue = populate.shift(populateArray);
            console.log("populateContinue", populateContinue);

            // populate target objects
            initRoundTwo('dform');
            initRoundTwo('dmenu');
            initRoundTwo('dcallback');
            initRoundTwo('dbrowser');
            initRoundTwo('dnotice');
            initRoundTwo('dtable');
            initRoundTwo('drowselect');

            stack.push('mainMenu');
            populateContinue(populateArray);
        };

    return function () {

        // round one - set up the targets
        console.log("dochazka-www/target-init.js: round one");
        dactionInitRoundOne();
        dcallbackInitRoundOne();
        dformInitRoundOne();
        dmenuInitRoundOne();
        dbrowserInitRoundOne();
        dnoticeInitRoundOne();
        dtableInitRoundOne();
        drowselectInitRoundOne();

        // use "populate" pattern to populate caches
        // (activities, full employee profile)
        populate.bootstrap([
            appCaches.populateFullEmployeeProfileCache,
            appCaches.populateScheduleBySID,
            appCaches.populateActivityCache,
            populateTargetsAndStart,
        ]);

    };

});
