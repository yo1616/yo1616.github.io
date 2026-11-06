'use strict';
const zh = document.documentElement.lang === 'zh-Hant';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
  }
});
document.querySelector('[data-language]')?.addEventListener('click', event => {
  if (location.hash) event.currentTarget.href += location.hash;
});
const filters = [...document.querySelectorAll('[data-filter]')];
function applyFilter(category) {
  let count = 0;
  document.querySelectorAll('#project-grid .work-card').forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) count++;
  });
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  const output = document.querySelector('.result-count');
  if (output) output.textContent = zh ? `${count} 項作品` : `${count} projects`;
  const empty = document.querySelector('#empty-results');
  if (empty) empty.hidden = count > 0;
}
filters.forEach(button => button.addEventListener('click', () => {
  const url = new URL(location.href);
  if (button.dataset.filter === 'all') url.searchParams.delete('category');
  else url.searchParams.set('category', button.dataset.filter);
  history.replaceState(null, '', url);
  applyFilter(button.dataset.filter);
}));
const initial = new URL(location.href).searchParams.get('category');
if (filters.some(button => button.dataset.filter === initial)) applyFilter(initial);
const dialog = document.querySelector('#lightbox');
const gallery = [...document.querySelectorAll('[data-gallery]')];
let selected = 0, returnFocus;
function updateImage() {
  const item = gallery[selected];
  const image = document.querySelector('#lightbox-image');
  image.src = item.href; image.alt = item.dataset.caption;
  document.querySelector('#lightbox-caption').textContent = item.dataset.caption;
  document.querySelector('#lightbox-original').href = item.href;
  document.querySelector('#lightbox-count').textContent = zh ? `第 ${selected + 1} 張，共 ${gallery.length} 張` : `Image ${selected + 1} of ${gallery.length}`;
  document.querySelector('[data-prev]').disabled = selected === 0;
  document.querySelector('[data-next]').disabled = selected === gallery.length - 1;
}
gallery.forEach((item, index) => item.addEventListener('click', event => {
  if (!dialog?.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault(); returnFocus = item; selected = index; updateImage();
  dialog.showModal(); document.body.classList.add('modal-open'); document.querySelector('[data-close]').focus();
}));
document.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
document.querySelector('[data-prev]')?.addEventListener('click', () => { if (selected > 0) { selected--; updateImage(); } });
document.querySelector('[data-next]')?.addEventListener('click', () => { if (selected < gallery.length - 1) { selected++; updateImage(); } });
dialog?.addEventListener('close', () => { document.body.classList.remove('modal-open'); returnFocus?.focus(); });
dialog?.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
dialog?.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' && selected > 0) { event.preventDefault(); selected--; updateImage(); }
  if (event.key === 'ArrowRight' && selected < gallery.length - 1) { event.preventDefault(); selected++; updateImage(); }
});
document.querySelector('[data-copy-email]')?.addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText('cai7392@gmail.com'); status.textContent = zh ? '已複製 Email。' : 'Email copied.'; }
  catch { status.textContent = zh ? '無法複製，請選取 Email 手動複製。' : 'Could not copy. Please select the email address and copy it manually.'; }
});
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', () => {
    if (img.id === 'lightbox-image') return;
    const notice = document.createElement('span'); notice.className='image-error';
    notice.textContent = (zh ? '圖片暫時無法載入。' : 'This image could not be loaded. ') + img.alt;
    img.replaceWith(notice);
  });
});
