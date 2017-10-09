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
// app/entries.js
//
// definitions of individual fields ("entries") used by dform, dbrowser, etc.
//
"use strict";

define ([
    'datetime',
], function (
    datetime,
) {

    return {

        ePnick: {
            name: 'ePnick',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Nick',
            prop: 'nick',
            maxlen: 20,
        },
        ePsec_id: {
            name: 'ePsec_id',
            aclProfileRead: 'passerby',
            aclProfileWrite: null,
            text: 'Workforce ID',
            prop: 'sec_id',
            maxlen: 8,
        },
        ePfullname: {
            name: 'ePfullname',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Full name',
            prop: 'fullname',
            maxlen: 55,
        },
        ePemail: {
            name: 'ePemail',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Email',
            prop: 'email',
            maxlen: 55,
        },
        ePremark: {
            name: 'ePremark',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Remark',
            prop: 'remark',
            maxlen: 55,
        },
        ePpriv: {
            name: 'ePpriv',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Status',
            prop: 'priv',
            maxlen: 10,
        },
        ePeffective: {
            name: 'ePeffective',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Effective',
            prop: 'effective',
            maxlen: 30,
        },
        ePprivEffective: {
            name: 'ePprivEffective',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Status since',
            prop: 'privEffective',
            maxlen: 30,
        },
        ePsched: {
            name: 'ePsched',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule',
            prop: 'sched',
            maxlen: 20,
        },
        ePschedEffective: {
            name: 'ePschedEffective',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule since',
            prop: 'schedEffective',
            maxlen: 30,
        },
        LDAPdochazka: {
            name: 'LDAPdochazka',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'In Dochazka?',
            prop: 'dochazka',
            maxlen: 30,
        },
        sEnick: {
            name: 'sEnick',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Nick',
            prop: 'searchKeyNick',
            maxlen: 20,
        },
        pHpriv: {
            name: 'pHpriv',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'admin',
            text: 'Priv',
            prop: 'priv',
            maxlen: 10,
        },
        pHeffective: {
            name: 'pHeffective',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'admin',
            text: 'Effective date',
            prop: 'effective',
            maxlen: 30,
            vetter: datetime.vetDate,
        },
        rSDurl: {
            name: 'rSDurl',
            aclProfileRead: 'passerby',
            text: 'URI',
            prop: 'url',
            maxlen: 55,
        },
        rSDversion: {
            name: 'rSDversion',
            aclProfileRead: 'passerby',
            text: 'Version',
            prop: 'version',
            maxlen: 30,
        },
        sScode: {
            name: 'sScode',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Schedule code',
            prop: 'searchKeySchedCode',
            maxlen: 20,
        },
        sSid: {
            name: 'sSid',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Schedule ID',
            prop: 'searchKeySchedID',
            maxlen: 20,
        },
        sDcode: {
            name: 'sDcode',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule code',
            prop: 'scode',
            maxlen: 20,
        },
        sDid: {
            name: 'sDid',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule ID',
            prop: 'sid',
            maxlen: 20,
        },
        sDmon: {
            name: 'sDmon',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Monday',
            prop: 'mon',
            maxlen: 50,
        },
        sDtue: {
            name: 'sDtue',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Tuesday',
            prop: 'tue',
            maxlen: 50,
        },
        sDwed: {
            name: 'sDwed',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Wednesday',
            prop: 'wed',
            maxlen: 50,
        },
        sDthu: {
            name: 'sDthu',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Thursday',
            prop: 'thu',
            maxlen: 50,
        },
        sDfri: {
            name: 'sDfri',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Friday',
            prop: 'fri',
            maxlen: 50,
        },
        sDsat: {
            name: 'sDsat',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Saturday',
            prop: 'sat',
            maxlen: 50,
        },
        sDsun: {
            name: 'sDsun',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Sunday',
            prop: 'sun',
            maxlen: 50,
        },
        sDdisabled: {
            name: 'sDdisabled',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Disabled?',
            prop: 'disabled',
            maxlen: 10,
        },
        sCboiler: {
            name: 'sCboiler',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Intervals',
            prop: 'boilerplate',
            maxlen: 50,
        },
        sHid: {
            name: 'sHid',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'History ID',
            prop: 'shid',
            maxlen: 20,
        },
        iNdate: {
            name: 'iNdate',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Interval date',
            prop: 'iNdate',
            maxlen: 20,
            vetter: datetime.vetDate,
        },
        iNdaterange: {
            name: 'iNdaterange',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Date range',
            prop: 'iNdaterange',
            maxlen: 30,
            vetter: datetime.vetDateRange,
        },
        iNtimerange: {
            name: 'iNtimerange',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Time range',
            prop: 'iNtimerange',
            maxlen: 20,
            vetter: datetime.vetTimeRange,
        },
        iNact: {
            name: 'iNact',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Activity',
            prop: 'iNact',
            maxlen: 20,
        },
        iNdesc: {
            name: 'iNdesc',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Description',
            prop: 'iNdesc',
            maxlen: 60,
        },
        acTcode: {
            name: 'acTcode',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Code',
            prop: 'code',
            maxlen: 10,
        },
        acTaid: {
            name: 'acTaid',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'ID',
            prop: 'aid',
            maxlen: 6,
        },
        acTdesc: {
            name: 'acTdesc',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Description',
            prop: 'long_desc',
            maxlen: 40,
        },

    };

});