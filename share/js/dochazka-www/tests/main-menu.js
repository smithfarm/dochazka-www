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
// app/tests/main-menu.js
//
// Tests exercising the "mainMenu" dmenu
//
"use strict";

define ([
  'QUnit',
  'jquery',
  'current-user',
  'root',
], function (
  QUnit,
  $,
  currentUser,
  root
) {

    var prefix = "dochazka-www: ";

    return function () {

        QUnit.test(prefix + 'main menu appears', function (assert) {
            var mainarea,
                currentUserObj = currentUser('obj'),
                currentUserPriv = currentUser('priv');
            assert.ok(currentUserObj, 'There is a currentUser object: ' +
                QUnit.dump.parse(currentUserObj);
            assert.ok(currentUserPriv, 'Current user has a priv value: ' + currentUserPriv);
            root(); // start app in QUnit fixture
            mainarea = $('#mainarea');
            assert.ok(mainarea.html(), "#mainarea contains: " + mainarea.html());
            assert.strictEqual($('form', mainarea).length, 1, "#mainarea contains 1 form");
            assert.strictEqual($('form', mainarea)[0].id, 'mainMenu', "#mainarea form id is demoMenu");
        });

    };

});

