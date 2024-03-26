if(typeof sessionStorage.getItem(`${sessionStorage.getItem("dataId")}`) === "object") {
	var checkedSet = new Set();
} else {
	var checkedSet = new Set()
	JSON.parse(sessionStorage.getItem(`${sessionStorage.getItem("dataId")}`)).forEach(id => {
		checkedSet.add(id);
	})
}

if(typeof sessionStorage.getItem(`${sessionStorage.getItem("itemId")}`) === "object") {
	var itemAssetArray = 0;
} else {
	itemAssetArray = sessionStorage.getItem(`${sessionStorage.getItem("itemId")}`)
}

var assetData = JSON.parse(sessionStorage.getItem("assetData"));
var currentCheckboxStatus = ""
	
$(document).ready(function () {
	Utils.SetI18N();
})
	
showQuotationSidebarItems();
showSearchItems();
showQuotationItemTable(assetData[0]);

//更新 sidebar
function initSearchBar() {
	document.querySelectorAll("#assetItemWrapper span").forEach((span, index) => {
		if(span.classList.contains("FC_askeyRed")) {
			console.log(index)
			showSearchItems(index);
		}
	})
}
function showQuotationSidebarItems() {
	const pId = document.querySelector("#pId").value;
	const assetItemWrapper = document.querySelector("#assetItemWrapper");
	let htmlString = "";
	sessionStorage.setItem("item_gid", assetData[0].item_gid);
	assetData.forEach((item, index) => {
		let isRed = index === 0 ? "FC_askeyRed" : "";
		htmlString += `<div class="item pointer">
							<span class="${isRed}" data-itemgid="${item.item_gid}" data-obj='${JSON.stringify(item)}' onclick="setColor(this);getTargetAssetData('${item.item_gid}');showSearchItems(${index});setItemGId(${item.item_gid})">${item.item_name}</span>
						</div>`;
	})
	assetItemWrapper.innerHTML = htmlString;
}
function setColor(t) {
	t.parentElement.parentElement.querySelectorAll(".item").forEach(item => {
		item.firstElementChild.classList.remove("FC_askeyRed");
	})
	t.classList.add("FC_askeyRed")
}
function getTargetAssetData(itemgid) {
	showQuotationItemTable(assetData.filter(data => data.item_gid === itemgid)[0]);
}

//更新 search bar
function showSearchItems(target = 0) {
	let htmlString = "";
	try {
		assetData[target].attributes.forEach((attr, index) => {
			switch (attr.data_type) {
				case "1":
				case "2":
					htmlString += `<div class="form-check" data-attrgid="${attr.attr_gid}" data-datatype="${attr.data_type}">
										<label class="form-check-label">${attr.attr_name}</label>
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
									</div>`;
					break;
				case "3":
					htmlString += `<div class="form-check" data-attrgid="${attr.attr_gid}" data-datatype="${attr.data_type}">
										<label class="form-check-label">${attr.attr_name}</label>
										<div class="btn-group">
											<select id="" class="form-select" aria-label="" onchange="onchangeToQueryAll(this)">
												<option value="0" i18n="all" selected>全選</option>
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
									</div>`;
					break;
				case "4":
					htmlString += `<div class="form-check" data-attrgid="${attr.attr_gid}" data-datatype="${attr.data_type}">
										<label class="form-check-label">${attr.attr_name}</label>
										<input class="dtr">
									</div>`;
					break;
				case "5":
					htmlString += `<div class="form-check" data-attrgid="${attr.attr_gid}" data-datatype="${attr.data_type}">
										<label class="form-check-label">${attr.attr_name}</label>
										<input class="dr">
									</div>`;
					break;
			}
		});
	} catch(e) { console.log(e) }
	document.querySelector("#assetInputWrapper").innerHTML = htmlString;
	Utils.SetDateTime("#mainMiddle", "all");
	Utils.SetI18N();
}

//更新 dataTable
function setItemGId(itemgid) {
	sessionStorage.setItem("item_gid", itemgid);
}
function showQuotationItemTable(queryData) {
	const data = queryData === undefined ? assetData[target] : queryData
	const column = [
		{
			title: `<input class="getJiraList checkAll" name='tableCheckbox' type='checkbox' onclick="assetCheckboxStatus(this)"/>`,
			render: function (data, type, row, meta) {
				return data;
			},
		},
		{
			title: "<p i18n='no'>序號</p>",
			render: function (data, type, row, meta) {
				return data;
			},
		}
	];
	for (let i = 0; i < data.attributes.length; i++) {
		column.push({
			title: data.attributes[i].attr_name,
			render: function (data, type, row, meta) {
				return data;
			},
		});
	}
	
	const tableData = [];
	let row = [];
	const checkedArray  = data.datas.filter(item => checkedSet.has(item.data_gid))
	const noncheckedArray  = data.datas.filter(item => !checkedSet.has(item.data_gid))
	let seqNoCounter = 1;
	for (let i = 0; i < checkedArray.length; i++) {
		if(data.datas[i].item_gid === data.item_gid) {
			if(typeof sessionStorage.getItem(`${sessionStorage.getItem("dataId")}`) === "string") {
				dataArray = JSON.parse(sessionStorage.getItem(`${sessionStorage.getItem("dataId")}`))
				row = [`<input name='tableCheckbox' type='checkbox' data-agid="${checkedArray[i].a_gid}" data-datagid="${checkedArray[i].data_gid}" onclick="assetCheckboxStatus(this)" checked/>`,
					`<p class="showIcon" name='tableCheckbox' type='text'>${seqNoCounter}</p>`];
			} else {
				row = [
					`<input name='tableCheckbox' type='checkbox' data-agid="${checkedArray[i].a_gid}" data-datagid="${checkedArray[i].data_gid}" onclick="assetCheckboxStatus(this)"/>`,
					`<p class="showIcon" name='tableCheckbox' type='text'>${i + 1}</p>`,
				];
			}
			for(let j = 1; j <= 20; j++) {
				if(typeof checkedArray[i][`col${j}`] === "string") {
					row.push(`<p name='tableCheckbox' type='text'>${checkedArray[i][`col${j}`]}</p>`);
				} else {
					row.push(`<p name='tableCheckbox' type='text'></p>`);
				}
			}
			tableData.push(row);
		}
		seqNoCounter++;
	}
	for (let i = 0; i < noncheckedArray.length; i++) {
		if(noncheckedArray[i].item_gid === data.item_gid) {
			if(typeof sessionStorage.getItem(`${sessionStorage.getItem("dataId")}`) === "string") {
				dataArray = JSON.parse(sessionStorage.getItem(`${sessionStorage.getItem("dataId")}`))
				row = [`<input name='tableCheckbox' type='checkbox' data-agid="${noncheckedArray[i].a_gid}" data-datagid="${noncheckedArray[i].data_gid}" onclick="assetCheckboxStatus(this)"/>`,
					`<p class="showIcon" name='tableCheckbox' type='text'>${seqNoCounter}</p>`];
			} else {
				row = [
					`<input name='tableCheckbox' type='checkbox' data-agid="${noncheckedArray[i].a_gid}" data-datagid="${noncheckedArray[i].data_gid}" onclick="assetCheckboxStatus(this)"/>`,
					`<p class="showIcon" name='tableCheckbox' type='text'>${seqNoCounter}</p>`,
					];
			}
			for(let j = 1; j <= 20; j++) {
				if(typeof noncheckedArray[i][`col${j}`] === "string") {
					row.push(`<p name='tableCheckbox' type='text'>${noncheckedArray[i][`col${j}`]}</p>`);
				} else {
					row.push(`<p name='tableCheckbox' type='text'></p>`);
				}
			}
			tableData.push(row);
		}
		seqNoCounter++;
	}
	
	// 初始化 dataTable
	document.querySelector("#assetMainBottom").innerHTML = "<p id='assetMainBottomNote' i18n='assetNotice'>請勾選欲報價項目後，點擊左上角[返回]</p><table data-itemid='' id='assetItemTable'></table>";
	const t = $("#assetItemTable").DataTable({
		"language": Language[`${localStorage.getItem("askeyLanguage")}`],
		"paging": false,
		"scrollCollapse": true,
		"columns": column,
		"data": tableData,
		"searching": false,
		"lengthChange": false,
		"info": false,
		"destroy": true,
		"dom": 'rt',
		"ordering": false,
		"autoWidth": false,
		"responsive": true,
		"drawCallback": function(settings) {
			Utils.SetI18N();
		}
	});
	
	const rowArray = document.querySelectorAll("#assetItemTable tbody tr")
	const checkAllInput = document.querySelector("#assetItemTable thead tr th input")
	let counter = 0;
	if(rowArray[0].firstElementChild.innerText !== "查無資料") {
		for(const row of rowArray) {
			if(row.firstElementChild.firstElementChild.checked) {
				counter ++;
			}
		}
	} else {
		rowArray[0].firstElementChild.classList.add("block");
	}
	if(counter === rowArray.length) {
		checkAllInput.checked = true;
	} else {
		checkAllInput.checked = false;
	}
}

function assetCheckboxStatus(t) {
	const datasArray = assetData.filter(asset => asset.item_gid === sessionStorage.getItem("item_gid"))[0].datas;
	const rowArray = document.querySelectorAll("#assetItemTable tbody tr")
	if(t.classList.contains("checkAll")) {
		if(t.checked) {
			rowArray.forEach(row => {
				checkedSet.add(row.firstElementChild.firstElementChild.dataset.datagid);
			})
		} else {
			rowArray.forEach(row => {
				checkedSet.delete(row.firstElementChild.firstElementChild.dataset.datagid);
			})
		}
		rowArray.forEach(row => {
			row.firstElementChild.firstElementChild.checked = t.checked
		})
	} else {
		if(t.checked) {
			checkedSet.add(t.dataset.datagid);
		} else {
			checkedSet.delete(t.dataset.datagid);
		}
		let counter = 0;
		for(const row of rowArray) {
			if(row.firstElementChild.firstElementChild.checked) {
				counter ++;
			}
		}
		if(counter === rowArray.length) {
			t.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.checked = true;
			t.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.dataset.checked = "all";
		} else if(counter === 0)  {
			t.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.dataset.checked = "none";
			t.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.checked = false;
		} else {
			t.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.checked = false;
			t.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.firstElementChild.firstElementChild.dataset.checked = "";
		}
	}
}
/* check jira items */
function saveCheckboxStatus() {	
	let checkedArray = [...checkedSet];
	let checkedJson = JSON.stringify(checkedArray);
	sessionStorage.setItem(`${sessionStorage.getItem("dataId")}`, checkedJson)
}

/* togglers */
function onchangeToQueryAll(t) {
	if(t.value === "0" || t.value === "a7" || t.value === "a8") {
		t.parentElement.nextElementSibling.value = "";
		t.parentElement.nextElementSibling.disabled = true;
	} else {
		t.parentElement.nextElementSibling.disabled = false;
	}
}
function onchangeToBetween(t) {
	if (t.value === "b4") {
		t.parentElement.parentElement.querySelector(".normalInput").classList.add("none");
		t.parentElement.parentElement.querySelector(".betweenInput").classList.remove("none");
	} else {
		t.parentElement.parentElement.querySelector(".normalInput").classList.remove("none");
		t.parentElement.parentElement.querySelector(".betweenInput").classList.add("none");
	}
}
function queryAssetData() {
	const jiraIdArray = sessionStorage.getItem("jiraIdList").split(",");
	if(jiraIdArray[jiraIdArray.length-1] == "") {
		jiraIdArray.pop();
	}
	const requestData = {
		"jira_id": jiraIdArray,
		"querys":[]
	}
	const queryConditionArray = document.querySelectorAll("#assetInputWrapper .form-check");
	queryConditionArray.forEach(item => {
		let attrGId = item.dataset.attrgid;
		let opType = "";
		let value1 = "";
		let value2 = ""; 
		try {
			if(item.dataset.datatype === "4" || item.dataset.datatype === "5") {
				const value = item.querySelector("input").value.split(" - ")
				value1 = value[0];
				value2 = typeof value[1] === "undefined" ? "" : value[1];
				if(item.querySelector("input").value !== "") {
					opType = "d1";
				}
			} else if(!item.querySelector(".dropdownInput").classList.contains("none")) {
				if(item.firstElementChild.nextElementSibling.firstElementChild.value !== "0") {
					value1 = item.querySelector(".dropdownInput").value;
					opType = item.firstElementChild.nextElementSibling.firstElementChild.value;
				}
			} else {
				if(item.firstElementChild.nextElementSibling.firstElementChild.value !== "0") {
					value1 = item.querySelector(".startNumber").value;
					value2 = item.querySelector(".endNumber").value;
					opType = item.firstElementChild.nextElementSibling.firstElementChild.value;
				}
			}
		} catch(e) { 
			console.error("error catched")
		} 
		requestData.querys.push({									
			"attr_gid": attrGId,					//查詢欄位代碼
			"attr_value": value1,					//查詢欄位值
			"attr_value2": value2,					//操作類型為b4, c1, c2請將迄值放這裡
			"op_type": opType						//操作類型, 請參照上圖, b4, c1, c2
		})
	})
	console.log(requestData);
//	Swal.fire({ title : Language[L].loading })
	axios
	.post("qms03.do?method=queryAssetData", requestData)
	.then(response => {
//		document.querySelector(".swal2-confirm").click();
		const queryData = response.data.responseInfo.filter(data => data.item_gid === sessionStorage.getItem("item_gid"))[0]
		if(queryData.datas.length === 0) {
			alert(Language[localStorage.getItem("askeyLanguage")].noMatchingInformation);
		} else {
			showQuotationItemTable(queryData);
		}
	})
}
/* togglers */