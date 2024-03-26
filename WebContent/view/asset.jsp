<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/quotation.css">

<div id="assetContainer" class="subContainer">
	<input id="pId" class="form-control none" type="text">

	<div id="side" class="" onclick="saveCheckboxStatus()">
		<div id="sideTop">
			<div onclick="Utils.Router()">
				<i class="fa-solid fa-chevron-left"></i>
				<p i18n="back">返回</p>
			</div>
			<i class="fa-solid fa-chevron-left FS_xl" onclick="toggleSideBar(this)"></i>
		</div>

		<div id="sideMiddle">
			<div id="assetItemWrapper"></div>
		</div>

		<div id="sideBottom"></div>

	</div>
	<div id="main">


		<div id="mainTop">
			<div class="phoneHeader">
				<span class="phoneItem"> <i class="fa fa-bars"
					onclick="toggleSmallBarContent('on', this)"></i> <i
					class="fa-solid fa-x none"
					onclick="toggleSmallBarContent('off', this)"></i>
				</span>
				<p id="name" class="FS_xl FW_xb" i18n="selectRelatedItem">選擇關聯品項</p>
				<span class="phoneItem" onclick=""> <i
					class="fa-solid fa-magnifying-glass phoneItem"></i>
				</span>
			</div>

			<div>
				<img src="./assets/image/Askey_logo.png" class="nonPhoneItem">
			</div>
		</div>

		<div id="mainMiddle" class="">

			<div id="searhBar" class="shadow">

				<div id="assetInputWrapper"></div>

				<div id="buttonWrapper">
					<button type="button" id="clearButton" class="btn btn-secondary" onclick="initSearchBar()" i18n="clear">清除</button>
					<button type="button" id="searchButton" class="btn redButton" onclick="queryAssetData()" i18n="search">查詢</button>
				</div>
			</div>
		</div>

		<div id="assetMainBottom">
			<p id="assetMainBottomNote" i18n="assetNotice">請勾選欲報價項目後，點擊左上角[返回]</p>
			<table data-itemid="" id="assetItemTable"></table>
		</div>

	</div>

</div>


<script type="text/javascript" src="assets/js/asset.js"></script>