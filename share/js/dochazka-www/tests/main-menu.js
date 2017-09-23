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
  'login',
  'loggout',
  'root',
  'stack'
], function (
  QUnit,
  $,
  currentUser,
  login,
  loggout,
  root,
  stack
) {

    var prefix = "dochazka-www: ";

    return function () {

        var test_desc = prefix + 'main menu appears';

        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + test_desc);
            var done = assert.async(2),
                mainarea,
                htmlbuf,
                currentUserObj = currentUser('obj'),
                currentUserPriv = currentUser('priv'),
                theStack;
            console.log("TEST: logging in as root");
            login("root", "immutable");
            setTimeout(function () {
                console.log("TEST: post-login tests");
                currentUserObj = currentUser();
                assert.ok(currentUserObj, "currentUserObj after login: " + QUnit.dump.parse(currentUserObj));
                currentUserObj = currentUser('obj', { "nick": "root" }),
                currentUserPriv = currentUser('priv', "admin");
                assert.strictEqual(currentUserObj.nick, "root", 'we are now root');
                assert.strictEqual(currentUserPriv, 'admin', 'root has admin privileges');
                assert.ok(true, "Starting app in fixture");
                root(); // start app in QUnit fixture
                theStack = stack.getStack();
                assert.strictEqual(theStack.length, 1, "One item on stack after starting app");
                assert.strictEqual(theStack[0].target.type, "dmenu", "Stack target type is \"dmenu\"");
                assert.strictEqual(theStack[0].target.name, "mainMenu", "Stack target name is \"mainMenu\"");
                mainarea = $('#mainarea');
                htmlbuf = mainarea.html();
                assert.ok(htmlbuf, "#mainarea contains: " + htmlbuf);
                assert.strictEqual($('form', mainarea).length, 1, "#mainarea contains 1 form");
                assert.strictEqual($('form', mainarea)[0].id, 'mainMenu', "#mainarea form id is mainMenu");
                loggout();
                done();
            }, 500);
            setTimeout(function () {
                console.log("TEST: post-logout tests");
                currentUserObj = currentUser();
                assert.ok(currentUserObj, "currentUserObj after logout: " + QUnit.dump.parse(currentUserObj));
                assert.strictEqual(currentUserObj.obj.nick, null, 'Current user object reset to null');
                assert.strictEqual(currentUserObj.priv, null, 'Current user priv reset to null');
                mainarea = $('#mainarea');
                htmlbuf = mainarea.html();
                assert.ok(htmlbuf, "#mainarea contains: " + htmlbuf);
                assert.notStrictEqual(
                    htmlbuf.indexOf('You have been logged out'),
                    -1,
                    "#mainarea html contains substring \"You have been logged out\""
                );
                done();
            }, 1000);
        });

    };

});

