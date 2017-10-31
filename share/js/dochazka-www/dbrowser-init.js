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
// app/dbrowser-init.js
//
// Round one of dbrowser initialization (called from app/target-init)
//
"use strict";

define ([
    'lib',
    'app/entries',
    'target'
], function (
    coreLib,
    entries,
    target
) {

    return function () {

        target.push('simpleEmployeeBrowser', {
            'name': 'simpleEmployeeBrowser',
            'type': 'dbrowser',
            'menuText': 'simpleEmployeeBrowser',
            'title': 'Employee search results',
            'preamble': null,
            'aclProfile': 'admin',
            'entriesRead': [entries.ePnick, entries.ePsec_id, entries.ePfullname,
                        entries.ePemail, entries.ePremark],
            'miniMenu': {
                entries: ['ldapSync', 'empProfileEdit', 'empSetSupervisor']
            }
        });

        target.push('masqueradeCandidatesBrowser', {
            'name': 'masqueradeCandidatesBrowser',
            'type': 'dbrowser',
            'menuText': 'masqueradeCandidatesBrowser',
            'title': 'Masquerade candidates',
            'preamble': null,
            'aclProfile': 'admin',
            'entriesRead': [entries.ePnick, entries.ePsec_id, entries.ePfullname,
                        entries.ePemail, entries.ePremark],
            'miniMenu': {
                entries: ['masqEmployee']
            }
        });

        target.push('simpleScheduleBrowser', {
            'name': 'simpleScheduleBrowser',
            'type': 'dbrowser',
            'menuText': 'Browse schedules',
            'title': 'All schedules',
            'preamble': null,
            'aclProfile': 'admin',
            'entriesRead': [entries.sDid, entries.sDcode,
                        coreLib.emptyLineEntry, entries.sDmon,
                        entries.sDtue, entries.sDwed, entries.sDthu,
                        entries.sDfri, entries.sDsat, entries.sDsun,
                        coreLib.emptyLineEntry, entries.ePremark],
            'miniMenu': {
                entries: ['schedEditFromBrowser', 'schedDeleteFromBrowser']
            }
        });

    };
    
});
