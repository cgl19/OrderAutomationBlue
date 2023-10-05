$(document).ready(function () {
	//Only needed for the filename of export files.
	//Normally set in the title tag of your page.
	document.title = "Simple DataTable";
	// DataTable initialisation
	$("#example2").DataTable({
		dom:
			'<"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-tl ui-corner-tr"Blfr>' +
			"t" +
			'<"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix ui-corner-bl ui-corner-br"ip>',
		paging: true,
		language: {
			searchPlaceholder: "Search...",
			sSearch: "",
			lengthMenu: "_MENU_ items/page",
			sInfo: "",
		},
		autoWidth: false,
		fixedHeader: true,
		buttons: [
			"colvis",
			"copyHtml5",
			"csvHtml5",
			"excelHtml5",
			"pdfHtml5",
			"print",
		],
	});
});
