function isCodeRelatedToValu(array, code, caption) {
    return code === getCodeOfCaption(array, caption);
}
  
function getCodeOfCaption(array, caption) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].caption === caption) {
        return array[i].code;
      }
    }
}

function getCaptionOfCode(array, code) {
    if (array === undefined)  {
      return '';
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i].code === code) {
        return array[i].caption;
      }
    }
}