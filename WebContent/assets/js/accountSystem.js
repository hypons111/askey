var L = localStorage.getItem("askeyLanguage");
var userSet = new Set();
var customerSet = new Set();
var customerStatusMap = new Map();
var currentPage = "USER";
var currentOption = "CREATE";
var MY_URL = {
	"GET_USERS" : "qms06.do?method=getUserAccountList",			// API40-取得使用者帳號清單
	"GET_CUSTOMER" : "qms01.do?method=queryGroup",				// API42-取得客戶清單
	"GET_OVERDAY" : "qms06.do?method=getOverDay",				// API48-查詢登入逾期天數
	"QUERY_USER" : "qms06.do?method=queryUserList",				// API41-取得使用者清單列表
	"QUERY_CUSTOMER" : "qms06.do?method=queryGroupInfoList",	// API45-查詢客戶清單列表
	"CREATE_USER" : "qms06.do?method=insertUserInfo",			// API43-新增使用者帳號
	"CREATE_CUSTOMER" : "qms06.do?method=insertGroupInfo",		// API46-新增客戶
	"EDIT_USER" : "qms06.do?method=updateUserInfo",				// API44-更新使用者帳號
	"EDIT_CUSTOMER" : "qms06.do?method=updateGroupInfo",		// API47-編輯客戶
	"EDIT_OVERDAY" : "qms06.do?method=updateOverDay"			// API47-更新登入逾期天數
};
	
$(document).ready(function () {
	getUsers();
	getCustomers();
	query();
	Utils.SetI18N();
})
			
function getUsers() {
	axios
	.get(MY_URL.GET_USERS)
	.then(response => {
		const userArray = response.data.responseInfo
		let idHtml = "<option value='' i18n='all' selected>全選</option>";
		let nameHtml = "<option value='' i18n='all' selected>全選</option>";
		userSet.clear();
		userArray.forEach(user => {
			const userObject = {
				"id" : user.user_id.trim(),
				"name" : user.user_name.trim(),
				"status" : user.status
			}
			userSet.add(userObject);
			if(user.status === document.querySelector("#status").value) {
				idHtml += `<option value='${user.user_id}'>${user.user_id}</option>`;
				nameHtml += `<option value='${user.user_name}'>${user.user_name}</option>`;
			}
		})
		document.querySelector("#userId").innerHTML = idHtml;
		document.querySelector("#userName").innerHTML = nameHtml;
	})
}

function getCustomers() {
	axios
	.get(MY_URL.GET_CUSTOMER)
	.then(response => {
		const customerArray = response.data.responseInfo;
		let html = "<option value='' i18n='all' selected>全選</option>";
		let modalHtml = "";
		customerSet.clear();
		customerArray.forEach(customer => {
			const customerObject = {
				"id" : customer.group_id,
				"name" : customer.group_name.trim(),
				"status" : customer.status
			}
			customerSet.add(customerObject);
			customerStatusMap.set(customer.group_id, {id:customer.group_id, name:customer.group_name, checked:false});
			if(customer.status === "1") {
				html += `<option value='${customer.group_id}'>${customer.group_name}</option>`;
				modalHtml += `<button class="dropdown-item" type="button" onclick="customerCheckBoxHandler('${customer.group_id}', '${customer.group_name}')">
					<input class="form-check-input" type="checkbox" value="${customer.group_id}"> 
					<label>${customer.group_name}</label>
					</button>`
			}
		})
		document.querySelector("#assignedCustomer").innerHTML = html;
		document.querySelector("#customerName").innerHTML = html;
		document.querySelector("#modalHandleCustomer").innerHTML = modalHtml;
	})
}

function switchPage(page, t) {
	currentPage = page;
	const lowerCaseCurrentPage = page.toLowerCase();
	const status = document.querySelector("#status")
	status.value = 1;		// 設定狀態的值 = "1"(啟用)
	onchangeStatus(status), // 使用者帳號, 使用者名稱, 客戶名稱的 pull down menu 只顯示 status === "1"(啟用)
	// 顯示 / 隱藏 search bar item
	document.querySelectorAll(".pageItem").forEach(item => {
		if(item.classList.contains(`${lowerCaseCurrentPage}Item`)) {
			item.classList.remove("none");
		} else {
			item.classList.add("none");
		}
	})
	// 設定頁面名稱
//	document.querySelector("#pageName").innerText = Language[L][`account${currentPage}`];
	document.querySelector("#pageNameWrapper").innerHTML = currentPage === "USER" ? 
		`<h4 id="pageName" class="FW_xb noM" i18n="accountSystem_userMaintenance">使用者維護</h4>` : 
		`<h4 id="pageName" class="FW_xb noM" i18n="accountSystem_customerMaintenance">客戶維護</h4>`
	
	// 設定使用者/客戶圖示的顔色
	document.querySelector("#switchPageSpan .FC_askeyRed").classList.remove("FC_askeyRed");
	t.firstElementChild.classList.add("FC_askeyRed")
	query();
}

function onchangeStatus(t) {
	if(currentPage === "USER") {
		const userArray = t.value === "" ? [...userSet] : [...userSet].filter(user => user.status === t.value);
		let idHtml = "<option value='' i18n='all' selected>全選</option>";
		let nameHtml = "<option value='' i18n='all' selected>全選</option>";
		userArray.forEach(user => {
			idHtml += `<option value='${user.id}'>${user.id}</option>`;
			nameHtml += `<option value='${user.name}'>${user.name}</option>`;
		});
		document.querySelector("#userId").innerHTML = idHtml;
		document.querySelector("#userName").innerHTML = nameHtml;
	} else if(currentPage === "CUSTOMER") {
		const customerArray = t.value === "" ? [...customerSet] : [...customerSet].filter(customer => customer.status === t.value);
		let html = "<option value='' i18n='all' selected>全選</option>";
		customerArray.forEach(customer => {
			html += `<option value='${customer.id}'>${customer.name}</option>`;
		});
		document.querySelector("#assignedCustomer").innerHTML = html;
		document.querySelector("#customerName").innerHTML = html;
	}
}

function query() {
	requestData = {
		"USER" : {
			"user_id" : document.querySelector("#userId").value,
			"user_name" : document.querySelector("#userName").value,
			"customer_id" : document.querySelector("#assignedCustomer").value,
			"user_role" : document.querySelector("#role").value,
			"status" : document.querySelector("#status").value
		},
		"CUSTOMER" : {
			"group_id" : document.querySelector("#customerName").value,
			"status" : document.querySelector("#status").value
		}
	}
	axios
		.post(MY_URL[`QUERY_${currentPage}`], requestData[currentPage])
		.then(response => {
			setDataTable(response.data.responseInfo)
		})
}

function setDataTable(data) {
	const property = currentPage === "USER" ? "user_id" : "group_id"
//	if(data[0].hasOwnProperty(property)) {
	if(data[0]) {
		column = {
			"USER" : [{ title: "<p i18n='no'>序號</p>", data: "seq", className: "tdw5" },
				{ title: "<p i18n='accountSystem_account'>使用者帳號</p>", data: "user_id", className: "tdw10" },
				{ title: "<p i18n='accountSystem_name'>使用者名稱</p>", data: "user_name", className: "tdw10" },
				{ title: "<p i18n='accountSystem_tel'>電話</p>", data: "mobile_phone", className: "tdw10" },
				{ title: "<p i18n='accountSystem_role'>角色</p>", data: "shownRole", className: "tdw10" },
				{ title: "<p i18n='accountSystem_customer'>負責客戶</p>", data: "shownCustomers", className: "" },
				{ title: "<p i18n='accountSystem_status'>狀態</p>", data: "shownStatus", className: "tdw5" },
				{ title: "<p></p>", data: "options", className: "tdw5" }],
			"CUSTOMER" : [{ title: "<p i18n='accountSystem_no'>序號</p>", data: "seq", className: "tdw5" },
				{ title: "<p i18n='accountSystem_customer'>客戶名稱</p>", data: "group_name", className: "tdw15" },
				{ title: "<p i18n='accountSystem_tel'>電話</p>", data: "tel", className: "tdw15" },
				{ title: "<p i18n='accountSystem_address'>地址</p>", data: "address", className: "tdw25" },
				{ title: "<p i18n='accountSystem_email'>電郵地址</p>", data: "email", className: "tdw15" },
				{ title: "<p i18n='accountSystem_currency'>幣別</p>", data: "currency_id", className: "tdw10"},
				{ title: "<p i18n='accountSystem_status'>狀態</p>", data: "shownStatus", className: "tdw10" },
				{ title: "<p></p>", data: "options", className: "tdw5" }]
		};
		switch(currentPage) {
			case "CUSTOMER" :
				for(let i=0; i<data.length; i++) {
					const s = `modalStatus${data[i].status}`
					const object = {
						"modalCustomerId" : data[i].group_id,
						"modalCustomerName" : data[i].group_name,
						"modalPhone" : data[i].tel,
						"modalAddress" : data[i].address,
						"modalEmail" : data[i].email,
						"modalCurrency" : data[i].currency_id,
					}
					object[`modalStatus_${data[i].status}`] = true
					const dataObject = JSON.stringify(object)
					data[i].seq = i+1;
					data[i].shownStatus = parseCode("shownStatus", data[i].status);
					let optionHTML = "";
					if(data[i].status === "2") { // 如果狀態 === "2"(刪除)
						optionHTML = "<span class='optionGroup'><span>"
					} else {
						optionHTML = `<span class='optionGroup'>
								<i class='fa-solid fa-pen pointer' data-json='${dataObject}' i18n="edit" title="編輯" onclick="optionHandler('EDIT', this)"></i>
								<i class='fa-solid fa-trash-can pointer' data-groupid='${data[i].group_id}' i18n="delete" title="刪除" onclick="optionHandler('DELETE', this)"></i></p>
							<span>`
					}
					data[i].options = optionHTML;
				}
				break
			case "USER" :
				for(let i=0; i<data.length; i++) {
					const s = `modalStatus${data[i].status}`
					const object = {
						"modalUserAccount" : data[i].user_id,
						"modalUserName" : data[i].user_name,
						"modalPhone" : data[i].mobile_phone,
						"modalRole" : data[i].user_role,
					}
					object[`modalStatus_${data[i].status}`] = true
					const dataObject = JSON.stringify(object)
					data[i].seq = i+1;
					data[i].shownRole = Language[L][data[i].user_role];
					data[i].shownCustomers = parseCode("shownCustomers", JSON.parse(JSON.stringify(data[i].customer_ids)));
					data[i].shownStatus = parseCode("shownStatus", data[i].status);
					
					let optionHTML = "";
					if(data[i].status === "2") { // 如果狀態 === "2"(刪除)
						optionHTML = "<span class='optionGroup'><span>"
					} else {
						optionHTML = `<span class='optionGroup'>
								<i class='fa-solid fa-pen pointer' data-json='${dataObject}' data-customerids='${data[i].customer_ids}' i18n="edit" title="編輯" onclick="optionHandler('EDIT', this)"></i>
								<i class='fa-solid fa-trash-can pointer' data-userid='${data[i].user_id}' i18n="delete" title="刪除" onclick="optionHandler('DELETE', this)"></i></p>
							<span>`
					}
					data[i].options = optionHTML;
				}
				break
		}
	} else {
		data = [];
	}
	$("#dataTable").DataTable({
		"columns": column[currentPage],
		"data": data,
		"destroy": true,
		"dom": '<"top"i>rt<"pagination-wrapper"lp>',
		"info": false,
		"language": Language[L],
		"lengthChange": false,
		"ordering": false,
		"searching": false,
	})
	Utils.SetI18N()
}

function parseCode(column, code) {
	const l = localStorage.getItem("askeyLanguage");
	switch(column) {
		case "shownCustomers" :
			const customerArray = Array.from(customerSet);
			for(let i=0; i<code.length; i++) {
				code[i] = [...customerSet].filter(customer => customer.id === Number(code[i])).map(customer => customer.name);
			}
			return code.join(", ");
			break;
		case "shownStatus" :
			const statusCode = {
				"tw" : {
					"0" : "停用",
					"1" : "啟用",
					"2" : "刪除"					
				},
				"en" : {
					"0" : "Off",
					"1" : "On",
					"2" : "Deleted"					
				},
			}
			return statusCode[l][code]
			break;
	}
}

function clearQuery() {
	const inputWrapper = document.querySelector("#inputWrapper");
	const selectArray = inputWrapper.querySelectorAll("SELECT");
	selectArray.forEach(select => {
		select.value = select.dataset.init
	})
}

function optionHandler(opt, t) {
	const modal = document.querySelector("#updateAccountModal");
	const pagei18n = currentPage === "USER" ? "accountSystem_createAccount" : "accountSystem_createCustomer"; 
	const page = Language[L][`${currentPage}${opt}`];
	modal.querySelector(".modal-header").innerHTML = `<h5 id="modalTitle" i18n="accountSystem_createAccount">${page}</h5>` 
	currentOption = opt;
	switch(opt) {
		case "CREATE":
		case "EDIT":
			const dataObject = JSON.parse(t.dataset.json);
			// 重置 error message
			form.querySelectorAll('.errorMessage').forEach(element => { element.classList.add("none") })
			// 重置 input tag effect
			form.querySelectorAll('.is-invalid').forEach(element => { element.classList.remove('is-invalid') })
			// 重置狀態 radio button
			modal.querySelectorAll("INPUT[name='status']").forEach(target => { target.checked = false })
			// status === 2 (刪除) => disable 全部 input
			modal.querySelectorAll(".setDisabled").forEach(target => { target.disabled = dataObject.modalStatus_2 })
			// opt === EDIT(編輯) => disable 使用者帳號
			modal.querySelector("#modalUserAccount").disabled = opt === "EDIT";
			// 重設輸入框 / 代入現有資料
			for(const key in dataObject) {
				modal.querySelector(`#${key}`).value = dataObject[key];
				modal.querySelector(`#${key}`).checked = true;
			}
			// 控制顯示 "負責客戶" 輸入框
			if(dataObject.modalRole === "admin" || currentPage === "CUSTOMER") {
				modal.querySelector("#handleCustomersGroup").classList.add("none")
			} else if(dataObject.modalRole === "sales" && currentPage === "USER") {
				modal.querySelector("#handleCustomersGroup").classList.remove("none")
				const checkedList = t.dataset.customerids.split(",");
				setCustomerStatusMap(checkedList);
			}
			$("#updateAccountModal").modal('show');
			break;
		case "DELETE":
			const requestData = {
				group_id : t.dataset.groupid,
				user_id : t.dataset.userid,
				status : "2"
			};
	 		if(confirm(Language[L][`deleteAndSendEmail${currentPage}`]) === true) {
	 			axios
	 			.post(MY_URL[`EDIT_${currentPage}`], requestData)
				.then(response => {
					if(response.status === 200 && currentPage === "USER") {
						alert(Language[L].accountSystem_deleteAccount_theAccountHasBeenDeleted);
					}
					getCustomers();
					query();
				})
	 		}
			break;
	}
}

function update() {
	const modal = document.querySelector("#updateAccountModal");
	const userAccountValue = modal.querySelector("#modalUserAccount").value.trim();
	const customerNameValue = modal.querySelector("#modalCustomerName").value.trim();
	const isUserDuplicated = Array.from(userSet.values()).map(user => user.id).includes(userAccountValue);
	const isCustomerDuplicated = Array.from(customerSet.values()).map(customer => customer.name).includes(customerNameValue);
	if(currentOption === "CREATE" && (isUserDuplicated || isCustomerDuplicated)) {
		alert(Language[L][`duplicated${currentPage}`]);
		return
	}
	const inputs = document.querySelectorAll(".modalHandleCustomer INPUT")
	const customerIds = [];
	customerStatusMap.forEach(customer => {
		if(customer.checked) {
			customerIds.push(customer.id)
		}
	})
	const status = modal.querySelector("#modalStatus_1").checked === true ? "1" : "0";
	const requestData = {
		"USER" : {
			"user_id" : userAccountValue,
			"user_name" : modal.querySelector("#modalUserName").value.trim(),
			"mobile_phone" : modal.querySelector("#modalPhone").value.trim(),
			"customer_ids" : customerIds,
			"user_role" : modal.querySelector("#modalRole").value,
			"status" : status
		},
 		"CUSTOMER" : {
 			"group_id" : modal.querySelector("#modalCustomerId").value,
 			"group_name" : customerNameValue,
 			"tel" : modal.querySelector("#modalPhone").value.trim(),
 			"address" : modal.querySelector("#modalAddress").value.trim(),
 			"email" : modal.querySelector("#modalEmail").value.trim(),
 			"currency_id" : modal.querySelector("#modalCurrency").value,
 			"status" : status
 		}
	}
	const form = document.querySelector("#form");
	const constraints = {};
	if(currentPage === "USER") {
		constraints.modalUserAccount = { presence: { message: "" } }
		constraints.modalUserName = { presence: { message: "" } }
	} else if(currentPage === "CUSTOMER") {
		constraints.modalCustomerName = { presence: { message: "" } }
	}
	// 重置 error message
	form.querySelectorAll('.errorMessage').forEach(element => { element.classList.add("none"); });
	// 重置 input tag effect
	form.querySelectorAll('.is-invalid').forEach(element => { element.classList.remove('is-invalid'); });
	const errorA = validate(form, constraints, { format: 'detailed' });
	const errors = errorA === undefined ? [] : errorA;
	// 檢查客戶別
	const checkedCustomerArray = [...customerStatusMap].filter(([key, customer]) => customer.checked).map(([key, customer]) => customer.id);
	if(checkedCustomerArray.length === 0 && currentPage === "USER" && requestData.USER.user_role === "sales") {
		errors.push({ "attribute": "checkedCustomerNameWrapper" })
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
		axios
		.post(MY_URL[`${currentOption}_${currentPage}`], requestData[currentPage])
		.then(response => {
			getUsers();
			getCustomers();
			query();
			alert(response.data.message);
			document.querySelector("#modalCanel").click();
			sessionStorage.setItem("userName",requestData[currentPage].user_name)
			sessionStorage.setItem("userPhone",requestData[currentPage].mobile_phone)
		})
	}
}
	
function onChangeRole(t) {
	if(t.value === "sales") {
		document.querySelector("#handleCustomersGroup").classList.remove("none");
	} else if(t.value === "admin") {
		document.querySelector("#handleCustomersGroup").classList.add("none");
	}
}
	
function customerCheckBoxHandler(cid, cname) {
	event.stopPropagation();
	const allCustomer = document.querySelector("#modalAllCustomer")
	if(cid === "0") {
		allCustomer.checked = !allCustomer.checked;
		customerStatusMap.forEach((customer, index) => {
			customer.checked = allCustomer.checked
		})
	} else {
		customerStatusMap.get(Number(cid)).checked = !customerStatusMap.get(Number(cid)).checked
	}
	setCheckedCustomerCheckBox();
	setCheckedCustomerName();
}
	
function setCustomerStatusMap(checkedArray) {
	customerStatusMap.forEach(customer => {
		customer.checked = false;
	})
	if(checkedArray[0] === "" || checkedArray[0] === "0") {
		customerStatusMap.forEach(customer => { customer.checked = false });
	} else {
		checkedArray.forEach(id => {
			customerStatusMap.get(Number(id)).checked = true;
		})
	}
	setCheckedCustomerName();
	setCheckedCustomerCheckBox();
}
	
function setCheckedCustomerName() {
	const array = [];
	customerStatusMap.forEach((customer, index) => {
		if(customer.checked) {
			array.push(customer.name)
		}
	})
	if(array.length === customerStatusMap.size) {
	document.querySelector("#checkedCustomerName").innerText =  L === "tw" ? "全選" : "All";
	} else if(array.length === 0) {
		document.querySelector("#checkedCustomerName").innerText = L === "tw" ? "請選擇" : "Please Choose";
	} else {
		document.querySelector("#checkedCustomerName").innerText = array.join(", ");
	} 
}
	
function setCheckedCustomerCheckBox() {
	const modal = document.querySelector("#updateAccountModal");
	const checkboxs = modal.querySelectorAll("#modalHandleCustomer INPUT")
	let checkedCounter = 0;
	checkboxs.forEach((checkbox, index) => {
		checkbox.checked = customerStatusMap.get(Number(checkbox.value)).checked
		if(customerStatusMap.get(Number(checkbox.value)).checked) {
			checkedCounter ++;
		}
	})
	modal.querySelector("#modalAllCustomer").checked = (checkboxs.length === checkedCounter)
}
	
function showOverDayModal() {
	axios
	.get(MY_URL.GET_OVERDAY)
	.then(response => {
		document.querySelector("#modalOverDay").value = response.data.responseInfo[0].over_day;
	})
	$("#overDayModal").modal('show');
}

function editOverDay() {
	const requestData = {
		"over_day" : document.querySelector("#modalOverDay").value
	}
	axios
	.post(MY_URL.EDIT_OVERDAY, requestData)
	.then(response => {
		const responseData = response.data
		alert(responseData.message);
		if(responseData.status === "0") {
			document.querySelector("#overDayCancelBtn").click();
		}
	})
}