<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<link rel="stylesheet" href="assets/css/modalCommon.css">

<div id="adminQuotationItemModal" class="quotationItemModal modal fade" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="myModalLabel" aria-hidden="true">
	<input id="itemId" class="form-control none" type="text" value="">
	<input id="itemIndex" class="form-control none" type="text" value="">

	<div class="modal-dialog">
		<div class="modal-content">

			<div class="modal-header">
				<h5 id="modalTitle"></h5>
			</div>
			
			<div class="modal-body">

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



				<div id="" class="itemAttribute">
					<div id="" class="tabWrapper">
						<span id="narmalTab" data-on="Normal" data-off="Relative" class="tab on FW_b" i18n="general">設定屬性</span>
					</div>

					<div id="" class="tableWrapper">

						<div id="adminNormalTable" class="normalTable">

							<div id="normalTableHeader">
								<div class="normalTableRow">
									<span i18n="no">序號</span>
									<span i18n="attributeName">屬性名稱</span>
									<span i18n="required">必填</span>
									<span i18n="type">型態</span>
									<span i18n="quotation_create_view">業務檢視</span>
									<span></span>
								</div>
							</div>

							<div id="normalTableBody">

								<div class="normalTableRow" data-unittype="">
									<span>1</span>
									<span i18n="name"><p class="star">*</p>名稱</span>
									<span><i class="fa-solid fa-check"></i></span>
									<span>
										<div class="form-floating">
											<select class="form-select" id="" aria-label="" disabled>
												<option value="3" i18n="string" selected>文字</option>
											</select>
										</div>
									</span>
									<span>
										<i class="fa-solid fa-check authority"></i>
									</span>
									<span></span>
								</div>

								<div class="normalTableRow" data-unittype="number" data-seq="2^quantity">
									<span>2</span>
									<span i18n="quantity"><p class="star">*</p>數量</span>
									<span><i class="fa-solid fa-check"></i></span>
									<span>
										<div class="form-floating">
											<select class="form-select" id="" aria-label="" disabled>
												<option value="1" i18n="integer" selected>整數</option>
											</select>
										</div>
									</span>
									<span>
										<i class="fa-solid fa-check authority"></i>
									</span>
									<span></span>
								</div>

								<div class="normalTableRow" data-unittype="number" data-seq="3^price">
									<span>3</span>
									<span i18n="price"><p class="star">*</p>價格</span>
									<span><i class="fa-solid fa-check"></i></span>
									<span>
										<div class="form-floating">
											<select class="form-select" id="" aria-label="" disabled>
												<option value="2" i18n="float" selected>浮點數</option>
											</select>
										</div>
									</span>
									<span>
										<input class="authority" type="checkbox">
									</span>
									<span></span>
								</div>

								<div class="normalTableRow" data-unittype="" data-seq="4^unit">
									<span>4</span>
									<span i18n="unit"><p class="star">*</p>單位</span>
									<span><i class="fa-solid fa-check"></i></span>
									<span>
										<div class="form-floating">
											<select class="form-select" id="" aria-label="" disabled>
												<option value="3" i18n="string" selected>文字</option>
											</select>
										</div>
									</span>
									<span>
										<input class="authority" type="checkbox" checked>
									</span>
									<span class="attrOption">
										<i class="fa-regular fa-square-plus" i18n="add" title="新增" onclick="adminToggleRow(this, '+', 'normal')"></i>
									</span>
								</div>

							</div>

							<div id="lumpSumWrapper">
								<div id="lumpSumBody">
									<span i18n="quotation_create_computingTotalPrice">計算總金額</span>
									<div class="form-floating">
										<select class="lumpSumA form-select" id="" aria-label="" onchange="onchangeSelectedAttr(this)">
											<option value="3" i18n="price">價格</option>
											<option value="2" i18n="quantity" disabled>數量</option>
										</select>
									</div>
									<i class="fa-solid fa-x"></i>
									<div class="form-floating">
										<select class="lumpSumB form-select" id="" aria-label="" onchange="onchangeSelectedAttr(this)">
											<option value="3" i18n="price" disabled>價格</option>
											<option value="2" i18n="quantity">數量</option>
										</select>
									</div>
								</div>
							</div>

						</div>

					</div>
				</div>

				<div id="" class="itemAttribute">
					<div id="" class="tabWrapper">
						<span id="relativeTab" data-on="Relative" data-off="Normal" class="tab on FW_b" i18n="related">關聯資產專案</span>
					</div>

					<div id="" class="tableWrapper">
						<div id="adminRelativeTable" class="relativeTable">
							<div id="relativeTableHeader">
								<div class="relativeTableRow">
									<span i18n="no">序號</span> <span i18n="assetProject">資產專案</span>
									<span></span>
								</div>
							</div>

							<div id="relativeTableBody">
								<div class="relativeTableRow">
									<span><p class="">1</p></span> <span>
										<div class="form-floating">
											<select class="form-select" id="" aria-label="">
												<option value="0" i18n="selectAssetProject" selected>請選擇報價專案</option>
											</select>
										</div>
									</span> <span class="attrOption">
										<i class="fa-regular fa-square-plus" i18n="add" title="新增" onclick="adminToggleRow(this, '+', 'relative')"></i>
										<i class="fa-solid fa-trash-can" i18n='delete' title='刪除' onclick="clearRow(this)"></i>
									</span>
								</div>
							</div>

						</div>

					</div>
				</div>

			</div>

			<div class="modal-footer">
				<span type="button" id="adminCloseModalBtn"
					class="btn btn-secondary" data-dismiss="modal"
					onclick="closeUpdateItemModal()" i18n="cancel">取消</span> <span
					type="button" id="adminNormalCreateBtn" class="btn redButton"
					onclick="adminUpdateNormalItem('add')" i18n="save">儲存</span> <span
					type="button" id="adminNormalEditBtn" class="btn redButton none"
					onclick="adminUpdateNormalItem('edit')" i18n="save">儲存</span>
			</div>

		</div>
	</div>
</div>

<style>
#itemName,
#itemDescript {
	width: 80%;
}
</style>