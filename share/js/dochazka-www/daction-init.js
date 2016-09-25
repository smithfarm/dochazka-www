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
// app/daction.js
//
// Round one of daction initialization - called from app/target-init.js
//
"use strict";

define ([
    'target',
    'app/daction-start'
], function (
    target,
    dactionStart
) {

    return function () {

        //
        // demo action
        //
        target.push('demoAction', {
            'name': 'demoAction',
            'type': 'daction',
            'menuText': 'Do something',
            'aclProfile': 'passerby',
            'start': dactionStart('demoAction')
        }),


        //
        // Employee actions
        //

        // My profile
        target.push('myProfile', {
            'name': 'myProfile',
            'type': 'daction',
            'menuText': 'My profile',
            'aclProfile': 'passerby',
            'start': dactionStart('myProfile')
        });

        // Employee profile Update
        target.push('empProfileUpdate', {
            'name': 'empProfileUpdate',
            'type': 'daction',
            'menuText': 'Save changes',
            'aclProfile': 'active',
            'start': dactionStart('empProfileUpdate')
        }),
        
        // New employee
        target.push('ldapLookupSubmit', {
            'name': 'ldapLookupSubmit',
            'type': 'daction',
            'menuText': 'Lookup',
            'aclProfile': 'admin',
            'start': dactionStart('ldapLookupSubmit')
        }),
        
        // Search employee
        target.push('actionEmplSearch', {
            'name': 'actionEmplSearch',
            'type': 'daction',
            'menuText': 'Search',
            'aclProfile': 'admin',
            'start': dactionStart('actionEmplSearch')
        }),
        
        // Masquerade as a different employee
        target.push('masqEmployee', {
            'name': 'masqEmployee',
            'type': 'daction',
            'menuText': 'Masquerade (begin/end)',
            'aclProfile': 'admin',
            'start': dactionStart('masqEmployee')
        }),
        
        // Run unit tests
        target.push('unitTests', {
            'name': 'unitTests',
            'menuText': 'Run unit tests',
            'aclProfile': 'passerby'
        }),
        
        // return to (saved) browser state 
        target.push('returnToBrowser', {
            'name': 'returnToBrowser',
            'type': 'daction',
            'menuText': 'Return to browser',
            'aclProfile': 'passerby',
            'start': dactionStart('returnToBrowser')
        }), 

        // logout
        target.push('logout', {
            'name': 'logout',
            'type': 'daction',
            'menuText': 'Logout',
            'aclProfile': 'passerby',
            'start': dactionStart('logout')
        })

    };

});
