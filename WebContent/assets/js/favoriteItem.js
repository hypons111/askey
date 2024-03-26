var L = localStorage.getItem("askeyLanguage");
var customerHTML = "";
var customerObject = {}
var currentPage = 0;
var checkDuplicateSet = new Set();
var URLs = {
	"query" : "qms04.do?method=queryCommon",
	"create" : "qms04.do?method=insertCommon",
	"edit" : "qms04.do?method=updateCommon",
	"delete" : "qms04.do?method=deleteCommon",
	"get_customers" : "qms01.do?method=queryGroup",
}
var Converse = {
	"Category" : {
		"1" : "engineering",
		"2" : "service",
		"3" : "other",
	}
}
$(document).ready(function() {
	getCustomers();
})

/*  listener */
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
		document.querySelector(".normalInput").classList.add("none");
		document.querySelector(".betweenInput").classList.remove("none");
	} else {
		document.querySelector("#priceA").value = ""
		document.querySelector("#priceB").value = ""
		document.querySelector(".normalInput").classList.remove("none");
		document.querySelector(".betweenInput").classList.add("none");
	}
}

function setPaginationEventListener() {
	document.querySelector(".pagination").addEventListener("click", event => {
		const target = Number(event.target.innerText);
		if(target >= 0) {
			console.log(target);
		}
	})
}
/*  listener */

function getCustomers() {
	axios.get(URLs.get_customers)
	.then(response => {
		const customers = response.data.responseInfo;
		for(let i=0; i<customers.length; i++) {
			if(customers[i].status === "1") {
				customerObject[customers[i].group_id] = customers[i].group_name;
			}
		}
	})
	.then(() => {
		setCustomerDropdownMenu();
		queryCommonItems(true);
		Utils.SetI18N();
	})
}

function setCustomerDropdownMenu() {
	const customer = document.querySelector("#customer")
	for(const key in customerObject) {
		customerHTML += `<option value="${key}">${customerObject[key]}</option>`
	}
	customer.innerHTML = "<option value='0' i18n='all' selected>全選</option>"
	customer.innerHTML += customerHTML;
}

function queryCommonItems(isResetCurrentPage) {
	if(isResetCurrentPage) {
		currentPage = 0;
	}
	const requestData = {
		"customer_id": document.querySelector("#customer").value,
		"category": document.querySelector("#category").value,
		"querys":[]
	}
	const itemSelect = document.querySelector("#itemSelect")
	if(itemSelect.value !== "0") {
		const item = document.querySelector("#item")
		requestData.querys.push({
			"qry_name" : "c_name",
			"qry_value" : item.value,
			"op_type" : itemSelect.value
		})
	}
	const priceSelect = document.querySelector("#priceSelect")
	if(priceSelect.value !== "0") {
		const price = document.querySelector("#price")
		const priceA = document.querySelector("#priceA")
		const priceB = document.querySelector("#priceB")
		if(priceSelect.value === "b4") {
			requestData.querys.push({
				"qry_name" : "c_price",
				"qry_value" : priceA.value,
				"qry_value2" : priceB.value,
				"op_type" : priceSelect.value
			})
		} else {
			requestData.querys.push({
				"qry_name" : "c_price",
				"qry_value" : price.value,
				"op_type" : priceSelect.value
			})
		}
	}
	axios
	.post(URLs.query, requestData)
	.then(response => {
		const data = response.data.responseInfo
		const column = [
			{ title: "<p i18n='no'>序號</p>", className: "", data: "seq" },
			{ title: "<p i18n='favoriteItem_create_Customer'>客戶別</p>", className: "", data: "customer_name" },
			{ title: "<p i18n='favoriteItem_create_itemType'>工項類型</p>", className: "", data: "category" },
			{ title: "<p i18n='favoriteItem_create_itemName'>品項名稱</p>", className: "", data: "c_name" },
			{ title: "<p i18n='favoriteItem_create_price'>價格</p>", className: "", data: "c_price" },
			{ title: "<p i18n='favoriteItem_create_unit'>單位</p>", className: "", data: "unit" },
			{ title: "<p i18n=''></p>", className: "", data: "option" },
		];
		for(let i=0; i<data.length; i++) {
			checkDuplicateSet.add(data[i].customer_id + data[i].category + data[i].c_name)
			data[i].seq = i+1;
			data[i].customer_name = customerObject[data[i].customer_id];
			const category = data[i].category;
			data[i].category = Language[L][Converse.Category[data[i].category]];
			data[i].option = `<i class="fa-solid fa-pen pointer" onclick="showFavoriteItemModal('edit', '${data[i].customer_id}', '${data[i].c_id}', '${data[i].c_name}', ${category}, '${data[i].c_price}', '${data[i].unit}')" i18n='edit' title='編輯'></i>
								<i class='fa-solid fa-trash-can pointer' onclick="updateFavorite('delete', '${data[i].c_id}', this)" i18n='delete' title='刪除'></i>`;
		}
		$("#dataTable").DataTable({
			"columns": column,
			"data": data,
			"destroy": true,
			"dom": '<"top"i>rt<"pagination-wrapper"lp>',
			"info": false,
			"language": Language[L],
		    "lengthChange": false,
		    "ordering": false,
		    "searching": false,
		    "drawCallback": function(settings) {
		        const api = this.api();
		        const pageInfo = api.page.info();
		        if(pageInfo.page != currentPage) {
		        	this.fnPageChange(currentPage)
		        }
		        const aArray = document.querySelectorAll(".pagination a")
		        aArray.forEach(a => {
		        	a.addEventListener("click", event => {
			        	if(event.target.dataset.dtIdx === "previous") {
			        		currentPage --
			        	} else if(event.target.dataset.dtIdx === "next") {
			        		currentPage ++
			        	} else {
			        		currentPage = Number(event.target.dataset.dtIdx)
			        	}
		        	})
		        })
		    }
		})
	})
	.then(() => {
		Utils.SetI18N();
	})
}
function initSearchBar() {
	document.querySelectorAll("#inputWrapper select").forEach(select => {
		select.value = "0";
	})
	const item = document.querySelector("#item")
	const price = document.querySelector("#price")
	const priceA = document.querySelector("#priceA")
	const priceB = document.querySelector("#priceB")
	item.value = "";
	item.disabled = true;
	price.value = "";
	price.disabled = true;
	priceA.value = "";
	priceB.value = "";
	document.querySelector(".normalInput").classList.remove("none");
	document.querySelector(".betweenInput").classList.add("none");
}

/* modal */
function showFavoriteItemModal(option, customerName, itemId, itemName, category, price, unit) {
	const modalCustomer = document.querySelector("#modalCustomer")
	modalCustomer.innerHTML = "<option value='0' i18n='favoriteItem_create_select' selected disabled>請選擇客戶別</option>";
	modalCustomer.innerHTML += customerHTML;
	const modalTitle = document.querySelector("#modalTitle");
	switch(option) {
		case "add": 
			modalTitle.innerHTML = Language[L].createFavoriteItems;
			document.querySelector("#addFavoriteButton").classList.remove("none");
			document.querySelector("#editFavoriteButton").classList.add("none");
			break;
		case "edit":
			modalTitle.innerHTML = Language[L].editFavoriteItems;
			document.querySelector("#updateItemId").value = itemId;
			document.querySelector("#updateItemName").value = itemName;
			document.querySelector("#modalitemName").value = itemName;
			document.querySelector("#modalCustomer").value = customerName;
			document.querySelector("#modalCustomer").classList.remove("dim");
			document.querySelector("#modalCategory").value = category;
			document.querySelector("#modalCategory").classList.remove("dim");
			document.querySelector("#modalPrice").value = price;
			document.querySelector("#modalUnit").value = unit;
			document.querySelector("#addFavoriteButton").classList.add("none");
			document.querySelector("#editFavoriteButton").classList.remove("none");
			break;
	}
	$("#favoriteItemModal").modal('show');
	Utils.SetI18N();
}

function updateFavorite(option, c_id="") {
	const requestData = {}
	let isResetCurrentPage = true;
	switch(option) {
		case "edit":
			requestData.c_id = document.querySelector("#updateItemId").value
		case "create":
			requestData.customer_id = document.querySelector("#modalCustomer").value,
			requestData.c_name = document.querySelector("#modalitemName").value.trim(),
			requestData.category = document.querySelector("#modalCategory").value
			requestData.c_price = document.querySelector("#modalPrice").value.trim(),
			requestData.unit = document.querySelector("#modalUnit").value.trim()
			break;
		case "delete":
			if(confirm(Language[L].doYouWantToDeleteThisItem)) {
				requestData.c_id = c_id;
				isResetCurrentPage = false;
				break;
			} 
	}
	const check = requestData.customer_id + requestData.category + requestData.c_name
	if(option === "create") {
		if(checkDuplicateSet.has(check)) {
			alert("該服務工項已存在");
			return
		}
	} else if(option === "edit") {
		const oldName = document.querySelector("#modalitemName").value;
		const newName = document.querySelector("#updateItemName").value;
		if(oldName !== newName && checkDuplicateSet.has(check)) {
			alert("該服務工項已存在");
			return
		}
	}
	const form = document.querySelector("#body");
	const constraints = {
		modalitemName: {
			presence: {
				message: "A"
			},
		},
		modalCustomer: {
			presence: {
				message: "B"
			},
		},
		modalCategory: {
			presence: {
				message: "C"
			},
		},
		modalPrice: {
			presence: {
				message: "D"
			},
		},
		modalUnit: {
			presence: {
				message: "E"
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
	if(document.querySelector("#modalCustomer").value === "0") {
		errors.push({ "attribute": "modalCustomer" })
	}
	// 檢查工項類型
	if(document.querySelector("#modalCategory").value === "0") {
		errors.push({ "attribute": "modalCategory" })
	}
	if(option === "delete" || errors.length === 0) {
		axios
		.post(URLs[option], requestData)
		.then(response => {
			queryCommonItems(isResetCurrentPage);
			document.querySelector("#modalCloseButton").click();
		})
	} else {
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
	}
}

function closeQuotationModal() {
	const form = document.querySelector("#body");
	// 重置 error message
	form.querySelectorAll('.errorMessage').forEach(element => { element.classList.add("none"); });
	// 重置 input tag effect
	form.querySelectorAll('.is-invalid').forEach(element => { element.classList.remove('is-invalid'); });
	document.querySelector("#modalCustomer").classList.add("dim");
	document.querySelector("#modalitemName").value = "";
	document.querySelector("#modalCategory").value = "0";
	document.querySelector("#modalCategory").classList.add("dim");
	document.querySelector("#modalPrice").value = "";
	document.querySelector("#modalUnit").value = "";
}

