
function createMonthlyReservationSheet(m) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();
  
  const year = today.getFullYear();
//  const month = today.getMonth() + 2; 来月の場合は m=2
  const month = today.getMonth() + m;
  const target = new Date(year, month - 1, 1);
  const sheetName = `予約表_${year}_${("0" + month).slice(-2)}`;

  if (spreadsheet.getSheetByName(sheetName)) {
    SpreadsheetApp.getUi().alert(`すでに ${sheetName} は存在します`);
    return;
  }

  // ✅ テンプレートからコピー
  const templateSheet = spreadsheet.getSheetByName("reservation_template");
  if (!templateSheet) {
    SpreadsheetApp.getUi().alert("テンプレートシートが見つかりません");
    return;
  }

  const sheet = templateSheet.copyTo(spreadsheet).setName(sheetName);

  const numDays = new Date(year, month, 0).getDate();
  const timeSlots = generateTimeSlots("09:00", "18:00", 20);

  for (let i = 1; i <= numDays; i++) {
    sheet.getRange(1, i + 1).setValue(`${month}/${i}`);
  }

  for (let r = 0; r < timeSlots.length; r++) {
    sheet.getRange(r + 2, 1).setValue(timeSlots[r]);
  }

  sheet.getDataRange().setHorizontalAlignment("center");
  sheet.getDataRange().setVerticalAlignment("middle");
}

function generateTimeSlots(startTime, endTime, intervalMinutes) {
  const slots = [];
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  let date = new Date(2000, 0, 1, sh, sm);
  const end = new Date(2000, 0, 1, eh, em);

  while (date <= end) {
    slots.push(Utilities.formatDate(date, "Asia/Tokyo", "HH:mm"));
    date = new Date(date.getTime() + intervalMinutes * 60000);
  }

  return slots;
}

function createMonthlyReservationSheetNow() {createMonthlyReservationSheet(1)}
function createMonthlyReservationSheetNext1() {createMonthlyReservationSheet(2)}
function createMonthlyReservationSheetNext2() {createMonthlyReservationSheet(3)}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("★予約管理★")
    .addItem("翌月の予約表を作成", "createMonthlyReservationSheetNext1")
    .addItem("今月の予約表を作成", "createMonthlyReservationSheetNow")
    .addItem("翌々月の予約表を作成", "createMonthlyReservationSheetNext2")
    .addItem("初回に必ず実施する設定", "openSidebarAndAuth")
    .addToUi();
}
