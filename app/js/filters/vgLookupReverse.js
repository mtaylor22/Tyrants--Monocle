// Borrowed from https://docs.schneefux.xyz/python-gamelocker/_modules/gamelocker/strings.html
const vgLookup = {
  'heroes': {
    'Adagio': '*Adagio*',
    'Alpha': '*Alpha*',
    'Ardan': '*Ardan*',
    'Baron': '*Baron*',
    'Blackfeather': '*Blackfeather*',
    'Catherine': '*Catherine*',
    'Celeste': '*Celeste*',
    'Flicker': '*Flicker*',
    'Fortress': '*Fortress*',
    'Glaive': '*Glaive*',
    'Grumpjaw': '*Grumpjaw*',
    'Gwen': '*Gwen*',
    'Krul': '*Krul*',
    'Skaarf': '*Skaarf*',
    'Rona': '*Hero016*',
    'Idris': '*Idris*',
    'Joule': '*Joule*',
    'Kestrel': '*Kestrel*',
    'Koshka': '*Koshka*',
    'Lance': '*Lance*',
    'Lyra': '*Lyra*',
    'Ozo': '*Ozo*',
    'Petal': '*Petal*',
    'Phinn': '*Phinn*',
    'Reim': '*Reim*',
    'Ringo': '*Ringo*',
    'Samuel': '*Samuel*',
    'SAW': '*SAW*',
    'Taka': '*Taka*',
    'Skye': '*Skye*',
    'Vox': '*Vox*'
  }
};


/* @ngInject */
function vgLookupFilter() {
  return function(input) {
    return vgLookup.heroes[input] || input;
  };
}


export default {
  name: 'vgLookupReverse',
  fn: vgLookupFilter
};
