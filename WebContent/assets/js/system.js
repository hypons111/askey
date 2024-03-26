$(document).ready(function () {
	showFunction();
	Utils.SetI18N();
})

function showFunction() {
	const elementArray = ["#account"];
	Utils.ShowFunctionByRole(elementArray);
}

function loadAccountSystem() {
	Utils.SaveReturnPage("system", "systemBadge")
	Utils.LoadPage("accountSystem", "normalBadge");
}

function loadQuotationSystem() {
	Utils.SaveReturnPage("system", "systemBadge")
	Utils.LoadPage("quotationSystem", "normalBadge");
}