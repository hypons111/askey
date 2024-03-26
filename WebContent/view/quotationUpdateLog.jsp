<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/searhBarCommon.css">

<div id="quotationUpdateLogContainer" class="subContainer">

	<div id="searhBarHeader">
		<i class="fa-solid fa-chevron-left" onclick="Utils.Router()"></i>
		<p class="FW_xb" i18n="modifiedHistory">異動紀錄</p>
		<i class="fa-solid fa-magnifying-glass" onclick="toggleSearhBar()"></i>
	</div>

	<div id="searhBarWrapper" class="hide">
	
		<div id="backgroundBlock" onclick="toggleSearhBar()"></div>
	
		<div id="searhBar" class="shadow">
						
			<div id="inputWrapper">
				<div class="form-check">
					<label class="form-check-label" i18n="action">操作</label>
					<div class="btn-group">
						<select id="operate" class="form-select btn dropdown-toggle" aria-label="Floating label select example">
							<option i18n="create" value="new" selected>新增</option>
							<option i18n="delete" value="delete">刪除</option>
							<option i18n="update" value="update">修改</option>
						</select>
					</div>
				</div>
			
				<div class="form-check">
					<label class="form-check-label" i18n="event">項目</label>
					<div class="btn-group">
						<select id="item" class="form-select btn dropdown-toggle" aria-label="Floating label select example" onchange="onchangeItem(this)">
							<option i18n="pleaseChoose" value="init" disabled selected>請選擇</option>
							<option i18n="queryProject" value="QPROJECT">報價專案</option>
							<option i18n="queryItem" value="QITEM">品項類型</option>
							<option i18n="queryAttribute" value="QATTR">品項屬性</option>
							<option i18n="queryData" value="QDATA">品項</option>
						</select>
					</div>
				</div>

				<div class="form-check">
					<label class="form-check-label" i18n="itemType">品項類型</label>
					<div class="btn-group">
						<select id="itemType" class="form-select btn dropdown-toggle" aria-label="Floating label select example" disabled></select>
					</div>
				</div>

				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault2" i18n="modifiedTime">異動時間</label>
					<div class="btn-group">
						<input id="updateDateTime" class="dtr btn dropdown-toggle">
					</div>
				</div>
			</div>

			<div id="buttonWrapper">
				<button type="button" id="clearButton" class="btn btn-secondary" onclick="initSearhBar()" i18n="clear">清除</button>
				<button type="button" id="searchButton" class="btn redButton" onclick="queryUpdateLog()" i18n="search">查詢</button>
			</div>
		</div>	
	</div>

	<div id="dataTableWrapper">
		<div id="tableTitle">
			<span>
				<i class="fa-solid fa-clock-rotate-left FS_xl"></i>
				<h4 class="FW_xb" i18n="modifiedHistory">異動紀錄</h4>
			</span>
			<span></span>
			<span><h4 id="quotationName" class="FW_xb noM"></h4></span>
		</div>
		
		<table id="dataTable">
			<div id="initDataTableString">
				<h5 i18n="pleaseEnterQueryCriterias">請輸入查詢條件</h5>
			</div>
		</table>
	</div>
</div>

<script type="text/javascript" src="assets/js/quotationUpdateLog.js"></script>

<style>
#searhBarWrapper #inputWrapper {
	gap: 0.5em 4em;
}

#initDataTableString {
	width: 100%;
	height: 100%;
	text-align: center;
	margin: 0em 2em;
}
#initDataTableString > h5 {
	height: 3em;
	line-height: 3em;
	box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
	background-color: white;
}

.quote_no ,
.p_name {
	overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 10em;
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