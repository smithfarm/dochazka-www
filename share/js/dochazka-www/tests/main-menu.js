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
  'app/canned-tests',
  'lib',
  'login',
  'loggout',
], function (
  QUnit,
  $,
  ct,
  coreLib,
  login,
  loggout,
) {

    var prefix = "dochazka-www: ",
        test_desc;

    return function () {

        test_desc = 'login, and immediately logout';
        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + prefix + test_desc);
            var done = assert.async(3),
                mainarea,
                htmlbuf,
                cu;
            login({"nam": "root", "pwd": "immutable"});
            setTimeout(function () {
                ct.login(assert, "root", "admin");
                done();
            }, 1000);
            setTimeout(function () {
                ct.mainMenu(assert);
                loggout();
                done();
            }, 1500);
            setTimeout(function () {
                ct.loggout(assert);
                done();
            }, 2000);
        });

        test_desc = 'masquerade as employee "active"';
        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + prefix + test_desc);
            var done = assert.async(5),
                mainarea,
                match,
                minimenu,
                htmlbuf,
                sel,
                cu;
            assert.expect(62);
            login({"nam": "root", "pwd": "immutable"});
            setTimeout(function () {
                ct.login(assert, "root", "admin");
                done();
            }, 1000);
            setTimeout(function () {
                ct.mainMenu(assert);
                assert.strictEqual($('#userbox').text(), 'Employee: root ADMIN');
                ct.mainareaForm(assert, 'mainMenu');
                sel = ct.getMenuEntry(assert, $('#mainarea').html(), 'Masquerade');
                if (! coreLib.isInteger(sel)) {
                    console.log("BAILING OUT");
                    assert.ok(false, "BAILING OUT");
                    done();
                }
                console.log("Main menu contains Masquerade as selection " + sel);
                assert.ok(true, "Main menu contains Masquerade as selection " + sel);
                $('input[name="sel"]').val(sel);
                $('input[name="sel"]').focus();
                // press ENTER -> submit the form
                $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
                ct.stack(assert, 2, 'navigating from mainMenu to searchEmployee', 'dform', 'searchEmployee');
                mainarea = $('#mainarea').html();
                ct.contains(assert, mainarea, "#mainarea", "Search Dochazka employees");
                assert.ok(true, "*** REACHED searchEmployee dform");
                done();
            }, 2000);
            setTimeout(function () {
                // enter a search string
                $('input[id="sEnick"]').val('act%');
                assert.strictEqual($('input[id="sEnick"]').val(), 'act%', "Search string entered into form");
                minimenu = $('#minimenu').html();
                ct.contains(assert, minimenu, "searchEmployee miniMenu", ".&nbsp;Search");
                sel = ct.getMenuEntry(assert, minimenu, 'Search')
                ct.log(assert, "searchEmployee miniMenu contains Search as selection " + sel);
                $('input[name="sel"]').val(sel);
                $('input[name="sel"]').focus();
                $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
            }, 2500);
            setTimeout(function () {
                ct.stack(assert, 3, 'browsing results of successful Dochazka employee search',
                         'dbrowser', 'masqueradeCandidatesBrowser');
                assert.ok(true, "*** REACHED masqueradeCandidatesBrowser dform");
                mainarea = $('#mainarea').html();
                minimenu = $('#minimenu').html();
                ct.contains(assert, mainarea, "Masquerade candidates browser", 'Masquerade candidates');
                ct.contains(assert, minimenu, "Masquerade selection in miniMenu", ".&nbsp;Masquerade");
                assert.ok(true, "*** REACHED Masquerade selection in masqueradeCandidatesBrowser miniMenu");
                sel = ct.getMenuEntry(assert, minimenu, 'Masquerade');
                assert.ok(true, "masqueradeCandidatesBrowser miniMenu contains Masquerade as selection " + sel);
                // select Masquerade (first time - begin)
                $('input[name="sel"]').val(sel);
                $('input[name="sel"]').focus();
                // press ENTER -> submit the form
                $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
                ct.stack(assert, 1, 'selected Masquerade in masqueradeCandidatesBrowser', 'dmenu', 'mainMenu');
                assert.strictEqual($('#userbox').text(), '!!! Employee: active (MASQUERADE) !!!');
                assert.ok(true, "*** REACHED masquerading as employee \"active\"");
                done();
            }, 3000);
            setTimeout(function () {
                ct.mainareaForm(assert, 'mainMenu');
                htmlbuf = $('#mainarea').html();
                sel = ct.getMenuEntry(assert, htmlbuf, 'Masquerade');
                assert.ok(true, "Main menu contains Masquerade as selection " + sel);
                // select Masqerade (second time - end)
                $('input[name="sel"]').val(sel);
                $('input[name="sel"]').focus();
                // press ENTER -> submit the form
                $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
                assert.strictEqual($('#userbox').text(), 'Employee: root ADMIN');
                loggout();
                done();
            }, 3500);
            setTimeout(function () {
                ct.loggout(assert);
                done();
            }, 4000);
        });

    };

});

