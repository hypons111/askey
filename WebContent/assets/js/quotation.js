var L = localStorage.getItem("askeyLanguage");
var role = sessionStorage.getItem("userRole");
var projectId = sessionStorage.getItem("p_id");
var customerId = sessionStorage.getItem("q_customerId");
var adminModal = document.querySelector("#adminQuotationItemModal");
var salesmanModal = document.querySelector("#salesQuotationItemModal");
var currentModal;
var currentCategory = "";
var searchBarData = ""; // 清除 search bar 時使用
var mandatoryList = [];
var itemNameSet = new Set();
var checkedItemId = new Set();
var checkedItemName = new Set();
var relativeHtmlString = "";
var favoriteItemHTML = {
	"1" : "",
	"2" : "",
	"3" : "",
}
var jiraItemHTML = "";
var commonItem = {}
var dataStatus = [];
var statusData = {
	lumpSumDropdownList : [],
	lumpSumA : "3", // price
	lumpSumB : "2", //qty
	currentItemList : [],
	checkboxStatus : {},
	allItemIdArray : [],
	allDataIdArray : [],
	jiraIdList : [],
}
var MY_URL = {
	get_favoriteQuotations : "qms01.do?method=queryCommonProject",	// 取得常用 quotation
	get_favoriteItems : "qms04.do?method=queryCommon",				// 取得常用 item
	get_quotationsData : "qms02.do?method=queryProjectItem",		// 取得 quotation 
	get_jira : "qms03.do?method=queryJiraAsset",					// 取得 jira 
	add_normal : "qms02.do?method=newProjectItem",					// admin, salesman 新增 normal item
	edit_normal : "qms02.do?method=updateItem",						// admin, salesman 修改 normal item
	admin_update_relative : "qms02.do?method=updateItemRelation",	// admin 更新 relative item
	salesman_create_relative : "qms02.do?method=saveCommonItem",	// salesman 新增 relative item
	updateItemData : "qms02.do?method=updateItemData",				// admin, salesman 更新 item data
}

$(document).ready(function () {
	getFavoriteItemHTML().then(htmlObject => {
		favoriteItemHTML = htmlObject;
	})
	getJiraItemHTML().then(html => {
		jiraItemHTML = html;
	})
	checkUserRole();
	getQuotation(true, true);
	Utils.SetI18N();
	initialize();
	getfavoriteProjects();
})

function checkUserRole() {
	if(role === "admin") {
		document.querySelectorAll(".adminBtn").forEach(btn => { btn.classList.remove("none") })
	} else if(role === "sales") {
		document.querySelectorAll(".salesBtn").forEach(btn => { btn.classList.remove("none") })
	}
}

function getfavoriteProjects() {
	const requestData = {
		"customer_id" : sessionStorage.getItem("q_customerId")
	};
	axios
	.post(MY_URL.get_favoriteQuotations, requestData)
	.then(response => {
		const projects = response.data.responseInfo;
		for(let i=0; i<projects.length; i++) {
			commonItem[projects[i].common_category] = projects[i].common_item_datas
		}
	}).then(projectHtmlString => {
		const customerI18nString = Language[L].exporting
		document.querySelector("#customerName").innerHTML = `(${customerI18nString} : ${sessionStorage.getItem("q_customerName")})`;
	})
}

function quotationReturn() {
	if(document.querySelector("#editTableBtn") && document.querySelector("#editTableBtn").classList.contains("none")) {
		if(confirm("品項尚未儲存，是否要離開?")) {
			Utils.Router();
		}
	} else {
		Utils.Router();
	}
}

function initialize() {
	document.querySelector("#pId").value = projectId;
	document.querySelector("#name").innerText = `${sessionStorage.getItem("q_name")} (id:${sessionStorage.getItem("p_id")})`;
	document.querySelector("#description").innerText = sessionStorage.getItem("q_desc") === "" ? Language[L].description : sessionStorage.getItem("q_desc");
}

function getFavoriteItemHTML() {
	return new Promise((resolve, reject) => {
		const requestData = {}
		if(role === "sales") {
			requestData.customer_id = sessionStorage.getItem("q_customerId");
		}
		axios
		.post(MY_URL.get_favoriteItems, requestData)
		.then(response => {
			const selectHTMLStart = "<select class='form-select favoriteItem none' onchange='onchangeFavoriteItem(this)'><option i18n='pleaseChoose' value='0' disabled selected>請選擇</option>";
			const selectHTMLEnd = "</select>";
			const html = {
				"1" : selectHTMLStart,
				"2" : selectHTMLStart,
				"3" : selectHTMLStart,
			};
			const itemArr = response.data.responseInfo;
			for(let i=0; i<itemArr.length; i++) {
				if(itemArr[i].customer_id == customerId) {
					let c_price = role === "admin" ? `(${itemArr[i].c_price})` : "";
					html[`${itemArr[i].category}`] += `<option value="${itemArr[i].c_name}^${itemArr[i].c_price}^${itemArr[i].unit}">${itemArr[i].c_name} ${c_price}&ensp;</option>`
				}
			}
			html["1"] += selectHTMLEnd;
			html["2"] += selectHTMLEnd;
			html["3"] += selectHTMLEnd;
			resolve(html);
		})
	})
}
function getJiraItemHTML() {
	return new Promise((resolve, reject) => {
		axios
		.post(MY_URL.get_jira)
		.then(response => {
			let htmlString = `<option value='0' selected disabled>${Language[L].selectAssetProject}</option>`
			response.data.responseInfo.forEach(item => {
				htmlString += `<option value="${item.a_gid}">${item.asset_name}</option>`
			})
			resolve(htmlString);
		})
	})
}

// 查詢報價
function getQuotation(side, main) {
	const requestData = {
		"p_id": sessionStorage.getItem("p_id"),
		"item_id": "",
		"data_included": "Y"
	}
	axios
	.post(MY_URL.get_quotationsData, requestData)
	.then(response => {
		statusData.currentItemList.length = 0;
		const responseInfo = response.data.responseInfo;
		if(responseInfo.length === 0) {
			document.querySelector("#totalSum").innerText = Language[L].totalPrice;
		} else {
			for(let i=0; i<responseInfo.length; i++) {
				statusData.allItemIdArray.push(responseInfo[i].item_id);
				responseInfo[i].datas.forEach(data => {
					statusData.allDataIdArray.push(data.data_id);
				})
				const tempCheckedObj = {};
				const tempCheckedKey = responseInfo[i].item_id;
				itemNameSet.add(responseInfo[i].item_name);
				statusData.jiraIdList[`${responseInfo[i].item_id}`] = "";
				const list = [];
				responseInfo[i].jiras.forEach(jira => {
					list.push(jira.jira_id);
				})
				statusData.jiraIdList[`${responseInfo[i].item_id}`] = list;
				statusData.currentItemList.push({
			      "item_id": responseInfo[i].item_id,
			      "item_name": responseInfo[i].item_name,
			      "checkedArray" : tempCheckedObj
				})
			}
		}
		toggleEmptyTable(responseInfo.length);
		if(side) { 
			showQuotationSide(responseInfo);
		}
		if(main) {
			if(typeof sessionStorage.getItem("itemId") === "object" && responseInfo[0]) {
				showQuotationMain(responseInfo[0].item_id);
			} else {
				showQuotationMain(sessionStorage.getItem("itemId"));
			}
		}
		Utils.SetI18N();
	})
}

//總金額
function getTotalPrice() {
	exportHandler().then(requestData => {
		requestData.p_id = sessionStorage.getItem("p_id");
		requestData.item_id = sessionStorage.getItem("itemId");
		
		if(requestData.detail.length === 0) {
			requestData.detail.push({ 
				"data_ids" : "",
				"data_gids" : []
			})
		}	
		axios
		.post("qms02.do?method=queryTotalPrice", requestData)
		.then(response => { 
			const r = response.data.responseInfo;
			const currency = r.currency_id.toUpperCase();
			document.querySelector("#totalSum").innerText = `${Language[L].totalPrice} (${currency}) ${r.sumtotal}`;
			document.querySelector("#dataTableSum").innerText = `${Language[L].subtotal} (${currency}) ${r.itemtotal}`;
		})
	})
}

//更新 sidebar
function showQuotationSide(data) {
	const pId = document.querySelector("#pId").value;
	const engineering = document.querySelector("#engineeringWrapper");
	const Service = document.querySelector("#ServiceWrapper");
	const other = document.querySelector("#otherWrapper");
	engineering.innerHTML = ""
	Service.innerHTML = ""
	other.innerHTML = ""
	data.forEach((item, index) =>{
		let checkboxStatus = sessionStorage.getItem(item.item_id+"checkDataIds");
		if(checkboxStatus === null) {
			checkboxStatus = [];
		} else {
			checkboxStatus = checkboxStatus.split(",");
		}

		let checkedCounter = 0;
		for(let i=0; i<item.datas.length; i++) {
			if(checkboxStatus.includes(item.datas[i].data_id.toString())) {
				checkedCounter++;
			}
		}
		const isJiras = item.jiras.length === 0 ? "" : "<i class='fa-solid fa-link'></i>"
		let isRed = "";
		if(typeof sessionStorage.getItem("itemId") === "string") {
			if(item.item_id == sessionStorage.getItem("itemId")) {
				isRed = "FC_askeyRed";
			}
		} else {
			isRed = index === 0 ? "FC_askeyRed" : "";
		}
		if(isRed === "FC_askeyRed") {
			currentCategory = item.category;
		}
		let html = `<div class="item pointer ${isRed}" data-category="${item.category}" onclick="setColor(this)">
						<div class="part" data-obj='${JSON.stringify(item)}' onclick="showQuotationMain(${item.item_id});">
							<span>${item.item_name}</span>
							<span class="fitContent">${isJiras}</span>
							<span id="counter${item.item_id}" class="fitContent">(${checkedCounter}/${item.datas.length})</span>
							<div class="salesDeletebtn none" onclick="deleteItem(${pId}, ${item.item_id}, '${item.item_name}')">
								<i class="fa-solid fa-trash-can pointer" i18n="delete" title="刪除"></i>
							</div>
						</div>
						<div class="btn-group">
							<button type="button" class="btn dropdown-toggle"
								data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
								<i class="fa-solid fa-ellipsis"></i>
							</button>
							<div class="dropdown-menu dropdown-menu-right">
								<button class="dropdown-item adminEditBtn none" type="button" onclick="showAdminItemModal(${item.item_id})">${Language[L].edit}</button>
								<button class="dropdown-item salesmanEditBtn none" type="button" onclick="showSalesmanItemModal(${item.item_id}, 'edit')">${Language[L].edit}</button>
								<button class="dropdown-item" type="button" onclick="duplicateItem(${item.item_id}, '${item.item_name}', '${item.item_desc}', '${item.category}')">${Language[L].copy}</button>
								<button class="dropdown-item" type="button" onclick="deleteItem(${pId}, ${item.item_id}, '${item.item_name}')">${Language[L].delete}</button>
							</div>
						</div>
					</div>`
		switch(item.category) {
			case "1":
				engineering.innerHTML += html;
				break;
			case "2":
				Service.innerHTML += html;
				break;
			case "3":
				other.innerHTML += html;
				break;
		}
	})
	Utils.ShowFunctionByRole([".fa-gear", ".fa-square-plus", ".adminEditBtn"], [".salesmanEditBtn"]);
}
function setColor(t) {
	currentCategory = t.dataset.category;
	document.querySelectorAll("#categoryWrapper .item").forEach(item => {
		item.classList.remove("FC_askeyRed");
	})
	t.classList.add("FC_askeyRed")
}

//更新 search bar
function showSearchItems(data) {
	if(!data) return 
	if(typeof data === "string") {
		data = JSON.parse(data)
	}
	searchBarData = data; // 清除 search bar 時使用
	let htmlString = "";
	for(let i=0; i<data.attributes.length; i++) {
		let dataname = data.attributes[i].attr_name;
		let is_show = data.attributes[i].is_show;
		let datanamehtml =""; 
		switch(dataname) {
			case "name" :
				datanamehtml = `<label class="form-check-label" i18n="name">名稱</label>`;	
				break;
			case "qty" :
				datanamehtml = `<label class="form-check-label" i18n="quantity">數量</label>`;	
				break;
			case "price" :
				datanamehtml = `<label class="form-check-label" i18n="price">價格</label>`;	
				break;
			case "unit" :
				datanamehtml = `<label class="form-check-label" i18n="unit">單位</label>`;	
				break;
			default :
				datanamehtml = `<label class="form-check-label">${data.attributes[i].attr_name}</label>`;
				break;
		}
		if(is_show == "Y"){
			switch(data.attributes[i].data_type) {
				case "1" :
				case "2" :
					htmlString += `<div class="form-check" data-attrid="${data.attributes[i].attr_id}" data-attrtype="${data.attributes[i].data_type}">
									<label class="form-check-label" for="">${datanamehtml}</label>
									<div class="btn-group">
										<select id="" class="form-select" aria-label="" onchange="onchangeToBetween(this); onchangeToQueryAll(this)">
											<option value="0" i18n="all" selected>全選</option>
											<option value="b1" i18n="lessThan">少於</option>
											<option value="b2" i18n="equals">等於</option>
											<option value="b3" i18n="greaterThan">大於</option>
											<option value="b4" i18n="between">介於</option>
										</select>
									</div>
									<input class="dropdownInput normalInput" type="text" value="" disabled>
									<div class="none betweenInput">
										<input class="dropdownInput startNumber" type="text" value="">~
										<input class="dropdownInput endNumber" type="text" value="">
									</div>
								</div>`	
					break
				case "3" :
					htmlString += `<div class="form-check" data-attrid="${data.attributes[i].attr_id}" data-attrtype="${data.attributes[i].data_type}">
									<label class="form-check-label" for="">${datanamehtml}</label>
									<div class="btn-group">
										<select id="" class="form-select" aria-label="" onchange="onchangeToQueryAll(this)">
											<option value="0"i18n="all" selected >全選</option>
											<option value="a1" i18n="is">是</option>
											<option value="a2" i18n="isNot">不是</option>
											<option value="a3" i18n="contains">包含</option>
											<option value="a4" i18n="doesNotContain">不包含</option>
											<option value="a5" i18n="startsWith">始於</option>
											<option value="a6" i18n="endsWith">結束於</option>
											<option value="a7" i18n="isEmpty">空值</option>
											<option value="a8" i18n="isNotEmpty">非空值</option>
										</select>
									</div>
									<input class="dropdownInput" type="text" value="" disabled>
								</div>`
					break
				case "4" :
					htmlString += `<div class="form-check" data-attrid="${data.attributes[i].attr_id}" data-attrtype="${data.attributes[i].data_type}">
										<label class="form-check-label" for="">${datanamehtml}</label>
										<input class="dtr">
									</div>`
					break
				case "5" :
					htmlString += `<div class="form-check" data-attrid="${data.attributes[i].attr_id}" data-attrtype="${data.attributes[i].data_type}">
										<label class="form-check-label" for="">${datanamehtml}</label>
										<input class="dr">
									</div>`
					break
				}
			}
	}
	
	document.querySelector("#inputWrapper").innerHTML = htmlString
	Utils.SetDateTime("#mainMiddle", "all");
	Utils.SetI18N();
}
function onchangeToQueryAll(t) {
	if(t.value === "0" || t.value === "a7" || t.value === "a8") {
		t.parentElement.nextElementSibling.value = "";
		t.parentElement.nextElementSibling.disabled = true;
	} else {
		t.parentElement.nextElementSibling.disabled = false;
	}
}
function onchangeToBetween(t) {
	if(t.value === "b4") {
		t.parentElement.parentElement.querySelector(".normalInput").classList.add("none");
		t.parentElement.parentElement.querySelector(".betweenInput").classList.remove("none");
	} else {
		t.parentElement.parentElement.querySelector(".normalInput").classList.remove("none");
		t.parentElement.parentElement.querySelector(".betweenInput").classList.add("none");
	}
}

function queryItemData() {
	const requestData = {
		"p_id": sessionStorage.getItem("p_id"),				//報價專案代碼
		"item_id": sessionStorage.getItem("itemId"),		//類型代碼
		"querys":[]
	}
	const queryConditionArray = document.querySelectorAll("#inputWrapper .form-check");
	queryConditionArray.forEach(item => {
		let opType = "";
		let value1 = "";
		let value2 = ""; 
		try {
			if(item.dataset.attrtype === "4" || item.dataset.attrtype === "5") {
				const value = item.querySelector("input").value.split(" - ")
				value1 = value[0];
				value2 = value[1];
				opType = "c1"
			} else if(!item.querySelector(".dropdownInput").classList.contains("none")) {
				if(item.firstElementChild.nextElementSibling.firstElementChild.value !== "0") {
					value1 = item.querySelector(".dropdownInput").value
					opType = item.firstElementChild.nextElementSibling.firstElementChild.value
				}
			} else {
				if(item.firstElementChild.nextElementSibling.firstElementChild.value !== "0") {
					value1 = item.querySelector(".startNumber").value
					value2 = item.querySelector(".endNumber").value
					opType = item.firstElementChild.nextElementSibling.firstElementChild.value
				}
			}
		} catch(e) { 
			console.error("error catched")
		} 
		requestData.querys.push({
			"attr_id": item.dataset.attrid,			//查詢欄位代碼
			"attr_value": value1,					//查詢欄位值
			"attr_value2": value2,					//操作類型為b4, c1, c2請將迄值放這裡
			"op_type": opType						//操作類型, 請參照上圖, b4, c1, c2請多放
		})
	})
	axios
	.post("qms02.do?method=queryItemData", requestData)
	.then(response => {
		if(response.data.responseInfo[0].datas.length === 0) {
			alert(Language[L].noMatchingInformation);
		} else {
			setDataTable(response.data.responseInfo[0]);
		}
	})
}

function initSearchBar() {
	showSearchItems(searchBarData);
}

function setDataTable(itemDataData) {
	if(!itemDataData) { return; }
	let isShowIcon = undefined;
	if(itemDataData.jiras) {
		isShowIcon = itemDataData.jiras.length === 0 ? false : true;
	}
	let tempData = "";
	itemDataData.jiras.forEach(item => {
		if(item.jira_id !== "") {
			tempData += (item.jira_id + ",");
		}
	})
	sessionStorage.setItem("jiraIdList", tempData);
	const column = [
		{
			title: "<input type='checkbox' data-checked='all' id='quotationAll' class='all' onclick='saveCheckboxStatus(this);checkAllHandler(this)' disabled/>",
			render: function (data, type, row, meta) {
				return data
			},
		},{
			title: "<p i18n='no'>序號</p>",
			render: function (data, type, row, meta) {
				return data
			},
		}
	];
	mandatoryList.length = 0;
	const inputNameArray = ["", "", ""]
	const otherAttrArray = [];
	for(let i=0; i<itemDataData.attributes.length; i++) {
		inputNameArray.push(itemDataData.attributes[i].attr_name)
		mandatoryList.push(itemDataData.attributes[i].is_mandatory === "Y");
		const attrName = itemDataData.attributes[i].attr_name;
		const is_show = itemDataData.attributes[i].is_show;
		let title = "";
		if((attrName === "name" || attrName === "qty" || attrName === "price") || attrName === "unit") {
			title = `<p class='starBefore' i18n="${itemDataData.attributes[i].attr_name}">${itemDataData.attributes[i].attr_name}</p>`;
		} else {
			if(itemDataData.attributes[i].is_mandatory === "Y") {
				title = `<p class='starBefore'>${itemDataData.attributes[i].attr_name}</p>`;
			} else {
				title = `<p>${itemDataData.attributes[i].attr_name}</p>`;
			}
		}
		if(is_show==="Y"){
			column.push({
				title: title,
				render: function (data, type, row, meta) {
					return data
				}
			})
		}
	}
	otherAttrArray.forEach(attr => {
		column.push({
			title: attr,
			render: function (data, type, row, meta) {
				return data
			}
		})
	})
	column.push({
		title: `<span id="editTableBtn" class="btn btn-secondary" onclick="editTable(this)">${Language[L].edit}</span>
			<span id="saveTableBtn" class="btn btn-danger none" onclick="saveTable()">${Language[L].save}</span>`,
		render: function (data, type, row, meta) {
			return data
		},
	})
	const tableData = [];
	const d = itemDataData.datas.length > 0 ? itemDataData.datas : [];
	let checkCounter = 0;
	if(d.length === 0) {
		let row = []
		row.push(`<input class="checkbox" name="" type="checkbox" disabled/>`);
		row.push(`<input name="" type="text" data-dataid="" value="1" disabled/>`);
		if (isShowIcon) {
			row.push(`<i class="fa-solid fa-file-circle-plus pointer none" data-status="N" onclick="showFavoriteItemDropDown(this)" i18n="addData" title="新增品項"></i>
						<input name="" class="disableSwitch" type="text" data-name="name" data-mandatory="Y" disabled/>
						${favoriteItemHTML[currentCategory]}
						<i class="fa-solid fa-up-right-from-square attrIcon" onclick="attrIconShowAlert(this)"></i>`);
		} else {
			row.push(`<i class="fa-solid fa-file-circle-plus pointer none" data-status="N" onclick="showFavoriteItemDropDown(this)" i18n="addData" title="新增品項"></i>
						<input name="" class="disableSwitch" type="text" data-name="name" data-mandatory="Y" disabled/>
						${favoriteItemHTML[currentCategory]}`);
		}
		row.push(`<input class='disableSwitch relativeDisableSwitch' type='number' data-name="qty" data-mandatory="Y" value="0" disabled>`);
		if(role === "admin" || itemDataData.attributes[2].is_show === "Y") {
			row.push(`<input class='disableSwitch' type='number' data-name="price" data-mandatory="Y" disabled>`);
		}
		if (isShowIcon) {
			row.push(`<input class='disableSwitch relativeDisableSwitch' type='text' data-name="unit" data-mandatory="Y" value="式" disabled>`);
		} else {
			row.push(`<input class='disableSwitch' type='text' data-name="unit" data-mandatory="Y" value="" disabled>`);
		}
		
		for(let i=4; i<itemDataData.attributes.length; i++) {
			mandatoryList[i] = mandatoryList[i] === true ? "Y" : "N";
			if(itemDataData.attributes[i].attr_name === "name" || itemDataData.attributes[i].attr_name === "qty" || itemDataData.attributes[i].attr_name === "price" || itemDataData.attributes[i].attr_name === "unit") continue;
			if(itemDataData.attributes[i].data_type === "3") {
				row.push(`<input class='disableSwitch' type='text' data-name="${inputNameArray[i+3]}" data-mandatory="${mandatoryList[i]}" disabled>`)
			} else if(itemDataData.attributes[i].data_type === "4") {
				row.push(`<input class='disableSwitch dtr' type='text' data-name="${inputNameArray[i+3]}" data-mandatory="${mandatoryList[i]}" onchange="Utils.ClearDate(this)" disabled>`)
			} else if(itemDataData.attributes[i].data_type === "5") {
				row.push(`<input class='disableSwitch dr' type='text' data-name="${inputNameArray[i+3]}" data-mandatory="${mandatoryList[i]}" onchange="Utils.ClearDate(this)" disabled>`)
			} else {
				row.push(`<input class='disableSwitch' type='number' data-name="${inputNameArray[i+3]}" data-mandatory="${mandatoryList[i]}" disabled>`)
			}
		}
		isShowDuplicate = role === "admin" ? "<i class='fa-solid fa-copy' onclick='duplicateAttribute(this)' i18n='copy' title='複製'></i>" : "";
		row.push(`<span class="optionGroup none"><i class="fa-regular fa-square-plus" onclick="toggleItem(this, '+')" i18n='createnext' title='新增下一筆'></i>
					${isShowDuplicate}
					<i class="fa-solid fa-trash-can" onclick="toggleItem(this, '-')" i18n='delete' title='刪除'></i>
				</span>`)
		tableData.push(row);
	} else {
		typeof sessionStorage.getItem("assetCheckboxStatus") === "string" ? qty = sessionStorage.getItem(`${itemId}`) : qty = "1";	
		for(let i=0; i<d.length; i++) {
			let row = [];
			const arr = JSON.parse(sessionStorage.getItem(`${d[i].data_id}`))
			let qty = typeof sessionStorage.getItem(`${d[i].data_id}`) === "string" ? JSON.parse(sessionStorage.getItem(`${d[i].data_id}`)).length : "0";
			let checkedList;
			try {
				checkedList = sessionStorage.getItem(itemDataData.item_id+"checkDataIds").split(",");
			} catch(e) {
				checkedList = [];
			}
			if(checkedList.length > 0 && checkedList.includes(d[i].data_id.toString())) {
				checkCounter ++;
				row.push(`<input class="checkbox" type='checkbox' data-dataid="${d[i].data_id}" onclick="saveCheckboxStatus(this);checkAllHandler(this);" checked disabled/>`);
			} else {
				row.push(`<input class="checkbox" type='checkbox' data-dataid="${d[i].data_id}" onclick="saveCheckboxStatus(this);checkAllHandler(this);" disabled/>`);
			}
			row.push(`<input class="showIcon" type='text' data-dataid="${d[i].data_id}" value='${i+1}' disabled/>`);
			if(typeof d[i].name != "undefined"){
				const name = d[i].name.replaceAll("'", "’").replaceAll('"', '＂')
				if(isShowIcon) {
					row.push(`<i class="fa-solid fa-file-circle-plus pointer none" data-status="N" onclick="showFavoriteItemDropDown(this)" i18n='create' title='新增品項'></i>
								<input class='disableSwitch' type='text' data-name="name" data-mandatory="Y" value='${name}' disabled/>
								${favoriteItemHTML[currentCategory]}
							<i class="fa-solid fa-up-right-from-square attrIcon blue" onclick="loadAttrView(this, '${d[i].data_id}');attrIconShowAlert(this);"></i>`);
				} else {
					row.push(`<i class="fa-solid fa-file-circle-plus pointer none" data-status="N" onclick="showFavoriteItemDropDown(this)" i18n='create' title='新增品項'></i>
								<input class='disableSwitch' type='text' data-name="name" data-mandatory="Y" value='${name}' disabled/>
								${favoriteItemHTML[currentCategory]}`);
				}
			}
			if(typeof d[i].qty != "undefined"){
				if(isShowIcon) {
					row.push(`<input class='disableSwitch relativeDisableSwitch' data-name="name" data-mandatory="Y" type='number' value='${qty}' disabled/>`);
				} else {
					row.push(`<input class='disableSwitch relativeDisableSwitch' data-name="name" data-mandatory="Y" type='number' value='${d[i].qty}' disabled/>`);
				}
			}
			if(typeof d[i].price != "undefined"){
				row.push(`<input class='disableSwitch' type='number' data-name="name" data-mandatory="Y" value='${d[i].price}' disabled/>`);
			}
			if(typeof d[i].col4 != "undefined"){
				if(isShowIcon) {
					row.push(`<input class="" type="text" data-name="unit" data-mandatory="Y" value="式" disabled>`)
				} else {
					row.push(`<input class="disableSwitch" type="text" data-name="unit" data-mandatory="Y" value="${d[i].col4}" disabled>`)
				}
			}
			const attributes = itemDataData.attributes.slice(4, itemDataData.attributes.length)
			const excepts = itemDataData.except;
			for(let j=0; j<attributes.length; j++) {
				if(attributes[j].is_show === "N") {
					//  don't list for sales
				} else {
					const value = typeof d[i][`col${j+5}`] === "object" ? "" : d[i][`col${j+5}`]
					if(typeof d[i][`col${j+4}`] === "object" || typeof d[i][`col${j+4}`] === "undefined") {
						d[i][`col${j+4}`] = ""
					}
					if(attributes[j].data_type === "3") {
						row.push(`<input class='disableSwitch' type='text' data-name="${attributes[j].attr_name}" data-mandatory="${attributes[j].is_mandatory}" value="${value}" disabled>`)
					} else if(attributes[j].data_type === "4") {
						row.push(`<input class='disableSwitch dtr' type='text' data-name="${attributes[j].attr_name}" data-mandatory="${attributes[j].is_mandatory}" value="${value}" onchange="Utils.ClearDate(this)" disabled>`)
					} else if(attributes[j].data_type === "5") {
						row.push(`<input class='disableSwitch dr' type='text' data-name="${attributes[j].attr_name}" data-mandatory="${attributes[j].is_mandatory}" value="${value}" onchange="Utils.ClearDate(this)" disabled>`)
					} else {
						row.push(`<input class='disableSwitch' type='number' data-name="${attributes[j].attr_name}" data-mandatory="${attributes[j].is_mandatory}" value="${value}" disabled>`)
					}
				}
			}
			isShowDuplicate = role === "admin" ? "<i class='fa-solid fa-copy' onclick='duplicateAttribute(this)' i18n='copy' title='複製'></i>" : "";
			row.push(`<span class="optionGroup none"><i class="fa-regular fa-square-plus" onclick="toggleItem(this, '+')" i18n='createnext' title='新增下一筆'></i>
					${isShowDuplicate}
					<i class="fa-solid fa-trash-can" onclick="toggleItem(this, '-')" i18n='delete' title='刪除'></i>
			</span>`)
			tableData.push(row);
		}
	}
	document.querySelector("#mainBottom").innerHTML = "</div><table data-itemid='' id='itemTable'></table><div id='dataTableSum'><div>"
	const t = $("#itemTable").DataTable({
		"language": Language[`${L}`],
		"columns": column,
		"data": tableData,
		"destroy": true,
		"dom": '<"top"i>rt',
		"info": false,
		"ordering": false,
		"paging": false,
		"searching": false,
		"drawCallback": function(settings) {
			Utils.SetI18N();
			getTotalPrice();
		},
	})
	if(t) {
		let checkCounter = 0;
		let totalCounter = 0;
		const trList = document.querySelectorAll("#itemTable tbody tr")
		for(let i=0; i<trList.length; i++) {
			if(trList[i].firstElementChild.firstElementChild.checked) {
				checkCounter ++;
			}
			if(trList[i].firstElementChild.firstElementChild.dataset.dataid) {
				totalCounter ++;
			}
		}
		if(document.querySelector(`#counter${sessionStorage.getItem("itemId")}`)) {
			document.querySelector(`#counter${sessionStorage.getItem("itemId")}`).innerText = `(${checkCounter}/${totalCounter})`;
		}
		if(checkCounter === trList.length) {
			document.querySelector("#quotationAll").checked = true;
		} else {
			document.querySelector("#quotationAll").checked = false;
		}
	}
}

function showFavoriteItemDropDown(t) {
	if(sessionStorage.getItem("userRole") === "sales" && t.nextElementSibling.value === "") {
		return;
	} else  {
		if(t.dataset.status === "N") {
			t.dataset.status = "Y";
			t.parentElement.querySelector("INPUT").classList.add("none");
			t.parentElement.querySelector("SELECT").classList.remove("none");
		} else if(t.dataset.status === "Y") {
			t.parentElement.querySelector("INPUT").classList.remove("none");
			t.parentElement.querySelector("SELECT").classList.add("none");
			t.dataset.status = "N";
		}
	}
}

function onchangeFavoriteItem(t) {
	const valueArray = t.value.split("^");
	showFavoriteItemDropDown(t.previousElementSibling.previousElementSibling);
	t.previousElementSibling.value = valueArray[0];
	t.parentElement.nextElementSibling.nextElementSibling.firstElementChild.value = valueArray[2];
	if(role === "admin") {
		t.parentElement.nextElementSibling.nextElementSibling.firstElementChild.value = valueArray[1];
		if(!t.nextElementSibling) {
			t.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.value = valueArray[2];
		}
	} else if(role === "sales") {
		t.classList.add("none");
		t.previousElementSibling.classList.remove("none");
		t.previousElementSibling.dataset.price = valueArray[1];
	}
}

function attrIconShowAlert(t) {
	if(!t.classList.contains("blue")) {
		alert("請先儲存");
	}
}

// 更新 dataTable
function showQuotationMain(itemId) {
	sessionStorage.setItem("itemId", itemId)
	const requestData = {
		"p_id": document.querySelector("#pId").value,
		"item_id": itemId,
		"data_included": "Y"
	}
	axios
	.post("qms02.do?method=queryProjectItem", requestData)
	.then(response => {
		setDataTable(response.data.responseInfo[0]);
		showSearchItems(response.data.responseInfo[0])
	})		
}

function checkItemWhenChangedPage() {
	document.querySelector(".all").checked = true;
	const trs = document.querySelectorAll("#itemTable tbody tr");
	for(let i=0; i<trs.length; i++) {
		if(trs[i].firstElementChild.firstElementChild.checked === false) {
			document.querySelector(".all").checked = false;
		}
	}
}

function checkAllHandler(t) {
	const itemId = sessionStorage.getItem("itemId");
	if(t.classList.contains("all")) {
		statusData.checkboxStatus[`${itemId}`] = [];
		const trList = t.parentElement.parentElement.parentElement.nextElementSibling.querySelectorAll("tr");
		for(let i=0; i<trList.length; i++) {
			target = trList[i].firstElementChild.firstElementChild;
			target.checked = t.checked;
			if(t.checked === true) {
				if (!statusData.checkboxStatus[`${itemId}`].includes(t.dataset.dataid)) {
					statusData.checkboxStatus[`${itemId}`].push(target.dataset.dataid);
				}
			}
		}
	} else {
		const trList = t.parentElement.parentElement.parentElement.querySelectorAll("tr");
		let counter = 0;
		for(const tr of trList) {
			if(tr.firstElementChild.firstElementChild.checked) {
				counter ++;
			}
		}
		const checkboxAll = t.parentElement.parentElement.parentElement.previousElementSibling.querySelector(".all");
		if(counter === trList.length) {
			checkboxAll.checked = true;
			checkboxAll.dataset.checked = "all";
		} else if(counter === 0) {
			checkboxAll.checked = false;
			checkboxAll.dataset.checked = "none";
		} else {
			checkboxAll.checked = false;
			checkboxAll.dataset.checked = "";
		}
	}
}

// 紀錄 data 的勾選狀態
function saveCheckboxStatus(t) {
	const currentItemId = sessionStorage.getItem("itemId");
	const trList = document.querySelectorAll("#itemTable_wrapper TBODY TR")
	const checkedArray = []
	if(t.id === "quotationAll") {
		if(t.checked) {
			trList.forEach(tr => {
				checkedArray.push(tr.firstElementChild.querySelector("INPUT").dataset.dataid)
			})
		} else {
			checkedArray.length = 0;
		}
	} else {
		trList.forEach(tr => {
			if(tr.firstElementChild.querySelector("INPUT").checked) {
				checkedArray.push(tr.firstElementChild.querySelector("INPUT").dataset.dataid)
			}
		})
	}
	statusData.checkboxStatus[currentItemId] = [];
	statusData.checkboxStatus[currentItemId] = checkedArray;
	for(const key in statusData.checkboxStatus) {
		sessionStorage.setItem(key+"checkDataIds", statusData.checkboxStatus[key])
	}
}

function loadAttrView(t, dataId) {
	if(!t.classList.contains("blue")) {
		return;
	}
	Swal.fire({ title : Language[L].loading })
	const requestData = {
		"jira_id": sessionStorage.getItem("jiraIdList").split(",")
	}
	axios
		.post("qms03.do?method=queryAssetData", requestData)
		.then(resopnse => {
			sessionStorage.setItem("assetData", JSON.stringify(resopnse.data.responseInfo))
		})
		.then(() => {
			if(typeof dataId === "object") {
				sessionStorage.setItem("dataId", sessionStorage.getItem("newDataId"));
			} else {
				sessionStorage.setItem("dataId", dataId);
			}
			sessionStorage.setItem("checkboxStatus", JSON.stringify(statusData.checkboxStatus));
			Utils.LoadPage("asset", "X");
			document.querySelector(".swal2-confirm").click();
		})
}

function editTable(t) {
	t.parentElement.parentElement.firstElementChild.firstElementChild.disabled = false;
	t.classList.add("none")
	t.nextElementSibling.classList.remove("none")
	const table = document.querySelector("#itemTable");
	const tbody = table.querySelector("TBODY");
	// thead  checkbox
	table.querySelector(".all").disabled = false;
	// tbdoy checkbox
	table.querySelectorAll(".checkbox").forEach(item => {
		item.disabled = false;
	})
	if(role === "admin") {
		// inputs
		table.querySelectorAll(".disableSwitch").forEach(item => {
			item.disabled = false;
		})
		// asset icon
		if(table.querySelector(".fa-up-right-from-square")) {
			if(!table.querySelector(".fa-up-right-from-square").classList.contains("none")) {
				table.querySelectorAll(".relativeDisableSwitch").forEach(item => {
					item.disabled = true;
				})
			}
		}
	} else if(role === "sales") {
		if(table.querySelector(".fa-up-right-from-square")) {
			if(!table.querySelector(".fa-up-right-from-square").classList.contains("none")) {
				table.querySelectorAll(".relativeDisableSwitch").forEach(item => {
					item.disabled = true;
				})
			}
		} else {
			table.querySelectorAll(".relativeDisableSwitch").forEach(item => {
				item.disabled = false;
			})
		}
		tbody.querySelectorAll("TR").forEach(tr => {
			const tdArray = tr.querySelectorAll("TD");
			const attrIcon = tdArray[2].querySelector(".fa-up-right-from-square");
			if(attrIcon != null) {
				tdArray[2].querySelector(".fa-file-circle-plus").classList.add("none");
				tdArray[2].querySelector(".fa-file-circle-plus").remove();
			} else if(tdArray[2].querySelector("INPUT").value === "") {
				tdArray[2].querySelector("INPUT").classList.add("none")
				tdArray[2].querySelector("SELECT").classList.remove("none")
			}
		})
	}
	// 常用 dropdown menu icon
	document.querySelectorAll(".fa-file-circle-plus").forEach(icon => {
		icon.classList.remove("none")
	})
	// set datetime picker
	tbody.querySelectorAll("TR").forEach(tr => {
		tr.querySelectorAll(".dtr").forEach(dtr => {
			dtr.parentElement.classList.add("setting")
			Utils.SetDateTime(".setting", "", dtr.value);
		})
		tr.querySelectorAll(".dr").forEach(dr => {
			dr.parentElement.classList.add("setting")
			Utils.SetDateTime(".setting", "", dr.value);
		})
	})
	// 最後排icons
	table.querySelectorAll(".optionGroup").forEach(item => {
		item.classList.remove("none");
	})
}

function saveTable() {
	const checkboxArray = document.querySelectorAll("#itemTable tbody .checkbox");
	const checkboxStatusArray = [];
	checkboxArray.forEach(checkbox => {
		checkboxStatusArray.push(checkbox.checked)
	})
	const requestData = {
		"p_id": document.querySelector("#pId").value,
		"item_id": sessionStorage.getItem("itemId"),
		"datas": []
	}
	const rowList = document.querySelectorAll("#itemTable tbody tr")
	const checkedItemDataArray = [];
	for(let i=0; i<rowList.length; i++) {
		checkedItemDataArray.push(rowList[i].querySelector("input[type='checkbox']").checked)
		const cellList = rowList[i].querySelectorAll("td")
		const dataObject = {}
		for(let j=0; j<cellList.length-1; j++) {
			const inputList = cellList[j].querySelectorAll("input");
			// 檢查必填
			if(role === "admin") {
				for(let k=0; k<inputList.length; k++) {
					if(inputList[k].dataset.mandatory && inputList[k].dataset.mandatory === "Y") {
						if(inputList[k].value === "") {
							alert(Language[L].thereAreStillRequiredFieldsLeftUnfilled);
							return
						}
					}
				}	
			} else if(role === "sales") {
				if(cellList[2].querySelector("input").classList.contains("none") || cellList[3].querySelector("input").value === "") {
					alert(Language[L].thereAreStillRequiredFieldsLeftUnfilled);
					return
				}
			}
			// 取得各欄的值
			if(j === 1) {
				const dataId = cellList[j].firstElementChild.dataset.dataid;
				if(dataId !== "") {
					dataObject.data_id = dataId;
				}
			} else if(j === 2) {
				dataObject.name = cellList[j].querySelector("INPUT").value;
				if(role === "sales") {
					dataObject.price = cellList[j].firstElementChild.nextElementSibling.dataset.price;
				}
			} else if(j === 3) {
				dataObject.qty = cellList[j].firstElementChild.value;
			} else if(j === 4) {
				if(role === "admin") {
					dataObject["col4"] = cellList[j+1].firstElementChild.value;
					dataObject.price = cellList[j].firstElementChild.value;
				} else if(role === "sales") {
					dataObject["col4"] = cellList[j].firstElementChild.value;
				}
			} else {
				if(role === "admin") {
					dataObject[`col${j}`] = cellList[j+1].firstElementChild.value;
				} else if(role === "sales") {
					dataObject[`col${j}`] = cellList[j].firstElementChild.value;
				}
			}
		}
		requestData.datas.push(dataObject);
	}
//	console.log(requestData);
//	return;
	axios
		.post(MY_URL.updateItemData, requestData)
		.then(response => {
			if(checkboxStatusArray.includes(true)) {
				const ssName = response.data.responseInfo[0].item_id
				const arr = []
				for(let i=0; i<response.data.responseInfo[0].datas.length; i++) {
					if(checkboxStatusArray[i]) {
						arr.push(response.data.responseInfo[0].datas[i].data_id)
					}
				}
				const ssValue = arr.toString();
				//每一個item勾選了幾筆的dataId
				sessionStorage.setItem(ssName+"checkDataIds", ssValue);
			}
			if(response.data.status === "0") {
				alert(Language[L].saveSuccess)
				document.querySelector(".all").disabled = true;
				sessionStorage.setItem("newDataId", response.data.responseInfo[0].datas[0].data_id);
				checkNewItemData(response.data.responseInfo[0], checkedItemDataArray);
				showQuotationMain(sessionStorage.getItem("itemId"));
			}
		})
		document.querySelectorAll(".fa-file-circle-plus").forEach(icon => {
			icon.classList.add("none")
		})
}
function checkNewItemData(itemData, checkedArray) {
	const itemId = sessionStorage.getItem("itemId");
	statusData.checkboxStatus[itemId]
	statusData.checkboxStatus[`${itemId}`] = [];
	for(let i=0; i<checkedArray.length; i++) {
		if(checkedArray[i] === true) {
			statusData.checkboxStatus[itemId].push(itemData.datas[i].data_id.toString())
		}
	}
}

function toggleItem(t, operator) {
	// 判斷是 增加 還是 刪除
	const tableBody = t.parentElement.parentElement.parentElement.parentElement;
	const rowList = tableBody.querySelectorAll("tr");
	if(operator === "-") {
		const targetRow = t.parentElement.parentElement.parentElement;
		if(rowList.length === 1) {
			const td = targetRow.querySelectorAll("td")
			for(let i=2; i<td.length; i++) {
				if(i === 2) {
					td[i].querySelector("INPUT").classList.add("none");
					const select = td[i].querySelector("SELECT")
					select.value = "0";
					select.classList.remove("none");
				} else {
					if(td[i].querySelector("INPUT")) {
						td[i].querySelector("INPUT").value = "";
					}
				}
			}
		} else {
			targetRow.remove();
			tableBody.querySelectorAll("tr").forEach((row, index) => {
				row.firstElementChild.nextElementSibling.firstElementChild.value = (index+1);
			})
		}
	} else if(operator === "+") {
		let newRowString = ""
		newRowString = t.parentElement.parentElement.parentElement.outerHTML.replace(/data-dataid="[^"]*"/g, 'data-dataid=""').replace("checked", "").replace("blue", "preBlue");
		
		tableBody.insertAdjacentHTML('beforeend', newRowString);
		let icons = document.querySelectorAll('.fa-file-circle-plus');
//		Utils.SetDateTime("#mainBottom", "last");
		const newRowList = tableBody.querySelectorAll("tr");
		const newRow = newRowList[newRowList.length-1];
		const tdList = newRow.querySelectorAll("td");
		for(let i=1; i<tdList.length-1; i++) {
			tdList[i].querySelector("input").value = "";
			if(i === 1) {
				tdList[i].querySelector("input").value = newRowList.length;
			}
			if(i === 2 && role === "sales") {
				const input = tdList[i].querySelector("INPUT")
				tdList[i].querySelector("SELECT").classList.remove("none");
				input.value = "";
				input.classList.add("none");
			}
			if(i === 3) {
				tdList[i].querySelector("input").value = "0";
			}
			if(i === 5 && document.querySelector(".fa-up-right-from-square")) {
				tdList[i].querySelector("input").value = "式";
			}
		}
	}
}

// 是否顯示 "尚未建立任何報價類型"
function toggleEmptyTable(operator) {
	if(operator) {
		document.querySelector("#emptyTable").classList.add("none")
		document.querySelector("#mainMiddle").classList.remove("none")
		document.querySelector("#mainBottom").classList.remove("none")
	} else {
		document.querySelector("#emptyTable").classList.remove("none")
		document.querySelector("#mainMiddle").classList.add("none")
		document.querySelector("#mainBottom").classList.add("none")
	}
}

// 是否顯示左側 Side Bar
function toggleSideBar(t) {
	t.classList.toggle("fa-chevron-left");
	t.classList.toggle("fa-chevron-right");
	document.querySelector("#side").classList.toggle("squeeze")
}

// 是否顯示左側 Side Bar @media(max-width: 500px)
function toggleSmallBarContent(toggle, t) {
	t.parentElement.firstElementChild.classList.toggle("none")
	t.parentElement.lastElementChild.classList.toggle("none")
	document.querySelector("#emptyTable").classList.toggle("none")
	document.querySelector("#mainMiddle").classList.toggle("none")
}




/* Modal */
// 顯示 "設定屬性權限" modal
function showAttrSettingModal() {
	let htmlString = ""
	statusData.currentItemList.forEach((item, index) => {
		htmlString += `<option value="${item.item_id}" onclick="getAttrSettingData(this.value)">${item.item_name}</option>`
	})
	document.querySelector("#itemListWrapper").innerHTML = htmlString;
	getAttrSettingData(statusData.currentItemList[0].item_id);
	$("#attrSettingModal").modal('show');
}

function changeState(t) {
	if(t.dataset.status === "Y") {
		t.dataset.status = "N"
	} else {
		t.dataset.status = "Y"
	}
}
function getAttrSettingData(itemId) {
	const requestData = {
		"p_id": sessionStorage.getItem("p_id"),
		"item_id": itemId
	}
	axios
		.post("qms02.do?method=queryItemSetting", requestData)
		.then(response => {
			let htmlString = "<div><span i18n='no'>序號</span><span i18n='attribute'>屬性名稱</span><span i18n='authority'>開放權限</span></div>";
			let otherHTMLString = "";
			const attribute = response.data.responseInfo
			for(let i=0; i<attribute.length; i++) {
				switch(attribute[i].attr_name) {
				case "name" :
				case "qty" :
					htmlString += `<div class="attrRow" data-attrid="${attribute[i].attr_id}">
										<span>${i + 1}</span>
										<span i18n="${attribute[i].attr_name}">${attribute[i].attr_name}</span>
										<span>-</span>
									</div>`
					break
				case "price" :
				case "unit" :
					htmlString += `<div class="attrRow" data-attrid="${attribute[i].attr_id}">
										<span>${i + 1}</span>
										<span i18n="${attribute[i].attr_name}">${attribute[i].attr_name}</span>
										<span>
											<div class="form-check form-switch">
											<input class="form-check-input authority" data-status="N" type="checkbox" role="switch" onclick="changeState(this)">
											</div>
										</span>
									</div>`
					break
				default :
					otherHTMLString += `<div class="attrRow" data-attrid="${attribute[i].attr_id}">
											<span>${i + 1}</span>
											<span>${attribute[i].attr_name}</span>
											<span>
												<div class="form-check form-switch">
												<input class="form-check-input authority" data-status="N" type="checkbox" role="switch" onclick="changeState(this)">
												</div>
											</span>
										</div>`
					break
				}
			}
			document.querySelector("#attrListWrapper").innerHTML = (htmlString + otherHTMLString);
		})
		.then(() => {
			 Utils.SetI18N()
		})
}

function saveAttribute() {
	const requestData = {
		"p_id": sessionStorage.getItem("p_id"),
		"item_id": document.querySelector("#itemListWrapper").value,//類型代碼
		"attributes":[]
	}
	const attrRowArray = document.querySelectorAll(".attrRow");
	for(let i=2; i<attrRowArray.length; i++) {
		requestData.attributes.push({
			"attr_id": attrRowArray[i].dataset.attrid,
			"is_show": attrRowArray[i].querySelector("INPUT").dataset.status
		})
	}
	axios
		.post("qms02.do?method=updateItemSetting", requestData)
		.then(response => {
			if(response.data.message === "成功") {
				alert(Language[L].saveSuccess)
			}
			document.querySelector("#attrCloseButton").click();
		})
}




/* 匯出 */
function showExportModal() {
	if(role === "admin") {
		document.querySelector("#exportType").classList.remove("none")
	} else if(role === "sales") {
		document.querySelector("#exportType").classList.add("none")
	}
	$("#exportQuotationModal").modal('show');
}
function exportHandler() {
	return new Promise((resolve, reject) => {
		const requestData = {
			"p_id" : document.querySelector("#pId").value,
			"file_type" : document.querySelector('input[name="exportType"]:checked').id,
			"mark" : document.querySelector("#mark").value,
			"lang" : L,
			"detail" : []
		}
		statusData.allItemIdArray.forEach(itemid => {
			if(typeof sessionStorage.getItem(itemid+"checkDataIds") === "string") {
				const dataIdArray = sessionStorage.getItem(itemid+"checkDataIds").split(",");		
				dataIdArray.forEach(dataid => {
					const obj = { 
						"data_ids" : dataid,
						"data_gids" : []
					}
					if(typeof sessionStorage.getItem(dataid) === "string") {
						obj.data_gids = JSON.parse(sessionStorage.getItem(dataid));
					}
					requestData.detail.push(obj)
				})
			}
		})
		resolve(requestData);
	})
}

function exportReport() {
	exportHandler().then(requestData => {
		if(requestData.detail.length === 0) {
			alert("請勾選至少一個品項")
			return;
		}
		Swal.fire({ title : Language[localStorage.getItem("askeyLanguage")].exporting })
		axios
		.post("qms05.do?method=exportReport", requestData, { responseType: 'arraybuffer' })
		.then((response) => {
			let fileName = response.headers.filename;
			if(fileName==""){
				fileName = Utils.GetCodeName();
				if(requestData.file_type === "PDF" || sessionStorage.getItem("userRole") !== "admin") {
					fileName += ".pdf"
				} else if(requestData.file_type === "EXCEL") {
					fileName += ".xls"
				}  
			}
			const blob = new Blob([response.data]);
			const link = document.createElement('a');
			console.log(window)
			link.href = window.URL.createObjectURL(blob);
			link.download = fileName;
			link.click();
			document.querySelector(".swal2-confirm").click();
			URL.revokeObjectURL(link.href);
		})
	})
}
/* 匯出 */




// 顯示品項類型 modal
function showAdminItemModal(itemId = "") {
	currentModal = adminModal;
	if(jiraItemHTML === "") {
		setTimeout(() => {
			showAdminItemModal(itemId);
		}, 500)
		return
	} else {
		currentModal.querySelector("#relativeTableBody SELECT").innerHTML = jiraItemHTML;
	}
	sessionStorage.setItem("itemId", itemId);
	if(itemId === "") {
		sessionStorage.setItem("jiraList", "");
		currentModal.querySelector("#modalTitle").innerText = Language[L].createItemType;
		currentModal.querySelector("#adminNormalCreateBtn").classList.remove("none");
		currentModal.querySelector("#adminNormalEditBtn").classList.add("none");
	} else {
		currentModal.querySelector("#modalTitle").innerText = Language[L].editItemType;
		currentModal.querySelector("#adminNormalCreateBtn").classList.add("none");
		currentModal.querySelector("#adminNormalEditBtn").classList.remove("none");
		const requestData = {
			"p_id": document.querySelector("#pId").value,
			"item_id": itemId,
			"data_included": "Y",
		}
		axios
		.post("qms02.do?method=queryProjectItem", requestData)
		.then(response => {
			const jiraList = [];
			response.data.responseInfo[0].jiras.forEach(jira => {
				jiraList.push(jira.jira_id);
			})
			setItemCurrentData(response.data.responseInfo[0]);
			sessionStorage.setItem("jiraList", jiraList.toString())
		})
	}
	$("#adminQuotationItemModal").modal('show');
}

function showSalesmanItemModal(itemId, option) {
	currentModal = salesmanModal;
	sessionStorage.setItem("itemId", itemId);
	if(option === "add") {
		currentModal.querySelector("#modalTitle").innerText = Language[L].createItemType;
		currentModal.querySelector("#relativeTab").classList.remove("none");
		currentModal.querySelector("#salesmanRelativeCreateBtn").classList.add("none")
		currentModal.querySelector("#salesmanNormalCreateBtn").classList.remove("none")
		currentModal.querySelector("#salesmanNormalEditBtn").classList.add("none")
		sessionStorage.setItem("jiraList", "");
	} else if(option === "edit") {
		currentModal.querySelector("#modalTitle").innerText = Language[L].editItemType;
		currentModal.querySelector("#relativeTab").classList.add("none");
		currentModal.querySelector("#salesmanRelativeCreateBtn").classList.add("none")
		currentModal.querySelector("#salesmanNormalCreateBtn").classList.add("none")
		currentModal.querySelector("#salesmanNormalEditBtn").classList.remove("none")
		const requestData = {
			"p_id": document.querySelector("#pId").value,
			"item_id": itemId,
			"data_included": "Y",
		}
		axios
		.post("qms02.do?method=queryProjectItem", requestData)
		.then(response => {
			setItemCurrentData(response.data.responseInfo[0]);
		})
	}
	$("#salesQuotationItemModal").modal('show');
}

function switchSalesmanComfirmBtn() {
	const footer = currentModal.querySelector(".modal-footer");
	footer.querySelectorAll(".redButton").forEach(btn => {
		btn.classList.add("none");
	})
	footer.querySelector(`#salesman${footer.dataset.t}${footer.dataset.o}Btn`).classList.remove("none");
}

function salesSwitchTable(that, e) {
	if(e.target.classList.contains("tab")) {
		that.querySelector(".on").classList.remove("on");
		e.target.classList.add("on");
		currentModal.querySelector(".modal-footer").dataset.t = e.target.dataset.on;
		switchSalesmanComfirmBtn();
		currentModal.querySelector(`#salesman${e.target.dataset.on}Table`).classList.remove("none");
		currentModal.querySelector(`#salesman${e.target.dataset.off}Table`).classList.add("none");
		const relativeRowList = currentModal.querySelectorAll("#relativeTableBody .relativeTableRow")
	}
}

//新增 / 修改 item
function adminUpdateNormalItem(option) {
	const requestData = getNormalRequestData(option);
	if(requestData === false) { return; }
	axios
	.post(MY_URL[`${option}_normal`], requestData)
	.then(response => {
		const responseData = response.data.responseInfo.length === undefined ? response.data.responseInfo : response.data.responseInfo[0];
		sessionStorage.setItem("itemId", responseData.item_id);
		getQuotation(true, true);
		return responseData.item_id;
	})
	.then(itemId => {
		adminUpdateRelativeItem(itemId);
	})
}

function adminUpdateRelativeItem(itemId) {
	const relativeRowList = currentModal.querySelectorAll("#relativeTableBody .relativeTableRow");
	const requestData = {
		"p_id" : document.querySelector("#pId").value,
		"item_id" : itemId,
		"jiras" : []
	}
	relativeRowList.forEach(row => {
		const value = row.querySelector("SELECT").value
		if(value !== "0") {
			requestData.jiras.push(value)
		}
	});
	if(requestData.jiras.length === 0) { 
		document.querySelector("#adminCloseModalBtn").click();
		return; 
	}
	axios.post(MY_URL.admin_update_relative, requestData).then(response => {
		getQuotation(true, true);
		document.querySelector("#adminCloseModalBtn").click();
	})
}

function salesUpdateNormalItem(option) {
	const requestData = getNormalRequestData(option)
	if(requestData === false) { return; }
	axios
	.post(MY_URL[`${option}_normal`], requestData)
	.then(response => {
		const responseData = response.data.responseInfo;
		sessionStorage.setItem("itemId", responseData.item_id);
		getQuotation(true, true);
		getfavoriteProjects();
	})
	currentModal.querySelector("#salesmanCloseModalBtn").click();
}

function salesUpdateRelativeItem(option) {
	const requestData = {
		"p_id" : sessionStorage.getItem("p_id"),
		"detail" : []
	}
	const relativeTableBody = document.querySelector("#salesmanRelativeTable #relativeTableBody");
	const commonItemArray = relativeTableBody.querySelectorAll(".commonItemMenu");
	commonItemArray.forEach(commonItem => {
		const inputArray = commonItem.querySelectorAll("input");
		inputArray.forEach(input => {
			if(input.checked === true && input.value !=="A") {
				requestData.detail.push({
					"common_p_id" : input.dataset.pid,
					"common_item_id" : input.dataset.itemid
				})
			}
		})
	})
	axios
		.post(MY_URL.salesman_create_relative, requestData)
		.then(response => {
			sessionStorage.setItem("itemId", response.data.responseInfo.item_id)
			getQuotation(true, true);
			currentModal.querySelector("#salesmanCloseModalBtn").click();
		})
}

function closeUpdateItemModal() {
	currentModal.querySelector("#itemName").value = "";
	currentModal.querySelector("#itemType").value = "1";
	currentModal.querySelector("#itemDescript").value = "";
	if(role === "admin") {
		const customRow = document.querySelectorAll(".customRow");
		for(let i=0; i<customRow.length; i++) {
			customRow[i].remove();
		}
		statusData.lumpSumA = "2";
		statusData.lumpSumB = "3";
		getLumpSumDropdown();	
		const relativeRowList = currentModal.querySelectorAll("#relativeTableBody .relativeTableRow")
		for(let i=1; i<relativeRowList.length; i++) {
			relativeRowList[i].remove();
		}
	} else if(role === "sales") {
		currentModal.querySelector("#narmalTab").click();
		currentModal.querySelector(".modal-footer").dataset.t = "Normal";
		currentModal.querySelector(".modal-footer").dataset.o = "Create";
		const relativeTableBody = currentModal.querySelector("#relativeTableBody");
		const rows = document.querySelectorAll("#salesmanNormalTable #normalTableBody .normalTableRow");
		for(let i=3; i<rows.length; i++) {
			rows[i].remove();
		}
		relativeTableBody.innerHTML = `<div class="relativeTableRow">
											<span><p class="">1</p></span>
											<span>
												<div class="form-floating">
													<select class="form-select commonProjectMenu" onchange="onchangeCommonProject(this)">
														<option value="0" i18n="pleaseChoose" selected>請選擇</option>
														<option value="1">工程類</option>
														<option value="2">維護類</option>
														<option value="3">其他類</option>
													</select>
												</div>
											</span>
											<span class="commonItemMenu" data-checked="">
												<div class="form-floating">
													<input class="form-select hideDecoration commonItemMenu" type="text" value="" i18n="selectAssetProject" placeholder="請選擇報價專案" disabled>
												</div>
											</span>
											<span class="attrOption">
												<i class="fa-regular fa-square-plus pointer" onclick="salesToggleRow(this, '+', 'item')" i18n='createnext' title='新增下一筆'></i>
												<i class="fa-solid fa-trash-can pointer" onclick="clearRow(this)" i18n='delete' title='刪除'></i>
											</span>
										</div>`
	}
}

function onchangeCommonProject(t) {
	const items = commonItem[t.value].filter(item => item.common_p_id !== Number(projectId))
	let htmlString = `<div class="btn-group">
						<button type="button" class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							<p i18n="all">請選擇</p>
						</button>
						<div class="dropdown-menu">
						<button class="dropdown-item" type="button" data-value="A" onclick="checkboxHandler(this)">
							<label>
								<input type="checkbox" class="form-check-input" value="A">
								${Language[L].all}
							</label>
						</button>`
		
	for(let i=0; i<items.length; i++) {
		htmlString += `<button class="dropdown-item" type="button" onclick="checkboxHandler(this)">
							<label>
								<input type="checkbox" class="form-check-input" data-pid="${items[i].common_p_id}" data-itemid="${items[i].common_item_id}" data-name="${items[i].common_item_name}">
								${items[i].common_item_name}
							</label>
						</button>`
	}
	htmlString += "</div></div>"
	t.parentElement.parentElement.nextElementSibling.firstElementChild.innerHTML = htmlString;
}


function checkboxHandler(t) {
	event.stopPropagation();
	const inputArray = t.parentElement.querySelectorAll("input")
	const p = t.parentElement.previousElementSibling.firstElementChild;
	const span = t.parentElement.parentElement.parentElement.parentElement
	let rowElement = t;
	// 控制 checkbox 
	if(t.dataset.value === "A" && t.firstElementChild.firstElementChild.checked === true) {
		inputArray[0].checked = true;
		for(let i=1; i<inputArray.length; i++) {
			inputArray[i].checked = true;
		}
	} else if (t.dataset.value === "A" && t.firstElementChild.firstElementChild.checked === false) {
		for(let i=0; i<inputArray.length; i++) {
			inputArray[i].checked = false;
		}
	} else {
		let checkCount = 0;
		for(let i=1; i<inputArray.length; i++) {
			if(inputArray[i].checked === true) {
				checkCount ++;
			}
		}
		inputArray[0].checked = checkCount === (inputArray.length-1);
	}
	// 取得勾選項目
	checkedItemId.clear();
	checkedItemName.clear();
	for(let i=1; i<inputArray.length; i++) {
		if(inputArray[i].checked === true) {
			checkedItemId.add(inputArray[i].value);
			checkedItemName.add(inputArray[i].dataset.name);
		}
	}
	if(checkedItemName.size ===inputArray.length-1) {
		p.innerHTML = "全選";
	} else if(checkedItemName.size === 0) {
		p.innerHTML = "請選擇";
	} else {
		p.innerHTML = [...checkedItemName].join(", ");
	}
	span.dataset.checked = [...checkedItemId].join(",");
}

function duplicateItem(itemId, itemName, itemDesc, category) {
	const requestData = {
		"p_id" : sessionStorage.getItem("p_id"),
		"item_id" : itemId,
		"item_name" : (itemName + "(copy)"),
		"description" : itemDesc,
		"category" : category
	}
	axios
		.post("qms02.do?method=duplicateItem", requestData)
		.then(response => {
			if(response.status === 200) {
				alert(Language[L].copySuccess)
				getQuotation(true, false);
			}
		})
}
function duplicateAttribute(t) {
	toggleItem(t, '+')
	const newRow = t.parentElement.parentElement.parentElement.parentElement.lastElementChild;
	const valueArray = []
	const row = t.parentElement.parentElement.parentElement;
	const inputArray = row.querySelectorAll("input")
	const newInputArray = newRow.querySelectorAll("input")
	for(let i=2; i<inputArray.length; i++) {
		newInputArray[i].value = inputArray[i].value;
	}
}

// 修改 quotation item 時, 顯示現在 item 的資料
function setItemCurrentData(item) {
	let counter = 0;
	currentModal.querySelector("#itemName").value = item.item_name;
	currentModal.querySelector("#itemType").value = item.category;
	currentModal.querySelector("#itemDescript").value = item.item_desc;
	let htmlString = "";
	if(role === "admin") {
		for(let i=0; i<item.attributes.length; i++) {
			const isVisible = item.attributes[i].is_visible === "Y" ? "checked" : ""
			if(item.attributes[i].attr_name === "name") {
				htmlString += `<div class="normalTableRow" data-unittype="" data-attr="${item.attributes[i].attr_id}">
									<span>1</span>
									<span i18n="name"><p class="star">*</p>名稱</span>
									<span><i class="fa-solid fa-check"></i></span>
									<span>
										<div class="form-floating" onchange="onchangeUnitType(this)">
											<select class="form-select" id="" aria-label="" disabled="">
												<option value="3" i18n="string" selected>文字</option>
											</select>
										</div>
									</span>
									<span>
										<i class="fa-solid fa-check authority"></i>
									</span>
									<span></span>
								</div>`
			} else if(item.attributes[i].attr_name === "qty") {	
				htmlString += `<div class="normalTableRow" data-unittype="number" data-seq="2^quantity" data-attr="${item.attributes[i].attr_id}">
										<span>2</span>
										<span i18n="quantity"><p class="star">*</p>數量</span>
										<span><i class="fa-solid fa-check"></i></span>
										<span>
											<div class="form-floating" onchange="onchangeUnitType(this)">
												<select class="form-select" id="" aria-label="" disabled>
													<option value="1" i18n="integer" selected>整數</option>
												</select>
											</div>
										</span>
										<span>
											<i class="fa-solid fa-check authority"></i>
										</span>
										<span></span>
									</div>`
			} else if(item.attributes[i].attr_name === "price") {	
				htmlString += `<div class="normalTableRow" data-unittype="number" data-seq="3^price" data-attr="${item.attributes[i].attr_id}">
										<span>3</span>
										<span i18n="price"><p class="star">*</p>價格</span>
										<span><i class="fa-solid fa-check"></i></span>
										<span>
											<div class="form-floating" onchange="onchangeUnitType(this)">
												<select class="form-select" id="" aria-label="" disabled>
													<option value="2" i18n="float" selected>浮點數</option>
												</select>
											</div>
										</span>
										<span>
											<input class="authority" type="checkbox" ${isVisible}>
										</span>
										<span></span>
									</div>`
			} else if(item.attributes[i].attr_name === "unit") {
				htmlString += `<div class="normalTableRow" data-unittype="" data-attr="${item.attributes[i].attr_id}">
									<span>4</span>
									<span i18n="unit"><p class="star">*</p>單位</span>
									<span><i class="fa-solid fa-check"></i></span>
									<span>
										<div class="form-floating" onchange="onchangeUnitType(this)">
											<select class="form-select" id="" aria-label="" disabled>
												<option value="3" i18n="string" selected>文字</option>
											</select>
										</div>
									</span>
									<span>
										<input class="authority" type="checkbox" ${isVisible}>
									</span>
									<span class="attrOption">
										<i class="fa-regular fa-square-plus" onclick="adminToggleRow(this, '+', 'normal')" i18n="add" title="新增"></i>
									</span>
								</div>`
			} 
		}
		for(let i=0; i<item.attributes.length; i++) {
			if(item.attributes[i].attr_name !== "name" && item.attributes[i].attr_name !== "qty" && item.attributes[i].attr_name !== "price" && item.attributes[i].attr_name !== "unit") {
				const isVisible = item.attributes[i].is_visible === "Y" ? "checked" : ""
				counter++;
				if(item.attributes[i].data_type === "1" || item.attributes[i].data_type ==="2") {
					htmlString += `<div class="normalTableRow customRow" data-unittype="number" data-seq="${i+2}^${item.attributes[i].attr_name}" data-attr="${item.attributes[i].attr_id}">`
				} else {
					htmlString += `<div class="normalTableRow customRow" data-unittype="" data-seq="${i+2}^${item.attributes[i].attr_name}" data-attr="${item.attributes[i].attr_id}">`
				}
				htmlString += `<span>${counter+4}</span>`;
				htmlString += `<span><input type="text" class="attrName" data-attrid="${item.attributes[i].attr_id}^${item.attributes[i].attr_name}" data-seq="${i+1}" value="${item.attributes[i].attr_name}" onchange="onchangeUnitName(this)"></span>`		
				if(item.attributes[i].is_mandatory === "Y") {
					htmlString += `<span><input type="checkbox" checked></span>`
				} else {
					htmlString += `<span><input type="checkbox"></span>`
				}	
				htmlString += `<span><div class="form-floating" onchange="onchangeUnitType(this)">
								<select class="form-select" id="floatingSelect" aria-label="Floating label select example" >`
				switch(item.attributes[i].data_type) {
					case "1" :
						htmlString += `<option value="1" selected>${Language[L].integer}</option>
							<option value="2">${Language[L].float}</option>
							<option value="3">${Language[L].string}</option>
							<option value="4">${Language[L].datetime}</option>
							<option value="5">${Language[L].date}</option>`
							break
					case "2" :
						htmlString += `<option value="1">${Language[L].integer}</option>
							<option value="2" selected>${Language[L].float}</option>
							<option value="3">${Language[L].string}</option>
							<option value="4">${Language[L].datetime}</option>
							<option value="5">${Language[L].date}</option>`
							break
					case "3" :
						htmlString += `<option value="1">${Language[L].integer}</option>
							<option value="2">${Language[L].float}</option>
							<option value="3" selected>${Language[L].string}</option>
							<option value="4">${Language[L].datetime}</option>
							<option value="5">${Language[L].date}</option>`
							break
					case "4" :
						htmlString += `<option value="1">${Language[L].integer}</option>
							<option value="2">${Language[L].float}</option>
							<option value="3">${Language[L].string}</option>
							<option value="4" selected>${Language[L].datetime}</option>
							<option value="5">${Language[L].date}</option>`
							break
					case "5" :
						htmlString += `<option value="1">${Language[L].integer}</option>
							<option value="2">${Language[L].float}</option>
							<option value="3">${Language[L].string}</option>
							<option value="4">${Language[L].datetime}</option>
							<option value="5" selected>${Language[L].date}</option>`
							break
				}	
				htmlString += `</select></div></span>`
				htmlString += `<span>
									<input class="authority" type="checkbox" ${isVisible}>
								</span>
								<span class="attrOption">
									<i class="fa-regular fa-square-plus" onclick="adminToggleRow(this, '+', 'normal')" i18n='create' title='新增' i18n="add" title="新增"></i>
									<i class="fa-solid fa-trash-can" onclick="adminToggleRow(this, '-', 'normal')" i18n='delete' title='刪除'></i>
								</span>`
				htmlString += `</div>`
			}
		}
		currentModal.querySelector("#normalTableBody").innerHTML = htmlString;
		getLumpSumDropdown();
		for(let i=0; i<statusData.lumpSumDropdownList.length; i++) {
			if(statusData.lumpSumDropdownList[i].attrId == item.calculations[0]) {
				document.querySelector(".lumpSumA").value = statusData.lumpSumDropdownList[i].id;
				statusData.lumpSumA = statusData.lumpSumDropdownList[i].id
			}
			if(statusData.lumpSumDropdownList[i].attrId == item.calculations[1]) {
				document.querySelector(".lumpSumB").value = statusData.lumpSumDropdownList[i].id;
				statusData.lumpSumB = statusData.lumpSumDropdownList[i].id;
			}
		}
		setLumpSumDropdown();
		
		for(let i=1; i<item.jiras.length; i++) {
			const relativeTableBody = currentModal.querySelector("#relativeTableBody")
			relativeTableBody.querySelector(".fa-square-plus").click();
		}
		const selectArray = currentModal.querySelectorAll("#relativeTableBody SELECT")
		for(let i=0; i<item.jiras.length; i++) {
			selectArray[i].value = item.jiras[i].jira_id;
		}
	} else if(role === "sales") {
		const spanArray = document.querySelectorAll("#salesmanNormalTable #normalTableHeader .normalTableRow SPAN");
		if(spanArray[4]) {
			spanArray[4].remove();
		}
		
		const normalTableBody = document.querySelector("#salesmanNormalTable #normalTableBody");
		normalTableBody.innerHTML = "";
		let htmlString = "";
		let counter = 1;
		for(let i=0; i<item.attributes.length; i++) {
			const attribute = item.attributes[i];
			const isShow = attribute.is_show === "Y" ? "" : "none";
			const isMandatory = attribute.is_mandatory === "Y" ? "<i class='fa-solid fa-check'></i>" : "";
			const isVisible = attribute.is_visible === "Y" ? "checked" : ""
			if(attribute.attr_name === "name") {
				htmlString += `<div class="normalTableRow" data-unittype="" data-attr="${attribute.attr_id}">
									<span>${counter}</span>
									<span i18n="name">名稱</span>
									<span>${isMandatory}</span>
									<span i18n="string">文字</span>
								</div>`;
			} else if(attribute.attr_name === "qty") {	
				htmlString += `<div class="normalTableRow" data-unittype="number" data-seq="2^quantity" data-attr="${attribute.attr_id}">
									<span>${counter}</span>
									<span i18n="quantity">數量</span>
									<span>${isMandatory}</span>
									<span i18n="integer">整數</span>
								</div>`;
			} else if(attribute.attr_name === "price") {	
				htmlString += `<div class="normalTableRow ${isShow}" data-unittype="number" data-seq="3^price" data-attr="${attribute.attr_id}">
									<span>${counter}</span>
									<span i18n="price">價格</span>
									<span>${isMandatory}</span>
									<span i18n="float">浮點數</span>
									<span class="none"><input class="authority" type="checkbox" ${isVisible}></span>
								</div>`;
			} else if(attribute.attr_name === "unit") {
				htmlString += `<div class="normalTableRow ${isShow}" data-unittype="" data-attr="${attribute.attr_id}">
									<span>${counter}</span>
									<span i18n="unit">單位</span>
									<span>${isMandatory}</span>
									<span i18n="string">文字</span>
									<span class="none"><input class="authority" type="checkbox" ${isVisible}></span>
								</div>`;
			} else {
				htmlString += `<div class="normalTableRow customRow ${isShow}" data-unittype="" data-attr="${attribute.attr_id}">
									<span>${counter}</span>
									<span>${attribute.attr_name}</span>
									<span>${isMandatory}</span>
									<span data-type="${attribute.data_type}">${Language[L][Converse.DataType[attribute.data_type]]}</span>
									<span class="none"><input class="authority" type="checkbox" ${isVisible}></span>
								</div>`;
			}
			if(isShow === "") {
				counter ++;
			}
		}
		normalTableBody.innerHTML = htmlString;
	}
	Utils.SetI18N();
}

var Converse = {
	"DataType" : {
		"1" : "integer",
		"2" : "float",
		"3" : "string",
		"4" : "datetime",
		"5" : "date",
	}
}

// get 一般屬性資料
function getNormalRequestData(option) {
	const itemId = sessionStorage.getItem("itemId");
	const requestData = {
		p_id : document.querySelector("#pId").value,
		item_id : itemId,
		item_name : currentModal.querySelector("#itemName").value,
		category : currentModal.querySelector("#itemType").value,
		description : currentModal.querySelector("#itemDescript").value,
		attributes : [],
		calculations : []
	}
	if(requestData.item_name === "") {
		alert("請輸入品項類型名稱");
		return false;
	} else if(requestData.category === "0") {
		alert("請選擇工項類型");
		return false;
	} else if(itemNameSet.has(requestData.item_name) && option === "add") {
		alert(Language[L].nameAlreadyExists);
		return false;
	}
	
	if(role === "admin") {
		requestData.calculations.push(currentModal.querySelector(".lumpSumA").value);
		requestData.calculations.push(currentModal.querySelector(".lumpSumB").value);
	} else if(role === "sales") {
		requestData.calculations.push("2");
		requestData.calculations.push("3");
	}
	const rows = currentModal.querySelectorAll("#normalTableBody .normalTableRow")

	requestData.attributes = [{
		"seq_no" : "1",
		"attr_name" : "name",
		"is_mandatory" : "Y",
		"data_type" : "3",
		"is_show" : "Y",
		"is_visible" : "Y"
	},{
		"seq_no" : "2",
		"attr_name" : "qty",
		"is_mandatory" : "Y",
		"data_type" : "1",
		"is_show" : "Y",
		"is_visible" : "Y"
	},{
		"seq_no" : "3",
		"attr_name" : "price",
		"is_mandatory" : "Y",
		"data_type" : "2",
		"is_show" : role === "admin" ? rows[2].querySelector(".authority").checked === true ? "Y" : "N" : "N",
		"is_visible" : role === "admin" ? rows[2].querySelector(".authority").checked === true ? "Y" : "N" : "N"
	},{
		"seq_no" : "4",
		"attr_name" : "unit",
		"is_mandatory" : "Y",
		"data_type" : "3",
		"is_show" : role === "admin" ? rows[3].querySelector(".authority").checked === true ? "Y" : "N" : "Y",
		"is_visible" : role === "admin" ? rows[3].querySelector(".authority").checked === true ? "Y" : "N" : "Y"
	}]
	
	if(option === "edit") {
		let defaultTableRowArray = currentModal.querySelectorAll("#normalTableBody .normalTableRow");
		requestData.attributes[0].attr_id = defaultTableRowArray[0].dataset.attr;
		requestData.attributes[1].attr_id = defaultTableRowArray[1].dataset.attr;
		requestData.attributes[2].attr_id = defaultTableRowArray[2].dataset.attr;
		requestData.attributes[3].attr_id = defaultTableRowArray[3].dataset.attr;
	}
	
	const customRowList = document.querySelectorAll(".customRow")
	for(const row of customRowList) {
		const rowObject = {}
		const itemList = row.querySelectorAll("SPAN")
		if(option === "edit") {
			rowObject.attr_id = row.dataset.attr;
		}
		for(let i = 0; i < itemList.length; i ++) {
			switch(i) {
				case 0:
					rowObject.seq_no = itemList[i].innerText;
					break;
				case 1:
					if(role === "admin") {
						rowObject.attr_name = itemList[i].firstElementChild.value;
					} else if(role === "sales") {
						rowObject.attr_name = itemList[i].innerText;
					}
					break;
				case 2:
					if(role === "admin") {
						rowObject.is_mandatory = itemList[i].firstElementChild.checked === true ? "Y" : "N";
					} else if(role === "sales") {
						rowObject.is_mandatory = itemList[i].querySelector("I") !== null ? "Y" : "N";
					}
					break;
				case 3:
					if(role === "admin") {
						rowObject.data_type = itemList[i].firstElementChild.firstElementChild.value;
					} else if(role === "sales") {
						rowObject.data_type = itemList[i].dataset.type;
					}
					break;
				case 4:
					const value = itemList[i].querySelector(".authority").checked === true ? "Y" : "N";
					rowObject.is_show = value;
					rowObject.is_visible = value;
					break;
			}
		}
		requestData.attributes.push(rowObject);
	}
	return requestData;
}

// 刪除 item 
function deleteItem(pId, itemId, pName) {
	if(confirm(Language[L].confirmDelete) === true) {
		const requestData = {
			"p_id" : pId, 
			"item_id" : itemId,
			"status" : "2",
		}
		axios
		.post("qms02.do?method=updateItem", requestData)
		.then(response => {
			itemNameSet.delete(pName)
			alert(Language[L].deleteSuccess)
			if(sessionStorage.getItem("itemId") == itemId) {
				sessionStorage.removeItem("itemId");
				getQuotation(true, true);
			} else {
				getQuotation(true, false);
			}
		})
	}
}


// 新增 / 刪除 attribute
function clearRow(t) {
	t.parentElement.previousElementSibling.firstElementChild.firstElementChild.value = "0";
}
function adminToggleRow(t, operator, tabalType) {
	// 判斷是 增加 還是 刪除
	if(operator === "-") {
		t.parentElement.parentElement.remove();
	} else if(operator === "+") {
		const tableBody = document.querySelector(`#${tabalType}TableBody`)
		const rowList = tableBody.querySelectorAll(`.${tabalType}TableRow`)
		let htmlString = "";
		// 判斷是 "一般" 還是 "關聯" 
		if(tabalType === "normal") {
			htmlString = `<div class="normalTableRow customRow" data-unittype="number" data-seq="${rowList.length + 1}^">
							<span>${rowList.length + 1}</span>
							<span><input type="text" class="attrName" data-seq="${rowList.length + 1}^" value="" onchange="onchangeUnitName(this)"></span>
							<span><input type="checkbox"></span>
							<span>
								<div class="form-floating" onchange="onchangeUnitType(this)">
									<select class="form-select" id="floatingSelect" aria-label="Floating label select example">
										<option value="1" selected>${Language[L].integer}</option>
									  	<option value="2">${Language[L].float}</option>
									  	<option value="3">${Language[L].string}</option>
								  		<option value="4">${Language[L].datetime}</option>
								  		<option value="5">${Language[L].date}</option>
								 	</select>
								</div>
							</span>
							<span>
								<input class="authority" type="checkbox">
							</span>
							<span class="attrOption">
								<i class="fa-regular fa-square-plus" onclick="adminToggleRow(this, '+', 'normal')"  i18n="add" title="新增"></i>
								<i class="fa-solid fa-trash-can" onclick="adminToggleRow(this, '-', 'normal')" i18n='delete' title='刪除'></i>
							</span>
						</div>`
			t.parentElement.parentElement.insertAdjacentHTML('afterend', htmlString);
		} else if(tabalType === "relative") {
			htmlString = `<div class="relativeTableRow">
							<span>${rowList.length + 1}</span>
							<span>
								<div class="form-floating">
									<select class="form-select" id="floatingSelect" aria-label="Floating label select example">${jiraItemHTML}</select>
								</div>
							</span>
							<span class="attrOption">
								<i class="fa-regular fa-square-plus" onclick="adminToggleRow(this, '+', 'relative')" i18n="add" title="新增"></i>
								<i class="fa-solid fa-trash-can" onclick="adminToggleRow(this, '-', 'relative')" i18n='delete' title='刪除'></i>
							</span>
						</div>`
			t.parentElement.parentElement.insertAdjacentHTML('afterend', htmlString);
			
			const rowArray = currentModal.querySelectorAll("#relativeTableBody .relativeTableRow");
			for(let i=0; i<rowArray.length; i++) {
				rowArray[i].firstElementChild.innerText = i+1;
			}
		}
	}
	// 每次 增加 / 刪除 後都重新取得 dropdown menu 的資料
	getLumpSumDropdown();
	Utils.SetI18N();
}
function salesToggleRow(t, operator) {
	// 判斷是 增加 還是 刪除
	if(operator === "-") {
		t.parentElement.parentElement.remove();
	} else if(operator === "+") {
		const tableBody = document.querySelector("#relativeTableBody")
		const rowList = tableBody.querySelectorAll(".relativeTableRow")
		let htmlString = `<div class="relativeTableRow customRow">
							<span>${rowList.length + 1}</span>
							<span>
								<div class="form-floating">
									<select class="form-select commonProjectMenu" onchange="onchangeCommonProject(this)">
										<option value="0" i18n="pleaseChoose" selected>請選擇</option>
										<option value="1">工程類</option>
										<option value="2">維護類</option>
										<option value="3">其他類</option>
									</select>
								</div>
							</span>
							<span class="commonItemMenu" data-checked="">
								<div class="form-floating">
									<input class="form-select hideDecoration commonItemMenu" type="text" value="0" i18n="selectAssetProject" placeholder="請選擇報價專案" disabled>
								</div>
							</span>
							<span class="attrOption">
								<i class="fa-regular fa-square-plus pointer" onclick="salesToggleRow(this, '+', 'item')" i18n='create' title='新增'></i>
								<i class="fa-solid fa-trash-can pointer" onclick="salesToggleRow(this, '-')" i18n='delete' title='刪除'></i>
							</span>
						</div>`
		t.parentElement.parentElement.insertAdjacentHTML('afterend', htmlString);
	}
}

// get 計算總金額 dropdown menu 的資料
function getLumpSumDropdown() {
	// 清空 statusData.lumpSumDropdownList
	statusData.lumpSumDropdownList = []
	const tableBody = document.querySelector("#normalTableBody");
	const normalTableRow = tableBody.querySelectorAll(".normalTableRow");
	// 取得預設屬性資料
	for(const row of normalTableRow) {
		let id = "";
		let name = "";
		try {
			if(row.dataset.unittype === "number") {
				id = row.dataset.seq.split("^")[0];
				name = row.firstElementChild.nextElementSibling.firstElementChild.value;
				attrId = row.dataset.attr;
				statusData.lumpSumDropdownList.push({ id, name, attrId })
			}
		} catch(e) { 
			id = row.dataset.seq.split("^")[0];
			name = Language[L][`row.dataset.seq.split("^")[1]`]
			statusData.lumpSumDropdownList.push({ id:id, name:name })
		}
	}
	try {
		statusData.lumpSumDropdownList[0].name = Language[L].quantity;
		statusData.lumpSumDropdownList[1].name = Language[L].price;
	} catch(e) {console.log}

	// 更新 dropdown menu 的 HTML
	setLumpSumDropdown();
}

// set 計算總金額 dropdown menu 的 HTML
function setLumpSumDropdown() {
	let stringA = "";
	let stringB = "";
	
	for(let i = 0; i < statusData.lumpSumDropdownList.length; i ++) {
		const value = statusData.lumpSumDropdownList[i]
		// 屬性名稱為 "" 時不加到 dropdown menu A
		if(statusData.lumpSumDropdownList[i].name !== "") {
			// 把計算總金額 dropdown menu B 已選的選項設為 disabled 
			if(statusData.lumpSumDropdownList[i].id == statusData.lumpSumB) {
				stringA += `<option value="${value.id}" disabled>${value.name}</option>`;
			} else {
				stringA += `<option value="${value.id}">${value.name}</option>`;
			}
		}
		
		// 屬性名稱為 "" 時不加到 dropdown menu B
		if(statusData.lumpSumDropdownList[i].name !== "") {
			// 把計算總金額 dropdown menu A 已選的選項設為 disabled 
			if(statusData.lumpSumDropdownList[i].id == statusData.lumpSumA) {
				stringB += `<option value="${value.id}" disabled>${value.name}</option>`;
			} else {
				stringB += `<option value="${value.id}">${value.name}</option>`;
			}
		}
	}
	document.querySelector(".lumpSumA").innerHTML = stringA;
	document.querySelector(".lumpSumB").innerHTML = stringB;
	
	// 更新後顯示已選的選項
	document.querySelector(".lumpSumA").value = statusData.lumpSumA
	document.querySelector(".lumpSumB").value = statusData.lumpSumB
}

// 改變屬性名稱時更新計算總金額 dropdown menu
function onchangeUnitName(t) {
	const id = t.dataset.seq.split("^")[0];
	t.dataset.seq = `${id}^${t.value}`;
	let target = statusData.lumpSumDropdownList.find(item => item.id === id);
	if(!target) { return }
	target.name = t.value;
	// 更新 dropdown menu 的 HTML
	setLumpSumDropdown();
}

// 改變屬性型態時更新計算總金額 dropdown menu
function onchangeUnitType(t) {
	if(t.firstElementChild.value === "1" || t.firstElementChild.value === "2") {
		t.parentElement.parentElement.dataset.unittype = "number";
	} else {
		t.parentElement.parentElement.dataset.unittype = "";
	}
	
	// 更新 dropdown menu 的 HTML
	getLumpSumDropdown()
}

// 改變計算總金額屬性時更新 statusData.lumpSumA 和 statusData.lumpSumB , 防止選到重複的屬性
function onchangeSelectedAttr(t) {
	statusData[t.classList[0]] = t.value;
	// 更新 dropdown menu 的 HTML
	setLumpSumDropdown();
}



/* Modal */


