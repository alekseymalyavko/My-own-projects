    var statistics = '';
    var allusers = '';

    var header = document.createElement("header");
    document.body.appendChild(header);

    function addInput() {

        var input = document.createElement("input");
        input.placeholder = "Введите id группы Vk";
        input.type = "search";
        input.id = "search";
        input.onkeypress = function(e) {
            e = e || window.event;
            if (e.keyCode === 13) {

                searchtext = e.target.value;
                $.ajax({
                    url: "https://api.vk.com/method/groups.getMembers?group_id=" + searchtext + "&access_token=21538bf5a0e6910bd41233491729751cf579d30204d0045c2be220f215aca88854f59d72223d0cde7ec60&v=3.0",
                    method: "GET",
                    dataType: "JSONP",
                    success: function(data) {
                        allusers = data.response.count;
                    }
                })
                $.ajax({
                    url: "https://api.vk.com/method/stats.get?group_id=" + searchtext + "&app_id=6311023&date_from=2017-12-01&date_to=2017-12-24&access_token=21538bf5a0e6910bd41233491729751cf579d30204d0045c2be220f215aca88854f59d72223d0cde7ec60&v=3.0",
                    method: "GET",
                    dataType: "JSONP",
                    success: function(data) {
                        statistics = data.response;
                        getParams();
                    }
                })
            }
        }
        header.appendChild(input);
    };

     function getParams() {
        var params = [];

        if (statistics === undefined ) {
            alert("Статистика группы закрыта :(")
        }
        else {

        for (var i = 0; i < statistics.length; i++) {
            var data = statistics;
            params.push({
                views: data[i].views,
                visitors: data[i].visitors,
                reach_subscribers: data[i].reach_subscribers,
                subscribed: data[i].subscribed,
                reach: data[i].reach,
                unsubscribed: data[i].unsubscribed
            })
        }
        
        check(params);
        }
    }

    function check(params) {
        var middle_visitors = 0;
        for (var i = 0; i < params.length; i++) {
            middle_visitors += params[i].visitors ;
            var sr_middle_visitors = middle_visitors/ params.length
        }
        var result = sr_middle_visitors / allusers * 100; //>1%
        console.log("кол-во уникальных пользователей от всех >1%", result);

        var users1 = 0;
        var users2 = 0;

        for (var i = 0; i < params.length; i++) {
            users1 += params[i].subscribed ;
            sr_users1 = users1/ params.length;

            users2 += params[i].unsubscribed ;
            sr_users2 = users2 / params.length;
        }
        var result1 = sr_users1 / sr_users2 * 10; //<60%
        console.log("вход-выход пользователей <60%", result1);

        var ohvat = 0;
        for (var i = 0; i < params.length; i++) {
            ohvat += params[i].reach ;
            sr_ohvat = ohvat / params.length;
        }
        var result2 = sr_ohvat / allusers * 100; // >20%
        console.log("охват >20%", result2);

        var target = (result-1) + (60-result1) + (result2-20)

        if (result > 1 && result1 < 60 && result2 > 20) {
            alert("Группа Эффективна на " + target )
        } else {
            alert("Группа неэффективна!")
        }
    }


    addInput();
