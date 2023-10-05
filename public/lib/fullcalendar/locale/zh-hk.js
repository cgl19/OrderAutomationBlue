!(function (e, t) {
	"object" == typeof exports && "object" == typeof module
		? (module.exports = t(require("moment"), require("fullcalendar")))
		: "function" == typeof define && define.amd
		? define(["moment", "fullcalendar"], t)
		: "object" == typeof exports
		? t(require("moment"), require("fullcalendar"))
		: t(e.moment, e.FullCalendar);
})("undefined" != typeof self ? self : this, function (e, t) {
	return (function (e) {
		function t(r) {
			if (n[r]) return n[r].exports;
			var o = (n[r] = { i: r, l: !1, exports: {} });
			return e[r].call(o.exports, o, o.exports, t), (o.l = !0), o.exports;
		}
		var n = {};
		return (
			(t.m = e),
			(t.c = n),
			(t.d = function (e, n, r) {
				t.o(e, n) ||
					Object.defineProperty(e, n, {
						configurable: !1,
						enumerable: !0,
						get: r,
					});
			}),
			(t.n = function (e) {
				var n =
					e && e.__esModule
						? function () {
								return e.default;
						  }
						: function () {
								return e;
						  };
				return t.d(n, "a", n), n;
			}),
			(t.o = function (e, t) {
				return Object.prototype.hasOwnProperty.call(e, t);
			}),
			(t.p = ""),
			t((t.s = 213))
		);
	})({
		0: function (t, n) {
			t.exports = e;
		},
		1: function (e, n) {
			e.exports = t;
		},
		213: function (e, t, n) {
			Object.defineProperty(t, "__esModule", { value: !0 }), n(214);
			var r = n(1);
			r.datepickerLocale("zh-hk", "zh-HK", {
				closeText: "關閉",
				prevText: "&#x3C;上月",
				nextText: "下月&#x3E;",
				currentText: "今天",
				monthNames: [
					"一月",
					"二月",
					"三月",
					"四月",
					"五月",
					"六月",
					"七月",
					"八月",
					"九月",
					"十月",
					"十一月",
					"十二月",
				],
				monthNamesShort: [
					"一月",
					"二月",
					"三月",
					"四月",
					"五月",
					"六月",
					"七月",
					"八月",
					"九月",
					"十月",
					"十一月",
					"十二月",
				],
				dayNames: [
					"星期日",
					"星期一",
					"星期二",
					"星期三",
					"星期四",
					"星期五",
					"星期六",
				],
				dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
				dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
				weekHeader: "周",
				dateFormat: "yy/mm/dd",
				firstDay: 1,
				isRTL: !1,
				showMonthAfterYear: !0,
				yearSuffix: "年",
			}),
				r.locale("zh-hk", {
					buttonText: { month: "月", week: "週", day: "天", list: "活動列表" },
					allDayText: "整天",
					eventLimitText: "顯示更多",
					noEventsMessage: "没有任何活動",
				});
		},
		214: function (e, t, n) {
			!(function (e, t) {
				t(n(0));
			})(0, function (e) {
				return e.defineLocale("zh-hk", {
					months:
						"一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split(
							"_"
						),
					monthsShort:
						"1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
					weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split(
						"_"
					),
					weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split("_"),
					weekdaysMin: "日_一_二_三_四_五_六".split("_"),
					longDateFormat: {
						LT: "HH:mm",
						LTS: "HH:mm:ss",
						L: "YYYY/MM/DD",
						LL: "YYYY年M月D日",
						LLL: "YYYY年M月D日 HH:mm",
						LLLL: "YYYY年M月D日dddd HH:mm",
						l: "YYYY/M/D",
						ll: "YYYY年M月D日",
						lll: "YYYY年M月D日 HH:mm",
						llll: "YYYY年M月D日dddd HH:mm",
					},
					meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
					meridiemHour: function (e, t) {
						return (
							12 === e && (e = 0),
							"凌晨" === t || "早上" === t || "上午" === t
								? e
								: "中午" === t
								? e >= 11
									? e
									: e + 12
								: "下午" === t || "晚上" === t
								? e + 12
								: void 0
						);
					},
					meridiem: function (e, t, n) {
						var r = 100 * e + t;
						return r < 600
							? "凌晨"
							: r < 900
							? "早上"
							: r < 1130
							? "上午"
							: r < 1230
							? "中午"
							: r < 1800
							? "下午"
							: "晚上";
					},
					calendar: {
						sameDay: "[今天]LT",
						nextDay: "[明天]LT",
						nextWeek: "[下]ddddLT",
						lastDay: "[昨天]LT",
						lastWeek: "[上]ddddLT",
						sameElse: "L",
					},
					dayOfMonthOrdinalParse: /\d{1,2}(日|月|週)/,
					ordinal: function (e, t) {
						switch (t) {
							case "d":
							case "D":
							case "DDD":
								return e + "日";
							case "M":
								return e + "月";
							case "w":
							case "W":
								return e + "週";
							default:
								return e;
						}
					},
					relativeTime: {
						future: "%s內",
						past: "%s前",
						s: "幾秒",
						ss: "%d 秒",
						m: "1 分鐘",
						mm: "%d 分鐘",
						h: "1 小時",
						hh: "%d 小時",
						d: "1 天",
						dd: "%d 天",
						M: "1 個月",
						MM: "%d 個月",
						y: "1 年",
						yy: "%d 年",
					},
				});
			});
		},
	});
});
