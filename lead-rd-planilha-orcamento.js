// Função que recebe os dados do webhook do RD Station e insere dados na planilha
function doPost(e) {
  var spreadsheet = SpreadsheetApp.openById('INSIRA SEU IDENTIFICADOR AQUI');
  var sheet = spreadsheet.getSheetByName('INSIRA O NOME DA ABA AQUI');

  var requestData = JSON.parse(e.postData.contents);
  var leadData = requestData.leads;

  var trava = LockService.getScriptLock();
  trava.waitLock(2000);

  var values = [];
  var timestamp = new Date();
  var JSONSource = JSON.stringify(requestData);

  for (var i = 0; i < leadData.length; i++) {
    var leadUUID = leadData[i].uuid;
    if (!leadJaExisteComUUID(leadUUID, timestamp)) {
      values.push([
                   leadData[i].uuid,
                   timestamp,
                   leadData[i].job_title,
                   leadData[i].state,
                   leadData[i].first_conversion.content.identificador,
                   leadData[i].first_conversion.conversion_origin.source,
                   leadData[i].first_conversion.conversion_origin.medium,
                   leadData[i].last_conversion.content.identificador,
                   leadData[i].last_conversion.conversion_origin.source,
                   leadData[i].last_conversion.conversion_origin.medium,
                  ]);
    }
  }

  if (values.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
  }
  
  SpreadsheetApp.flush();
  trava.releaseLock();
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}

// Função para verificar se um lead já existe com o mesmo UUID no mês corrente
function leadJaExisteComUUID(uuid, timestamp) {
  var sheet = SpreadsheetApp.openById('1baHWTFXPEhZAX_9kNbmuFTYx0a2F7cJAwanmoALfPA8').getSheetByName('lead');
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  
  var mesAnoAtual = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "MMyyyy");

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var uuidRow = row[0];
    var timestampRow = new Date(row[1]);
    var mesAnoRow = Utilities.formatDate(timestampRow, Session.getScriptTimeZone(), "MMyyyy");

    if (uuid === uuidRow && mesAnoAtual === mesAnoRow) {
      return true;
    }
  }
  return false;
}

// Função para responder a solicitações GET (útil para verificação do funcionamento do Web App)
function doGet(request) {
  return HtmlService.createHtmlOutput("<h2>Get request recebida.</h2><p>Essa função te ajuda a identificar se o Web App da integração está ativo.</p>");
}
