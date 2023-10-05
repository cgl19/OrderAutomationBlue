!(function (e, u) {
	"object" == typeof exports && "object" == typeof module
		? (module.exports = u(require("moment"), require("fullcalendar")))
		: "function" == typeof define && define.amd
		? define(["moment", "fullcalendar"], u)
		: "object" == typeof exports
		? u(require("moment"), require("fullcalendar"))
		: u(e.moment, e.FullCalendar);
})("undefined" != typeof self ? self : this, function (e, u) {
	return (function (e) {
		function u(a) {
			if (t[a]) return t[a].exports;
			var n = (t[a] = { i: a, l: !1, exports: {} });
			return e[a].call(n.exports, n, n.exports, u), (n.l = !0), n.exports;
		}
		var t = {};
		return (
			(u.m = e),
			(u.c = t),
			(u.d = function (e, t, a) {
				u.o(e, t) ||
					Object.defineProperty(e, t, {
						configurable: !1,
						enumerable: !0,
						get: a,
					});
			}),
			(u.n = function (e) {
				var t =
					e && e.__esModule
						? function () {
								return e.default;
						  }
						: function () {
								return e;
						  };
				return u.d(t, "a", t), t;
			}),
			(u.o = function (e, u) {
				return Object.prototype.hasOwnProperty.call(e, u);
			}),
			(u.p = ""),
			u((u.s = 129))
		);
	})({
		0: function (u, t) {
			u.exports = e;
		},
		1: function (e, t) {
			e.exports = u;
		},
		129: function (e, u, t) {
			Object.defineProperty(u, "__esModule", { value: !0 }), t(130);
			var a = t(1);
			a.datepickerLocale("fi", "fi", {
				closeText: "Sulje",
				prevText: "&#xAB;Edellinen",
				nextText: "Seuraava&#xBB;",
				currentText: "Tänään",
				monthNames: [
					"Tammikuu",
					"Helmikuu",
					"Maaliskuu",
					"Huhtikuu",
					"Toukokuu",
					"Kesäkuu",
					"Heinäkuu",
					"Elokuu",
					"Syyskuu",
					"Lokakuu",
					"Marraskuu",
					"Joulukuu",
				],
				monthNamesShort: [
					"Tammi",
					"Helmi",
					"Maalis",
					"Huhti",
					"Touko",
					"Kesä",
					"Heinä",
					"Elo",
					"Syys",
					"Loka",
					"Marras",
					"Joulu",
				],
				dayNamesShort: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
				dayNames: [
					"Sunnuntai",
					"Maanantai",
					"Tiistai",
					"Keskiviikko",
					"Torstai",
					"Perjantai",
					"Lauantai",
				],
				dayNamesMin: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
				weekHeader: "Vk",
				dateFormat: "d.m.yy",
				firstDay: 1,
				isRTL: !1,
				showMonthAfterYear: !1,
				yearSuffix: "",
			}),
				a.locale("fi", {
					buttonText: {
						month: "Kuukausi",
						week: "Viikko",
						day: "Päivä",
						list: "Tapahtumat",
					},
					allDayText: "Koko päivä",
					eventLimitText: "lisää",
					noEventsMessage: "Ei näytettäviä tapahtumia",
				});
		},
		130: function (e, u, t) {
			!(function (e, u) {
				u(t(0));
			})(0, function (e) {
				function u(e, u, a, n) {
					var i = "";
					switch (a) {
						case "s":
							return n ? "muutaman sekunnin" : "muutama sekunti";
						case "ss":
							return n ? "sekunnin" : "sekuntia";
						case "m":
							return n ? "minuutin" : "minuutti";
						case "mm":
							i = n ? "minuutin" : "minuuttia";
							break;
						case "h":
							return n ? "tunnin" : "tunti";
						case "hh":
							i = n ? "tunnin" : "tuntia";
							break;
						case "d":
							return n ? "päivän" : "päivä";
						case "dd":
							i = n ? "päivän" : "päivää";
							break;
						case "M":
							return n ? "kuukauden" : "kuukausi";
						case "MM":
							i = n ? "kuukauden" : "kuukautta";
							break;
						case "y":
							return n ? "vuoden" : "vuosi";
						case "yy":
							i = n ? "vuoden" : "vuotta";
					}
					return (i = t(e, n) + " " + i);
				}
				function t(e, u) {
					return e < 10 ? (u ? n[e] : a[e]) : e;
				}
				var a =
						"nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split(
							" "
						),
					n = [
						"nolla",
						"yhden",
						"kahden",
						"kolmen",
						"neljän",
						"viiden",
						"kuuden",
						a[7],
						a[8],
						a[9],
					];
				return e.defineLocale("fi", {
					months:
						"tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split(
							"_"
						),
					monthsShort:
						"tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split(
							"_"
						),
					weekdays:
						"sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split(
							"_"
						),
					weekdaysShort: "su_ma_ti_ke_to_pe_la".split("_"),
					weekdaysMin: "su_ma_ti_ke_to_pe_la".split("_"),
					longDateFormat: {
						LT: "HH.mm",
						LTS: "HH.mm.ss",
						L: "DD.MM.YYYY",
						LL: "Do MMMM[ta] YYYY",
						LLL: "Do MMMM[ta] YYYY, [klo] HH.mm",
						LLLL: "dddd, Do MMMM[ta] YYYY, [klo] HH.mm",
						l: "D.M.YYYY",
						ll: "Do MMM YYYY",
						lll: "Do MMM YYYY, [klo] HH.mm",
						llll: "ddd, Do MMM YYYY, [klo] HH.mm",
					},
					calendar: {
						sameDay: "[tänään] [klo] LT",
						nextDay: "[huomenna] [klo] LT",
						nextWeek: "dddd [klo] LT",
						lastDay: "[eilen] [klo] LT",
						lastWeek: "[viime] dddd[na] [klo] LT",
						sameElse: "L",
					},
					relativeTime: {
						future: "%s päästä",
						past: "%s sitten",
						s: u,
						ss: u,
						m: u,
						mm: u,
						h: u,
						hh: u,
						d: u,
						dd: u,
						M: u,
						MM: u,
						y: u,
						yy: u,
					},
					dayOfMonthOrdinalParse: /\d{1,2}\./,
					ordinal: "%d.",
					week: { dow: 1, doy: 4 },
				});
			});
		},
	});
});
