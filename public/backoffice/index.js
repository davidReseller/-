const limitNumber = 3;

const _database = {
    database: null,
    user: {},
    product: {},
    init: function() {
        this.database = firebase.database();
    },

    // 유저 데이터를 가져옵니다.
    getUserData: function(callBack) {
        var dbTestRef = this.database.ref("user/");
        dbTestRef.once("value").then(function(snapshot) {
            const data = snapshot.val();
            _database.user = data;
            callBack(data);
        });
    },

    // 제품 데이터를 가져옵니다.
    getProductData: function(callBack) {
        var dbTestRef = this.database.ref("product/");
        dbTestRef.once("value").then(function(snapshot) {
            const data = snapshot.val();
            _database.product = data;
            callBack(data);
        });
    },

    // 유저 정보에 해당하는 키 값을 찾는 기능
    getUserKey: function(email, phoneNumber) {
        let key = null;

        for (let k in this.user) {
            if (
                email === this.user[k]["email"] &&
                phoneNumber === this.user[k]["telephone"]
            ) {
                key = k;
                break;
            }
        }

        return key;
    },

    // 유저 정보를 업데이트 하는 기능
    updateUserInfo: function(
        oldEmail,
        oldPhoneNumber,
        newEmail,
        newPhoneNumber
    ) {
        let updateData = {};
        const key = this.getUserKey(oldEmail, oldPhoneNumber);

        if (newEmail !== oldEmail) {
            updateData["email"] = newEmail;
        }

        if (newPhoneNumber !== oldPhoneNumber) {
            updateData["telephone"] = newPhoneNumber;
        }

        if (key !== null || updateData !== {}) {
            this.database
                .ref(`user/${key}`)
                .update(updateData, function(error) {
                    if (error) {
                        alert(error);
                        console.error(error);
                    } else {
                        alert("데이터 업데이트 완료");
                        location.reload();
                    }
                });
        } else {
            alert("변경사항이 없거나 Key값이 존재하지 않음");
        }
    },

    // 유저를 삭제하는 기능
    deleteUserInfo: function(email, phoneNumber) {
        const key = this.getUserKey(email, phoneNumber);

        if (key !== null) {
            this.database.ref(`user/${key}`).remove(function(error) {
                if (error) {
                    alert(error);
                    console.error(error);
                } else {
                    alert("유저 삭제 완료");
                    location.reload();
                }
            });
        } else {
            alert("Key값이 존재하지 않음");
        }
    },

    // 유저를 추가하는 기능
    addUserInfo: function(email, phoneNumber) {
        console.log(email, phoneNumber);

        const data = {};
        data["email"] = email;
        data["telephone"] = phoneNumber;

        this.database.ref(`user/`).push(data, function(error) {
            if (error) {
                alert(error);
                console.error(error);
            } else {
                alert("유저 추가 완료");
                location.reload();
            }
        });
    }
};

const load = {
    load: function() {
        // $("#editUserModal").addClass("active");
        _database.init();
        _database.getUserData(this.setUserData);
        _database.getProductData(this.setProductData);
        this.listenAddUser();
    },

    listenAddUser: function() {
        const self = this;
        $("#addUser").click(function() {
            self.addUserInfo();
        });
    },

    setUserData: function(data) {
        const formArr = new Array();
        for (let key in data) {
            const form =
                `<tr>` +
                `    <td>${data[key]["email"]}</td>` +
                `    <td>${data[key]["telephone"]}</td>` +
                `    <td>` +
                `        <button onclick="load.changeUserInfo('${data[key]["email"]}', '${data[key]["telephone"]}')">변경</button>` +
                `    </td>` +
                `    <td>` +
                `        <button onclick="load.deleteUser('${data[key]["email"]}', '${data[key]["telephone"]}')">삭제</button>` +
                `    </td>` +
                `</tr>`;
            formArr.push(form);
        }
        $("#userTableData").empty();
        $("#userTableData").append(formArr.join(""));
    },

    changeUserInfo: function(email, phoneNumber) {
        const self = this;

        $("#uEmail").val(email);
        $("#uPhone").val(phoneNumber);
        $("#editUserModal").addClass("active");

        $("#editUserModal .cancel > button, #editUserModal .closeBtn").click(
            function() {
                self.cancelUserModal();
            }
        );

        $("#editUserModal .confirm > button").click(function() {
            const newEmail = $("#uEmail").val();
            const newPhoneNumber = $("#uPhone").val();
            _database.updateUserInfo(
                email,
                phoneNumber,
                newEmail,
                newPhoneNumber
            );
            self.cancelUserModal();
        });
    },

    addUserInfo: function() {
        const self = this;

        $("#uEmail").val(null);
        $("#uPhone").val(null);
        $("#editUserModal").addClass("active");

        $("#editUserModal .cancel > button, #editUserModal .closeBtn").click(
            function() {
                self.cancelUserModal();
            }
        );

        $("#editUserModal .confirm > button").click(function() {
            const newEmail = $("#uEmail").val();
            const newPhoneNumber = $("#uPhone").val();
            _database.addUserInfo(newEmail, newPhoneNumber);
            self.cancelUserModal();
        });
    },

    cancelUserModal: function() {
        $("#editUserModal").removeClass("active");
        $("#uEmail").val(null);
        $("#uPhone").val(null);
    },

    deleteUser: function(email, phoneNumber) {
        if (confirm("진짜로 해당 유저를 삭제할 껍니까??")) {
            _database.deleteUserInfo(email, phoneNumber);
        }
    },

    setProductData: function(data) {
        const formArr = new Array();
        for (let key in data) {
            let form =
                `<tr>` +
                `    <td rowspan="${limitNumber}">${data[key]["type"]}</td>` +
                `    <td rowspan="${limitNumber}">${data[key]["serial"]}</td>` +
                `    <td>${
                    data[key]["user"][0]["email"]
                        ? data[key]["user"][0]["email"]
                        : "비어있음"
                }</td>` +
                `    <td>${
                    data[key]["user"][0]["telephone"]
                        ? data[key]["user"][0]["telephone"]
                        : "비어있음"
                }</td>` +
                `    <td rowspan="${limitNumber}">` +
                `        <button onClick="load.addUser()">테스트</button>` +
                `    </td>` +
                `    <td rowspan="${limitNumber}">` +
                `        <button>테스트</button>` +
                `    </td>` +
                `</tr>`;

            for (let i = 1; i < limitNumber; i++) {
                if (data[key]["user"][i]) {
                    form +=
                        `<tr>` +
                        `    <td>${data[key]["user"][i]["email"]}</td>` +
                        `    <td>${data[key]["user"][i]["telephone"]}</td>` +
                        `</tr>`;
                } else {
                    form +=
                        `<tr>` +
                        `    <td>${"비어있음"}</td>` +
                        `    <td>${"비어있음"}</td>` +
                        `</tr>`;
                }
            }

            console.log(form);
            formArr.push(form);
        }
        $("#productTableData").empty();
        $("#productTableData").append(formArr.join(""));
    },

    addUser: function() {}
};

$(document).ready(function() {
    load.load();
});
