let load = {
    load: function() {
        this.observeTel();
    },

    observeTel: function() {
        $("#uPhone").on("keyup", function(e) {
            var regNumber = /^[0-9]*$/;
            var temp = $("#uPhone").val();
            if (!regNumber.test(temp)) {
                $("#uPhone").val(temp.replace(/[^0-9]/g, ""));
            }
        });
    }
};

$(document).ready(function() {
    load.load();
});
