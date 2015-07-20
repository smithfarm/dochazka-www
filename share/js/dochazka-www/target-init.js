// ************************************************************************* 
// Copyright (c) 2014, SUSE LLC
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
// app/target-init
//
// Initialization of targets (round one)
//
"use strict";

define ([
    'target',
    'app/daction-init',
    'app/dform-init',
    'app/dmenu-init',
    'app/dbrowser-init',
    'app/dnotice-init',
    'init2'
], function (
    target,
    dactionInitRoundOne,
    dformInitRoundOne,
    dmenuInitRoundOne,
    dbrowserInitRoundOne,
    dnoticeInitRoundOne,
    initRoundTwo
) {

    return function () {

        console.log("Entering app/target-init");

        // round one - set up the targets
        dactionInitRoundOne();
        dformInitRoundOne();
        dmenuInitRoundOne();
        dbrowserInitRoundOne();
        dnoticeInitRoundOne();

        // round two - add 'source' and 'start' properties
        // (widget targets only)
        initRoundTwo('dform');
        initRoundTwo('dmenu');
        initRoundTwo('dbrowser');
        initRoundTwo('dnotice');

        // return name of target to be called first (in main.js)
        return 'mainMenu';
    };

});

