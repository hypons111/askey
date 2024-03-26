<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/quotation.css">

<div id="quotationContainer" class="subContainer">
	<input id="pId" class="form-control none" type="text">
	
	<div id="side" class="">
		<div id="sideTop">
			<div onclick="quotationReturn();Utils.RemoveSessionStorageItem('assetCheckboxStatus');Utils.RemoveSessionStorageItem('itemId')">
				<i class="fa-solid fa-chevron-left"></i>
				<p i18n="back">返回</p>
			</div>
			<i class="fa-solid fa-chevron-left FS_xl" onclick="toggleSideBar(this)"></i>
		</div>

		<div id="sideMiddle">
			<div id="buttonWrapper">
				<span><i class="fa-solid fa-arrow-up-from-bracket" onclick="showExportModal()" i18n="export" title="匯出"></i></span>
				<span class="adminBtn none"><i class=" fa-solid fa-square-plus FC_askeyRed" onclick="showAdminItemModal()" i18n="create" title="新增"></i></span>
				<span class="salesBtn none"><i class="fa-solid fa-square-plus FC_askeyRed" onclick="showSalesmanItemModal('', 'add')" i18n="create" title="新增"></i></span>
			</div>
			<div id="categoryWrapper">
				<div class="itemCategory"><p class="FC_white FW_xb" i18n="quotation_engineering">工程類</p><div id="engineeringWrapper"></div></div>
				<div class="itemCategory"><p class="FC_white FW_xb" i18n="quotation_maintenance">維護類</p><div id="ServiceWrapper"></div></div>
				<div class="itemCategory"><p class="FC_white FW_xb" i18n="quotation_other">其他類</p><div id="otherWrapper"></div></div>
			</div>
		</div>

		<div id="sideBottom">
			<div id="totalSum">總金額</div>
		</div>
	</div>
	
	<div id="main">
		<div id="mainTop">
			<div class="phoneHeader">
				<span class="phoneItem">
					<i class="fa fa-bars" onclick="toggleSmallBarContent('on', this)"></i>
					<i class="fa-solid fa-x none" onclick="toggleSmallBarContent('off', this)"></i>
				</span>
				<p id="name" class="FS_xl FW_xb"></p>
				<p id="description" class="FW_l nonPhoneItem">敘述</p>
				<span class="phoneItem" onclick="">
					<i class="fa-solid fa-magnifying-glass phoneItem"></i>
				</span>
			</div>
			
			<div>
				<img src="./assets/image/Askey_logo.png" class="nonPhoneItem">
			</div>
		</div>
		
		<div id="emptyTable" class="none">
			<div>
				<p class="FS_xxl" i18n="nithbey">尚未建立任何品項類型</p>
				<span class="adminBtn none"><i class="adminBtn fa-solid fa-square-plus none FS_xxl FC_askeyRed" onclick="showAdminItemModal()" i18n="create" title="新增"></i></span>
				<span class="salesBtn none"><i class="salesBtn fa-solid fa-square-plus none FS_xxl FC_askeyRed" onclick="showSalesmanItemModal('', 'add')" i18n="create" title="新增"></i></span>
			</div>
		</div>
		
		<div id="mainMiddle" class="none">
			<div id="searhBar" class="shadow">
				<div id="inputWrapper"></div>
				<div id="buttonWrapper">
					<button type="button" id="clearButton" class="btn btn-secondary" onclick="initSearchBar()" i18n="clear">清除</button>
					<button type="button" id="searchButton" class="btn redButton" onclick="queryItemData()" i18n="search">查詢</button>
				</div>
			</div>
		</div>
		
		<div id="mainBottom" class="none">
			<table data-itemid="" id="itemTable"></table>
		</div>
		
	</div>

</div>

<%-- <jsp:include page="modal/attrSettingModal.jsp"/> --%>
<jsp:include page="modal/exportQuotationModal.jsp"/>
<jsp:include page="modal/adminQuotationItemModal.jsp"/>
<jsp:include page="modal/salesQuotationItemModal.jsp"/>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script type="text/javascript" src="assets/js/quotation.js"></script>