var quotationNameSet = new Set();
var quotationShortNameSet = new Set();
var checkedGroup = new Set();
var checkedUser = new Set();
var customerMap = new Map();

$(document).ready(function () {
	initialize();
	getCustomers();
	queryQuotations();
})

function initialize() {
	Utils.RemoveSessionStorageItem("checkboxStatus");
	Utils.SetDateTimeRange("#searhBar");
	const keys = Object.keys(sessionStorage);
	for (var i = 0; i < keys.length; i++) {
		if(Number(keys[i]) > 0) {
			Utils.RemoveSessionStorageItem(keys[i]);
		}
	}
}

function getCustomers() {
	axios.get("qms01.do?method=queryGroup")
	.then(response => {
		const customers = response.data.responseInfo;
		if(!customers) return
		for(let i=0; i<customers.length; i++) {
			if(customers[i].status === "1") {
				customerMap.set(customers[i].group_id, customers[i].group_name);
			}
		}
	})
	.then(() => {
		const customerIdArray = JSON.parse(sessionStorage.getItem("customerList")).map(customer => customer.group_id);
		const customers = document.querySelector("#customers")
		let customerHTML = "<option value='0' i18n='all' selected>全選</option>"
		for(const [key, value] of customerMap) {
			if(sessionStorage.getItem("userRole") === "admin") {
				customerHTML += `<option value="${key}">${value}</option>`
			} else if(sessionStorage.getItem("userRole") === "sales") {
				customerIdArray.forEach(id => {
					if(key === id) {
						customerHTML += `<option value="${key}">${value}</option>`
					}
				})
			}
		}
		customers.innerHTML = customerHTML;
	})
	.then(() => {
		Utils.SetI18N();
	})
}

function queryQuotations() {
	const inputWrapper = document.querySelector("#inputWrapper");
	const requestData = {
		query_name : inputWrapper.querySelector("#qName").value,
		customers : inputWrapper.querySelector("#customers").value,
		creater : inputWrapper.querySelector("#creater").value,
		createDate : inputWrapper.querySelector("#createDate").value,
		validDate : inputWrapper.querySelector("#validDate").value
	}
	axios
		.post("qms01.do?method=queryProject", requestData)
		.then(response => {
			if(response.data.responseInfo.length !== 0) {
				setQuotation(response.data.responseInfo);
			} else {
				const quotationList = document.querySelector("#quotationList");
				quotationList.classList.remove("gridMode");
				quotationList.classList.remove("listMode");
				quotationList.innerHTML = `<div id="quotationEmptyList">
					<p class="FS_xxl" i18n="">查無資料</p>
				</div>`
			}
		})
		.then(() => {
			Utils.ShowFunctionByRole(["#phoneGear", "#phoneStar", "#star", ".updateLog", "#gear", "#customerMenuGroup"]);
		})
}

function initSearchBar() {
	const inputWrapper = document.querySelector("#inputWrapper");
	inputWrapper.querySelector("#qName").value = "";
	inputWrapper.querySelector("#customers").value = "0";
	inputWrapper.querySelector("#creater").value = "0";
	inputWrapper.querySelector("#createDate").value = "";
	inputWrapper.querySelector("#validDate").value = "";
}

// set 報價專案
function setQuotation(data) {
	let htmlString = ""
	for(let i = 0; i <= data.length-1; i++) {
		quotationNameSet.add(data[i].p_name);
		quotationShortNameSet.add(data[i].b_name);
		const notFinished = data[i].status === "0" ? "notFinished" : "";
		const creator = data[i].user_role + "Border"
		let opitons = "";
		if(sessionStorage.getItem("userRole") === "sales") {
			opitons = data[i].user_role === "admin" ? "none" : "";
		}
		htmlString += `<div class="quotationBadge ${notFinished} ${creator}" data-quotationId="${data[i].p_id}" data-quotationname="${data[i].p_name}" data-customerId="${data[i].customer_id}" data-customerName="${data[i].customer_name}" data-quotationdesc="${data[i].p_desc}" onclick="loadQuotationView(this, event)">
			<div class="BadgeRow_1">
		    	<p>${data[i].b_name}</p>
				<div class="btn-group ${opitons}">
					<button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa-solid fa-ellipsis-vertical"></i></button>
					<div class="dropdown-menu dropdown-menu-right">
						<button class="dropdown-item" type="button" onclick="showQuotationUpdateModal('edit', ${data[i].p_id}, '${data[i].p_name}', '${data[i].b_name}', '${data[i].customer_id}', '${data[i].expdate}', '${data[i].p_desc}')" i18n="edit">編輯</button>
						<button class="dropdown-item" type="button" onclick="duplicateQuotation('${data[i].p_id}', '${data[i].p_name}', '${data[i].b_name}', '${data[i].customer_id}', '${data[i].expdate}', '${data[i].p_desc}', '${data[i].status}')" i18n="copy">複製</button>
						<button class="dropdown-item" type="button" onclick="updateQuotation('delete', '${data[i].p_id}', '${data[i].p_name}', '${data[i].b_name}')" i18n="delete">刪除</button>
						<button class="updateLog dropdown-item" type="button" onclick="loadQuotationUpdateLogView(${data[i].p_id}, '${data[i].p_name}')" i18n="modifiedHistory">異動紀錄</button>
					</div>
				</div>
			</div>
			<div class="BadgeRow_2">
		    	<p>${data[i].p_name}</p>
			</div>
			<div class="BadgeRow_3">
				<p i18n="notCompletedYet" class=${data[i].status === "0" ? "" : "none"}>未完成報價</p>
			</div>
		  	<div class="BadgeRow_4">
				<p>${data[i].customer_name}</p>
		  	</div>
			<div class="BadgeRow_5">
		    	<p>id: ${data[i].p_id}</p>
		    	<p>${data[i].create_date}</p>
			</div>
		</div>`
	}
	const quotationList = document.querySelector("#quotationList");
	quotationList.classList.add("gridMode");
	quotationList.innerHTML = htmlString;
	Utils.SetI18N();
}

// list / grid 
function switchViewMode(mode, t) {
	const quotationList = document.querySelector("#quotationList")
	if (mode === "grid") {
		quotationList.classList.add("gridMode")
		quotationList.classList.remove("listMode")
		t.children[0].classList.remove("off")
		t.nextElementSibling.children[0].classList.add("off")
	} else if (mode === "list") {
		quotationList.classList.remove("gridMode")
		quotationList.classList.add("listMode")
		t.children[0].classList.remove("off")
		t.previousElementSibling.children[0].classList.add("off")
	}
}



/* 客戶常用品項維護 */
function loadFavoriteItemView() {
	Utils.LoadPage("favoriteItem", "normalBadge");
}
/* 客戶常用品項維護 */



/* 歷次下載紀錄 */
function loadQuotationDownloadLogView() {
	Utils.LoadPage("quotationDownloadLog", "normalBadge");
}
/* 歷次下載紀錄 */


/* 設定屬性權限 */
function loadQuotationSettingView() {
	Utils.LoadPage("quotationSetting", "normalBadge");
}

/* 設定屬性權限 */


/* 報價專案 */
function loadQuotationView(t, e) {
	if(!e.target.classList.contains("btn-group")
		&& !e.target.classList.contains("dropdown-toggle")
		&& !e.target.classList.contains("dropdown-item")
		&& !e.target.classList.contains("fa-ellipsis-vertical")) {
		sessionStorage.setItem("p_id", t.dataset.quotationid);
		sessionStorage.setItem("q_name", t.dataset.quotationname);
		sessionStorage.setItem("q_customerId", t.dataset.customerid);
		sessionStorage.setItem("q_customerName", t.dataset.customername);
		sessionStorage.setItem("q_desc", t.dataset.quotationdesc);
		Utils.LoadPage("quotation", "X");
	}
}

/* 新增/編輯報價專案 */
function showBlackFont(t) {
	t.classList.remove("dim");
}
// show 新增/編輯報價專案 modal
function showQuotationUpdateModal(option, id, name, sName, customerId, ValidDate, pDesc) {
	const customerIdArray = JSON.parse(sessionStorage.getItem("customerList")).map(customer => customer.group_id);
	const customers = document.querySelector("#customers")
	let htmlString = "<option value='0' i18n='quotationSystem_create_chooseCustomer' selected disabled>請選擇客戶別</option>"
	for(const [key, value] of customerMap) {
		if(sessionStorage.getItem("userRole") === "admin") {
			htmlString += `<option value="${key}">${value}</option>`
		} else if(sessionStorage.getItem("userRole") === "sales") {
			customerIdArray.forEach(id => {
				if(key === id) {
					htmlString += `<option value="${key}">${value}</option>`
				}
			})
		}
	}
	document.querySelector("#customerMenu").innerHTML = htmlString;
	switch(option) {
		case "add": 
			document.querySelector("#quotationUpdateModal #modalTitle").innerHTML = Language[localStorage.getItem("askeyLanguage")].createQuotation;
			document.querySelector("#modalAddButton").classList.remove("none");
			document.querySelector("#modalEditButton").classList.add("none");
			const today = Utils.GetFutureDate(14);
			Utils.AssignDateTime("#ValidDateWrapper", today);
			break;	
		case "edit":
			sessionStorage.setItem("checkPName", name);
			sessionStorage.setItem("checkSName", sName);
			document.querySelector("#modalAddButton").classList.add("none");
			document.querySelector("#modalEditButton").classList.remove("none");
			document.querySelector("#quotationUpdateModal #modalTitle").innerHTML = Language[localStorage.getItem("askeyLanguage")].editQuotation;
			document.querySelector("#updatePId").value = id;
			document.querySelector("#updatePName").value = name;
			document.querySelector("#updatePShortName").value = sName;
			document.querySelector("#customerMenu").value = customerId;
			document.querySelector("#customerMenu").classList.remove("dim");
			Utils.AssignDateTime("#ValidDateWrapper", ValidDate);
			document.querySelector("#updatePNote").value = pDesc;
			break;
		}
	$("#quotationUpdateModal").modal('show');
	Utils.SetI18N();
}

function updateQuotation(option, pId, pName, bName) {
	if(option === "delete") {
		if(confirm(Language[localStorage.getItem("askeyLanguage")].doYouWantToDeleteThisProject)) {
			const requestData = {
				"p_id" : pId,
				"status" : "2",
			}
			axios.post("qms01.do?method=updateProject", requestData).then(response => {
				if(response.data.message === "Success" || response.data.message === "成功") {
						closeQuotationModal()
					quotationNameSet.delete(pName);
					quotationShortNameSet.delete(bName);
					queryQuotations();
					alert(Language[localStorage.getItem("askeyLanguage")].deleteSuccess)
				}
			})
		}
	} else {
		const language = typeof localStorage.getItem("askeyLanguage") === "object" ? "tw" : localStorage.getItem("askeyLanguage");
		const form = document.querySelector("#body");
		const constraints = {
			updatePName: {
				presence: {
					message: Language[language].error_qName
				},
			},
			updatePShortName: {
				presence: {
					message: Language[language].error_qShortName
				},
			},
		};
		const errorA = validate(form, constraints, { format: 'detailed' });
		const errors = errorA === undefined ? [] : errorA;
		// 重置 error message
		form.querySelectorAll('.errorMessage').forEach(element => { element.classList.add("none"); });
		// 重置 input tag effect
		form.querySelectorAll('.is-invalid').forEach(element => { element.classList.remove('is-invalid'); });
		// 檢查客戶別
		if(customerMenu.value === "0") {
			errors.push({ "attribute": "customerMenu" })
		}
		if (errors.length > 0) {
			for (const error of errors) {
			  	const errorElement = form.querySelector(`[data-error-type="${error.attribute}"]`);
			  	if (errorElement) {
			  		errorElement.classList.remove("none");
				  	const inputField = form.querySelector(`#${error.attribute}`);
				  	if (inputField) {
					  	inputField.classList.add('is-invalid');
				  	}
			  	}
			}
		} else {
			let url = "";
			let alertString = "";
			const requestData = {
				"p_name" : document.querySelector("#updatePName").value,
				"b_name" : document.querySelector("#updatePShortName").value,
				"customer_id" : document.querySelector("#customerMenu").value,
				"expdate" : document.querySelector("#modalValidDate").value,
				"description" : document.querySelector("#updatePNote").value
			}
			if(quotationNameSet.has(requestData.p_name) && requestData.p_name !== sessionStorage.getItem("checkPName")) {
				alert(Language[localStorage.getItem("askeyLanguage")].nameAlreadyExists);
				return;
			}
			if(quotationShortNameSet.has(requestData.b_name) && requestData.b_name !== sessionStorage.getItem("checkSName")) {
				alert(Language[localStorage.getItem("askeyLanguage")].briefNameAlreadyExists);
				return;
			}
			if(option === "add") {
				url = "qms01.do?method=newProject";
				alertString = Language[localStorage.getItem("askeyLanguage")].createSuccess;
			} else if(option === "edit") {
				requestData.p_id = document.querySelector("#updatePId").value;
				url = "qms01.do?method=updateProject";
				alertString = Language[localStorage.getItem("askeyLanguage")].updateSuccess;
			}
			axios.post(url, requestData).then(response => {
				console.log(response)
				if(response.data.message === "Success" || response.data.message === "成功") {
					closeQuotationModal()
					queryQuotations();
					alert(alertString)
					sessionStorage.removeItem("checkPName");
					sessionStorage.removeItem("checkSName");
				}
			})
		}	
	}
}
function closeQuotationModal() {
	document.querySelector("#modalCloseButton").click();
	clearQuotationUpdateModal();
}
function clearQuotationUpdateModal() {
	const form = document.querySelector("#body");
	// 重置 error message
	form.querySelectorAll('.errorMessage').forEach(element => { element.classList.add("none"); });
	// 重置 input tag effect
	form.querySelectorAll('.is-invalid').forEach(element => { element.classList.remove('is-invalid'); });
	document.querySelector("#updatePId").value = "";
	document.querySelector("#updatePName").value = "";
	document.querySelector("#updatePShortName").value = "";
	document.querySelector("#updatePNote").value = "";
	document.querySelector("#customerMenu").value = "0";
	document.querySelector("#customerMenu").classList.add("dim");
}
function duplicateQuotation(pId, pName, bName, customerId, expdate, desc, status) {
	const requestData = {
		"p_id" : pId,
		"p_name" : (pName + "(copy)"),
		"b_name" : bName,
		"customer_id" : customerId,
		"expdate" : expdate,
		"description" : desc,
		"status" : status
	}
	axios
	.post("qms02.do?method=duplicateProject", requestData)
	.then(response => {
		if(response.data.status === "0") {
			alert(Language[localStorage.getItem("askeyLanguage")].copySuccess);
			queryQuotations();
		}
	})
}
/* 報價專案 */


/* 異動紀錄 */
function loadQuotationUpdateLogView(id, name) {
	sessionStorage.setItem("p_id", id);
	sessionStorage.setItem("q_name", name);
	Utils.LoadPage("quotationUpdateLog", "normalBadge");
}
/* 異動紀錄 */






function toggleSmallBarContent(toggle) {
	if(toggle === "on") {
		document.querySelector("#phoneButtonGroup").classList.remove("none");
		document.querySelector("#backgroundBlock").classList.remove("none");
	} else if(toggle === "off") {
		document.querySelector("#phoneButtonGroup").classList.add("none");
		document.querySelector("#backgroundBlock").classList.add("none");
	}
}





