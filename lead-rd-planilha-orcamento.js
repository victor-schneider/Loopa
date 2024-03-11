// Função que recebe os dados do webhook do RD Station e insere dados na planilha
function doPost(e) {
  // Acessa planilha e aba para inserir dados
  var spreadsheet = SpreadsheetApp.openById('1baHWTFXPEhZAX_9kNbmuFTYx0a2F7cJAwanmoALfPA8');
  // O identificar da planilha está em sua URL
  // Para mais informações acesse: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid
  var sheet = spreadsheet.getSheetByName('oportunidade');
  
  // Acessa os dados enviados pelo webhook do RD Station   
  var requestData = JSON.parse(e.postData.contents);
  var leadData = requestData.leads;
  
  // Cria uma trava que impede que dois ou mais usuários executem o script simultaneamente
  var trava = LockService.getScriptLock();
  trava.waitLock(2000);
  
  //
  var values = []
  var timestamp = new Date();
  var JSONSource = JSON.stringify(requestData);
  
  //Extrai dados do lead para inserção
  for (var i = 0; i < leadData.length; i++) {
    values.push([JSONSource,
                 timestamp,
                 leadData[i].job_title,
                 leadData[i].state,
                 leadData[i].first_conversion.content.identificador,
                 leadData[i].first_conversion.conversion_origin.source,
                 leadData[i].first_conversion.conversion_origin.medium,
                 leadData[i].last_conversion.content.identificador,
                 leadData[i].last_conversion.conversion_origin.source,
                 leadData[i].last_conversion.conversion_origin.medium,]);
  }

  // Atualiza a planilha com a nova linha  
  sheet.getRange(sheet.getLastRow()+1, 1, values.length, values[0].length).setValues(values);
  SpreadsheetApp.flush();
  
  // Desativa a trava do script para que possa receber outras mensagens do webhook
  trava.releaseLock();
  return "OK";
}

function doGet(request) {
  return HtmlService.createHtmlOutput("<h2>Get request recebida.</h2><p>Essa função te ajuda a identificar se o Web App da integração está ativo.</p>");
}
