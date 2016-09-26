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
        employeeObject = Object.create(prototypes.empObject),
        employeeProfile = Object.create(prototypes.empProfile),
        ldapEmployeeObject = Object.create(prototypes.ldapEmpObject),

        getEmployeeObject = function () { return employeeObject; },
        getEmployeeProfile = function () { return employeeProfile; },
        getLdapEmployeeObject = function () { return ldapEmployeeObject; },

        myProfile = function () {
            var cu = currentUser('obj');
            if (employeeProfile.effective !== null && employeeProfile.nick === cu.nick) {
                target.pull('empProfile').start();
            } else {
                loadEmpProfile(currentUser('obj').eid);
            }
        },

        loadEmpProfile = function (eid) {
            var rest = {
                    "method": 'GET',
                    "path": 'employee/eid/' + eid + '/full'
                },
                // success callback
                sc = function (st) {
                    if (st.code === 'DISPATCH_EMPLOYEE_PROFILE_FULL') {
                        console.log("Payload is", st.payload);
                        var priv = null,
                            effective = null;
                        if (st.payload.privhistory !== null) {
                            priv = st.payload.privhistory.priv
                            effective = st.payload.privhistory.effective
                            effective = effective.substr(0, effective.indexOf(" "));
                        }
                        employeeProfile = $.extend(
                            Object.create(prototypes.empProfile), {
                                'eid': st.payload.emp.eid,
                                'nick': st.payload.emp.nick,
                                'fullname': st.payload.emp.fullname,
                                'email': st.payload.emp.email,
                                'remark': st.payload.emp.remark,
                                'sec_id': st.payload.emp.sec_id,
                                'priv': priv,
                                'effective': effective
                            }
                        );
                        currentUser('obj', employeeProfile);
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
                target.pull('mainEmpl').start();
                return;
            }
        
            // let the admin pick which user to masquerade as
            target.pull('searchEmployee').start();
        },

        ldapLookupSubmit = function (emp) {
            console.log("Entering function ldapLookupSubmit, argument ->" + emp.nick + "<-");
            // "nick" is the only property of emp that is populated
            if (! emp.nick) {
                return;
            }
            var nick = emp.nick,
                rest = {
                    method: 'GET',
                    path: 'employee/nick/' + nick + "/ldap"
                },
                // success callback -- employee already exists
                sc = function (st) {
                    if (st.code === 'DOCHAZKA_LDAP_LOOKUP') {
                        console.log("Payload is", st.payload);
                        ldapEmployeeObject = $.extend(ldapEmployeeObject, st.payload);
                    }
                    ldapEmployeeLink();
                },
                // failure callback -- employee doesn't exist
                fc = function (st) {
                    var msg = st.payload.message;
                    console.log(msg);
                    $("#result").html(msg);
                    $('input[name="sel"]').val('');
                    $('input[name="entry0"]').focus();
                }
            ajax(rest, sc, fc);
        },

        ldapEmployeeLink = function () {
            // we assume the ldapEmployeeObject has already been 
            // partially populated - we just need to determine whether
            // or not the nick already exists in the local database
            if (ldapEmployeeObject.nick === null) {
                return ldapEmployeeObject;
            }
            ldapEmployeeObject.dochazka = false;
            var rest = {
                    "method": 'GET',
                    "path": 'employee/nick/' + ldapEmployeeObject.nick
                },
                // success callback
                sc = function (st) {
                    if (st.code === "DISPATCH_EMPLOYEE_FOUND") {
                        console.log("Payload is", st.payload);
                        ldapEmployeeObject.dochazka = true;
                    }
                    if (document.getElementById('ldapLookup') ||
                        document.getElementById('ldapDisplayEmployee')) {
                        target.pull('ldapDisplayEmployee').start();
                    }
                },
                fc = function (st) {
                    if (document.getElementById('ldapLookup') ||
                        document.getElementById('ldapDisplayEmployee')) {
                        target.pull('ldapDisplayEmployee').start();
                    }
                }
            ajax(rest, sc, fc);
        },

        ldapSync = function (ldapEmp) {
            console.log("Entered ldapSync with object", ldapEmp);
            if (! ldapEmp.nick) {
                return;
            }
            var nick = ldapEmp.nick,
                rest = {
                    method: 'PUT',
                    path: 'employee/nick/' + nick + '/ldap'
                },
                // success callback -- employee already exists
                sc = function (st) {
                    console.log("PUT ldap success, st object is", st);
                    if (st.code === 'DOCHAZKA_CUD_OK') {
                        console.log("Payload is", st.payload);
                        ldapEmployeeObject = $.extend(ldapEmployeeObject, st.payload);
                        ldapEmployeeObject.dochazka = true;
                    }
                    ldapEmployeeLink();
                },
                // failure callback -- employee doesn't exist
                fc = function (st) {
                    var err = st.payload.code,
                        msg;
                    if (err === '404') {
                        msg = 'Employee ' + emp.nick + ' not found in LDAP';
                    } else {
                        msg = st.text;
                    }
                    console.log(msg);
                    $("#result").html(msg);
                    $('input[name="sel"]').val('');
                    $('input[name="entry0"]').focus();
                }
            ajax(rest, sc, fc);
        },

	// epuGen ("generate employee profile update function") is called to
	// save changes to the database
        //
	// the argument afterTarget is the name of the target to go to
	// when the database update is finished
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
                    if (afterTarget === 'empProfile') {
                        // this is an employee profile update
                        $("#result").html("Employee profile updated");
                    }
                    console.log("Saved new employee object to database: ", protoEmp);
                    $.extend(employeeProfile, st.payload);
                    console.log("Profile object is", employeeProfile);
                    target.pull(afterTarget).start();
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
        getEmployeeProfile: getEmployeeProfile,
        getLdapEmployeeObject: getLdapEmployeeObject,
        mainEmpl: function (emp) { epuGen('mainEmpl', emp); },
        myProfile: myProfile,
        loadEmpProfile: loadEmpProfile,
        empProfileUpdate: function (emp) { epuGen('empProfile', emp); },
        ldapLookupSubmit: ldapLookupSubmit,
        ldapSync: ldapSync,
        actionEmplSearch: searchEmp,
        endTheMasquerade: endTheMasquerade,
        masqEmployee: masqEmp
    };

});

