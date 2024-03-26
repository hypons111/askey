<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/searhBarCommon.css">

<div id="quotationDownloadLogContainer" class="subContainer">

	<div id="searhBarHeader">
		<i class="fa-solid fa-chevron-left" onclick="Utils.Router()"></i>
		<p class="FW_xb">歷次下載紀錄</p>
		<i class="fa-solid fa-magnifying-glass" onclick="toggleSearhBar()"></i>
	</div>

	<div id="searhBarWrapper" class="hide">
	
		<div id="backgroundBlock" onclick="toggleSearhBar()"></div>
	
		<div id="searhBar" class="shadow">
						
			<div id="inputWrapper">
				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault1" i18n="project">報價專案</label>
					<div class="btn-group">
						<select id="quotation" class="form-select btn dropdown-toggle" aria-label="Floating label select example"></select>
					</div>
				</div>
		
				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault2" i18n="date">日期</label>
					<div class="btn-group">
						<input id="date" class="dr btn dropdown-toggle">
					</div>
				</div>
		
				<div id="roleGroup" class="form-check">
					<label class="form-check-label" for="flexRadioDefault2" i18n="role">角色</label>
					<div class="btn-group">
						<select id="role" class="form-select btn dropdown-toggle" aria-label="Floating label select example" onchange="getUserDropdownMenu()">
							<option value="" i18n="all" selected>全選</option>
							<option value='admin' i18n="admin">管理者</option>
							<option value='sales' i18n="sales">業務</option>
						</select>
					</div>
				</div>
		
				<div class="form-check">
					<label class="form-check-label" for="flexRadioDefault2" i18n="user">使用者名稱</label>
					<div class="btn-group">
						<select id="user" class="form-select btn dropdown-toggle" aria-label="Floating label select example"></select>
					</div>
				</div>
			</div>

			<div id="buttonWrapper">
				<button type="button" id="clearButton" class="btn btn-secondary" onclick="initSearchBar()" i18n="clear">清除</button>
				<button type="button" id="searchButton" class="btn redButton" onclick="queryDownLoadLog()" i18n="search">查詢</button>
			</div>
		</div>	
	</div>

	
	<div id="dataTableWrapper">
		<div id="tableTitle">
			<span>
				<i class="fa-solid fa-clock-rotate-left FS_xl"></i>
				<h4 class="FW_xb" i18n="downloadHistory">歷次下載紀錄</h4>
			</span>
			<span></span>
			<span></span>
		</div>
		
		<table id="dataTable"></table>
	</div>

</div>
<script type="text/javascript" src="assets/js/quotationDownloadLog.js"></script>

<style>
	#searhBarWrapper #inputWrapper {
		gap: 0.5em 4em;
	}
	.quote_no ,
	.p_name {
		overflow: hidden;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  max-width: 10em;
	}
	.fileName {
		color: blue;
		text-decoration: underline;
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