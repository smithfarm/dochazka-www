// ************************************************************************* 
// Copyright (c) 2014-2015, SUSE LLC
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
// app/emp-profile-update.js
//
// Update employee profile to match what is in the form
//
"use strict";

define ([
    'jquery',
    'ajax',
    'current-user',
    'lib',
    'app/lib',
    'app/prototypes',
    'target'
], function (
    $,
    ajax,
    currentUser,
    lib,
    appLib,
    prototypes,
    target
) {

    var 
        // employee object storage
        employeeObject = Object.create(prototypes.empProfile),

        // method for accessing the stored employee object
        getEmployeeObject = function () { return employeeObject; },

        // method for setting the stored employee object
        loadEmpProfile = function (eid) {
            var rest = {
                    "method": 'GET',
                    "path": 'employee/eid/' + eid + '/full'
                },
                // success callback
                sc = function (st) {
                    if (st.code === 'DISPATCH_EMPLOYEE_PROFILE_FULL') {
                        console.log("Payload is", st.payload);
                        var effective = st.payload.privhistory.effective;
                        effective = effective.substr(0, effective.indexOf(" "));
                        employeeObject = $.extend(
                            Object.create(prototypes.empProfile), {
                                'eid': st.payload.emp.eid,
                                'nick': st.payload.emp.nick,
                                'fullname': st.payload.emp.fullname,
                                'email': st.payload.emp.email,
                                'remark': st.payload.emp.remark,
                                'sec_id': st.payload.emp.sec_id,
                                'priv': st.payload.privhistory.priv,
                                'effective': effective
                            }
                        );
                        target.pull('empProfile').start();
                    }
                },
                fc = null;
            ajax(rest, sc, fc);
        },

        // "search employee" method
        searchEmp = function (obj) {
            // obj is searchKeyNick from the form
            console.log("Entering target 'searchEmployee' start method with argument", obj);
            var rest = {
                    "method": 'GET',
                    "path": 'employee/search/nick/' + encodeURIComponent(obj.searchKeyNick)
                },
                // success callback
                sc = function (st) {
                    if (st.code === 'DISPATCH_RECORDS_FOUND') {
        
                        // if only one record is returned, it might be in a result_set
                        // or it might be alone in the payload
                        var rs = st.payload.result_set || st.payload,
                            count = rs.length;
        
                        console.log("Search found " + count + " employees");
                        lib.holdObject(rs);
                        target.pull('simpleEmployeeBrowser').start();

                    } else {
                        console.log("Search found 0 employees");
                        target.pull('searchEmpNothingFound').start();
                    }
                },
                // failure callback
                fc = null;
            ajax(rest, sc, fc);
        },

        // "insert employee" method
        insertEmp = function (emp) {
            var rest = {
                    "method": 'PUT',
                    "path": 'employee/nick/' + emp.nick,
                    "body": emp.sanitize()
                },
                // success callback
                sc = function (st) {
                    console.log("Created new employee: ", st.payload);
                    $('#result').html("Created new employee " + st.payload.nick);
                    employeeObject = st.payload;
                    setEmployeeObject(employeeObject);
                    target.pull('empProfile').start();
                },
                // failure callback
                fc = null;
            ajax(rest, sc, fc);        
        },

        // masquerade as a different employee
        currentEmployeeStashed = null,
        currentEmplPrivStashed = null,
        backgroundColorStashed = null,
        endTheMasquerade = function () {
            currentUser('flag1', 0); // turn off masquerade flag
            console.log('flag1 === ', currentUser('flag1'));
            currentUser('obj', currentEmployeeStashed);
            currentEmployeeStashed = null;
            $('#userbox').html(appLib.fillUserBox()); // reset userbox
            $('#mainarea').css("background-color", backgroundColorStashed);
            $('#result').html('Masquerade is finished');
            $('input[name="sel"]').val('');
        },
        masqEmp = function (obj) {
            // if obj is empty, dA was selected from menu
            // if obj is full, it contains the employee to masquerade as
        
            if (currentEmployeeStashed) {
                endTheMasquerade();
                return;
            }

            var cu = currentUser('obj');

            if (obj && obj.nick === cu.nick) {
                $('#result').html('Request to masquerade as self makes no sense');
                return;
            }

            if (obj) {
                // let the masquerade begin
                currentEmployeeStashed = $.extend({}, cu);
                backgroundColorStashed = $('#mainarea').css("background-color");
                currentUser('obj', obj);
                currentUser('flag1', 1); // turn on masquerade flag
                $('#userbox').html(appLib.fillUserBox()); // reset userbox
                $('#mainarea').css("background-color", "red");
                target.pull('mainMenu').start();
                return;
            }
        
            // let the admin pick which user to masquerade as
            target.pull('searchEmployee').start();
        },

        // "new employee" method - checks database if employee doesn't already exist
        // and then calls insertEmp
        newEmplSubmit = function (emp) {
            console.log("Entering function newEmplSubmit");
            var rest = {
                    method: 'GET',
                    path: 'employee/nick/' + emp.nick || ''
                },
                // success callback -- employee already exists
                sc = function (st) {
                    var message = 'Employee ' + emp.nick + ' already exists'
                    console.log(message);
                    $('#result').html(message);
                    $('input[name="sel"]').focus();
                    $('input[name="sel"]').val('');
                },
                // failure callback -- employee doesn't exist
                fc = function (st) {
                    var err = st.payload.code;
                    if (err === '404') {
                        console.log('Employee ' + emp.nick + ' not found');
                        insertEmp(emp);
                    }
                }
            ajax(rest, sc, fc);        
        },

	// epuGen ("generate employee profile update function") is called to
	// save changes to the database, both for the 'empProfileEdit' form and
	// the 'changePassword' form
        //
	// the argument afterTarget is the name of the target to go to
	// when the database update is finished -- this is the only parameter
	// that differs between the two targets
        //
        epuGen = function (afterTarget, emp) {
            var protoEmp = Object.create(prototypes.empProfile);
            console.log("Entering epuGen with target " + afterTarget + " and object", emp);
            $.extend(protoEmp, emp);
            var rest = {
                    "method": 'POST',
                    "path": 'employee/eid',
                    "body": protoEmp.sanitize()
                },
                sc = function (st) {
                    // st is 'Status'
                    if (afterTarget === 'mainEmpl') {
                        // this is a change password operation
                        $("#result").html("Password changed");
                    } else if (afterTarget === 'empProfile') {
                        // this is an employee profile update
                        $("#result").html("Employee profile updated");
                    }
                    $.extend(protoEmp, st.payload);
                    currentUser("obj", protoEmp);
                    console.log("Saved new employee object to database: ", protoEmp);
                    t.start();
                },
                fc = function (st) {
                    console.log("Failure callback received argument", st);
                    $("#result").html(st.text);
                };
            ajax(rest, sc, fc);
        };

    // here is where we define methods implementing the various
    // employee-related actions (see daction-start.js)
    return {
        getEmployeeObject: getEmployeeObject,
        mainEmpl: function (emp) { epuGen('mainEmpl', emp); },
        loadEmpProfile: loadEmpProfile,
        empProfileUpdate: function (emp) { epuGen('empProfile', emp); },
        passChangePending: function (emp) {
            employeeObject = emp;
            target.pull('confirmPassword').start();
        },
        newEmplSubmit: newEmplSubmit,
        insertEmployee: insertEmp,
        actionEmplSearch: searchEmp,
        endTheMasquerade: endTheMasquerade,
        masqEmployee: masqEmp
    };

});

