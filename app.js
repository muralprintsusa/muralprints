(() => {
  const form = document.querySelector('#inquiry-form');
  const status = document.querySelector('#form-status');
  const fileInput = document.querySelector('#image-file');
  const fileName = document.querySelector('#file-name');
  const menu = document.querySelector('.menu-toggle');
  const dialog = document.querySelector('#video-dialog');
  const videoFrame = document.querySelector('#video-frame');
  const videoCaption = document.querySelector('#video-caption');

  if (document.querySelector('#year')) {
    document.querySelector('#year').textContent = new Date().getFullYear();
  }

  if (menu) {
    menu.addEventListener('click', () => {
      const nav = document.querySelector('.main-nav');
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.querySelector('.main-nav');
      if (nav) nav.classList.remove('open');
      if (menu) menu.setAttribute('aria-expanded', 'false');
    });
  });

  if (fileInput) {
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
  }

  const clips = {
    wall: { id: 'videos/Car.mp4', title: 'Wall printing — a new perspective' },
    floor: { id: 'videos/Floral.mp4', title: 'Floor printing — make every step count' },
    canvas: { id: 'videos/Horses.mp4', title: 'Canvas printing — art made personal' },
    custom: { id: 'videos/Spiderman.MP4', title: 'Custom printing — your image, your way' }
  };

  const openDialog = () => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', 'open');
    }
  };

  const closeDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    }
    dialog.removeAttribute('open');
    if (videoFrame) videoFrame.innerHTML = '';
  };

  document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', () => {
      const clip = clips[button.dataset.video];
      if (!clip || !videoFrame || !videoCaption) return;

      videoCaption.textContent = clip.title;

      if (clip.id.toLowerCase().endsWith('.mp4')) {
        videoFrame.innerHTML = `<video src="${clip.id}" controls autoplay playsinline></video>`;
      } else {
        videoFrame.innerHTML = '';
      }

      openDialog();
    });
  });

  if (document.querySelector('.dialog-close')) {
    document.querySelector('.dialog-close').addEventListener('click', closeDialog);
  }

  if (dialog) {
    dialog.addEventListener('click', e => {
      if (e.target === dialog) closeDialog();
    });
  }

  if (form) {
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
      if (submit) {
        submit.disabled = true;
        submit.innerHTML = 'Sending your idea…';
      }

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
        if (fileName) fileName.textContent = 'Add an image';
      } catch (error) {
        console.error('Inquiry submission failed:', error);
        status.textContent = 'We couldn’t send that just now. Please try again in a moment.';
        status.classList.add('error');
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.innerHTML = 'Send your idea <span>↗</span>';
        }
      }
    });
  }
})();
