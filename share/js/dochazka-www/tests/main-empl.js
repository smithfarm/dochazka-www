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
  'login',
  'loggout',
], function (
  QUnit,
  $,
  cannedTests,
  login,
  loggout,
) {

    var prefix = "dochazka-www: ",
        test_desc;

    return function () {

        test_desc = 'employee menu appears';
        QUnit.test(test_desc, function (assert) {
            console.log('***TEST*** ' + prefix + test_desc);
            var done = assert.async(3);
            login("demo", "demo");
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
            var done = assert.async(4);
            console.log("***TEST*** " + prefix + test_desc);
            login("demo", "demo");
            setTimeout(function() {
                cannedTests.login(assert, "demo", "passerby");
                done();
            }, 500);
            setTimeout(function () {
                var htmlbuf,
                    result;
                cannedTests.mainMenuToMainEmpl(assert);
                assert.ok(true, 'select 0 ("My profile") in mainEmpl as demo');
                $('input[name="sel"]').val('0');
                $('input[name="sel"]').trigger($.Event("keydown", {keyCode: 13}));
                result = $('#result');
                htmlbuf = result.html();
                assert.ok(htmlbuf, "#result html: " + htmlbuf);
                cannedTests.contains(assert, htmlbuf, "#result", 'AJAX call');
                done();
            }, 1000);
            setTimeout(function() {
                var result = $("#result"),
                    htmlbuf = result.html();
                assert.ok(htmlbuf, "#result html: " + htmlbuf);
                cannedTests.contains(assert, htmlbuf, "#result", 'ACL check failed for resource');
                loggout();
                done();
            }, 1500);
            setTimeout(function () {
                cannedTests.loggout(assert);
                done();
            }, 2000);
        });
    };

});

