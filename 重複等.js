function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();

  // 対象シート以外は無視
  if (!sheetName.startsWith("予約表_")) return;

  const editedRange = e.range;
  const editedRow = editedRange.getRow();
  const editedCol = editedRange.getColumn();

  // 編集が時間列（1列目）や見出し行（1行目）ならスキップ
  if (editedRow === 1 || editedCol === 1) return;

  const patientName = e.value;
  if (!patientName) return;  // 空欄の場合スキップ

  const date = sheet.getRange(1, editedCol).getValue();   // 日付列のヘッダー
  const time = sheet.getRange(editedRow, 1).getValue();   // 行の時間枠

  // 同じ時間枠の他列に同じ名前があるか確認（ブッキングチェック）
  const rowValues = sheet.getRange(editedRow, 2, 1, sheet.getLastColumn() - 1).getValues()[0];
  const count = rowValues.filter(v => v === patientName).length;
  if (count > 1) {
    SpreadsheetApp.getUi().alert(`この時間に既に ${patientName} さんの予約があります！`);
  }

  // 履歴シートに記録
  const historySheet = e.source.getSheetByName("履歴") || e.source.insertSheet("履歴");
  if (historySheet.getLastRow() === 0) {
    historySheet.appendRow(["タイムスタンプ", "日付", "時間", "患者名", "ユーザー"]);
  }

  const user = Session.getActiveUser().getEmail();
  historySheet.appendRow([new Date(), date, time, patientName, user]);
}
