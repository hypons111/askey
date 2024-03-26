<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/modalCommon.css">

<div id="salesQuotationItemModal" class="quotationItemModal modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">
	<input id="itemId" class="form-control none" type="text" value="">
	<input id="itemIndex" class="form-control none" type="text" value="">

	<div class="modal-dialog">
		<div class="modal-content">

			<div class="modal-header">
				<h5 id="modalTitle"></h5>
			</div>
			
			<div class="modal-body">

				<div id="itemInformation">
					<div id="modalTitleGroup">
						<h5 id="customerName" for=""></h5>
					</div>
				</div>

				<div id="" class="tabWrapper" onclick="salesSwitchTable(this, event)">
					<span id="narmalTab" data-on="Normal" data-off="Relative" class="tab on FW_b" i18n="general">一般</span>
					<span id="relativeTab" data-on="Relative" data-off="Normal" class="tab FW_b none" i18n="quoteProjectRelating">關聯報價專案</span>
				</div>

				<div id="tableWrapper">
					<div id="salesmanNormalTable" class="normalTable">
						<form id="form" class="form-group">
							<div class="row">
								<div class="item">
									<p class="star">*</p>
									<p class="mr05em" for="itemName" i18n="name">名稱</p>
									<input id="itemName" name="itemName" type="text" class="form-control" placeholder="請輸入名稱" i18n="enterTypeName">
									<p class="FS_xs" i18n="max50Characters">最多50個字元</p>
								</div>
								<div class="col-sm-5 errorMessage none" data-error-type="itemName" i18n="error_itemName">請輸入名稱</div>
							</div>
							
							<div class="row">
								<div class="item">
									<p class="star">*</p>
									<p class="mr05em" for="itemType" i18n="quotation_create_itemType">工項類型</p>
									<select id="itemType" name="itemType" class="form-select" aria-label="">
										<option value="1" i18n="quotation_engineering" selected>工程類</option>
										<option value="2" i18n="quotation_maintenance">維護類</option>
										<option value="3" i18n="quotation_other">其他類</option>
									</select>
								</div>
								<div class="col-sm-5 errorMessage none" data-error-type="itemType" i18n="error_itemName">請選擇工項類型</div>
							</div>
		
							<div class="row">
								<div class="item">
									<p class="starBlock">*</p>
									<p class="mr05em" for="itemDescript" i18n="description">敘述</p>
									<input id="itemDescript" name="itemDescript" type="text" class="form-control" placeholder="請輸入敘述" i18n="enterDescription">
									<p class="FS_xs" i18n="max70Characters">最多70個字元</p>
								</div>
								<div class="col-sm-5 errorMessage none" data-error-type="itemDescript" i18n="error_itemDescript">請輸入敘述</div>
							</div>
						</form>
	
						<div id="normalTableHeader">
							<div class="normalTableRow">
								<span i18n="no">序號</span>
								<span i18n="attributeName">屬性名稱</span>
								<span i18n="required">必填</span>
								<span i18n="type">型態</span>
							</div>
						</div>

						<div id="normalTableBody">
							<div class="normalTableRow" data-unittype="">
								<span>1</span>
								<span i18n="name">名稱</span>
								<span><i class="fa-solid fa-check"></i></span>
								<span i18n="string">文字</span>
							</div>

							<div class="normalTableRow" data-unittype="number" data-seq="2^quantity">
								<span>2</span>
								<span i18n="quantity">數量</span>
								<span><i class="fa-solid fa-check"></i></span>
								<span i18n="integer">整數</span>
							</div>

							<div class="normalTableRow" data-unittype="" data-seq="4^unit">
								<span>3</span>
								<span i18n="unit">單位</span>
								<span><i class="fa-solid fa-check"></i></span>
								<span i18n="string">文字</span>
							</div>
						</div>
					</div>

					<div id="salesmanRelativeTable" class="relativeTable none">
						<div id="relativeTableHeader">
							<div class="relativeTableRow">
								<span i18n="no">序號</span>
								<span i18n="quotation_create_itemType">工項類型</span>
								<span i18n="queryItem">品項類型</span>
							</div>
						</div>

						<div id="relativeTableBody">
							<div class="relativeTableRow">
								<span><p class="">1</p></span>
								<span>
									<div class="form-floating">
										<select class="form-select commonProjectMenu" onchange="onchangeCommonProject(this)">
											<option value="0" i18n="pleaseChoose" selected>請選擇</option>
											<option value="1" i18n="quotation_engineering" selected>工程類</option>
											<option value="2" i18n="quotation_maintenance">維護類</option>
											<option value="3" i18n="quotation_other">其他類</option>
										</select>
									</div>
								</span>
								<span class="commonItemMenu" data-checked="">
									<div class="form-floating">
										<input class="form-select hideDecoration commonItemMenu" type="text" value="" i18n="chooseQuoteProject" placeholder="請選擇報價專案" disabled>
									</div>
								</span>
								<span class="attrOption">
									<i class="fa-regular fa-square-plus pointer" onclick="salesToggleRow(this, '+', 'item')"></i>
									<i class="fa-solid fa-trash-can pointer" onclick="clearRow(this)"></i>
								</span>
							</div>
						</div>
					</div>

				</div>
			</div>

			<div class="modal-footer" data-t="Normal" data-o="Create">
				<span id="salesmanCloseModalBtn" type="button" class="btn btn-secondary" onclick="closeUpdateItemModal()" data-dismiss="modal" i18n="cancel">取消</span>
				<span id="salesmanNormalCreateBtn" type="button" class="btn redButton confirmBtn none" onclick="salesUpdateNormalItem('add')" i18n="save">儲存</span>
				<span id="salesmanNormalEditBtn" type="button" class="btn redButton confirmBtn none" onclick="salesUpdateNormalItem('edit')" i18n="save">儲存</span>
				<span id="salesmanRelativeCreateBtn" type="button" class="btn redButton confirmBtn none" onclick="salesUpdateRelativeItem('add')" i18n="save">儲存</span>
			</div>

		</div>
	</div>
</div>

