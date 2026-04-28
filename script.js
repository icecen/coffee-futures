// TradingView Widget Initializations

document.addEventListener("DOMContentLoaded", function() {
    
    // NY Arabica Chart
    new TradingView.widget({
        "autosize": true,
        "symbol": "ICEUS:KC1!",
        "interval": "D",
        "timezone": "Asia/Shanghai",
        "theme": "dark",
        "style": "1", // Candle
        "locale": "zh_CN",
        "enable_publishing": false,
        "backgroundColor": "rgba(22, 26, 34, 0)", // transparent to show card background
        "gridColor": "rgba(42, 46, 57, 0.5)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_kc1",
        "toolbar_bg": "rgba(22, 26, 34, 1)"
    });

    // London Robusta Chart
    new TradingView.widget({
        "autosize": true,
        "symbol": "BLACKBULL:ROBUSTA",
        "interval": "D",
        "timezone": "Asia/Shanghai",
        "theme": "dark",
        "style": "1",
        "locale": "zh_CN",
        "enable_publishing": false,
        "backgroundColor": "rgba(22, 26, 34, 0)",
        "gridColor": "rgba(42, 46, 57, 0.5)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_rc1",
        "toolbar_bg": "rgba(22, 26, 34, 1)"
    });

});
