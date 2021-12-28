console.log( "window loaded" );




document.addEventListener('DOMContentLoaded', function(){

    let cookie_players_name = "players";



    const create_progress = document.getElementById('create_progress_val')

    Array.from(document.getElementsByClassName("btn_next")).forEach(function(element) {
        const current_step = parseInt(element.getAttribute("data-step"))
        const next_step = current_step + 1

        const parent = document.getElementById(`div_step_${current_step}`)
        const next = document.getElementById(`div_step_${next_step}`)
        const progress = parseInt(100 * next_step / 12)


        element.addEventListener('click', () => {
            parent.style.display = 'none'
            next.style.display = 'block'

            console.log("progress", progress)
            create_progress.style.width = progress + "%"
            create_progress.setAttribute("aria-valuenow", progress)
        })
    })

    Array.from(document.getElementsByClassName("btn_back")).forEach(function(element) {
        const current_step = parseInt(element.getAttribute("data-step"))
        const next_step = current_step - 1

        const parent = document.getElementById(`div_step_${current_step}`)



        if (current_step > 1) {
            const prev = document.getElementById(`div_step_${next_step}`)
            const progress = parseInt(100 * next_step / 12)

            element.addEventListener('click', () => {
                create_progress.style.width = progress + "%"
                create_progress.setAttribute("aria-valuenow", progress)

                parent.style.display = 'none'
                prev.style.display   = 'block'
            })
        }


    })





    let interest_area = []
    Array.from(document.getElementsByClassName("interest_area")).forEach(function(element) {
        element.addEventListener('click', addInterestArea );

    })
    function addInterestArea(){
        const current_value = this.getAttribute("data-value")

        const clone = this.cloneNode(true)
        document.getElementById('interest_area_result').before(clone)

        interest_area.push(current_value)
        this.style.display = 'none'
    }

    document.getElementById('btn_interest_again').addEventListener('click', () => {
        interest_area = []
        Array.from(document.getElementsByClassName("interest_area")).forEach(function(element) {
            element.style.display = 'block'
        })

        const container = document.getElementById('interest_area_result').parentElement

        Array.from(container.getElementsByClassName("interest_area")).forEach(function(element) {
            element.style.display = 'none'
        })
    })



    let love_lang = []
    Array.from(document.getElementsByClassName("love_lang")).forEach(function(element) {
        element.addEventListener('click', addLoveLang );

    })
    function addLoveLang(){
        const current_value = this.getAttribute("data-value")
        const clone = this.cloneNode(true)

        document.getElementById('love_lang_result').before(clone)

        love_lang.push(current_value)
        this.style.display = 'none'
    }

    document.getElementById('btn_love_lang_again').addEventListener('click', () => {
        love_lang = []
        Array.from(document.getElementsByClassName("love_lang")).forEach(function(element) {
            element.style.display = 'block'
        })

        const container = document.getElementById('love_lang_result').parentElement
        Array.from(container.getElementsByClassName("love_lang")).forEach(function(element) {
            element.style.display = 'none'
        })
    })




    start()
    function start(){

        document.getElementById('load_container').style.display = 'none'
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
