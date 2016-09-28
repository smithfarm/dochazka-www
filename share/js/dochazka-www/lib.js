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
// app/lib.js
//
// application-specific routines
//
"use strict";

define ([
    'current-user'
], function (
    currentUser
) {

    return {

        // dform and dbrowser entries
        entries: {
            'ePnick': {
                name: 'ePnick',
                aclProfileRead: 'passerby',
                aclProfileWrite: 'active',
                text: 'Nick',
                prop: 'nick',
                maxlen: 20
            },
           'ePsec_id': {
               name: 'ePsec_id',
               aclProfileRead: 'passerby',
               aclProfileWrite: null,
               text: 'Workforce ID',
               prop: 'sec_id',
               maxlen: 8
           },
           'ePfullname': {
               name: 'ePfullname',
               aclProfileRead: 'passerby',
               aclProfileWrite: 'active',
               text: 'Full name',
               prop: 'fullname',
               maxlen: 55
           },
           'ePemail': {
               name: 'ePemail',
               aclProfileRead: 'passerby',
               aclProfileWrite: 'active',
               text: 'Email',
               prop: 'email',
               maxlen: 55
           },
           'ePremark': {
               name: 'ePremark',
               aclProfileRead: 'admin',
               aclProfileWrite: 'admin',
               text: 'Remark',
               prop: 'remark',
               maxlen: 55
           },
           'ePpriv': {
               name: 'ePpriv',
               aclProfileRead: 'inactive',
               aclProfileWrite: 'admin',
               text: 'Privlevel',
               prop: 'priv',
               maxlen: 10
           },
           'ePeffective': {
               name: 'ePeffective',
               aclProfileRead: 'inactive',
               aclProfileWrite: 'admin',
               text: 'Effective',
               prop: 'effective',
               maxlen: 30
           },
           'LDAPdochazka': {
               name: 'LDAPdochazka',
               aclProfileRead: 'inactive',
               aclProfileWrite: 'admin',
               text: 'In Dochazka?',
               prop: 'dochazka',
               maxlen: 30
           },
           'sEnick': {
               name: 'sEnick',
               aclProfileRead: null,
               aclProfileWrite: 'admin',
               text: 'Nick',
               prop: 'searchKeyNick',
               maxlen: 20
           }
        },

        //
        // function returns string to be displayed in the 'userbox'
        // <span> element at the top right of the "screen" (i.e. browser
        // window) -- called from html.js
        //
        fillUserBox: function () {

            var r = '', 
                cu = currentUser(),
                cunick,
                cupriv,
                cumasq;

            if (cu) {
                cunick = cu.obj.nick || null;
                cupriv = cu.priv || 'passerby';
                cumasq = cu.flag1; // use flag1 as masquerade state
            } else {
                cunick = null;
                cupriv = 'passerby';
                cumasq = undefined;
            }

            if (cumasq) {
                r += '<b>!!! ';
            }

            r += 'Employee: ';
            r += cunick ? cu.obj.nick : '&lt;NONE&gt;';
            if (cumasq) {
                r += ' (MASQUERADE)';
            } else {
                if (cupriv === 'admin') {
                    r += '&nbsp;ADMIN';
                }
            }

            if (cumasq) {
                r += ' !!!</b>';
            }

            return r;

        },

        //
        // function returns string that will be displayed at the very
        // bottom of the screen (directly under the frame)
        //
        fillNoticesLine: function () {
            var r = '';
            r += 'Copyright \u00A9 SUSE LLC, 2014-2016. All rights reserved. ';
            r += 'Report bugs at ';
            r += '<a href="https://github.com/smithfarm/dochazka/issues">';
            r += 'https://github.com/smithfarm/dochazka/issues</a>';
            return r;
        }
   
    };
});
