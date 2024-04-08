function moverDadosParaFinal() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet(); // Obtém a aba ativa da planilha
  var range = sheet.getRange('A2:K14'); // Define o intervalo das linhas a serem movidas
  
  // Encontra a última linha com dados na planilha para determinar onde começar a colar os dados movidos
  var lastRow = sheet.getLastRow();
  
  // Se a planilha estiver completamente vazia, lastRow será 0, o que causaria um erro ao tentar setar um intervalo.
  // Portanto, garantimos que lastRow seja pelo menos 1
  if (lastRow < 1) {
    lastRow = 1;
  }
  
  // Calcula o intervalo de destino baseado na última linha com dados
  var targetRange = sheet.getRange(lastRow + 1, 1, 14, 11); // O destino começa na próxima linha vazia
  
  // Copia os dados para o novo local e limpa os dados antigos
  range.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_NORMAL, false);
  range.clearContent(); // Limpa o conteúdo do intervalo original, mas mantém a formatação
}
