(() => {
  const form = document.querySelector('#inquiry-form');
  const status = document.querySelector('#form-status');
  const fileInput = document.querySelector('#image-file');
  const fileName = document.querySelector('#file-name');
  const menu = document.querySelector('.menu-toggle');
  document.querySelector('#year').textContent = new Date().getFullYear();

  menu.addEventListener('click', () => {
    const nav = document.querySelector('.main-nav');
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
    document.querySelector('.main-nav').classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  }));
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      fileInput.value = '';
      fileName.textContent = 'File is larger than 10 MB';
      status.textContent = 'Please choose an image under 10 MB.';
      status.classList.add('error');
      return;
    }
    fileName.textContent = file ? file.name : 'Add an image';
    status.textContent = '';
    status.classList.remove('error');
  });

  const clips = {
    wall: { id: 'WALL_VIDEO_ID', title: 'Wall printing — a new perspective' },
    floor: { id: 'FLOOR_VIDEO_ID', title: 'Floor printing — make every step count' },
    canvas: { id: 'CANVAS_VIDEO_ID', title: 'Canvas printing — art made personal' },
    custom: { id: 'CUSTOM_VIDEO_ID', title: 'Custom printing — your image, your way' }
  };
  const dialog = document.querySelector('#video-dialog');
  document.querySelectorAll('.play-button').forEach(button => button.addEventListener('click', () => {
    const clip = clips[button.dataset.video];
    document.querySelector('#video-caption').textContent = clip.title;
    document.querySelector('#video-frame').innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${clip.id}?autoplay=1&rel=0" title="${clip.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    dialog.showModal();
  }));
  const closeDialog = () => { dialog.close(); document.querySelector('#video-frame').innerHTML = ''; };
  document.querySelector('.dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(); });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.classList.remove('error');
    const url = window.MURAL_SUPABASE_URL;
    const key = window.MURAL_SUPABASE_ANON_KEY;
    if (!url || !key || !window.supabase) {
      status.textContent = 'The inquiry form is ready. The studio is finishing its online inbox—please contact us directly for now.';
      status.classList.add('error');
      return;
    }
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.innerHTML = 'Sending your idea…';
    try {
      const client = window.supabase.createClient(url, key);
      const values = new FormData(form);
      const { error } = await client.from('inquiries').insert({
        name: values.get('name').trim(),
        phone: values.get('phone').trim(),
        email: values.get('email').trim(),
        requirements: values.get('requirements').trim()
      });
      if (error) throw error;
      status.textContent = 'Your idea is in our inbox. We’ll be in touch soon!';
      form.reset();
      fileName.textContent = 'Add an image';
    } catch (error) {
      console.error('Inquiry submission failed:', error);
      status.textContent = 'We couldn’t send that just now. Please try again in a moment.';
      status.classList.add('error');
    } finally {
      submit.disabled = false;
      submit.innerHTML = 'Send your idea <span>↗</span>';
    }
  });
})();
