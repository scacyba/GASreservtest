function openSidebarAndAuth() {
  const ui = SpreadsheetApp.getUi();
  const htmlOutput = HtmlService.createHtmlOutput("<p>テストサイドバー</p>");
  htmlOutput.setTitle('初回設定終わりました！\n使用可能です。');
  ui.showSidebar(htmlOutput);
}

function openSidebar4Reservation() {
    
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();
  
    const html = HtmlService.createTemplateFromFile("サイドバー予約")
//  html.date = "Thu Jun 05 2025 16:00:00";
//  html.time = "Sun Dec 31 1899 07:00:00";
//  const dateObj = sheet.getRange(1, range.getColumn()).getValue();
//  const timeObj = sheet.getRange(range.getRow(), 1).getValue();
//    html.date = Utilities.formatDate(dateObj, "Asia/Tokyo", "yyyy-MM-dd");
//    html.time = Utilities.formatDate(timeObj, "Asia/Tokyo", "HH:mm");
    html.date = sheet.getRange(1, range.getColumn()).getDisplayValue();
    html.time = sheet.getRange(range.getRow(), 1).getDisplayValue();
    SpreadsheetApp.getUi().showSidebar(html.evaluate().setTitle("予約入力"));

}

/* これもonSelectionChangeもshowSidebarは動かない
//https://issuetracker.google.com/issues/69238694?pli=1#comment7
function onEdit(e) {
openSidebarAndAuth();
}
*/

function ___onSelectionChange1111111111(e){

  const range = e.range;
  Logger.log("選択されたセル: " + range.getA1Notation());
  const sheet = range.getSheet();
  if (!sheet.getName().startsWith("予約表_")) return;

  const rawDate = sheet.getRange(1, range.getColumn()).getValue();
  const rawTime = sheet.getRange(range.getRow(), 1).getValue();

  if (!rawDate || !rawTime) return;

  // 明示的に日付オブジェクトに変換（失敗すれば終了）
  const dateObj = new Date(rawDate);
  const timeObj = new Date(rawTime);
  if (isNaN(dateObj) || isNaN(timeObj)) return;
  range.setValue("dateObj");

  try {
    const html = HtmlService.createTemplateFromFile("サイドバー予約")
//  html.date = "Thu Jun 05 2025 16:00:00";
//  html.time = "Sun Dec 31 1899 07:00:00";
    html.date = Utilities.formatDate(dateObj, "Asia/Tokyo", "yyyy-MM-dd");
    html.time = Utilities.formatDate(timeObj, "Asia/Tokyo", "HH:mm");
    range.setValue("予約入力1");
    SpreadsheetApp.getUi().showSidebar(html.evaluate().setTitle("予約入力"));
    range.setValue("予約入力2");
  } catch (error) {
    range.setNote("テンプレートエラー: " + error.message);
    range.setValue(error.message);
  }
}

function registerReservation(dateStr, timeStr, name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // 1行目（日付行）から見出しを「表示形式」で取得
  const headerValues = sheet.getRange(1, 2, 1, sheet.getLastColumn() - 1).getDisplayValues()[0];
  const col = headerValues.findIndex(h => h === dateStr) + 2;

  // 1列目（時間列）から値を「表示形式」で取得
  const timeValues = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getDisplayValues().flat();
  const row = timeValues.findIndex(t => t === timeStr) + 2;

  Logger.log("選択された行: " + row);
  Logger.log("選択された列: " + col);

  if (col > 1 && row > 1) {
    sheet.getRange(row, col).setValue(name);

    // 履歴シートに記録
    const log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("履歴")
                || SpreadsheetApp.getActiveSpreadsheet().insertSheet("履歴");

    if (log.getLastRow() === 0) {
      log.appendRow(["日時", "日付", "時間", "患者名"]);
    }

    log.appendRow([new Date(), dateStr, timeStr, name]);
  }
}

function formatDate(input) {
  const d = new Date(input);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

//Google Formsから
function onFormSubmit(e) {
  const sheetName = "予約表_2025_06";  // ToDo:対象の予約表。
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    Logger.log("対象シートが存在しません");
    return;
  }

  const responses = e.namedValues;  // フォーム回答
  const date = Utilities.formatDate(new Date(responses["日付"][0]), "Asia/Tokyo", "M/d");
  const time = responses["時間"][0];
  const name = responses["患者名"][0];
  const staff = responses["担当スタッフ名"] ? responses["担当スタッフ名"][0] : "";

  // 日付列の特定
  const dateRow = sheet.getRange(1, 2, 1, sheet.getLastColumn() - 1).getValues()[0];
  const dateColIndex = dateRow.indexOf(date);
  if (dateColIndex === -1) {
    Logger.log(`日付 ${date} がシートに見つかりません`);
    return;
  }
  const col = dateColIndex + 2; // オフセット補正（列2開始）

  // 時間行の特定
  const timeCol = sheet.getRange(2, 1, sheet.getLastRow() - 1).getValues().flat();
  const timeRowIndex = timeCol.indexOf(time);
  if (timeRowIndex === -1) {
    Logger.log(`時間 ${time} がシートに見つかりません`);
    return;
  }
  const row = timeRowIndex + 2; // オフセット補正（行2開始）

  const existing = sheet.getRange(row, col).getValue();
  if (existing) {
    // 重複がある場合：ログに残して終了
    Logger.log(`すでに ${existing} さんの予約あり → ${name} さんの予約は登録されませんでした`);
    return;
  }

  // 予約を登録
  sheet.getRange(row, col).setValue(name);

  // 履歴シートへ記録（任意）
  const historySheet = spreadsheet.getSheetByName("履歴") || spreadsheet.insertSheet("履歴");
  if (historySheet.getLastRow() === 0) {
    historySheet.appendRow(["タイムスタンプ", "日付", "時間", "患者名", "スタッフ"]);
  }
  historySheet.appendRow([new Date(), date, time, name, staff]);
}
