console.log( "window loaded" );




document.addEventListener('DOMContentLoaded', function(){

    let cookie_players_name = "players";

    let cookie_deactivated_players_name = "deactivated_players";

    let cookie_games_name = "games";

    const table = document.getElementById('players_table')
    const triplets_div = document.getElementById('available_triplets')
    const used_triplets_div = document.getElementById('used_triplets')

    let players = []
    let deactivated_players = []

    let games = []


    function setValues(){
        players = []
        deactivated_players = []
        games = []


        let cookie_players = getCookie(cookie_players_name);

        let cookie_deactivated_players = getCookie(cookie_deactivated_players_name);

        let cookie_games = getCookie(cookie_games_name);

        if (typeof cookie_players !==  'undefined' && cookie_players !==  'undefined') {
            players = cookie_players.split(",")
        }
        if (typeof cookie_deactivated_players !==  'undefined' && cookie_deactivated_players !==  'undefined') {
            deactivated_players = cookie_deactivated_players.split(",")
        }

        console.log("cookie_games ", cookie_games)
        if (typeof cookie_games !==  'undefined' && cookie_games !==  'undefined') {
            for (let g of cookie_games.split("|||")) {
                let game = g.split(",")
                if (game.length > 2){
                    games.push(game)
                }

            }

        }

        console.log("games ", games)

        //deactivated_players = ["B", "C"]
//
        //games   = [
        //    ["A","B","D"],
        //    ["A","E","G"],
        //    ["A","C","H"]
        //]
    }

    function createTable(){


        let table_header = '<div class="row">'
        for (let i = -1; i < players.length; i++) {
            let cell = ''
            if (i !== -1) {
                cell = `<div class="cell_value header">${players[i]}</div>`
            } else {
                cell = `<div class="cell_value name inactive"></div>`
            }

            table_header += cell
        }
        table_header += '</div>'

        let table_body = ''
        for (let i = 0; i < players.length; i++) {
            const current_player = players[i]
            let row = '<div class="row">'

            let cell = `
                <div class="cell_value name">   
                    <label class="cl-switch">
                            <input class="btn_deactivate" data-player="${current_player}" type="checkbox" ${deactivated_players.includes(current_player) ? '' : 'checked'}>
                            <span class="switcher"></span>
                            <span class="label">${current_player}</span>
                    </label> 
                    <img data-player="${current_player}"  class="btn_delete" src="img/close.svg"/>
                </div>`
            row += cell

            for (let a = 0; a < players.length  ; a++) {
                if (current_player == players[a]) {
                    cell = `<div class="cell_value inactive"></div>`
                } else {
                    const p = [current_player, players[a]].sort()
                    cell = `<div class="cell_value"  data-p1="${p[0]}" data-p2="${p[1]}"></div>`
                }
                row += cell
            }

            table_body += row + '</div>'
        }


        table.innerHTML = table_header
        table.innerHTML += table_body


        Array.from(table.getElementsByClassName('btn_deactivate')).forEach(function(element) {
            element.addEventListener('click', btnDeactivate);
        })
        Array.from(table.getElementsByClassName('btn_delete')).forEach(function(element) {
            element.addEventListener('click', btnDelete);
        })
    }

    function btnDeactivate(){
        const current_state = this.checked
        const player = this.getAttribute("data-player")
        if (current_state){
            var index = deactivated_players.indexOf(player);
            if (index !== -1) {
                deactivated_players.splice(index, 1);
            }
        } else {
            deactivated_players.push(player)

        }
        setCookie(cookie_deactivated_players_name, deactivated_players.join(","))
        console.log("deactivated_players ", deactivated_players)
        setTimeout(function () {
            start()
        }, 500);
    }
    function btnDelete(){
        const player = this.getAttribute("data-player")
        var index = players.indexOf(player);
        if (index !== -1) {
            players.splice(index, 1);
        }
        setCookie(cookie_players_name, players.join(","))

        setTimeout(function () {
            start()
        }, 500);
    }

    function drawGames(){


        for (let game of games) {
            //console.log("game ", game)


            const pairs = [
                [game[0], game[1]],
                [game[0], game[2]],
                [game[1], game[2]]
            ]

           // console.log("Pairs ", pairs)
            for (let pair of pairs) {

              //  console.log("Pair ", pair)
                const cells = table.querySelectorAll(`[data-p1="${pair[0]}"][data-p2="${pair[1]}"]`)

                Array.from(cells).forEach(function(cell) {
                    cell.classList.add("active")
                })
            }

        }
    }

    function getPossibleTriplets(){

        let available_triplets = []
        let player_1 = ''
        let player_2 = ''
        let player_3 = ''

        for (let p1 = 0; p1 < players.length; p1++) {
            player_1 = players[p1]

            for (let p2 = players.indexOf(player_1) + 1; p2 < players.length; p2++) {
                player_2 = players[p2]

                for (let p3 = players.indexOf(player_2) + 1; p3 < players.length; p3++) {
                    player_3 = players[p3]

                    if (gamesContainsThis([player_1, player_2, player_3]) == false) {
                        if (deactivated_players.includes(player_1) == false &&
                            deactivated_players.includes(player_2) == false &&
                            deactivated_players.includes(player_3) == false
                        ) {
                            available_triplets.push([player_1, player_2, player_3])
                        }
                    }
                }
            }
        }



        let triplet_html = '<div id="btn_delete_last">Undo</div>'
        for (let triplet of available_triplets) {
            triplet_html += `<div class="triplet" data-triplet='${triplet.toString()}'>${triplet.toString()}</div>`
        }

        triplet_html += `<div id="btn_delete_games">Обнулить</div>`
        triplets_div.innerHTML = triplet_html


        document.getElementById('games_played')   .innerText = `Сыграно: ${games.length}`
        document.getElementById('games_available').innerText = `Доступно: ${available_triplets.length}`


        Array.from(triplets_div.getElementsByClassName('triplet')).forEach(function(triplet) {
            triplet.addEventListener('click', clickTriplet);
        })

        document.getElementById('btn_delete_games').addEventListener('click', () => {
            games = []
            setCookie(cookie_games_name, '')
            start()
        })
        document.getElementById('btn_delete_last').addEventListener('click', () => {

            if (games.length > 0) {
                games.pop()
                let games_string = ''
                for (let game of games) {
                    games_string += game.toString() + '|||'
                }
                setCookie(cookie_games_name, games_string)
                start()
            }
        })
    }
    function setUsedTriplets(){

        let triplet_html = ''
        for (let game of games) {
            triplet_html += `<div class="triplet">${game.toString()}</div>`
        }
        used_triplets_div.innerHTML = triplet_html
    }


    function clickTriplet(){
        console.log("this triplet ", typeof this.getAttribute('data-triplet').split(","))
        const triplet = this.getAttribute('data-triplet').split(",")
        games.push(triplet)


        let games_string = ''
        for (let game of games) {
            games_string += game.toString() + '|||'
        }
        setCookie(cookie_games_name, games_string)
        start()
    }

    document.getElementById('btn_all_off').addEventListener('click', () => {
        deactivated_players = [...players]
        setCookie(cookie_deactivated_players_name, deactivated_players.join(","))
        start()
    })
    document.getElementById('btn_all_on').addEventListener('click', () => {
        deactivated_players = []
        setCookie(cookie_deactivated_players_name, deactivated_players.join(","))
        start()
    })

    document.getElementById('btn_add_player').addEventListener('click', () => {
        let player = document.getElementById('input_player_name').value
        if (player === '') {
            alert("Напишите имя игрока")
            return
        }
        if (players.includes(player)) {
            alert("Такой игрок уже есть")
            return
        }

        if (player.includes(",")) {
            players = player.split(",")
            setCookie(cookie_games_name, '')
        } else {
            players.push(player)
        }

        players = players.sort()

        console.log("players ", players)
        setCookie(cookie_players_name, players.join(","))


        document.getElementById('input_player_name').value = ''


        setTimeout(function () {
            start()
        }, 500);

    })



    start()
    function start(){

        setValues()
        createTable()
        drawGames()

        getPossibleTriplets()
        setUsedTriplets()



        document.getElementById('load_container').style.display = 'none'
        document.getElementById('main_page').style.display = 'block'
    }


    function gamesContainsThis(check_game){
        let contains = false
        for (let game of games) {
           if (game.includes(check_game[0]) && game.includes(check_game[1])) {
               contains = true
               break
           }
           if (game.includes(check_game[0]) && game.includes(check_game[2])) {
               contains = true
               break
           }
           if (game.includes(check_game[1]) && game.includes(check_game[2])) {
               contains = true
               break
           }

        }

        return contains
    }





    function setCookie(name, value, days = 3600) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function deleteCookie( name ) {
        document.cookie = name + '=undefined; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    }

});
