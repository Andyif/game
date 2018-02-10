var Payers = {};



Payers.getPlayers = function () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            Payers.activePlayers = JSON.parse(xhttp.responseText);
            Payers.clearPlayersList();
            Payers.displayPayers();
        }
    };
    xhttp.open("GET", "show_active", true);
    xhttp.send();
};

Payers.displayPayers = function () {
    for (ap in Payers.activePlayers) {
        var payersElement = $('#players');
        payersElement.append("<li><label><input type=\"checkbox\">" + Payers.activePlayers[ap] + "</label></li>");
    }
};

Payers.clearPlayersList = function () {
    var playersToRemove = $('#players li');
    if (0 < playersToRemove.length) {
        for (i = 0; i < playersToRemove.length; i++) {
            playersToRemove[i].parentElement.removeChild(playersToRemove[i]);
        }
    }
};