<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/searhBarCommon.css">

<div id="accountSystemContainer" class="subContainer">

	<div id="searhBarHeader">
		<i class="fa-solid fa-chevron-left" onclick="Utils.Router()"></i>
		<p class="FW_xb">使用者維護</p>
		<i class="fa-solid fa-magnifying-glass" onclick="isHideSearhBarHeader=!isHideSearhBarHeader"></i>
	</div>

	<div id="searhBarWrapper">
		<div id="backgroundBlock" onclick="toggleSearhBar()"></div>
		
		<div id="searhBar" class="shadow">
		
			<div id="inputWrapper">
				<div class="form-check userItem pageItem">
					<label class="form-check-label" for="flexRadioDefault1" i18n="accountSystem_account">使用者帳號</label>
					<div class="btn-group">
						<select id="userId" class="form-select btn dropdown-toggle" data-init=""></select>
					</div>
				</div>
			
				<div class="form-check userItem pageItem">
					<label class="form-check-label" for="flexRadioDefault1" i18n="accountSystem_name">使用者名稱</label>
					<div class="btn-group">
						<select id=userName class="form-select btn dropdown-toggle" data-init="">
							<option value="" i18n="all" selected>全選</option>
						</select>
					</div>
				</div>
			
				<div id="roleGroup" class="form-check userItem pageItem">
					<label class="form-check-label" for="" i18n="accountSystem_role">角色</label>
					<div class="btn-group">
						<select id="role" class="form-select btn dropdown-toggle" data-init="">
							<option value="" i18n="all" selected>全選</option>
							<option value='admin' i18n="admin">管理者</option>
							<option value='sales' i18n="sales">業務</option>
						</select>
					</div>
				</div>
			
				<div id="assignedCustomerGroup" class="form-check userItem pageItem">
					<label class="form-check-label" for="" i18n="accountSystem_handleCustomer">負責客戶</label>
					<div class="btn-group">
						<select id="assignedCustomer" class="form-select btn dropdown-toggle" data-init="">
							<option value="" i18n="all" selected>全選</option>
						</select>
					</div>
				</div>

				<div class="form-check customerItem pageItem none">
					<label class="form-check-label" for="flexRadioDefault1" i18n="accountSystem_customer">客戶名稱</label>
					<div class="btn-group">
						<select id="customerName" class="form-select btn dropdown-toggle" data-init="">
							<option value="" i18n="all" selected>全選</option>
						</select>
					</div>
				</div>

				<div id="statusGroup" class="form-check">
					<label class="form-check-label" for="" i18n="accountSystem_status">狀態</label>
					<div class="btn-group">
						<select id="status" class="form-select btn dropdown-toggle" data-init="" onchange="onchangeStatus(this)">
							<option value="" i18n="all">全選</option>
							<option value='1' i18n="accountSystem_on" selected>啟用</option>
							<option value='0' i18n="accountSystem_off">停用</option>
							<option value='2' i18n="accountSystem_deleted">刪除</option>
						</select>
					</div>
				</div>
			</div>
			
			<div id="buttonWrapper">
				<button type="button" id="clearButton" class="btn btn-secondary" onclick="clearQuery()" i18n="clear">清除</button>
				<div id="panalPartition"></div>
				<button id="query" type="button" id="searchButton" class="btn redButton" onclick="query()" i18n="search">查詢</button>
			</div>
		</div>
	</div>

	<div id="dataTableWrapper">
		<div id="tableTitle">
			<span id="pageNameWrapper">
				<h4 id="pageName" class="FW_xb noM" i18n="accountSystem_userMaintenance">使用者維護</h4>
			</span>
			<span id="switchPageSpan">
				<button type="button" class="btn" onclick="switchPage('USER', this)"><i class="fa-solid fa-user FC_askeyRed" i18n="accountManagement" title="帳號管理"></i></button>
				<div id="panalPartition"></div>
				<button type="button" class="btn" onclick="switchPage('CUSTOMER', this)"><i class="fa-solid fa-user-group" i18n="customerManagemen" title="客戶管理"></i></button>
			</span>
			<span>
				<button type="button" class="btn" data-json="{&quot;modalCustomerId&quot;:&quot;&quot;,&quot;modalCustomerName&quot;:&quot;&quot;,&quot;modalAddress&quot;:&quot;&quot;,&quot;modalEmail&quot;:&quot;&quot;,&quot;modalCurrency&quot;:&quot;TWD&quot;,&quot;modalUserAccount&quot;:&quot;&quot;,&quot;modalUserName&quot;:&quot;&quot;,&quot;modalPhone&quot;:&quot;&quot;,&quot;modalRole&quot;:&quot;sales&quot;,&quot;modalStatus_1&quot;:true}" data-customerids="0" onclick="optionHandler('CREATE', this)">
					<i class="fa-solid fa-square-plus FS_xl FC_askeyRed" i18n="create" title="新增"></i>
				</button>
				<button id="gear" class="btn userItem pageItem" onclick="showOverDayModal()"><i class="fa-solid fa-gear" i18n="setting" title="設定"></i></button> 
			</span>
		</div>
		
		<table id="dataTable"></table>
	</div>
</div>

<jsp:include page="modal/accountUpdateModal.jsp"/>
<jsp:include page="modal/overDayModal.jsp"/>
<script type="text/javascript" src="assets/js/accountSystem.js"></script>


<style>
.tdw5 {
	width: 5%;
}
.tdw10 {
	width: 10%;
}
.tdw15 {
	width: 15%;
}
.tdw20 {
	width: 20%;
}
.tdw25 {
	width: 25%;
}
.tdw30 {
	width: 30%;
}
</style>