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
// canned-tests.js
//
// avoid code duplication avoid code duplication
//
"use strict";

define ([
    "jquery",
    "current-user",
    "root",
    "stack",
], function (
    $,
    currentUser,
    root,
    stack,
) {

    var ajaxCallInitiatedFunc = function (assert) {
            var htmlbuf = $("#result").html();
            assert.ok(htmlbuf, "#result html: " + htmlbuf);
            containsFunc(assert, htmlbuf, "#result", 'AJAX call');
        },
        containsFunc = function (assert, lookIn, lookInDesc, lookFor) {
            // asserts that the string lookIn contains substring lookFor
            // lookInDesc describes what lookIn represents
            assert.notStrictEqual(
                lookIn.indexOf(lookFor),
                -1,
                lookInDesc + " contains substring \"" + lookFor + "\""
            );
        },
        mainareaFormFunc = function (assert, formId) {
            // asserts that #mainarea contains a form and that its form ID is
            // formID
            var mainarea = $('#mainarea'),
                htmlbuf = mainarea.html();
            assert.ok(htmlbuf, "#mainarea html: " + htmlbuf);
            assert.strictEqual($('form', mainarea).length, 1, "#mainarea contains 1 form");
            assert.strictEqual($('form', mainarea)[0].id, formId, "that form is called " + formId);
        },
        stackFunc = function (assert, stackLen, afterWhat, tgtType, tgtName) {
            // asserts that stack has a certain length (stackLen) after doing
            // some action (afterWhat) and that the target on the top of the
            // stack is of type tgtType and has name tgtName
            var topTarget = stack.getTarget();
            assert.strictEqual(
                stack.getLength(),
                stackLen,
                stackLen + " item(s) on stack after " + afterWhat
            );
            assert.strictEqual(
                topTarget.type,
                tgtType,
                "Target on top of stack is of type \"" + tgtType + "\"",
            );
            assert.strictEqual(
                topTarget.name,
                tgtName,
                "Target on top of stack has name \"" + tgtName + "\"",
            );
        };

    return {

        "ajaxCallInitiated": ajaxCallInitiatedFunc,

        "contains": containsFunc,

        "loggout": function (assert) {
            var cu,
                htmlbuf,
                mainarea;
            console.log("TEST: post-logout tests");
            assert.ok(true, '*** REACHED logging out ***');
            cu = currentUser();
            assert.ok(cu.obj, "currentUserObj after logout: " + QUnit.dump.parse(cu));
            assert.strictEqual(cu.obj.nick, null, 'Current user object reset to null');
            assert.strictEqual(cu.priv, null, 'Current user priv reset to null');
            containsFunc(assert, $('#mainarea').html(), "#mainarea", 'You have been logged out');
        },

        "login": function (assert, nick, priv) {
            var cu,
                htmlbuf,
                mainarea;
            console.log("TEST: post-login tests");
            cu = currentUser();
            assert.ok(cu, "current user object after login: " + QUnit.dump.parse(cu));
            assert.strictEqual(cu.obj.nick, nick, 'we are now ' + nick);
            assert.strictEqual(cu.priv, priv, nick + ' has ' + priv + ' privileges');
            assert.ok(true, "Starting app in fixture");
            root(); // start app in QUnit fixture
            stackFunc(assert, 1, 'starting app', 'dmenu', 'mainMenu');
            mainareaFormFunc(assert, 'mainMenu');
            assert.ok(true, '*** REACHED logged in as ' + nick);
        },

        "mainareaForm": mainareaFormFunc,

        "mainEmplToLdapLookup": function (assert) {
            var htmlbuf,
                input;
            assert.ok(true, 'select 1 ("Look up an LDAP employee") in mainEmpl as root');
            mainareaFormFunc(assert, 'mainEmpl');
            stackFunc(assert, 2, 'In mainEmpl before navigating to ldapLookup', 'dmenu', 'mainEmpl');
            $('input[name="sel"]').val('1');
            $('input[name="sel"]').focus();
            $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
            mainareaFormFunc(assert, 'ldapLookup');
            stackFunc(assert, 3, 'Reached ldapLookup dform', 'dform', 'ldapLookup');
            htmlbuf = $('#mainarea').html();
            assert.ok(htmlbuf, "#mainarea html: " + htmlbuf);
            containsFunc(
                assert,
                htmlbuf,
                "#mainarea html",
                "Enter employee nick for exact (case insensitive) match"
            );
            assert.ok(
                $('#ldapLookup input[name="entry0"]'),
                "The ldapLookup form contains a data entry field"
            );
            assert.ok(true, "*** REACHED ldapLookup dform");
        },

        "mainMenuToMainEmpl": function (assert) {
            var htmlbuf,
                mainmarea,
                sel,
                theStack;
            mainareaFormFunc(assert, 'mainMenu');
            sel = $('input[name="sel"]').val();
            assert.strictEqual(sel, '', "Selection form field is empty");
            // press '0' key in sel, but value does not change?
            $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 48})); // press '0' key
            sel = $('input[name="sel"]').val();
            assert.strictEqual(sel, '', "Selection form field is empty even after simulating 0 keypress");
            // simulating keypress doesn't work, so just set the value to "0"
            $('input[name="sel"]').val('0');
            $('input[name="sel"]').focus();
            // press ENTER -> submit the form
            $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
            stackFunc(assert, 2, 'navigating from mainMenu to mainEmpl', 'dmenu', 'mainEmpl');
            mainareaFormFunc(assert, 'mainEmpl');
            containsFunc(assert, $('#mainarea').html(), "#mainarea", "My profile");
            assert.ok(true, "*** REACHED mainEmpl dmenu");
        },

        "stack": stackFunc,

    };

});
