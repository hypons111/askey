$(document).ready(function() {
	Utils.SetI18N();
	getQuotationDropdownMenu();
	Utils.SetDateTimeRange("#searhBar");
	getUserDropdownMenu();
	queryDownLoadLog();
})

function getQuotationDropdownMenu() {
	let htmlString = "<option value='' i18n='all' selected>全選</option>"
	axios
		.post("qms01.do?method=queryProject", {})
		.then(response => {
			response.data.responseInfo.forEach(quotation => {
				htmlString += `<option value="${quotation.p_id}">${quotation.p_name}</option>`
			})
			document.querySelector("#quotation").innerHTML = htmlString;
		})
		.then(() => {
			Utils.SetI18N();
		})
}

function getUserDropdownMenu() {
	const requestData = {
		"user_role": document.querySelector("#role").value,				
	}
	let htmlString = "<option value='' i18n='all' selected>全選</option>"
	axios
		.post("qms01.do?method=queryUser", requestData)
		.then(response => {
			response.data.responseInfo.forEach(user => {
				htmlString += `<option value="${user.user_id}">${user.user_name}</option>`
			})
			document.querySelector("#user").innerHTML = htmlString;
		})
		.then(() => {
			Utils.SetI18N();
		})
}

function initSearchBar() {
	document.querySelectorAll("#inputWrapper select").forEach(select => {
		select.value = "";
	})
	Utils.SetDateTimeRange("#searhBar");
}

function toggleSearhBar() {
	document.querySelector("#searhBarWrapper").classList.toggle("hide")
}

function queryDownLoadLog() {
	const requestData = {
		"p_id": document.querySelector("#quotation").value,
		"sdate": "",
		"edate": "",
		"user_role": document.querySelector("#role").value,				
		"users": document.querySelector("#user").value,		
	}
	const data = document.querySelector("#date").value.split(" - ");
	if(data.length > 1) {
		requestData.sdate = data[0];
		requestData.edate = data[1];
	}
	axios
	.post("qms04.do?method=queryReportLog", requestData)
	.then(response => {
		const column = [
			{ title: "<p i18n='no'>序號</p>", className: "r_id", data: "r_id" },
			{ title: "<p i18n='quotationNo'>報價單號</p>", className: "quote_no", data: "quote_no" },
			{ title: "<p i18n='quotationProject'>報價專案</p>", className: "p_name", data: "p_name" },
			{ title: "<p i18n='role'>角色</p>", className: "role", data: "user_role" },
			{ title: "<p i18n='userName'>使用者名稱</p>", className: "user_name", data: "user_name" },
			{ title: "<p i18n='file'>檔案</p>", className: "file_name", data: "file_name" },
			{ title: "<p i18n='date'>日期</p>", className: "create_datetime", data: "create_datetime" },
			{ 
				title: "<p i18n='memo'>備註</p>", 
				className: "action_type",
				render: function (data, type, row, meta) {
					return Language[localStorage.getItem("askeyLanguage")][row.action_type];
				}
			}
		];
		if(sessionStorage.getItem("userRole") !== "admin") {
			column.splice(3, 1);
		}
		const data = [];
		response.data.responseInfo.forEach(d => {
			if(sessionStorage.getItem("userRole") !== "admin") {
				delete d.user_role;
			}
			d.file_name = `<span class="fileName pointer" onclick="downloadReport('${d.r_id}', '${d.file_name}')">${d.file_name}</span>`
			data.push(d);
		})
		$("#dataTable").DataTable({
			"columns": column,
			"data": response.data.responseInfo,
			"destroy": true,
			"dom": '<"top"i>rt<"pagination-wrapper"lp>',
			"info": false,
			"language": Language[`${localStorage.getItem("askeyLanguage")}`],
		    "lengthChange": false,
		    "ordering": false,
		    "searching": false,
		})
	})
	.then(() => {
		Utils.SetI18N();
	})
}

function downloadReport(rid, fileName) {
	const requestData = { r_id : rid };
	const requestString = encodeURIComponent(JSON.stringify(requestData));
	axios({
		method: 'GET',
		url: `qms05.do?method=downloadReport&content=${requestString}`,
		responseType: 'arraybuffer'  // 這很重要
	})
	.then(response => {
		const blob = new Blob([response.data]);
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = fileName;
		link.click();
		URL.revokeObjectURL();
	})

}