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
  'app/canned-tests',
  'lib',
  'login',
  'loggout',
  'stack',
  'start',
], function (
  QUnit,
  $,
  cannedTests,
  coreLib,
  login,
  loggout,
  stack,
  start,
) {

    var prefix = "dochazka-www: ",
        test_desc;

    return function () {

        test_desc = 'employee menu appears';
        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + prefix + test_desc);
            var done = assert.async(3);
            login({"nam": "demo", "pwd": "demo"});
            setTimeout(function () {
                cannedTests.login(assert, "demo", "passerby");
                done();
            }, 500);
            setTimeout(function () {
                cannedTests.mainMenuToMainEmpl(assert);
                loggout();
                done();
            }, 1000);
            setTimeout(function () {
                cannedTests.loggout(assert);
                done();
            }, 1500);
        });

        test_desc = 'employee profile - ACL failure';
        QUnit.test(test_desc, function (assert) {
            var done = assert.async(3);
            console.log("***TEST*** " + prefix + test_desc);
            login({"nam": "demo", "pwd": "demo"});
            setTimeout(function() {
                var htmlbuf,
                    result;
                cannedTests.login(assert, "demo", "passerby");
                cannedTests.mainMenuToMainEmpl(assert);
                assert.ok(true, 'select 0 ("My profile") in mainEmpl as demo');
                $('input[name="sel"]').val('0');
                $('input[name="sel"]').focus();
                $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
                cannedTests.ajaxCallInitiated(assert);
                done();
            }, 500);
            setTimeout(function() {
                var result = $("#result"),
                    htmlbuf = result.html();
                assert.ok(htmlbuf, "#result html: " + htmlbuf);
                cannedTests.contains(assert, htmlbuf, "#result", 'ACL check failed for resource');
                loggout();
                done();
            }, 1000);
            setTimeout(function () {
                cannedTests.loggout(assert);
                done();
            }, 1500);
        });

        test_desc = 'LDAP lookup - success';
        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + prefix + test_desc);
            var done = assert.async(4);
            login({"nam": "root", "pwd": "immutable"});
            setTimeout(function () {
                cannedTests.login(assert, "root", "admin");
                cannedTests.mainMenuToMainEmpl(assert);
                cannedTests.mainEmplToLdapLookup(assert);
                cannedTests.submitLdapLookup(assert, 'ncutler');
                done();
            }, 1000);
            setTimeout(function () {
                var ldapDochazka;
                cannedTests.stack(
                    assert,
                    4,
                    'Displaying LDAP employee after successful LDAP lookup',
                    'dform',
                    'ldapDisplayEmployee',
                );
                cannedTests.mainareaForm(assert, 'ldapDisplayEmployee');
                assert.strictEqual(
                    $('#ePfullname').text(),
                    "Nathan Cutler",
                    "Successful LDAP lookup displayed full name Nathan Cutler",
                );
                assert.strictEqual(
                    $('#ePnick').text(),
                    "ncutler",
                    "Successful LDAP lookup displayed nick ncutler",
                );
                ldapDochazka = $('#LDAPdochazka').text();
                assert.ok(ldapDochazka, "ncutler is in Dochazka already? " + ldapDochazka);
                assert.ok(
                    ldapDochazka === "YES" || ldapDochazka === "NO",
                    "Answer to whether ncutler is in Dochazka (" + ldapDochazka + ") makes sense",
                );
                assert.ok(true, "*** REACHED Employee LDAP lookup success");
                cannedTests.contains(
                    assert,
                    $('#mainarea').html(),
                    "#mainarea html",
                    "0. LDAP sync",
                );
                assert.ok(true, "*** REACHED miniMenu contains 0. LDAP sync");
                // choose '0' for ldapSync
                $('input[name="sel"]').val('0');
                $('input[name="sel"]').focus();
                start.mmKeyListener($.Event("keydown", {keyCode: 13}));
                assert.ok(true, "*** REACHED pressed 0 for LDAP sync");
                done();
            }, 3000);
            setTimeout(function () {
                var ldapDochazka = $('#LDAPdochazka').text();
                cannedTests.stack(
                    assert,
                    4,
                    'Displaying LDAP employee after successful LDAP lookup',
                    'dform',
                    'ldapDisplayEmployee',
                );
                cannedTests.mainareaForm(assert, 'ldapDisplayEmployee');
                assert.ok(ldapDochazka, "ncutler is in Dochazka already? " + ldapDochazka);
                assert.ok(
                    ldapDochazka === "YES",
                    "ncutler is now in Dochazka, no question about it",
                );
                $('input[name="sel"]').val('x');
                $('input[name="sel"]').focus();
                start.mmKeyListener($.Event("keydown", {keyCode: 13}));
                cannedTests.stack(
                    assert,
                    3,
                    'After selecting X in ldapDisplayEmployee',
                    'dform',
                    'ldapLookup',
                );
                assert.ok(true, "*** REACHED ldapLookup dform via X from ldapDisplayEmployee");
                assert.strictEqual(
                    coreLib.focusedItem().name,
                    'sel',
                    'Focus is on selection field',
                );
                $('input[name="sel"]').val('x');
                $('input[name="sel"]').focus();
                start.mmKeyListener($.Event("keydown", {keyCode: 13}));
                cannedTests.stack(
                    assert,
                    2,
                    'After selecting X in ldapLookup',
                    'dmenu',
                    'mainEmpl'
                );
                assert.ok(true, "*** REACHED mainEmpl dmenu via X from ldapLookup");
                loggout();
                done();
            }, 4000);
            setTimeout(function () {
                cannedTests.loggout(assert);
                done();
            }, 5000);
        });

        test_desc = 'LDAP lookup - failure';
        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + prefix + test_desc);
            var done = assert.async(4);
            login({"nam": "root", "pwd": "immutable"});
            setTimeout(function () {
                cannedTests.login(assert, "root", "admin");
                cannedTests.mainMenuToMainEmpl(assert);
                cannedTests.mainEmplToLdapLookup(assert);
                cannedTests.submitLdapLookup(assert, 'NONEXISTENTfoobarbazblatFISHBEAR');
                done();
            }, 1000);
            setTimeout(function () {
                cannedTests.stack(
                    assert,
                    3,
                    'failed LDAP lookup',
                    'dform',
                    'ldapLookup',
                );
                cannedTests.contains(
                    assert,
                    $("#result").html(),
                    "#result html",
                    "Employee not found in LDAP",
                );
                assert.strictEqual(
                    coreLib.focusedItem().name,
                    'entry0',
                    'Focus is on data entry field',
                );
                cannedTests.submitLdapLookup(assert, 'NONEXISTENTpseudoDataEntered');
                done();
            }, 3000);
            setTimeout(function () {
                cannedTests.stack(
                    assert,
                    3,
                    'failed LDAP lookup',
                    'dform',
                    'ldapLookup',
                );
                cannedTests.contains(
                    assert,
                    $("#result").html(),
                    "#result html",
                    "Employee not found in LDAP",
                );
                assert.strictEqual(
                    coreLib.focusedItem().name,
                    'entry0',
                    'Focus is on data entry field',
                );
                loggout();
                done();
            }, 4000);
            setTimeout(function () {
                cannedTests.loggout(assert);
                done();
            }, 5000);
        });

        test_desc = 'Search Dochazka employees - success no wildcard';
        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + prefix + test_desc);
            var done = assert.async(2);
            login({"nam": "root", "pwd": "immutable"});
            setTimeout(function () {
                cannedTests.login(assert, "root", "admin");
                cannedTests.mainMenuToMainEmpl(assert);
                cannedTests.mainEmplToSearchEmployee(assert);
                $('#searchEmployee input[name="entry0"]').val('ncutler');
                // choose '0' to start search
                $('input[name="sel"]').val('0');
                $('input[name="sel"]').focus();
                start.mmKeyListener($.Event("keydown", {keyCode: 13}));
                assert.ok(true, "*** REACHED pressed 0 to initiate search for Dochazka employee ncutler");
                done();
            }, 1000);
            setTimeout(function () {
                var htmlbuf = $("#mainarea").html();
                cannedTests.stack(
                    assert,
                    4,
                    'Reached simpleEmployeeBrowser dbrowser',
                    'dbrowser',
                    'simpleEmployeeBrowser'
                );
                cannedTests.contains(
                    assert,
                    htmlbuf,
                    "#mainarea html",
                    "Employee search results",
                );
                cannedTests.mainareaForm(assert, "simpleEmployeeBrowser");
                assert.strictEqual(
                    $('#ePfullname').text(),
                    "Nathan Cutler",
                    "Successful Dochazka employee search displayed full name Nathan Cutler",
                );
                assert.strictEqual(
                    $('#ePnick').text(),
                    "ncutler",
                    "Successful Dochazka employee displayed nick ncutler",
                );
                done();
            }, 1500);
        });

    };
});

