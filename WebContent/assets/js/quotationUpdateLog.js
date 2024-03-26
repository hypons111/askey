//操作 : operate
//項目 : item
//項目名稱 : itemName
//品項類型 : itemType
//品項屬性 : attrName
//異動時間 : updateDateTime
var lang = localStorage.getItem("askeyLanguage");
var itemTypeData = {}
$(document).ready(function() {
	Utils.SetI18N();
	initialize();
	Utils.SetDateTimeRange("#searhBarWrapper");
	getItemTypeData();
})

function initialize() {
	document.querySelector("#quotationName").innerText = `${sessionStorage.getItem("q_name")} (id:${sessionStorage.getItem("p_id")})`
}

function getItemTypeData() {
	const requestData = {
		"p_id" : sessionStorage.getItem("p_id")
	};
	axios
		.post("qms01.do?method=queryLogSelection", requestData)
		.then(response => {
			itemTypeData = response.data.responseInfo;
		})
}

// 改變項目
function onchangeItem(t) {
//	setItemName(t.value);
	setItemType(t.value);
}
// 改變項目名稱
function onchangeItemName(t) {
	setAttrName(t.value);
}

// 項目名稱
function setItemName(value) {
	let htmlString = "";
	switch(value) {
		case "QPROJECT" :
			htmlString = `<option value="1">名稱</option>`;
			if(document.querySelector("#operate").value === "update") {
				htmlString += `<option value="2">簡稱</option>
								<option value="3">敘述</option>
								<option value="4">狀態</option>`;
			}
			document.querySelector("#itemType").innerHTML = "";
			document.querySelector("#itemType").disabled = true;
			document.querySelector("#attrName").innerHTML = "";
			document.querySelector("#attrName").disabled = true;
			break;
		case "QITEM" :
			htmlString = `<option value="5">名稱</option>`;
			if(document.querySelector("#operate").value === "update") {
				htmlString += `<option value="6">敘述</option>`;
			}
			document.querySelector("#itemType").innerHTML = "";
			document.querySelector("#itemType").disabled = true;
			document.querySelector("#attrName").innerHTML = "";
			document.querySelector("#attrName").disabled = true;
			break;
		case "QATTR" :
			htmlString = `<option value="7">名稱</option>`
			if(document.querySelector("#operate").value === "update") {
				htmlString += `<option value="8">資料型態</option>
								<option value="9">是否必填</option>
								<option value="10">總金額計算欄位</option>
								<option value="11">權限開放</option>
								<option value="12">狀態</option>`;
			}
			break;
		case "QDATA" :
			htmlString = `<option value="13">名稱</option><option value="14">屬性值</option>`;
			break;
	}
	document.querySelector("#itemName").innerHTML = htmlString;
}

// 品項類型
function setItemType(value) {
	let htmlString = "";
	if(value === "QPROJECT") {
		document.querySelector("#itemType").disabled = true;
	} else {
		itemTypeData.items.forEach(item => {
			htmlString += `<option value="${item.item_id}">${item.item_name}</option>`;
		})
		document.querySelector("#itemType").disabled = false;
	}
	document.querySelector("#itemType").innerHTML = htmlString;
}

// 品項屬性
function setAttrName(value) {
	let htmlString = "";
	if(value === "8" || value === "9" || value === "11" || value === "12" || value === "14") {
		const itemAttributeArray = itemTypeData.attributes.filter(attr => attr.item_id == document.querySelector("#itemType").value);
		const itemDataArray = itemTypeData.datas.filter(attr => attr.item_id == document.querySelector("#itemType").value);
		itemAttributeArray.forEach(item => {
			htmlString += `<option data-attrid="${item.attr_id}" data-colid="${item.col_id}">${Language[localStorage.getItem("askeyLanguage")][item.attr_name]}</option>`;
		})
		document.querySelector("#attrName").disabled = false;
	} else {
		document.querySelector("#attrName").disabled = true;
	}
	document.querySelector("#attrName").innerHTML = htmlString;
}

function queryUpdateLog() {
	document.querySelector("#initDataTableString").classList.add("none");
	const data = document.querySelector("#updateDateTime").value.split(" - ");
	const requestData = {
		"p_id": sessionStorage.getItem("p_id"),	
		"op_type": document.querySelector("#operate").value,
		"table_name": document.querySelector("#item").value,
		"item_id": document.querySelector("#itemType").value,
//		"attr_id": document.querySelector("#attrName").dataset.attrid,
//		"col_id":  document.querySelector("#attrName").dataset.colid,
		"sdate": data[0],
		"edate": data[1]
	}
	axios
	.post("qms01.do?method=queryProjectLog", requestData)
	.then(response => {
		const column = [
			{ data: "user_name", title: "<p i18n='user'>使用者名稱</p>", className: "" },
			{ data: "op_name", title: "<p i18n='action'>操作</p>", className: "" },
			{ data: "type_name", title: "<p i18n='event'>項目</p>", className: "" },
			{ data: "item_name", title: "<p i18n='itemType'>品項類型</p>", className: "" },
			{ data: "attr_name", title: "<p i18n='attribute'>屬性名稱</p>", className: "" },
			{ data: "column_name", title: "<p i18n='content'>內容</p>", className: "" },
			{ data: "before_val", title: "<p i18n='originValue'>修改前</p>", className: "" },
			{ data: "after_val", title: "<p i18n='revisedValue'>修改後</p>", className: "" },
			{ data: "create_datetime", title: "<p i18n='modifiedTime'>異動時間</p>", className: "" }
		];
		const bodyData = [];
		response.data.responseInfo.forEach(data => {
			if(data.column_name === "data_type") {
				data.before_val = Language[localStorage.getItem("askeyLanguage")][`${data.column_name}${data.before_val}`]
				data.after_val = Language[localStorage.getItem("askeyLanguage")][`${data.column_name}${data.after_val}`]
			}
						
			if(data.attr_name === "name" || data.attr_name === "qty" || data.attr_name === "price" || data.attr_name === "unit") {
				data.attr_name = Language[localStorage.getItem("askeyLanguage")][`${data.attr_name}`]
			}
			
			for(const key in data) {
				if(typeof data[key] === "object") {
					data[key] = ""
				}
			}
			// data_name有值時，才加"-"
			if(""!=data.data_name){
				data.data_name=data.data_name+"-";
			}
			const rowObject = {
				"user_name": `<p>${data.user_name}</p>`,						// 使用者名稱	User
				"op_name": `<p>${Language[lang][data.op_name]}</p>`,			// 操作			Action
				"type_name": `<p>${Language[lang][data.type_name]}</p>`,		// 項目			Event
				"item_name": `<p>${data.item_name}</p>`,						// 品項類型		Item type
				"attr_name": `<p>${data.data_name}${data.attr_name}</p>`,		// 品項屬性		Attribute
				"column_name": `<p>${Language[lang][data.column_name]}</p>`,	// 內容			Content
				"before_val": `<p>${data.before_val}</p>`,						// 修改前		Origin value
				"after_val": `<p>${data.after_val}</p>`,						// 修改後		Revised value
				"create_datetime": `<p>${data.create_datetime}</p>`,			// 異動時間		Modified time
			};
			bodyData.push(rowObject);
//			if(data.type_name === "品項屬性" && typeof data.before_val !== "object") {
//				data.before_val = Language[localStorage.getItem("askeyLanguage")].CONVERT.DATATYPE[data.before_val];
//				data.after_val = Language[localStorage.getItem("askeyLanguage")].CONVERT.DATATYPE[data.after_val];
//			}
		})
		$("#dataTable").DataTable({
			destroy: true,
	        language: Language[`${localStorage.getItem("askeyLanguage")}`],
			columns: column,
			data: bodyData,
		    searching: false,
		    lengthChange: false,
		    info: false,
		    dom: '<"top"i>rt<"pagination-wrapper"lp>',
		})
	})
	.then(() => {
		Utils.SetI18N();
	})
}
function initSearhBar() {
	const selectArray = document.querySelectorAll("#searhBar select")
	for(let i=0; i<selectArray.length; i++) {
		switch(i) {
		case 0:
			selectArray[0].value = "new"
			break
		case 1:
			selectArray[1].value = "init"
			break
		case 2:
			selectArray[2].innerHTML = "";
			selectArray[2].disabled = true;
			break
		case 3:
			selectArray[3].innerHTML = "";
			selectArray[3].disabled = true;
			break
		case 4:
			selectArray[4].innerHTML = "<option value='init' disabled='' selected=''>請先選擇項目</option>";
			break
		}
	}
	Utils.SetDateTimeRange("#searhBarWrapper");
}









