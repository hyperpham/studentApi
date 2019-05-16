
var ViewModels = function () {
    var self = this;
    self.students = ko.observableArray([]);
    self.classes = ko.observableArray([]);
    self.error = ko.observable();

    var studentsUri = '/api/Students/';
    var classesUri = '/api/Class';

    function ajaxHelper(uri, method, data) {
        self.error(''); //clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null
        }).fail(function (jqXHR, textStatus, errorThrown) {
            self.error(errorThrown);
        });
    }

    // clear fields
    self.clearFields = function clearFields() {

        self.newStudent.CodeView('');
        self.newStudent.Name('');
        self.newStudent.BirthDay('');
        self.newStudent.Address('');
        self.newStudent.PhoneNumber('');
        self.newStudent.Class('');

    }

    self.getClasses = function getClass() {
        ajaxHelper(classesUri, 'GET').done(function (data) {
            self.classes(data);
            console.log(data);
        });
       
    }
    self.getClasses();
    var flag = "active";


    //get all
    self.getAll = function getAllStudents() {
        //$("#updateBT").hidden();
        flag = "all";
        $("#UpdateST").hide();
        $("#AddST").hide();
        
        ajaxHelper(studentsUri + "?a=2" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val(), 'GET').done(function (data) {
            self.students(data);
            //$(".abcxyz").css("visibility", "hidden");
            $(".updateBT").remove();
            $(".removeBT").remove();
            $(".activeBT").remove();
            console.log(data);
        });
      
    }
    //get active
    self.getActive = function getactiveStudents() {
        flag = "active";
        $("#UpdateST").hide();
        $("#AddST").hide();
        ajaxHelper(studentsUri + "?a=1" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val(), 'GET').done(function (data) {
            self.students(data);
            $(".activeBT").remove();
        });
    }
    
    self.getActive();
    //get removed
    self.getDeleted = function getremovedStudents() {
        flag = "removed";
        $("#UpdateST").hide();
        $("#AddST").hide();
        ajaxHelper(studentsUri + "?a=1" + "&isDelete=true" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val(), 'GET').done(function (data) {
            self.students(data);
            //$(".btn-success").css("visibility", "hidden");

            $(".removeBT").remove();
            $(".updateBT").remove();
        });
    }
        
    self.getList = function searchingST() {
        if (flag === "all") {
            $("#activeBT").show();
            ajaxHelper(studentsUri + "?a=2" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val() , 'GET').done(function (data) {
                self.students(data);
            });
        }
        if (flag === "active") {
            ajaxHelper(studentsUri + "?a=1" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val(), 'GET').done(function (data) {
                self.students(data);
            });
        }
        if (flag === "removed") {
            ajaxHelper(studentsUri + "?a=1" + "&isDelete=true" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val(), 'GET').done(function (data) {
                self.students(data);
            });
        }     
    }
    self.newClass = {
        Id: ko.observable(),
        CodeView: ko.observable(),
        Name: ko.observable(),
        IsDelete: false
    }

    //Data
    self.newStudent = {
        Id: ko.observable(),
        CodeView: ko.observable(),
        Name: ko.observable(),
        Genre: ko.observable(),
        BirthDay: ko.observable(),
        Address: ko.observable(),
        PhoneNumber: ko.observable(),
        Class: ko.observable(),
        IsDelete: false
    }
    //Create student
    self.AddStudent = function (formElement) {
        
        var student = {
            CodeView: self.newStudent.CodeView(),
            Name: self.newStudent.Name(),
            Genre: self.newStudent.Genre(),
            BirthDay: self.newStudent.BirthDay(),
            Address: self.newStudent.Address(),
            PhoneNumber: self.newStudent.PhoneNumber(),
            ClassesId: self.newStudent.Class()
        };
            ajaxHelper(studentsUri, 'POST', student).done(function (item) {
                self.students.push(item);
                self.clearFields();
                $("#AddST").hide();
            });       
    }
    //Remove student
    self.removeStudent = function (item) {
        var student = {
            Id: item.id,
            CodeView: item.codeView,
            Name: item.name,
            Genre: item.genre,
            BirthDay: item.birthDay,
            Address: item.address,
            PhoneNumber: item.phoneNumber,
            ClassesId: item.classesId,           
            IsDelete: true
        };
        if (flag === "removed") {
            var note = alert("Sinh vien da bi remove!");
        } else
        ajaxHelper(studentsUri + item.id, 'PUT', student).done(function () {
            self.getActive();
        });
    }
    //Active student
    self.acctiveStudent = function (item) {
        var student = {
            Id: item.id,
            CodeView: item.codeView,
            Name: item.name,
            Genre: item.genre,
            BirthDay: item.birthDay,
            Address: item.address,
            PhoneNumber: item.phoneNumber,
            ClassesId: item.classesId,
            IsDelete: false
        };
        if (flag === "active") {
            var note = alert("Sinh vien dang active!");
        } else
        ajaxHelper(studentsUri + item.id, 'PUT', student).done(function () {
            self.getDeleted();
        });
    }
    //Delete student
    self.deleteStudent = function (item) {
        var note = confirm("Are you sure?");
        console.log(item.id);
        if (note === true) {
            ajaxHelper(studentsUri + item.id, 'DELETE').done(function () {
                getAllStudents();
            })
        } else return getAllStudents();
    }
    //Get data to input
    self.updateData = function (item) {
        console.log(formatDay1(item.birthDay));
        console.log(self.newStudent.BirthDay(item.birthDay));
        document.getElementById("code").disabled = true;
        $("#actionAdd").hide();
        $("#actionUpd").show();
        $("#actionUpd").show();
            self.newStudent.Id(item.id),
            self.newStudent.CodeView(item.codeView),
            self.newStudent.Name(item.name),
            self.newStudent.Genre(item.genre),
                self.newStudent.BirthDay(formatDay1(item.birthDay)),
            self.newStudent.Address(item.address),
            self.newStudent.PhoneNumber(item.phoneNumber),
            self.newStudent.Class(item.classesId)
    }

    //Update students
    self.updateStudent = function () {
        var student = {
            Id: self.newStudent.Id(),
            CodeView: self.newStudent.CodeView(),
            Name: self.newStudent.Name(),
            Genre: self.newStudent.Genre(),
            BirthDay: self.newStudent.BirthDay(),
            Address: self.newStudent.Address(),
            PhoneNumber: self.newStudent.PhoneNumber(),
            ClassesId: self.newStudent.Class()
        };
        ajaxHelper(studentsUri + student.Id, 'PUT', student).done(function () {
            self.clearFields();
            $("#myModal").modal("hide");
            $("#AddST").hide();
            if (flag = "active") {
                self.getActive();
            }
        });
    }


};
    
$(document).ready(function () {
    $("#search").hide();
    var vm = new ViewModels();
    $("#btnSearch").click(function () {
        $("#search").show();
    });




    $("#btnAdd").click(function () {
        undisableTxt();
        $("#actionAdd").show();
        $("#actionUpd").hide();
        vm.clearFields();
        cleanerror();
        checkReady()
    });

    $("#Add").click(function () {
        $("#AddST").toggle();
        $("#actionUpd").hide();
        $("#actionAdd").show();
    });
    $("#actionCancel2").click(function () {
        $("#UpdST").hide();
    });
    $("#actionCancel").click(function () {
        $("#AddST").hide();
    });
    ko.applyBindings(vm);


    $("#searchN").keyup(function () {
        vm.getList();

    });
    $("#searchA").keyup(function () {
        vm.getList();

    });
    $("#searchD").keyup(function () {
        vm.getList();

    });

    $("#actionCancel").click(function () {
        cleanerror();
    });
});

function disableTxt() {
    document.getElementById("code").disabled = true;
}
function undisableTxt() {
    document.getElementById("code").disabled = false;
}

function formatDay(birthday) {
    var date = new Date(birthday);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var d = month + "/" + day + "/" + year;
    return d;
}
function formatDay1(birthday) {
    var date = new Date(birthday);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var d = year + "-" + month + "-" + day;
    return d;
}
function checkname() {
    //check tên
    var name = document.getElementById("fullname").value;
    var n = name.length;
    var comment = "This is a comment\nAnother comment\nOne more\nLast";
    if (n < 5) {
        document.getElementById("errorname").innerHTML = "Vui lòng nhập họ tên có từ sáu kí tự trở lên!" + "<br />";
    }
    else {
        document.getElementById("errorname").innerHTML = "";
    }
    checkReady();
}
function checkcode() {
    //check tên
    var codeview = document.getElementById("code").value;
    var n = codeview.length;

    if (n < 8 || n > 8) {
        document.getElementById("errorcode").innerHTML = "Bạn phải nhập vào 8 kí tự!";
    }
    else {
        document.getElementById("errorcode").innerHTML = "";
    }
    checkReady();
}
function checksdt() {
    var phonenumber = document.getElementById("phonenumber").value;
    var sdt = phonenumber.length;
    if (isNaN(phonenumber)) {
        document.getElementById("errorphonenumber").innerHTML = "Số điện thoại chỉ chứa số!";
    }
    else if (sdt < 10 || sdt > 11) {
        document.getElementById("errorphonenumber").innerHTML = "Số điện thoại  từ 10 đến 11 số";
    } else {
        document.getElementById("errorphonenumber").innerHTML = "";
    }
    checkReady();
}

//function checkemail() {
//    var email = document.getElementById("email").value;
//    var acong = email.indexOf('@');
//    var daucham = email.lastIndexOf('.');
//    var dodai = email.length - 1;
//    var daucach = email.indexOf(' ');
//    if (acong < 1 || dodai <= 5 || daucham <= acong + 1 || daucach > 0) {
//        document.getElementById("erroremail").innerHTML = "Email chưa hợp lệ!";
//    } else {
//        document.getElementById("erroremail").innerHTML = "";
//    }
//    checkbutton();
//}
//function checkpass() {
//    var pass1 = document.getElementById("password1").value;
//    var pass2 = document.getElementById("password2").value;
//    var p = pass1.length;
//    if (p < 6) {
//        document.getElementById("errorpassword1").innerHTML = "Vui lòng nhập mật khẩu có từ sáu kí tự trở lên!";
//    }
//    else {
//        document.getElementById("errorpassword1").innerHTML = "";
//        checkpass2();
//        checkbutton();
//    }

//}
//function checkpass2() {
//    var pass1 = document.getElementById("password1").value;
//    var pass2 = document.getElementById("password2").value;
//    if (pass1 != pass2) {
//        document.getElementById("errorpassword2").innerHTML = "Mật khẩu chưa khớp";
//    }
//    else {
//        document.getElementById("errorpassword2").innerHTML = "";
//    }
//    checkbutton();

//}

function cleanerror() {
    document.getElementById("errorcode").innerHTML = "";
    document.getElementById("errorname").innerHTML = "";
    document.getElementById("errorphonenumber").innerHTML = "";
}
//function check() {
//    var check = document.getElementById("checkbox").checked;
//    if (check == true) {
//        checkbutton();
//    } else
//        checkbutton();
//}


function checkReady() {
    var code = document.getElementById("code").value;
    var name = document.getElementById("fullname").value;
    var phonenumber = document.getElementById("phonenumber").value;
    var errorname = document.getElementById("errorname").innerHTML;
    var errorcode = document.getElementById("errorcode").innerHTML;
    var errorphonenumber = document.getElementById("errorphonenumber").innerHTML;
    if (code != "" && name != "" && phonenumber != "" && errorname == "" && errorcode == "" && errorphonenumber == "") {
        document.getElementById("actionAdd").disabled = false;
    }
    else
        document.getElementById("actionAdd").disabled = true;
}

//function checkbutton() {
//    var name = document.getElementById("fullname").value;
//    var email = document.getElementById("email").value;
//    var phone = document.getElementById("phonenumber").value;
//    var pass1 = document.getElementById("password1").value;
//    var pass2 = document.getElementById("password2").value;
//    var address = document.getElementById("address").value;
//    var errorname = document.getElementById("errorname").innerHTML;
//    var erroremail = document.getElementById("erroremail").innerHTML;
//    var errorpassword1 = document.getElementById("errorpassword1").innerHTML;
//    var errorpassword2 = document.getElementById("errorpassword2").innerHTML;
//    var errorphonenumber = document.getElementById("errorphonenumber").innerHTML;
//    var check = document.getElementById("checkbox").checked;
//    if (name != "" && email != "" && phone != "" && pass1 != "" && pass2 != "" && address != "" && errorname == "" && erroremail == "" && errorphonenumber == "" && errorpassword1 == "" && errorpassword2 == "" && check == true) {
//        document.getElementById("continue").disabled = false;
//    }
//    else
//        document.getElementById("continue").disabled = true;
//}
function newaction() {
    alert("Thành công!");
}