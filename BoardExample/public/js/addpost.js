$(document).ready(function() {
  CKEDITOR.config.extraPlugins = 'colorbutton';
  CKEDITOR.env.isCompatible = true;
  CKEDITOR.replace('contents');
});
