<template>
  <div id="footer">
    {{$t('footer.copyright', {year:new Date().getFullYear()})}}
    <a href="/">{{$t('title')}}</a> -
    <a href="/faq">{{$t('footer.faq')}}</a>
  </div>
</template>
