
var map;

function init() {
  map = new BMap.Map('map');
  map.centerAndZoom(new BMap.Point(121.491, 31.233), 13);  
}
   
(function loadScript() {  
  var script = document.createElement("script");  
  script.src = "http://api.map.baidu.com/api?v=2.0&ak=TFbEYEuNSR9F9Z1SrBI3qCdTUXs0nllz&callback=init";
  document.body.appendChild(script);  
})();

var viewModel = function() {
  this.inputValue = ko.observable()

  this.toggleMenu = function() {
    $('body').toggleClass('menu-hidden');
  }

  this.searchMap = function () {
    var options = {
      renderOptions:{map: map, autoViewport:true, panel:"area-list"},
      pageCapacity: 5
    };
    var local = new BMap.LocalSearch(map, options)
    local.search(this.inputValue())
  }
  
  this.searchWeather = function() {
    // var url = 'http://api.map.baidu.com/telematics/v3/weather?location=&output=json&ak=E4805d16520de693a3fe707cdc962045'
    // var url = 'https://weixin.jirengu.com/weather/cityid?location='
    // var newUrl = url.replace(/location=/, 'location=' + this.inputValue())
    var url = 'http://api.jirengu.com/weather.php?city='
    var newUrl = url.replace(/city=/, 'city=' + this.inputValue())
    $.ajax({
      url: newUrl,
      method : 'GET',
      dataType: 'json',
      success: function(data) {
        if (data.status != 'success') {
          alert("天气查询失败。。。")
        } else if (!data.results[0].weather_data) {
          alert("天气查询失败。。。")
        } else {
          // 使用 Handlebars 创建模板
          var weather_data = data.results[0].weather_data
          var areaItemTemplate = Handlebars.compile($('.tpl-area-list-item').html())
          var areaList = $('#area-list')
          areaList.empty()
          for (var i = 0; i < weather_data.length; i ++){
            var res = {
              date: weather_data[i].date,
              weather: weather_data[i].weather,
              wind: weather_data[i].wind,
              temperature: weather_data[i].temperature
            }
            areaList.append(areaItemTemplate(res))
          }
        }
      },
      error: function() {
        alert("天气查询超时。。。")
      }
    })
  }
};

ko.applyBindings(new viewModel());