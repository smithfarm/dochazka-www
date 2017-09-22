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
// app/tests/main-empl.js
//
// Tests exercising the "mainEmpl" dmenu
//
"use strict";

define ([
  'QUnit',
  'jquery',
  'current-user',
  'root',
  'stack'
], function (
  QUnit,
  $,
  currentUser,
  root,
  stack
) {

    var prefix = "dochazka-www: ";

    return function () {

        QUnit.test(prefix + 'Employee menu appears', function (assert) {
            var done = assert.async(),
                sel,
                currentUserObj = currentUser('obj'),
                currentUserPriv = currentUser('priv'),
                theStack;
            assert.timeout(200);
            assert.deepEqual(currentUserObj, { "nick": "" }, 'starting currentUser object is ' +
                QUnit.dump.parse(currentUserObj));
            assert.strictEqual(currentUserPriv, null, 'starting currentUser priv is ' +
                QUnit.dump.parse(currentUserPriv));
            currentUserObj = currentUser('obj', { "nick": "demo" }),
            currentUserPriv = currentUser('priv', "passerby");
            assert.strictEqual(currentUserObj.nick, "demo", 'we are now demo');
            assert.strictEqual(currentUserPriv, 'passerby', 'demo has passerby privileges');
            assert.ok(true, "Starting app in fixture");
            root(); // start mfile-www demo app in QUnit fixture
            theStack = stack.getStack();
            assert.strictEqual(theStack.length, 1, "One item on the stack after starting app");
            sel = $('input[name="sel"]').val();
            assert.strictEqual(sel, '', "Selection form field is empty");
            // press '0' key in sel, but value does not change?
            $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 48})); // press '0' key
            sel = $('input[name="sel"]').val();
            assert.strictEqual(sel, '', "Selection form field is empty even after simulating 0 keypress");
            // simulating keypress doesn't work, so just set the value to "0"
            $('input[name="sel"]').val('0');
            // press ENTER -> submit the form
            $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
            setTimeout(function() {
                var mainarea = $('#mainarea'),
                    htmlbuf = mainarea.html();
                assert.ok(htmlbuf, "#mainarea has non-empty html: " + htmlbuf);
                assert.strictEqual($('form', mainarea).length, 1, "#mainarea contains 1 form");
                assert.strictEqual($('form', mainarea)[0].id, 'mainEmpl', "#mainarea form id is mainEmpl");
                assert.notStrictEqual(
                    htmlbuf.indexOf('My profile'),
                    -1,
                    "#mainarea html contains substring \"My profile\""
                );
            });
            // teardown
            currentUser('obj', null);
            currentUser('priv', null);
            done();
        });

        QUnit.test(prefix + 'Employee profile - ACL failure', function (assert) {
            var done = assert.async(),
                sel,
                currentUserObj = currentUser('obj'),
                currentUserPriv = currentUser('priv'),
                mainarea,
                result,
                htmlbuf,
                theStack;
            assert.deepEqual(currentUserObj, { "nick": "" }, 'starting currentUser object is ' +
                QUnit.dump.parse(currentUserObj));
            assert.strictEqual(currentUserPriv, null, 'starting currentUser priv is ' +
                QUnit.dump.parse(currentUserPriv));
            currentUserObj = currentUser('obj', { "nick": "demo" }),
            currentUserPriv = currentUser('priv', "passerby");
            assert.strictEqual(currentUserObj.nick, "demo", 'we are now demo');
            assert.strictEqual(currentUserPriv, 'passerby', 'demo has passerby privileges');
            assert.ok(true, "Starting app in fixture");
            root(); // start app in QUnit fixture
            theStack = stack.getStack();
            assert.strictEqual(theStack.length, 1, "One item on the stack after starting app");
            assert.ok(theStack, "stack contains items: " + QUnit.dump.parse(theStack));
            // select 0 in Main Menu
            $('input[name="sel"]').val('0');
            // press ENTER -> submit the form
            $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
            theStack = stack.getStack();
            assert.strictEqual(theStack.length, 2, "Two items on the stack after selecting 0 in main menu");
            assert.ok(theStack, "stack contains items: " + QUnit.dump.parse(theStack));
            mainarea = $('#mainarea');
            htmlbuf = mainarea.html();
            assert.ok(htmlbuf, "#mainarea has non-empty html: " + htmlbuf);
            assert.strictEqual($('form', mainarea).length, 1, "#mainarea contains 1 form");
            assert.strictEqual($('form', mainarea)[0].id, 'mainEmpl', "#mainarea form id is mainEmpl");
            assert.notStrictEqual(
                htmlbuf.indexOf('My profile'),
                -1,
                "#mainarea html contains substring \"My profile\""
            );
            // select 0 ("My profile") in Employee menu
            $('input[name="sel"]').val('0');
            // press ENTER -> submit the form
            $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
            result = $('#result');
            htmlbuf = result.html();
            assert.ok(htmlbuf, "#result has non-empty html: " + htmlbuf);
            assert.notStrictEqual(
                htmlbuf.indexOf('AJAX call'),
                -1,
                "#mainarea html contains substring \"AJAX call\""
            );
            // wait for AJAX call to complete, and then test for ACL error
            setTimeout(function() {
                var result = $("#result"),
                    htmlbuf = result.html();
                assert.ok(htmlbuf, "#result has non-empty html: " + htmlbuf);
                // teardown
                currentUser('obj', null);
                currentUser('priv', null);
                done();
            }, 1000);
        });
    };

});

