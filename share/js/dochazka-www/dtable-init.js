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
// app/dtable-init.js
//
// Round one of dtable initialization (called from app/target-init)
//
"use strict";

define ([
    'app/entries',
    'target',
], function (
    entries,
    target,
) {

    return function () {

        target.push('privHistoryDtable', {
            'name': 'privHistoryDtable',
            'type': 'dtable',
            'menuText': 'Privilege (status) history',
            'title': 'Privilege (status) history',
            'preamble': null,
            'aclProfile': 'passerby',
            'entriesRead': [entries.ePnick, entries.pHeffective, entries.pHpriv],
            'miniMenu': {
                entries: ['actionPrivHistoryEdit']
            }
        });

        target.push('schedHistoryDtable', {
            'name': 'schedHistoryDtable',
            'type': 'dtable',
            'menuText': 'Schedule history',
            'title': 'Schedule history',
            'preamble': null,
            'aclProfile': 'passerby',
            'entriesRead': [entries.pHeffective, entries.sDid, entries.sDcode],
            'miniMenu': {
                entries: ['actionSchedHistoryEdit']
            }
        });

        target.push('viewMultipleInt', {
            'name': 'viewMultipleInt',
            'type': 'dtable',
            'menuText': 'View',
            'title': 'Intervals in date range',
            'preamble': null,
            'aclProfile': 'passerby',
            'entriesRead': [entries.iNdate, entries.iNtimerange, entries.iNiid, entries.acTcode],
            'miniMenu': {
                entries: null,
            }
        });

    };

});
