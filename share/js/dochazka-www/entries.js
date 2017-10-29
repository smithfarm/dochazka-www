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
    'app/caches',
    'app/act-lib',
    'app/int-lib',
    'datetime',
], function (
    caches,
    actLib,
    intLib,
    datetime,
) {

    return {

        acTaid: {
            name: 'acTaid',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Activity ID',
            prop: 'aid',
            hidden: true,
            maxlen: 6,
            populate: caches.populateAIDfromCode,
        },
        acTcode: {
            name: 'acTcode',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Activity Code',
            prop: 'code',
            maxlen: 10,
        },
        acTdesc: {
            name: 'acTdesc',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Description',
            prop: 'long_desc',
            maxlen: 40,
        },
        ePeffective: {
            name: 'ePeffective',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Effective',
            prop: 'effective',
            maxlen: 30,
        },
        ePemail: {
            name: 'ePemail',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Email',
            prop: 'email',
            maxlen: 55,
        },
        ePfullname: {
            name: 'ePfullname',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Full name',
            prop: 'fullname',
            maxlen: 55,
        },
        ePnick: {
            name: 'ePnick',
            aclProfileRead: 'passerby',
            aclProfileWrite: 'active',
            text: 'Nick',
            prop: 'nick',
            maxlen: 20,
        },
        ePpriv: {
            name: 'ePpriv',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Status',
            prop: 'priv',
            maxlen: 10,
        },
        ePprivEffective: {
            name: 'ePprivEffective',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Status since',
            prop: 'privEffective',
            maxlen: 30,
        },
        ePremark: {
            name: 'ePremark',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Remark',
            prop: 'remark',
            maxlen: 55,
        },
        ePschedEffective: {
            name: 'ePschedEffective',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule since',
            prop: 'schedEffective',
            maxlen: 30,
        },
        ePscode: {
            name: 'ePscode',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule code',
            prop: 'scode',
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
        ePsid: {
            name: 'ePsid',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule ID',
            prop: 'sid',
            maxlen: 20,
        },
        ePsuperNick: {
            name: 'ePsuperNick',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Supervisor',
            prop: 'ePsuperNick',
            maxlen: 30,
            populate: caches.populateSupervisorNick,
        },
        iNact: {
            name: 'iNact',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Activity',
            prop: 'iNact',
            maxlen: 32,
            vetter: actLib.vetActivity,
        },
        iNactHidden: {
            name: 'iNact',
            aclProfileRead: 'active',
            aclProfileWrite: 'admin',
            text: 'Activity',
            prop: 'iNact',
            hidden: true,
            maxlen: 20,
        },
        iNdate: {
            name: 'iNdate',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Date',
            prop: 'iNdate',
            maxlen: 20,
            vetter: datetime.vetDate,
        },
        iNdateHidden: {
            name: 'iNdate',
            aclProfileRead: 'active',
            aclProfileWrite: 'admin',
            text: 'Date',
            prop: 'iNdate',
            hidden: true,
            maxlen: 20,
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
        iNdaylist: {
            name: 'iNdaylist',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Day(s)',
            prop: 'iNdaylist',
            maxlen: 120,
            size: 60,
            vetter: intLib.vetDayList,
        },
        iNdesc: {
            name: 'iNdesc',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Description',
            prop: 'iNdesc',
            maxlen: 60,
        },
        iNexistintvls: {
            name: 'iNexistintvls',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Existing',
            prop: 'iNexistintvls',
            maxlen: 50,
            populate: caches.populateExistingIntervals,
        },
        iNlastexistintvl: {
            name: 'iNlastexistintvl',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Last existing',
            prop: 'iNlastexistintvl',
            maxlen: 50,
            populate: caches.populateLastExisting,
        },
        iNlastplusoffset: {
            name: 'iNlastplusoffset',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Time range',
            prop: 'iNlastplusoffset',
            maxlen: 50,
            populate: caches.populateLastPlusOffset,
        },
        iNmonth: {
            name: 'iNmonth',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Month',
            prop: 'iNmonth',
            maxlen: 20,
            vetter: datetime.vetMonth,
        },
        iNnextscheduled: {
            name: 'iNnextscheduled',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'To be created',
            prop: 'iNnextscheduled',
            maxlen: 50,
            populate: caches.populateNextScheduled,
        },
        iNoffset: {
            name: 'iNoffset',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Offset',
            prop: 'iNoffset',
            maxlen: 20,
        },
        iNschedintvls: {
            name: 'iNschedintvls',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Scheduled',
            prop: 'iNschedintvls',
            maxlen: 50,
            populate: caches.populateSchedIntvlsForDate,
        },
        iNsid: {
            name: 'iNsid',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule ID',
            prop: 'iNsid',
            hidden: true,
            maxlen: 20,
            populate: caches.populateSIDByDate,
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
        iNtoBeCreated: {
            name: 'textOnly',
            textOnly: "Interval to be created",
        },
        iNyear: {
            name: 'iNyear',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Year',
            prop: 'iNyear',
            maxlen: 5,
            vetter: datetime.vetYear,
        },
        iNyearHidden: {
            name: 'iNyear',
            aclProfileRead: 'active',
            aclProfileWrite: 'active',
            text: 'Year',
            prop: 'iNyear',
            hidden: true,
            maxlen: 5,
            populate: caches.populateYear,
        },
        LDAPdochazka: {
            name: 'LDAPdochazka',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'In Dochazka?',
            prop: 'dochazka',
            maxlen: 30,
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
        sCboiler: {
            name: 'sCboiler',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Intervals',
            prop: 'boilerplate',
            maxlen: 50,
        },
        sDcode: {
            name: 'sDcode',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Schedule code',
            prop: 'scode',
            maxlen: 20,
        },
        sDdisabled: {
            name: 'sDdisabled',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'Disabled?',
            prop: 'disabled',
            maxlen: 10,
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
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Monday',
            prop: 'mon',
            maxlen: 50,
        },
        sDtue: {
            name: 'sDtue',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Tuesday',
            prop: 'tue',
            maxlen: 50,
        },
        sDwed: {
            name: 'sDwed',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Wednesday',
            prop: 'wed',
            maxlen: 50,
        },
        sDthu: {
            name: 'sDthu',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Thursday',
            prop: 'thu',
            maxlen: 50,
        },
        sDfri: {
            name: 'sDfri',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Friday',
            prop: 'fri',
            maxlen: 50,
        },
        sDsat: {
            name: 'sDsat',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Saturday',
            prop: 'sat',
            maxlen: 50,
        },
        sDsun: {
            name: 'sDsun',
            aclProfileRead: 'inactive',
            aclProfileWrite: 'admin',
            text: 'Sunday',
            prop: 'sun',
            maxlen: 50,
        },
        sEnick: {
            name: 'sEnick',
            aclProfileRead: null,
            aclProfileWrite: 'admin',
            text: 'Nick',
            prop: 'searchKeyNick',
            maxlen: 20,
        },
        sHid: {
            name: 'sHid',
            aclProfileRead: 'admin',
            aclProfileWrite: 'admin',
            text: 'History ID',
            prop: 'shid',
            maxlen: 20,
        },
        sScode: {
            name: 'sScode',
            aclProfileRead: null,
            aclProfileWrite: 'inactive',
            text: 'Schedule code',
            prop: 'searchKeySchedCode',
            maxlen: 20,
        },
        sSid: {
            name: 'sSid',
            aclProfileRead: null,
            aclProfileWrite: 'inactive',
            text: 'Schedule ID',
            prop: 'searchKeySchedID',
            maxlen: 20,
        },

    };

});
