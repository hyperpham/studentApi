
var ViewModels = function () {
    var self = this;
    self.students = ko.observableArray([]);
    self.classes = ko.observableArray([]);
    self.error = ko.observable();

    var studentsUri = '/api/Students/';
    var classesUri = '/api/Class';

    function ajaxFunction(uri, method, data) {
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
    //var formatDate = function () {
    //    return moment(this.ngaysinh).format("dd/mm/yyyy");
    //}
    self.clearFields = function clearFields() {
        self.newStudent.CodeView('');
        self.newStudent.Name('');
        self.newStudent.BirthDay('');
        self.newStudent.Address('');
        self.newStudent.PhoneNumber('');
        self.newStudent.Class('');

    }

    var flag = "active";


    //get all
    self.getAll = function getAllStudents() {
        flag = "all";
        $("#UpdateST").hide();
        $("#AddST").hide();
        ajaxHelper(studentsUri + "?a=2" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val(), 'GET').done(function (data) {
            self.students(data);
        });

    }
    //get active
    self.getActive = function getactiveStudents() {
        flag = "active";
        $("#UpdateST").hide();
        $("#AddST").hide();
        ajaxHelper(studentsUri + "?a=1" + "&searchName=" + $("#searchN").val() + "&searchAdd=" + $("#searchA").val() + "&searchDay=" + $("#searchD").val(), 'GET').done(function (data) {
            self.students(data);
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
        });
    }
        
    self.getList = function searchingST() {
        if (flag === "all") {
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

        ajaxHelper(studentsUri + item.id, 'PUT', student).done(function () {
            getactiveStudents();
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

        ajaxHelper(studentsUri + item.id, 'PUT', student).done(function () {
            getremovedStudents();
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
    //Get data
    self.updateData = function (item) {
        $("#AddST").toggle();
        $("#actionAdd").hide();
        $("#actionUpd").show();
        self.newStudent.Id(item.id),
            self.newStudent.CodeView(item.codeView),
            self.newStudent.Name(item.name),
            self.newStudent.Genre(item.genre),
            self.newStudent.BirthDay(item.birthDay),
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
            getactiveStudents();
            self.clearFields();
            $("#AddST").hide();
        });

    }

    
};
    
$(document).ready(function () {
    $("#UpdateST").hide();

    var vm = new ViewModels();
    $("#AddST").hide();

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


    $("#searchN").change(function () {
        vm.getList();

    });
    $("#searchA").change(function () {
        vm.getList();

    });
    $("#searchD").change(function () {
        vm.getList();

    });
});

function checkname() {
    //check tên
    var name = document.getElementById("fullname").value;
    var n = name.length;
    if (n < 5) {
        document.getElementById("errorname").innerHTML = "Vui lòng nhập họ tên có từ sáu kí tự trở lên!";
    }
    else {
        document.getElementById("errorname").innerHTML = "";
    }
}
