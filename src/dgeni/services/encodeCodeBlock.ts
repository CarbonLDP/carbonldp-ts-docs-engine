var htmlEncode = require('htmlencode').htmlEncode;

export function encodeCodeBlock() {

  return function(str:string, inline:boolean, lang:string, isMethod:boolean) {

    // Encode any HTML entities in the code string
    str = htmlEncode(str, true);

    // If a language is provided then attach a CSS class to the code element
    lang = lang ? ' class="lang-' + lang + '"' : '';

    if (isMethod) str += "()";

    str = '<code' + lang + '>' + str + '</code>';

    // If not inline then wrap the code element in a pre element
    if ( !inline ) {
      str = '<pre>' + str + '</pre>';
    }

    return str;
  };
};