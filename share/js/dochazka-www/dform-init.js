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
// app/dform-init.js
//
// Round one of dform initialization (called from app/target-init)
//
"use strict";

define ([
    'current-user',
    'app/emp-lib',
    'app/prototypes',
    'target'
], function (
    currentUser,
    empLib,
    prototypes,
    target
) {

    //
    // first, we define all entries
    //
    var entries = {        

        // Employee profile - nick
        'ePnick': {
            name: 'ePnick',
            aclProfileRead: 'passerby',
            aclProfileWrite: null,
            text: 'Nick',
            prop: 'nick',
            maxlen: 20
        },
        // Employee profile - sec_id
        'ePsec_id': {
            name: 'ePsec_id',
            aclProfileRead: 'passerby',
            aclProfileWrite: null,
            text: 'Workforce ID',
            prop: 'sec_id',
            maxlen: 8
        },
        // Employee profile - full name
        'ePfullname': {
            name: 'ePfullname',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Full name',
            prop: 'fullname',
            maxlen: 55
        },
        // Employee profile - email
        'ePemail': {
            name: 'ePemail',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Email',
            prop: 'email',
            maxlen: 55
        },
        // Employee profile - remark
        'ePremark': {
            name: 'ePremark',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Remark',
            prop: 'remark',
            maxlen: 55
        },
        // Employee profile - status
        'ePstatus': {
            name: 'ePstatus',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Status',
            prop: 'priv',
            maxlen: 10
        },
        // Employee profile - statusSince
        'ePstatusSince': {
            name: 'ePstatusSince',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Since',
            prop: 'effective',
            maxlen: 30
        },

        // new employee - nick
        'nEnick': {
            name: 'nEnick',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Nick (*)',
            prop: 'nick',
            maxlen: 20
        },
        // new employee - full name
        'nEfullname': {
            name: 'nEfullname',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Full name',
            prop: 'fullname',
            maxlen: 55
        },
        // new employee - email
        'nEemail': {
            name: 'nEemail',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Email',
            prop: 'email',
            maxlen: 55
        },
        // new employee - remark
        'nEremark': {
            name: 'nEremark',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Remark',
            prop: 'remark',
            maxlen: 55
        },
    
       // search employee - nick
        'sEnick': {
            name: 'sEnick',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Nick',
            prop: 'searchKeyNick',
            maxlen: 20
        }
    };
    
    //
    // second, we define the dforms themselves
    //
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
                entries.ePstatus, entries.ePstatusSince],
            'entriesWrite': [],
            'hook': empLib.getEmployeeObject,
            'miniMenu': {
                entries: ['empProfileEditRemark'],
                back: ['Back', 'mainEmpl']
            }
        });

        target.push('empProfileEditRemark', {
            'name': 'empProfileEditRemark',
            'type': 'dform',
            'menuText': 'Edit remark',
            'title': 'Edit remark',
            'preamble': null,
            'aclProfile': 'admin',
            'entriesRead': [entries.ePnick, entries.ePfullname],
            'entriesWrite': [entries.ePremark],
            'hook': empLib.getEmployeeObject,
            'miniMenu': {
                entries: ['empProfileUpdate'],
                back: ['Back', 'empProfile']
            }
        });

        target.push('ldapLookup', {
            'name': 'ldapLookup',
            'type': 'dform',
            'menuText': 'LDAP lookup',
            'title': 'LDAP lookup',
            'preamble': 'Enter employee nick for exact (case insensitive) match.',
            'aclProfile': 'active',
            'entriesRead': null,
            'entriesWrite': [entries.nEnick],
            'hook': function () { return Object.create(prototypes.empProfile); },
            'miniMenu': {
                entries: ['ldapLookupSubmit'],
                back: ['Back', 'mainEmpl']
            }
        });

        target.push('ldapLookupDisplay', {
            'name': 'ldapLookupDisplay',
            'type': 'dform',
            'title': 'Employee profile',
            'preamble': 'LDAP lookup success',
            'aclProfile': 'active',
            'entriesRead': [entries.ePfullname, entries.ePnick,
                entries.ePsec_id, entries.ePemail, entries.ePremark,
                entries.ePstatus, entries.ePstatusSince],
            'entriesWrite': [],
            'hook': empLib.getEmployeeObject,
            'miniMenu': {
                entries: ['masqEmployee'],
                back: ['Back', 'mainEmpl']
            }
        });

        target.push('searchEmployee', {
            'name': 'searchEmployee',
            'type': 'dform',
            'menuText': 'Search employee',
            'title': 'Search employee',
            'preamble': 'Enter search key, % is wildcard',
            'aclProfile': 'admin',
            'entriesRead': null,
            'entriesWrite': [entries.sEnick],
            'hook': function () { return { searchKeyNick: null }; },
            'miniMenu': {
                entries: ['actionEmplSearch'],
                back: ['Back', 'mainEmpl']
            }
        });

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
        });

    };
    
});
