function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();
  if (!sheetName.startsWith("予約表_")) return;

  const range = e.range;
  const numRows = range.getNumRows();
  const numCols = range.getNumColumns();

  const values = range.getValues();

  const historySheet = e.source.getSheetByName("履歴") || e.source.insertSheet("履歴");
  if (historySheet.getLastRow() === 0) {
    historySheet.appendRow(["タイムスタンプ", "日付", "時間", "患者名", "ユーザー"]);
  }
  const user = Session.getActiveUser().getEmail();

  for (let r = 0; r < numRows; r++) {
    const row = range.getRow() + r;
    if (row === 1) continue; // 見出し行スキップ

    const time = sheet.getRange(row, 1).getValue();

    for (let c = 0; c < numCols; c++) {
      const col = range.getColumn() + c;
      if (col === 1) continue; // 時間列スキップ

      const patientName = values[r][c];
      if (!patientName) continue; // 空欄スキップ

      const date = sheet.getRange(1, col).getValue();

      // 同じ時間枠の行で同名が複数あればブッキング警告
      const rowValues = sheet.getRange(row, 2, 1, sheet.getLastColumn() - 1).getValues()[0];
      const count = rowValues.filter(v => v === patientName).length;
      if (count > 1) {
        SpreadsheetApp.getUi().alert(`この時間に既に ${patientName} さんの予約があります！`);
      }

      // 履歴へ記録
      historySheet.appendRow([new Date(), date, time, patientName, user]);
    }
  }
}
