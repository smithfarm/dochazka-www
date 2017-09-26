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
// app/emp-lib.js
//
"use strict";

define ([
    'jquery',
    'ajax',
    'current-user',
    'lib',
    'app/lib',
    'app/prototypes',
    'stack',
    'start',
    'target'
], function (
    $,
    ajax,
    currentUser,
    coreLib,
    appLib,
    prototypes,
    stack,
    start,
    target
) {

    var ldapEmployeeObject,

        resetLdapEmployeeObject = function () {
            ldapEmployeeObject = Object.create(prototypes.ldapEmpObject);
        },

        getLdapEmployeeObject = function () { return ldapEmployeeObject; },

        myProfileAction = function () {
            var eid = currentUser('obj').eid,
                rest = {
                    "method": 'GET',
                    "path": 'employee/eid/' + eid + '/full'
                },
                employeeProfile,
                // success callback
                sc = function (st) {
                    if (st.code === 'DISPATCH_EMPLOYEE_PROFILE_FULL') {
                        console.log("Payload is", st.payload);
                        var priv = null,
                            privEffective = null,
                            sched = null,
                            schedEffective = null;
                        if (st.payload.privhistory !== null) {
                            priv = st.payload.privhistory.priv;
                            privEffective = coreLib.readableDate(
                                st.payload.privhistory.effective
                            );
                        }
                        if (st.payload.schedhistory !== null) {
                            if (st.payload.schedhistory.scode !== null) {
                                sched = st.payload.schedhistory.scode;
                            } else {
                                sched = '(Schedule ID ' + st.payload.schedhistory.sid + ')';
                            }
                            schedEffective = coreLib.readableDate(
                                st.payload.schedhistory.effective
                            );
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
                                'privEffective': privEffective,
                                'sched': sched,
                                'schedEffective': schedEffective
                            }
                        );
                        currentUser('obj', employeeProfile);
                        stack.push('empProfile', employeeProfile, {
                            "xtarget": "mainEmpl"
                        });
                    } else {
                        coreLib.displayError("Unexpected status code " + st.code);
                    }
                },
                fc = function (st) {
                    console.log("AJAX: " + rest["path"] + " failed with", st);
                    coreLib.displayError(st.payload.message);
                };
            ajax(rest, sc, fc);
        },

        actionEmplSearch = function (obj) {
            // obj is searchKeyNick from the form
            if (! obj) {
                obj = stack.getState();
            }
            console.log("Entering target 'actionEmplSearch' with argument", obj);
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
                        stack.push(
                            "simpleEmployeeBrowser",
                            {"set": rs, "pos": 0},
                            {"flag": true},
                        );
                    } else {
                        coreLib.displayError("Unexpected status code " + st.code);
                    }
                },
                // failure callback
                fc = function (st) {
                    console.log("AJAX: " + rest["path"] + " failed with", st);
                    coreLib.displayError(st.payload.message);
                };
            ajax(rest, sc, fc);
            coreLib.ajaxMessage();
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
            coreLib.displayResult('Masquerade is finished');
            $('input[name="sel"]').val('');
        },
        masqEmp = function (obj) {
            console.log("Entering masqEmp with object", obj);
            // if obj is empty, dA was selected from menu
            // if obj is full, it contains the employee to masquerade as
        
            if (currentEmployeeStashed) {
                endTheMasquerade();
                return;
            }

            var cu = currentUser('obj');

            if (! coreLib.isObjEmpty(obj)) {
                if (obj.nick === cu.nick) {
                    coreLib.displayResult('Request to masquerade as self makes no sense');
                    return;
                }
                // let the masquerade begin
                currentEmployeeStashed = $.extend({}, cu);
                backgroundColorStashed = $('#mainarea').css("background-color");
                currentUser('obj', obj);
                currentUser('flag1', 1); // turn on masquerade flag
                $('#userbox').html(appLib.fillUserBox()); // reset userbox
                $('#mainarea').css("background-color", "red");
                stack.unwindToFlag(); // return to most recent dmenu
                return;
            }
        
            // let the admin pick which user to masquerade as
            stack.push('searchEmployee', {}, {
                "xtarget": "mainEmpl"
            });
        },

        ldapLookupSubmit = function (obj) {
            var emp = obj;
            console.log("Entering function ldapLookupSubmit, object", emp);
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
                        console.log("Employee exists in LDAP");
                        console.log("Server said", st);
                        resetLdapEmployeeObject();
                        $.extend(ldapEmployeeObject, st.payload);
                    }
                    ldapEmployeeLink();
                },
                // failure callback -- employee doesn't exist
                fc = function (st) {
                    console.log("AJAX: " + rest["path"] + " failed with", st);
                    coreLib.displayError(st.payload.message);
                };
            ajax(rest, sc, fc);
            coreLib.ajaxMessage();
        },

        displayLdapEmployee = function (emp, xtarget) {
            // The user might cause the LDAP employee to be displayed 
            // several times in a row, e.g. by selecting LDAP sync from
            // ldapDisplayEmployee - make sure we don't push duplicate
            // ldapDisplayEmployee targets onto the stack!
            var topTarget = stack.getTarget().name;
            console.log("In displayLdapEmployee, topTarget is " + topTarget);
            if (topTarget === 'ldapDisplayEmployee') {
                stack.popWithoutStart();
            }
            stack.push('ldapDisplayEmployee', emp);
            stack.setXTarget(xtarget);
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
                        displayLdapEmployee(ldapEmployeeObject, 'ldapLookup');
                    }
                },
                fc = function (st) {
                    if (document.getElementById('ldapLookup') ||
                        document.getElementById('ldapDisplayEmployee')) {
                        displayLdapEmployee(ldapEmployeeObject, 'ldapLookup');
                    }
                }
            ajax(rest, sc, fc);
        },

        ldapSyncFromBrowser = function (obj) {
            ldapSync(obj);
        },

        ldapSync = function (ldapEmp) {
            if (! ldapEmp) {
                stack.getState();
            }
            console.log("Entered ldapSync with object", ldapEmp);
            if (! ldapEmp.nick) {
                return;
            }
            // ldapEmployeeObject = $.extend(
            //     Object.create(prototypes.ldapEmpObject),
            //     ldapEmp
            // );
            var bo,
                nick = ldapEmp.nick,
                stackTarget,
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
                    stackTarget = stack.getTarget().name;
                    console.log("Detected target ' + stackTarget + ' on top of stack");
                    if (stackTarget === 'ldapDisplayEmployee') {
                        ldapEmployeeLink();
                    } else if (stackTarget === 'simpleEmployeeBrowser') {
                        // FIXME: this code belongs in App::MFILE::WWW
                        bo = coreLib.dbrowserState.set[coreLib.dbrowserState.pos];
                        $.extend(coreLib.dbrowserState.obj, ldapEmployeeObject);
                        $.extend(bo, ldapEmployeeObject);
                        start.dbrowserListen("Employee profile updated from LDAP");
                    } else if (stackTarget === 'empProfile') {
                        stack.restart(
                            ldapEmployeeObject,
                            {"resultLine": "Employee profile updated from LDAP"},
                        );
                    }
                },
                // failure callback -- employee doesn't exist
                fc = function (st) {
                    var err = st.payload.code,
                        msg;
                    console.log("AJAX: " + rest["path"] + " failed with", st);
                    if (err === '404') {
                        msg = 'Employee ' + ldapEmp.nick + ' not found in LDAP';
                    } else {
                        msg = st.payload.message;
                    }
                    coreLib.displayError(msg);
                }
            ajax(rest, sc, fc);
            coreLib.ajaxMessage();
        },

        empProfileEditSave = function (emp) {
            var protoEmp = Object.create(prototypes.empProfile),
                employeeProfile,
                parentTarget;
            console.log("Entering empProfileEditSave with object", emp);
            $.extend(protoEmp, emp);
            var rest = {
                    "method": 'POST',
                    "path": 'employee/nick',
                    "body": protoEmp.sanitize()
                },
                sc = function (st) {
                    console.log("POST employee/nick returned status", st);
                    // what we do now depends on what targets are on the stack
                    // the target on the top of the stack will be "empProfileEdit"
                    // but the one below that can be either "empProfile" or
                    // "simpleEmployeeBrowser"
                    parentTarget = stack.getTarget(-1);
                    console.log("parentTarget", parentTarget);
                    employeeProfile = Object.create(prototypes.empProfile);
                    $.extend(employeeProfile, st.payload);
                    if (parentTarget.name === 'empProfile') {
                        console.log("Profile object is", employeeProfile);
                        currentUser('obj', employeeProfile);
                        stack.pop(employeeProfile, {"resultLine": "Employee profile updated"});
                    } else if (parentTarget.name === 'simpleEmployeeBrowser') {
                        console.log("Parent target is " + parentTarget.name);
                        console.log("current object in dbrowerState set",
                                    coreLib.dbrowserState.set[coreLib.dbrowserState.pos]);
                        $.extend(
                            coreLib.dbrowserState.set[coreLib.dbrowserState.pos],
                            employeeProfile
                        );
                        stack.pop(undefined, {"resultLine": "Employee profile updated"});
                    } else {
                        console.log("FATAL ERROR: unexpected parent target", parentTarget);
                    }
                },
                fc = function (st) {
                    console.log("AJAX: " + rest["path"] + " failed with", st);
                    coreLib.displayError(st.payload.message);
                };
            ajax(rest, sc, fc);
        };

    // here is where we define methods implementing the various
    // employee-related actions (see daction-start.js)
    return {
        getLdapEmployeeObject: getLdapEmployeeObject,
        resetLdapEmployeeObject: resetLdapEmployeeObject,
        myProfileAction: myProfileAction,
        empProfileEditSave: empProfileEditSave,
        ldapLookupSubmit: ldapLookupSubmit,
        ldapSync: ldapSync,
        ldapSyncFromBrowser: ldapSyncFromBrowser,
        actionEmplSearch: actionEmplSearch,
        endTheMasquerade: endTheMasquerade,
        masqEmployee: masqEmp,
    };

});

