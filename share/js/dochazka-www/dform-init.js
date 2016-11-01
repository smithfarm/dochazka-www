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
// app/dform-init.js
//
// Round one of dform initialization (called from app/target-init)
//
"use strict";

define ([
    'current-user',
    'app/lib',
    'app/emp-lib',
    'app/prototypes',
    'target'
], function (
    currentUser,
    lib,
    empLib,
    prototypes,
    target
) {

    var entries = lib.entries;
    
    return function () {

        target.push('empProfile', {
            'name': 'empProfile',
            'type': 'dform',
            'menuText': 'My profile',
            'title': 'My profile',
            'preamble': null,
            'aclProfile': 'passerby',
            'entriesRead': [entries.ePfullname, entries.ePnick,
                entries.ePsec_id, entries.ePemail, entries.ePremark,
                entries.ePpriv, entries.ePeffective],
            'entriesWrite': [],
            'hook': empLib.getEmployeeProfile,
            'miniMenu': {
                entries: ['empProfileEditRemark', 'ldapSyncSelf'],
                back: ['Back', 'mainEmpl']
            }
        }); // target.push('empProfile'

        target.push('empProfileEditRemark', {
            'name': 'empProfileEditRemark',
            'type': 'dform',
            'menuText': 'Edit remark',
            'title': 'Edit remark',
            'preamble': null,
            'aclProfile': 'admin',
            'entriesRead': [entries.ePnick, entries.ePfullname],
            'entriesWrite': [entries.ePremark],
            'hook': empLib.getEmployeeProfile,
            'miniMenu': {
                entries: ['empProfileUpdate'],
                back: ['Back', 'empProfile']
            }
        }); // target.push('empProfileEditRemark'

        target.push('ldapLookup', {
            'name': 'ldapLookup',
            'type': 'dform',
            'menuText': 'Look up an LDAP employee',
            'title': 'Look up an LDAP employee',
            'preamble': 'Enter employee nick for exact (case insensitive) match.',
            'aclProfile': 'active',
            'entriesRead': null,
            'entriesWrite': [entries.ePnick],
            'hook': function () { return Object.create(prototypes.empProfile); },
            'miniMenu': {
                entries: ['ldapLookupSubmit'],
                back: ['Back', 'mainEmpl']
            }
        }); // target.push('ldapLookup'

        target.push('ldapDisplayEmployee', {
            'name': 'ldapDisplayEmployee',
            'type': 'dform',
            'title': 'LDAP employee record',
            'preamble': null,
            'aclProfile': 'active',
            'entriesRead': [entries.ePfullname, entries.ePnick,
                entries.ePsec_id, entries.ePemail, entries.LDAPdochazka],
            'entriesWrite': [],
            'hook': empLib.getLdapEmployeeObject,
            'miniMenu': {
                entries: ['ldapSync'],
                back: ['Back', 'mainEmpl']
            }
        }); // target.push('ldapDisplayEmployee'

        target.push('searchEmployee', {
            'name': 'searchEmployee',
            'type': 'dform',
            'menuText': 'Search Dochazka employees',
            'title': 'Search Dochazka employees',
            'preamble': 'Enter search key, % is wildcard',
            'aclProfile': 'admin',
            'entriesRead': null,
            'entriesWrite': [entries.sEnick],
            'hook': function () { return { searchKeyNick: null }; },
            'miniMenu': {
                entries: ['actionEmplSearch'],
                back: ['Back', 'mainEmpl']
            }
        }); // target.push('searchEmployee'

        target.push('searchEmpNothingFound', {
            'name': 'searchEmpNothingFound',
            'type': 'dform',
            'menuText': 'Employee profile',
            'title': 'Search employee - results',
            'preamble': 'Your search found 0 employees',
            'aclProfile': 'admin',
            'hook': function () { },
            'miniMenu': {
                entries: [],
                back: ['To leave this page, press ENTER or click the Submit button', 'mainEmpl']
            }
        }); // target.push('searchEmpNothingFound'

    }; // return function ()
    
});
