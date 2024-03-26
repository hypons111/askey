<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/searhBarCommon.css">

<div id="quotationSystemContainer" class="subContainer">

	<div id="searhBarHeader">
		<i class="fa-solid fa-chevron-left" onclick="Utils.Router()"></i>
		<p class="FW_xb"></p>
		<i class="fa-solid fa-magnifying-glass" onclick="toggleSearhBar()"></i>
	</div>

	<div id="searhBarWrapper">
		<div id="backgroundBlock" onclick="toggleSearhBar()"></div>
	
		<div id="searhBar" class="shadow">
						
			<div id="inputWrapper">
				<div class="form-check">
					<label class="form-check-label" for="" i18n="quotationSystem_name">名稱 / 簡稱</label>
					<div class="btn-group">
						<input id="qName" class="btn">
					</div>
				</div>
		
				<div class="form-check">
					<label class="form-check-label" for="" i18n="quotationSystem_customer">客戶別</label>
					<div class="btn-group">
						<select id="customers" class="form-select btn dropdown-toggle" aria-label="Floating label select example"></select>
					</div>
				</div>
		
				<div class="form-check">
					<label class="form-check-label" for="" i18n="quotationSystem_creater">建立者</label>
					<div class="btn-group">
						<select id="creater" class="form-select btn dropdown-toggle" aria-label="Floating label select example" onchange="getUserDropdownMenu()">
							<option value='0' i18n="all" selected>全選</option>
							<option value='admin' i18n="admin">管理者</option>
							<option value='sales' i18n="sales">業務</option>
						</select>
					</div>
				</div>
				
				<div class="form-check">
					<label class="form-check-label" for="" i18n="quotationSystem_creationDatetime">建立日期</label>
					<div class="btn-group">
						<input id="createDate" class="dr btn dropdown-toggle" onchange="Utils.ClearDate(this)">
					</div>
				</div>
				
				<div class="form-check">
					<label class="form-check-label" for="" i18n="quotationSystem_ExpiryDate">有效日期</label>
					<div class="btn-group">
						<input id="validDate" class="dr btn dropdown-toggle" onchange="Utils.ClearDate(this)">
					</div>
				</div>
			</div>

			<div id="buttonWrapper">
				<button type="button" id="clearButton" class="btn btn-secondary" onclick="initSearchBar()" i18n="clear">清除</button>
				<button type="button" id="searchButton" class="btn redButton" onclick="queryQuotations()" i18n="search">查詢</button>
			</div>
		</div>	
	</div>

	<div id="dataTableWrapper">
		<div id="tableTitle">
			<span></span>
			<span>
				<button class="btn" onclick="switchViewMode('grid', this)"><i class="fa-solid fa-table-cells" i18n="grid" title="網格檢視"></i></button>
				<div id="panalPartition"></div>
				<button class="btn" onclick="switchViewMode('list', this)"><i class="fa fa-bars off" i18n="list" title="列表檢視"></i></button> 
			</span>
			<span>
				<button id="star" class="btn none" onclick="loadFavoriteItemView()"><i class="fa-solid fa-star" i18n="customerServiceDataManagement" title="客戶服務工項管理"></i></button> 
				<button id="clock" class="btn" onclick="loadQuotationDownloadLogView()"><i class="fa-solid fa-clock-rotate-left" i18n="downloadHistory" title="歷次下載紀錄"></i></button> 
				<button id="plus" class="btn" onclick="showQuotationUpdateModal('add')"><i class="fa-solid fa-square-plus FC_askeyRed" i18n="create" title="新增"></i></button> 
			</span>
		</div>
		
		<div id="quotationList" class="">
			<div id="quotationEmptyList">
				<p class="FS_xxl" i18n="">請先建立報價專案</p>
				<i class="fa-solid fa-square-plus FS_xxl FC_askeyRed" onclick="showQuotationUpdateModal('add')"></i>
			</div>
		</div>
		
	</div>
</div>

<jsp:include page="modal/quotationUpdateModal.jsp"/>
<script type="text/javascript" src="assets/js/quotationSystem.js"></script>

<style>
#quotationSystemContainer #tableTitle span {
	width: 30%;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
}
#quotationSystemContainer #tableTitle span:first-child {
	justify-content: flex-start;
}
#quotationSystemContainer #tableTitle span:last-child {
	justify-content: flex-end;
}
#panalPartition {
	width: 2px;
	height: 70%;
	background-color: var(--Gray400);
}
.subContainer #tableTitle i {
	line-height: 1.5em;
	font-size: 1.5em;
}

#quotationList {
	width: 100%;
	height: 100%;
	padding: 1em 10vw 0 10vw;
	overflow-y: auto;
}

#quotationEmptyList {
	height: 100%;
	display: flex;
	flex-flow: column wrap;
	justify-content: center;
	align-items: center;
}



.quotationBadge {
	position: relative;
	justify-self: center;
	display: flex;
	flex-direction: column;
	background-color: white;
	padding: 1em;
}

.quotationBadge {
	position: relative;
	justify-self: center;
	display: flex;
	flex-direction: column;
	background-color: white;
	padding: 1em;
}
.notFinished::before {
	content: "!";
	color: white;
	text-align: center;
	background-color: var(--AskeyRed);
	width: 1.5em;
	height: 1.5em;
	border-radius: 1em;
	position: absolute;
	top: -12px;
	left: -12px;
}

.quotationBadge > div {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}
.quotationBadge > .BadgeRow_1 {
	align-items: center;
	height: 20%;
}
.quotationBadge > .BadgeRow_2 {
	align-items: flex-start;
	flex-grow: 1;
}
.quotationBadge > .BadgeRow_2 P,
.quotationBadge > .BadgeRow_4 P {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quotationBadge > .BadgeRow_3 {
	color: var(--AskeyRed);
	font-weight: var(--XBold);
	font-weight: var(--XBoldNo);
}

.quotationBadge > .BadgeRow_1 > .btn-group {
	width: 1em;
}

.quotationBadge > .BadgeRow_1 > .btn-group > button {
	padding: 0;
}
.quotationBadge .BadgeRow_1 .btn-group button::after {
	background-color: white;
	content: none;
}
.BadgeRow_1 .dropdown-menu {
	min-width: fit-content;
}
.quotationBadge .BadgeRow_1 img {
	height: 60%;
}
.quotationBadge .BadgeRow_5 {
	align-items: flex-end;
}

.quotationBadge P {
	margin: 0;
}
.BadgeRow_1 P {
	color: var(--AskeyRed);
}
.BadgeRow_2 P {
	font-size: var(--XLarge);
	font-weight: var(--XBold);
	font-weight: var(--XBoldNo);
	letter-spacing: -2px;
}
.BadgeRow_5 {
	height: 20px;
	font-size: var(--Small);
}
#pagination {
	height: 6vh;
	align-items: center;
	justify-content: center;
}
#pagination i {
	padding: 5px;
	background-color: white;
}
#pagination P {
	margin: 0 1em;
}

#emptyQuotationBlock {
	height: calc(100vh - 6vh - 10vw);
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: var(--Gray200);
		padding-bottom: 6vh;
}
#emptyQuotationBlock div {
	width: 25%;
	height: 25%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: white;
}
.adminBorder {
	border: 1px solid #E61F12;
}
.salesBorder {
	border: 1px solid #212529;
}


/* listMode */
.listMode {
	width: auto;
	display: flex;
	flex-direction: column;
	align-content: flex-start;
}
.listMode .quotationBadge {
 	height: 10em;
 	justify-content: center;
	margin-bottom: 2em;
}
.listMode .quotationBadge .BadgeRow_1,
.listMode .quotationBadge .BadgeRow_5 {
	height: 25%;
}
.listMode .quotationBadge .BadgeRow_2 {
	height: 50%;
}
.listMode .quotationBadge .BadgeRow_1 img {
	height: 100%;
}
/* listMode */

/* gridMode */
.gridMode {
	display: grid !important;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	grid-template-rows: repeat(auto-fill, minmax(170px, 1fr));
	grid-gap: 1.5em;
}
.gridMode .quotationBadge {
	width: 220px;
	height: 170px;
}
/* gridMode */



/* 大 */
@media(max-width: 1746px) {}



/* 中 */
@media(max-width: 1199px) {
	#quotationUpdateModal {
		--bs-modal-width: 75% !important;;
	}
	#searhBar {
    height: 15vh;
	}
	#quotationList {
    height: 79vh;
	}
}



/* 細 直 */
@media(max-width: 500px) or (max-height: 600px) {
	#quotationList {
		height: 93vh;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding: 2em 1.5em;
	}
	#quotationList .quotationBadge {
		width: auto;
		height: fit-content;
	}
	
	#topImage,
	#badgeContainer,
	#searhBar,
	#panel {
		display: none;
	}
	#phoneSearchBar {
		height: 3em;
		background-color: white;
		justify-content: flex-start;
		align-items: center;
		padding-right: 15px;
		display: flex;
		position: sticky;
		top: 0;
		z-index: 1000;
	}
	#phoneSearchBar * {
		background-color: white !important;
	}
	#phoneSearchBar span {
		border: none;
	}
	#phoneSearchBar input {
		border-radius: 4px;
	}
	#phoneButtonGroup {
		width: 100%;
		height: 232px;
	 	position: absolute;
	 	top: 3em;
		display: flex;
		flex-direction: column;
		background-color: white;
		padding: 0 1em;
		z-index: 1001;
	}
	#phonePanel,
	#phoneAccount {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 0.5em;
	}
	.phoneAccountRow > p {
		margin-top: 0;
		margin-bottom: 0;
/* 		border: 1px solid red; */
	}
	#backgroundBlock {
		position: absolute;
		top: 17.5em;
		width: 100%;
		height: calc(100vh - 17.5em);
		background-color: black;
		opacity: 0.5;
		z-index: 1002;
	}
	#phonePanel > div,
	#phoneAccount > div {
		height: 2.5em;
		display: flex;
		align-items: center;
	}
	#phoneAccount > div {
		justify-content: space-between;
	}
	#phonePanel > div > p {
		font-size: var(--Large);
		font-weight: var(--Bold);
		font-weight: var(--BoldNo);
		margin: 0 1em 0 1em;
	}
	#phoneAccountImgWrapper {
		width: 35%;
	}
	#phoneAccountImgWrapper img {
		width: 100%;
	}

	#pagination {
		position: sticky;
		bottom: 0;
		height: 3em;
	}
}

/* 細 橫 */
@media(max-height: 600px) {}
</style>