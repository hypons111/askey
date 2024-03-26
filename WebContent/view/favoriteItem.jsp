<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/searhBarCommon.css">

<div id="favoriteItemContainer" class="subContainer">

	<div id="searhBarHeader">
		<i class="fa-solid fa-chevron-left" onclick="Utils.Router()"></i>
		<p class="FW_xb" i18n="favoriteItem_create_customerServiceItemManagement">客戶服務工項管理</p>
		<i class="fa-solid fa-magnifying-glass" onclick="toggleSearhBar()"></i>
	</div>

	<div id="searhBarWrapper" class="hide">
	
		<div id="backgroundBlock" onclick="toggleSearhBar()"></div>
	
		<div id="searhBar" class="shadow">
						
			<div id="inputWrapper">
				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault1" i18n="favoriteItem_create_Customer">客戶別</label>
					<div class="btn-group">
						<select id="customer" class="form-select btn dropdown-toggle" aria-label="Floating label select example"></select>
					</div>
				</div>

				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault1" i18n="favoriteItem_create_itemType">工項類型</label>
					<div class="btn-group">
						<select id="category" class="form-select btn dropdown-toggle" aria-label="Floating label select example">
							<option value="0" i18n="all" selected="">全選</option>
							<option value="1" i18n="engineering">工程類</option>
							<option value="2" i18n="maintenance">維護類</option>
							<option value="3" i18n="other">其它類</option>
						</select>
					</div>
				</div>
		
				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault2" i18n="favoriteItem_create_itemName">品項名稱</label>
					<div class="btn-group">
						<select class="form-select" id="itemSelect" aria-label="Floating label select example" onchange="onchangeToQueryAll(this)">
							<option value="0" i18n="all" selected="">全選</option>
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
					<input id="item" class="dropdownInput" type="text" value="" disabled>
				</div>
		
				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault2" i18n="favoriteItem_create_price">價格</label>
					<div class="btn-group">
						<select class="form-select" id="priceSelect" aria-label="Floating label select example" onchange="onchangeToBetween(this); onchangeToQueryAll(this)">
							<option value="0" i18n="all" selected="">全選</option>
							<option value="b1" i18n="lessThan">少於</option>
							<option value="b2" i18n="equals">等於</option>
							<option value="b3" i18n="greaterThan">大於</option>
							<option value="b4" i18n="between">介於</option>
						</select>
					</div>
					<input id="price" class="dropdownInput normalInput" type="text" value="" disabled>
					<div class="none betweenInput">
						<input id="priceA" class="dropdownInput startNumber" type="text" value="">~
						<input id="priceB" class="dropdownInput endNumber" type="text" value="">
					</div>
				</div>
			</div>

			<div id="buttonWrapper">
				<button type="button" id="clearButton" class="btn btn-secondary" onclick="initSearchBar()" i18n="clear">清除</button>
				<button type="button" id="searchButton" class="btn redButton" onclick="queryCommonItems(true)" i18n="search">查詢</button>
			</div>
		</div>	
	</div>
	
	<div id="dataTableWrapper">
		<div id="tableTitle">
			<span>
				<i class="fa-solid fa-star FS_xl"></i>
				<h4 class="FW_xb" i18n="favoriteItem_create_customerServiceItemManagement">客戶服務工項管理</h4>
			</span>
			<span></span>
			<span>
				<button id="plus" class="btn" onclick="showFavoriteItemModal('add')"><i class="fa-solid fa-square-plus FC_askeyRed FS_xl" i18n="create" title="新增"></i></button>
			</span>
		</div>
		
		<table id="dataTable"></table>
	</div>
</div>

<jsp:include page="modal/favoriteItemModal.jsp"/>
<script type="text/javascript" src="assets/js/favoriteItem.js"></script>

<style>
#searhBarWrapper #inputWrapper {
    gap: 0.5em 4em;
}
select.is-invalid {
	border-color: var(--bs-form-invalid-border-color) !important;
}
select,
input,
#customers,
.form-select {
	border-radius: var(--bs-border-radius);
	border: 1px solid var(--bs-gray-600);
}
#itemSelect,
#priceSelect {
	width: fit-content !important;
	border-right-width: 0;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}
#searhBarWrapper .btn-group {
	flex-grow: 0;
}
#inputWrapper > div:first-child > .btn-group,
#inputWrapper > div:nth-child(2) > .btn-group {
	flex-grow: 1;
}
#favoriteItemContainer input {
	flex-grow: 1;
	width: 60%;
	padding: 6px 12px;
	background-color: white;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
	border-top-right-radius: var(--bs-border-radius);
	border-bottom-right-radius: var(--bs-border-radius);
}
#favoriteItemContainer input.dropdownInput[disabled] {
	background-color: var(--bs-gray-300); 
	border: 1px solid var(--bs-gray-600);
}
.betweenInput {
	display: flex;
	flex-grow: 1;
	width: 40%;
	align-items: center;
}
.betweenInput input {
	flex-grow: 1;
}
.betweenInput input:first-child {
	border-top-right-radius: 0 !important;
	border-bottom-right-radius: 0 !important;
}
td:last-child:not(.dataTables_empty) {
	padding-right: 2em !important;
	text-align: right !important;
}
td i:first-child {
	padding-right: 0.5em !important;
}
.quote_no ,
.p_name {
	overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 10em;
}
.pagination-wrapper {
  width: 100%;
	display:flex;
	justify-content: center;
	align-items: center;
	padding: 1em;
/* 	border: 1px solid red; */
}

	


/* 大 */
@media(max-width: 1746px) {}

/* 中 */
@media(max-width: 1199px) {}
	   
/* 細 直 */
@media(max-width: 500px) or (max-height: 600px) {}

/* 細 橫 */
@media(max-height: 600px) {}
</style>