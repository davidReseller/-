const _Database = {
    checkUser: function(database, email, phone, callBack) {
        var dbTestRef = database.ref("user/");
        dbTestRef.once("value").then(function(snapshot) {
            const data = snapshot.val();
            for (let key in data) {
                if (
                    data[key]["email"] === email &&
                    data[key]["telephone"] === phone
                ) {
                    callBack(database, email, phone);
                } else {
                    alert("유저 정보가 정확하지 않습니다.");
                    location.href = "./home.html";
                }
            }
        });
    },

    getUserProduct: function(database, email, phone, callBack) {
        const result = new Array();
        var dbTestRef = database.ref("product/");
        dbTestRef.once("value").then(function(snapshot) {
            const data = snapshot.val();
            for (let key in data) {
                for (let idx in data[key]["user"]) {
                    if (
                        data[key]["user"][idx]["email"] === email &&
                        data[key]["user"][idx]["telephone"] === phone
                    ) {
                        result.push({
                            serial: data[key]["serial"],
                            type: data[key]["type"]
                        });
                    }
                }
            }
            callBack(result);
        });
    }
};

let load = {
    load: function() {
        _Database.checkUser(
            firebase.database(),
            this.getUrlParams("uEmail").replace("%40", "@"),
            this.getUrlParams("uPhone"),
            this.successCheckingUser
        );
    },

    getUrlParams: function(sname) {
        var params = location.search.substr(location.search.indexOf("?") + 1);

        var sval = "";

        params = params.split("&");

        for (var i = 0; i < params.length; i++) {
            temp = params[i].split("=");

            if ([temp[0]] == sname) {
                sval = temp[1];
            }
        }

        return sval;
    },

    successCheckingUser: function(database, email, phone) {
        _Database.getUserProduct(database, email, phone, load.setUserProduct);
    },

    setUserProduct: function(data) {
        if (data.length <= 0) {
            alert("현재 가지고 있는 제품이 없습니다.");
            alert("관리자에게 문의해 주세요");
            location.href = "./home.html";
        }

        const formArr = new Array();

        for (let idx in data) {
            const form =
                `<div class="form-group form-group-detail" onClick="load.copySerial('${data[idx]["serial"]}')">` +
                `   <div style="width: 100%; height: 100%; display: flex; flex-direction: column; padding: 16px 0px 16px 14px;">` +
                `       <div style="display: flex; align-items: center; margin-bottom: 10px;">` +
                `          <div style="width: 200px; float: left; font-size: 20px; font-weight: bold;">` +
                `             <span>SW Type Name</span>` +
                `          </div>` +
                `          <div style="height: 100%; display: flex;">` +
                `              <span>${data[idx]["type"]}</span>` +
                `          </div>` +
                `       </div>` +
                `       <div style="display: flex; align-items: center;">` +
                `          <div style="width: 200px; float: left; font-size: 20px; font-weight: bold;">` +
                `              <span>SW Serial Number</span>` +
                `          </div>` +
                `          <div style="width: calc(100% - 200px);">` +
                `              <span>${data[idx]["serial"]}</span>` +
                `               <input type="text" class="serial" data-serial="${data[idx]["serial"]}" value="${data[idx]["serial"]}" readonly/>` +
                `          </div>` +
                `       </div>` +
                `   </div>` +
                `</div>`;
            formArr.push(form);
        }

        $("#products").append(formArr.join("<hr />"));
    },

    copySerial: function(serial) {
        $(`.serial[data-serial="${serial}"]`).select();
        document.execCommand("copy");
        alert("Serial 번호 복사 완료");
    }
};

$(document).ready(function() {
    load.load();
});
