window.onload = function () {
    $('#startGame').click(function () {

        var name = $('#startGame').value();
        console.log(name);

        window.localStorage.setItem('name', name);

        return true;
    });
};